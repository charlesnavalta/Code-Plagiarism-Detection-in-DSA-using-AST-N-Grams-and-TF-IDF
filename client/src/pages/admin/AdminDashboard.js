import React, { useState, useEffect, useRef } from 'react';
import './AdminDashboard.css';
import api from '../../services/api'; 

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        students: 0,
        instructors: 0,
        pending: 0
    });
    const [loading, setLoading] = useState(true);
    const dashboardRef = useRef(null);

    // --- Nexus Theme Synchronization ---
    const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'dark');

    useEffect(() => {
        const handleSync = () => {
            const currentTheme = localStorage.getItem('app-theme') || 'dark';
            setTheme(currentTheme);
            document.documentElement.setAttribute('data-theme', currentTheme);
        };
        window.addEventListener('storage', handleSync);
        return () => window.removeEventListener('storage', handleSync);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/auth/users');
                const users = res.data;

                setStats({
                    students: users.filter(u => u.role === 'student').length,
                    instructors: users.filter(u => u.role === 'instructor' && u.status === 'active').length,
                    pending: users.filter(u => u.status === 'pending').length
                });
            } catch (error) {
                console.error("Critical error fetching dashboard statistics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // --- Spatial Spotlight Logic ---
    const handleMouseMove = (e) => {
        if (!dashboardRef.current) return;
        const cards = dashboardRef.current.querySelectorAll('.spatial-card');
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }
    };

    if (loading) return (
        <div className={`nexus-wrapper ${theme}`}>
            <div className="admin-loading-screen">
                <div className="quantum-spinner"></div>
                <p>Establishing uplink...</p>
            </div>
        </div>
    );

    return (
        <div className={`nexus-wrapper ${theme}`} ref={dashboardRef} onMouseMove={handleMouseMove}>
            {/* Background Aurora Engine */}
            <div className="aurora-canvas">
                <div className="aurora-blob blob-primary"></div>
                <div className="aurora-blob blob-secondary"></div>
            </div>

            <div className="admin-max-width fade-in-up">
                
                {/* --- Header Banner --- */}
                <header className="action-banner-nexus spatial-card" style={{ marginBottom: '40px' }}>
                    <div className="banner-content banner-header-split">
                        <div className="banner-text">
                            <h1>System Overview</h1>
                            <p>Global Administration Node</p>
                        </div>
                        
                        <div className="live-status-indicator static-indicator">
                            <div className="blinking-dot"></div>
                            <span>ALL SYSTEMS NOMINAL</span>
                        </div>
                    </div>
                </header>

                {/* Modern Bento Box Layout */}
                <div className="admin-bento-grid">
                    
                    {/* Primary Focus: Pending Approvals */}
                    <div className={`spatial-card bento-card ${stats.pending > 0 ? 'needs-action' : ''}`}>
                        <div className="card-glass-layer"></div>
                        <div className="card-content bento-inner relative-z">
                            <div className="bento-card-header">
                                <span className="bento-label">Pending Requests</span>
                                <div className="bento-icon orange">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                </div>
                            </div>
                            <div className="bento-value-wrapper">
                                <h2 className="bento-value text-orange">{stats.pending}</h2>
                                {stats.pending > 0 ? (
                                    <span className="bento-trend warning">Requires review</span>
                                ) : (
                                    <span className="bento-trend good">Up to date</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Secondary Stat: Students */}
                    <div className="spatial-card bento-card">
                        <div className="card-glass-layer"></div>
                        <div className="card-content bento-inner relative-z">
                            <div className="bento-card-header">
                                <span className="bento-label">Active Students</span>
                                <div className="bento-icon blue">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                </div>
                            </div>
                            <div className="bento-value-wrapper">
                                <h2 className="bento-value">{stats.students}</h2>
                                <span className="bento-trend">Total enrolled</span>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Stat: Instructors */}
                    <div className="spatial-card bento-card">
                        <div className="card-glass-layer"></div>
                        <div className="card-content bento-inner relative-z">
                            <div className="bento-card-header">
                                <span className="bento-label">Verified Instructors</span>
                                <div className="bento-icon purple">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                </div>
                            </div>
                            <div className="bento-value-wrapper">
                                <h2 className="bento-value">{stats.instructors}</h2>
                                <span className="bento-trend">Active accounts</span>
                            </div>
                        </div>
                    </div>

                    {/* Wide Health Card */}
                    <div className="spatial-card bento-card wide-card">
                        <div className="card-glass-layer"></div>
                        <div className="card-content bento-inner relative-z" style={{ padding: '35px 30px' }}>
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
        </div>
    );
};

export default AdminDashboard;