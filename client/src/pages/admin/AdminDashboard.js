import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        students: 0,
        instructors: 0,
        pending: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const users = res.data;
                const totalStudents = users.filter(u => u.role === 'student').length;
                const activeInstructors = users.filter(u => u.role === 'instructor' && u.status === 'active').length;
                const pendingApprovals = users.filter(u => u.status === 'pending').length;

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
        <div className="admin-dashboard-wrapper">
            <div className="admin-layout-container">
                
                {/* Standardized Dark Banner */}
                <header className="admin-welcome-banner">
                    <div className="banner-content">
                        <h1>Admin Overview</h1>
                        <p>Falsicode Central Intelligence: System growth and verification monitoring.</p>
                    </div>
                    <div className="banner-badge-glass">
                        <span>System Status</span>
                        <strong className="status-online-glow">OPERATIONAL</strong>
                    </div>
                </header>

                <div className="admin-grid-section">
                    <div className="section-header-title">
                        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        <h2>Platform Analytics</h2>
                    </div>

                    <div className="cyber-stats-grid">
                        {/* Active Students Card */}
                        <div className="stat-cyber-card">
                            <div className="stat-icon-wrapper blue-glow">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                            <div className="stat-data">
                                <span className="stat-title">Active Students</span>
                                <p className="stat-value">{loading ? '...' : stats.students}</p>
                            </div>
                        </div>

                        {/* Active Instructors Card */}
                        <div className="stat-cyber-card">
                            <div className="stat-icon-wrapper purple-glow">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <div className="stat-data">
                                <span className="stat-title">Verified Instructors</span>
                                <p className="stat-value">{loading ? '...' : stats.instructors}</p>
                            </div>
                        </div>

                        {/* Pending Approvals Card - Highlights if > 0 */}
                        <div className={`stat-cyber-card ${stats.pending > 0 ? 'warning-glow-border' : ''}`}>
                            <div className="stat-icon-wrapper orange-glow">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                            <div className="stat-data">
                                <span className="stat-title">Pending Approvals</span>
                                <p className="stat-value text-orange">{loading ? '...' : stats.pending}</p>
                                {stats.pending > 0 && <small className="action-hint">Attention Required</small>}
                            </div>
                        </div>

                        {/* System Health Card */}
                        <div className="stat-cyber-card">
                            <div className="stat-icon-wrapper green-glow">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </div>
                            <div className="stat-data">
                                <span className="stat-title">System Health</span>
                                <p className="stat-value text-green">99.9%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;