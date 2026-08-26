import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useSpatialSpotlight } from '../../hooks/useSpatialSpotlight';
import { useToast } from '../../context/NotificationContext';
import { AdminTableSkeleton } from './components/AdminSkeleton';
import { formatLanguageDisplay } from '../../utils/fileUtils';
import { formatDeadline } from '../../utils/dateUtils';
import api from '../../services/api';
import './AssignmentManagement.css';

const AssignmentManagement = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [languageFilter, setLanguageFilter] = useState('all');

    // Modals
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activeAssignment, setActiveAssignment] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        language: 'python',
        max_score: 100,
        deadline: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const dashboardRef = useRef(null);
    const [theme] = useTheme();
    const handleMouseMove = useSpatialSpotlight(dashboardRef);
    const toast = useToast();

    const fetchAssignmentsData = async () => {
        setLoading(true);
        const startTime = Date.now();
        try {
            const res = await api.get('/admin/assignments');
            setAssignments(res.data || []);
        } catch (error) {
            console.error("Error loading assignments management data:", error);
            toast.error("Failed to load assignments list.", "Data Error");
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
        fetchAssignmentsData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Filtered assignments calculation
    const filteredAssignments = useMemo(() => {
        return assignments.filter(a => {
            const matchesSearch = 
                a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.classroom_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (languageFilter === 'all') return matchesSearch;
            return matchesSearch && a.language?.toLowerCase() === languageFilter.toLowerCase();
        });
    }, [assignments, searchTerm, languageFilter]);

    // Open Edit Modal
    const handleOpenEdit = (assignment) => {
        setActiveAssignment(assignment);
        setEditFormData({
            title: assignment.title,
            description: assignment.description || '',
            language: assignment.language || 'python',
            max_score: assignment.max_score || 100,
            deadline: assignment.deadline ? assignment.deadline.slice(0, 16) : ''
        });
        setShowEditModal(true);
    };

    // Save Edit
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!activeAssignment) return;

        setIsSaving(true);
        try {
            await api.put(`/admin/assignments/${activeAssignment.id}`, editFormData);
            toast.success(`Task "${editFormData.title}" updated successfully.`, "Update Complete");
            setShowEditModal(false);
            fetchAssignmentsData();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update assignment.", "Update Error");
        } finally {
            setIsSaving(false);
        }
    };

    // Open Delete Modal
    const handleOpenDelete = (assignment) => {
        setActiveAssignment(assignment);
        setShowDeleteModal(true);
    };

    // Confirm Delete
    const handleConfirmDelete = async () => {
        if (!activeAssignment) return;

        setIsSaving(true);
        try {
            await api.delete(`/admin/assignments/${activeAssignment.id}`);
            toast.success(`Task "${activeAssignment.title}" deleted.`, "Deletion Complete");
            setShowDeleteModal(false);
            fetchAssignmentsData();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to delete assignment.", "Deletion Error");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={`nexus-wrapper ${theme}`}>
                <div className="aurora-canvas">
                    <div className="aurora-blob blob-primary"></div>
                    <div className="aurora-blob blob-secondary"></div>
                </div>
                <AdminTableSkeleton rows={6} columns={6} />
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
                            <h1>Assignment Registry</h1>
                            <p>Global Programming Tasks, Code Formats & Plagiarism Analysis Queues</p>
                        </div>
                        
                        <div className="header-actions">
                            <div className="invite-badge-glass static-indicator">
                                <span>Total Assignments</span>
                                <strong>{assignments.length}</strong>
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
                            placeholder="Search by assignment title, class, faculty..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>✕</button>
                        )}
                    </div>

                    <div className="admin-filter-pills">
                        <button 
                            className={`filter-pill ${languageFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setLanguageFilter('all')}
                        >
                            All ({assignments.length})
                        </button>
                        <button 
                            className={`filter-pill ${languageFilter === 'python' ? 'active' : ''}`}
                            onClick={() => setLanguageFilter('python')}
                        >
                            Python ({assignments.filter(a => a.language?.toLowerCase() === 'python').length})
                        </button>
                        <button 
                            className={`filter-pill ${languageFilter === 'cpp' ? 'active' : ''}`}
                            onClick={() => setLanguageFilter('cpp')}
                        >
                            C++ ({assignments.filter(a => a.language?.toLowerCase() === 'cpp').length})
                        </button>
                        <button 
                            className={`filter-pill ${languageFilter === 'c' ? 'active' : ''}`}
                            onClick={() => setLanguageFilter('c')}
                        >
                            C ({assignments.filter(a => a.language?.toLowerCase() === 'c').length})
                        </button>
                        <button 
                            className={`filter-pill ${languageFilter === 'java' ? 'active' : ''}`}
                            onClick={() => setLanguageFilter('java')}
                        >
                            Java ({assignments.filter(a => a.language?.toLowerCase() === 'java').length})
                        </button>
                    </div>
                </div>

                {/* --- Assignments Table --- */}
                <main className="spatial-card table-card-container">
                    <div className="card-glass-layer"></div>
                    <div className="card-content relative-z" style={{ padding: 0 }}>
                        
                        <div className="table-responsive-wrapper">
                            {filteredAssignments.length === 0 ? (
                                <div className="empty-card" style={{ padding: '60px 20px' }}>
                                    <div className="empty-icon">📝</div>
                                    <h3>No assignments found</h3>
                                    <p>Try resetting search keywords or language filters.</p>
                                </div>
                            ) : (
                                <table className="nexus-table">
                                    <thead>
                                        <tr>
                                            <th>Task Information</th>
                                            <th>Classroom & Faculty</th>
                                            <th>Language</th>
                                            <th>Max Score</th>
                                            <th>Due Date</th>
                                            <th>Submissions</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAssignments.map((a) => {
                                            const isOverdue = a.deadline && new Date() > new Date(a.deadline);
                                            return (
                                                <tr key={a.id}>
                                                    
                                                    {/* Task Title & ID */}
                                                    <td>
                                                        <div className="task-title-cell">
                                                            <div className="task-icon-box">📝</div>
                                                            <div>
                                                                <strong className="task-main-title">{a.title}</strong>
                                                                <span className="task-id-sub">Task #{a.id}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Classroom & Instructor */}
                                                    <td>
                                                        <div className="class-faculty-meta">
                                                            <strong>{a.classroom_name}</strong>
                                                            <span>By: {a.instructor_name}</span>
                                                        </div>
                                                    </td>

                                                    {/* Language */}
                                                    <td>
                                                        <span className="lang-pill">
                                                            {formatLanguageDisplay(a.language)}
                                                        </span>
                                                    </td>

                                                    {/* Max Score */}
                                                    <td>
                                                        <span className="score-pill-plain">
                                                            {a.max_score} pts
                                                        </span>
                                                    </td>

                                                    {/* Due Date */}
                                                    <td>
                                                        <div className={`deadline-cell ${isOverdue ? 'overdue' : ''}`}>
                                                            <span>{formatDeadline(a.deadline)}</span>
                                                        </div>
                                                    </td>

                                                    {/* Submissions */}
                                                    <td>
                                                        <span className="count-pill submissions">
                                                            {a.submission_count} Submissions
                                                        </span>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="text-right">
                                                        <div className="actions-cell-wrapper">
                                                            <button 
                                                                className="btn-icon-nexus edit" 
                                                                onClick={() => handleOpenEdit(a)}
                                                                title="Edit Task"
                                                            >
                                                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                                </svg>
                                                            </button>

                                                            <button 
                                                                className="btn-icon-nexus delete" 
                                                                onClick={() => handleOpenDelete(a)}
                                                                title="Delete Task"
                                                            >
                                                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>

                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </main>

            </div>

            {/* --- EDIT MODAL --- */}
            {showEditModal && activeAssignment && (
                <div className="admin-modal-overlay">
                    <div className="spatial-card admin-modal-card">
                        <div className="card-glass-layer"></div>
                        <div className="card-content relative-z" style={{ padding: '28px' }}>
                            <div className="modal-header-nexus">
                                <h3>Edit Assignment Parameters</h3>
                                <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>✕</button>
                            </div>

                            <form onSubmit={handleSaveEdit} className="modal-form-nexus">
                                <div className="form-group-nexus">
                                    <label>Task Title</label>
                                    <input 
                                        type="text" 
                                        value={editFormData.title} 
                                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })} 
                                        required 
                                    />
                                </div>

                                <div className="form-group-nexus">
                                    <label>Description & Instructions</label>
                                    <textarea 
                                        rows="4"
                                        value={editFormData.description} 
                                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                        className="admin-textarea"
                                    />
                                </div>

                                <div className="form-row-split">
                                    <div className="form-group-nexus">
                                        <label>Language Syntax</label>
                                        <select 
                                            value={editFormData.language} 
                                            onChange={(e) => setEditFormData({ ...editFormData, language: e.target.value })}
                                        >
                                            <option value="python">Python (.py)</option>
                                            <option value="cpp">C++ (.cpp)</option>
                                            <option value="c">C (.c)</option>
                                            <option value="java">Java (.java)</option>
                                        </select>
                                    </div>

                                    <div className="form-group-nexus">
                                        <label>Max Score (Points)</label>
                                        <input 
                                            type="number" 
                                            value={editFormData.max_score} 
                                            onChange={(e) => setEditFormData({ ...editFormData, max_score: e.target.value })}
                                            min="1"
                                            max="1000"
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="form-group-nexus">
                                    <label>Deadline (Optional)</label>
                                    <input 
                                        type="datetime-local" 
                                        value={editFormData.deadline} 
                                        onChange={(e) => setEditFormData({ ...editFormData, deadline: e.target.value })}
                                    />
                                </div>

                                <div className="modal-footer-nexus">
                                    <button type="button" className="btn-modal-cancel" onClick={() => setShowEditModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="nexus-btn-primary" disabled={isSaving}>
                                        {isSaving ? 'Updating...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {showDeleteModal && activeAssignment && (
                <div className="admin-modal-overlay">
                    <div className="spatial-card admin-modal-card delete-warning-modal">
                        <div className="card-glass-layer"></div>
                        <div className="card-content relative-z" style={{ padding: '28px' }}>
                            <div className="delete-icon-alert">⚠️</div>
                            <h3>Delete Assignment Confirmation</h3>
                            <p className="delete-warning-text">
                                Are you sure you want to permanently delete <strong>"{activeAssignment.title}"</strong>?
                            </p>
                            <p className="delete-sub-warning">
                                This will permanently remove this task, all <strong>{activeAssignment.submission_count} student code submissions</strong>, attached guide files, and AST evaluation records.
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
                                    {isSaving ? 'Deleting...' : 'Permanently Delete Task'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AssignmentManagement;
