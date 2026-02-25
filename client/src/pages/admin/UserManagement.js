import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css'; 

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/auth/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
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

    const handleApprove = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/auth/users/${userId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert("Instructor approved successfully!");
            fetchUsers();
        } catch (err) {
            alert("Failed to approve user.");
        }
    };

    if (loading) return <div className="admin-loading-screen"><div className="cyber-spinner"></div></div>;

    return (
        <div className="admin-page-wrapper">
            <div className="admin-content-layout">
                {/* --- Consistent Banner matching Falsicode style --- */}
                <header className="admin-welcome-banner">
                    <div className="banner-info">
                        <h1>User Management Directory</h1>
                        <p>Falsicode System Administration: Manage roles and instructor verifications.</p>
                    </div>
                    <div className="admin-stat-glass-pill">
                        <span>TOTAL REGISTERED</span>
                        <strong>{users.length}</strong>
                    </div>
                </header>

                <main className="admin-main-table-section">
                    {error && <div className="error-alert-cyber">{error}</div>}
                    
                    <div className="cyber-table-card">
                        <table className="falsicode-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>USER INFO</th>
                                    <th>ROLE</th>
                                    <th>ACCOUNT STATUS</th>
                                    <th className="text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="falsicode-tr">
                                        <td className="id-cell">#{user.id}</td>
                                        <td>
                                            <div className="user-profile-cell">
                                                <div className="mini-avatar-glow">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="user-text-meta">
                                                    <span className="username-bold">{user.username}</span>
                                                    <span className="email-dim">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`cyber-role-badge ${user.role}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={`cyber-status-pill ${user.status}`}>
                                                <span className="status-indicator-dot"></span>
                                                {user.status}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            {user.status === 'pending' ? (
                                                <button 
                                                    className="btn-action-approve"
                                                    onClick={() => handleApprove(user.id)}
                                                >
                                                    Approve Account
                                                </button>
                                            ) : (
                                                <span className="action-verified-text">Verified</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserManagement;