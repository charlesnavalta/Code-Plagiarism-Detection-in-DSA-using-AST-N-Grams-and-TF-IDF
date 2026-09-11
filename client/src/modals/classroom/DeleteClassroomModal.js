// client/src/modals/classroom/DeleteClassroomModal.js
import React, { useState } from 'react';
import BaseModal from '../shared/BaseModal';
import api from '../../services/api';
import { useToast } from '../../context/NotificationContext';
import './ClassroomModals.css';

const DeleteClassroomModal = ({ isOpen, onClose, classroom, onClassroomDeleted }) => {
    const toast = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    if (!classroom) return null;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await api.delete(`/classrooms/${classroom.id}`);
            toast.success(`Classroom "${classroom.name}" was permanently deleted.`, "Classroom Deleted");
            if (onClassroomDeleted) {
                onClassroomDeleted(classroom.id);
            }
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to delete classroom.", "Error");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Delete Classroom"
            subtitle="Permanent action warning"
            isDeploying={isDeleting}
        >
            <div className="classroom-modal-body">
                <div className="modal-alert-box alert-danger">
                    <svg className="alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <div>
                        <strong>Warning: This action cannot be undone.</strong>
                        <p style={{ margin: '4px 0 0 0' }}>
                            Deleting <strong>{classroom.name}</strong> will permanently erase all assignments, student enrollments, submitted source code files, and comparative plagiarism audit reports.
                        </p>
                    </div>
                </div>

                <div className="modal-action-footer">
                    <button
                        type="button"
                        className="btn-modal-cancel"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Keep Classroom
                    </button>
                    <button
                        type="button"
                        className="btn-modal-danger"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default DeleteClassroomModal;
