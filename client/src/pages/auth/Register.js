import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService'; 
import { useToast } from '../../context/NotificationContext';
import './Register.css'; 

// Shared Auth Components
import AuroraBackground from '../../components/auth/shared/AuroraBackground';
import AuthInput from '../../components/auth/shared/AuthInput';
import AuthButton from '../../components/auth/shared/AuthButton';

const Register = () => {
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        code: '', 
        password: '', 
        confirmPassword: '', 
        role: 'student' 
    });
    const [loading, setLoading] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [expectedCode, setExpectedCode] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const toast = useToast();
    const navigate = useNavigate();

    // Countdown timer for email OTP resend
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    // Password strength calculation
    const getPasswordStrength = (pass) => {
        if (!pass) return { score: 0, label: '', color: 'transparent' };
        let score = 0;
        if (pass.length >= 6) score += 1;
        if (pass.length >= 10) score += 1;
        if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' };
        if (score === 2) return { score: 2, label: 'Fair', color: '#f59e0b' };
        if (score === 3) return { score: 3, label: 'Good', color: '#3b82f6' };
        return { score: 4, label: 'Strong', color: '#10b981' };
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;
    const passwordsMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

    const handleSendCode = async () => {
        if (!formData.email) {
            setError("Please enter an email address first.");
            toast.warning("Please enter an email address first.", "Email Required");
            return;
        }
        setSendingCode(true);
        setError('');
        setSuccessMessage('');
        try {
            const data = await authService.requestCode(formData.email);
            setSuccessMessage("Verification code sent! Check your email inbox.");
            toast.success("Verification code sent! Check your email inbox.", "Code Dispatched");
            setExpectedCode(data.code);
            setCooldown(60);
        } catch (err) {
            const errText = err.response?.data?.error || "Failed to send verification code. Please try again.";
            setError(errText);
            toast.error(errText, "Verification Error");
        } finally {
            setSendingCode(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match. Please verify.", "Validation Error");
            return setError("Passwords do not match. Please verify.");
        }
        if (!expectedCode) {
            toast.warning("Please verify your email address by requesting a verification code.", "Email Verification Required");
            return setError("Please verify your email address by requesting a verification code.");
        }
        if (formData.code !== expectedCode) {
            toast.error("The 6-digit verification code you entered is incorrect.", "Invalid Code");
            return setError("The 6-digit verification code you entered is incorrect.");
        }

        setLoading(true);
        const startTime = Date.now();
        try {
            await authService.register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });

            const elapsed = Date.now() - startTime;
            if (elapsed < 450) {
                await new Promise(r => setTimeout(r, 450 - elapsed));
            }

            if (formData.role === 'instructor') {
                toast.info("Account created! Instructor accounts require administrator approval before logging in.", "Registration Pending", 6500);
            } else {
                toast.success("Registration Successful! You can now log into your account.", "Welcome to Falsicode");
            }
            setTimeout(() => navigate('/login'), 400);
        } catch (err) {
            const elapsed = Date.now() - startTime;
            if (elapsed < 450) {
                await new Promise(r => setTimeout(r, 450 - elapsed));
            }
            const errText = err.response?.data?.error || "Registration failed. Please try again.";
            setError(errText);
            toast.error(errText, "Registration Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-split-wrapper">
            {/* --- LEFT HERO PANE (Brand & Visuals) --- */}
            <div className="split-left-pane">
                <AuroraBackground />

                <div className="left-pane-content fade-in-up">
                    <div className="mobile-center-content">
                        <div className="brand-logo">
                            <span className="logo-icon">⎔</span> Falsicode.
                        </div>
                        
                        <h1 className="hero-heading">
                            Start evaluating <br/>
                            <span className="text-blue">with precision.</span>
                        </h1>
                        
                        <p className="hero-subtitle">
                            Automated AST, N-Gram & TF-IDF syntax and algorithmic plagiarism detection for computer science educators and students.
                        </p>
                    </div>

                    {/* Interactive Value Proposition Cluster */}
                    <div className="feature-cluster">
                        <div className="feature-pill">
                            <div className="pill-icon">⚡</div>
                            <div className="pill-text">
                                <strong>Real-time AST Parsing</strong>
                                <span>Detects renamed variables & structural alterations</span>
                            </div>
                        </div>

                        <div className="feature-pill">
                            <div className="pill-icon">🛡️</div>
                            <div className="pill-text">
                                <strong>Role-based Workspaces</strong>
                                <span>Dedicated student portals and instructor audit hubs</span>
                            </div>
                        </div>
                    </div>

                    <div className="graphic-cluster">
                        <div className="abstract-card card-back">
                            <code>N-Gram: 96.4%</code>
                            <div className="match-indicator"></div>
                        </div>
                        <div className="abstract-card card-front">
                            <code>def binary_search(arr, x):</code>
                            <div className="dummy-code-line w-75"></div>
                            <div className="dummy-code-line w-50"></div>
                            <div className="dummy-code-line w-100"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RIGHT PANE (Registration Form) --- */}
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

                    <h2 className="auth-title">Create an Account</h2>
                    <p className="auth-subtitle">Join the platform to start submitting or auditing code</p>

                    <form onSubmit={handleSubmit} className="register-form">
                        {/* --- 1. Interactive Role Selector --- */}
                        <div className="role-selector-container">
                            <label className="form-section-label">SELECT YOUR ACCOUNT TYPE</label>
                            <div className="role-cards-grid">
                                <div 
                                    className={`role-card ${formData.role === 'student' ? 'active' : ''}`}
                                    onClick={() => setFormData({ ...formData, role: 'student' })}
                                >
                                    <div className="role-card-header">
                                        <div className="role-radio">
                                            <span className="role-radio-dot"></span>
                                        </div>
                                    </div>
                                    <strong className="role-name">Student</strong>
                                    <span className="role-desc">Join classrooms, access tasks & submit solutions</span>
                                </div>

                                <div 
                                    className={`role-card ${formData.role === 'instructor' ? 'active' : ''}`}
                                    onClick={() => setFormData({ ...formData, role: 'instructor' })}
                                >
                                    <div className="role-card-header">
                                        <div className="role-radio">
                                            <span className="role-radio-dot"></span>
                                        </div>
                                    </div>
                                    <strong className="role-name">Instructor</strong>
                                    <span className="role-desc">Create classes & run plagiarism analysis</span>
                                </div>
                            </div>
                            
                            {formData.role === 'instructor' && (
                                <div className="role-advisory-note">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span>Instructor accounts require admin approval before activation.</span>
                                </div>
                            )}
                        </div>

                        {/* --- 2. Username --- */}
                        <div className="form-field-group">
                            <AuthInput 
                                type="text" 
                                name="username" 
                                placeholder="Choose a username"
                                value={formData.username} 
                                required
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                }
                            />
                        </div>

                        {/* --- 3. Email & OTP Verification --- */}
                        <div className="inline-input-row email-otp-row">
                            <div style={{ flex: 1 }}>
                                <AuthInput 
                                    type="email" 
                                    name="email" 
                                    placeholder="Institutional / Personal Email"
                                    value={formData.email} 
                                    required
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    icon={
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                    }
                                />
                            </div>
                            <button 
                                type="button" 
                                className="auth-send-code-btn"
                                onClick={handleSendCode} 
                                disabled={sendingCode || !formData.email || cooldown > 0}
                            >
                                {sendingCode ? (
                                    <span className="btn-spinner"></span>
                                ) : cooldown > 0 ? (
                                    `${cooldown}s`
                                ) : (
                                    "Send Code"
                                )}
                            </button>
                        </div>

                        {/* 6-Digit Code */}
                        <div className="form-field-group">
                            <AuthInput 
                                type="text" 
                                name="code" 
                                placeholder="Enter 6-digit verification code"
                                maxLength="6" 
                                value={formData.code} 
                                required
                                onChange={e => setFormData({ ...formData, code: e.target.value.replace(/\D/g, '') })}
                                extraStyles={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '2px' }}
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </svg>
                                }
                            />
                        </div>

                        {/* --- 4. Passwords --- */}
                        <div className="inline-input-row passwords-row">
                            <div style={{ flex: 1 }}>
                                <AuthInput 
                                    type="password" 
                                    name="password" 
                                    placeholder="Password"
                                    value={formData.password} 
                                    required 
                                    minLength="6"
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    icon={
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                    }
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <AuthInput 
                                    type="password" 
                                    name="confirmPassword" 
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword} 
                                    required 
                                    minLength="6"
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    icon={
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    }
                                />
                            </div>
                        </div>

                        {/* Password Strength & Match Helpers */}
                        {formData.password && (
                            <div className="password-strength-container">
                                <div className="strength-bars">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div 
                                            key={level} 
                                            className="strength-segment"
                                            style={{
                                                backgroundColor: level <= passwordStrength.score ? passwordStrength.color : 'rgba(0,0,0,0.08)'
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="strength-meta">
                                    <span className="strength-label" style={{ color: passwordStrength.color }}>
                                        Strength: {passwordStrength.label}
                                    </span>
                                    {passwordsMatch && (
                                        <span className="match-status match-success">✓ Passwords match</span>
                                    )}
                                    {passwordsMismatch && (
                                        <span className="match-status match-error">✕ Passwords do not match</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Terms checkbox */}
                        <div className="auth-terms-row">
                            <label className="auth-checkbox-container">
                                <input type="checkbox" required />
                                <span>I agree to the <a href="#terms" className="auth-link">Terms of Service</a> and <a href="#privacy" className="auth-link">Privacy Policy</a></span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <AuthButton variant="accent" loading={loading} loadingText="Creating Account...">
                            Create Account
                        </AuthButton>
                    </form>

                    <div className="auth-divider">
                        <span>Already registered?</span>
                    </div>

                    <div className="register-container">
                        <Link to="/login" className="btn-create-account">
                            Log In to Existing Account
                        </Link>
                    </div>

                    <div className="auth-page-footer">
                        © 2026 Falsicode. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;