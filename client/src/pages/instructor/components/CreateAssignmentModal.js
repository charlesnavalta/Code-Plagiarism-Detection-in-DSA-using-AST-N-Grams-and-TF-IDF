import React from 'react';
import api from '../../../services/api';

const CreateAssignmentModal = ({ isOpen, onClose, classroomId, onAssignmentCreated }) => {
    if (!isOpen) return null;

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const description = e.target.description.value;
        const max_score = e.target.max_score.value; // <-- Get the max score

        try {
            // Send max_score to the Flask backend
            const res = await api.post(`/classrooms/${classroomId}/assignments`, { 
                title, 
                description, 
                max_score: parseInt(max_score) 
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
                    <button className="btn-close-icon" onClick={onClose}>&times;</button>
                    <h2>Deploy Task</h2>
                    <p className="hud-subtitle">Create a new coding assignment for your students</p>
                </div>
                
                <div className="hud-body" style={{ padding: '20px' }}>
                    <form onSubmit={handleCreateAssignment}>
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
                            <label>Task Description</label>
                            <textarea 
                                name="description" 
                                className="styled-input" 
                                rows="3" 
                                placeholder="Enter the algorithmic requirements..." 
                                required 
                                style={{ resize: 'vertical' }}
                            ></textarea>
                        </div>
                        
                        {/* --- NEW MAX SCORE INPUT --- */}
                        <div className="input-group">
                            <label>Maximum Score (Points)</label>
                            <input 
                                type="number" 
                                name="max_score" 
                                className="styled-input" 
                                placeholder="e.g., 50" 
                                defaultValue={100}
                                min={1}
                                required 
                            />
                        </div>
                        
                        <div className="hud-footer-actions" style={{ marginTop: '20px' }}>
                            <button type="submit" className="btn-hud-run">Deploy to Classroom</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAssignmentModal;