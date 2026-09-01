import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useSpatialSpotlight } from '../../hooks/useSpatialSpotlight';
import { useToast } from '../../context/NotificationContext';
import api from '../../services/api';
import './InstructorAssignmentWorkspace.css';

// Shared Utilities & Components
import { formatLanguageDisplay, getFileExtension } from '../../utils/fileUtils';
import { formatDeadline } from '../../utils/dateUtils';
import { validateAssignmentDescription, validateDeadline } from '../../utils/validation';
import DateTimePicker from '../../components/common/DateTimePicker';
import InstructorWrapper from './components/InstructorWrapper';

const InstructorEditAssignmentView = () => {
    const { id, assignmentId } = useParams();
    const classId = id;
    const navigate = useNavigate();
    const toast = useToast();
    const [theme] = useTheme();
    const pageRef = useRef(null);
    const handleMouseMove = useSpatialSpotlight(pageRef);

    const [classroom, setClassroom] = useState(null);
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Form Fields State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [maxScore, setMaxScore] = useState(100);
    const [language, setLanguage] = useState('python');
    const [deadline, setDeadline] = useState('');

    // Attachments Management State
    const [existingAttachments, setExistingAttachments] = useState([]);
    const [deletedAttachmentIds, setDeletedAttachmentIds] = useState([]);
    const [newGuideFiles, setNewGuideFiles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [classRes, assignRes] = await Promise.all([
                    api.get(`/classrooms/${classId}`),
                    api.get(`/classrooms/${classId}/assignments/${assignmentId}`)
                ]);
                setClassroom(classRes.data);
                const assignData = assignRes.data;
                setAssignment(assignData);
                setTitle(assignData.title || '');
                setDescription(assignData.description || '');
                setMaxScore(assignData.max_score || 100);
                setLanguage(assignData.language || 'python');
                setDeadline(assignData.deadline || '');
                setExistingAttachments(assignData.attachments || []);
                setDeletedAttachmentIds([]);
                setNewGuideFiles([]);
            } catch (err) {
                console.error("Error loading assignment:", err);
                toast.error("Could not load assignment details.", "Access Error");
                navigate(`/instructor/class/${classId}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [classId, assignmentId, navigate, toast]);

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    // Calculate active total attachments
    const activeExistingAttachments = existingAttachments.filter(
        att => !deletedAttachmentIds.includes(att.id)
    );
    const totalFilesCount = activeExistingAttachments.length + newGuideFiles.length;

    const processNewFiles = (filesToAdd) => {
        const availableSlots = 3 - activeExistingAttachments.length;
        if (availableSlots <= 0) {
            toast.warning("Maximum limit of 3 guide files reached. Remove an existing file to add new ones.", "File Limit Reached");
            return;
        }

        const combined = [...newGuideFiles, ...filesToAdd];
        if (combined.length > availableSlots) {
            toast.warning(`You can only add up to ${availableSlots} more file(s).`, "File Limit Exceeded");
            setNewGuideFiles(combined.slice(0, availableSlots));
            return;
        }
        setNewGuideFiles(combined);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            processNewFiles(selectedFiles);
        }
        e.target.value = null;
    };

    const handleRemoveExistingAttachment = (attId) => {
        setDeletedAttachmentIds(prev => [...prev, attId]);
        toast.info("Attachment marked for removal. Click 'Save Task Changes' to apply.", "Attachment Marked");
    };

    const handleRestoreExistingAttachment = (attId) => {
        setDeletedAttachmentIds(prev => prev.filter(id => id !== attId));
    };

    const handleRemoveNewFile = (indexToRemove) => {
        setNewGuideFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
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
            const droppedFiles = Array.from(e.dataTransfer.files);
            processNewFiles(droppedFiles);
        }
    };

    const handleOpenInNewTab = async (attachment) => {
        const newTab = window.open('about:blank', '_blank');
        if (newTab) {
            newTab.document.write('<p style="font-family:sans-serif;padding:30px;color:#333;">Loading attachment preview...</p>');
        }

        try {
            const response = await api.get(attachment.url, { responseType: 'blob' });
            let contentType = response.data?.type || response.headers?.['content-type'] || 'application/pdf';
            const blob = new Blob([response.data], { type: contentType });
            const blobUrl = window.URL.createObjectURL(blob);

            if (newTab && !newTab.closed) {
                newTab.location.href = blobUrl;
            } else {
                const link = document.createElement('a');
                link.href = blobUrl;
                link.target = '_blank';
                link.download = attachment.filename || 'attachment';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error("Failed to open file preview:", error);
            if (newTab && !newTab.closed) newTab.close();
            toast.error("Failed to securely open the file preview.", "Preview Error");
        }
    };

    const handleUpdateAssignment = async (e) => {
        e.preventDefault();

        const validationError = validateAssignmentDescription(description);
        if (validationError) {
            toast.warning(validationError, "Validation Notice");
            return;
        }

        const deadlineError = validateDeadline(deadline);
        if (deadlineError) {
            toast.warning(deadlineError, "Invalid Deadline");
            return;
        }

        setIsSaving(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('max_score', maxScore);
        formData.append('language', language);
        formData.append('deadline', deadline);

        if (deletedAttachmentIds.length > 0) {
            formData.append('deleted_attachment_ids', deletedAttachmentIds.join(','));
        }

        newGuideFiles.forEach(file => {
            formData.append('files', file);
        });

        try {
            await api.put(`/classrooms/${classId}/assignments/${assignmentId}`, formData);
            toast.success("Assignment parameters and guide files updated successfully!", "Task Updated");
            navigate(`/instructor/class/${classId}`);
        } catch (error) {
            const errText = error.response?.data?.error || error.message || "Failed to update assignment.";
            toast.error(errText, "Update Failed");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${assignment?.title || 'this assignment'}"? This action cannot be undone.`);
        if (!confirmDelete) return;

        setIsDeleting(true);
        try {
            await api.delete(`/classrooms/${classId}/assignments/${assignmentId}`);
            toast.success("Assignment deleted successfully.", "Task Removed");
            navigate(`/instructor/class/${classId}`);
        } catch (error) {
            toast.error("Failed to delete: " + (error.response?.data?.error || error.message), "Deletion Error");
            setIsDeleting(false);
        }
    };

    const fileExtension = getFileExtension(language);
    const displayLanguage = formatLanguageDisplay(language);

    if (loading) {
        return (
            <InstructorWrapper>
                <div className={`instructor-workspace-container ${theme}`} ref={pageRef} onMouseMove={handleMouseMove}>
                    <div className="workspace-inner-wrapper">
                        <div className="view-loading-skeleton-hero"></div>
                    </div>
                </div>
            </InstructorWrapper>
        );
    }

    if (!assignment) return null;

    return (
        <InstructorWrapper>
            <div className={`instructor-workspace-container ${theme}`} ref={pageRef} onMouseMove={handleMouseMove}>
                <div className="workspace-inner-wrapper">

                    {/* --- TOP BREADCRUMB & NAV --- */}
                    <div className="workspace-top-nav">
                        <button className="btn-workspace-back" onClick={() => navigate(`/instructor/class/${classId}`)}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back to {classroom?.name || 'Classroom'}
                        </button>

                        <span className="workspace-nav-badge badge-mode-edit">
                            ✎ Editing Task #{assignmentId}
                        </span>
                    </div>

                    {/* --- HERO HEADER BANNER (LIVE PREVIEW) --- */}
                    <div className="workspace-hero-card edit-mode">
                        <div className="workspace-hero-meta-row">
                            <span className="workspace-task-pill">TASK {String(assignmentId).padStart(2, '0')} • {displayLanguage}</span>
                            <span className="workspace-score-pill">MAX SCORE: {maxScore || 100} PTS</span>
                        </div>

                        <h1 className="workspace-hero-title">
                            {title.trim() || 'Untitled Assignment'}
                        </h1>

                        <div className="workspace-meta-footer">
                            <div className="workspace-meta-item">
                                <span className="workspace-meta-label">INSTRUCTOR</span>
                                <strong className="workspace-meta-val">{classroom?.instructor || 'Instructor'}</strong>
                            </div>
                            <div className="workspace-meta-item">
                                <span className="workspace-meta-label">DUE DATE</span>
                                <strong className="workspace-meta-val">
                                    {deadline ? formatDeadline(deadline) : 'Select deadline below'}
                                </strong>
                            </div>
                            <div className="workspace-meta-item">
                                <span className="workspace-meta-label">REQUIRED FORMAT</span>
                                <strong className="workspace-meta-val">Single {fileExtension} source file</strong>
                            </div>
                        </div>
                    </div>

                    {/* --- 2-COLUMN WORKSPACE FORM --- */}
                    <form onSubmit={handleUpdateAssignment} className="workspace-editor-grid">

                        {/* LEFT COLUMN: Title, Requirements Description & Reference Materials */}
                        <div className="workspace-main-column">

                            {/* Title & Description Editor Card */}
                            <div className="workspace-panel-card">
                                <div className="workspace-panel-header">
                                    <h2>Assignment Overview & Instructions</h2>
                                    <span className="workspace-panel-subtitle">Update task parameters and requirements</span>
                                </div>

                                <div className="workspace-form-group">
                                    <label htmlFor="edit-assign-title">Assignment Title</label>
                                    <input
                                        id="edit-assign-title"
                                        type="text"
                                        className="workspace-input-text"
                                        placeholder="e.g., Assignment 2: Merge Sort"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="workspace-form-group">
                                    <label htmlFor="edit-assign-desc">Detailed Algorithmic Requirements</label>
                                    <textarea
                                        id="edit-assign-desc"
                                        className="workspace-textarea"
                                        placeholder="Provide complete algorithmic instructions..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            {/* Guide & Reference Files Management Card */}
                            <div className="workspace-panel-card">
                                <div className="workspace-panel-header">
                                    <h3>Guide & Reference Materials</h3>
                                    <span className="workspace-panel-subtitle">{totalFilesCount} / 3 Files Total</span>
                                </div>

                                {/* Upload Dropzone for New Attachments */}
                                <input
                                    type="file"
                                    id="guide-file-picker-edit"
                                    multiple
                                    onChange={handleFileChange}
                                    accept=".pdf,.txt,.docx,.zip,.png,.jpg,.py,.java"
                                    style={{ display: 'none' }}
                                    disabled={totalFilesCount >= 3}
                                />

                                <div
                                    className={`workspace-dropzone-box ${isDragging ? 'dragging' : ''} ${totalFilesCount >= 3 ? 'disabled' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="workspace-dropzone-icon">
                                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                    </div>

                                    <label htmlFor="guide-file-picker-edit" className="workspace-btn-choose">
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                                        </svg>
                                        Upload New Guide Files
                                    </label>
                                    <span className="workspace-dropzone-sub">
                                        {totalFilesCount >= 3 
                                            ? 'Maximum of 3 guide files reached' 
                                            : `You can upload ${3 - totalFilesCount} more file(s) (PDF, TXT, DOCX, ZIP, PY, JAVA)`}
                                    </span>
                                </div>

                                {/* List of Current / Existing Attachments */}
                                {existingAttachments.length > 0 && (
                                    <div style={{ marginTop: '20px' }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                                            Existing Guide Files
                                        </label>
                                        <div className="workspace-files-grid">
                                            {existingAttachments.map(att => {
                                                const isMarkedForDeletion = deletedAttachmentIds.includes(att.id);

                                                return (
                                                    <div 
                                                        key={att.id} 
                                                        className="workspace-file-chip"
                                                        style={{
                                                            opacity: isMarkedForDeletion ? 0.45 : 1,
                                                            borderColor: isMarkedForDeletion ? 'rgba(239, 68, 68, 0.4)' : undefined,
                                                            background: isMarkedForDeletion ? 'rgba(239, 68, 68, 0.05)' : undefined
                                                        }}
                                                    >
                                                        <div className="workspace-file-left">
                                                            <div className="workspace-file-icon-wrap" style={{ color: isMarkedForDeletion ? '#ef4444' : undefined, background: isMarkedForDeletion ? 'rgba(239, 68, 68, 0.15)' : undefined }}>
                                                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                                </svg>
                                                            </div>
                                                            <div className="workspace-file-meta">
                                                                <strong className="workspace-file-name" style={{ textDecoration: isMarkedForDeletion ? 'line-through' : 'none' }}>
                                                                    {att.filename}
                                                                </strong>
                                                                {isMarkedForDeletion && (
                                                                    <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>Marked for deletion</span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            {!isMarkedForDeletion ? (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="workspace-btn-preview-file"
                                                                        onClick={() => handleOpenInNewTab(att)}
                                                                        title={`Preview ${att.filename}`}
                                                                    >
                                                                        Preview Document ↗
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="workspace-btn-remove-file"
                                                                        onClick={() => handleRemoveExistingAttachment(att.id)}
                                                                        title="Delete this file"
                                                                    >
                                                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                                        </svg>
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-main)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                                                                    onClick={() => handleRestoreExistingAttachment(att.id)}
                                                                >
                                                                    Undo
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* List of Newly Staged Guide Files */}
                                {newGuideFiles.length > 0 && (
                                    <div style={{ marginTop: '16px' }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                                            + Newly Added Guide Files (Will Upload on Save)
                                        </label>
                                        <div className="workspace-files-grid">
                                            {newGuideFiles.map((file, idx) => (
                                                <div key={idx} className="workspace-file-chip" style={{ borderColor: 'rgba(99, 102, 241, 0.4)', background: 'rgba(99, 102, 241, 0.06)' }}>
                                                    <div className="workspace-file-left">
                                                        <div className="workspace-file-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
                                                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                                                            </svg>
                                                        </div>
                                                        <div className="workspace-file-meta">
                                                            <strong className="workspace-file-name">{file.name}</strong>
                                                            <span className="workspace-file-size">{formatFileSize(file.size)}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="workspace-btn-remove-file"
                                                        onClick={() => handleRemoveNewFile(idx)}
                                                        title="Cancel upload"
                                                    >
                                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>

                        </div>

                        {/* RIGHT COLUMN: Settings, Deadline & Save/Delete Actions */}
                        <div className="workspace-sidebar-column">

                            <div className="workspace-panel-card">
                                <div className="workspace-panel-header">
                                    <h3>Task Configuration</h3>
                                </div>

                                <div className="workspace-form-group">
                                    <DateTimePicker
                                        label="Submission Deadline"
                                        name="deadline"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="workspace-form-group">
                                    <label htmlFor="edit-assign-score">Maximum Score (Points)</label>
                                    <input
                                        id="edit-assign-score"
                                        type="number"
                                        className="workspace-input-text hide-arrows"
                                        min={1}
                                        value={maxScore}
                                        onChange={(e) => setMaxScore(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="workspace-form-group">
                                    <label htmlFor="edit-assign-lang">Programming Language</label>
                                    <select
                                        id="edit-assign-lang"
                                        className="workspace-select"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        required
                                    >
                                        <option value="python">Python (.py)</option>
                                        <option value="java">Java (.java)</option>
                                    </select>
                                </div>

                                <div className="workspace-actions-group">
                                    <button
                                        type="submit"
                                        className="btn-workspace-submit"
                                        disabled={isSaving || isDeleting}
                                    >
                                        {isSaving ? (
                                            <>
                                                <span className="workspace-spinner"></span>
                                                Saving Changes...
                                            </>
                                        ) : (
                                            'Save Task Changes'
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn-workspace-delete"
                                        onClick={handleDelete}
                                        disabled={isSaving || isDeleting}
                                    >
                                        {isDeleting ? (
                                            'Deleting Task...'
                                        ) : (
                                            <>
                                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                                Delete Assignment
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                        </div>

                    </form>

                </div>
            </div>
        </InstructorWrapper>
    );
};

export default InstructorEditAssignmentView;
