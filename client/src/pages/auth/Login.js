import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the new CSS file

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
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">LogicGuard Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email or Username</label>
                        <input 
                            type="text" 
                            placeholder="Enter your email" 
                            className="input-field"
                            value={email}
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter your password" 
                            className="input-field"
                            value={password}
                            onChange={e => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Authenticating..." : "Login"}
                    </button>
                </form>
                <p className="login-footer">
                    Don't have an account? <a href="/register" className="login-link">Register here</a>
                </p>
            </div>
        </div>
    );
};

export default Login;