import React from 'react';
import api from '../../../services/api';
import './CreateAssignmentModal.css';

const CreateAssignmentModal = ({ isOpen, onClose, classroomId, onAssignmentCreated }) => {
    if (!isOpen) return null;

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const description = e.target.description.value;
        const max_score = e.target.max_score.value;
        const language = e.target.language.value; 

        try {
            const res = await api.post(`/classrooms/${classroomId}/assignments`, { 
                title, 
                description, 
                max_score: parseInt(max_score),
                language: language 
            });
            onAssignmentCreated(res.data.assignment); 
            onClose(); 
        } catch (error) {
            console.error(error);
            alert("Failed to create assignment.");
        }
    };

    return (
        <div className="falsicode-hud-overlay">
            <div className="spatial-card hud-modal-content fade-in">
                <div className="hud-header">
                    <button type="button" className="btn-close-icon" onClick={onClose}>&times;</button>
                    <h2>Create Assignment</h2>
                </div>
                
                {/* Form wraps both the scrolling body AND the pinned footer */}
                <form onSubmit={handleCreateAssignment} className="hud-form-wrapper">
                    
                    <div className="hud-body custom-scrollbar">
                        <div className="input-group">
                            <label>Assignment Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                className="styled-input" 
                                placeholder="e.g., Assignment 2: Merge Sort" 
                                required 
                            />
                        </div>

                        <div className="input-group">
                            <label>Assignment Description</label>
                            <textarea 
                                name="description" 
                                className="styled-input" 
                                rows="4" 
                                placeholder="Enter the algorithmic requirements..." 
                                required 
                            ></textarea>
                        </div>
                        
                        <div className="input-row">
                            <div className="input-group half-width">
                                <label>Score</label>
                                <input 
                                    type="number" 
                                    name="max_score" 
                                    className="styled-input hide-arrows" 
                                    placeholder="e.g., 100" 
                                    defaultValue={100}
                                    min={1}
                                    required 
                                />
                            </div>

                            <div className="input-group half-width">
                                <label>Language</label>
                                <select name="language" className="styled-input dropdown-fix" required>
                                    <option value="python">Python (.py)</option>
                                    <option value="java">Java (.java)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="hud-footer-actions">
                        <button type="submit" className="btn-hud-run">Create Assignment</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateAssignmentModal;