import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { useToast } from '../../context/NotificationContext';

// Extracted Components
import AuroraBackground from '../../components/auth/shared/AuroraBackground';
import AuthInput from '../../components/auth/shared/AuthInput';
import AuthButton from '../../components/auth/shared/AuthButton';

import './Login.css'; // Reuses the shared split-layout from Login
import './ForgotPassword.css';

// Email format validation helper
const isValidEmailFormat = (input) => {
    if (!input || typeof input !== 'string') return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(input.trim());
};

const ForgotPassword = () => {
    const [step, setStep] = useState(1); 
    const [email, setEmail] = useState(''); 
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const toast = useToast();
    const navigate = useNavigate();

    // Countdown timer for code resend
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleRequestCode = async (e) => {
        if (e) e.preventDefault();
        const trimmed = (email || '').trim();
        if (!trimmed) {
            toast.warning("Please enter your registered username or email address.", "Input Required");
            return;
        }

        // If user is entering an email (contains @), ensure it's valid format
        if (trimmed.includes('@') && !isValidEmailFormat(trimmed)) {
            toast.error("Please enter a valid email address (e.g. name@gmail.com or name@example.com).", "Invalid Email Format");
            return;
        }

        setLoading(true);
        try {
            const data = await authService.requestPasswordReset(trimmed);
            toast.success(data.message || "Recovery code sent! Please check your email inbox.", "Code Dispatched");
            setStep(2);
            setCooldown(60);
        } catch (err) {
            const errText = err.response?.data?.error || err.response?.data?.message || "Failed to initialize recovery sequence.";
            toast.error(errText, "Recovery Error");
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        const trimmed = (email || '').trim();
        if (!trimmed || cooldown > 0) return;

        setResending(true);
        try {
            const data = await authService.requestPasswordReset(trimmed);
            toast.success(data.message || "A new recovery code has been sent to your email inbox.", "Code Dispatched");
            setCooldown(60);
        } catch (err) {
            const errText = err.response?.data?.error || err.response?.data?.message || "Failed to resend code.";
            toast.error(errText, "Resend Error");
        } finally {
            setResending(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Security error: Passwords do not match.", "Password Mismatch");
            return;
        }
        if (newPassword.length < 6) {
            toast.warning("Password must be at least 6 characters in length.", "Validation Notice");
            return;
        }
        if (!code || code.trim().length !== 6) {
            toast.warning("Please enter the 6-digit verification code sent to your email inbox.", "Code Required");
            return;
        }
        
        setLoading(true);
        try {
            const data = await authService.resetPassword({
                email: email.trim(),
                code: code.trim(),
                newPassword: newPassword,
                new_password: newPassword
            });
            toast.success(data.message || "Password updated successfully! You may now log in.", "Credentials Updated");
            setTimeout(() => navigate('/login'), 400); 
        } catch (err) {
            const errText = err.response?.data?.error || err.response?.data?.message || "Invalid or expired authorization code.";
            toast.error(errText, "Reset Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-split-wrapper">
            
            <div className="split-left-pane">
                <AuroraBackground />

                <div className="left-pane-content fade-in-up">
                    <div className="mobile-center-content">
                        <div className="brand-logo">
                            <span className="logo-icon">⎔</span> Falsicode.
                        </div>
                        
                        <h1 className="hero-heading">
                            Account Recovery <br/>
                            <span className="text-blue">Protocol.</span>
                        </h1>
                        
                        <p className="hero-subtitle">
                            Provision an authorization token to re-secure your workspace endpoints. 
                            Your code will remain valid for exactly 15 minutes.
                        </p>
                    </div>

                    <div className="graphic-cluster fp-cluster">
                        <div className="abstract-card card-back">
                            <code>Status: Re-securing</code>
                            <div className="match-indicator indicator-blue"></div>
                        </div>
                        <div className="abstract-card card-front">
                            <code>verify_otp(******)</code>
                            <div className="dummy-code-line w-75"></div>
                            <div className="dummy-code-line w-50"></div>
                            <code className="text-green">Keys updated_</code>
                        </div>
                    </div>
                </div>
            </div>

            <div className="split-right-pane">
                <div className="form-container fade-in-up">
                    <div className="form-top-nav">
                        <Link to="/login" className="auth-back-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            Back to Login
                        </Link>
                    </div>

                    <h2 className="auth-title">Reset Password</h2>

                    {step === 1 ? (
                        <form onSubmit={handleRequestCode}>
                            <p className="auth-subtitle">Enter your registered email address to receive a secure recovery code.</p>
                            
                            <AuthInput 
                                type="text" name="email" placeholder="Username or Email"
                                value={email} required
                                onChange={e => setEmail(e.target.value)}
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                }
                            />

                            <AuthButton loading={loading} loadingText="Sending Recovery Code...">
                                Request Access Code
                            </AuthButton>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword}>
                            <p className="auth-subtitle">Code dispatched to <strong>{email}</strong>. Check your Gmail inbox for the 6-digit code.</p>
                            
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '14px' }}>
                                <div style={{ flex: 1 }}>
                                    <AuthInput 
                                        type="text" name="code" placeholder="6-Digit Code"
                                        maxLength={6} value={code} required
                                        extraStyles={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '3px', fontWeight: 'bold' }}
                                        onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                                        icon={
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                            </svg>
                                        }
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    onClick={handleResendCode}
                                    disabled={resending || cooldown > 0}
                                    style={{
                                        minHeight: '48px',
                                        padding: '0 16px',
                                        background: '#eff6ff',
                                        color: '#2563eb',
                                        border: '1.5px solid #bfdbfe',
                                        borderRadius: '10px',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
                                        whiteSpace: 'nowrap',
                                        minWidth: '95px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: cooldown > 0 ? 0.7 : 1
                                    }}
                                >
                                    {resending ? '...' : cooldown > 0 ? `${cooldown}s` : 'Resend'}
                                </button>
                            </div>

                            <AuthInput 
                                type="password" name="newPassword" placeholder="New Password (min. 6 chars)"
                                value={newPassword} required minLength="6"
                                onChange={e => setNewPassword(e.target.value)}
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                }
                            />

                            <AuthInput 
                                type="password" name="confirmPassword" placeholder="Confirm New Password"
                                value={confirmPassword} required minLength="6"
                                onChange={e => setConfirmPassword(e.target.value)}
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                }
                            />

                            <AuthButton variant="accent" loading={loading} loadingText="Updating Credentials...">
                                Reset Password
                            </AuthButton>
                        </form>
                    )}
                </div>
            </div>
            
        </div>
    );
};

export default ForgotPassword;