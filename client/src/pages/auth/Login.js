import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; 
import './Login.css';

// Import our new extracted components
import AuroraBackground from '../../components/auth/shared/AuroraBackground';
import AuthInput from '../../components/auth/shared/AuthInput';
import AuthButton from '../../components/auth/shared/AuthButton';

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
            
            const userString = JSON.stringify(res.data.user);
            const token = res.data.access_token;

            localStorage.clear();
            sessionStorage.clear();
            localStorage.setItem('user', userString); 
            localStorage.setItem('token', token);

            const role = res.data.user.role;
            if (role === 'admin') navigate('/admin');
            else if (role === 'instructor') navigate('/instructor');
            else navigate('/student');

        } catch (err) {
            console.error("Login Error Details:", err.response);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Invalid Credentials or Server Offline";
            alert(`Login Failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-split-wrapper">
            
            <div className="split-left-pane">
                <AuroraBackground />

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

            <div className="split-right-pane">
                <div className="form-container fade-in-up">
                    
                    <h2 className="auth-title">Log into Falsicode</h2>
                    <p className="auth-subtitle">Enter your credentials to access your dashboard</p>

                    <form onSubmit={handleLogin}>
                        <AuthInput 
                            type="text"
                            name="email"
                            placeholder="Username or Email"
                            autoComplete="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            icon={
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            }
                        />

                        <AuthInput 
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            icon={
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            }
                        />

                        <div className="auth-options-row">
                            <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
                        </div>

                        <AuthButton loading={loading} loadingText="Logging in...">
                            Log In
                        </AuthButton>
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