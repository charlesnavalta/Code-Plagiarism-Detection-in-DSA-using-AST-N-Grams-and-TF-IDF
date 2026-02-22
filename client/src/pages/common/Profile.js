import React, { useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const rawUser = localStorage.getItem('user');
    const user = rawUser && rawUser !== "undefined" ? JSON.parse(rawUser) : {};

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            return setError("Passwords do not match!");
        }

        if (newPassword.length < 6) {
            return setError("Password must be at least 6 characters.");
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:5000/api/auth/profile', 
                { new_password: newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message);
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Account Settings</h2>
                <p>Manage your account credentials here.</p>
            </div>

            <div className="profile-card">
                {/* Read-Only Information */}
                <div className="profile-info-section">
                    <div className="info-group">
                        <label>Username</label>
                        <input type="text" value={user.username || ''} disabled className="disabled-input" />
                    </div>
                    <div className="info-group">
                        <label>Email Address</label>
                        <input type="email" value={user.email || ''} disabled className="disabled-input" />
                    </div>
                    <div className="info-group">
                        <label>Account Role</label>
                        <span className="role-badge">{user.role?.toUpperCase()}</span>
                    </div>
                </div>

                <hr className="profile-divider" />

                {/* Password Update Form */}
                <form onSubmit={handleUpdatePassword} className="profile-form">
                    <h3>Update Password</h3>
                    
                    {message && <div className="alert-success">{message}</div>}
                    {error && <div className="alert-error">{error}</div>}

                    <div className="form-group">
                        <label>New Password</label>
                        <input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            placeholder="Enter new password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            placeholder="Confirm new password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-update" disabled={loading}>
                        {loading ? "Updating..." : "Save New Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;