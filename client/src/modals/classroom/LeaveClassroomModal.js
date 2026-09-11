// client/src/modals/classroom/LeaveClassroomModal.js
import React, { useState } from 'react';
import BaseModal from '../shared/BaseModal';
import api from '../../services/api';
import { useToast } from '../../context/NotificationContext';
import './ClassroomModals.css';

const LeaveClassroomModal = ({ isOpen, onClose, classroom, onClassroomLeft }) => {
    const toast = useToast();
    const [isLeaving, setIsLeaving] = useState(false);

    if (!classroom) return null;

    const handleLeave = async () => {
        setIsLeaving(true);
        try {
            await api.post(`/classrooms/${classroom.id}/leave`);
            toast.success(`You have unenrolled from ${classroom.name}.`, "Classroom Left");
            if (onClassroomLeft) {
                onClassroomLeft(classroom.id);
            }
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to leave classroom.", "Error");
        } finally {
            setIsLeaving(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Leave Classroom"
            subtitle="Confirm unenrollment from section"
            isDeploying={isLeaving}
        >
            <div className="classroom-modal-body">
                <div className="modal-alert-box alert-danger">
                    <svg className="alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <div>
                        <strong>Are you sure you want to leave this classroom?</strong>
                        <p style={{ margin: '4px 0 0 0' }}>
                            You will unenroll from <strong>{classroom.name}</strong>. You will lose direct access to assignments and announcements in this classroom. You can rejoin at any time if you have the active invite code.
                        </p>
                    </div>
                </div>

                <div className="modal-action-footer">
                    <button
                        type="button"
                        className="btn-modal-cancel"
                        onClick={onClose}
                        disabled={isLeaving}
                    >
                        Stay in Class
                    </button>
                    <button
                        type="button"
                        className="btn-modal-danger"
                        onClick={handleLeave}
                        disabled={isLeaving}
                    >
                        {isLeaving ? 'Leaving...' : 'Confirm Leave'}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default LeaveClassroomModal;
