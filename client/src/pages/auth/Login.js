import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; // Swapped standard axios for centralized api service
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // No need for full URL; api service uses baseURL
            const res = await api.post('/auth/login', { 
                username: email, 
                password 
            });
            
            // Store session data
            localStorage.setItem('user', JSON.stringify(res.data.user)); 
            localStorage.setItem('token', res.data.access_token);

            // Role-based navigation
            const role = res.data.user.role;
            if (role === 'admin') navigate('/admin');
            else if (role === 'instructor') navigate('/instructor');
            else navigate('/student');

        } catch (err) {
            console.error("Login Error Details:", err.response);
            const errorMessage = err.response?.data?.error || 
                                    err.response?.data?.message || 
                                    "Invalid Credentials or Server Offline";
            alert(`Login Failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-isolated-wrapper">
            <div className="auth-card">
                
                {/* Top Purple Padlock Icon */}
                <div className="auth-header-icon">
                    <div className="auth-icon-bg purple-bg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                </div>

                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Enter your credentials to access your account</p>

                <form onSubmit={handleLogin}>
                    
                    {/* Email/Username Input */}
                    <div className="auth-input-group">
                        <label>Email or Username</label>
                        <div className="auth-input-wrapper">
                            <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <input 
                                type="text" 
                                placeholder="you@example.com" 
                                className="auth-styled-input"
                                value={email}
                                onChange={e => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="auth-input-group">
                        <label>Password</label>
                        <div className="auth-input-wrapper">
                            <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                className="auth-styled-input"
                                value={password}
                                onChange={e => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="auth-options-row">
                        <label className="auth-checkbox-container">
                            <input type="checkbox" />
                            <span className="auth-checkmark"></span>
                            Remember me
                        </label>
                        <a href="/forgot-password" className="auth-link">Forgot password?</a>
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>Or</span>
                </div>

                <p className="auth-footer-text">
                    Don't have an account? <Link to="/register" className="auth-link bold">Register here</Link>
                </p>
            </div>

            <div className="auth-page-footer">
                © 2026 Falsicode. All rights reserved.
            </div>
        </div>
    );
};

export default Login;