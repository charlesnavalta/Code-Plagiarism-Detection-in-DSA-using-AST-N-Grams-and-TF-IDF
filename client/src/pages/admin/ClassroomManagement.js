import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useSpatialSpotlight } from '../../hooks/useSpatialSpotlight';
import { useToast } from '../../context/NotificationContext';
import { AdminTableSkeleton } from './components/AdminSkeleton';
import api from '../../services/api';
import './ClassroomManagement.css';

const ClassroomManagement = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInstructorFilter, setSelectedInstructorFilter] = useState('all');

    // Modals
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activeClassroom, setActiveClassroom] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', instructor_id: '' });
    const [isSaving, setIsSaving] = useState(false);

    const dashboardRef = useRef(null);
    const [theme] = useTheme();
    const handleMouseMove = useSpatialSpotlight(dashboardRef);
    const toast = useToast();

    const fetchClassroomsData = async () => {
        setLoading(true);
        const startTime = Date.now();
        try {
            const [classRes, userRes] = await Promise.all([
                api.get('/admin/classrooms'),
                api.get('/auth/users')
            ]);
            setClassrooms(classRes.data || []);
            const allUsers = userRes.data || [];
            setInstructors(allUsers.filter(u => u.role === 'instructor'));
        } catch (error) {
            console.error("Error loading classroom management data:", error);
            toast.error("Failed to load classrooms directory.", "Data Error");
        } finally {
            const elapsed = Date.now() - startTime;
            const minDelay = 350;
            if (elapsed < minDelay) {
                await new Promise(r => setTimeout(r, minDelay - elapsed));
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassroomsData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Filter calculation
    const filteredClassrooms = useMemo(() => {
        return classrooms.filter(c => {
            const matchesSearch = 
                c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.invite_code?.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (selectedInstructorFilter === 'all') return matchesSearch;
            return matchesSearch && String(c.instructor_id) === String(selectedInstructorFilter);
        });
    }, [classrooms, searchTerm, selectedInstructorFilter]);

    // Open Edit Modal
    const handleOpenEdit = (classroom) => {
        setActiveClassroom(classroom);
        setEditFormData({
            name: classroom.name,
            instructor_id: classroom.instructor_id || ''
        });
        setShowEditModal(true);
    };

    // Save Edit
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!activeClassroom) return;

        setIsSaving(true);
        try {
            await api.put(`/admin/classrooms/${activeClassroom.id}`, editFormData);
            toast.success(`Classroom "${editFormData.name}" updated successfully.`, "Update Complete");
            setShowEditModal(false);
            fetchClassroomsData();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update classroom.", "Update Error");
        } finally {
            setIsSaving(false);
        }
    };

    // Open Delete Modal
    const handleOpenDelete = (classroom) => {
        setActiveClassroom(classroom);
        setShowDeleteModal(true);
    };

    // Confirm Delete
    const handleConfirmDelete = async () => {
        if (!activeClassroom) return;

        setIsSaving(true);
        try {
            await api.delete(`/admin/classrooms/${activeClassroom.id}`);
            toast.success(`Classroom "${activeClassroom.name}" deleted.`, "Deletion Complete");
            setShowDeleteModal(false);
            fetchClassroomsData();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to delete classroom.", "Deletion Error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        toast.info(`Invite code "${code}" copied to clipboard!`, "Copied");
    };

    if (loading) {
        return (
            <div className={`nexus-wrapper ${theme}`}>
                <div className="aurora-canvas">
                    <div className="aurora-blob blob-primary"></div>
                    <div className="aurora-blob blob-secondary"></div>
                </div>
                <AdminTableSkeleton rows={6} columns={5} />
            </div>
        );
    }

    return (
        <div className={`nexus-wrapper ${theme}`} ref={dashboardRef} onMouseMove={handleMouseMove}>
            <div className="aurora-canvas">
                <div className="aurora-blob blob-primary"></div>
                <div className="aurora-blob blob-secondary"></div>
            </div>

            <div className="admin-max-width fade-in-up">
                
                {/* --- Header Banner --- */}
                <header className="action-banner-nexus spatial-card" style={{ marginBottom: '28px' }}>
                    <div className="banner-content banner-header-split">
                        <div className="banner-text">
                            <h1>Classroom Directory</h1>
                            <p>Global Faculty Classrooms, Enrollment Metrics & Task Audits</p>
                        </div>
                        
                        <div className="header-actions">
                            <div className="invite-badge-glass static-indicator">
                                <span>Total Classrooms</span>
                                <strong>{classrooms.length}</strong>
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- Search & Filters Bar --- */}
                <div className="admin-controls-bar">
                    <div className="admin-search-box">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search by class name, instructor, code..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>✕</button>
                        )}
                    </div>

                    <div className="admin-filter-dropdown-box">
                        <label>Filter by Faculty:</label>
                        <select 
                            value={selectedInstructorFilter} 
                            onChange={(e) => setSelectedInstructorFilter(e.target.value)}
                            className="admin-select-input"
                        >
                            <option value="all">All Instructors ({instructors.length})</option>
                            {instructors.map(ins => (
                                <option key={ins.id} value={ins.id}>{ins.username} ({ins.email})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* --- Classrooms Table --- */}
                <main className="spatial-card table-card-container">
                    <div className="card-glass-layer"></div>
                    <div className="card-content relative-z" style={{ padding: 0 }}>
                        
                        <div className="table-responsive-wrapper">
                            {filteredClassrooms.length === 0 ? (
                                <div className="empty-card" style={{ padding: '60px 20px' }}>
                                    <div className="empty-icon">🏫</div>
                                    <h3>No classrooms found</h3>
                                    <p>Try clearing your search terms or verify that instructors have created classes.</p>
                                </div>
                            ) : (
                                <table className="nexus-table">
                                    <thead>
                                        <tr>
                                            <th>Classroom Information</th>
                                            <th>Invite Code</th>
                                            <th>Lead Faculty</th>
                                            <th>Students</th>
                                            <th>Tasks</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredClassrooms.map((cls) => (
                                            <tr key={cls.id}>
                                                
                                                {/* Classroom Info */}
                                                <td>
                                                    <div className="classroom-name-cell">
                                                        <div className="classroom-icon-box">🏫</div>
                                                        <div>
                                                            <strong className="classroom-main-title">{cls.name}</strong>
                                                            <span className="classroom-id-sub">Class ID #{cls.id}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Code */}
                                                <td>
                                                    <button 
                                                        className="copy-code-pill"
                                                        onClick={() => handleCopyCode(cls.invite_code)}
                                                        title="Click to copy invite code"
                                                    >
                                                        <code>{cls.invite_code}</code>
                                                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                                        </svg>
                                                    </button>
                                                </td>

                                                {/* Lead Faculty */}
                                                <td>
                                                    <div className="faculty-cell">
                                                        <div className="faculty-avatar">
                                                            {cls.instructor_name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="faculty-meta">
                                                            <strong>{cls.instructor_name}</strong>
                                                            <span>{cls.instructor_email}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Students Count */}
                                                <td>
                                                    <span className="count-pill students">
                                                        {cls.student_count} Enrolled
                                                    </span>
                                                </td>

                                                {/* Tasks Count */}
                                                <td>
                                                    <span className="count-pill assignments">
                                                        {cls.assignment_count} Tasks
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="text-right">
                                                    <div className="actions-cell-wrapper">
                                                        <button 
                                                            className="btn-icon-nexus edit" 
                                                            onClick={() => handleOpenEdit(cls)}
                                                            title="Edit Classroom"
                                                        >
                                                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                            </svg>
                                                        </button>

                                                        <button 
                                                            className="btn-icon-nexus delete" 
                                                            onClick={() => handleOpenDelete(cls)}
                                                            title="Delete Classroom"
                                                        >
                                                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </main>

            </div>

            {/* --- EDIT MODAL --- */}
            {showEditModal && activeClassroom && (
                <div className="admin-modal-overlay">
                    <div className="spatial-card admin-modal-card">
                        <div className="card-glass-layer"></div>
                        <div className="card-content relative-z" style={{ padding: '28px' }}>
                            <div className="modal-header-nexus">
                                <h3>Edit Classroom Settings</h3>
                                <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>✕</button>
                            </div>

                            <form onSubmit={handleSaveEdit} className="modal-form-nexus">
                                <div className="form-group-nexus">
                                    <label>Classroom Title</label>
                                    <input 
                                        type="text" 
                                        value={editFormData.name} 
                                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} 
                                        required 
                                    />
                                </div>

                                <div className="form-group-nexus">
                                    <label>Assigned Lead Instructor</label>
                                    <select 
                                        value={editFormData.instructor_id} 
                                        onChange={(e) => setEditFormData({ ...editFormData, instructor_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Instructor...</option>
                                        {instructors.map(ins => (
                                            <option key={ins.id} value={ins.id}>{ins.username} ({ins.email})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="modal-footer-nexus">
                                    <button type="button" className="btn-modal-cancel" onClick={() => setShowEditModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="nexus-btn-primary" disabled={isSaving}>
                                        {isSaving ? 'Updating...' : 'Save Classroom'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {showDeleteModal && activeClassroom && (
                <div className="admin-modal-overlay">
                    <div className="spatial-card admin-modal-card delete-warning-modal">
                        <div className="card-glass-layer"></div>
                        <div className="card-content relative-z" style={{ padding: '28px' }}>
                            <div className="delete-icon-alert">⚠️</div>
                            <h3>Delete Classroom Confirmation</h3>
                            <p className="delete-warning-text">
                                Are you sure you want to permanently delete <strong>"{activeClassroom.name}"</strong>?
                            </p>
                            <p className="delete-sub-warning">
                                This will cascade and delete all <strong>{activeClassroom.assignment_count} assignments</strong>, student submissions, evaluation scores, and student enrollments. This action cannot be undone.
                            </p>

                            <div className="modal-footer-nexus">
                                <button type="button" className="btn-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn-danger-confirm"
                                    onClick={handleConfirmDelete}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Deleting...' : 'Permanently Delete Classroom'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ClassroomManagement;
