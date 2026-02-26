import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Changed: Using centralized api service
import api from '../../services/api'; 
import './StudentDashboard.css';

const StudentDashboard = () => {
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // --- READ: Fetch Enrolled Classroom Nodes ---
    const fetchEnrolledClasses = async () => {
        try {
            // Simplified: Headers and Base URL handled by interceptor
            const res = await api.get('/classrooms/enrolled');
            setEnrolledClasses(res.data);
        } catch (error) {
            console.error("Critical error syncing enrolled nodes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrolledClasses();
    }, []);

    // --- CREATE: Join New Classroom Node ---
    const handleJoinClass = async (e) => {
        e.preventDefault();
        if (!inviteCode.trim() || inviteCode.length !== 6) {
            return alert("Security Notice: Please enter a valid 6-character invite code.");
        }

        try {
            const res = await api.post('/classrooms/join', { 
                invite_code: inviteCode 
            });
            alert(res.data.message);
            setInviteCode('');
            fetchEnrolledClasses();
        } catch (error) {
            alert(error.response?.data?.error || "Protocol failure: Unable to join classroom.");
        }
    };

    return (
        <div className="student-dashboard-wrapper">
            <div className="student-layout">
                {/* --- Left Sidebar --- */}
                <aside className="student-sidebar">
                    <div className="profile-widget">
                        <div className="avatar-glow">S</div>
                        <h3>Student Workspace</h3>
                        <p className="status-tag">Node Online</p>
                    </div>

                    <div className="sidebar-stats">
                        <div className="mini-stat-card">
                            <span className="stat-label">Active Enrollments</span>
                            <span className="stat-num">{enrolledClasses.length}</span>
                        </div>
                        <div className="mini-stat-card">
                            <span className="stat-label">Logic Checks</span>
                            <span className="stat-num">0</span>
                        </div>
                    </div>
                </aside>

                {/* --- Main Dashboard Area --- */}
                <main className="student-main">
                    <header className="student-welcome-banner">
                        <div className="banner-info">
                            <h1>Welcome Back</h1>
                            <p>Provision your logic for analysis. Join a node or continue your progress below.</p>
                        </div>
                        <div className="invite-glow-box">
                            <form onSubmit={handleJoinClass} className="glass-join-form">
                                <input 
                                    type="text" 
                                    placeholder="Invite Code" 
                                    maxLength={6}
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                />
                                <button type="submit" className="btn-glow-join">Join Node +</button>
                            </form>
                        </div>
                    </header>

                    <section className="classes-grid-container">
                        <div className="section-heading">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            <h2>Your Active Classrooms</h2>
                        </div>

                        {loading ? (
                            <div className="student-loader-wrapper">
                                <div className="cyber-spinner"></div>
                                <p>Synchronizing codebases...</p>
                            </div>
                        ) : enrolledClasses.length === 0 ? (
                            <div className="student-empty-state">
                                <div className="empty-ring">
                                    <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <h3>Workspace Empty</h3>
                                <p>You aren't enrolled in any nodes. Enter an invite code in the terminal above.</p>
                            </div>
                        ) : (
                            <div className="cyber-grid">
                                {enrolledClasses.map((cls) => (
                                    <div key={cls.id} className="cyber-card" onClick={() => navigate(`/student/class/${cls.id}`)}>
                                        <div className="cyber-card-overlay"></div>
                                        <div className="cyber-card-content">
                                            <span className="card-badge">Course Node</span>
                                            <h4>{cls.name}</h4>
                                            <div className="instructor-info">
                                                <div className="instructor-avatar-mini">{cls.instructor.charAt(0)}</div>
                                                <span>{cls.instructor}</span>
                                            </div>
                                            <button className="btn-enter-cyber">
                                                Open Workspace
                                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
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

export default StudentDashboard;