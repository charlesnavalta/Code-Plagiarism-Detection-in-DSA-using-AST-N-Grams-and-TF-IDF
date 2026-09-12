import React, { useState, useRef } from 'react';
import { useToast } from '../../context/NotificationContext';
import { useTheme } from '../../hooks/useTheme';
import { useSpatialSpotlight } from '../../hooks/useSpatialSpotlight';
import './Profile.css';
import api from '../../services/api'; 

const DEVELOPER_AVATAR_PRESETS = [
    {
        id: 'terminal',
        name: 'Terminal',
        dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%230f172a"/><rect x="5" y="5" width="90" height="90" rx="45" fill="none" stroke="%2338bdf8" stroke-width="3"/><path d="M30 38l16 12-16 12M52 62h18" stroke="%2338bdf8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`
    },
    {
        id: 'tree',
        name: 'Algorithm Tree',
        dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%231e1b4b"/><rect x="5" y="5" width="90" height="90" rx="45" fill="none" stroke="%23818cf8" stroke-width="3"/><circle cx="50" cy="30" r="10" fill="%23818cf8"/><circle cx="32" cy="68" r="9" fill="%23818cf8"/><circle cx="68" cy="68" r="9" fill="%23818cf8"/><path d="M44 38L34 60M56 38l10 22" stroke="%23818cf8" stroke-width="4" stroke-linecap="round"/></svg>`
    },
    {
        id: 'binary',
        name: 'Binary Node',
        dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%23022c22"/><rect x="5" y="5" width="90" height="90" rx="45" fill="none" stroke="%2334d399" stroke-width="3"/><text x="50" y="44" fill="%2334d399" font-size="22" font-family="monospace" font-weight="900" text-anchor="middle">101</text><text x="50" y="70" fill="%2334d399" font-size="22" font-family="monospace" font-weight="900" text-anchor="middle">010</text></svg>`
    },
    {
        id: 'brackets',
        name: 'Code Syntax',
        dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%23451a03"/><rect x="5" y="5" width="90" height="90" rx="45" fill="none" stroke="%23fbbf24" stroke-width="3"/><text x="50" y="62" fill="%23fbbf24" font-size="44" font-family="monospace" font-weight="900" text-anchor="middle">{ }</text></svg>`
    },
    {
        id: 'chip',
        name: 'System Core',
        dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%232e1065"/><rect x="5" y="5" width="90" height="90" rx="45" fill="none" stroke="%23c084fc" stroke-width="3"/><rect x="30" y="30" width="40" height="40" rx="8" fill="none" stroke="%23c084fc" stroke-width="5"/><rect x="40" y="40" width="20" height="20" rx="4" fill="%23c084fc"/><path d="M50 18v12M50 70v12M18 50h12M70 50h12" stroke="%23c084fc" stroke-width="5" stroke-linecap="round"/></svg>`
    },
    {
        id: 'database',
        name: 'Data Stack',
        dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%23172554"/><rect x="5" y="5" width="90" height="90" rx="45" fill="none" stroke="%2360a5fa" stroke-width="3"/><ellipse cx="50" cy="34" rx="26" ry="10" fill="none" stroke="%2360a5fa" stroke-width="4"/><path d="M24 34v16c0 5.5 11.6 10 26 10s26-4.5 26-10V34M24 50v16c0 5.5 11.6 10 26 10s26-4.5 26-10V50" fill="none" stroke="%2360a5fa" stroke-width="4"/></svg>`
    }
];

