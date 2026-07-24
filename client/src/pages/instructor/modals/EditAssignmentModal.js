import React, { useState, useEffect } from 'react';
import api from '../../../services/api'; 
import './EditAssignmentModal.css'; 
import DateTimePicker from '../components/DateTimePicker';

const EditAssignmentModal = ({ isOpen, onClose, assignment, onAssignmentUpdated, onAssignmentDeleted, classroomId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [maxScore, setMaxScore] = useState(100);
    const [language, setLanguage] = useState('python');
    const [deadline, setDeadline] = useState(''); 
    const [isSaving, setIsSaving] = useState(false);
    
    // 🌟 NEW: State for validation and deletion errors
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (assignment) {
            setTitle(assignment.title || '');
            setDescription(assignment.description || '');
            setMaxScore(assignment.max_score || 100);
            setLanguage(assignment.language || 'python');
            
            // FORMATTING FIX: HTML datetime-local needs 'YYYY-MM-DDThh:mm'
            if (assignment.deadline) {
                setDeadline(assignment.deadline.substring(0, 16));
            } else {
                setDeadline('');
            }
            // Clear errors when a new assignment is loaded
            setErrorMessage('');
        }
    }, [assignment]);

    if (!isOpen || !assignment) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous errors

        // ==========================================
        // 🌟 GIBBERISH / DUMMY TEXT VALIDATION
        // ==========================================
        const descTrimmed = description.trim();
        const words = descTrimmed.split(/\s+/); 

        if (descTrimmed.length < 20 || words.length < 4) {
            setErrorMessage("Description is too short. Please provide a detailed, meaningful explanation.");
            return;
        }

        const hasMashedKeys = words.some(word => word.length > 25 && !word.startsWith('http'));
        if (hasMashedKeys) {
            setErrorMessage("Invalid input detected. Please write a proper description without keyboard mashing.");
            return;
        }
        // ==========================================

        setIsSaving(true);
        try {
            const res = await api.put(`/classrooms/${classroomId}/assignments/${assignment.id}`, {
                title,
                description,
                max_score: parseInt(maxScore),
                language,
                deadline: deadline || null
            });
            onAssignmentUpdated(res.data);
            onClose();
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to update assignment: " + (error.response?.data?.error || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    // 🌟 NEW: Handle Assignment Deletion
    const handleDelete = async () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${assignment.title}"? This action cannot be undone.`);
        if (!confirmDelete) return;

        setIsSaving(true);
        setErrorMessage('');
        try {
            await api.delete(`/classrooms/${classroomId}/assignments/${assignment.id}`);
            if (onAssignmentDeleted) {
                onAssignmentDeleted(assignment.id);
            }
            onClose();
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to delete assignment: " + (error.response?.data?.error || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setErrorMessage(''); 
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content spatial-card">
                <div className="modal-header">
                    <button type="button" className="btn-close" onClick={handleClose} disabled={isSaving}>&times;</button>
                    <h2>Edit Task</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="form-wrapper">
                    
                    <div className="form-scroll-body custom-scrollbar">
                        {/* 🌟 Display validation/server errors here */}
                        {errorMessage && (
                            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                <strong>Error:</strong> {errorMessage}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Assignment Title</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Task Description</label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3" 
                                required 
                            ></textarea>
                        </div>

                        <div className="form-group">
                                <DateTimePicker 
                                    label="Deadline" 
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                />
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group half-width">
                                <label>Maximum Score</label>
                                <input 
                                    type="number" 
                                    value={maxScore}
                                    onChange={(e) => setMaxScore(e.target.value)}
                                    className="hide-arrows" 
                                    min={1}
                                    required 
                                />
                            </div>

                            <div className="form-group half-width">
                                <label>Target Language</label>
                                <select 
                                    value={language} 
                                    onChange={(e) => setLanguage(e.target.value)} 
                                    className="dropdown-fix" 
                                    required
                                >
                                    <option value="python">Python (.py)</option>
                                    <option value="java">Java (.java)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="modal-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* 🌟 NEW: Delete Button on the left */}
                        <button 
                            type="button" 
                            onClick={handleDelete} 
                            disabled={isSaving} 
                            style={{ backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '8px 16px', borderRadius: '4px' }}
                        >
                            Delete
                        </button>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={handleClose} disabled={isSaving}>
                                Cancel
                            </button>
                            <button type="submit" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAssignmentModal;