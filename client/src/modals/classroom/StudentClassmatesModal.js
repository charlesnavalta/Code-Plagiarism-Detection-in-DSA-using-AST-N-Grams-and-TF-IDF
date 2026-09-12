// client/src/modals/classroom/StudentClassmatesModal.js
import React, { useState, useEffect, useCallback } from 'react';
import BaseModal from '../shared/BaseModal';
import api from '../../services/api';
import { useToast } from '../../context/NotificationContext';
import './ClassroomModals.css';

const StudentClassmatesModal = ({ isOpen, onClose, classroom }) => {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [classmatesData, setClassmatesData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchClassmates = useCallback(async () => {
        if (!classroom) return;
        setLoading(true);
        try {
            const res = await api.get(`/classrooms/${classroom.id}/classmates`);
            setClassmatesData(res.data);
        } catch (err) {
            toast.error("Failed to load classmates list.", "Error");
        } finally {
            setLoading(false);
        }
    }, [classroom, toast]);

    useEffect(() => {
        if (isOpen && classroom) {
            fetchClassmates();
            setSearchTerm('');
        }
    }, [isOpen, classroom, fetchClassmates]);

    if (!classroom) return null;

    const classmates = classmatesData?.classmates || [];
    const filteredClassmates = classmates.filter(c => 
        c.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={`${classroom.name} — Classmates`}
            subtitle="Read-only peer roster to verify your section group"
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
                        placeholder="Search classmate by username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Section Stats & Privacy note */}
                <div className="roster-stats-strip">
                    <span>
                        <strong>{classmatesData?.total_classmates || 0} / {classmatesData?.max_students || 50}</strong> Enrolled Students
                    </span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                        Privacy Protected
                    </span>
                </div>

                {/* Classmates List */}
                <div className="roster-list">
                    {loading ? (
                        <div className="roster-empty-state">Loading section classmates...</div>
                    ) : filteredClassmates.length === 0 ? (
                        <div className="roster-empty-state">
                            {searchTerm ? 'No matching classmates found.' : 'No other students have enrolled in this section yet.'}
                        </div>
                    ) : (
                        filteredClassmates.map((student) => (
                            <div 
                                key={student.id} 
                                className={`roster-item-card ${student.is_you ? 'is-you-card' : ''}`}
                            >
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
                                            {student.is_you && (
                                                <span className="you-pill-badge">You</span>
                                            )}
                                        </div>
                                        <span className="roster-user-meta">
                                            Enrolled {student.enrolled_at ? new Date(student.enrolled_at).toLocaleDateString() : 'Recently'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="modal-action-footer">
                    <button type="button" className="btn-modal-cancel" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default StudentClassmatesModal;
