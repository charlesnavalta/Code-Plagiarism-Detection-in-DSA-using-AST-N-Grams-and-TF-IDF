import React from 'react';
import './SubmitFileModal.css'; // Reusing your existing HUD CSS!

const ViewAssignmentModal = ({ isOpen, onClose, assignment }) => {
    if (!isOpen || !assignment) return null;

    const language = assignment.language ? assignment.language.toUpperCase() : 'PYTHON';
    const isLocked = assignment.has_submitted;

    return (
        <div className="falsicode-hud-overlay">
            <div className="spatial-card hud-modal-content fade-in">
                <div className="hud-header">
                    <button type="button" className="btn-close-icon" onClick={onClose}>&times;</button>
                    <h2>Task Parameters</h2>
                    <p className="hud-subtitle">Viewing details for TASK {String(assignment.id).padStart(2, '0')}</p>
                </div>
                
                <div className="hud-body" style={{ padding: '30px', maxHeight: '65vh', overflowY: 'auto' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>{assignment.title}</h3>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                TARGET: {language}
                            </span>
                            <span style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af' }}>
                                MAX SCORE: {assignment.max_score}
                            </span>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>Description & Requirements</h4>
                        <p style={{ margin: 0, color: '#e2e8f0', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                            {assignment.description}
                        </p>
                    </div>

                    {isLocked && (
                        <div style={{ marginTop: '20px', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '3px solid #10b981', padding: '12px 15px', borderRadius: '4px' }}>
                            <strong style={{ color: '#10b981', fontSize: '0.85rem' }}>✓ Submission Locked:</strong>
                            <span style={{ color: '#a7f3d0', fontSize: '0.85rem', marginLeft: '8px' }}>Your code has been deployed and is currently evaluating.</span>
                        </div>
                    )}
                </div>
                
                <div style={{ padding: '20px 30px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn-glass-action" onClick={onClose}>Close Viewer</button>
                </div>
            </div>
        </div>
    );
};

export default ViewAssignmentModal;