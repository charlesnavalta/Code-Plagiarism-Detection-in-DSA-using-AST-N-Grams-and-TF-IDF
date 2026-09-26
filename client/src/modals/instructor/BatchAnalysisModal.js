import React, { useState, useMemo, useRef, useEffect } from 'react';
import BaseModal from '../shared/BaseModal';
import CodeComparisonView from '../../components/instructor/CodeComparisonView';
import AnalysisPDFExporter from '../../components/instructor/AnalysisPDFExporter';
import AnalysisLoadingState from '../../components/instructor/AnalysisLoadingState';
import analysisService from '../../services/analysisService';
import { useToast } from '../../context/NotificationContext';
import { getPlagiarismDisplayData } from '../../utils/theme';
import './SubmissionsAuditModal.css';
import './BatchAnalysisModal.css';

const BatchAnalysisModal = ({ isOpen, onClose, defaultLanguage = 'python' }) => {
    const toast = useToast();
    const fileInputRef = useRef(null);
    const folderInputRef = useRef(null);
    const zipInputRef = useRef(null);

    const [language, setLanguage] = useState(defaultLanguage);
    const [stagedFiles, setStagedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Results State
    const [analysisResults, setAnalysisResults] = useState(null);
    const [analyzedFilesPayload, setAnalyzedFilesPayload] = useState([]);
    const [selectedPair, setSelectedPair] = useState(null);
    const [activeTab, setActiveTab] = useState('files'); // 'files' | 'report'

    // --- Smooth Transition Lifecycle Between Loading State & Results Table ---
    // 'idle' | 'analyzing' | 'completing' | 'fading' | 'ready'
    const [displayPhase, setDisplayPhase] = useState('idle');
    const prevAnalyzingRef = useRef(isAnalyzing);

    useEffect(() => {
        if (isAnalyzing) {
            setDisplayPhase('analyzing');
        } else if (prevAnalyzingRef.current && !isAnalyzing && analysisResults) {
            // Just finished analyzing! Show 100% completion celebration, then crossfade to table
            setDisplayPhase('completing');
            const timer1 = setTimeout(() => {
                setDisplayPhase('fading');
            }, 600);
            const timer2 = setTimeout(() => {
                setDisplayPhase('ready');
            }, 900);
            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        } else if (!isAnalyzing && analysisResults) {
            setDisplayPhase('ready');
        } else {
            setDisplayPhase('idle');
        }
        prevAnalyzingRef.current = isAnalyzing;
    }, [isAnalyzing, analysisResults]);

    const showLoading = displayPhase === 'analyzing' || displayPhase === 'completing' || displayPhase === 'fading';
    const isCompleted = displayPhase === 'completing' || displayPhase === 'fading';
    const isExiting = displayPhase === 'fading';

    // Filter & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const handleAddFiles = (filesToAdd) => {
        const validExtensions = ['.py', '.java', '.zip'];
        const newFiles = [];

        Array.from(filesToAdd).forEach(file => {
            const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            if (validExtensions.includes(ext)) {
                const exists = stagedFiles.some(f => f.name === file.name && f.size === file.size);
                if (!exists) {
                    newFiles.push(file);
                }
            }
        });

        if (newFiles.length === 0 && filesToAdd.length > 0) {
            toast.warning("Only .py, .java, or .zip files are supported.", "Unsupported File Type");
            return;
        }

        setStagedFiles(prev => [...prev, ...newFiles]);
        if (newFiles.length > 0) {
            toast.info(`Added ${newFiles.length} file(s) to batch queue.`, "Files Staged");
        }
    };

    const handleRemoveFile = (index) => {
        setStagedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleClearAll = () => {
        setStagedFiles([]);
        setAnalysisResults(null);
        setAnalyzedFilesPayload([]);
        setSelectedPair(null);
        setActiveTab('files');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleAddFiles(e.dataTransfer.files);
        }
    };

    const handleRunBatchAudit = async () => {
        if (stagedFiles.length === 0) {
            return toast.warning("Please upload at least 2 source files or a folder/ZIP.", "No Files Staged");
        }

        setIsAnalyzing(true);
        setActiveTab('report');
        toast.info("Extracting AST Tokens, N-Grams & computing TF-IDF similarity vectors...", "Audit Started");

        try {
            const formData = new FormData();
            formData.append('language', language);
            stagedFiles.forEach(file => {
                formData.append('files', file);
            });

            const data = await analysisService.runBatchAnalysis(formData);

            setAnalysisResults(data.results || []);
            setAnalyzedFilesPayload(data.files_payload || []);
            toast.success(`Successfully audited ${data.files_analyzed} files across ${data.matches_found} comparison pairs!`, "Batch Audit Complete");
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message || "Failed to execute batch audit.";
            toast.error(errorMsg, "Engine Error");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Filter staged files by search term
    const filteredStagedFiles = useMemo(() => {
        if (!searchTerm.trim()) return stagedFiles;
        const query = searchTerm.toLowerCase().trim();
        return stagedFiles.filter(f => f.name.toLowerCase().includes(query));
    }, [stagedFiles, searchTerm]);

    // Filter results
    const filteredResults = useMemo(() => {
        if (!analysisResults) return [];
        let results = analysisResults;

        if (filterType !== 'all') {
            if (filterType === 'Safe') {
                results = results.filter(r =>
                    !r.plagiarism_type ||
                    r.plagiarism_type === 'N/A' ||
                    r.plagiarism_type.toLowerCase().includes('safe') ||
                    r.plagiarism_type.toLowerCase().includes('clean') ||
                    (r.score !== undefined && Number(r.score) < 40)
                );
            } else {
                results = results.filter(r => r.plagiarism_type && r.plagiarism_type.includes(filterType));
            }
        }

        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase().trim();
            results = results.filter(r =>
                (r.file1 && r.file1.toLowerCase().includes(query)) ||
                (r.file2 && r.file2.toLowerCase().includes(query)) ||
                (r.plagiarism_type && r.plagiarism_type.toLowerCase().includes(query)) ||
                String(r.score).includes(query)
            );
        }

        return results;
    }, [analysisResults, searchTerm, filterType]);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={selectedPair ? "Code Comparison" : "Batch Plagiarism Audit"}
            subtitle={selectedPair 
                ? `Detailed logic analysis between ${selectedPair.file1} and ${selectedPair.file2}`
                : "Multi-file, entire folder, and ZIP archive batch plagiarism analysis"
            }
            customClass="wide-hud batch-modal-hud"
        >
            {!selectedPair && (
                <>
                    {/* Control Bar: Language & PDF Export */}
                    <div className="batch-control-bar">
                        <div className="batch-lang-group">
                            <span className="batch-lang-label">Analysis Language:</span>
                            <select
                                className="batch-lang-select"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                disabled={isAnalyzing}
                            >
                                <option value="python">Python 3.x (.py)</option>
                                <option value="java">Java (.java)</option>
                                <option value="auto">Auto-Detect Extension</option>
                            </select>
                        </div>

                        {analysisResults && (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <AnalysisPDFExporter
                                    results={analysisResults}
                                    assignmentTitle="Batch Plagiarism Audit Report"
                                />
                                <button
                                    type="button"
                                    className="batch-btn-reset"
                                    onClick={handleClearAll}
                                >
                                    + New Batch Audit
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Segmented Navigation Tabs */}
                    <div className="audit-segmented-tabs">
                        <button
                            className={`audit-tab-btn ${activeTab === 'files' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('files'); setSearchTerm(''); }}
                            type="button"
                        >
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                            </svg>
                            <span>Staged Files</span>
                            <span className="tab-badge-count">{stagedFiles.length}</span>
                        </button>

                        <button
                            className={`audit-tab-btn ${activeTab === 'report' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('report'); setSearchTerm(''); }}
                            type="button"
                        >
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                            <span>Plagiarism Report</span>
                            {analysisResults && (
                                <span className={`tab-badge-count ${analysisResults.length > 0 ? 'alert' : 'clean'}`}>
                                    {analysisResults.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Search & Filter Toolbar */}
                    <div className="audit-search-toolbar">
                        <div className="audit-search-input-wrap">
                            <svg className="audit-search-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <input
                                type="text"
                                className="audit-search-input"
                                placeholder={activeTab === 'files' ? "Search staged files..." : "Search student, filename, or clone pair..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    className="audit-search-clear"
                                    onClick={() => setSearchTerm('')}
                                    type="button"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {activeTab === 'report' && analysisResults && !showLoading && (
                            <div className="audit-filter-chips chips-enter">
                                {[
                                    { id: 'all', label: 'All Pairs' },
                                    { id: 'Type 1', label: 'Type 1: Exact' },
                                    { id: 'Type 2', label: 'Type 2: Renamed' },
                                    { id: 'Type 3', label: 'Type 3: Structure' },
                                    { id: 'Safe', label: 'Safe (Green)' }
                                ].map(ft => (
                                    <button
                                        key={ft.id}
                                        type="button"
                                        className={`audit-chip-btn ${filterType === ft.id ? 'active' : ''}`}
                                        onClick={() => setFilterType(ft.id)}
                                    >
                                        {ft.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Scrollable HUD Modal Body */}
            <div className="hud-modal-body audit-body-override batch-modal-body-scroll">
                {!selectedPair ? (
                    <>
                        {/* TAB 1: FILE STAGING & UPLOAD */}
                        {activeTab === 'files' && (
                            <div className="batch-tab-files-wrap">
                                <div
                                    className={`batch-dropzone ${isDragging ? 'dragging' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="dropzone-icon-wrap">
                                        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                    </div>
                                    <div className="dropzone-title">Drag and drop code files, an entire folder, or a ZIP archive here</div>
                                    <div className="dropzone-sub">Supports Python (.py), Java (.java), or .zip archives with multiple submissions</div>

                                    <div className="dropzone-btn-group" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            type="button"
                                            className="btn-dropzone-action"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                            </svg>
                                            Select Files
                                        </button>

                                        <button
                                            type="button"
                                            className="btn-dropzone-action"
                                            onClick={() => folderInputRef.current?.click()}
                                        >
                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                                            </svg>
                                            Upload Entire Folder
                                        </button>

                                        <button
                                            type="button"
                                            className="btn-dropzone-action"
                                            onClick={() => zipInputRef.current?.click()}
                                        >
                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                                            </svg>
                                            Upload ZIP Archive
                                        </button>
                                    </div>

                                    {/* Hidden HTML file inputs */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept=".py,.java,.zip"
                                        style={{ display: 'none' }}
                                        onChange={(e) => { handleAddFiles(e.target.files); e.target.value = null; }}
                                    />
                                    <input
                                        ref={folderInputRef}
                                        type="file"
                                        multiple
                                        webkitdirectory=""
                                        directory=""
                                        style={{ display: 'none' }}
                                        onChange={(e) => { handleAddFiles(e.target.files); e.target.value = null; }}
                                    />
                                    <input
                                        ref={zipInputRef}
                                        type="file"
                                        accept=".zip"
                                        style={{ display: 'none' }}
                                        onChange={(e) => { handleAddFiles(e.target.files); e.target.value = null; }}
                                    />
                                </div>

                                {/* Staged files container */}
                                {stagedFiles.length > 0 && (
                                    <div className="staged-files-section">
                                        <div className="staged-header">
                                            <h4>
                                                Staged Items for Batch Engine
                                                <span className="staged-count-badge">{filteredStagedFiles.length} of {stagedFiles.length} file(s)</span>
                                            </h4>
                                            <button type="button" className="btn-clear-staged" onClick={handleClearAll}>
                                                Clear All
                                            </button>
                                        </div>

                                        <div className="staged-list-scroll">
                                            {filteredStagedFiles.map((f, index) => (
                                                <div key={index} className="staged-file-item">
                                                    <div className="staged-file-left">
                                                        <div className="staged-file-icon">
                                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="staged-file-name">{f.name}</div>
                                                            <div className="staged-file-size">{formatFileSize(f.size)}</div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn-remove-file"
                                                        onClick={() => handleRemoveFile(index)}
                                                        title="Remove from batch"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: PLAGIARISM REPORT (IDENTICAL TO SubmissionsAuditModal) */}
                        {activeTab === 'report' && (
                            <div className="analysis-report-section tab-view">
                                <div className="report-header">
                                    <div className="report-header-info">
                                        <h3>Plagiarism Similarity Matrix</h3>
                                        <p className="report-header-sub">Algorithm: AST Structural Tokenization + N-Gram Analysis + TF-IDF</p>
                                    </div>
                                    {analysisResults && !showLoading && (
                                        <div className="scan-badge badge-enter">
                                            Analysis Active
                                        </div>
                                    )}
                                </div>

                                {showLoading ? (
                                    <AnalysisLoadingState 
                                        submissionCount={stagedFiles.length} 
                                        isBatch={true} 
                                        language={language}
                                        isCompleted={isCompleted}
                                        isExiting={isExiting}
                                        matchesFound={analysisResults ? analysisResults.length : null}
                                    />
                                ) : filteredResults.length > 0 ? (
                                    <div className="table-responsive-wrapper results-table-enter">
                                        <table className="falsicode-table-hud hoverable-table">
                                            <thead>
                                                <tr>
                                                    <th>COMPARISON PAIR</th>
                                                    <th>SIMILARITY SCORE</th>
                                                    <th>PLAGIARISM CLASSIFICATION</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredResults.map((result, idx) => {
                                                    const { badgeClass, label } = getPlagiarismDisplayData(result.plagiarism_type);
                                                    return (
                                                        <tr
                                                            key={idx}
                                                            className="clickable-row"
                                                            onClick={() => setSelectedPair(result)}
                                                        >
                                                            <td>
                                                                <div className="pair-wrap">
                                                                    <span>{result.file1}</span>
                                                                    <span className="pair-vs">vs</span>
                                                                    <span>{result.file2}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="score-wrap">
                                                                    <div className="score-meter-mini">
                                                                        <div
                                                                            className="score-fill-mini"
                                                                            style={{
                                                                                width: `${Math.min(100, Math.max(0, result.score))}%`,
                                                                                background: result.score > 70 ? 'var(--status-red)' : result.score > 40 ? 'var(--status-yellow)' : 'var(--status-green)'
                                                                            }}
                                                                        ></div>
                                                                    </div>
                                                                    <strong>{result.score}%</strong>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className={`badge-pill ${badgeClass}`}>
                                                                    {label}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : analysisResults ? (
                                    <div className="empty-search-box report-empty clean-audit-box">
                                        <div className="report-empty-icon clean-icon-circle">
                                            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                        <h4 className="clean-audit-title">No {filterType !== 'all' ? `${filterType} Clones` : 'Matching Pairs'} Detected</h4>
                                        <p className="clean-audit-subtext">
                                            {searchTerm 
                                                ? `No batch comparison pairs matched your search query "${searchTerm}".`
                                                : `None of the audited files were categorized under "${filterType}". All comparison pairs in this category passed structural evaluation.`}
                                        </p>
                                        <span className="clean-audit-pill">PASS · 0 FLAGGED PAIRS</span>
                                    </div>
                                ) : (
                                    <div className="empty-search-box report-empty">
                                        <div className="report-empty-icon">
                                            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                            </svg>
                                        </div>
                                        <h4>No Plagiarism Scan Generated Yet</h4>
                                        <p>Run the analysis engine to cross-check all submitted files using AST + N-Grams + TF-IDF algorithms.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <CodeComparisonView
                        selectedPair={selectedPair}
                        submissions={analyzedFilesPayload}
                        onBack={() => setSelectedPair(null)}
                    />
                )}
            </div>

            {/* Pinned Modal Footer */}
            {!selectedPair && (
                <div className="hud-modal-footer">
                    <button
                        className={`btn-hud-run ${showLoading ? 'is-analyzing' : ''} ${isCompleted ? 'is-completed' : ''}`}
                        onClick={handleRunBatchAudit}
                        disabled={showLoading || stagedFiles.length < 2}
                    >
                        {showLoading ? (
                            <span className="btn-analyzing-content">
                                {isCompleted ? (
                                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                ) : (
                                    <span className="btn-spinner-ring"></span>
                                )}
                                <span>{isCompleted ? "Audit Complete" : "Running Algorithmic Audit..."}</span>
                            </span>
                        ) : (
                            analysisResults ? "Re-run Plagiarism Analysis" : "Run Falsicode Analysis"
                        )}
                    </button>
                </div>
            )}
        </BaseModal>
    );
};

export default BatchAnalysisModal;
