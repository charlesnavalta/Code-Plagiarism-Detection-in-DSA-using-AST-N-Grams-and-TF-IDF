import React, { useState, useRef } from 'react';
import { useToast } from '../../context/NotificationContext';
import { useTheme } from '../../hooks/useTheme';
import { useSpatialSpotlight } from '../../hooks/useSpatialSpotlight';
import './Profile.css';
import api from '../../services/api'; 

const Profile = () => {
    const rawUser = localStorage.getItem('user');
    const user = (rawUser && rawUser !== "undefined") ? JSON.parse(rawUser) : {};
    const dashboardRef = useRef(null);
    const toast = useToast();
    const [theme] = useTheme();
    const handleMouseMove = useSpatialSpotlight(dashboardRef);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [sendingCode, setSendingCode] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [emailInput, setEmailInput] = useState(user.email || '');

    const handleUpdateEmail = (e) => {
        e.preventDefault();
        toast.info("Email update functionality is currently being provisioned.", "System Notice");
    };

    const handleSendCode = async () => {
        setSendingCode(true);
        try {
            const res = await api.post('/auth/profile/request-code');
            if (res.data.email_sent === false && res.data.code) {
                toast.info(`Localhost Dev Mode: Authorization code is ${res.data.code}`, "Dev Security OTP", 7000);
            } else {
                toast.success(res.data.message || "Security authorization code sent to your email.", "Code Dispatched");
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to trigger security email.", "Dispatch Failed");
        } finally {
            setSendingCode(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("New passwords do not match. Please verify.", "Security Error");
        }
        if (newPassword.length < 6) {
            return toast.warning("Password must be at least 6 characters in length.", "Validation Notice");
        }

        setLoading(true);
        try {
            const res = await api.put('/auth/profile', { 
                current_password: currentPassword,
                new_password: newPassword,
                code: otpCode
            });
            toast.success(res.data.message || "Security credentials updated successfully!", "Credentials Updated");
            setCurrentPassword(''); 
            setNewPassword(''); 
            setConfirmPassword(''); 
            setOtpCode('');
        } catch (err) {
            toast.error(err.response?.data?.error || "Unable to update security parameters.", "Update Failed");
        } finally {
            setLoading(false);
        }
    };

    const userInitial = user.username ? user.username.charAt(0).toUpperCase() : '?';

    return (
        <div className={`nexus-wrapper ${theme}`} ref={dashboardRef} onMouseMove={handleMouseMove}>
            <div className="aurora-canvas">
                <div className="aurora-blob blob-primary"></div>
                <div className="aurora-blob blob-secondary"></div>
            </div>

            <div className="premium-profile-container fade-in-up">
                <header className="action-banner-nexus spatial-card" style={{ marginBottom: '40px' }}>
                    <div className="banner-content banner-header-split">
                        <div className="banner-text">
                            <h1>Account Overview</h1>
                            <p>Manage your Falsicode identity and security preferences.</p>
                        </div>
                    </div>
                </header>

                <div className="premium-profile-grid">
                    {/* LEFT COLUMN: Identity Card */}
                    <div className="spatial-card profile-identity-card">
                        <div className="card-glass-layer"></div>
                        <div className="avatar-banner"></div>
                        <div className="avatar-container">
                            <div className="avatar-circle">{userInitial}</div>
                        </div>
                        
                        <div className="identity-details relative-z">
                            <h2 className="identity-name">{user.username || 'Unknown Node'}</h2>
                            <p className="identity-email">{user.email || 'No email associated'}</p>
                            
                            <div className="identity-role-wrapper">
                                <span className={`premium-role-badge role-${user.role?.toLowerCase()}`}>
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                    {user.role?.toUpperCase()} NODE
                                </span>
                            </div>
                        </div>

                        <div className="identity-meta relative-z">
                            <div className="meta-item">
                                <span className="meta-label">Status</span>
                                <span className="meta-value text-green">Online</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Settings */}
                    <div className="spatial-card profile-settings-card">
                        <div className="card-glass-layer"></div>
                        
                        <div className="settings-section relative-z">
                            <div className="settings-header">
                                <h3>Email Preferences</h3>
                                <p>Update the primary contact address for this system node.</p>
                            </div>

                            <form onSubmit={handleUpdateEmail} className="premium-form">
                                <div className="dark-form-group">
                                    <label>Contact Email</label>
                                    <div className="nexus-input-wrapper">
                                        <svg className="input-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        <input 
                                            type="email" className="nexus-input-field with-icon"
                                            value={emailInput} onChange={(e) => setEmailInput(e.target.value)} 
                                            placeholder="node@falsicode.com"
                                        />
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="nexus-btn-secondary">Update Email</button>
                                </div>
                            </form>
                        </div>

                        <div className="settings-divider"></div>

                        <div className="settings-section relative-z">
                            <div className="settings-header">
                                <h3>Security Protocols</h3>
                                <p>Ensure your account uses a complex, unique password.</p>
                            </div>

                            <form onSubmit={handleUpdatePassword} className="premium-form">
                                <div className="dark-form-group">
                                    <label>Current Password</label>
                                    <input 
                                        type="password" className="nexus-input-field"
                                        value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} 
                                        placeholder="Enter your current password" required
                                    />
                                </div>

                                <div className="form-group-row">
                                    <div className="dark-form-group w-50">
                                        <label>New Password</label>
                                        <input 
                                            type="password" className="nexus-input-field"
                                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
                                            placeholder="Min. 6 chars" required
                                        />
                                    </div>
                                    <div className="dark-form-group w-50">
                                        <label>Verify Password</label>
                                        <input 
                                            type="password" className="nexus-input-field"
                                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                                            placeholder="Repeat password" required
                                        />
                                    </div>
                                </div>

                                <div className="form-group-row code-row">
                                    <div className="dark-form-group w-50">
                                        <label>Authorization Code</label>
                                        <input 
                                            type="text" className="nexus-input-field code-input"
                                            value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} 
                                            placeholder="000000" maxLength="6" required
                                        />
                                    </div>
                                    <div className="dark-form-group w-50 code-btn-group">
                                        <label className="desktop-spacer-label">&nbsp;</label>
                                        <button 
                                            type="button" className="nexus-btn-secondary full-width-btn send-otp-btn" 
                                            onClick={handleSendCode} disabled={sendingCode}
                                        >
                                            {sendingCode ? "Transmitting..." : "Send Code to Email"}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-actions" style={{ marginTop: '30px' }}>
                                    <button 
                                        type="submit" className="nexus-btn-primary full-width-btn" 
                                        disabled={loading || !currentPassword || !newPassword || !confirmPassword || otpCode.length !== 6}
                                    >
                                        {loading ? "Syncing..." : "Update Credentials"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;