import React, { useState, useMemo } from 'react';
import api from '../../services/api'; 
import { useToast } from '../../context/NotificationContext';
import CodeComparisonView from '../../components/instructor/CodeComparisonView'; 
import './SubmissionsAuditModal.css'; 
import { getPlagiarismDisplayData } from '../../utils/theme';
import ModalSkeleton from '../shared/ModalSkeleton';

// 🌟 Import the Base Skeleton
import BaseModal from '../shared/BaseModal';

const SubmissionsAuditModal = ({ isOpen, onClose, submissions = [], analysisResults, isAnalyzing, onRunAnalysis, classroomId, assignmentId }) => {
    const [selectedPair, setSelectedPair] = useState(null);
    const [activeTab, setActiveTab] = useState('submissions'); // 'submissions' | 'report'
    const [gradeInputs, setGradeInputs] = useState({}); 
    const [unlockedIds, setUnlockedIds] = useState([]); // Tracks instantly unlocked submissions
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const toast = useToast();

    // Filter Submissions by Search Term
    const filteredSubmissions = useMemo(() => {
        if (!searchTerm.trim()) return submissions;
        const query = searchTerm.toLowerCase().trim();
        return submissions.filter(sub => 
            (sub.student_name && sub.student_name.toLowerCase().includes(query)) ||
            (sub.filename && sub.filename.toLowerCase().includes(query)) ||
            (sub.score && String(sub.score).toLowerCase().includes(query))
        );
    }, [submissions, searchTerm]);

    // Filter Plagiarism Report by Search Term & Type Filter
    const filteredResults = useMemo(() => {
        if (!analysisResults) return [];
        let results = analysisResults;

        if (filterType !== 'all') {
            results = results.filter(r => r.plagiarism_type && r.plagiarism_type.includes(filterType));
        }

        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase().trim();
            results = results.filter(r => 
                (r.file1 && r.file1.toLowerCase().includes(query)) ||
                (r.file2 && r.file2.toLowerCase().includes(query)) ||
                (r.plagiarism_type && r.plagiarism_type.toLowerCase().includes(query)) ||
                (String(r.score).includes(query))
            );
        }

        return results;
    }, [analysisResults, searchTerm, filterType]);

    if (!isOpen) {
        if (selectedPair) setSelectedPair(null);
        return null;
    }

    const handleSaveGrade = async (submissionId) => {
        const scoreToSave = gradeInputs[submissionId];
        if (!scoreToSave) return toast.warning("Please enter a valid grade or score first.", "Input Required");

        try {
            await api.post(`/classrooms/${classroomId}/assignments/${assignmentId}/submissions/${submissionId}/grade`, { score: scoreToSave });
            toast.success("Grade committed successfully!", "Score Updated");
            const subToUpdate = submissions.find(s => s.id === submissionId);
            if (subToUpdate) subToUpdate.score = scoreToSave;
        } catch (error) {
            toast.error("Failed to commit grade to database.", "Grading Error");
        }
    };

    // Handler for the Resubmit Button
    const handleAllowResubmit = async (submissionId) => {
        try {
            await api.patch(`/classrooms/${classroomId}/assignments/${assignmentId}/submissions/${submissionId}/allow-resubmit`);
            toast.success("Resubmission unlocked for student!", "Lock Cleared");
            setUnlockedIds(prev => [...prev, submissionId]); // Instantly updates the UI
        } catch (error) {
            toast.error("Failed to unlock resubmission. Please check your connection.", "Action Failed");
        }
    };

    const handleTriggerScan = async () => {
        if (onRunAnalysis) {
            setActiveTab('report');
            await onRunAnalysis();
        }
    };

    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={selectedPair ? "Code Comparison" : "Submission Tree"} 
            subtitle={selectedPair ? `Detailed logic analysis between ${selectedPair.file1} and ${selectedPair.file2}` : ""}
            customClass="wide-hud"
        >
            {!selectedPair && (
                <>
                    {/* Segmented Tabs */}
                    <div className="audit-segmented-tabs">
                        <button 
                            className={`audit-tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('submissions'); setSearchTerm(''); }}
                            type="button"
                        >
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span>Submissions</span>
                            <span className="tab-badge-count">{submissions.length}</span>
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

                    {/* 🔍 Search & Filter Toolbar */}
                    <div className="audit-search-toolbar">
                        <div className="audit-search-input-wrap">
                            <svg className="audit-search-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <input
                                type="text"
                                className="audit-search-input"
                                placeholder={activeTab === 'submissions' 
                                    ? "Search by student name or filename (e.g. Mary, TS-A)..." 
                                    : "Search student, filename, or clone pair..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button 
                                    className="audit-search-clear" 
                                    onClick={() => setSearchTerm('')} 
                                    title="Clear search"
                                    type="button"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Plagiarism Risk Filter Pills */}
                        {activeTab === 'report' && analysisResults && (
                            <div className="audit-filter-chips">
                                {[
                                    { id: 'all', label: 'All Pairs' },
                                    { id: 'Type 1', label: 'Type 1 (Exact)' },
                                    { id: 'Type 2', label: 'Type 2 (Renamed)' },
                                    { id: 'Type 3', label: 'Type 3 (Structural)' }
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

            <div className="hud-modal-body audit-body-override">
                {!selectedPair ? (
                    <>
                        {activeTab === 'submissions' && (
                            <div className="submissions-audit-list">
                                {searchTerm && (
                                    <div className="audit-results-count-banner">
                                        Showing {filteredSubmissions.length} of {submissions.length} submissions
                                    </div>
                                )}

                                {/* Desktop Table View (>= 1024px) */}
                                <div className="desktop-table-container">
                                    <table className="falsicode-table-hud">
                                        <thead>
                                            <tr>
                                                <th style={{width: '40px'}}></th>
                                                <th>STUDENT IDENTITY</th>
                                                <th>SOURCE FILE</th>
                                                <th className="th-actions">ACTIONS</th> 
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredSubmissions.length > 0 ? (
                                                filteredSubmissions.map(sub => {
                                                    const isUnlocked = sub.allow_resubmit || unlockedIds.includes(sub.id);
                                                    
                                                    return (
                                                        <tr key={sub.id} className="submission-card-row">
                                                            <td className="status-cell">
                                                                <div className="status-dot yellow"></div>
                                                            </td>
                                                            <td className="td-student">
                                                                <div className="hud-stu-cell">
                                                                    <div className="stu-icon">{sub.student_name.charAt(0).toUpperCase()}</div>
                                                                    <div className="stu-info-meta">
                                                                        <strong className="stu-name">{sub.student_name}</strong>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="td-file">
                                                                <div className="file-chip-wrapper">
                                                                    <code className="code-box">{sub.filename}</code>
                                                                </div>
                                                            </td>
                                                            <td className="td-action">
                                                                <div className="grade-input-group">
                                                                    <div className="grade-field-row">
                                                                        <input 
                                                                            type="text" className="grade-input-small" 
                                                                            placeholder={sub.score && sub.score !== 'Pending' ? sub.score : "e.g. 45/50"}
                                                                            value={gradeInputs[sub.id] !== undefined ? gradeInputs[sub.id] : ''}
                                                                            onChange={(e) => setGradeInputs({...gradeInputs, [sub.id]: e.target.value})}
                                                                        />
                                                                        <button className="btn-save-grade" onClick={() => handleSaveGrade(sub.id)}>SAVE</button>
                                                                    </div>
                                                                    
                                                                    <button 
                                                                        className={`btn-allow-resubmit ${isUnlocked ? 'unlocked' : ''}`} 
                                                                        onClick={() => handleAllowResubmit(sub.id)}
                                                                        disabled={isUnlocked}
                                                                        title={isUnlocked ? "Student is currently allowed to resubmit" : "Unlock to allow student to upload again"}
                                                                    >
                                                                        {isUnlocked ? 'WAITING' : 'ALLOW RESUBMIT'}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="empty-search-cell">
                                                        <div className="empty-search-box">
                                                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                                            </svg>
                                                            <strong>No matching submissions found</strong>
                                                            <p>No student submissions matched your search query "{searchTerm}".</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile & Tablet Responsive Cards (< 1024px) */}
                                <div className="mobile-tablet-card-container">
                                    {filteredSubmissions.length > 0 ? (
                                        filteredSubmissions.map(sub => {
                                            const isUnlocked = sub.allow_resubmit || unlockedIds.includes(sub.id);
                                            const hasScore = sub.score && sub.score !== 'Pending';
                                            
                                            return (
                                                <div key={sub.id} className="submission-responsive-card">
                                                    {/* Top Row: Identity & Status Pill */}
                                                    <div className="card-identity-header">
                                                        <div className="student-profile-badge">
                                                            <div className="stu-icon">{sub.student_name.charAt(0).toUpperCase()}</div>
                                                            <div className="student-title-wrap">
                                                                <strong className="stu-name">{sub.student_name}</strong>
                                                                <div className="file-chip-row">
                                                                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="file-icon-mini">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                    </svg>
                                                                    <span className="file-name-text">{sub.filename}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className={`status-grade-pill ${hasScore ? 'graded' : 'pending'}`}>
                                                            {hasScore ? `Grade: ${sub.score}` : 'Pending'}
                                                        </div>
                                                    </div>

                                                    {/* Bottom Toolbar: Score Input + Save + Resubmit */}
                                                    <div className="card-action-toolbar">
                                                        <div className="grade-input-wrapper">
                                                            <input 
                                                                type="text" 
                                                                className="grade-input-small" 
                                                                placeholder={hasScore ? sub.score : "e.g. 45/50"}
                                                                value={gradeInputs[sub.id] !== undefined ? gradeInputs[sub.id] : ''}
                                                                onChange={(e) => setGradeInputs({...gradeInputs, [sub.id]: e.target.value})}
                                                            />
                                                            <button className="btn-save-grade" onClick={() => handleSaveGrade(sub.id)}>
                                                                SAVE
                                                            </button>
                                                        </div>
                                                        
                                                        <button 
                                                            className={`btn-allow-resubmit ${isUnlocked ? 'unlocked' : ''}`} 
                                                            onClick={() => handleAllowResubmit(sub.id)}
                                                            disabled={isUnlocked}
                                                            title={isUnlocked ? "Student is currently allowed to resubmit" : "Unlock to allow student to upload again"}
                                                        >
                                                            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginRight: '4px'}}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                                            </svg>
                                                            <span>{isUnlocked ? 'WAITING' : 'ALLOW RESUBMIT'}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="empty-search-box">
                                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                            </svg>
                                            <strong>No matching submissions found</strong>
                                            <p>No student submissions matched your search query "{searchTerm}".</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'report' && (
                            <div className="analysis-report-section tab-view">
                                {isAnalyzing ? (
                                    <ModalSkeleton.AnalysisReport count={3} />
                                ) : analysisResults ? (
                                    <>
                                        <div className="report-header">
                                            <div className="report-header-info">
                                                <h3>Similarity Analysis Results</h3>
                                                <p className="report-header-sub">
                                                    Calculated AST Structure, N-Grams & TF-IDF Vector Cosine Similarity
                                                    {searchTerm && ` • Filtered: ${filteredResults.length} of ${analysisResults.length} pairs`}
                                                </p>
                                            </div>
                                            <span className="scan-badge">SCAN COMPLETE</span>
                                        </div>
                                        
                                        {/* Desktop Report Table (>= 1024px) */}
                                        <div className="desktop-table-container">
                                            <table className="falsicode-table-hud report-table hoverable-table">
                                                <thead>
                                                    <tr>
                                                        <th>MATCHED PAIR</th>
                                                        <th style={{textAlign: 'right'}}>SIMILARITY</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredResults.length > 0 ? (
                                                        filteredResults.map((res, i) => {
                                                            const displayData = getPlagiarismDisplayData(res.plagiarism_type);
                                                            return (
                                                                <tr key={i} onClick={() => setSelectedPair(res)} className="clickable-row">
                                                                    <td className="comparison-text">
                                                                        <div className="pair-wrap">
                                                                            <span className="pair-file">{res.file1}</span>
                                                                            <span className="arrow-icon">↔</span>
                                                                            <span className="pair-file">{res.file2}</span>
                                                                        </div>
                                                                        <span className="view-details-text">Click to view side-by-side comparison</span>
                                                                    </td>
                                                                    <td className="sim-score" style={{ color: displayData.color }}>
                                                                        <span className="plag-type-pill" style={{ borderColor: displayData.color, color: displayData.color }}>
                                                                            {displayData.shortLabel}
                                                                        </span>
                                                                        <span className="sim-score-num">{res.score}%</span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="2" className="clean-scan-cell">
                                                                <div className="clean-scan-box">
                                                                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="clean-scan-icon">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                    </svg>
                                                                    <strong>No matching clone pairs found</strong>
                                                                    <p>{searchTerm || filterType !== 'all' ? `No comparisons matched current search/filter.` : "All student code submissions showed acceptable independence."}</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile & Tablet Report Cards (< 1024px) */}
                                        <div className="mobile-tablet-card-container">
                                            {filteredResults.length > 0 ? (
                                                filteredResults.map((res, i) => {
                                                    const displayData = getPlagiarismDisplayData(res.plagiarism_type);
                                                    return (
                                                        <div 
                                                            key={i} 
                                                            onClick={() => setSelectedPair(res)} 
                                                            className="report-responsive-card"
                                                        >
                                                            <div className="report-card-top">
                                                                <div className="pair-wrap">
                                                                    <span className="pair-file">{res.file1}</span>
                                                                    <span className="arrow-icon">↔</span>
                                                                    <span className="pair-file">{res.file2}</span>
                                                                </div>
                                                                <div className="sim-score" style={{ color: displayData.color }}>
                                                                    <span className="plag-type-pill" style={{ borderColor: displayData.color, color: displayData.color }}>
                                                                        {displayData.shortLabel}
                                                                    </span>
                                                                    <span className="sim-score-num">{res.score}%</span>
                                                                </div>
                                                            </div>
                                                            <span className="view-details-text">Tap to view side-by-side comparison →</span>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="clean-scan-cell">
                                                    <div className="clean-scan-box">
                                                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="clean-scan-icon">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                        <strong>No matching clone pairs found</strong>
                                                        <p>{searchTerm || filterType !== 'all' ? `No comparisons matched current search/filter.` : "All student code submissions showed acceptable independence."}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="report-empty-state">
                                        <div className="report-empty-icon">
                                            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        submissions={submissions} 
                        onBack={() => setSelectedPair(null)} 
                    />
                )}
            </div>

            {!selectedPair && (
                <div className="hud-modal-footer">
                    <button 
                        className={`btn-hud-run ${isAnalyzing ? 'pulsing' : ''}`} 
                        onClick={handleTriggerScan} 
                        disabled={isAnalyzing}
                    >
                        {isAnalyzing ? "Processing..." : (analysisResults ? "Re-run Plagiarism Analysis" : "Run Falsicode Analysis")}
                    </button>
                </div>
            )}
        </BaseModal>
    );
};

export default SubmissionsAuditModal;
