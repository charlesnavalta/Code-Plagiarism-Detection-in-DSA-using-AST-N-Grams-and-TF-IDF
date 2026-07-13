import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import api from '../../services/api'; 
import './StudentDashboard.css';

const StudentDashboard = () => {
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [submissions, setSubmissions] = useState([]); // 🌟 State for history feed
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(true);
    const dashboardRef = useRef(null);
    const navigate = useNavigate();
    const [theme] = useTheme();

    // --- Dynamic User Identity ---
    const getUserData = () => {
        try {
            const rawUser = localStorage.getItem('user') || sessionStorage.getItem('user');
            if (rawUser && rawUser !== "undefined") return JSON.parse(rawUser);
        } catch (e) { console.error("Identity Sync Error", e); }
        
        return { username: 'Guest Student', role: 'student' }; 
    };

    const currentUser = getUserData();
    const displayName = currentUser.first_name || currentUser.name || currentUser.username || 'Student';
    const userInitial = displayName.charAt(0).toUpperCase();

    // --- Helper: Format Timestamp ---
    const formatTimestamp = (isoString) => {
        if (!isoString) return 'Pending...';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // --- API Operations ---
    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Classrooms
            const classRes = await api.get('/classrooms/enrolled');
            setEnrolledClasses(classRes.data);

            // 2. Fetch Submission History 
            // (Ensure this matches the endpoint we added in the backend!)
            const subRes = await api.get('/classrooms/student/history'); 
            setSubmissions(subRes.data);
        } catch (error) { 
            console.error("Critical error syncing dashboard data:", error); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { fetchDashboardData(); }, []);

    const handleJoinClass = async (e) => {
        e.preventDefault();
        if (!inviteCode.trim() || inviteCode.length !== 6) return alert("Security Notice: Invalid code.");
        try {
            const res = await api.post('/classrooms/join', { invite_code: inviteCode });
            alert(res.data.message);
            setInviteCode('');
            fetchDashboardData();
        } catch (error) { alert("Protocol failure: Unable to join classroom."); }
    };

    // --- Senior UI: Spatial Spotlight Logic ---
    const handleMouseMove = (e) => {
        if (!dashboardRef.current) return;
        const cards = dashboardRef.current.querySelectorAll('.spatial-card');
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }
    };

    return (
        <div className={`nexus-wrapper ${theme}`} ref={dashboardRef} onMouseMove={handleMouseMove}>
            <div className="aurora-canvas">
                <div className="aurora-blob blob-primary"></div>
                <div className="aurora-blob blob-secondary"></div>
            </div>

            <div className="nexus-layout">
                {/* --- Sidebar: Identity Node --- */}
                <aside className="nexus-sidebar fade-in-left">
                    <div 
                        className="spatial-card profile-card" 
                        onClick={() => navigate('profile')} 
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-glass-layer"></div>
                        <div className="card-content">
                            <div className="avatar-hologram">
                                <div className="avatar-core">{userInitial}</div>
                                <div className="avatar-ring-1"></div>
                            </div>
                            <h2 className="user-display-name">{displayName}</h2>
                            <p className="user-role-text">Student Workspace</p>
                            <div className="system-status">
                                <span className="status-dot online"></span>ONLINE
                            </div>
                        </div>
                    </div>

                    <div className="spatial-card stat-card delay-1">
                        <div className="card-glass-layer"></div>
                        <div className="card-content">
                            <span className="stat-label">Active Enrollments</span>
                            <span className="stat-value">{enrolledClasses.length}</span>
                        </div>
                    </div>

                    {/* 🌟 REPLACED: Submission History Panel */}
                    <div className="spatial-card history-card delay-2">
                        <div className="card-glass-layer"></div>
                        <div className="card-content">
                            <span className="stat-label" style={{ marginBottom: '15px', display: 'block', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                                Recent Submissions
                            </span>
                            
                            {submissions.length === 0 ? (
                                <p className="email-dim" style={{ fontSize: '12px', textAlign: 'center', marginTop: '10px', color: '#9ca3af' }}>
                                    No submissions on record.
                                </p>
                            ) : (
                                <ul className="submission-history-list">
                                    {/* Show max 5 items to keep the sidebar clean */}
                                    {submissions.slice(0, 5).map((sub) => (
                                        <li key={sub.id} className="history-item">
                                            <div className="history-info">
                                                <strong className="history-title" title={sub.assignment_name}>
                                                    {sub.assignment_name}
                                                </strong>
                                                <span className="history-date">
                                                    {formatTimestamp(sub.date || sub.submitted_at)}
                                                </span>
                                            </div>
                                            <div className={`clean-status-pill ${sub.score && sub.score !== 'Pending' ? 'active' : 'archived'}`} style={{ padding: '2px 6px', fontSize: '10px' }}>
                                                {sub.score || 'Pending'}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </aside>

                {/* --- Main Hub Area --- */}
                <main className="nexus-main fade-in-up">
                    <div className="action-banner-nexus spatial-card">
                        <div className="banner-content">
                            <div className="banner-text">
                                <h1>Student Hub</h1>
                            </div>
                            
                            <form onSubmit={handleJoinClass} className="nexus-join-form">
                                <input 
                                    type="text" placeholder="Invite Code" maxLength={6}
                                    value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                    className="nexus-input"
                                />
                                <button type="submit" className="nexus-btn-primary">Join Class</button>
                            </form>
                        </div>
                    </div>

                    <div className="workspace-section">
                        <div className="section-title-block">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            <h2>Your Active Classrooms</h2>
                        </div>

                        {loading ? (
                            <div className="spatial-card loading-card">
                                <div className="quantum-spinner"></div>
                                <p>Synchronizing...</p>
                            </div>
                        ) : enrolledClasses.length === 0 ? (
                            <div className="spatial-card empty-card">
                                <div className="empty-icon">📁</div>
                                <h3>No Classrooms Found</h3>
                                <p>Gain access by entering an instructor hash code above.</p>
                            </div>
                        ) : (
                            <div className="classroom-grid">
                                {enrolledClasses.map((cls, index) => (
                                    <div 
                                        key={cls.id} className="spatial-card course-card" 
                                        onClick={() => navigate(`/student/class/${cls.id}`)}
                                        style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
                                    >
                                        <div className="card-glass-layer"></div>
                                        <div className="card-content flex-col">
                                            <span className="node-badge">Classroom</span>
                                            <h3 className="course-title">{cls.name}</h3>
                                            <div className="instructor-tag-nexus">
                                                <div className="ins-mini-avatar">{cls.instructor.charAt(0)}</div>
                                                <span className="ins-name">{cls.instructor}</span>
                                            </div>
                                            <div className="course-footer-nexus">
                                                <span>Open Classroom</span>
                                                <svg className="arrow-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;