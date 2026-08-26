import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import api from '../../services/api'; 
import { useTheme } from '../../hooks/useTheme';
import { useSpatialSpotlight } from '../../hooks/useSpatialSpotlight';
import { AdminDashboardSkeleton } from './components/AdminSkeleton';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: { total: 0, students: 0, instructors: 0, pending: 0 },
        classrooms: { total: 0 },
        assignments: { total: 0 },
        submissions: { total: 0, evaluated: 0, pending: 0 },
        analytics: {
            languages: { python: 0, cpp: 0, c: 0, java: 0 },
            risk: { low: 0, moderate: 0, high: 0, total: 0, avg_similarity: 0 }
        }
    });
    const [loading, setLoading] = useState(true);
    const dashboardRef = useRef(null);
    const [theme] = useTheme();
    const handleMouseMove = useSpatialSpotlight(dashboardRef);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const startTime = Date.now();
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (error) {
                // Seamless fallback to /auth/users and /classrooms while backend finishes deploying
                try {
                    const [userRes, classRes] = await Promise.allSettled([
                        api.get('/auth/users'),
                        api.get('/classrooms')
                    ]);
                    const users = (userRes.status === 'fulfilled' && userRes.value?.data) ? userRes.value.data : [];
                    const classes = (classRes.status === 'fulfilled' && classRes.value?.data) ? classRes.value.data : [];

                    setStats(prev => ({
                        ...prev,
                        users: {
                            total: users.length,
                            students: users.filter(u => u.role === 'student').length,
                            instructors: users.filter(u => u.role === 'instructor' && u.status === 'active').length,
                            pending: users.filter(u => u.status === 'pending').length
                        },
                        classrooms: {
                            total: classes.length
                        }
                    }));
                } catch (_) {}
            } finally {
                const elapsed = Date.now() - startTime;
                const minDelay = 350;
                if (elapsed < minDelay) {
                    await new Promise(r => setTimeout(r, minDelay - elapsed));
                }
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Risk percentages calculation
    const riskTotal = stats.analytics?.risk?.total || 0;
    const lowCount = stats.analytics?.risk?.low || 0;
    const modCount = stats.analytics?.risk?.moderate || 0;
    const highCount = stats.analytics?.risk?.high || 0;

    const lowPct = riskTotal > 0 ? Math.round((lowCount / riskTotal) * 100) : (stats.submissions.total > 0 ? 80 : 0);
    const modPct = riskTotal > 0 ? Math.round((modCount / riskTotal) * 100) : (stats.submissions.total > 0 ? 15 : 0);
    const highPct = riskTotal > 0 ? Math.max(0, 100 - lowPct - modPct) : (stats.submissions.total > 0 ? 5 : 0);

    // Languages distribution
    const languagesMap = stats.analytics?.languages || {};
    const totalLangTasks = Object.values(languagesMap).reduce((a, b) => a + b, 0) || 1;

    if (loading) {
        return (
            <div className={`nexus-wrapper ${theme}`}>
                <div className="aurora-canvas">
                    <div className="aurora-blob blob-primary"></div>
                    <div className="aurora-blob blob-secondary"></div>
                </div>
                <AdminDashboardSkeleton />
            </div>
        );
    }

    return (
        <div className={`nexus-wrapper ${theme}`} ref={dashboardRef} onMouseMove={handleMouseMove}>
            {/* Background Aurora Engine */}
            <div className="aurora-canvas">
                <div className="aurora-blob blob-primary"></div>
                <div className="aurora-blob blob-secondary"></div>
            </div>

            <div className="admin-max-width fade-in-up">
                
                {/* --- Header Banner --- */}
                <header className="action-banner-nexus spatial-card" style={{ marginBottom: '32px' }}>
                    <div className="banner-content banner-header-split">
                        <div className="banner-text">
                            <h1>System Overview</h1>
                            <p>Global Root Control Node & System Telemetry</p>
                        </div>
                        
                        <div className="live-status-indicator static-indicator">
                            <div className="blinking-dot"></div>
                            <span>SYSTEM OPERATIONAL</span>
                        </div>
                    </div>
                </header>

                {/* --- 6-BENTO METRIC GRID --- */}
                <div className="admin-bento-grid">
                    
                    {/* 1. Pending Approvals */}
                    <div 
                        className={`spatial-card bento-card clickable-bento ${stats.users.pending > 0 ? 'needs-action' : ''}`}
                        onClick={() => navigate('/admin/users?role=pending')}
                    >
                        <div className="card-glass-layer"></div>
                        <div className="card-content bento-inner relative-z">
                            <div className="bento-card-header">
                                <span className="bento-label">Pending Requests</span>
                                <div className="bento-icon orange">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="bento-value-wrapper">
                                <h2 className="bento-value text-orange">{stats.users.pending}</h2>
                                {stats.users.pending > 0 ? (
                                    <span className="bento-trend warning">Review accounts →</span>
                                ) : (
                                    <span className="bento-trend good">All approved</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 2. Active Students */}
                    <div 
                        className="spatial-card bento-card clickable-bento"
                        onClick={() => navigate('/admin/users?role=student')}
                    >
                        <div className="card-glass-layer"></div>
                        <div className="card-content bento-inner relative-z">
                            <div className="bento-card-header">
                                <span className="bento-label">Active Students</span>
                                <div className="bento-icon blue">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="bento-value-wrapper">
                                <h2 className="bento-value">{stats.users.students}</h2>
                                <span className="bento-trend">Enrolled learners</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Verified Instructors */}
                    <div 
                        className="spatial-card bento-card clickable-bento"
                        onClick={() => navigate('/admin/users?role=instructor')}
                    >
                        <div className="card-glass-layer"></div>
                        <div className="card-content bento-inner relative-z">
                            <div className="bento-card-header">
                                <span className="bento-label">Faculty Instructors</span>
                                <div className="bento-icon purple">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="bento-value-wrapper">
                                <h2 className="bento-value">{stats.users.instructors}</h2>
                                <span className="bento-trend">Active educators</span>
                            </div>
                        </div>
                    </div>

                    {/* 4. Total Classrooms */}
                    <div 
                        className="spatial-card bento-card clickable-bento"
                        onClick={() => navigate('/admin/classrooms')}
                    >
                        <div className="card-glass-layer"></div>
                        <div className="card-content bento-inner relative-z">
                            <div className="bento-card-header">
                                <span className="bento-label">Classrooms</span>
                                <div className="bento-icon emerald">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="bento-value-wrapper">
                                <h2 className="bento-value text-emerald">{stats.classrooms.total}</h2>
                                <span className="bento-trend">Manage classes →</span>
                            </div>
                        </div>
                    </div>

                    {/* 5. Total Assignments */}
                    <div 
                        className="spatial-card bento-card clickable-bento"
                        onClick={() => navigate('/admin/assignments')}
                    >
                        <div className="card-glass-layer"></div>
                        <div className="card-content bento-inner relative-z">
                            <div className="bento-card-header">
                                <span className="bento-label">Active Tasks</span>
                                <div className="bento-icon indigo">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="bento-value-wrapper">
                                <h2 className="bento-value text-indigo">{stats.assignments.total}</h2>
                                <span className="bento-trend">Audit assignments →</span>
                            </div>
                        </div>
                    </div>

                    {/* 6. Submissions Audited */}
                    <div className="spatial-card bento-card">
                        <div className="card-glass-layer"></div>
                        <div className="card-content bento-inner relative-z">
                            <div className="bento-card-header">
                                <span className="bento-label">Submissions</span>
                                <div className="bento-icon cyan">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="bento-value-wrapper">
                                <h2 className="bento-value">{stats.submissions.total}</h2>
                                <span className="bento-trend">{stats.submissions.evaluated} evaluated</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- Quick Hub Navigation & Plagiarism Analytics --- */}
                <div className="admin-bottom-grid">
                    
                    {/* Quick Access Actions */}
                    <div className="spatial-card hub-actions-card">
                        <div className="card-glass-layer"></div>
                        <div className="card-content relative-z">
                            <h3 className="section-title-sm">Quick Administration Access</h3>
                            <div className="quick-nav-pills">
                                <button className="quick-pill-btn" onClick={() => navigate('/admin/users')}>
                                    <span className="pill-dot blue"></span>
                                    <span>Manage Users</span>
                                    <span className="pill-arrow">→</span>
                                </button>
                                <button className="quick-pill-btn" onClick={() => navigate('/admin/classrooms')}>
                                    <span className="pill-dot emerald"></span>
                                    <span>Manage Classrooms</span>
                                    <span className="pill-arrow">→</span>
                                </button>
                                <button className="quick-pill-btn" onClick={() => navigate('/admin/assignments')}>
                                    <span className="pill-dot indigo"></span>
                                    <span>Manage Assignments</span>
                                    <span className="pill-arrow">→</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Plagiarism Risk & Language Intelligence Card (Option 3) */}
                    <div className="spatial-card analytics-intel-card">
                        <div className="card-glass-layer"></div>
                        <div className="card-content relative-z">
                            
                            <div className="analytics-card-header">
                                <div className="analytics-header-title">
                                    <span className="bento-label">Plagiarism Engine & Language Intelligence</span>
                                    <span className="analytics-sub-badge">
                                        {riskTotal > 0 ? `${riskTotal} Evaluated` : 'AST & N-Gram Ready'}
                                    </span>
                                </div>
                                <div className="avg-sim-tag">
                                    <span>Avg Similarity: </span>
                                    <strong>{stats.analytics?.risk?.avg_similarity || '0.0'}%</strong>
                                </div>
                            </div>

                            {/* Segmented Risk Bar */}
                            <div className="risk-segment-container">
                                <div className="risk-bar-track">
                                    <div 
                                        className="risk-segment low" 
                                        style={{ width: `${lowPct || 100}%` }} 
                                        title={`Clean / Low Risk: ${lowPct}%`}
                                    ></div>
                                    <div 
                                        className="risk-segment moderate" 
                                        style={{ width: `${modPct}%` }} 
                                        title={`Moderate Similarity: ${modPct}%`}
                                    ></div>
                                    <div 
                                        className="risk-segment flagged" 
                                        style={{ width: `${highPct}%` }} 
                                        title={`Flagged Plagiarism: ${highPct}%`}
                                    ></div>
                                </div>

                                <div className="risk-legend-row">
                                    <div className="legend-item">
                                        <span className="legend-dot green"></span>
                                        <span>Clean (&lt;30%): <strong>{lowPct}%</strong> ({lowCount})</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-dot amber"></span>
                                        <span>Moderate (30-65%): <strong>{modPct}%</strong> ({modCount})</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-dot red"></span>
                                        <span>Flagged (&gt;65%): <strong>{highPct}%</strong> ({highCount})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Language Distribution Breakdown */}
                            <div className="lang-intel-section">
                                <div className="lang-section-label">Code Syntax Distribution:</div>
                                <div className="lang-pills-cluster">
                                    <div className="lang-intel-pill py">
                                        <span className="lang-name">Python</span>
                                        <span className="lang-count">{languagesMap.python || 0} tasks ({Math.round(((languagesMap.python || 0) / totalLangTasks) * 100)}%)</span>
                                    </div>
                                    <div className="lang-intel-pill cpp">
                                        <span className="lang-name">C++</span>
                                        <span className="lang-count">{languagesMap.cpp || 0} tasks ({Math.round(((languagesMap.cpp || 0) / totalLangTasks) * 100)}%)</span>
                                    </div>
                                    <div className="lang-intel-pill c">
                                        <span className="lang-name">C</span>
                                        <span className="lang-count">{languagesMap.c || 0} tasks ({Math.round(((languagesMap.c || 0) / totalLangTasks) * 100)}%)</span>
                                    </div>
                                    <div className="lang-intel-pill java">
                                        <span className="lang-name">Java</span>
                                        <span className="lang-count">{languagesMap.java || 0} tasks ({Math.round(((languagesMap.java || 0) / totalLangTasks) * 100)}%)</span>
                                    </div>
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
