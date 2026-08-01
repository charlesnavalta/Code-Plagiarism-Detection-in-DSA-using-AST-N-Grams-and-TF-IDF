import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; 
import './Register.css'; 

// Extracted Components
import AuroraBackground from '../../components/auth/shared/AuroraBackground';
import AuthInput from '../../components/auth/shared/AuthInput';
import AuthButton from '../../components/auth/shared/AuthButton';

const Register = () => {
    const [formData, setFormData] = useState({ 
        username: '', email: '', code: '', password: '', confirmPassword: '', role: 'student' 
    });
    const [loading, setLoading] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [expectedCode, setExpectedCode] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSendCode = async () => {
        if (!formData.email) return setError("Please enter an email address first.");
        setSendingCode(true);
        setError('');
        setSuccessMessage('');
        try {
            const res = await api.post('/auth/request-code', { email: formData.email });
            setSuccessMessage("Code sent! Check your inbox.");
            setExpectedCode(res.data.code);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send code.");
        } finally {
            setSendingCode(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) return setError("Passwords do not match!");
        if (!expectedCode) return setError("Please click 'Send Code' to verify your email first.");
        if (formData.code !== expectedCode) return setError("The 6-digit code you entered is incorrect.");

        setLoading(true);
        try {
            await api.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            if (formData.role === 'instructor') {
                alert("Account created successfully! Please wait for Admin approval before logging in.");
            } else {
                alert("Registration Successful! You can now log in.");
            }
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-centered-wrapper">
            <AuroraBackground />

            <div className="register-auth-card fade-in-up">
                <button className="auth-back-btn" onClick={() => navigate('/login')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back
                </button>

                <div className="register-brand-header">
                    <span className="logo-icon">⎔</span> Falsicode.
                </div>

                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Join Falsicode and start your learning journey</p>

                <form onSubmit={handleSubmit}>
                    
                    <AuthInput 
                        type="text" name="username" placeholder="Choose a username"
                        value={formData.username} required
                        onChange={e => setFormData({...formData, username: e.target.value})}
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        }
                    />
                    
                    <div className="inline-input-row">
                        <div style={{ flex: 1 }}>
                            <AuthInput 
                                type="email" name="email" placeholder="Email Address"
                                value={formData.email} required
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                }
                            />
                        </div>
                        <button 
                            type="button" className="auth-send-code-btn"
                            onClick={handleSendCode} disabled={sendingCode || !formData.email}
                        >
                            {sendingCode ? "..." : "Send Code"}
                        </button>
                    </div>

                    <AuthInput 
                        type="text" name="code" placeholder="Enter 6-digit code"
                        maxLength="6" value={formData.code} required
                        onChange={e => setFormData({...formData, code: e.target.value.replace(/\D/g, '')})}
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                        }
                    />

                    <div className="inline-input-row">
                        <div style={{ flex: 1 }}>
                            <AuthInput 
                                type="password" name="password" placeholder="Password"
                                value={formData.password} required minLength="6"
                                onChange={e => setFormData({...formData, password: e.target.value})}
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
                                type="password" name="confirmPassword" placeholder="Confirm"
                                value={formData.confirmPassword} required minLength="6"
                                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                icon={
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                }
                            />
                        </div>
                    </div>

                    {/* Role Selection (Standard HTML styling applied here to bypass the generic text input) */}
                    <div className="register-select-wrapper">
                        <svg className="register-select-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <select 
                            className="register-styled-select"
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="student">Student Account</option>
                            <option value="instructor">Instructor Account</option>
                        </select>
                    </div>

                    {error && <div className="auth-alert alert-error">{error}</div>}
                    {successMessage && <div className="auth-alert alert-success">{successMessage}</div>}

                    <div className="auth-terms-row">
                        <label className="auth-checkbox-container">
                            <input type="checkbox" required />
                            <span>I agree to the <a href="#terms" className="auth-link">Terms of Service</a></span>
                        </label>
                    </div>

                    <AuthButton variant="accent" loading={loading} loadingText="Processing...">
                        Sign Up
                    </AuthButton>
                </form>

                <div className="auth-divider"><span>Or</span></div>
                <p className="auth-footer-text">
                    Already have an account? <Link to="/login" className="auth-link bold">Log In here</Link>
                </p>
            </div>
            <div className="register-page-footer">© 2026 Falsicode. All rights reserved.</div>
        </div>
    );
};

export default Register;