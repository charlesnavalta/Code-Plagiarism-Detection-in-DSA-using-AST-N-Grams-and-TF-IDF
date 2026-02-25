import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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
            await axios.post('http://localhost:5000/api/auth/register', formData);
            
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
        <div className="register-page-wrapper">
            <div className="register-card">
                
                {/* Top Gradient Icon */}
                <div className="header-icon-container">
                    <div className="header-icon-bg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                </div>

                <h2 className="register-title">Create Account</h2>
                <p className="register-subtitle">Join Salingan and start your learning journey</p>

                <form onSubmit={handleSubmit}>
                    
                    {/* Username Input */}
                    <div className="input-group">
                        <label>Username</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <input 
                                type="text" 
                                placeholder="Choose a username" 
                                className="styled-input"
                                value={formData.username}
                                onChange={e => setFormData({...formData, username: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>
                    
                    {/* Email Input */}
                    <div className="input-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <input 
                                type="email" 
                                placeholder="you@example.com" 
                                className="styled-input"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <input 
                                type="password" 
                                placeholder="Create a password" 
                                className="styled-input"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})} 
                                required 
                                minLength="6"
                            />
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="input-group">
                        <label>User Role</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <select 
                                className="styled-input styled-select"
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="student">Student</option>
                                <option value="instructor">Instructor</option>
                            </select>
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="terms-row">
                        <label className="checkbox-container">
                            <input type="checkbox" required />
                            <span className="checkmark"></span>
                            I agree to the <a href="#terms" className="text-link">Terms of Service</a> and <a href="#privacy" className="text-link">Privacy Policy</a>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Create Account"}
                    </button>
                </form>

                {/* Divider */}
                <div className="divider">
                    <span>Or</span>
                </div>

                {/* Footer Link */}
                <p className="register-footer">
                    Already have an account? <Link to="/login" className="login-link">Sign In</Link>
                </p>
            </div>

            {/* Absolute Footer */}
            <div className="page-footer">
                © 2024 Salingan. All rights reserved.
            </div>
        </div>
    );
};

export default Register;