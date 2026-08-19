import React, { useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/NotificationContext';
import './CreateAssignmentModal.css';
import DateTimePicker from '../../components/common/DateTimePicker';
import { validateAssignmentDescription, validateDeadline } from '../../utils/validation';

// 🌟 Import the Base Skeleton
import BaseModal from '../shared/BaseModal';
import ModalSkeleton from '../shared/ModalSkeleton';

const CreateAssignmentModal = ({ isOpen, onClose, classroomId, onAssignmentCreated, isLoading = false }) => {
    const [guideFiles, setGuideFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const toast = useToast();

    if (!isOpen) return null;

    if (isLoading) {
        return (
            <BaseModal isOpen={isOpen} onClose={onClose} title="Create Assignment" subtitle="Initializing workspace...">
                <div className="hud-modal-body">
                    <ModalSkeleton.Form />
                </div>
            </BaseModal>
        );
    }

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
        e.target.value = null; // Reset input so same file can be re-selected
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
        setIsSubmitting(true);

        const title = e.target.title.value;
        const description = e.target.description.value;
        const max_score = e.target.max_score.value;
        const language = e.target.language.value; 
        const deadline = e.target.deadline.value;

        const validationError = validateAssignmentDescription(description);
        if (validationError) {
            toast.warning(validationError, "Validation Notice");
            setIsSubmitting(false);
            return;
        }

        const deadlineError = validateDeadline(deadline);
        if (deadlineError) {
            toast.warning(deadlineError, "Invalid Deadline");
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('max_score', max_score);
        formData.append('language', language);
        if (deadline) formData.append('deadline', deadline);

        // Append each file safely to the array
        guideFiles.forEach((file) => {
            formData.append('files', file);
        });

        try {
            const res = await api.post(`/classrooms/${classroomId}/assignments`, formData);
            toast.success("Assignment created successfully!", "Task Provisioned");
            onAssignmentCreated(res.data.assignment); 
            
            // Cleanup state and UI
            setGuideFiles([]);
            e.target.reset();
            onClose(); 
        } catch (error) {
            const errText = error.response?.data?.error || "Failed to create assignment. Please try again.";
            toast.error(errText, "Creation Failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setGuideFiles([]);
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} title="Create Assignment" subtitle="Configure assignment parameters, deadline, and reference materials.">
            <form onSubmit={handleCreateAssignment} className="hud-form-wrapper">
                <div className="hud-modal-body">

                    <div className="input-group">
                        <label>Assignment Title</label>
                        <input type="text" name="title" className="styled-input" placeholder="e.g., Assignment 2: Merge Sort" required />
                    </div>

                    <div className="input-group">
                        <label>Assignment Description</label>
                        <textarea name="description" className="styled-input" rows="4" placeholder="Enter the algorithmic requirements..." required ></textarea>
                    </div>
                    
                    <div className="input-group">
                        <DateTimePicker label="Deadline" name="deadline" />
                    </div>
                    
                    <div className="input-row">
                        <div className="input-group half-width">
                            <label>Score</label>
                            <input type="number" name="max_score" className="styled-input hide-arrows" placeholder="e.g., 100" defaultValue={100} min={1} required />
                        </div>

                        <div className="input-group half-width">
                            <label>Language</label>
                            <select name="language" className="styled-input dropdown-fix" required>
                                <option value="python">Python (.py)</option>
                                <option value="java">Java (.java)</option>
                            </select>
                        </div>
                    </div>

                    {/* 🌟 Modern Designed Guide File Upload Area */}
                    <div className="input-group guide-upload-group">
                        <div className="guide-label-row">
                            <label>Guide & Reference Materials</label>
                            <span className="file-count-indicator">{guideFiles.length}/3 Files</span>
                        </div>
                        
                        <input 
                            type="file" 
                            id="guide-file-picker"
                            multiple 
                            onChange={handleFileChange} 
                            accept=".pdf,.txt,.docx,.zip,.png,.jpg,.py,.java" 
                            style={{ display: 'none' }}
                            disabled={guideFiles.length >= 3}
                        />

                        <div 
                            className={`guide-dropzone ${isDragging ? 'dragging' : ''} ${guideFiles.length >= 3 ? 'disabled' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="dropzone-icon-badge">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                            </div>
                            
                            <div className="dropzone-text-group">
                                <label htmlFor="guide-file-picker" className="btn-choose-files">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                    Choose Files
                                </label>
                                <span className="dropzone-hint">or drag & drop here (PDF, TXT, DOCX, ZIP, PY, JAVA)</span>
                            </div>
                        </div>

                        {/* Selected Files List */}
                        {guideFiles.length > 0 && (
                            <div className="selected-guide-files-list">
                                {guideFiles.map((file, idx) => (
                                    <div key={idx} className="guide-file-card">
                                        <div className="guide-file-info">
                                            <div className="file-type-icon">
                                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                            </div>
                                            <div className="file-names-wrap">
                                                <span className="file-primary-name">{file.name}</span>
                                                <span className="file-size-tag">{formatFileSize(file.size)}</span>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            className="btn-remove-guide-file"
                                            onClick={() => handleRemoveFile(idx)}
                                            title="Remove file"
                                        >
                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
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
                
                <div className="hud-modal-footer">
                    <button type="submit" className="btn-hud-run" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Assignment"}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

export default CreateAssignmentModal;