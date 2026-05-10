import React, { useState, useEffect } from 'react';
import api from '../../../services/api'; 
// Notice we are importing the Create modal's CSS here to keep the UI perfectly identical!
import './CreateAssignmentModal.css'; 

const EditAssignmentModal = ({ isOpen, onClose, assignment, onAssignmentUpdated, classroomId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [maxScore, setMaxScore] = useState(100);
    const [language, setLanguage] = useState('python');
    const [isSaving, setIsSaving] = useState(false);

    // Populate the form when the modal opens with the specific assignment data
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
            // 2. 🌟 Update the URL to include the classroomId
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
        <div className="falsicode-hud-overlay">
            <div className="spatial-card hud-modal-content fade-in">
                <div className="hud-header">
                    <button type="button" className="btn-close-icon" onClick={onClose} disabled={isSaving}>&times;</button>
                    <h2>Edit Task</h2>
                    <p className="hud-subtitle">Update parameters for TASK_{String(assignment.id).padStart(2, '0')}</p>
                </div>
                
                <div className="hud-body" style={{ padding: '20px', maxHeight: '65vh', overflowY: 'auto' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Assignment Title</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="styled-input" 
                                required 
                            />
                        </div>

                        <div className="input-group">
                            <label>Task Description</label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="styled-input" 
                                rows="3" 
                                required 
                                style={{ resize: 'vertical' }}
                            ></textarea>
                        </div>
                        
                        <div className="input-group">
                            <label>Maximum Score (Points)</label>
                            <input 
                                type="number" 
                                value={maxScore}
                                onChange={(e) => setMaxScore(e.target.value)}
                                className="styled-input" 
                                min={1}
                                required 
                            />
                        </div>

                        <div className="input-group">
                            <label>Target Language</label>
                            <select 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value)} 
                                className="styled-input" 
                                required
                            >
                                <option value="python">Python (.py)</option>
                                <option value="java">Java (.java)</option>
                            </select>
                        </div>
                        
                        <div className="hud-footer-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn-glass-action" onClick={onClose} disabled={isSaving}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-hud-run" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditAssignmentModal;