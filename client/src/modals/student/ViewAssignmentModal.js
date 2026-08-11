import React from 'react';
import api from '../../services/api';
import './ViewAssignmentModal.css'; 
import BaseModal from '../shared/BaseModal';
import { formatLanguageDisplay } from '../../utils/fileUtils';

const ViewAssignmentModal = ({ isOpen, onClose, assignment }) => {
    if (!isOpen || !assignment) return null;

    const languageLabel = formatLanguageDisplay(assignment.language);
    const isLocked = assignment.has_submitted;

    // 🌟 OPEN IN NEW TAB HANDLER
    const handleOpenInNewTab = async (attachment) => {
        try {
            // Fetch the file as a blob using the Axios instance (passes your JWT token securely)
            const response = await api.get(attachment.url, { responseType: 'blob' });
            
            // Generate a local object URL and open it in a new browser tab
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const blobUrl = window.URL.createObjectURL(blob);
            
            window.open(blobUrl, '_blank');
        } catch (error) {
            console.error("Failed to open file:", error);
            alert("Failed to securely open the file preview.");
        }
    };

    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Task Parameters" 
            subtitle={`Viewing details for TASK ${String(assignment.id).padStart(2, '0')}`}
        >
            <div className="hud-modal-body">
                <div className="view-modal-title-group">
                    <h3 className="view-modal-title">{assignment.title}</h3>
                    <div className="view-modal-badges">
                        <span className="badge-target">TARGET: {languageLabel}</span>
                        <span className="badge-score">MAX SCORE: {assignment.max_score}</span>
                    </div>
                </div>

                <div className="view-modal-desc-box">
                    <h4 className="view-modal-desc-title">Description & Requirements</h4>
                    <p className="view-modal-desc-text">{assignment.description}</p>
                </div>

                {/* ATTACHMENTS AREA */}
                {assignment.attachments && assignment.attachments.length > 0 && (
                    <div className="view-modal-attachments-box">
                        <h4 className="view-modal-desc-title">Attached Guide Files</h4>
                        <div className="attachments-list">
                            {assignment.attachments.map(att => (
                                <button 
                                    key={att.id} 
                                    className="attachment-pill" 
                                    onClick={() => handleOpenInNewTab(att)}
                                    title={`Open ${att.filename} in new tab`}
                                >
                                    <svg className="attachment-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                    </svg>
                                    <span className="attachment-name">{att.filename}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isLocked && (
                    <div className="view-modal-locked-banner">
                        <strong className="locked-text-strong">✓ Submission Locked:</strong>
                        <span className="locked-text-sub">Your code has been deployed and is currently evaluating.</span>
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

export default ViewAssignmentModal;