import React, { useState } from 'react';
import api from '../../services/api';
import './CreateAssignmentModal.css';
import DateTimePicker from '../../components/common/DateTimePicker';

// 🌟 Import your new DRY validation helper!
import { validateAssignmentDescription } from '../../utils/validation';

const CreateAssignmentModal = ({ isOpen, onClose, classroomId, onAssignmentCreated }) => {
    const [errorMessage, setErrorMessage] = useState("");

    if (!isOpen) return null;

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        setErrorMessage(""); 

        const title = e.target.title.value;
        const description = e.target.description.value;
        const max_score = e.target.max_score.value;
        const language = e.target.language.value; 
        const deadline = e.target.deadline.value;

        // 🌟 Look how clean this is now! One line of code to check everything.
        const validationError = validateAssignmentDescription(description);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        try {
            const res = await api.post(`/classrooms/${classroomId}/assignments`, { 
                title, 
                description, 
                max_score: parseInt(max_score),
                language: language,
                deadline: deadline || null 
            });
            onAssignmentCreated(res.data.assignment); 
            
            setErrorMessage("");
            e.target.reset();
            onClose(); 
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to create assignment. Please try again.");
        }
    };

    const handleClose = () => {
        setErrorMessage(""); 
        onClose();
    };

    return (
        <div className="falsicode-hud-overlay">
            <div className="spatial-card hud-modal-content fade-in">
                <div className="hud-header">
                    <button type="button" className="btn-close-icon" onClick={handleClose}>&times;</button>
                    <h2>Create Assignment</h2>
                </div>
                
                <form onSubmit={handleCreateAssignment} className="hud-form-wrapper">
                    
                    <div className="hud-body custom-scrollbar">
                        {errorMessage && (
                            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                <strong>Error:</strong> {errorMessage}
                            </div>
                        )}

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
                        
                        <div className="input-group">
                            <DateTimePicker 
                                label="Deadline" 
                                name="deadline" 
                            />
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