const Profile = () => {
    const [currentUser, setCurrentUser] = useState(() => {
        const rawUser = localStorage.getItem('user');
        return (rawUser && rawUser !== "undefined") ? JSON.parse(rawUser) : {};
    });

    const dashboardRef = useRef(null);
    const fileInputRef = useRef(null);
    const toast = useToast();
    const [theme] = useTheme();
    const handleMouseMove = useSpatialSpotlight(dashboardRef);

    // --- Avatar Management States ---
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    const openAvatarModal = () => {
        setIsAvatarModalOpen(true);
        window.dispatchEvent(new CustomEvent('avatar-modal-state', { detail: { open: true } }));
    };
    const closeAvatarModal = () => {
        setIsAvatarModalOpen(false);
        window.dispatchEvent(new CustomEvent('avatar-modal-state', { detail: { open: false } }));
    };
    const [avatarDraft, setAvatarDraft] = useState(currentUser.avatar_url || null);
    const [isSavingAvatar, setIsSavingAvatar] = useState(false);

    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const size = 180;
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext('2d');

                    const minSide = Math.min(img.width, img.height);
                    const sx = (img.width - minSide) / 2;
                    const sy = (img.height - minSide) / 2;

                    ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                    resolve(dataUrl);
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            return toast.warning("Please choose an image file (PNG, JPG, or WEBP).", "Invalid File");
        }

        if (file.size > 5 * 1024 * 1024) {
            return toast.warning("Image file size must be under 5MB.", "File Too Large");
        }

        try {
            const compressed = await compressImage(file);
            setAvatarDraft(compressed);
        } catch (err) {
            toast.error("Failed to process image.", "Error");
        }
    };

    const handleSaveAvatar = async () => {
        setIsSavingAvatar(true);
        try {
            const res = await api.put('/auth/profile/avatar', {
                avatar_url: avatarDraft
            });
            const updatedUser = { ...currentUser, avatar_url: res.data.avatar_url };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new CustomEvent('user-avatar-changed', { detail: updatedUser }));
            toast.success(res.data.message || "Profile avatar updated successfully!", "Avatar Updated");
            closeAvatarModal();
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to update avatar.", "Update Failed");
        } finally {
            setIsSavingAvatar(false);
        }
    };

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
                <header className="action-banner-nexus spatial-card">
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
                            <div className="avatar-wrapper-relative">
                                <div className="avatar-circle">
                                    {currentUser.avatar_url ? (
                                        <img src={currentUser.avatar_url} alt={currentUser.username || 'User'} className="profile-avatar-img" />
                                    ) : (
                                        userInitial
                                    )}
                                </div>
                                <button 
                                    className="avatar-edit-badge"
                                    onClick={() => {
                                        setAvatarDraft(currentUser.avatar_url || null);
                                        openAvatarModal();
                                    }}
                                    title="Update Profile Avatar"
                                    type="button"
                                    aria-label="Update profile avatar"
                                >
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="identity-details relative-z">
                            <h2 className="identity-name">{currentUser.username || 'Unknown Node'}</h2>
                            <p className="identity-email">{currentUser.email || 'No email associated'}</p>
                            
                            <div className="identity-role-wrapper">
                                <span className={`premium-role-badge role-${currentUser.role?.toLowerCase()}`}>
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                    {currentUser.role?.toUpperCase()}
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

            {/* AVATAR SELECTION & UPLOAD MODAL */}
            {isAvatarModalOpen && (
                <div className="avatar-modal-backdrop" onClick={() => closeAvatarModal()}>
                    <div className="avatar-modal-sheet" onClick={(e) => e.stopPropagation()}>
                        <div className="avatar-modal-header">
                            <div>
                                <h3 className="avatar-modal-title">Profile Avatar</h3>
                                <p className="avatar-modal-subtitle">Select an identicon or upload a custom photo</p>
                            </div>
                            <button 
                                className="avatar-modal-close-btn" 
                                onClick={() => closeAvatarModal()}
                                type="button"
                                aria-label="Close"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div className="avatar-modal-body">
                            {/* Live Preview & Upload Action */}
                            <div className="avatar-preview-section">
                                <div className="avatar-draft-circle">
                                    {avatarDraft ? (
                                        <img src={avatarDraft} alt="Avatar preview" className="profile-avatar-img" />
                                    ) : (
                                        <span className="avatar-draft-placeholder">{userInitial}</span>
                                    )}
                                </div>
                                <div className="avatar-upload-actions">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileSelect} 
                                        accept="image/png,image/jpeg,image/webp" 
                                        style={{ display: 'none' }} 
                                    />
                                    <div className="avatar-action-row">
                                        <button 
                                            type="button" 
                                            className="nexus-btn-secondary avatar-action-btn"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                                            </svg>
                                            Upload Photo
                                        </button>
                                        {avatarDraft && (
                                            <button 
                                                type="button" 
                                                className="btn-avatar-remove"
                                                onClick={() => setAvatarDraft(null)}
                                            >
                                                Remove Photo
                                            </button>
                                        )}
                                    </div>
                                    <span className="avatar-upload-hint">Supported: JPG, PNG, WEBP (Auto-scaled to square)</span>
                                </div>
                            </div>

                            {/* Preset Identicons Grid */}
                            <div className="avatar-presets-section">
                                <label className="avatar-section-title">Developer Identicons</label>
                                <div className="preset-avatars-grid">
                                    {DEVELOPER_AVATAR_PRESETS.map((preset) => {
                                        const isSelected = avatarDraft === preset.dataUrl;
                                        return (
                                            <button
                                                key={preset.id}
                                                type="button"
                                                className={`preset-avatar-btn ${isSelected ? 'active' : ''}`}
                                                onClick={() => setAvatarDraft(preset.dataUrl)}
                                                title={preset.name}
                                            >
                                                <img src={preset.dataUrl} alt={preset.name} className="preset-thumb-img" />
                                                <span className="preset-name">{preset.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="avatar-modal-footer">
                            <button 
                                type="button" 
                                className="nexus-btn-secondary" 
                                onClick={() => closeAvatarModal()}
                                disabled={isSavingAvatar}
                            >
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                className="nexus-btn-primary" 
                                onClick={handleSaveAvatar}
                                disabled={isSavingAvatar || avatarDraft === currentUser.avatar_url}
                            >
                                {isSavingAvatar ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
