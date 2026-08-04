import React, { useState } from 'react';
import api from '../../services/api';
import './CreateAssignmentModal.css';
import DateTimePicker from '../../components/common/DateTimePicker';
import { validateAssignmentDescription } from '../../utils/validation';

// 🌟 Import the Base Skeleton
import BaseModal from '../shared/BaseModal';

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

        const validationError = validateAssignmentDescription(description);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        try {
            const res = await api.post(`/classrooms/${classroomId}/assignments`, { 
                title, description, max_score: parseInt(max_score), language, deadline: deadline || null 
            });
            onAssignmentCreated(res.data.assignment); 
            setErrorMessage("");
            e.target.reset();
            onClose(); 
        } catch (error) {
            setErrorMessage("Failed to create assignment. Please try again.");
        }
    };

    const handleClose = () => {
        setErrorMessage(""); 
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} title="Create Assignment">
            <form onSubmit={handleCreateAssignment} className="hud-form-wrapper">
                
                <div className="hud-modal-body">
                    {errorMessage && (
                        <div className="error-banner">
                            <strong>Error:</strong> {errorMessage}
                        </div>
                    )}

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
                </div>
                
                <div className="hud-modal-footer">
                    <button type="submit" className="btn-hud-run">Create Assignment</button>
                </div>
            </form>
        </BaseModal>
    );
};

export default CreateAssignmentModal;