import React, { useState, useEffect } from 'react';
import api from '../../services/api'; 
import './EditAssignmentModal.css'; 
import DateTimePicker from '../../components/common/DateTimePicker';
import { validateAssignmentDescription } from '../../utils/validation';

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

    useEffect(() => {
        if (assignment) {
            setTitle(assignment.title || '');
            setDescription(assignment.description || '');
            setMaxScore(assignment.max_score || 100);
            setLanguage(assignment.language || 'python');
            setDeadline(assignment.deadline ? assignment.deadline.substring(0, 16) : '');
            setErrorMessage('');
        }
    }, [assignment]);

    if (!isOpen || !assignment) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); 

        const validationError = validateAssignmentDescription(description);
        if (validationError) { setErrorMessage(validationError); return; }

        setIsSaving(true);
        try {
            const res = await api.put(`/classrooms/${classroomId}/assignments/${assignment.id}`, {
                title, description, max_score: parseInt(maxScore), language, deadline: deadline || null
            });
            onAssignmentUpdated(res.data);
            onClose();
        } catch (error) {
            setErrorMessage("Failed to update: " + (error.response?.data?.error || error.message));
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
                    {errorMessage && (
                        <div className="error-banner">
                            <strong>Error:</strong> {errorMessage}
                        </div>
                    )}

                    <div className="input-group">
                        <label>Assignment Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="styled-input" required />
                    </div>

                    <div className="input-group">
                        <label>Task Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="styled-input" rows="3" required></textarea>
                    </div>

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