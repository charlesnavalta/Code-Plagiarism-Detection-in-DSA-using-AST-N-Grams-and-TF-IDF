import React, { useState, useRef, useMemo } from 'react';
import { useUserCRUD } from '../../hooks/useUserCRUD'; 
import { useTheme } from '../../hooks/useTheme';
import { useSpatialSpotlight } from '../../hooks/useSpatialSpotlight';
import { AdminTableSkeleton } from './components/AdminSkeleton';
import './UserManagement.css'; 

const UserManagement = () => {
    const { 
        users, loading, error, processing, 
        approveUser, deleteUser, saveUser 
    } = useUserCRUD();

    const dashboardRef = useRef(null);
    const [theme] = useTheme();
    const handleMouseMove = useSpatialSpotlight(dashboardRef);

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    // UI State for Modals
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); 
    const [formData, setFormData] = useState({ id: null, username: '', email: '', role: 'student', status: 'active', password: '' });

    // Filtered users calculation
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesSearch = 
                u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (roleFilter === 'all') return matchesSearch;
            if (roleFilter === 'pending') return matchesSearch && u.status === 'pending';
            if (roleFilter === 'student') return matchesSearch && u.role === 'student' && u.status !== 'pending';
            if (roleFilter === 'instructor') return matchesSearch && u.role === 'instructor' && u.status !== 'pending';
            return matchesSearch;
        });
    }, [users, searchTerm, roleFilter]);

    // --- MODAL HANDLERS ---
    const openCreateModal = () => {
        setModalMode('create');
        setFormData({ id: null, username: '', email: '', role: 'student', status: 'active', password: '' });
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setModalMode('edit');
        setFormData({ id: user.id, username: user.username, email: user.email, role: user.role, status: user.status, password: '' });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        const success = await saveUser(modalMode, formData);
        if (success) {
            setShowModal(false);
        }
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
                            <h1>User Directory</h1>
                            <p>Global User Accounts, Roles & Faculty Approvals</p>
                        </div>
                        
                        <div className="header-actions">
                            <div className="invite-badge-glass static-indicator">
                                <span>Total Users</span>
                                <strong>{users.length}</strong>
                            </div>
                            <button className="nexus-btn-primary" onClick={openCreateModal}>
                                + Add User
                            </button>
                        </div>
                    </div>
                </header>

                {/* --- Filter & Search Controls Bar --- */}
                <div className="admin-controls-bar">
                    <div className="admin-search-box">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search by username or email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>✕</button>
                        )}
                    </div>

                    <div className="admin-filter-pills">
                        <button 
                            className={`filter-pill ${roleFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setRoleFilter('all')}
                        >
                            All ({users.length})
                        </button>
                        <button 
                            className={`filter-pill ${roleFilter === 'pending' ? 'active' : ''}`}
                            onClick={() => setRoleFilter('pending')}
                        >
                            Pending ({users.filter(u => u.status === 'pending').length})
                        </button>
                        <button 
                            className={`filter-pill ${roleFilter === 'student' ? 'active' : ''}`}
                            onClick={() => setRoleFilter('student')}
                        >
                            Students ({users.filter(u => u.role === 'student' && u.status !== 'pending').length})
                        </button>
                        <button 
                            className={`filter-pill ${roleFilter === 'instructor' ? 'active' : ''}`}
                            onClick={() => setRoleFilter('instructor')}
                        >
                            Instructors ({users.filter(u => u.role === 'instructor' && u.status !== 'pending').length})
                        </button>
                    </div>
                </div>

                {/* --- Table Section --- */}
                <main className="spatial-card table-card-container">
                    <div className="card-glass-layer"></div>
                    <div className="card-content relative-z" style={{ padding: 0 }}>
                        {error && <div className="error-alert-nexus">{error}</div>}
                        
                        <div className="table-responsive-wrapper">
                            {filteredUsers.length === 0 ? (
                                <div className="empty-card" style={{ padding: '60px 20px' }}>
                                    <div className="empty-icon">👥</div>
                                    <h3>No users found</h3>
                                    <p>Try clearing your search filters or add a new user account.</p>
                                </div>
                            ) : (
                                <table className="nexus-table">
                                    <thead>
                                        <tr>
                                            <th>User Identity</th>
                                            <th>Email Address</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className={user.status === 'pending' ? 'row-pending' : ''}>
                                                
                                                {/* Identity with Avatar */}
                                                <td>
                                                    <div className="user-profile-cell">
                                                        <div className={`avatar-mini ${user.role}`}>
                                                            {user.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="user-names">
                                                            <strong className="user-primary-name">{user.username}</strong>
                                                            <span className="user-sub-id">UID #{user.id}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Email */}
                                                <td className="user-email-cell">{user.email}</td>

                                                {/* Role */}
                                                <td>
                                                    <span className={`role-badge ${user.role}`}>
                                                        {user.role}
                                                    </span>
                                                </td>

                                                {/* Status / Pending Action */}
                                                <td>
                                                    {user.status === 'pending' ? (
                                                        <div className="pending-status-cluster">
                                                            <span className="status-pill pending">Pending</span>
                                                            <button 
                                                                className="btn-action-primary approve"
                                                                onClick={() => approveUser(user.id)}
                                                                disabled={processing === user.id}
                                                            >
                                                                {processing === user.id ? 'Approving...' : 'Approve ✓'}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="status-pill active">Active</span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="text-right">
                                                    <div className="actions-cell-wrapper">
                                                        <button 
                                                            className="btn-icon-nexus edit" 
                                                            onClick={() => openEditModal(user)}
                                                            title="Edit User"
                                                        >
                                                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                            </svg>
                                                        </button>

                                                        {user.role !== 'admin' && (
                                                            <button 
                                                                className="btn-icon-nexus delete" 
                                                                onClick={() => deleteUser(user.id)}
                                                                disabled={processing === user.id}
                                                                title="Delete User"
                                                            >
                                                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                                </svg>
                                                            </button>
                                                        )}
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

            {/* --- CREATION / EDIT MODAL --- */}
            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="spatial-card admin-modal-card">
                        <div className="card-glass-layer"></div>
                        <div className="card-content relative-z" style={{ padding: '28px' }}>
                            <div className="modal-header-nexus">
                                <h3>{modalMode === 'create' ? 'Register New User' : 'Update User Identity'}</h3>
                                <button className="modal-close-btn" onClick={() => setShowModal(false)}>✕</button>
                            </div>

                            <form onSubmit={handleModalSubmit} className="modal-form-nexus">
                                <div className="form-group-nexus">
                                    <label>Username</label>
                                    <input 
                                        type="text" 
                                        name="username" 
                                        value={formData.username} 
                                        onChange={handleInputChange} 
                                        required 
                                        placeholder="e.g. jdoe"
                                    />
                                </div>

                                <div className="form-group-nexus">
                                    <label>Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleInputChange} 
                                        required 
                                        placeholder="jdoe@university.edu"
                                    />
                                </div>

                                <div className="form-row-split">
                                    <div className="form-group-nexus">
                                        <label>System Role</label>
                                        <select name="role" value={formData.role} onChange={handleInputChange}>
                                            <option value="student">Student</option>
                                            <option value="instructor">Instructor</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>

                                    <div className="form-group-nexus">
                                        <label>Account Status</label>
                                        <select name="status" value={formData.status} onChange={handleInputChange}>
                                            <option value="active">Active</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group-nexus">
                                    <label>{modalMode === 'create' ? 'Temporary Password' : 'New Password (leave blank to keep current)'}</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleInputChange} 
                                        required={modalMode === 'create'}
                                        placeholder={modalMode === 'create' ? 'Min 6 characters' : '••••••••'}
                                    />
                                </div>

                                <div className="modal-footer-nexus">
                                    <button type="button" className="btn-modal-cancel" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="nexus-btn-primary">
                                        {modalMode === 'create' ? 'Create User' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
