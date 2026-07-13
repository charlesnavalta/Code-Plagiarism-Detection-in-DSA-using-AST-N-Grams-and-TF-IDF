import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; 
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // 🌟 NEW: Visibility state
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
            
            const userString = JSON.stringify(res.data.user);
            const token = res.data.access_token;

            // Clear out any old lingering data first to prevent conflicts
            localStorage.clear();
            sessionStorage.clear();

            // Store the new session tokens securely in standard local storage
            localStorage.setItem('user', userString); 
            localStorage.setItem('token', token);

            // Route the user to their dashboard
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

                    <div className="graphic-cluster">
                        <div className="abstract-card card-back">
                            <code>Match: 94.2%</code>
                            <div className="match-indicator"></div>
                        </div>
                        <div className="abstract-card card-front">
                            <code>def quick_sort(arr):</code>
                            <div className="dummy-code-line w-75"></div>
                            <div className="dummy-code-line w-50"></div>
                            <div className="dummy-code-line w-100"></div>
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
                                    name="email"
                                    autoComplete="username"
                                    placeholder="Username or Email" 
                                    className="auth-styled-input"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="auth-input-group">
                            <div className="auth-input-wrapper" style={{ position: 'relative' }}>
                                {/* 🌟 Lock Icon */}
                                <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                
                                <input 
                                    type={showPassword ? "text" : "password"} // 🌟 Toggles input type
                                    name="password"
                                    autoComplete="current-password"
                                    placeholder="Password" 
                                    className="auth-styled-input"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                    style={{ paddingRight: '40px' }} // 🌟 Prevents text from hiding behind the icon
                                />
                                
                                {/* 🌟 NEW: Visibility Toggle Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#9ca3af',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 0
                                    }}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        // Eye Off (Crossed out)
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    ) : (
                                        // Eye On
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="auth-options-row" style={{ justifyContent: 'flex-end' }}>
                            <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
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