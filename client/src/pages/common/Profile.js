import React, { useState } from 'react';
import './Profile.css';
// Changed: Use the centralized API service
import api from '../../services/api'; 

const Profile = () => {
    const rawUser = localStorage.getItem('user');
    const user = (rawUser && rawUser !== "undefined") ? JSON.parse(rawUser) : {};

    // Password State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Dummy Email State (UI Only)
    const [emailInput, setEmailInput] = useState(user.email || '');

    const handleUpdateEmail = (e) => {
        e.preventDefault();
        alert("System Notice: Email update functionality is currently being provisioned.");
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Basic Validation
        if (newPassword !== confirmPassword) {
            return setError("Security protocol failed: Passwords do not match.");
        }

        if (newPassword.length < 6) {
            return setError("Security protocol failed: Password must be at least 6 characters.");
        }

        setLoading(true);
        try {
            // Simplified: The 'api' service handles the baseURL and Authorization header automatically
            const res = await api.put('/auth/profile', { 
                new_password: newPassword 
            });

            setMessage(res.data.message || "Security credentials updated successfully.");
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            // If the session expired, the interceptor will handle the logout before this
            setError(err.response?.data?.error || "Critical failure: Unable to update security parameters.");
        } finally {
            setLoading(false);
        }
    };

    // Extract first letter for the Avatar
    const userInitial = user.username ? user.username.charAt(0).toUpperCase() : '?';

    return (
        <div className="premium-profile-wrapper">
            <div className="premium-profile-container">
                
                <div className="premium-header">
                    <h1>Account Overview</h1>
                    <p>Manage your Falsicode identity and security preferences.</p>
                </div>

                <div className="premium-profile-grid">
                    
                    {/* LEFT COLUMN: Identity Card */}
                    <div className="profile-identity-card">
                        <div className="avatar-banner"></div>
                        <div className="avatar-container">
                            <div className="avatar-circle">{userInitial}</div>
                        </div>
                        
                        <div className="identity-details">
                            <h2 className="identity-name">{user.username || 'Unknown Node'}</h2>
                            <p className="identity-email">{user.email || 'No email associated'}</p>
                            
                            <div className="identity-role-wrapper">
                                <span className={`premium-role-badge role-${user.role?.toLowerCase()}`}>
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                    {user.role?.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="identity-meta">
                            <div className="meta-item">
                                <span className="meta-label">Node Status</span>
                                <span className="meta-value text-green">Online</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Encryption</span>
                                <span className="meta-value">AES-256 Enabled</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Settings Card */}
                    <div className="profile-settings-card">
                        
                        {/* SECTION 1: Email Update */}
                        <div className="settings-header">
                            <h3>Email Preferences</h3>
                            <p>Update the primary contact address for this system node.</p>
                        </div>

                        <form onSubmit={handleUpdateEmail} className="premium-form">
                            <div className="premium-input-group">
                                <label>Contact Email</label>
                                <div className="premium-input-wrapper">
                                    <svg className="input-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                    <input 
                                        type="email" 
                                        value={emailInput} 
                                        onChange={(e) => setEmailInput(e.target.value)} 
                                        placeholder="node@falsicode.com"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-save-secondary">
                                    Update Email
                                </button>
                            </div>
                        </form>

                        <hr className="settings-divider" />

                        {/* SECTION 2: Password Update */}
                        <div className="settings-header header-no-border">
                            <h3>Security Protocols</h3>
                            <p>Ensure your account uses a complex, unique password to maintain node integrity.</p>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="premium-form">
                            
                            {message && (
                                <div className="premium-alert success-alert">
                                    <div className="alert-icon">✓</div>
                                    <div className="alert-text">{message}</div>
                                </div>
                            )}
                            
                            {error && (
                                <div className="premium-alert error-alert">
                                    <div className="alert-icon">!</div>
                                    <div className="alert-text">{error}</div>
                                </div>
                            )}

                            <div className="premium-input-group">
                                <label>New Password</label>
                                <div className="premium-input-wrapper">
                                    <svg className="input-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                    <input 
                                        type="password" 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        placeholder="Minimum 6 characters"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="premium-input-group">
                                <label>Verify New Password</label>
                                <div className="premium-input-wrapper">
                                    <svg className="input-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                    <input 
                                        type="password" 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        placeholder="Repeat new password"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="btn-save-premium" 
                                    disabled={loading || !newPassword || !confirmPassword}
                                >
                                    {loading ? "Syncing..." : "Update Credentials"}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;