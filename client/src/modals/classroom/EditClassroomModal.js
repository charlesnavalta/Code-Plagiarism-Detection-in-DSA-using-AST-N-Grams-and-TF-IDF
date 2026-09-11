// client/src/modals/classroom/EditClassroomModal.js
import React, { useState, useEffect } from 'react';
import BaseModal from '../shared/BaseModal';
import api from '../../services/api';
import { useToast } from '../../context/NotificationContext';
import './ClassroomModals.css';

const EditClassroomModal = ({ isOpen, onClose, classroom, onClassroomUpdated }) => {
    const toast = useToast();
    const [name, setName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    useEffect(() => {
        if (classroom) {
            setName(classroom.name || '');
            setInviteCode(classroom.invite_code || '');
        }
    }, [classroom]);

    if (!classroom) return null;

    const handleCopyCode = () => {
        if (inviteCode) {
            navigator.clipboard.writeText(inviteCode);
            toast.success(`Invite code "${inviteCode}" copied to clipboard!`, "Code Copied");
        }
    };

    const handleRegenerateCode = async () => {
        setIsRegenerating(true);
        try {
            const res = await api.post(`/classrooms/${classroom.id}/regenerate-code`);
            const newCode = res.data.invite_code;
            setInviteCode(newCode);
            toast.success(`New invite code generated: ${newCode}`, "Code Updated");
            if (onClassroomUpdated) {
                onClassroomUpdated({ ...classroom, invite_code: newCode });
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to regenerate invite code.", "Error");
        } finally {
            setIsRegenerating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            return toast.warning("Classroom name cannot be empty.", "Validation");
        }

        setIsSubmitting(true);
        try {
            const res = await api.put(`/classrooms/${classroom.id}`, { name: trimmed });
            toast.success("Classroom renamed successfully!", "Updated");
            if (onClassroomUpdated) {
                onClassroomUpdated(res.data.classroom);
            }
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to update classroom.", "Error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Classroom"
            subtitle="Update classroom details and manage invite credentials"
            isDeploying={isSubmitting}
        >
            <form onSubmit={handleSubmit} className="classroom-modal-body">
                <div className="modal-form-group">
                    <label className="modal-label" htmlFor="edit-class-name">
                        Classroom Name
                    </label>
                    <input
                        id="edit-class-name"
                        type="text"
                        className="modal-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., 3CSB - Different Scenarios"
                        maxLength={100}
                        required
                        disabled={isSubmitting}
                        autoFocus
                    />
                </div>

                <div className="modal-form-group">
                    <label className="modal-label">Student Invite Code</label>
                    <div className="code-display-box">
                        <span className="code-value-large">{inviteCode}</span>
                        <div className="code-actions-cluster">
                            <button
                                type="button"
                                className="btn-code-action"
                                onClick={handleCopyCode}
                                title="Copy invite code"
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                                Copy
                            </button>
                            <button
                                type="button"
                                className="btn-code-action"
                                onClick={handleRegenerateCode}
                                disabled={isRegenerating || isSubmitting}
                                title="Generate a new invite code"
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={isRegenerating ? 'spin-icon' : ''}>
                                    <polyline points="23 4 23 10 17 10"></polyline>
                                    <polyline points="1 20 1 14 7 14"></polyline>
                                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                </svg>
                                {isRegenerating ? 'Rolling...' : 'Regenerate'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="modal-action-footer">
                    <button
                        type="button"
                        className="btn-modal-cancel"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-modal-primary"
                        disabled={isSubmitting || !name.trim()}
                    >
                        {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

export default EditClassroomModal;
