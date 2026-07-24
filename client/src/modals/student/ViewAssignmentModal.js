import React from 'react';
import './ViewAssignmentModal.css'; // 🌟 Clean, dedicated CSS import

// 🌟 Import the DRY utility
import { formatLanguageDisplay } from '../../utils/fileUtils';

const ViewAssignmentModal = ({ isOpen, onClose, assignment }) => {
    if (!isOpen || !assignment) return null;

    // 🌟 Utility handles the formatting
    const languageLabel = formatLanguageDisplay(assignment.language);
    const isLocked = assignment.has_submitted;

    return (
        <div className="falsicode-hud-overlay">
            <div className="spatial-card hud-modal-content fade-in">
                <div className="hud-header">
                    <button type="button" className="btn-close-icon" onClick={onClose}>&times;</button>
                    <h2>Task Parameters</h2>
                    <p className="hud-subtitle">Viewing details for TASK {String(assignment.id).padStart(2, '0')}</p>
                </div>
                
                {/* 🌟 Notice how much cleaner the HTML structure is now! */}
                <div className="hud-body view-modal-body custom-scrollbar">
                    <div className="view-modal-title-group">
                        <h3 className="view-modal-title">{assignment.title}</h3>
                        <div className="view-modal-badges">
                            <span className="badge-target">
                                TARGET: {languageLabel}
                            </span>
                            <span className="badge-score">
                                MAX SCORE: {assignment.max_score}
                            </span>
                        </div>
                    </div>

                    <div className="view-modal-desc-box">
                        <h4 className="view-modal-desc-title">Description & Requirements</h4>
                        <p className="view-modal-desc-text">
                            {assignment.description}
                        </p>
                    </div>

                    {isLocked && (
                        <div className="view-modal-locked-banner">
                            <strong className="locked-text-strong">✓ Submission Locked:</strong>
                            <span className="locked-text-sub">Your code has been deployed and is currently evaluating.</span>
                        </div>
                    )}
                </div>
                
                <div className="view-modal-footer">
                    <button className="btn-glass-action" onClick={onClose}>Close Viewer</button>
                </div>
            </div>
        </div>
    );
};

export default ViewAssignmentModal;