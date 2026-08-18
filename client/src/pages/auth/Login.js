import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { useToast } from '../../context/NotificationContext';
import './Login.css';

// Import our extracted components
import AuroraBackground from '../../components/auth/shared/AuroraBackground';
import AuthInput from '../../components/auth/shared/AuthInput';
import AuthButton from '../../components/auth/shared/AuthButton';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const startTime = Date.now();

        try {
            const data = await authService.login(email, password);
            
            const userString = JSON.stringify(data.user);
            const token = data.access_token;

            localStorage.clear();
            sessionStorage.clear();
            localStorage.setItem('user', userString); 
            localStorage.setItem('token', token);

            // Natural UX buffer to ensure smooth button loading state
            const elapsed = Date.now() - startTime;
            if (elapsed < 450) {
                await new Promise(r => setTimeout(r, 450 - elapsed));
            }

            toast.success(`Welcome back, ${data.user.username || 'User'}!`, "Access Granted");

            const role = data.user.role;
            setTimeout(() => {
                if (role === 'admin') navigate('/admin');
                else if (role === 'instructor') navigate('/instructor');
                else navigate('/student');
            }, 300);

        } catch (err) {
            const elapsed = Date.now() - startTime;
            if (elapsed < 450) {
                await new Promise(r => setTimeout(r, 450 - elapsed));
            }
            console.error("Login Error Details:", err.response);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Invalid email or password.";
            toast.error(errorMessage, "Login Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-split-wrapper">
            
            {/* LEFT PANE (Top Header on Mobile) */}
            <div className="split-left-pane">
                <AuroraBackground />

                <div className="left-pane-content fade-in-up">
                    <div className="mobile-center-content">
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
                    </div>

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

            {/* RIGHT PANE (Bottom Sheet on Mobile) */}
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