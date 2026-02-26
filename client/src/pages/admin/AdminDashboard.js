import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

// Import your new centralized API service
import api from '../../services/api'; 

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
                // Using the 'api' service: 
                // 1. No need for the full URL (it uses the baseURL from api.js)
                // 2. No need to manually pass the Token (the interceptor handles it)
                // 3. If the session expires (401), the interceptor will log you out automatically
                const res = await api.get('/auth/users');
                
                const users = res.data;

                // Calculate statistics based on role and status
                setStats({
                    students: users.filter(u => u.role === 'student').length,
                    instructors: users.filter(u => u.role === 'instructor' && u.status === 'active').length,
                    pending: users.filter(u => u.status === 'pending').length
                });
            } catch (error) {
                console.error("Failed to fetch dashboard statistics", error);
                // Note: If error is a 401, your api.js interceptor will redirect before this point
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="falsicode-admin-root">
            <div className="admin-max-width">
                
                {/* Clean, minimalist top header */}
                <header className="admin-clean-header">
                    <div>
                        <h1 className="admin-title">System Overview</h1>
                        <p className="admin-subtitle">Falsicode Global Administration Node</p>
                    </div>
                    <div className="live-status-indicator">
                        <div className="blinking-dot"></div>
                        <span>ALL SYSTEMS NOMINAL</span>
                    </div>
                </header>

                {/* Modern Bento Box Layout */}
                <div className="admin-bento-grid">
                    
                    {/* Primary Focus: Pending Approvals */}
                    <div className={`bento-card priority-card ${stats.pending > 0 ? 'needs-action' : ''}`}>
                        <div className="bento-card-header">
                            <span className="bento-label">Pending Requests</span>
                            <div className="bento-icon orange">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                            </div>
                        </div>
                        <div className="bento-value-wrapper">
                            <h2 className="bento-value text-orange">{loading ? '-' : stats.pending}</h2>
                            {stats.pending > 0 ? (
                                <span className="bento-trend warning">Requires review</span>
                            ) : (
                                <span className="bento-trend good">Up to date</span>
                            )}
                        </div>
                    </div>

                    {/* Secondary Stat: Students */}
                    <div className="bento-card">
                        <div className="bento-card-header">
                            <span className="bento-label">Active Students</span>
                            <div className="bento-icon blue">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                        </div>
                        <div className="bento-value-wrapper">
                            <h2 className="bento-value">{loading ? '-' : stats.students}</h2>
                            <span className="bento-trend">Total enrolled</span>
                        </div>
                    </div>

                    {/* Secondary Stat: Instructors */}
                    <div className="bento-card">
                        <div className="bento-card-header">
                            <span className="bento-label">Verified Instructors</span>
                            <div className="bento-icon purple">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                        </div>
                        <div className="bento-value-wrapper">
                            <h2 className="bento-value">{loading ? '-' : stats.instructors}</h2>
                            <span className="bento-trend">Active accounts</span>
                        </div>
                    </div>

                    {/* Wide Health Card */}
                    <div className="bento-card wide-card">
                        <div className="bento-card-header">
                            <span className="bento-label">Network Health & Uptime</span>
                            <span className="health-percentage text-green">99.99%</span>
                        </div>
                        <div className="health-visualizer">
                            <div className="health-bar-bg">
                                <div className="health-bar-fill"></div>
                            </div>
                            <div className="health-markers">
                                <span>Core Server</span>
                                <span>Database</span>
                                <span>Analysis Engine</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;