import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; 
import './InstructorDashboard.css'; 

const InstructorDashboard = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [newClassName, setNewClassName] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // --- READ: Fetch Managed Classrooms ---
    const fetchClassrooms = async () => {
        try {
            const res = await api.get('/classrooms/');
            setClassrooms(res.data);
        } catch (error) {
            console.error("Critical error fetching classrooms:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassrooms();
    }, []);

    // Logic: Aggregating total student density across all nodes
    const totalStudents = classrooms.reduce((acc, cls) => acc + (cls.student_count || 0), 0);

    // --- CREATE: Initialize New Classroom Node ---
    const handleCreateClass = async (e) => {
        e.preventDefault();
        if (!newClassName.trim()) return alert("Security Notice: Please enter a valid class identifier.");
        try {
            await api.post('/classrooms/', { name: newClassName });
            setNewClassName('');
            fetchClassrooms(); 
        } catch (error) {
            alert("Protocol failure: Unable to initialize classroom node.");
        }
    };

    return (
        <div className="instructor-dashboard-wrapper">
            <div className="instructor-layout">
                {/* --- Left Sidebar Stats Cluster --- */}
                <aside className="instructor-sidebar">
                    <div className="profile-widget">
                        <div className="avatar-glow instructor-glow">I</div>
                        <h3>Instructor Workspace</h3>
                        <p className="status-tag online">Node Active</p>
                    </div>

                    <div className="sidebar-stats">
                        {/* Active Classes Card */}
                        <div className="mini-stat-card">
                            <div className="stat-header">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                <span className="stat-label">Active Classes</span>
                            </div>
                            <span className="stat-num">{classrooms.length}</span>
                        </div>
                        
                        {/* Total Enrollment Card */}
                        <div className="mini-stat-card">
                            <div className="stat-header">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                <span className="stat-label">Total Students</span>
                            </div>
                            <span className="stat-num">{totalStudents}</span>
                        </div>

                        {/* Integrity Alert Card */}
                        <div className="mini-stat-card">
                            <div className="stat-header">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span className="stat-label">Integrity Alerts</span>
                            </div>
                            <span className="stat-num">0</span>
                        </div>
                    </div>
                </aside>

                {/* --- Primary Control Center --- */}
                <main className="instructor-main">
                    <header className="instructor-welcome-banner">
                        <div className="banner-info">
                            <h1>Welcome Back</h1>
                            <p>Provision classrooms, deploy assignments, and review logic integrity reports.</p>
                        </div>
                        <div className="launch-glow-box">
                            <form onSubmit={handleCreateClass} className="glass-launch-form">
                                <input 
                                    type="text" 
                                    placeholder="Class Name (e.g. CS101)" 
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                />
                                <button type="submit" className="btn-glow-launch">Provision +</button>
                            </form>
                        </div>
                    </header>

                    <section className="classes-grid-container">
                        <div className="section-heading">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                            <h2>Active Managed Nodes</h2>
                        </div>

                        {loading ? (
                            <div className="loader-wrapper"><div className="cyber-spinner"></div></div>
                        ) : (
                            <div className="cyber-grid">
                                {classrooms.map((cls) => (
                                    <div key={cls.id} className="cyber-card" onClick={() => navigate(`/instructor/class/${cls.id}`)}>
                                        <div className="cyber-card-content">
                                            <div className="card-top-row">
                                                <span className="card-badge instructor-badge">Online</span>
                                                <span className="student-count-pill">
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                                    {cls.student_count || 0}
                                                </span>
                                            </div>
                                            <h4>{cls.name}</h4>
                                            <div className="invite-info-pill">
                                                <span>Invite Code:</span>
                                                <strong>{cls.invite_code}</strong>
                                            </div>
                                            <button className="btn-enter-cyber instructor-btn">
                                                Access Command Center
                                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default InstructorDashboard;