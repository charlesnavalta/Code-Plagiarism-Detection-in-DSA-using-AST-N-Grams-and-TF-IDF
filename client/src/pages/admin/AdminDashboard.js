import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    // 1. Set up state to hold our dynamic numbers
    const [stats, setStats] = useState({
        students: 0,
        instructors: 0,
        pending: 0
    });
    const [loading, setLoading] = useState(true);

    // 2. Fetch the data when the component loads
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const users = res.data;

                // 3. Calculate the statistics using array filters
                const totalStudents = users.filter(u => u.role === 'student').length;
                const activeInstructors = users.filter(u => u.role === 'instructor' && u.status === 'active').length;
                const pendingApprovals = users.filter(u => u.status === 'pending').length;

                // 4. Update the state so React re-renders the numbers
                setStats({
                    students: totalStudents,
                    instructors: activeInstructors,
                    pending: pendingApprovals
                });
            } catch (error) {
                console.error("Failed to fetch dashboard statistics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="admin-container">
            <h1>Admin Overview</h1>
            <p className="subtitle">Welcome to the Salingan System Administration panel.</p>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Active Students</h3>
                    {/* Display '...' while loading, then show the real number */}
                    <p className="stat-number">{loading ? '...' : stats.students}</p>
                </div>
                
                <div className="stat-card">
                    <h3>Total Active Instructors</h3>
                    <p className="stat-number">{loading ? '...' : stats.instructors}</p>
                </div>

                <div className="stat-card pending-card">
                    <h3>Pending Approvals</h3>
                    <p className="stat-number">{loading ? '...' : stats.pending}</p>
                    <small>Requires your attention</small>
                </div>

                <div className="stat-card">
                    <h3>System Health</h3>
                    <p className="stat-number status-good">Online</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;