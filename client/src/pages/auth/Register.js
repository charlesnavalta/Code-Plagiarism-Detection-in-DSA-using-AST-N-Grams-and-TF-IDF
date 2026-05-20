import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; 
import './Register.css'; 

const Register = () => {
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        code: '', // New field for the OTP
        password: '', 
        confirmPassword: '',
        role: 'student' 
    });
    
    const [loading, setLoading] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [expectedCode, setExpectedCode] = useState(null); // Stores the code sent by backend
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // --- NEW: Trigger the email sending ---
    const handleSendCode = async () => {
        if (!formData.email) {
            setError("Please enter an email address first.");
            return;
        }
        
        setSendingCode(true);
        setError('');
        setSuccessMessage('');
        
        try {
            const res = await api.post('/auth/request-code', { email: formData.email });
            setSuccessMessage("Code sent! Check your inbox.");
            setExpectedCode(res.data.code); // Store it to compare later
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send code.");
        } finally {
            setSendingCode(false);
        }
    };

    // --- Handles the final Sign Up ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 1. Password Match Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        // 2. OTP Code Validation
        if (!expectedCode) {
            setError("Please click 'Send Code' to verify your email first.");
            return;
        }
        if (formData.code !== expectedCode) {
            setError("The 6-digit code you entered is incorrect.");
            return;
        }

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
            <div className="aurora-canvas">
                <div className="hero-bg-glow blob-1"></div>
                <div className="hero-bg-glow blob-2"></div>
            </div>

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
                    
                    {/* 1. USERNAME */}
                    <div className="auth-input-group">
                        <div className="auth-input-wrapper">
                            <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <input 
                                type="text" 
                                placeholder="Choose a username" 
                                className="auth-styled-input"
                                value={formData.username}
                                onChange={e => setFormData({...formData, username: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>
                    
                    {/* 2. EMAIL (With Send Code Button) */}
                    <div className="auth-input-group" style={{ display: 'flex', gap: '10px' }}>
                        <div className="auth-input-wrapper" style={{ flex: 1 }}>
                            <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                className="auth-styled-input"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})} 
                                required 
                            />
                        </div>
                        <button 
                            type="button" 
                            className="auth-submit-btn" 
                            style={{ width: 'auto', padding: '0 15px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.5)' }}
                            onClick={handleSendCode}
                            disabled={sendingCode || !formData.email}
                        >
                            {sendingCode ? "..." : "Send Code"}
                        </button>
                    </div>

                    {/* 3. 6-DIGIT CODE INPUT */}
                    <div className="auth-input-group">
                        <div className="auth-input-wrapper">
                            <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                            <input 
                                type="text" 
                                placeholder="Enter 6-digit code" 
                                className="auth-styled-input"
                                maxLength="6"
                                value={formData.code}
                                onChange={e => setFormData({...formData, code: e.target.value.replace(/\D/g, '')})} 
                                required 
                            />
                        </div>
                    </div>

                    {/* 4. PASSWORDS */}
                    <div className="auth-input-group" style={{ display: 'flex', gap: '10px' }}>
                        <div className="auth-input-wrapper" style={{ flex: 1 }}>
                            <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <input 
                                type="password" 
                                placeholder="Password" 
                                className="auth-styled-input"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})} 
                                required 
                                minLength="6"
                            />
                        </div>
                        <div className="auth-input-wrapper" style={{ flex: 1 }}>
                            <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <input 
                                type="password" 
                                placeholder="Confirm" 
                                className="auth-styled-input"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                                required 
                                minLength="6"
                            />
                        </div>
                    </div>

                    {/* 5. ROLE SELECTION */}
                    <div className="auth-input-group">
                        <div className="auth-input-wrapper">
                            <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <select 
                                className="auth-styled-input auth-styled-select"
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="student">Student Account</option>
                                <option value="instructor">Instructor Account</option>
                            </select>
                        </div>
                    </div>

                    {/* ALERTS */}
                    {error && <div style={{ color: '#ef4444', marginBottom: '15px', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '6px' }}>{error}</div>}
                    {successMessage && <div style={{ color: '#10b981', marginBottom: '15px', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '6px' }}>{successMessage}</div>}

                    <div className="auth-terms-row">
                        <label className="auth-checkbox-container">
                            <input type="checkbox" required />
                            <span className="auth-checkmark"></span>
                            <span>I agree to the <a href="#terms" className="auth-link">Terms of Service</a></span>
                        </label>
                    </div>

                    <button type="submit" className="auth-submit-btn register-btn-accent" disabled={loading}>
                        {loading ? "Processing..." : "Sign Up"}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>Or</span>
                </div>

                <p className="auth-footer-text">
                    Already have an account? <Link to="/login" className="auth-link bold">Log In here</Link>
                </p>
                
            </div>
            
            <div className="register-page-footer">
                © 2026 Falsicode. All rights reserved.
            </div>
        </div>
    );
};

export default Register;