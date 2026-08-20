import React, { useState, useRef } from 'react';
import { useToast } from '../../context/NotificationContext';
import { useTheme } from '../../hooks/useTheme';
import { useSpatialSpotlight } from '../../hooks/useSpatialSpotlight';
import './Profile.css';
import api from '../../services/api'; 

const Profile = () => {
    const [currentUser, setCurrentUser] = useState(() => {
        const rawUser = localStorage.getItem('user');
        return (rawUser && rawUser !== "undefined") ? JSON.parse(rawUser) : {};
    });

    const dashboardRef = useRef(null);
    const toast = useToast();
    const [theme] = useTheme();
    const handleMouseMove = useSpatialSpotlight(dashboardRef);

    // --- Email Update States ---
    const [newEmail, setNewEmail] = useState('');
    const [emailPassword, setEmailPassword] = useState('');
    const [emailOtp, setEmailOtp] = useState('');
    const [emailStep, setEmailStep] = useState(1); // 1 = input new email & password, 2 = enter OTP
    const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
    const [updatingEmail, setUpdatingEmail] = useState(false);

    // --- Password Security States ---
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [sendingCode, setSendingCode] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);

    // --- Email Update Handlers ---
    const handleRequestEmailUpdate = async (e) => {
        if (e) e.preventDefault();
        const trimmedEmail = newEmail.trim().toLowerCase();
        if (!trimmedEmail) {
            return toast.warning("Please enter a new email address.", "Validation Notice");
        }
        if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
            return toast.warning("Please enter a valid email format.", "Invalid Email");
        }
        if (currentUser.email && trimmedEmail === currentUser.email.toLowerCase()) {
            return toast.warning("This is already your current registered email address.", "Notice");
        }
        if (!emailPassword) {
            return toast.warning("Please enter your current password to authorize this change.", "Password Required");
        }

        setSendingEmailOtp(true);
        try {
            const res = await api.post('/auth/profile/request-email-update', {
                new_email: trimmedEmail,
                password: emailPassword
            });
            toast.success(res.data.message || `Verification code sent to ${trimmedEmail}!`, "Code Dispatched");
            setEmailStep(2);
        } catch (err) {
            const errText = err.response?.data?.error || "Failed to initiate email update.";
            toast.error(errText, "Request Failed");
        } finally {
            setSendingEmailOtp(false);
        }
    };

    const handleVerifyAndUpdateEmail = async (e) => {
        e.preventDefault();
        if (emailOtp.length !== 6) {
            return toast.warning("Please enter the 6-digit verification code.", "Code Required");
        }

        setUpdatingEmail(true);
        try {
            const res = await api.put('/auth/profile/update-email', {
                code: emailOtp
            });
            toast.success(res.data.message || "Contact email updated successfully!", "Email Updated");
            
            const updatedUser = res.data.user || { ...currentUser, email: newEmail.trim().toLowerCase() };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);

            // Reset email change form
            setNewEmail('');
            setEmailPassword('');
            setEmailOtp('');
            setEmailStep(1);
        } catch (err) {
            const errText = err.response?.data?.error || "Invalid or expired verification code.";
            toast.error(errText, "Update Failed");
        } finally {
            setUpdatingEmail(false);
        }
    };

    // --- Password Update Handlers ---
    const handleSendCode = async () => {
        setSendingCode(true);
        try {
            const res = await api.post('/auth/profile/request-code');
            toast.success(res.data.message || "Security authorization code sent! Please check your email inbox.", "Code Dispatched");
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

        setUpdatingPassword(true);
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
            setUpdatingPassword(false);
        }
    };

    const userInitial = currentUser.username ? currentUser.username.charAt(0).toUpperCase() : '?';

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
                            <h2 className="identity-name">{currentUser.username || 'Unknown Node'}</h2>
                            <p className="identity-email">{currentUser.email || 'No email associated'}</p>
                            
                            <div className="identity-role-wrapper">
                                <span className={`premium-role-badge role-${currentUser.role?.toLowerCase()}`}>
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                    {currentUser.role?.toUpperCase()} NODE
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
                        
                        {/* 🌟 1. EMAIL PREFERENCES SECTION */}
                        <div className="settings-section relative-z">
                            <div className="settings-header">
                                <h3>Email Preferences</h3>
                                <p>Update the primary contact address for this system node.</p>
                            </div>

                            {emailStep === 1 ? (
                                <form onSubmit={handleRequestEmailUpdate} className="premium-form">
                                    <div className="dark-form-group">
                                        <label>Current Registered Email</label>
                                        <div className="nexus-input-wrapper">
                                            <svg className="input-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                            </svg>
                                            <input 
                                                type="email" className="nexus-input-field with-icon"
                                                value={currentUser.email || 'No email associated'}
                                                disabled
                                                style={{ opacity: 0.7, cursor: 'not-allowed' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group-row">
                                        <div className="dark-form-group w-50">
                                            <label>New Contact Email</label>
                                            <div className="nexus-input-wrapper">
                                                <svg className="input-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                                                </svg>
                                                <input 
                                                    type="email" className="nexus-input-field with-icon"
                                                    value={newEmail} onChange={(e) => setNewEmail(e.target.value)} 
                                                    placeholder="new.email@example.com" required
                                                />
                                            </div>
                                        </div>
                                        <div className="dark-form-group w-50">
                                            <label>Current Password</label>
                                            <input 
                                                type="password" className="nexus-input-field"
                                                value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} 
                                                placeholder="Confirm password" required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button 
                                            type="submit" className="nexus-btn-primary"
                                            disabled={sendingEmailOtp || !newEmail.trim() || !emailPassword}
                                        >
                                            {sendingEmailOtp ? "Transmitting..." : "Send Verification Code"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyAndUpdateEmail} className="premium-form">
                                    <div className="email-verify-notice" style={{
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        border: '1px solid rgba(59, 130, 246, 0.25)',
                                        padding: '14px 18px',
                                        borderRadius: '12px',
                                        marginBottom: '20px',
                                        color: 'var(--text-main)',
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0, color: 'var(--accent)' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        <span>A 6-digit confirmation code was sent to <strong>{newEmail}</strong>. Enter it below to link your new email.</span>
                                    </div>

                                    <div className="form-group-row code-row">
                                        <div className="dark-form-group w-50">
                                            <label>Enter 6-Digit Code</label>
                                            <input 
                                                type="text" className="nexus-input-field code-input"
                                                value={emailOtp} onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))} 
                                                placeholder="000000" maxLength="6" required autoFocus
                                            />
                                        </div>
                                        <div className="dark-form-group w-50 code-btn-group">
                                            <label className="desktop-spacer-label">&nbsp;</label>
                                            <button 
                                                type="button" className="nexus-btn-secondary full-width-btn send-otp-btn" 
                                                onClick={handleRequestEmailUpdate} disabled={sendingEmailOtp}
                                            >
                                                {sendingEmailOtp ? "Re-transmitting..." : "Resend Code"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <button 
                                            type="button" className="nexus-btn-secondary" 
                                            onClick={() => { setEmailStep(1); setEmailOtp(''); }}
                                        >
                                            Cancel / Change Email
                                        </button>
                                        <button 
                                            type="submit" className="nexus-btn-primary" 
                                            disabled={updatingEmail || emailOtp.length !== 6}
                                        >
                                            {updatingEmail ? "Verifying..." : "Verify & Commit New Email"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className="settings-divider"></div>

                        {/* 🌟 2. SECURITY PROTOCOLS SECTION */}
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
                                        disabled={updatingPassword || !currentPassword || !newPassword || !confirmPassword || otpCode.length !== 6}
                                    >
                                        {updatingPassword ? "Syncing..." : "Update Credentials"}
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