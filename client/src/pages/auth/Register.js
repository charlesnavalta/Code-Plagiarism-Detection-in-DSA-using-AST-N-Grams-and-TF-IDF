import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import the new CSS file

const Register = () => {
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        role: 'student' 
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Your backend auth.py is now set up to handle the 'role' field
            await axios.post('http://localhost:5000/api/auth/register', formData);
            
            // NEW LOGIC: Dynamic alert based on the selected role
            if (formData.role === 'instructor') {
                alert("Registration Successful! Please wait for Admin approval before logging in.");
            } else {
                alert("Registration Successful! You can now log in.");
            }
            
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            placeholder="Choose a username" 
                            className="input-field"
                            onChange={e => setFormData({...formData, username: e.target.value})} 
                            required 
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="input-field"
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="Create a password" 
                            className="input-field"
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>User Role</label>
                        <select 
                            className="select-field"
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            {/* The Admin option has been intentionally removed here to prevent Privilege Escalation */}
                        </select>
                    </div>

                    <button type="submit" className="register-button">Register</button>
                </form>
                
                <p className="register-footer">
                    Already have an account? <a href="/login" className="register-link">Log in here</a>
                </p>
            </div>
        </div>
    );
};

export default Register;