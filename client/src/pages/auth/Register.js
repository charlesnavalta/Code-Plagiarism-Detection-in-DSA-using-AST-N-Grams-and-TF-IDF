import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService'; 
import { useToast } from '../../context/NotificationContext';
import './Register.css'; 

import AuroraBackground from '../../components/auth/shared/AuroraBackground';
import AuthInput from '../../components/auth/shared/AuthInput';
import AuthButton from '../../components/auth/shared/AuthButton';
import TermsAndPrivacyModal from '../../modals/shared/TermsAndPrivacyModal';

// Email format validation: registration strictly requires @gmail.com format at the end
const isValidGmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const trimmed = email.trim().toLowerCase();
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(trimmed)) return false;
    const localPart = trimmed.slice(0, -10); // Strip '@gmail.com'
    if (!localPart || localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
        return false;
    }
    return true;
};

const Register = () => {
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        code: '', 
        password: '', 
        confirmPassword: '', 
        role: 'student' 
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [termsModalTab, setTermsModalTab] = useState('terms');

    const [loading, setLoading] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [codeRequested, setCodeRequested] = useState(false);
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
        if (score === 1) return { score: 1, label: 'Weak', color: '#ef4444' };
        if (score === 2) return { score: 2, label: 'Fair', color: '#f59e0b' };
        if (score === 3) return { score: 3, label: 'Good', color: '#3b82f6' };
        return { score: 4, label: 'Strong', color: '#10b981' };
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;
    const passwordsMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

    const handleOpenTerms = (tab = 'terms') => {
        setTermsModalTab(tab);
        setIsTermsModalOpen(true);
    };

    const handleSendCode = async () => {
        const trimmedEmail = (formData.email || '').trim().toLowerCase();
        if (!trimmedEmail) {
            toast.warning("Please enter your Gmail address first.", "Email Required");
            return;
        }
        if (!isValidGmail(trimmedEmail)) {
            toast.error("Registration requires an email ending with @gmail.com (e.g. name@gmail.com).", "Invalid Email Format");
            return;
        }
        setSendingCode(true);
        try {
            const data = await authService.requestCode(trimmedEmail);
            toast.success(data.message || "Verification code sent! Please check your Gmail inbox.", "Code Dispatched");
            setCodeRequested(true);
            setCooldown(60);
        } catch (err) {
            const errText = err.response?.data?.error || err.response?.data?.message || "Failed to send verification code. Please try again.";
            toast.error(errText, "Verification Error");
        } finally {
            setSendingCode(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedUsername = (formData.username || '').trim();
        const trimmedEmail = (formData.email || '').trim().toLowerCase();

        if (!trimmedUsername) {
            toast.warning("Please enter a username.", "Validation Error");
            return;
        }
        if (!trimmedEmail || !isValidGmail(trimmedEmail)) {
            toast.error("Registration requires an email ending with @gmail.com (e.g. name@gmail.com).", "Invalid Email Format");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match. Please verify.", "Validation Error");
            return;
        }
        if (!codeRequested) {
            toast.warning("Please click 'Send Code' to receive your verification code via email.", "Verification Code Required");
            return;
        }
        if (!formData.code || formData.code.trim().length !== 6) {
            toast.warning("Please enter the 6-digit verification code sent to your email inbox.", "Email Verification Required");
            return;
        }
        if (!agreedToTerms) {
            toast.warning("Please review and agree to the Terms of Service and Privacy Policy to proceed.", "Agreement Required");
            return;
        }

        setLoading(true);
        const startTime = Date.now();
        try {
            await authService.register({
                username: trimmedUsername,
                email: trimmedEmail,
                password: formData.password,
                role: formData.role,
                code: formData.code.trim()
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
                            <span className="logo-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                </svg>
                            </span> Falsicode.
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
                            <div className="pill-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                </svg>
                            </div>
                            <div className="pill-text">
                                <strong>Real-time AST Parsing</strong>
                                <span>Detects renamed variables & structural alterations</span>
                            </div>
                        </div>

                        <div className="feature-pill">
                            <div className="pill-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                            </div>
                            <div className="pill-text">
                                <strong>Role-based Workspaces</strong>
                                <span>Dedicated student portals and instructor audit hubs</span>
                            </div>
                        </div>

                        <div className="feature-pill">
                            <div className="pill-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="18" r="3"></circle>
                                    <circle cx="6" cy="6" r="3"></circle>
                                    <circle cx="18" cy="6" r="3"></circle>
                                    <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path>
                                    <path d="M12 12v3"></path>
                                </svg>
                            </div>
                            <div className="pill-text">
                                <strong>TF-IDF & Lexical Vectorization</strong>
                                <span>Identifies token frequency patterns & obfuscated boilerplate</span>
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
                                    role="button"
                                    tabIndex={0}
                                    aria-pressed={formData.role === 'student'}
                                    aria-label="Select Student account type"
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFormData({ ...formData, role: 'student' }); } }}
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
                                    role="button"
                                    tabIndex={0}
                                    aria-pressed={formData.role === 'instructor'}
                                    aria-label="Select Instructor account type"
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFormData({ ...formData, role: 'instructor' }); } }}
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
                                    placeholder="yourname@gmail.com"
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
                                aria-label={sendingCode ? 'Sending verification code' : cooldown > 0 ? `Resend available in ${cooldown} seconds` : 'Send email verification code'}
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
                                        <span className="match-status match-success">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            Passwords match
                                        </span>
                                    )}
                                    {passwordsMismatch && (
                                        <span className="match-status match-error">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                            Passwords do not match
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Form Consent — 4 policies */}
                        <div className="auth-terms-row">
                            <label className="auth-checkbox-container">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    aria-label="I agree to the Terms of Service, Privacy Policy, Cookie Policy, and Refund Policy, and consent to the processing of my data for academic purposes"
                                />
                                <span>
                                    I agree to the{' '}
                                    <button
                                        type="button"
                                        className="auth-inline-link"
                                        onClick={() => handleOpenTerms('terms')}
                                        aria-label="Read Terms of Service"
                                    >
                                        Terms of Service
                                    </button>
                                    {', '}
                                    <button
                                        type="button"
                                        className="auth-inline-link"
                                        onClick={() => handleOpenTerms('privacy')}
                                        aria-label="Read Privacy Policy"
                                    >
                                        Privacy Policy
                                    </button>
                                    {', '}
                                    <button
                                        type="button"
                                        className="auth-inline-link"
                                        onClick={() => handleOpenTerms('cookies')}
                                        aria-label="Read Cookie Policy"
                                    >
                                        Cookie Policy
                                    </button>
                                    {', and '}
                                    <button
                                        type="button"
                                        className="auth-inline-link"
                                        onClick={() => handleOpenTerms('refund')}
                                        aria-label="Read Refund Policy"
                                    >
                                        Refund Policy
                                    </button>
                                    {'. I consent to the collection and processing of my data for the academic purposes described therein.'}
                                </span>
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

            {/* Terms & Privacy Policy Modal */}
            <TermsAndPrivacyModal 
                isOpen={isTermsModalOpen}
                initialTab={termsModalTab}
                onClose={() => setIsTermsModalOpen(false)}
                onAccept={() => setAgreedToTerms(true)}
            />
        </div>
    );
};

export default Register;