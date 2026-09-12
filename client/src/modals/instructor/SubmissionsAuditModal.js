import React, { useState, useMemo, useEffect } from 'react';
import api from '../../services/api'; 
import { useToast } from '../../context/NotificationContext';
import CodeComparisonView from '../../components/instructor/CodeComparisonView'; 
import './SubmissionsAuditModal.css'; 
import { getPlagiarismDisplayData } from '../../utils/theme';
import BaseModal from '../shared/BaseModal';

const SubmissionsAuditModal = ({ isOpen, onClose, submissions = [], analysisResults, isAnalyzing, onRunAnalysis, classroomId, assignmentId }) => {
    const [selectedPair, setSelectedPair] = useState(null);
    const [activeTab, setActiveTab] = useState('submissions'); // 'submissions' | 'report'
    const [gradeInputs, setGradeInputs] = useState({}); 
    const [unlockedIds, setUnlockedIds] = useState([]); // Tracks instantly unlocked submissions
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    
    // --- Teacher Comments / Feedback State ---
    const [feedbackModalSub, setFeedbackModalSub] = useState(null);
    const [feedbackDraft, setFeedbackDraft] = useState('');
    const [isSavingFeedback, setIsSavingFeedback] = useState(false);
    const [feedbackMap, setFeedbackMap] = useState({});

    const toast = useToast();

    // Initialize feedbackMap from incoming submissions
    useEffect(() => {
        const initialMap = {};
        submissions.forEach(s => {
            if (s.feedback) initialMap[s.id] = s.feedback;
        });
        setFeedbackMap(prev => ({ ...initialMap, ...prev }));
    }, [submissions]);

    const openFeedbackModal = (sub) => {
        const currentFeedback = feedbackMap[sub.id] !== undefined ? feedbackMap[sub.id] : (sub.feedback || '');
        setFeedbackModalSub(sub);
        setFeedbackDraft(currentFeedback);
    };

    const handleSaveFeedback = async () => {
        if (!feedbackModalSub) return;
        setIsSavingFeedback(true);
        try {
            await api.post(`/classrooms/${classroomId}/assignments/${assignmentId}/submissions/${feedbackModalSub.id}/feedback`, {
                feedback: feedbackDraft
            });
            toast.success("Feedback committed successfully!", "Remarks Saved");
            setFeedbackMap(prev => ({ ...prev, [feedbackModalSub.id]: feedbackDraft }));
            feedbackModalSub.feedback = feedbackDraft;
            setFeedbackModalSub(null);
        } catch (error) {
            toast.error("Failed to commit feedback to database.", "Grading Error");
        } finally {
            setIsSavingFeedback(false);
        }
    };

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
                                                    const subFeedback = feedbackMap[sub.id] !== undefined ? feedbackMap[sub.id] : sub.feedback;
                                                    const hasFeedback = Boolean(subFeedback && subFeedback.trim());
                                                    
                                                    return (
                                                        <tr key={sub.id} className="submission-card-row">
                                                            <td className="status-cell">
                                                                <div className="status-dot yellow"></div>
                                                            </td>
                                                            <td className="td-student">
                                                                <div className="hud-stu-cell">
                                                                    <div className="stu-icon">
                                                                        {sub.student_avatar ? (
                                                                            <img src={sub.student_avatar} alt="" className="stu-icon-img" />
                                                                        ) : (
                                                                            sub.student_name.charAt(0).toUpperCase()
                                                                        )}
                                                                    </div>
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
                                                                        className={`btn-comment-feedback ${hasFeedback ? 'has-feedback' : ''}`}
                                                                        onClick={() => openFeedbackModal(sub)}
                                                                        title={hasFeedback ? `Feedback: ${subFeedback.slice(0, 50)}...` : "Add instructor feedback / remarks"}
                                                                    >
                                                                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginRight: '4px'}}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                                                        </svg>
                                                                        <span>{hasFeedback ? 'FEEDBACK' : 'REMARKS'}</span>
                                                                    </button>

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
                                            const subFeedback = feedbackMap[sub.id] !== undefined ? feedbackMap[sub.id] : sub.feedback;
                                            const hasFeedback = Boolean(subFeedback && subFeedback.trim());
                                            
                                            return (
                                                <div key={sub.id} className="submission-responsive-card">
                                                    {/* Top Row: Identity & Status Pill */}
                                                    <div className="card-identity-header">
                                                        <div className="student-profile-badge">
                                                            <div className="stu-icon">
                                                                {sub.student_avatar ? (
                                                                    <img src={sub.student_avatar} alt="" className="stu-icon-img" />
                                                                ) : (
                                                                    sub.student_name.charAt(0).toUpperCase()
                                                                )}
                                                            </div>
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

                                        <div className="card-status-badges">
                                            {hasFeedback && (
                                                <div className="status-feedback-pill" title={subFeedback}>
                                                    <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginRight: '3px'}}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                                    </svg>
                                                    Remarks Added
                                                </div>
                                            )}
                                            <div className={`status-grade-pill ${hasScore ? 'graded' : 'pending'}`}>
                                                {hasScore ? `Grade: ${sub.score}` : 'Pending'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Toolbar: Score Input + Save + Feedback + Resubmit */}
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
                                            className={`btn-comment-feedback ${hasFeedback ? 'has-feedback' : ''}`}
                                            onClick={() => openFeedbackModal(sub)}
                                            title={hasFeedback ? `Feedback: ${subFeedback.slice(0, 50)}...` : "Add instructor feedback / remarks"}
                                        >
                                            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginRight: '4px'}}>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                            </svg>
                                            <span>{hasFeedback ? 'FEEDBACK' : 'REMARKS'}</span>
                                        </button>

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
                <div className="report-header">
                    <div className="report-header-info">
                        <h3>Plagiarism Similarity Matrix</h3>
                        <p className="report-header-sub">Algorithm: AST Structural Tokenization + N-Gram Analysis + TF-IDF</p>
                    </div>
                    {analysisResults && (
                        <div className="scan-badge">
                            Analysis Active
                        </div>
                    )}
                </div>

                {filteredResults.length > 0 ? (
                    <div className="table-responsive-wrapper">
                        <table className="falsicode-table-hud hoverable-table">
                            <thead>
                                <tr>
                                    <th>COMPARISON PAIR</th>
                                    <th>SIMILARITY SCORE</th>
                                    <th>PLAGIARISM CLASSIFICATION</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResults.map((result, idx) => {
                                    const { badgeClass } = getPlagiarismDisplayData(result.plagiarism_type);
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
                                                    {result.plagiarism_type || 'Clean'}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn-view-comparison" onClick={(e) => { e.stopPropagation(); setSelectedPair(result); }}>
                                                    Audit Pair
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
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

{/* TEACHER FEEDBACK / REMARKS MODAL OVERLAY */}
{feedbackModalSub && (
<div className="feedback-modal-backdrop" onClick={() => setFeedbackModalSub(null)}>
    <div className="feedback-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-modal-header">
            <div className="feedback-title-group">
                <div className="feedback-avatar-icon">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                </div>
                <div>
                    <h3 className="feedback-modal-title">Instructor Remarks & Feedback</h3>
                    <p className="feedback-modal-sub">
                        Student: <strong>{feedbackModalSub.student_name}</strong> • File: <code className="feedback-sub-code">{feedbackModalSub.filename}</code>
                    </p>
                </div>
            </div>
            <button 
                type="button" 
                className="feedback-modal-close-btn"
                onClick={() => setFeedbackModalSub(null)}
                aria-label="Close"
            >
                ✕
            </button>
        </div>

        <div className="feedback-modal-content">
            <div className="feedback-section-block">
                <label className="feedback-label-caption">QUICK-INSERT FEEDBACK PRESETS</label>
                <div className="feedback-preset-chips">
                    {[
                        "Clean logic and well-structured implementation.",
                        "Consider optimizing time and space complexity.",
                        "Check edge cases such as empty inputs or boundary values.",
                        "High similarity detected with peer submissions; please attend consultation.",
                        "Solution approved with distinction."
                    ].map((preset, idx) => (
                        <button
                            key={idx}
                            type="button"
                            className="feedback-preset-chip"
                            onClick={() => setFeedbackDraft(prev => prev ? `${prev}\n${preset}` : preset)}
                        >
                            {preset}
                        </button>
                    ))}
                </div>
            </div>

            <div className="feedback-section-block">
                <label className="feedback-label-caption">DETAILED REMARKS FOR STUDENT</label>
                <textarea
                    className="feedback-notes-textarea"
                    rows="5"
                    placeholder="Provide constructive feedback, notes on algorithm efficiency, or instructions for the student..."
                    value={feedbackDraft}
                    onChange={(e) => setFeedbackDraft(e.target.value)}
                    autoFocus
                />
                <div className="feedback-char-count">
                    {feedbackDraft.length} characters
                </div>
            </div>
        </div>

        <div className="feedback-modal-actions">
            <button
                type="button"
                className="btn-feedback-dismiss"
                onClick={() => setFeedbackModalSub(null)}
                disabled={isSavingFeedback}
            >
                Cancel
            </button>
            <button
                type="button"
                className="btn-feedback-submit"
                onClick={handleSaveFeedback}
                disabled={isSavingFeedback}
            >
                {isSavingFeedback ? (
                    <>
                        <span className="feedback-save-spinner"></span>
                        Saving Remarks...
                    </>
                ) : (
                    "Save Feedback"
                )}
            </button>
        </div>
    </div>
</div>
)}
        </BaseModal>
    );
};

export default SubmissionsAuditModal;
