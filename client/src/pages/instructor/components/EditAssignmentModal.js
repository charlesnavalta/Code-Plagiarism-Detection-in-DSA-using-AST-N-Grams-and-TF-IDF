import React, { useState, useEffect } from 'react';
import api from '../../../services/api'; 
import './EditAssignmentModal.css'; 

const EditAssignmentModal = ({ isOpen, onClose, assignment, onAssignmentUpdated, classroomId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [maxScore, setMaxScore] = useState(100);
    const [language, setLanguage] = useState('python');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (assignment) {
            setTitle(assignment.title || '');
            setDescription(assignment.description || '');
            setMaxScore(assignment.max_score || 100);
            setLanguage(assignment.language || 'python');
        }
    }, [assignment]);

    if (!isOpen || !assignment) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await api.put(`/classrooms/${classroomId}/assignments/${assignment.id}`, {
                title,
                description,
                max_score: parseInt(maxScore),
                language
            });
            onAssignmentUpdated(res.data);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to update assignment: " + (error.response?.data?.error || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content spatial-card">
                <div className="modal-header">
                    <button type="button" className="btn-close" onClick={onClose} disabled={isSaving}>&times;</button>
                    <h2 >Edit Task</h2>
                </div>
                
                {/* Form wraps both the scrolling body AND the pinned footer */}
                <form onSubmit={handleSubmit} className="form-wrapper">
                    
                    <div className="form-scroll-body custom-scrollbar">
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
                    
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} disabled={isSaving}>
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAssignmentModal;