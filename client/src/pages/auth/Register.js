import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; 
import './Register.css'; 

const Register = () => {
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        role: 'student' 
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', formData);
            
            if (formData.role === 'instructor') {
                alert("Registration Successful! Please wait for Admin approval before logging in.");
            } else {
                alert("Registration Successful! You can now log in.");
            }
            
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-centered-wrapper">
            
            {/* Ambient Animated Background */}
            <div className="aurora-canvas">
                <div className="hero-bg-glow blob-1"></div>
                <div className="hero-bg-glow blob-2"></div>
            </div>

            {/* Centered Registration Card */}
            <div className="register-auth-card fade-in-up">
                
                {/* Back to Login Button */}
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
                    
                    <div className="auth-input-group">
                        <div className="auth-input-wrapper">
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
                    </div>

                    <div className="auth-input-group">
                        <div className="auth-input-wrapper">
                            <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <input 
                                type="password" 
                                placeholder="Create a password" 
                                className="auth-styled-input"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})} 
                                required 
                                minLength="6"
                            />
                        </div>
                    </div>

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

                    <div className="auth-terms-row">
                        <label className="auth-checkbox-container">
                            <input type="checkbox" required />
                            <span className="auth-checkmark"></span>
                            <span>I agree to the <a href="#terms" className="auth-link">Terms of Service</a> & <a href="#privacy" className="auth-link">Privacy Policy</a></span>
                        </label>
                    </div>

                    <button type="submit" className="auth-submit-btn register-btn-accent" disabled={loading}>
                        {loading ? "Registering..." : "Sign Up"}
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