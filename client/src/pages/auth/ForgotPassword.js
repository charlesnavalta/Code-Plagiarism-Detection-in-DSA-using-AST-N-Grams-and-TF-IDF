import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

// Extracted Components
import AuroraBackground from '../../components/auth/shared/AuroraBackground';
import AuthInput from '../../components/auth/shared/AuthInput';
import AuthButton from '../../components/auth/shared/AuthButton';

import './Login.css'; // Reuses the shared split-layout from Login
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); 
    const [email, setEmail] = useState(''); 
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.message);
            setStep(2); 
        } catch (err) {
            setError(err.response?.data?.error || "Failed to initialize recovery sequence.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return setError("Security error: Passwords do not match.");
        
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await api.post('/auth/reset-password', { email, code, new_password: newPassword });
            alert(res.data.message);
            navigate('/login'); 
        } catch (err) {
            setError(err.response?.data?.error || "Validation failed. Check your code or password guidelines.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-split-wrapper">
            
            <div className="split-left-pane">
                <AuroraBackground />

                <div className="left-pane-content fade-in-up">
                    
                    {/* 🌟 ADDED: The wrapper required by Login.css to center text on mobile/tablet */}
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
                            <code> verify_otp(******)</code>
                            <div className="dummy-code-line w-58"></div>
                            <div className="dummy-code-line w-75"></div>
                            <code className="text-green"> Keys updated_</code>
                        </div>
                    </div>
                </div>
            </div>

            <div className="split-right-pane">
                <div className="form-container fade-in-up">
                    <h2 className="auth-title">Reset Access Signature</h2>
                    
                    {error && <p className="auth-error-msg">{error}</p>}
                    {message && <p className="auth-success-msg">{message}</p>}

                    {step === 1 ? (
                        <form onSubmit={handleRequestCode}>
                            <p className="auth-subtitle">Enter your registered account username or email address to generate a verification token.</p>
                            
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

                            <AuthButton loading={loading} loadingText="Generating Signature...">
                                Request Access Code
                            </AuthButton>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword}>
                            <p className="auth-subtitle">Code deployed to account identity: <strong>{email}</strong>. Enter the digits along with your new password configuration.</p>
                            
                            <AuthInput 
                                type="text" name="code" placeholder="6-Digit Code"
                                maxLength={6} value={code} required
                                extraStyles={{ letterSpacing: '4px', fontWeight: 'bold' }}
                                onChange={e => setCode(e.target.value)}
                                icon={<span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#</span>}
                            />

                            <AuthInput 
                                type="password" name="newPassword" placeholder="New Password"
                                value={newPassword} required
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
                                value={confirmPassword} required
                                onChange={e => setConfirmPassword(e.target.value)}
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                }
                            />

                            <AuthButton variant="accent" loading={loading} loadingText="Updating Credentials...">
                                Commit Security Change
                            </AuthButton>
                        </form>
                    )}

                    <div className="auth-divider"><span>Or</span></div>

                    <div className="register-container">
                        <Link to="/login" className="btn-create-account">Return to log-in portal</Link>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default ForgotPassword;