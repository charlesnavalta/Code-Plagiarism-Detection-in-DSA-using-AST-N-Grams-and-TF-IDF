import React from 'react';
// We keep the CSS import, though unique footer styles will be unused now
import './ViewAssignmentModal.css'; 
// Shared Foundation Skeleton
import BaseModal from '../shared/BaseModal';
import { formatLanguageDisplay } from '../../utils/fileUtils';

const ViewAssignmentModal = ({ isOpen, onClose, assignment }) => {
    // Basic guard clause: render nothing if modal shouldn't be visible
    if (!isOpen || !assignment) return null;

    // Formatting utilities
    const languageLabel = formatLanguageDisplay(assignment.language);
    const isLocked = assignment.has_submitted;

    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={onClose} 
            // Header configuration
            title="Task Parameters" 
            subtitle={`Viewing details for TASK ${String(assignment.id).padStart(2, '0')}`}
        >
            {/* Main scrollable body area */}
            <div className="hud-modal-body">
                {/* Assignment Title and Badges */}
                <div className="view-modal-title-group">
                    <h3 className="view-modal-title">{assignment.title}</h3>
                    <div className="view-modal-badges">
                        <span className="badge-target">TARGET: {languageLabel}</span>
                        <span className="badge-score">MAX SCORE: {assignment.max_score}</span>
                    </div>
                </div>

                {/* Primary Description Area */}
                <div className="view-modal-desc-box">
                    <h4 className="view-modal-desc-title">Description & Requirements</h4>
                    <p className="view-modal-desc-text">{assignment.description}</p>
                </div>

                {/* Warning Banner - only shown if already submitted */}
                {isLocked && (
                    <div className="view-modal-locked-banner">
                        <strong className="locked-text-strong">✓ Submission Locked:</strong>
                        <span className="locked-text-sub">Your code has been deployed and is currently evaluating.</span>
                    </div>
                )}
            </div>
            
            {/* 🌟 FOOTER REMOVED from here for a cleaner, non-redundant UI */}
        </BaseModal>
    );
};

export default ViewAssignmentModal;