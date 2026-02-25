import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './InstructorDashboard.css'; 

const InstructorDashboard = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [newClassName, setNewClassName] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchClassrooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/classrooms/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClassrooms(res.data);
        } catch (error) {
            console.error("Error fetching classrooms:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassrooms();
    }, []);

    // Calculate total students across all managed classrooms
    // Assumes your backend returns a 'student_count' property for each class
    const totalStudents = classrooms.reduce((acc, cls) => acc + (cls.student_count || 0), 0);

    const handleCreateClass = async (e) => {
        e.preventDefault();
        if (!newClassName.trim()) return alert("Please enter a class name.");
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/classrooms/', 
                { name: newClassName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewClassName('');
            fetchClassrooms(); 
        } catch (error) {
            alert("Failed to create classroom.");
        }
    };

    return (
        <div className="instructor-dashboard-wrapper">
            <div className="instructor-layout">
                {/* --- Left Sidebar --- */}
                <aside className="instructor-sidebar">
                    <div className="profile-widget">
                        <div className="avatar-glow instructor-glow">I</div>
                        <h3>Instructor Workspace</h3>
                        <p className="status-tag online">Active Session</p>
                    </div>

                    <div className="sidebar-stats">
                        <div className="mini-stat-card">
                            <span className="stat-label">Active Classes</span>
                            <span className="stat-num">{classrooms.length}</span>
                        </div>
                        
                        {/* UPDATED: Real Student Count */}
                        <div className="mini-stat-card">
                            <span className="stat-label">Total Students</span>
                            <span className="stat-num">{totalStudents}</span>
                        </div>

                        <div className="mini-stat-card">
                            <span className="stat-label">Pending Reviews</span>
                            <span className="stat-num">0</span>
                        </div>
                    </div>
                </aside>

                {/* --- Main Area --- */}
                <main className="instructor-main">
                    <header className="instructor-welcome-banner">
                        <div className="banner-info">
                            <h1>Welcome Back</h1>
                            <p>Manage your classrooms, assignments, and integrity reports.</p>
                        </div>
                        <div className="launch-glow-box">
                            <form onSubmit={handleCreateClass} className="glass-launch-form">
                                <input 
                                    type="text" 
                                    placeholder="Class Name (e.g. CS101)" 
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                />
                                <button type="submit" className="btn-glow-launch">Launch +</button>
                            </form>
                        </div>
                    </header>

                    <section className="classes-grid-container">
                        <div className="section-heading">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                            <h2>Your Managed Classrooms</h2>
                        </div>

                        {loading ? (
                            <div className="loader-wrapper"><div className="cyber-spinner"></div></div>
                        ) : classrooms.length === 0 ? (
                            <div className="instructor-empty-state">
                                <div className="empty-ring">
                                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                </div>
                                <h4>No Active Classes</h4>
                                <p>Launch your first classroom using the banner above.</p>
                            </div>
                        ) : (
                            <div className="cyber-grid">
                                {classrooms.map((cls) => (
                                    <div key={cls.id} className="cyber-card" onClick={() => navigate(`/instructor/class/${cls.id}`)}>
                                        <div className="cyber-card-content">
                                            <div className="card-top-row">
                                                <span className="card-badge instructor-badge">Active</span>
                                                <span className="student-count-pill">
                                                    👥 {cls.student_count || 0}
                                                </span>
                                            </div>
                                            <h4>{cls.name}</h4>
                                            <div className="invite-info-pill">
                                                <span>Invite Code:</span>
                                                <strong>{cls.invite_code}</strong>
                                            </div>
                                            <button className="btn-enter-cyber instructor-btn">
                                                Manage Class
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