import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; 
import { useTheme } from '../../hooks/useTheme';
import './InstructorTheme.css';     // Borrowed logic (Aurora, Spatial Card)
import './InstructorDashboard.css';

const InstructorDashboard = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [newClassName, setNewClassName] = useState('');
    const [loading, setLoading] = useState(true);
    const dashboardRef = useRef(null);
    const navigate = useNavigate();

    const [theme] = useTheme();

    // --- Dynamic User Identity ---
    const getUserData = () => {
        try {
            const rawUser = localStorage.getItem('user');
            if (rawUser && rawUser !== "undefined") return JSON.parse(rawUser);
        } catch (e) { console.error("Identity Sync Error", e); }
        return { username: 'Instructor', role: 'instructor' }; 
    };

    const currentUser = getUserData();
    const displayName = currentUser.name || currentUser.username || 'Instructor';
    const userInitial = displayName.charAt(0).toUpperCase();

    // --- API Operations ---
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

    // Logic: Aggregating total student density
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
            alert("Protocol failure: Unable to initialize classroom.");
        }
    };

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

    return (

        
        <div className={`nexus-wrapper ${theme}`} ref={dashboardRef} onMouseMove={handleMouseMove}>
            {/* Background Aurora Engine */}
            <div className="aurora-canvas">
                <div className="aurora-blob blob-primary"></div>
                <div className="aurora-blob blob-secondary"></div>
            </div>

            <div className="nexus-layout">
                {/* --- Sidebar: Identity Node --- */}
                <aside className="nexus-sidebar fade-in-left">
                    <div className="spatial-card profile-card">
                        <div className="card-glass-layer"></div>
                        <div className="card-content">
                            <div className="avatar-hologram">
                                <div className="avatar-core">{userInitial}</div>
                                <div className="avatar-ring-1"></div>
                            </div>
                            <h2 className="user-display-name">{displayName}</h2>
                            <p className="user-role-text">Instructor Workspace</p>
                            <div className="system-status">
                                <span className="status-dot online"></span>ACTIVE
                            </div>
                        </div>
                    </div>

                    <div className="spatial-card stat-card delay-1">
                        <div className="card-content">
                            <span className="stat-label">Active Classes</span>
                            <span className="stat-value">{classrooms.length}</span>
                        </div>
                    </div>

                    <div className="spatial-card stat-card delay-2">
                        <div className="card-content">
                            <span className="stat-label">Total Students</span>
                            <span className="stat-value">{totalStudents}</span>
                        </div>
                    </div>
                </aside>

                {/* --- Main Hub Area --- */}
                <main className="nexus-main fade-in-up">
                    
                    {/* Action Banner */}
                    <div className="action-banner-nexus spatial-card">
                        <div className="banner-content">
                            <div className="banner-text">
                                <h1>Instructor Hub</h1>
                            </div>
                            
                            <form onSubmit={handleCreateClass} className="nexus-join-form">
                                <input 
                                    type="text" placeholder="Class Name" 
                                    value={newClassName} onChange={(e) => setNewClassName(e.target.value)}
                                    className="nexus-input"
                                />
                                <button type="submit" className="nexus-btn-primary">Create Class </button>
                            </form>
                        </div>
                    </div>

                    {/* Workspaces Grid */}
                    <div className="workspace-section">
                        <div className="section-title-block">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                            <h2>My Classroom(s)</h2>
                        </div>

                        {loading ? (
                            <div className="spatial-card loading-card">
                                <div className="quantum-spinner"></div>
                                <p>Synchronizing Classrooms...</p>
                            </div>
                        ) : classrooms.length === 0 ? (
                            <div className="spatial-card empty-card">
                                <div className="empty-icon">📁</div>
                                <h3>No Classrooms Found</h3>
                                <p>Provision a new classroom above to get started.</p>
                            </div>
                        ) : (
                            <div className="classroom-grid">
                                {classrooms.map((cls, index) => (
                                    <div 
                                        key={cls.id} className="spatial-card course-card" 
                                        onClick={() => navigate(`/instructor/class/${cls.id}`)}
                                        style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
                                    >
                                        <div className="card-glass-layer"></div>
                                        <div className="card-content flex-col">
                                            <span className="node-badge">Classroom</span>
                                            <h3 className="course-title">{cls.name}</h3>
                                            
                                            {/* Reusing student tag CSS for Instructor data */}
                                            <div className="instructor-tag-nexus">
                                                <div className="ins-mini-avatar">🔑</div>
                                                <span className="ins-name">
                                                    Code: <strong style={{color: 'var(--text-main)'}}>{cls.invite_code}</strong> | Students: {cls.student_count || 0}
                                                </span>
                                            </div>

                                            <div className="course-footer-nexus">
                                                <span>Access Classroom</span>
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

export default InstructorDashboard;