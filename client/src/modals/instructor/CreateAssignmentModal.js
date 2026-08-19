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

    // 🌟 Strict File Limit Handler
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 3) {
            toast.warning("You can only upload a maximum of 3 guide files.", "File Limit Exceeded");
            e.target.value = null; // Reset the input field
            setGuideFiles([]);
            return;
        }
        setGuideFiles(selectedFiles);
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

        // 🌟 Construct FormData to handle multipart/form-data file uploads
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
            // Axios will automatically configure the multipart boundaries
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
        <BaseModal isOpen={isOpen} onClose={handleClose} title="Create Assignment">
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

                    {/* 🌟 File Upload Input */}
                    <div className="input-group" style={{ marginTop: '16px' }}>
                        <label>Guide Files (Max 3)</label>
                        <input 
                            type="file" 
                            multiple 
                            onChange={handleFileChange} 
                            className="styled-input file-input"
                            accept=".pdf,.txt,.docx,.zip,.png,.jpg,.py,.java" 
                            style={{ padding: '10px' }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '6px', display: 'block' }}>
                            Upload rubrics, templates, or instructions to guide the students.
                        </span>
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