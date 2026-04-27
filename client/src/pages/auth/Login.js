import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; 
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
            const res = await api.post('/auth/login', { 
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
        <div className="login-split-wrapper">
            
            {/* LEFT COLUMN: Illustrative & Branding */}
            <div className="split-left-pane">
                {/* Background Ambient Animation from your previous step */}
                <div className="aurora-canvas">
                    <div className="hero-bg-glow blob-1"></div>
                    <div className="hero-bg-glow blob-2"></div>
                </div>

                <div className="left-pane-content fade-in-up">
                    <div className="brand-logo">
                        <span className="logo-icon">⎔</span> Falsicode.
                    </div>
                    
                    <h1 className="hero-heading">
                        Analyze the logic <br/>
                        <span className="text-blue">you build.</span>
                    </h1>
                    
                    <p className="hero-subtitle">
                        Advanced structural plagiarism detection for Data Structures and Algorithms. 
                        Detect logic-copying even when variables are changed.
                    </p>

                    {/* Decorative abstract cards mimicking the FB graphic cluster */}
                    <div className="graphic-cluster">
                        <div className="abstract-card card-front">
                            <code>def quick_sort(arr):</code>
                            <div className="dummy-code-line w-75"></div>
                            <div className="dummy-code-line w-50"></div>
                            <div className="dummy-code-line w-100"></div>
                        </div>
                        <div className="abstract-card card-back">
                            <code>Match: 94.2%</code>
                            <div className="match-indicator"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: The Login Form */}
            <div className="split-right-pane">
                <div className="form-container fade-in-up">
                    
                    <h2 className="auth-title">Log into Falsicode</h2>
                    <p className="auth-subtitle">Enter your credentials to access your dashboard</p>

                    <form onSubmit={handleLogin}>
                        
                        <div className="auth-input-group">
                            <div className="auth-input-wrapper">
                                <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                <input 
                                    type="text" 
                                    placeholder="Email or mobile number" 
                                    className="auth-styled-input"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)} 
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
                                    placeholder="Password" 
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
                            {loading ? "Logging in..." : "Log In"}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>Or</span>
                    </div>

                    <div className="register-container">
                        <Link to="/register" className="btn-create-account">Create new account</Link>
                    </div>

                    <div className="auth-page-footer">
                        © 2026 Falsicode. All rights reserved.
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Login;