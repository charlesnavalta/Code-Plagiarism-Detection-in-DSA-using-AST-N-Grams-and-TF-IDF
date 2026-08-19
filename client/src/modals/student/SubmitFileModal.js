import React, { useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/NotificationContext';
import './SubmitFileModal.css';

import BaseModal from '../shared/BaseModal';
import ModalSkeleton from '../shared/ModalSkeleton';
import { getFileExtension, validateUploadedFile } from '../../utils/fileUtils';

const SubmitFileModal = ({ isOpen, onClose, assignment, classroomId, onSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDeploying, setIsDeploying] = useState(false);
    const toast = useToast();

    if (!isOpen || !assignment) return null;

    const fileExtension = getFileExtension(assignment.language);
    const displayLanguage = assignment.language ? assignment.language.charAt(0).toUpperCase() + assignment.language.slice(1) : 'Unknown';

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();

        const validationError = validateUploadedFile(selectedFile, fileExtension);
        if (validationError) { 
            toast.warning(validationError, "Validation Notice"); 
            return; 
        }

        setIsDeploying(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await api.post(`/classrooms/${classroomId}/assignments/${assignment.id}/submit`, formData);
            toast.success("Assignment submitted successfully!", "Deployment Complete");
            onSuccess(assignment.id);
            setSelectedFile(null);
            onClose();
        } catch (error) {
            toast.error("Upload failed: " + (error.response?.data?.error || error.message), "Submission Error");
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Initialize Source File" 
            subtitle={`Upload your ${displayLanguage} implementation for TASK ${String(assignment.id).padStart(2, '0')}`}
            isDeploying={isDeploying}
        >
            {/* The form wrapper maintains the flexbox layout */}
            <form onSubmit={handleFileUpload} className="hud-form-wrapper">
                
                <div className="hud-modal-body">
                    {isDeploying ? (
                        <ModalSkeleton.FileSubmit />
                    ) : (
                        <>
                            <div className="warning-banner">
                                <strong>Warning:</strong> This system enforces a One-Time Lock. Once deployed, your file will be structurally analyzed and locked for grading.
                            </div>

                            <div className="upload-dropzone">
                                <input type="file" accept={fileExtension} id="file-upload" style={{ display: 'none' }} onChange={handleFileChange} />
                                
                                {!selectedFile ? (
                                    <label htmlFor="file-upload" className="btn-glass-action file-select-btn">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                                        </svg>
                                        Select {fileExtension} File
                                    </label>
                                ) : (
                                    <div className="selected-file-display">
                                        <div className="file-name-badge">{selectedFile.name}</div>
                                        <label htmlFor="file-upload" className="change-file-label">Change File</label>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="hud-modal-footer">
                    <button type="button" className="btn-glass-action" onClick={onClose} disabled={isDeploying}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-hud-run" disabled={isDeploying || !selectedFile}>
                        {isDeploying ? 'Securing Node...' : 'Submit Assignment'}
                    </button>
                </div>
                
            </form>
        </BaseModal>
    );
};

export default SubmitFileModal;