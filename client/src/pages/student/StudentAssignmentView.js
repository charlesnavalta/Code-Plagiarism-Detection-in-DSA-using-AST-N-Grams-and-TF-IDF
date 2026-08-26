import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useSpatialSpotlight } from '../../hooks/useSpatialSpotlight';
import { useToast } from '../../context/NotificationContext';
import api from '../../services/api';
import './StudentAssignmentView.css';

// Shared Utilities
import { formatLanguageDisplay, getFileExtension, validateUploadedFile } from '../../utils/fileUtils';
import { formatDeadline } from '../../utils/dateUtils';
import InstructorWrapper from '../instructor/components/InstructorWrapper';

const StudentAssignmentView = () => {
    const { id, assignmentId } = useParams();
    const classId = id;
    const navigate = useNavigate();
    const toast = useToast();
    const [theme] = useTheme();
    const pageRef = useRef(null);
    const handleMouseMove = useSpatialSpotlight(pageRef);

    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        const fetchAssignmentData = async () => {
            setLoading(true);
            const startTime = Date.now();
            try {
                let data = null;
                // Attempt 1: Try dedicated single assignment endpoint
                try {
                    const res = await api.get(`/classrooms/${classId}/assignments/${assignmentId}`);
                    data = res.data;
                } catch (singleErr) {
                    // Attempt 2: Fallback to classroom assignments feed
                    const [classRes, listRes] = await Promise.all([
                        api.get(`/classrooms/${classId}`),
                        api.get(`/classrooms/${classId}/assignments`)
                    ]);
                    const found = listRes.data.find(a => String(a.id) === String(assignmentId));
                    if (found) {
                        data = {
                            ...found,
                            classroom_name: classRes.data?.name,
                            instructor_name: classRes.data?.instructor
                        };
                    } else {
                        throw new Error("Assignment not found in classroom");
                    }
                }
                setAssignment(data);
            } catch (err) {
                console.error("Assignment loading error:", err);
                toast.error("Could not load assignment details.", "Access Error");
                navigate(`/student/class/${classId}`);
            } finally {
                const elapsed = Date.now() - startTime;
                const minDelay = 350;
                if (elapsed < minDelay) {
                    await new Promise(r => setTimeout(r, minDelay - elapsed));
                }
                setLoading(false);
            }
        };

        fetchAssignmentData();
    }, [classId, assignmentId, navigate, toast]);

    const fileExtension = assignment ? getFileExtension(assignment.language) : '.py';
    const displayLanguage = assignment ? formatLanguageDisplay(assignment.language) : 'Python';
    const isOverdue = assignment?.deadline && new Date() > new Date(assignment.deadline);
    const isSubmitted = assignment?.has_submitted;
    const isUnlocked = assignment?.allow_resubmit;
    const isLocked = isSubmitted && !isUnlocked;
    const isPastDeadline = isOverdue && !isSubmitted && !isUnlocked;

    // File selection handlers
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    // Open attached guide file in new tab
    const handleOpenAttachment = async (attachment) => {
        try {
            const response = await api.get(attachment.url, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const blobUrl = window.URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        } catch (error) {
            toast.error("Failed to securely open the file preview.", "File Preview Error");
        }
    };

    // Handle code submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateUploadedFile(selectedFile, fileExtension);
        if (validationError) {
            toast.warning(validationError, "Validation Notice");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await api.post(`/classrooms/${classId}/assignments/${assignment.id}/submit`, formData);
            toast.success("Assignment submitted successfully!", "Deployment Complete");
            
            setAssignment(prev => ({
                ...prev,
                has_submitted: true,
                allow_resubmit: false,
                score: 'Pending',
                submitted_filename: selectedFile.name,
                submitted_at: new Date().toISOString()
            }));
            setSelectedFile(null);
        } catch (error) {
            toast.error("Upload failed: " + (error.response?.data?.error || error.message), "Submission Error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <InstructorWrapper>
                <div className={`assignment-view-container ${theme}`} ref={pageRef} onMouseMove={handleMouseMove}>
                    <div className="view-inner-wrapper">
                        <div className="view-loading-skeleton-hero"></div>
                        <div className="view-loading-skeleton-grid">
                            <div className="view-skeleton-panel left"></div>
                            <div className="view-skeleton-panel right"></div>
                        </div>
                    </div>
                </div>
            </InstructorWrapper>
        );
    }

    if (!assignment) return null;

    return (
        <InstructorWrapper>
            <div className={`assignment-view-container ${theme}`} ref={pageRef} onMouseMove={handleMouseMove}>
                <div className="view-inner-wrapper">
                    
                    {/* --- TOP BREADCRUMB & BACK NAV --- */}
                    <div className="view-top-nav">
                        <button className="btn-view-back" onClick={() => navigate(`/student/class/${classId}`)}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back to {assignment.classroom_name || 'Classroom'}
                        </button>
                        
                        <div className="view-nav-status-badge">
                            {isUnlocked ? (
                                <span className="badge-view-unlocked">Resubmission Unlocked</span>
                            ) : isSubmitted ? (
                                <span className="badge-view-submitted">✓ Submitted</span>
                            ) : isOverdue ? (
                                <span className="badge-view-overdue">Deadline Passed</span>
                            ) : (
                                <span className="badge-view-pending">Active Task</span>
                            )}
                        </div>
                    </div>

                    {/* --- HERO HEADER BANNER --- */}
                    <div className="assignment-hero-card">
                        <div className="hero-meta-row">
                            <span className="task-pill">TASK {String(assignment.id).padStart(2, '0')} • {displayLanguage}</span>
                            <span className="score-pill">MAX SCORE: {assignment.max_score} PTS</span>
                        </div>

                        <h1 className="assignment-view-title">{assignment.title}</h1>
                        
                        <div className="assignment-meta-footer">
                            <div className="meta-item">
                                <span className="meta-label">INSTRUCTOR</span>
                                <strong className="meta-val">{assignment.instructor_name || 'Instructor'}</strong>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">DUE DATE</span>
                                <strong className={`meta-val ${isOverdue && !isSubmitted ? 'text-danger' : ''}`}>
                                    {formatDeadline(assignment.deadline)}
                                </strong>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">REQUIRED FORMAT</span>
                                <strong className="meta-val">Single {fileExtension} source file</strong>
                            </div>
                        </div>
                    </div>

                    {/* --- 2-COLUMN WORKSPACE GRID --- */}
                    <div className="assignment-view-grid">
                        
                        {/* LEFT COLUMN: Full Description & Attached Resources */}
                        <div className="view-main-column">
                            
                            <div className="workspace-card desc-card">
                                <div className="card-header-clean">
                                    <h2>Assignment Requirements & Instructions</h2>
                                </div>
                                
                                <div className="description-content-area">
                                    <p className="formatted-description-text">{assignment.description}</p>
                                </div>
                            </div>

                            {/* Attached Guide Files (PDFs, Sample Code) */}
                            {assignment.attachments && assignment.attachments.length > 0 && (
                                <div className="workspace-card attachments-card">
                                    <div className="card-header-clean">
                                        <h3>Attached Reference Materials ({assignment.attachments.length})</h3>
                                        <span className="card-subtitle-note">Click any file to preview or download</span>
                                    </div>

                                    <div className="view-attachments-list">
                                        {assignment.attachments.map(att => (
                                            <button 
                                                key={att.id} 
                                                className="view-attachment-button"
                                                onClick={() => handleOpenAttachment(att)}
                                                title={`Open ${att.filename}`}
                                            >
                                                <div className="attachment-file-icon">
                                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                    </svg>
                                                </div>
                                                <div className="attachment-meta-info">
                                                    <strong className="attachment-title-text">{att.filename}</strong>
                                                    <span className="attachment-action-text">Preview Document ↗</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* RIGHT COLUMN: Submission Dock & Status Panel */}
                        <div className="view-sidebar-column">
                            
                            <div className="workspace-card submission-dock-card">
                                <div className="dock-header">
                                <h3>Your Submission</h3>
                                    {assignment.score && assignment.score !== 'Pending' ? (
                                        <span className="dock-score-badge earned">{assignment.score} / {assignment.max_score}</span>
                                    ) : (
                                        <span className="dock-score-badge">{assignment.max_score} Pts</span>
                                    )}
                                </div>

                                {/* Case 1: Already Submitted and Locked */}
                                {isLocked ? (
                                    <div className="submission-completed-box">
                                        <div className="completed-icon-circle">
                                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <h4 className="completed-title">Solution Deployed & Secured</h4>
                                        <p className="completed-subtext">
                                            Your code has been submitted and registered into the Falsicode AST analysis queue.
                                        </p>

                                        <div className="submission-receipt-card">
                                            <div className="receipt-row">
                                                <span>FILE NAME</span>
                                                <strong>{assignment.submitted_filename || `solution${fileExtension}`}</strong>
                                            </div>
                                            <div className="receipt-row">
                                                <span>SUBMITTED AT</span>
                                                <strong>{assignment.submitted_at ? new Date(assignment.submitted_at).toLocaleString() : 'Recorded'}</strong>
                                            </div>
                                            <div className="receipt-row">
                                                <span>EVALUATION STATUS</span>
                                                <strong className={assignment.score === 'Pending' ? 'text-warning' : 'text-success'}>
                                                    {assignment.score === 'Pending' ? '⏳ Under Audit (Pending)' : `${assignment.score} Pts`}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="locked-notice-banner">
                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                            </svg>
                                            <span>Submission is locked. If you need to make changes, please contact your instructor to unlock resubmission.</span>
                                        </div>
                                    </div>
                                ) : isPastDeadline ? (
                                    /* Case 2: Deadline Passed without submission */
                                    <div className="submission-overdue-box">
                                        <div className="overdue-icon-circle">✕</div>
                                        <h4>Assignment Deadline Passed</h4>
                                        <p>The submission window for this assignment has closed. Please reach out to your instructor.</p>
                                    </div>
                                ) : (
                                    /* Case 3: Ready to Submit / Resubmission Unlocked */
                                    <form onSubmit={handleSubmit} className="submission-upload-form">
                                        
                                        {isUnlocked && (
                                            <div className="resubmit-alert-banner">
                                                <strong>Resubmission Active:</strong> Your instructor has unlocked this task. Uploading a new file will replace your previous submission.
                                            </div>
                                        )}

                                        <div 
                                            className={`file-dropzone-box ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'file-ready' : ''}`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            <input 
                                                type="file" 
                                                accept={fileExtension} 
                                                id="assignment-file-input" 
                                                style={{ display: 'none' }} 
                                                onChange={handleFileChange} 
                                            />

                                            {!selectedFile ? (
                                                <label htmlFor="assignment-file-input" className="dropzone-inner-label">
                                                    <div className="dropzone-cloud-icon">
                                                        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                                        </svg>
                                                    </div>
                                                    <strong>Choose a {fileExtension} file</strong>
                                                    <span>or drag and drop your source code here</span>
                                                </label>
                                            ) : (
                                                <div className="selected-file-preview-card">
                                                    <div className="file-icon-box">
                                                        <code>{fileExtension.replace('.', '')}</code>
                                                    </div>
                                                    <div className="file-info-text">
                                                        <strong className="selected-filename">{selectedFile.name}</strong>
                                                        <span className="selected-filesize">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                                                    </div>
                                                    <label htmlFor="assignment-file-input" className="btn-replace-file">
                                                        Replace
                                                    </label>
                                                </div>
                                            )}
                                        </div>

                                        <div className="submission-terms-note">
                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <span>Code is validated for {displayLanguage} syntax and processed through AST N-Gram tokenization.</span>
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="btn-submit-code-primary" 
                                            disabled={!selectedFile || isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="btn-spinner"></span>
                                                    Securing & Submitting...
                                                </>
                                            ) : isUnlocked ? (
                                                'Deploy Resubmission →'
                                            ) : (
                                                'Deploy & Submit Assignment →'
                                            )}
                                        </button>
                                    </form>
                                )}

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </InstructorWrapper>
    );
};

export default StudentAssignmentView;
