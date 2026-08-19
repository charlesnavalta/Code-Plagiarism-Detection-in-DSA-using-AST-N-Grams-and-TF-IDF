import React, { useState, useRef } from 'react';
import { useUserCRUD } from '../../hooks/useUserCRUD'; 
import { useTheme } from '../../hooks/useTheme';
import { useSpatialSpotlight } from '../../hooks/useSpatialSpotlight';
import './UserManagement.css'; 

const UserManagement = () => {
    // 1. Pull everything from the custom hook
    const { 
        users, loading, error, processing, 
        approveUser, deleteUser, saveUser 
    } = useUserCRUD();

    const dashboardRef = useRef(null);
    const [theme] = useTheme();
    const handleMouseMove = useSpatialSpotlight(dashboardRef);

    // 2. UI State only (Modals and Themes)
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); 
    // Updated formData to include 'status' to match DB defaults
    const [formData, setFormData] = useState({ id: null, username: '', email: '', role: 'student', status: 'active', password: '' });

    // --- MODAL HANDLERS ---
    const openCreateModal = () => {
        setModalMode('create');
        // Reset state, including default status
        setFormData({ id: null, username: '', email: '', role: 'student', status: 'active', password: '' });
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setModalMode('edit');
        // Populate state with existing user data, including status
        setFormData({ id: user.id, username: user.username, email: user.email, role: user.role, status: user.status, password: '' });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        // Use the hook's save function. If successful, close the modal.
        const success = await saveUser(modalMode, formData);
        if (success) {
            setShowModal(false);
        }
    };

    if (loading) return (
        <div className={`nexus-wrapper ${theme}`}>
            <div className="admin-loading-screen">
                <div className="quantum-spinner"></div>
                <p>Synchronizing Directory...</p>
            </div>
        </div>
    );

    return (
        <div className={`nexus-wrapper ${theme}`} ref={dashboardRef} onMouseMove={handleMouseMove}>
            <div className="aurora-canvas">
                <div className="aurora-blob blob-primary"></div>
                <div className="aurora-blob blob-secondary"></div>
            </div>

            <div className="admin-max-width fade-in-up">
                
                {/* --- Header Banner --- */}
                <header className="action-banner-nexus spatial-card" style={{ marginBottom: '40px' }}>
                    <div className="banner-content banner-header-split">
                        <div className="banner-text">
                            <h1>Access Directory</h1>
                            <p>Node Identity & Role Verification Command</p>
                        </div>
                        
                        <div className="header-actions">
                            <div className="invite-badge-glass static-indicator">
                                <span>Total Users</span>
                                <strong>{users.length}</strong>
                            </div>
                            <button className="nexus-btn-primary" onClick={openCreateModal}>
                                Add User +
                            </button>
                        </div>
                    </div>
                </header>

                {/* --- Table Section --- */}
                <main className="spatial-card table-card-container">
                    <div className="card-glass-layer"></div>
                    <div className="card-content relative-z" style={{ padding: 0 }}>
                        {error && <div className="error-alert-nexus">{error}</div>}
                        
                        <div className="table-responsive-wrapper">
                            {users.length === 0 ? (
                                <div className="empty-card" style={{ padding: '60px 20px' }}>
                                    <div className="empty-icon">👥</div>
                                    <h3>Directory Empty</h3>
                                    <p>No non-admin users found in the system.</p>
                                </div>
                            ) : (
                                <table className="nexus-data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>User Identity</th>
                                            <th>System Role</th>
                                            <th>Network Status</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="code-font">#{user.id}</td>
                                                <td>
                                                    <div className="student-cell">
                                                        <div className="student-avatar">{user.username.charAt(0).toUpperCase()}</div>
                                                        <div className="user-text-meta">
                                                            <strong className="username-bold">{user.username}</strong>
                                                            <span className="email-dim">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`clean-role-badge ${user.role}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className={`clean-status-pill ${user.status}`}>
                                                        <span className="status-indicator-dot"></span>
                                                        {user.status}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="table-action-group">
                                                        {user.status === 'pending' && (
                                                            <button className="action-btn approve" onClick={() => approveUser(user.id)} title="Approve">
                                                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                            </button>
                                                        )}
                                                        <button className="action-btn edit" onClick={() => openEditModal(user)} title="Edit">
                                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                        </button>
                                                        <button className="action-btn delete" onClick={() => deleteUser(user.id)} title="Delete">
                                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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

                {/* --- Modal Window --- */}
                {showModal && (
                    <div className="nexus-modal-overlay">
                        <div className="nexus-modal-content spatial-card">
                            <div className="card-glass-layer"></div>
                            <div className="modal-header relative-z">
                                <h2>{modalMode === 'create' ? 'Register New Node' : 'Modify User Parameters'}</h2>
                                <button className="btn-close-icon" onClick={() => setShowModal(false)}>&times;</button>
                            </div>
                            
                            <form onSubmit={handleModalSubmit} className="relative-z" style={{ padding: '0 30px 30px 30px' }}>
                                <div className="dark-form-group">
                                    <label>User Identity (Max 50 chars)</label>
                                    <input 
                                        type="text" 
                                        name="username" 
                                        value={formData.username} 
                                        onChange={handleInputChange} 
                                        required 
                                        maxLength="50" 
                                        className="nexus-input-field" 
                                        placeholder="Enter username" 
                                    />
                                </div>
                                <div className="dark-form-group">
                                    <label>Email Transmission Address</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleInputChange} 
                                        required 
                                        maxLength="120" 
                                        className="nexus-input-field" 
                                        placeholder="Enter email" 
                                    />
                                </div>
                                <div className="form-group-row">
                                    <div className="dark-form-group w-50">
                                        <label>System Role</label>
                                        <select name="role" value={formData.role} onChange={handleInputChange} className="nexus-input-field">
                                            <option value="student">Student</option>
                                            <option value="instructor">Instructor</option>
                                            <option value="admin">Administrator</option>
                                        </select>
                                    </div>
                                    <div className="dark-form-group w-50">
                                        <label>Network Status</label>
                                        <select name="status" value={formData.status} onChange={handleInputChange} className="nexus-input-field">
                                            <option value="active">Active</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="dark-form-group" style={{ marginTop: '15px' }}>
                                    <label>{modalMode === 'edit' ? 'New Key (Leave blank to keep current)' : 'Security Key (Min 6 chars)'}</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleInputChange} 
                                        required={modalMode === 'create'} 
                                        minLength="6" 
                                        className="nexus-input-field" 
                                        placeholder="••••••••" 
                                    />
                                </div>
                                
                                <div className="modal-actions" style={{ marginTop: '25px' }}>
                                    <button type="button" className="nexus-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="nexus-btn-primary" disabled={processing}>
                                        {processing ? 'Processing...' : (modalMode === 'create' ? 'Provision User' : 'Save Parameters')}
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