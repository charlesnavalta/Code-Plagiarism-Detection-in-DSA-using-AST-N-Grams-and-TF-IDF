import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import './Login.css'; // Reuses your beautiful login animations and card layouts

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // Step 1: Request Code, Step 2: Input Code & Reset
    const [email, setEmail] = useState(''); // Serves as the login identifier (Username or Email)
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Step 1 handler: Requests the 6-digit code
    const handleRequestCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            // Passes the input value to the 'email' payload key required by auth.py
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.message);
            setStep(2); // Advance smoothly to the code input section
        } catch (err) {
            setError(err.response?.data?.error || "Failed to initialize recovery sequence.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2 handler: Commits the verification and updates the password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError("Security error: Passwords do not match.");
        }
        
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await api.post('/auth/reset-password', {
                email, // Matches user lookup key expected by backend
                code,
                new_password: newPassword
            });
            alert(res.data.message);
            navigate('/login'); // Take them back to log into their fresh account
        } catch (err) {
            setError(err.response?.data?.error || "Validation failed. Check your code or password guidelines.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-split-wrapper">
            
            {/* LEFT COLUMN: Mirroring your clean decorative graphic cluster setup */}
            <div className="split-left-pane">
                <div className="aurora-canvas">
                    <div className="hero-bg-glow blob-1"></div>
                    <div className="hero-bg-glow blob-2"></div>
                </div>

                <div className="left-pane-content fade-in-up">
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

                    <div className="graphic-cluster fp-cluster">
                        <div className="abstract-card card-back">
                            <code>Status: Re-securing</code>
                            <div className="match-indicator" style={{ width: '60%', background: '#3b82f6' }}></div>
                        </div>
                        <div className="abstract-card card-front">
                            <code> verify_otp(******)</code>
                            <div className="dummy-code-line w-58"></div>
                            <div className="dummy-code-line w-75"></div>
                            <code style={{ color: '#10b981' }}> Keys updated_</code>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Interactive Form Block */}
            <div className="split-right-pane">
                <div className="form-container fade-in-up">
                    <h2 className="auth-title">Reset Access Signature</h2>
                    
                    {error && <p style={{ color: '#ef4444', fontSize: '13px', fontWeight: 600, margin: '10px 0' }}>{error}</p>}
                    {message && <p style={{ color: '#10b981', fontSize: '13px', fontWeight: 600, margin: '10px 0' }}>{message}</p>}

                    {step === 1 ? (
                        /* STEP 1: ENTER EMAIL / USERNAME FORM */
                        <form onSubmit={handleRequestCode}>
                            <p className="auth-subtitle">Enter your registered account username or email address to generate a verification token.</p>
                            
                            <div className="auth-input-group">
                                <div className="auth-input-wrapper">
                                    <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                    <input 
                                        type="text" 
                                        placeholder="Username or Email" 
                                        className="auth-styled-input"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? "Generating Signature..." : "Request Access Code"}
                            </button>
                        </form>
                    ) : (
                        /* STEP 2: VERIFY CODE & NEW PASSWORD FORM */
                        <form onSubmit={handleResetPassword}>
                            <p className="auth-subtitle">Code deployed to account identity: <strong>{email}</strong>. Enter the digits along with your new password configuration.</p>
                            
                            {/* 6-Digit Code Input */}
                            <div className="auth-input-group">
                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#</span>
                                    <input 
                                        type="text" 
                                        maxLength={6}
                                        placeholder="6-Digit Code" 
                                        className="auth-styled-input"
                                        value={code}
                                        onChange={e => setCode(e.target.value)} 
                                        style={{ letterSpacing: '4px', fontWeight: 'bold' }}
                                        required 
                                    />
                                </div>
                            </div>

                            {/* New Password Input */}
                            <div className="auth-input-group">
                                <div className="auth-input-wrapper">
                                    <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                    <input 
                                        type="password" 
                                        placeholder="New Password" 
                                        className="auth-styled-input"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="auth-input-group">
                                <div className="auth-input-wrapper">
                                    <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                    <input 
                                        type="password" 
                                        placeholder="Confirm New Password" 
                                        className="auth-styled-input"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? "Updating Credentials..." : "Commit Security Change"}
                            </button>
                        </form>
                    )}

                    <div className="auth-divider">
                        <span>Or</span>
                    </div>

                    <div className="register-container">
                        <Link to="/login" className="btn-create-account">Return to log-in portal</Link>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default ForgotPassword;