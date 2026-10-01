import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useSpatialSpotlight } from '../../hooks/useSpatialSpotlight';
import { useToast } from '../../context/NotificationContext';
import analysisService from '../../services/analysisService';
import InstructorWrapper from './components/InstructorWrapper';
import AnalysisLoadingState from '../../components/instructor/AnalysisLoadingState';
import AnalysisPDFExporter from '../../components/instructor/AnalysisPDFExporter';
import CodeComparisonModal from '../../modals/instructor/CodeComparisonModal';
import { getPlagiarismDisplayData } from '../../utils/theme';
import { formatLanguageDisplay } from '../../utils/fileUtils';
import './InstructorBatchAuditView.css';

const InstructorBatchAuditView = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [theme] = useTheme();
    const pageRef = useRef(null);
    const handleMouseMove = useSpatialSpotlight(pageRef);

    const fileInputRef = useRef(null);
    const folderInputRef = useRef(null);
    const zipInputRef = useRef(null);

    const [language, setLanguage] = useState('python');
    const [stagedFiles, setStagedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Results State
    const [analysisResults, setAnalysisResults] = useState(null);
    const [analyzedFilesPayload, setAnalyzedFilesPayload] = useState([]);
    const [selectedComparisonPair, setSelectedComparisonPair] = useState(null);
    const [activeTab, setActiveTab] = useState('files'); // 'files' | 'report' | 'summary'

    // Smooth transition between analysis loading & results table
    const [displayPhase, setDisplayPhase] = useState('idle');
    const prevAnalyzingRef = useRef(isAnalyzing);

    useEffect(() => {
        if (isAnalyzing) {
            setDisplayPhase('analyzing');
        } else if (prevAnalyzingRef.current && !isAnalyzing && analysisResults) {
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

    // Filters & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [summaryFilter, setSummaryFilter] = useState('all');

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
        setSelectedComparisonPair(null);
        setActiveTab('files');
        setSearchTerm('');
        setFilterType('all');
        setSummaryFilter('all');
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

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const items = e.dataTransfer.items;
        if (items && items.length > 0 && items[0].webkitGetAsEntry) {
            const traverseFileTree = (item) => {
                return new Promise((resolve) => {
                    if (!item) return resolve([]);
                    if (item.isFile) {
                        item.file((file) => resolve([file]), () => resolve([]));
                    } else if (item.isDirectory) {
                        const dirReader = item.createReader();
                        const entries = [];
                        const readEntries = () => {
                            dirReader.readEntries(async (result) => {
                                if (!result || !result.length) {
                                    const filesNested = await Promise.all(entries.map(traverseFileTree));
                                    resolve(filesNested.flat());
                                } else {
                                    entries.push(...result);
                                    readEntries();
                                }
                            }, () => resolve([]));
                        };
                        readEntries();
                    } else {
                        resolve([]);
                    }
                });
            };

            try {
                const promises = [];
                for (let i = 0; i < items.length; i++) {
                    const entry = items[i].webkitGetAsEntry();
                    if (entry) {
                        promises.push(traverseFileTree(entry));
                    }
                }
                const nestedFiles = await Promise.all(promises);
                const allFiles = nestedFiles.flat();
                if (allFiles.length > 0) {
                    handleAddFiles(allFiles);
                    return;
                }
            } catch (err) {
                console.error("Folder drop traversal error:", err);
            }
        }

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleAddFiles(e.dataTransfer.files);
        }
    };

    const handleRunBatchAudit = async () => {
        if (stagedFiles.length < 2 && (!analysisResults || stagedFiles.length === 0)) {
            return toast.warning("Please upload at least 2 source files or a folder/ZIP.", "Insufficient Data");
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

    const handleOpenComparison = (pair) => {
        if (!pair) {
            toast.info("No comparative pair available for this file.", "Safe Submission");
            return;
        }
        setSelectedComparisonPair(pair);
    };

    // Filter staged files by search term
    const filteredStagedFiles = useMemo(() => {
        if (!searchTerm.trim()) return stagedFiles;
        const query = searchTerm.toLowerCase().trim();
        return stagedFiles.filter(f => f.name.toLowerCase().includes(query));
    }, [stagedFiles, searchTerm]);

    // Count of flagged pairs (Type 1, 2, 3)
    const flaggedPairsCount = useMemo(() => {
        if (!analysisResults) return 0;
        return analysisResults.filter(r => {
            const pt = r.plagiarism_type || '';
            return pt.includes('Type 1') || pt.includes('Type 2') || pt.includes('Type 3') || pt.includes('Exact') || pt.includes('Renamed') || pt.includes('Structure');
        }).length;
    }, [analysisResults]);

    // Filter Plagiarism Report by Search Term & Type Filter
    const filteredResults = useMemo(() => {
        if (!analysisResults) return [];
        let results = analysisResults;

        if (filterType !== 'all') {
            if (filterType === 'Safe') {
                results = results.filter(r => {
                    const pt = r.plagiarism_type || '';
                    return !pt || pt === 'N/A' || pt.toLowerCase().includes('safe') || pt.toLowerCase().includes('clean') || (r.score !== undefined && Number(r.score) < 40);
                });
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

    // =========================================================================
    // 📊 100% BATCH DISTRIBUTION & FILE RISK ROSTER COMPUTATION (Option 2B)
    // =========================================================================
    const batchDistribution = useMemo(() => {
        const fileList = (analyzedFilesPayload && analyzedFilesPayload.length > 0)
            ? analyzedFilesPayload
            : (stagedFiles && stagedFiles.length > 0)
            ? stagedFiles.map(f => ({ student_name: f.name, filename: f.name, id: f.name }))
            : [];

        if (fileList.length === 0) {
            return {
                total: 0,
                type1Count: 0,
                type2Count: 0,
                type3Count: 0,
                safeCount: 0,
                type1Pct: 0,
                type2Pct: 0,
                type3Pct: 0,
                safePct: 0,
                avgSimilarity: '0.0',
                plagiarizedTotal: 0,
                plagiarizedPct: 0,
                cleanPct: 0,
                fileRoster: []
            };
        }

        const total = fileList.length;
        const roster = [];

        let sumSim = 0;
        let simCount = 0;

        if (analysisResults && analysisResults.length > 0) {
            analysisResults.forEach(r => {
                if (r.score !== undefined && !isNaN(r.score)) {
                    sumSim += Number(r.score);
                    simCount++;
                }
            });
        }

        const avgSimilarity = simCount > 0 ? (sumSim / simCount).toFixed(1) : '0.0';

        let type1Count = 0;
        let type2Count = 0;
        let type3Count = 0;
        let safeCount = 0;

        fileList.forEach((fileItem, idx) => {
            const fname = (fileItem.filename || fileItem.name || '').toLowerCase().trim();

            let highestSeverity = 'Safe';
            let highestScore = 0;
            let topPair = null;
            let topMatchPeer = 'Clean (No Plagiarism)';

            if (analysisResults && analysisResults.length > 0) {
                analysisResults.forEach(pair => {
                    const f1 = (pair.file1 || '').toLowerCase();
                    const f2 = (pair.file2 || '').toLowerCase();

                    const matchesF1 = f1.includes(fname) || fname.includes(f1);
                    const matchesF2 = f2.includes(fname) || fname.includes(f2);

                    if (matchesF1 || matchesF2) {
                        const score = Number(pair.score || 0);
                        const pType = pair.plagiarism_type || '';
                        const otherFile = matchesF1 ? pair.file2 : pair.file1;

                        const isType1 = pType.includes('Type 1') || pType.includes('Type I') || pType.includes('Exact');
                        const isType2 = pType.includes('Type 2') || pType.includes('Type II') || pType.includes('Renamed');
                        const isType3 = pType.includes('Type 3') || pType.includes('Type III') || pType.includes('Structure');

                        if (isType1) {
                            if (highestSeverity !== 'Type 1' || score > highestScore || !topPair) {
                                highestSeverity = 'Type 1';
                                highestScore = score;
                                topPair = pair;
                                topMatchPeer = otherFile;
                            }
                        } else if (isType2 && highestSeverity !== 'Type 1') {
                            if (highestSeverity !== 'Type 2' || score > highestScore || !topPair) {
                                highestSeverity = 'Type 2';
                                highestScore = score;
                                topPair = pair;
                                topMatchPeer = otherFile;
                            }
                        } else if (isType3 && highestSeverity !== 'Type 1' && highestSeverity !== 'Type 2') {
                            if (highestSeverity !== 'Type 3' || score > highestScore || !topPair) {
                                highestSeverity = 'Type 3';
                                highestScore = score;
                                topPair = pair;
                                topMatchPeer = otherFile;
                            }
                        } else if (highestSeverity === 'Safe') {
                            if (score > highestScore || !topPair) {
                                highestScore = score;
                                topPair = pair;
                                topMatchPeer = otherFile;
                            }
                        }
                    }
                });
            }

            if (highestSeverity === 'Type 1') type1Count++;
            else if (highestSeverity === 'Type 2') type2Count++;
            else if (highestSeverity === 'Type 3') type3Count++;
            else safeCount++;

            roster.push({
                id: fileItem.id || `file-${idx}`,
                filename: fileItem.filename || fileItem.name,
                student_name: fileItem.student_name || fileItem.filename || fileItem.name,
                category: highestSeverity,
                highestScore: highestScore > 0 ? highestScore.toFixed(1) : '0.0',
                topMatchPeer,
                topPair
            });
        });

        // Exact Proportional Percentages
        const type1Pct = total > 0 ? Math.round((type1Count / total) * 100) : 0;
        const type2Pct = total > 0 ? Math.round((type2Count / total) * 100) : 0;
        const type3Pct = total > 0 ? Math.round((type3Count / total) * 100) : 0;
        const safePct = total > 0 ? Math.max(0, 100 - (type1Pct + type2Pct + type3Pct)) : 0;

        const plagiarizedTotal = type1Count + type2Count + type3Count;
        const plagiarizedPct = total > 0 ? Math.round((plagiarizedTotal / total) * 100) : 0;
        const cleanPct = total > 0 ? Math.max(0, 100 - plagiarizedPct) : 0;

        return {
            total,
            type1Count,
            type2Count,
            type3Count,
            safeCount,
            type1Pct,
            type2Pct,
            type3Pct,
            safePct,
            avgSimilarity,
            plagiarizedTotal,
            plagiarizedPct,
            cleanPct,
            fileRoster: roster
        };
    }, [analyzedFilesPayload, stagedFiles, analysisResults]);

    // Filter File Roster for Batch Summary tab
    const filteredRoster = useMemo(() => {
        let list = batchDistribution.fileRoster;

        if (summaryFilter !== 'all') {
            list = list.filter(r => r.category === summaryFilter);
        }

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase().trim();
            list = list.filter(r =>
                (r.filename && r.filename.toLowerCase().includes(q)) ||
                (r.student_name && r.student_name.toLowerCase().includes(q)) ||
                (r.category && r.category.toLowerCase().includes(q)) ||
                (r.topMatchPeer && r.topMatchPeer.toLowerCase().includes(q))
            );
        }

        return list;
    }, [batchDistribution.fileRoster, summaryFilter, searchTerm]);

    return (
        <InstructorWrapper>
            <div className={`instructor-audit-page ${theme}`} ref={pageRef} onMouseMove={handleMouseMove}>
                <div className="audit-page-container">

                    {/* --- TOP CINEMATIC BANNER --- */}
                    <header className="cinematic-banner-shared spatial-card fade-in-down audit-hero-banner">
                        <div className="header-inner">
                            <div className="top-meta">
                                <button
                                    type="button"
                                    onClick={() => navigate('/instructor')}
                                    className="neo-back-btn"
                                >
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Dashboard
                                </button>

                                <div className="audit-header-actions">
                                    {analysisResults && (
                                        <>
                                            <AnalysisPDFExporter
                                                results={analysisResults}
                                                assignmentTitle="Batch Plagiarism Audit Report"
                                            />
                                            <button
                                                type="button"
                                                className="batch-btn-reset"
                                                onClick={handleClearAll}
                                            >
                                                + New Batch
                                            </button>
                                        </>
                                    )}

                                    <button
                                        type="button"
                                        className={`btn-audit-hero-run ${showLoading ? 'is-analyzing' : ''} ${isCompleted ? 'is-completed' : ''}`}
                                        onClick={handleRunBatchAudit}
                                        disabled={showLoading || (stagedFiles.length < 2 && !analysisResults)}
                                    >
                                        {showLoading ? (
                                            <span className="btn-analyzing-content">
                                                {isCompleted ? (
                                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                ) : (
                                                    <span className="btn-spinner-ring"></span>
                                                )}
                                                <span>{isCompleted ? "Audit Complete" : "Running Algorithmic Audit..."}</span>
                                            </span>
                                        ) : (
                                            <span className="btn-run-content">
                                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{analysisResults ? "Re-run Plagiarism Analysis" : "Run Falsicode Analysis"}</span>
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="audit-hero-info">
                                <h1 className="hero-title">Batch Submissions & Plagiarism Audit</h1>
                                <p className="audit-hero-desc">
                                    Directly audit multiple source files, benchmark datasets, folders, or ZIP archives with AST Structural Tokenization, N-Grams, and TF-IDF similarity vectors.
                                </p>
                            </div>

                            <div className="stat-badges">
                                <div className="batch-lang-group" style={{ marginRight: '4px' }}>
                                    <select
                                        className="batch-hero-lang-select"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        disabled={isAnalyzing}
                                    >
                                        <option value="python">Python 3.x (.py)</option>
                                        <option value="java">Java (.java)</option>
                                        <option value="auto">Auto-Detect Extension</option>
                                    </select>
                                </div>

                                <span className="b-label lang-badge">
                                    Language: <strong>{formatLanguageDisplay(language)}</strong>
                                </span>
                                <span className="b-label">
                                    {stagedFiles.length} {stagedFiles.length === 1 ? 'File' : 'Files'} Staged
                                </span>
                                {analysisResults && (
                                    <span className={`b-label ${flaggedPairsCount > 0 ? 'status-alert' : 'status-clean'}`}>
                                        {analysisResults.length} Comparison Pairs Evaluated ({flaggedPairsCount > 0 ? `${flaggedPairsCount} Flagged` : '0 Flagged'})
                                    </span>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* 🌟 STICKY CONTROLS BAR (Segmented Tabs + Search & Filter Toolbar) */}
                    <div className="audit-sticky-controls-bar">
                        <div className="audit-page-tabs-bar">
                            <div className="audit-segmented-tabs">
                                <button
                                    type="button"
                                    className={`audit-tab-btn ${activeTab === 'files' ? 'active' : ''}`}
                                    onClick={() => { setActiveTab('files'); setSearchTerm(''); }}
                                >
                                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                                    </svg>
                                    <span>Staged Files</span>
                                    <span className="tab-badge-count">{stagedFiles.length}</span>
                                </button>

                                <button
                                    type="button"
                                    className={`audit-tab-btn ${activeTab === 'report' ? 'active' : ''}`}
                                    onClick={() => { setActiveTab('report'); setSearchTerm(''); }}
                                >
                                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                    </svg>
                                    <span>Plagiarism Report</span>
                                    {analysisResults && (
                                        <span className={`tab-badge-count ${flaggedPairsCount > 0 ? 'alert' : 'clean'}`}>
                                            {flaggedPairsCount > 0 ? flaggedPairsCount : '0'}
                                        </span>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className={`audit-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
                                    onClick={() => { setActiveTab('summary'); setSearchTerm(''); }}
                                >
                                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                                    </svg>
                                    <span>Batch Summary</span>
                                    {analysisResults && (
                                        <span className="tab-badge-count info">
                                            100%
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* 🔍 Search & Filter Toolbar */}
                        <div className="audit-search-toolbar">
                            <div className="audit-search-input-wrap">
                                <svg className="audit-search-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                <input
                                    type="text"
                                    className="audit-search-input"
                                    placeholder={
                                        activeTab === 'files'
                                            ? "Search staged files..."
                                            : activeTab === 'report'
                                            ? "Search filename or clone pair (e.g. heap_sort, dijkstra)..."
                                            : "Search file risk roster..."
                                    }
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        className="audit-search-clear"
                                        onClick={() => setSearchTerm('')}
                                        title="Clear search"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Filter Chips for Plagiarism Report Tab */}
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

                            {/* Filter Chips for Batch Summary Tab */}
                            {activeTab === 'summary' && analysisResults && !showLoading && (
                                <div className="audit-filter-chips chips-enter">
                                    {[
                                        { id: 'all', label: 'All Files' },
                                        { id: 'Type 1', label: `Type 1 (${batchDistribution.type1Count})` },
                                        { id: 'Type 2', label: `Type 2 (${batchDistribution.type2Count})` },
                                        { id: 'Type 3', label: `Type 3 (${batchDistribution.type3Count})` },
                                        { id: 'Safe', label: `Safe (${batchDistribution.safeCount})` }
                                    ].map(st => (
                                        <button
                                            key={st.id}
                                            type="button"
                                            className={`audit-chip-btn ${summaryFilter === st.id ? 'active' : ''}`}
                                            onClick={() => setSummaryFilter(st.id)}
                                        >
                                            {st.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- MAIN AUDIT WORKSPACE CARD --- */}
                    <main className="audit-workspace-card spatial-card">
                        <div className="audit-tab-body">

                            {/* =========================================================
                                TAB 1: FILE STAGING & UPLOAD
                                ========================================================= */}
                            {activeTab === 'files' && (
                                <div className="batch-tab-files-wrap">
                                    <div
                                        className={`batch-page-dropzone ${isDragging ? 'dragging' : ''}`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <div className="dropzone-icon-wrap" style={{ width: '56px', height: '56px', marginBottom: '14px' }}>
                                            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                            </svg>
                                        </div>
                                        <div className="dropzone-title" style={{ fontSize: '1.15rem' }}>
                                            Drag and drop code files, an entire folder, or a ZIP archive here
                                        </div>
                                        <div className="dropzone-sub" style={{ fontSize: '0.9rem', marginBottom: '18px' }}>
                                            Supports Python (.py), Java (.java), or .zip archives with multiple submissions
                                        </div>

                                        <div className="dropzone-btn-group" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                type="button"
                                                className="btn-dropzone-action"
                                                onClick={() => fileInputRef.current?.click()}
                                                style={{ padding: '9px 18px', fontSize: '0.88rem' }}
                                            >
                                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                                Select Files
                                            </button>

                                            <button
                                                type="button"
                                                className="btn-dropzone-action"
                                                onClick={() => folderInputRef.current?.click()}
                                                title="Click to open folder chooser, select your folder, and confirm 'Upload' at the bottom-right of the dialog window."
                                                style={{ padding: '9px 18px', fontSize: '0.88rem' }}
                                            >
                                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                                                </svg>
                                                Select Folder
                                            </button>

                                            <button
                                                type="button"
                                                className="btn-dropzone-action"
                                                onClick={() => zipInputRef.current?.click()}
                                                title="Upload a .zip file containing student code submissions."
                                                style={{ padding: '9px 18px', fontSize: '0.88rem' }}
                                            >
                                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                                                </svg>
                                                Upload ZIP Archive
                                            </button>
                                        </div>

                                        {/* Clear Folder Instructions Guide */}
                                        <div className="dropzone-helper-guide" onClick={(e) => e.stopPropagation()} style={{ marginTop: '18px' }}>
                                            <span className="guide-badge">Folder Upload</span>
                                            <span>In the file dialog, open/select your folder and click <strong>"Upload"</strong> in the bottom-right corner — or simply <strong>drag & drop your folder directly</strong> into this box!</span>
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
                                        <div className="batch-page-staged-container">
                                            <div className="staged-header">
                                                <h4 style={{ fontSize: '0.95rem' }}>
                                                    Staged Items for Batch Engine
                                                    <span className="staged-count-badge">{filteredStagedFiles.length} of {stagedFiles.length} file(s)</span>
                                                </h4>
                                                <button type="button" className="btn-clear-staged" onClick={handleClearAll}>
                                                    Clear All
                                                </button>
                                            </div>

                                            <div className="staged-list-scroll" style={{ maxHeight: '380px' }}>
                                                {filteredStagedFiles.map((f, index) => (
                                                    <div key={index} className="staged-file-item" style={{ padding: '10px 14px' }}>
                                                        <div className="staged-file-left">
                                                            <div className="staged-file-icon">
                                                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <div className="staged-file-name" style={{ fontSize: '0.88rem' }}>{f.name}</div>
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

                            {/* =========================================================
                                TAB 2: PLAGIARISM REPORT (PAIR MATRIX)
                                ========================================================= */}
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
                                                        <th className="th-actions">FORENSIC ACTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredResults.map((result, idx) => {
                                                        const { badgeClass, label } = getPlagiarismDisplayData(result.plagiarism_type);
                                                        return (
                                                            <tr
                                                                key={idx}
                                                                className="clickable-row"
                                                                onClick={() => handleOpenComparison(result)}
                                                                title="Click to launch comparative code analysis modal"
                                                            >
                                                                <td>
                                                                    <div className="pair-wrap">
                                                                        <span className="pair-file">{result.file1}</span>
                                                                        <span className="pair-vs">vs</span>
                                                                        <span className="pair-file">{result.file2}</span>
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
                                                                <td className="td-action">
                                                                    <button
                                                                        type="button"
                                                                        className="btn-inspect-pair"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleOpenComparison(result);
                                                                        }}
                                                                    >
                                                                        <span>Compare Code</span>
                                                                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                                                        </svg>
                                                                    </button>
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
                                            <p>Upload at least 2 source files or an entire folder above and click "Run Falsicode Analysis" to execute AST + N-Grams + TF-IDF algorithmic comparison.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* =========================================================
                                TAB 3: BATCH SUMMARY REPORT (100% PROPORTIONAL DISTRIBUTION)
                                ========================================================= */}
                            {activeTab === 'summary' && (
                                <div className="class-summary-section tab-view">
                                    <div className="report-header">
                                        <div className="report-header-info">
                                            <h3>Batch Plagiarism & Integrity Summary</h3>
                                            <p className="report-header-sub">
                                                100% File Distribution Breakdown across Exact, Renamed, Structural & Safe submissions
                                            </p>
                                        </div>
                                        {analysisResults && !showLoading && (
                                            <div className="summary-distribution-badge">
                                                {batchDistribution.total} Total Files (100%)
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
                                    ) : analysisResults ? (
                                        <div className="class-summary-content-scroll">
                                            {/* Top 4 KPI Metrics Grid */}
                                            <div className="summary-stats-grid">
                                                <div className="summary-stat-card">
                                                    <div className="stat-icon-wrap total">
                                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                                        </svg>
                                                    </div>
                                                    <div className="stat-text-wrap">
                                                        <span className="stat-label">Total Files</span>
                                                        <strong className="stat-value">{batchDistribution.total}</strong>
                                                        <span className="stat-subtext">Active batch uploads</span>
                                                    </div>
                                                </div>

                                                <div className="summary-stat-card">
                                                    <div className="stat-icon-wrap plagiarized">
                                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                                        </svg>
                                                    </div>
                                                    <div className="stat-text-wrap">
                                                        <span className="stat-label">Flagged / Plagiarized</span>
                                                        <strong className="stat-value text-red">
                                                            {batchDistribution.plagiarizedTotal} <span className="stat-pct">({batchDistribution.plagiarizedPct}%)</span>
                                                        </strong>
                                                        <span className="stat-subtext">Type 1, 2, or 3 clones</span>
                                                    </div>
                                                </div>

                                                <div className="summary-stat-card">
                                                    <div className="stat-icon-wrap clean">
                                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                    </div>
                                                    <div className="stat-text-wrap">
                                                        <span className="stat-label">Safe & Original</span>
                                                        <strong className="stat-value text-green">
                                                            {batchDistribution.safeCount} <span className="stat-pct">({batchDistribution.safePct}%)</span>
                                                        </strong>
                                                        <span className="stat-subtext">No clone patterns detected</span>
                                                    </div>
                                                </div>

                                                <div className="summary-stat-card">
                                                    <div className="stat-icon-wrap similarity">
                                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                                        </svg>
                                                    </div>
                                                    <div className="stat-text-wrap">
                                                        <span className="stat-label">Batch Avg Similarity</span>
                                                        <strong className="stat-value text-blue">{batchDistribution.avgSimilarity}%</strong>
                                                        <span className="stat-subtext">Across all comparative pairs</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 🌟 100% Proportional Multi-Segment Progress Bar */}
                                            <div className="distribution-bar-card">
                                                <div className="distribution-bar-header">
                                                    <div>
                                                        <h4 className="distribution-bar-title">Batch Risk Distribution</h4>
                                                        <p className="distribution-bar-sub">100% of batch files categorized by highest detected clone severity</p>
                                                    </div>
                                                    <span className="distribution-sum-tag">SUM: 100%</span>
                                                </div>

                                                <div className="distribution-progress-track">
                                                    {batchDistribution.type1Pct > 0 && (
                                                        <div
                                                            className="distribution-segment seg-type1"
                                                            style={{ width: `${batchDistribution.type1Pct}%` }}
                                                            title={`Type 1: Exact Clones — ${batchDistribution.type1Count} file(s) (${batchDistribution.type1Pct}%)`}
                                                        >
                                                            {batchDistribution.type1Pct >= 10 && (
                                                                <span className="segment-label">T1: {batchDistribution.type1Pct}%</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {batchDistribution.type2Pct > 0 && (
                                                        <div
                                                            className="distribution-segment seg-type2"
                                                            style={{ width: `${batchDistribution.type2Pct}%` }}
                                                            title={`Type 2: Renamed / Parameterized — ${batchDistribution.type2Count} file(s) (${batchDistribution.type2Pct}%)`}
                                                        >
                                                            {batchDistribution.type2Pct >= 10 && (
                                                                <span className="segment-label">T2: {batchDistribution.type2Pct}%</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {batchDistribution.type3Pct > 0 && (
                                                        <div
                                                            className="distribution-segment seg-type3"
                                                            style={{ width: `${batchDistribution.type3Pct}%` }}
                                                            title={`Type 3: Structural Reordering — ${batchDistribution.type3Count} file(s) (${batchDistribution.type3Pct}%)`}
                                                        >
                                                            {batchDistribution.type3Pct >= 10 && (
                                                                <span className="segment-label">T3: {batchDistribution.type3Pct}%</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {batchDistribution.safePct > 0 && (
                                                        <div
                                                            className="distribution-segment seg-safe"
                                                            style={{ width: `${batchDistribution.safePct}%` }}
                                                            title={`Safe / Clean — ${batchDistribution.safeCount} file(s) (${batchDistribution.safePct}%)`}
                                                        >
                                                            {batchDistribution.safePct >= 10 && (
                                                                <span className="segment-label">Safe: {batchDistribution.safePct}%</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* 4-Column Legend Cards */}
                                                <div className="distribution-legend-grid">
                                                    <div className="legend-card legend-type1">
                                                        <div className="legend-dot dot-type1"></div>
                                                        <div className="legend-body">
                                                            <div className="legend-top">
                                                                <strong>Type 1: Exact</strong>
                                                                <span className="legend-count">{batchDistribution.type1Count} ({batchDistribution.type1Pct}%)</span>
                                                            </div>
                                                            <span className="legend-def">Verbatim copy & paste</span>
                                                        </div>
                                                    </div>

                                                    <div className="legend-card legend-type2">
                                                        <div className="legend-dot dot-type2"></div>
                                                        <div className="legend-body">
                                                            <div className="legend-top">
                                                                <strong>Type 2: Renamed</strong>
                                                                <span className="legend-count">{batchDistribution.type2Count} ({batchDistribution.type2Pct}%)</span>
                                                            </div>
                                                            <span className="legend-def">Renamed identifiers & variables</span>
                                                        </div>
                                                    </div>

                                                    <div className="legend-card legend-type3">
                                                        <div className="legend-dot dot-type3"></div>
                                                        <div className="legend-body">
                                                            <div className="legend-top">
                                                                <strong>Type 3: Structure</strong>
                                                                <span className="legend-count">{batchDistribution.type3Count} ({batchDistribution.type3Pct}%)</span>
                                                            </div>
                                                            <span className="legend-def">Reordered logic & statement flow</span>
                                                        </div>
                                                    </div>

                                                    <div className="legend-card legend-safe">
                                                        <div className="legend-dot dot-safe"></div>
                                                        <div className="legend-body">
                                                            <div className="legend-top">
                                                                <strong>Safe / Clean</strong>
                                                                <span className="legend-count">{batchDistribution.safeCount} ({batchDistribution.safePct}%)</span>
                                                            </div>
                                                            <span className="legend-def">Original implementation</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* File Risk Classification Roster Table */}
                                            <div className="student-roster-section">
                                                <div className="roster-header-row">
                                                    <h4>File Risk Classification Roster</h4>
                                                    <span className="roster-count-tag">
                                                        Showing {filteredRoster.length} of {batchDistribution.total} files
                                                    </span>
                                                </div>

                                                <div className="table-responsive-wrapper">
                                                    <table className="falsicode-table-hud hoverable-table">
                                                        <thead>
                                                            <tr>
                                                                <th>SOURCE FILE</th>
                                                                <th>RISK CLASSIFICATION</th>
                                                                <th>SIMILARITY SCORE</th>
                                                                <th>TOP PEER MATCH</th>
                                                                <th className="th-actions">FORENSIC ACTION</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredRoster.length > 0 ? (
                                                                filteredRoster.map(fileItem => {
                                                                    const { badgeClass, label } = getPlagiarismDisplayData(fileItem.category);
                                                                    const numScore = Number(fileItem.highestScore || 0);

                                                                    return (
                                                                        <tr
                                                                            key={fileItem.id}
                                                                            className={fileItem.topPair ? "clickable-row" : ""}
                                                                            onClick={() => {
                                                                                if (fileItem.topPair) handleOpenComparison(fileItem.topPair);
                                                                            }}
                                                                            title={fileItem.topPair ? "Click to launch comparative code analysis modal" : undefined}
                                                                        >
                                                                            <td className="td-file">
                                                                                <code className="code-box">{fileItem.filename}</code>
                                                                            </td>
                                                                            <td>
                                                                                <span className={`badge-pill ${badgeClass}`}>
                                                                                    {label}
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                <div className="score-wrap">
                                                                                    <div className="score-meter-mini">
                                                                                        <div
                                                                                            className="score-fill-mini"
                                                                                            style={{
                                                                                                width: `${Math.min(100, Math.max(0, numScore))}%`,
                                                                                                background: numScore > 70 ? 'var(--status-red)' : numScore > 40 ? 'var(--status-yellow)' : 'var(--status-green)'
                                                                                            }}
                                                                                        ></div>
                                                                                    </div>
                                                                                    <strong>{fileItem.highestScore}%</strong>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <span className="roster-match-peer" title={fileItem.topMatchPeer}>
                                                                                    {fileItem.topMatchPeer}
                                                                                </span>
                                                                            </td>
                                                                            <td className="td-action">
                                                                                {fileItem.topPair ? (
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn-inspect-pair"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleOpenComparison(fileItem.topPair);
                                                                                        }}
                                                                                    >
                                                                                        <span>Compare Code</span>
                                                                                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                                                                        </svg>
                                                                                    </button>
                                                                                ) : (
                                                                                    <span className="clean-safe-tag">Safe / Clean</span>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="5" className="empty-search-cell">
                                                                        <div className="empty-search-box">
                                                                            <strong>No files matched the filter</strong>
                                                                            <p>No file records found under "{summaryFilter}" matching "{searchTerm}".</p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="empty-search-box report-empty">
                                            <div className="report-empty-icon">
                                                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                                                </svg>
                                            </div>
                                            <h4>No Batch Distribution Generated Yet</h4>
                                            <p>Upload at least 2 source files or an entire folder above and click "Run Falsicode Analysis" to calculate the 100% batch distribution.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </main>

                </div>

                {/* 🌟 COMPARATIVE CODE ANALYSIS MODAL */}
                <CodeComparisonModal
                    isOpen={!!selectedComparisonPair}
                    onClose={() => setSelectedComparisonPair(null)}
                    selectedPair={selectedComparisonPair}
                    submissions={analyzedFilesPayload}
                    allPairs={analysisResults || []}
                    onSelectPair={(newPair) => setSelectedComparisonPair(newPair)}
                />
            </div>
        </InstructorWrapper>
    );
};

export default InstructorBatchAuditView;
