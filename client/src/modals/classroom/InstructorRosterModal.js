// client/src/modals/classroom/InstructorRosterModal.js
import React, { useState, useEffect, useCallback } from 'react';
import BaseModal from '../shared/BaseModal';
import api from '../../services/api';
import { useToast } from '../../context/NotificationContext';
import './ClassroomModals.css';

const InstructorRosterModal = ({ isOpen, onClose, classroom }) => {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [rosterData, setRosterData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [removingId, setRemovingId] = useState(null);

    const fetchRoster = useCallback(async () => {
        if (!classroom) return;
        setLoading(true);
        try {
            const res = await api.get(`/classrooms/${classroom.id}/roster`);
            setRosterData(res.data);
        } catch (err) {
            toast.error("Failed to load student roster.", "Error");
        } finally {
            setLoading(false);
        }
    }, [classroom, toast]);

    useEffect(() => {
        if (isOpen && classroom) {
            fetchRoster();
            setSearchTerm('');
        }
    }, [isOpen, classroom, fetchRoster]);

    if (!classroom) return null;

    const handleRemoveStudent = async (student) => {
        const confirmed = window.confirm(
            `Are you sure you want to remove ${student.username} from ${classroom.name}?`
        );
        if (!confirmed) return;

        setRemovingId(student.id);
        try {
            await api.delete(`/classrooms/${classroom.id}/students/${student.id}`);
            toast.success(`${student.username} was removed from the classroom.`, "Student Removed");
            setRosterData(prev => {
                if (!prev) return prev;
                const updatedStudents = prev.students.filter(s => s.id !== student.id);
                return {
                    ...prev,
                    total_students: updatedStudents.length,
                    students: updatedStudents
                };
            });
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to remove student.", "Error");
        } finally {
            setRemovingId(null);
        }
    };

    const students = rosterData?.students || [];
    const totalAssignments = rosterData?.total_assignments || 0;

    const filteredStudents = students.filter(s => 
        s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={`${classroom.name} — Student Roster`}
            subtitle="Manage enrolled students and monitor assignment completion"
            customClass="roster-modal-wide"
        >
            <div className="classroom-modal-body">
                {/* Search Bar */}
                <div className="roster-search-bar">
                    <svg className="roster-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        className="roster-search-input"
                        placeholder="Search student by username or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Status Bar */}
                <div className="roster-stats-strip">
                    <span>
                        <strong>{rosterData?.total_students || 0} / {rosterData?.max_students || 50}</strong> Enrolled Students
                    </span>
                    <span>
                        <strong>{totalAssignments}</strong> Total Assignments
                    </span>
                </div>

                {/* List Container */}
                <div className="roster-list">
                    {loading ? (
                        <div className="roster-empty-state">Loading classroom roster...</div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="roster-empty-state">
                            {searchTerm ? 'No matching students found.' : 'No students enrolled in this classroom yet.'}
                        </div>
                    ) : (
                        filteredStudents.map((student) => {
                            const completed = student.completed_assignments || 0;
                            const isAllCompleted = totalAssignments > 0 && completed >= totalAssignments;

                            return (
                                <div key={student.id} className="roster-item-card">
                                    <div className="roster-user-info">
                                        <div className="roster-avatar">
                                            {student.avatar_url ? (
                                                <img src={student.avatar_url} alt="" className="roster-avatar-img" />
                                            ) : (
                                                student.username.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="roster-user-details">
                                            <div className="roster-username-row">
                                                <span className="roster-username">{student.username}</span>
                                            </div>
                                            <span className="roster-user-meta">
                                                {student.email} • Joined {student.enrolled_at ? new Date(student.enrolled_at).toLocaleDateString() : 'Recently'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="roster-actions-side">
                                        <span className={`task-progress-pill ${isAllCompleted ? 'completed-all' : ''}`}>
                                            {completed} / {totalAssignments} Tasks
                                        </span>

                                        <button
                                            type="button"
                                            className="btn-kick-student"
                                            title={`Remove ${student.username} from classroom`}
                                            onClick={() => handleRemoveStudent(student)}
                                            disabled={removingId === student.id}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </BaseModal>
    );
};

export default InstructorRosterModal;
