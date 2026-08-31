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

const InstructorCreateAssignmentView = () => {
    const { id } = useParams();
    const classId = id;
    const navigate = useNavigate();
    const toast = useToast();
    const [theme] = useTheme();
    const pageRef = useRef(null);
    const handleMouseMove = useSpatialSpotlight(pageRef);

    const [classroom, setClassroom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Form Fields State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [maxScore, setMaxScore] = useState(100);
    const [language, setLanguage] = useState('python');
    const [deadline, setDeadline] = useState('');
    const [guideFiles, setGuideFiles] = useState([]);

    useEffect(() => {
        const fetchClassroom = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/classrooms/${classId}`);
                setClassroom(res.data);
            } catch (err) {
                toast.error("Could not load classroom details.", "Access Error");
                navigate(`/instructor/class/${classId}`);
            } finally {
                setLoading(false);
            }
        };
        fetchClassroom();
    }, [classId, navigate, toast]);

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const processFiles = (newFiles) => {
        const combined = [...guideFiles, ...newFiles];
        if (combined.length > 3) {
            toast.warning("You can only upload a maximum of 3 guide files.", "File Limit Exceeded");
            setGuideFiles(combined.slice(0, 3));
            return;
        }
        setGuideFiles(combined);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            processFiles(selectedFiles);
        }
        e.target.value = null;
    };

    const handleRemoveFile = (indexToRemove) => {
        setGuideFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
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
            processFiles(droppedFiles);
        }
    };

    const handleCreateAssignment = async (e) => {
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

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('max_score', maxScore);
        formData.append('language', language);
        formData.append('deadline', deadline);

        guideFiles.forEach((file) => {
            formData.append('files', file);
        });

        try {
            await api.post(`/classrooms/${classId}/assignments`, formData);
            toast.success("Assignment created and provisioned successfully!", "Task Created");
            navigate(`/instructor/class/${classId}`);
        } catch (error) {
            const errText = error.response?.data?.error || "Failed to create assignment. Please try again.";
            toast.error(errText, "Creation Failed");
        } finally {
            setIsSubmitting(false);
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

                        <span className="workspace-nav-badge badge-mode-create">
                            Create Assignment
                        </span>
                    </div>

                    {/* --- HERO HEADER BANNER (LIVE PREVIEW) --- */}
                    <div className="workspace-hero-card">
                        <div className="workspace-hero-meta-row">
                            <span className="workspace-task-pill">NEW TASK • {displayLanguage}</span>
                            <span className="workspace-score-pill">MAX SCORE: {maxScore || 100} PTS</span>
                        </div>

                        <h1 className={`workspace-hero-title ${!title.trim() ? 'placeholder' : ''}`}>
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
                    <form onSubmit={handleCreateAssignment} className="workspace-editor-grid">

                        {/* LEFT COLUMN: Title, Requirements Description & Guide Files */}
                        <div className="workspace-main-column">

                            {/* Title & Description Editor Card */}
                            <div className="workspace-panel-card">
                                <div className="workspace-panel-header">
                                    <h2>Assignment Overview & Instructions</h2>
                                    <span className="workspace-panel-subtitle">Define clear requirements for students</span>
                                </div>

                                <div className="workspace-form-group">
                                    <label htmlFor="create-assign-title">Assignment Title</label>
                                    <input
                                        id="create-assign-title"
                                        type="text"
                                        className="workspace-input-text"
                                        placeholder="e.g., Assignment 2: Merge Sort & Complexity Analysis"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="workspace-form-group">
                                    <label htmlFor="create-assign-desc">Detailed Algorithmic Requirements</label>
                                    <textarea
                                        id="create-assign-desc"
                                        className="workspace-textarea"
                                        placeholder="Provide complete algorithmic instructions, constraints, and function signatures expected..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            {/* Guide Reference Materials Card */}
                            <div className="workspace-panel-card">
                                <div className="workspace-panel-header">
                                    <h3>Guide & Reference Materials</h3>
                                    <span className="workspace-panel-subtitle">{guideFiles.length} / 3 Files Attached</span>
                                </div>

                                <input
                                    type="file"
                                    id="guide-file-picker-full"
                                    multiple
                                    onChange={handleFileChange}
                                    accept=".pdf,.txt,.docx,.zip,.png,.jpg,.py,.java"
                                    style={{ display: 'none' }}
                                    disabled={guideFiles.length >= 3}
                                />

                                <div
                                    className={`workspace-dropzone-box ${isDragging ? 'dragging' : ''} ${guideFiles.length >= 3 ? 'disabled' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="workspace-dropzone-icon">
                                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                    </div>

                                    <label htmlFor="guide-file-picker-full" className="workspace-btn-choose">
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                                        </svg>
                                        Choose Guide Files
                                    </label>
                                    <span className="workspace-dropzone-sub">or drag and drop PDF, TXT, DOCX, ZIP, PY, JAVA files here</span>
                                </div>

                                {/* Attached Files Chips */}
                                {guideFiles.length > 0 && (
                                    <div className="workspace-files-grid">
                                        {guideFiles.map((file, idx) => (
                                            <div key={idx} className="workspace-file-chip">
                                                <div className="workspace-file-left">
                                                    <div className="workspace-file-icon-wrap">
                                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
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
                                                    onClick={() => handleRemoveFile(idx)}
                                                    title="Remove attachment"
                                                >
                                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Settings, Deadline & Deployment Action */}
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
                                    <label htmlFor="create-assign-score">Maximum Score (Points)</label>
                                    <input
                                        id="create-assign-score"
                                        type="number"
                                        className="workspace-input-text hide-arrows"
                                        min={1}
                                        value={maxScore}
                                        onChange={(e) => setMaxScore(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="workspace-form-group">
                                    <label htmlFor="create-assign-lang">Programming Language</label>
                                    <select
                                        id="create-assign-lang"
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
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="workspace-spinner"></span>
                                                Provisioning Task...
                                            </>
                                        ) : (
                                            <>
                                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                                                </svg>
                                                Create & Deploy Task →
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

export default InstructorCreateAssignmentView;
