import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 
import { useToast } from '../../context/NotificationContext';
import './EditAssignmentModal.css'; 
import DateTimePicker from '../../components/common/DateTimePicker';
import { validateAssignmentDescription, validateDeadline } from '../../utils/validation';

// 🌟 Import the Base Skeleton
import BaseModal from '../shared/BaseModal';

const EditAssignmentModal = ({ isOpen, onClose, assignment, onAssignmentUpdated, onAssignmentDeleted, classroomId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [maxScore, setMaxScore] = useState(100);
    const [language, setLanguage] = useState('python');
    const [deadline, setDeadline] = useState(''); 
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const toast = useToast();

    useEffect(() => {
        if (assignment) {
            setTitle(assignment.title || '');
            setDescription(assignment.description || '');
            setMaxScore(assignment.max_score || 100);
            setLanguage(assignment.language || 'python');
            setDeadline(assignment.deadline || '');
            setErrorMessage('');
        }
    }, [assignment]);

    if (!isOpen || !assignment) return null;

    // 🌟 SECURE OPEN IN NEW TAB HANDLER FOR INSTRUCTORS
    const handleOpenInNewTab = async (attachment) => {
        try {
            const response = await api.get(attachment.url, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const blobUrl = window.URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        } catch (error) {
            console.error("Failed to open file:", error);
            toast.error("Failed to securely open the file preview.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); 

        const validationError = validateAssignmentDescription(description);
        if (validationError) { 
            setErrorMessage(validationError); 
            toast.warning(validationError, "Validation Notice");
            return; 
        }

        // Validate deadline if provided or changed
        const deadlineError = validateDeadline(deadline);
        if (deadlineError) {
            setErrorMessage(deadlineError);
            toast.warning(deadlineError, "Invalid Deadline");
            return;
        }

        setIsSaving(true);
        try {
            const res = await api.put(`/classrooms/${classroomId}/assignments/${assignment.id}`, {
                title, description, max_score: parseInt(maxScore), language, deadline: deadline || null
            });
            toast.success("Assignment parameters updated successfully!", "Task Updated");
            onAssignmentUpdated(res.data);
            onClose();
        } catch (error) {
            const errText = error.response?.data?.error || error.message || "Failed to update assignment.";
            setErrorMessage(errText);
            toast.error(errText, "Update Failed");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${assignment.title}"? This action cannot be undone.`);
        if (!confirmDelete) return;

        setIsSaving(true);
        setErrorMessage('');
        try {
            await api.delete(`/classrooms/${classroomId}/assignments/${assignment.id}`);
            if (onAssignmentDeleted) onAssignmentDeleted(assignment.id);
            onClose();
        } catch (error) {
            setErrorMessage("Failed to delete: " + (error.response?.data?.error || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setErrorMessage(''); 
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} title="Edit Task" isDeploying={isSaving}>
            <form onSubmit={handleSubmit} className="hud-form-wrapper">
                <div className="hud-modal-body">

                    <div className="input-group">
                        <label>Assignment Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="styled-input" required />
                    </div>

                    <div className="input-group">
                        <label>Task Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="styled-input" rows="3" required></textarea>
                    </div>

                    {/* 🌟 EXISTING ATTACHMENTS VIEW AREA */}
                    {assignment.attachments && assignment.attachments.length > 0 && (
                        <div className="input-group">
                            <label>Current Guide Files</label>
                            <div className="attachments-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                                {assignment.attachments.map(att => (
                                    <button 
                                        type="button"
                                        key={att.id} 
                                        className="attachment-pill" 
                                        onClick={() => handleOpenInNewTab(att)}
                                        title={`View ${att.filename} in new tab`}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)',
                                            padding: '6px 12px', borderRadius: '6px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
                                        }}
                                    >
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                        </svg>
                                        <span>{att.filename}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <DateTimePicker label="Deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                    </div>
                    
                    <div className="input-row">
                        <div className="input-group half-width">
                            <label>Maximum Score</label>
                            <input type="number" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} className="styled-input hide-arrows" min={1} required />
                        </div>

                        <div className="input-group half-width">
                            <label>Target Language</label>
                            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="styled-input dropdown-fix" required>
                                <option value="python">Python (.py)</option>
                                <option value="java">Java (.java)</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="hud-modal-footer edit-footer">
                    <button type="button" onClick={handleDelete} disabled={isSaving} className="btn-delete">
                        Delete
                    </button>
                    
                    <div className="footer-right-actions">
                        <button type="button" className="btn-glass-action" onClick={handleClose} disabled={isSaving}>Cancel</button>
                        <button type="submit" className="btn-hud-run" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </BaseModal>
    );
};

export default EditAssignmentModal;