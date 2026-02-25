import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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
            const res = await axios.post('http://localhost:5000/api/auth/login', { 
                username: email, 
                password 
            });
            
            localStorage.setItem('user', JSON.stringify(res.data.user)); 
            localStorage.setItem('token', res.data.access_token);

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
        <div className="login-page-wrapper">
            <div className="login-card">
                
                {/* Top Gradient Icon */}
                <div className="header-icon-container">
                    <div className="header-icon-bg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                </div>

                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Enter your credentials to access your account</p>

                <form onSubmit={handleLogin}>
                    
                    {/* Email Input */}
                    <div className="input-group">
                        <label>Email or Username</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <input 
                                type="text" 
                                placeholder="you@example.com" 
                                className="styled-input"
                                value={email}
                                onChange={e => setEmail(e.target.value)} 
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
                                placeholder="••••••••" 
                                className="styled-input"
                                value={password}
                                onChange={e => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    {/* Options Row */}
                    <div className="options-row">
                        <label className="checkbox-container">
                            <input type="checkbox" />
                            <span className="checkmark"></span>
                            Remember me
                        </label>
                        <a href="/forgot-password" className="forgot-link">Forgot password?</a>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                {/* Divider */}
                <div className="divider">
                    <span>Or</span>
                </div>

                {/* Footer Link */}
                <p className="login-footer">
                    Don't have an account? <Link to="/register" className="register-link">Register here</Link>
                </p>
            </div>

            {/* Absolute Footer */}
            <div className="page-footer">
                © 2024 Salingan. All rights reserved.
            </div>
        </div>
    );
};

export default Login;