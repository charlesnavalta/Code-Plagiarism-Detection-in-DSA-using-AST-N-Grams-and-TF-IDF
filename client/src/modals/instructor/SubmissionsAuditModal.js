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
    
    // Dynamic resubmission tracking state { [subId]: { allow_resubmit: bool, resubmission_deadline: string|null } }
    const [resubmissionMap, setResubmissionMap] = useState({});
    
    // Resubmission Deadline Dialog State
    const [resubmitTarget, setResubmitTarget] = useState(null);
    const [resubmitDeadlineInput, setResubmitDeadlineInput] = useState('');
    const [isUpdatingResubmit, setIsUpdatingResubmit] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const toast = useToast();

    // Format helper for short dates
    const formatShortDeadline = (isoString) => {
        if (!isoString) return 'No Limit';
        try {
            const date = new Date(isoString);
            const isOverdue = new Date() > date;
            const formatted = date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            return isOverdue ? `Expired (${formatted})` : formatted;
        } catch {
            return 'Invalid Date';
        }
    };

    // Helper to get local ISO string for datetime-local input
    const getLocalDatetimeString = (dateObj) => {
        const pad = (n) => String(n).padStart(2, '0');
        const year = dateObj.getFullYear();
        const month = pad(dateObj.getMonth() + 1);
        const day = pad(dateObj.getDate());
        const hours = pad(dateObj.getHours());
        const minutes = pad(dateObj.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Open Resubmission Modal
    const openResubmitModal = (sub) => {
        const dynamicState = resubmissionMap[sub.id];
        const isUnlocked = dynamicState !== undefined ? dynamicState.allow_resubmit : sub.allow_resubmit;
        const currentDeadline = dynamicState !== undefined ? dynamicState.resubmission_deadline : sub.resubmission_deadline;

        setResubmitTarget({
            ...sub,
            allow_resubmit: isUnlocked,
            resubmission_deadline: currentDeadline
        });

        if (currentDeadline) {
            try {
                setResubmitDeadlineInput(getLocalDatetimeString(new Date(currentDeadline)));
            } catch {
                setResubmitDeadlineInput('');
            }
        } else {
            // Default preset: 24 hours from now
            const defaultDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            setResubmitDeadlineInput(getLocalDatetimeString(defaultDate));
        }
    };

    // Apply quick preset to deadline input
    const applyPreset = (hours) => {
        if (hours === 0) {
            setResubmitDeadlineInput('');
        } else {
            const targetDate = new Date(Date.now() + hours * 60 * 60 * 1000);
            setResubmitDeadlineInput(getLocalDatetimeString(targetDate));
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

    // Save Resubmission Permission (with optional deadline)
    const handleConfirmResubmit = async () => {
        if (!resubmitTarget) return;
        setIsUpdatingResubmit(true);

        try {
            const payload = {
                allow_resubmit: true,
                resubmission_deadline: resubmitDeadlineInput ? new Date(resubmitDeadlineInput).toISOString() : null
            };

            const res = await api.patch(
                `/classrooms/${classroomId}/assignments/${assignmentId}/submissions/${resubmitTarget.id}/allow-resubmit`,
                payload
            );

            toast.success(res.data.message || `Resubmission unlocked for ${resubmitTarget.student_name}!`, "Lock Cleared");
            
            setResubmissionMap(prev => ({
                ...prev,
                [resubmitTarget.id]: {
                    allow_resubmit: true,
                    resubmission_deadline: res.data.resubmission_deadline || (resubmitDeadlineInput ? new Date(resubmitDeadlineInput).toISOString() : null)
                }
            }));
            
            setResubmitTarget(null);
        } catch (error) {
            const msg = error.response?.data?.error || "Failed to update resubmission permission.";
            toast.error(msg, "Action Failed");
        } finally {
            setIsUpdatingResubmit(false);
        }
    };

    // Revoke Resubmission Permission
    const handleRevokeResubmit = async () => {
        if (!resubmitTarget) return;
        setIsUpdatingResubmit(true);

        try {
            const res = await api.patch(
                `/classrooms/${classroomId}/assignments/${assignmentId}/submissions/${resubmitTarget.id}/allow-resubmit`,
                { action: 'revoke' }
            );

            toast.info(res.data.message || `Resubmission revoked for ${resubmitTarget.student_name}.`, "Lock Re-engaged");

            setResubmissionMap(prev => ({
                ...prev,
                [resubmitTarget.id]: {
                    allow_resubmit: false,
                    resubmission_deadline: null
                }
            }));

            setResubmitTarget(null);
        } catch (error) {
            const msg = error.response?.data?.error || "Failed to revoke resubmission permission.";
            toast.error(msg, "Action Failed");
        } finally {
            setIsUpdatingResubmit(false);
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
                                                    const dynState = resubmissionMap[sub.id];
                                                    const isUnlocked = dynState !== undefined ? dynState.allow_resubmit : Boolean(sub.allow_resubmit);
                                                    const deadline = dynState !== undefined ? dynState.resubmission_deadline : sub.resubmission_deadline;
                                                    const isOverdue = deadline && new Date() > new Date(deadline);

                                                    return (
                                                        <tr key={sub.id} className="submission-card-row">
                                                            <td className="status-cell">
                                                                <div className={`status-dot ${isUnlocked ? 'orange' : 'yellow'}`}></div>
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
                                                                        className={`btn-allow-resubmit ${isUnlocked ? 'unlocked' : ''} ${isOverdue ? 'overdue' : ''}`} 
                                                                        onClick={() => openResubmitModal(sub)}
                                                                        title={isUnlocked ? "Click to view/modify resubmission deadline or lock" : "Click to allow student to resubmit with a deadline"}
                                                                        type="button"
                                                                    >
                                                                        {isUnlocked ? (
                                                                            <div className="resubmit-btn-inner">
                                                                                <span className="resubmit-status-text">WAITING</span>
                                                                                <span className="resubmit-deadline-pill">
                                                                                    {deadline ? `🕒 ${formatShortDeadline(deadline)}` : '🕒 No Expiry'}
                                                                                </span>
                                                                            </div>
                                                                        ) : (
                                                                            <span>ALLOW RESUBMIT</span>
                                                                        )}
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
                                            const dynState = resubmissionMap[sub.id];
                                            const isUnlocked = dynState !== undefined ? dynState.allow_resubmit : Boolean(sub.allow_resubmit);
                                            const deadline = dynState !== undefined ? dynState.resubmission_deadline : sub.resubmission_deadline;
                                            const isOverdue = deadline && new Date() > new Date(deadline);
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
                                                            className={`btn-allow-resubmit ${isUnlocked ? 'unlocked' : ''} ${isOverdue ? 'overdue' : ''}`} 
                                                            onClick={() => openResubmitModal(sub)}
                                                            title={isUnlocked ? "Click to view/modify resubmission deadline or lock" : "Click to allow student to resubmit with a deadline"}
                                                            type="button"
                                                        >
                                                            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginRight: '4px'}}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                            </svg>
                                                            {isUnlocked ? (
                                                                <span>WAITING ({deadline ? formatShortDeadline(deadline) : 'No Limit'})</span>
                                                            ) : (
                                                                <span>ALLOW RESUBMIT</span>
                                                            )}
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

            {/* 🌟 RESUBMISSION DEADLINE POPUP MODAL */}
            {resubmitTarget && (
                <div className="resubmit-dialog-backdrop" onClick={() => !isUpdatingResubmit && setResubmitTarget(null)}>
                    <div className="resubmit-dialog-card" onClick={(e) => e.stopPropagation()}>
                        <div className="resubmit-dialog-header">
                            <div className="resubmit-dialog-icon">
                                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3>{resubmitTarget.allow_resubmit ? 'Manage Resubmission Window' : 'Allow Student Resubmission'}</h3>
                                <p className="resubmit-dialog-sub">
                                    Target: <strong>{resubmitTarget.student_name}</strong> • <code>{resubmitTarget.filename}</code>
                                </p>
                            </div>
                        </div>

                        <div className="resubmit-dialog-body">
                            <label className="resubmit-field-label">
                                Resubmission Deadline (Optional)
                            </label>
                            
                            {/* Preset Buttons */}
                            <div className="resubmit-presets-row">
                                <button type="button" className="btn-preset-chip" onClick={() => applyPreset(24)}>+24 Hours</button>
                                <button type="button" className="btn-preset-chip" onClick={() => applyPreset(48)}>+48 Hours</button>
                                <button type="button" className="btn-preset-chip" onClick={() => applyPreset(72)}>+3 Days</button>
                                <button type="button" className="btn-preset-chip" onClick={() => applyPreset(168)}>+1 Week</button>
                                <button type="button" className="btn-preset-chip no-limit" onClick={() => applyPreset(0)}>No Expiry</button>
                            </div>

                            <input 
                                type="datetime-local" 
                                className="resubmit-datetime-input"
                                value={resubmitDeadlineInput}
                                onChange={(e) => setResubmitDeadlineInput(e.target.value)}
                            />

                            <div className="resubmit-info-box">
                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>
                                    {resubmitDeadlineInput ? (
                                        <>The student will be permitted to upload a new code file until <strong>{new Date(resubmitDeadlineInput).toLocaleString()}</strong>.</>
                                    ) : (
                                        <>No deadline specified. The student can upload a new code file at any time until they submit.</>
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="resubmit-dialog-actions">
                            {resubmitTarget.allow_resubmit && (
                                <button 
                                    type="button" 
                                    className="btn-revoke-resubmit"
                                    onClick={handleRevokeResubmit}
                                    disabled={isUpdatingResubmit}
                                >
                                    Revoke Resubmit
                                </button>
                            )}
                            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                                <button 
                                    type="button" 
                                    className="btn-cancel-resubmit"
                                    onClick={() => setResubmitTarget(null)}
                                    disabled={isUpdatingResubmit}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn-confirm-resubmit"
                                    onClick={handleConfirmResubmit}
                                    disabled={isUpdatingResubmit}
                                >
                                    {isUpdatingResubmit ? "Updating..." : (resubmitTarget.allow_resubmit ? "Save Window" : "Unlock Resubmission")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </BaseModal>
    );
};

export default SubmissionsAuditModal;
