import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css'; 

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all users when the page loads
    // Fetch all users when the page loads
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            // We pass the token to prove we are authorized to see this data
            const res = await axios.get('http://localhost:5000/api/auth/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // SECURITY FILTER: Remove any user with the 'admin' role from the table
            const nonAdminUsers = res.data.filter(user => user.role !== 'admin');
            setUsers(nonAdminUsers);
            
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users. Ensure the backend is running.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Function to handle the "Approve" button click
    const handleApprove = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/auth/users/${userId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert("Instructor approved successfully!");
            // Refresh the table to show the updated status
            fetchUsers();
        } catch (err) {
            alert("Failed to approve user.");
        }
    };

    if (loading) return <div className="loading-text">Loading user data...</div>;
    if (error) return <div className="error-text">{error}</div>;

    return (
        <div className="user-management-container">
            <div className="header-section">
                <h2>User Management Directory</h2>
                <p>View registered users and approve pending instructor accounts.</p>
            </div>

            <div className="table-wrapper">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email Address</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td className="role-cell">
                                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                                </td>
                                <td>
                                    <span className={`status-badge ${user.status}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td>
                                    {/* Only show the Approve button if they are pending */}
                                    {user.status === 'pending' ? (
                                        <button 
                                            className="action-btn approve-btn"
                                            onClick={() => handleApprove(user.id)}
                                        >
                                            Approve
                                        </button>
                                    ) : (
                                        <span className="no-action">-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;