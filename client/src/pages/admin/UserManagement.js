import React, { useState, useEffect } from 'react';
// Changed: Use the centralized API service instead of raw axios
import api from '../../services/api'; 
import './UserManagement.css'; 

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [formData, setFormData] = useState({ id: null, username: '', email: '', role: 'student', password: '' });
    const [processing, setProcessing] = useState(false);

    // --- READ ---
    const fetchUsers = async () => {
        try {
            // Simplified: The 'api' service automatically adds the Authorization header
            const res = await api.get('/auth/users');
            
            // SECURITY FILTER: Remove any user with the 'admin' role from the table
            const nonAdminUsers = res.data.filter(user => user.role !== 'admin');
            setUsers(nonAdminUsers);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users. Ensure the backend is running.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // --- UPDATE (Approve Instructor) ---
    const handleApprove = async (userId) => {
        try {
            // Simplified: Headers and Base URL are handled by the interceptor
            await api.patch(`/auth/users/${userId}/approve`);
            fetchUsers();
        } catch (err) {
            alert("Failed to approve user.");
        }
    };

    // --- DELETE ---
    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
        try {
            await api.delete(`/auth/users/${userId}`);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to delete user.");
        }
    };

    // --- MODAL HANDLERS ---
    const openCreateModal = () => {
        setModalMode('create');
        setFormData({ id: null, username: '', email: '', role: 'student', password: '' });
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setModalMode('edit');
        setFormData({ id: user.id, username: user.username, email: user.email, role: user.role, password: '' });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- CREATE & UPDATE (Submit Form) ---
    const handleModalSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            if (modalMode === 'create') {
                // Simplified: Using relative path '/auth/users'
                await api.post('/auth/users', formData);
            } else {
                // For Edit, we don't send the password if it's left blank
                const payload = { username: formData.username, email: formData.email, role: formData.role };
                if (formData.password) payload.password = formData.password;
                
                await api.put(`/auth/users/${formData.id}`, payload);
            }
            
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.error || `Failed to ${modalMode} user.`);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="admin-loading-screen"><div className="cyber-spinner"></div></div>;

    return (
        <div className="falsicode-admin-root">
            <div className="admin-max-width">
                
                {/* Header with "Add User" Button */}
                <header className="admin-clean-header">
                    <div>
                        <h1 className="admin-title">Access Directory</h1>
                        <p className="admin-subtitle">Falsicode Node: Identity & Role Verification</p>
                    </div>
                    <div className="header-actions">
                        <div className="live-status-indicator static-indicator">
                            <span className="count-label">Total Users:</span>
                            <strong className="count-value">{users.length}</strong>
                        </div>
                        <button className="btn-add-cyber" onClick={openCreateModal}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                            Add User
                        </button>
                    </div>
                </header>

                {/* Table Section */}
                <main className="admin-bento-card full-width">
                    {error && <div className="error-alert-cyber">{error}</div>}
                    
                    <div className="table-responsive-wrapper">
                        <table className="falsicode-clean-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User Identity</th>
                                    <th>System Role</th>
                                    <th>Network Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="clean-tr">
                                        <td className="id-cell">#{user.id}</td>
                                        <td>
                                            <div className="user-profile-cell">
                                                <div className="mini-avatar-glass">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="user-text-meta">
                                                    <span className="username-bold">{user.username}</span>
                                                    <span className="email-dim">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className={`clean-role-badge ${user.role}`}>{user.role}</span></td>
                                        <td>
                                            <div className={`clean-status-pill ${user.status}`}>
                                                <span className="status-indicator-dot"></span>
                                                {user.status}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="table-action-group">
                                                {user.status === 'pending' && (
                                                    <button className="action-btn approve" onClick={() => handleApprove(user.id)} title="Approve">
                                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                    </button>
                                                )}
                                                <button className="action-btn edit" onClick={() => openEditModal(user)} title="Edit">
                                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                                <button className="action-btn delete" onClick={() => handleDelete(user.id)} title="Delete">
                                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>

                {/* Cyber Modal for Create/Edit */}
                {showModal && (
                    <div className="cyber-modal-overlay">
                        <div className="cyber-modal-card">
                            <div className="modal-header-clean">
                                <h2>{modalMode === 'create' ? 'Register New Node' : 'Modify User Parameters'}</h2>
                                <button className="btn-close-modal" onClick={() => setShowModal(false)}>&times;</button>
                            </div>
                            
                            <form onSubmit={handleModalSubmit} className="cyber-form">
                                <div className="form-group-clean">
                                    <label>Username</label>
                                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} required className="cyber-input" placeholder="Enter username" />
                                </div>
                                <div className="form-group-clean">
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="cyber-input" placeholder="Enter email" />
                                </div>
                                <div className="form-group-row">
                                    <div className="form-group-clean w-50">
                                        <label>System Role</label>
                                        <select name="role" value={formData.role} onChange={handleInputChange} className="cyber-input">
                                            <option value="student">Student</option>
                                            <option value="instructor">Instructor</option>
                                        </select>
                                    </div>
                                    <div className="form-group-clean w-50">
                                        <label>{modalMode === 'edit' ? 'New Password (Optional)' : 'Password'}</label>
                                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} required={modalMode === 'create'} className="cyber-input" placeholder="••••••••" />
                                    </div>
                                </div>
                                
                                <div className="modal-actions-clean">
                                    <button type="button" className="btn-cancel-glass" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-submit-glow" disabled={processing}>
                                        {processing ? 'Processing...' : (modalMode === 'create' ? 'Create User' : 'Save Changes')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;