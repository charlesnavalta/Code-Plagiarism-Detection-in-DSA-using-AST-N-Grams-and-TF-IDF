import React, { useState } from 'react';
import api from '../../../services/api';
import './SubmitFileModal.css';

const SubmitFileModal = ({ isOpen, onClose, assignment, classroomId, onSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDeploying, setIsDeploying] = useState(false);

    if (!isOpen || !assignment) return null;

    const isJava = assignment.language?.toLowerCase() === 'java';
    const fileExtension = isJava ? '.java' : '.py';

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return alert("Please select a file to deploy.");

        setIsDeploying(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await api.post(`/classrooms/${classroomId}/assignments/${assignment.id}/submit`, formData);
            onSuccess(assignment.id);
            setSelectedFile(null);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Upload failed: " + (error.response?.data?.error || error.message));
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div className="falsicode-hud-overlay">
            <div className="spatial-card hud-modal-content fade-in">
                <div className="hud-header">
                    <button type="button" className="btn-close-icon" onClick={onClose} disabled={isDeploying}>&times;</button>
                    <h2>Initialize Source File</h2>
                    <p className="hud-subtitle">Upload your {isJava ? 'Java' : 'Python'} implementation for TASK {String(assignment.id).padStart(2, '0')}</p>
                </div>
                
                <div className="hud-body" style={{ padding: '20px' }}>
                    <div className="warning-banner" style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #ef4444', color: '#fca5a5', padding: '12px 15px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '20px' }}>
                        <strong>Warning:</strong> This system enforces a One-Time Lock. Once deployed, your file will be structurally analyzed and locked for grading.
                    </div>

                    <form onSubmit={handleFileUpload}>
                        <div className="input-group" style={{ textAlign: 'center', padding: '30px', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px', background: 'rgba(0,0,0,0.2)' }}>
                            <input 
                                type="file" 
                                accept={fileExtension} 
                                id="file-upload" 
                                style={{ display: 'none' }} 
                                onChange={handleFileChange} 
                            />
                            
                            {!selectedFile ? (
                                <label htmlFor="file-upload" className="btn-glass-action" style={{ display: 'inline-block', cursor: 'pointer' }}>
                                    Select {fileExtension} File
                                </label>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', padding: '10px 20px', borderRadius: '8px', color: '#3b82f6', fontFamily: 'monospace' }}>
                                        {selectedFile.name}
                                    </div>
                                    <label htmlFor="file-upload" style={{ fontSize: '0.8rem', color: '#9ca3af', cursor: 'pointer', textDecoration: 'underline' }}>
                                        Change File
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="hud-footer-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn-glass-action" onClick={onClose} disabled={isDeploying}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-hud-run" disabled={isDeploying || !selectedFile}>
                                {isDeploying ? 'Securing Node...' : 'Deploy Node'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubmitFileModal;