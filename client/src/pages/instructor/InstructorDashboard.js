import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/NotificationContext';

// 🌟 DRY: Shared Dashboard Components
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import ProfileCard from '../../components/dashboard/ProfileCard';
import StatCard from '../../components/dashboard/StatCard';
import RecentSubmissions from '../../components/dashboard/RecentSubmissions';
import ClassroomCardSkeleton, { EmptyClassroomSkeleton } from '../../components/dashboard/ClassroomCardSkeleton';

// Utilities
import { getUserData } from '../../utils/authUtils';

const InstructorDashboard = () => {
    const currentUser = getUserData();
    const userId = currentUser.id || currentUser.user_id || currentUser.username || 'instructor';
    const cacheKeyClasses = `falsicode_instructor_classes_${userId}`;
    const cacheKeyActivity = `falsicode_instructor_activity_${userId}`;

    const getCached = (key) => {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    };

    const cachedClasses = getCached(cacheKeyClasses);
    const cachedActivity = getCached(cacheKeyActivity);

    const [classrooms, setClassrooms] = useState(cachedClasses || []);
    const [recentActivity, setRecentActivity] = useState(cachedActivity || []);
    const [newClassName, setNewClassName] = useState('');
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();

    const displayName = currentUser.name || currentUser.username || 'Instructor';
    const userInitial = displayName.charAt(0).toUpperCase();

    const fetchDashboardData = async () => {
        setLoading(true);
        const startTime = Date.now();
        try {
            const classRes = await api.get('/classrooms/');
            setClassrooms(classRes.data);
            localStorage.setItem(cacheKeyClasses, JSON.stringify(classRes.data));

            const activityRes = await api.get('/classrooms/instructor/activity');
            setRecentActivity(activityRes.data);
            localStorage.setItem(cacheKeyActivity, JSON.stringify(activityRes.data));
        } catch (error) {
            console.error("Critical error fetching dashboard data:", error);
        } finally {
            const elapsed = Date.now() - startTime;
            const minDelay = 450;
            if (elapsed < minDelay) {
                await new Promise(r => setTimeout(r, minDelay - elapsed));
            }
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchDashboardData(); }, []);

    const handleCreateClass = async (e) => {
        e.preventDefault();
        if (!newClassName.trim()) return toast.warning("Please enter a valid class identifier.", "Class Name Required");
        try {
            await api.post('/classrooms/', { name: newClassName });
            toast.success("Classroom provisioned successfully!", "Classroom Created");
            setNewClassName('');
            fetchDashboardData();
        } catch (error) {
            toast.error("Unable to initialize classroom.", "Creation Failed");
        }
    };

    return (
        <DashboardLayout>
            <div className="nexus-layout">
                {/* --- Sidebar: Identity --- */}
                <aside className="nexus-sidebar fade-in-left">
                    <ProfileCard
                        displayName={displayName}
                        userInitial={userInitial}
                        roleText="Instructor Workspace"
                        statusLabel="ACTIVE"
                        profileLink="/instructor/profile"
                    />
                    <StatCard
                        label="Active Classes"
                        value={classrooms.length}
                        loading={loading}
                    />
                    <RecentSubmissions
                        submissions={recentActivity}
                        loading={loading}
                        role="instructor"
                    />
                </aside>

                {/* --- Main Hub Area --- */}
                <main className="nexus-main fade-in-up">
                    {/* Instructor Banner */}
                    <div className="cinematic-banner-shared spatial-card">
                        <div className="banner-content">
                            <div className="banner-text">
                                <h1>Instructor Hub</h1>
                                <p className="banner-subtitle desktop-only">Provision and manage your digital classrooms.</p>
                            </div>

                            <form onSubmit={handleCreateClass} className="nexus-join-form">
                                <div className="input-with-icon">
                                    <input
                                        type="text" placeholder="Class Name"
                                        value={newClassName} onChange={(e) => setNewClassName(e.target.value)}
                                        className="nexus-input"
                                    />
                                </div>
                                <button type="submit" className="nexus-btn-primary">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                    Create Class
                                </button>
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
                            cachedClasses && cachedClasses.length > 0 ? (
                                <div className="classroom-grid">
                                    <ClassroomCardSkeleton count={cachedClasses.length} />
                                </div>
                            ) : (
                                <EmptyClassroomSkeleton />
                            )
                        ) : classrooms.length === 0 ? (
                            <div className="spatial-card empty-card" style={{ padding: '40px', textAlign: 'center' }}>
                                <div className="empty-icon" style={{ fontSize: '3rem', marginBottom: '10px' }}>📁</div>
                                <h3>No Classrooms Found</h3>
                                <p style={{ color: 'var(--text-dim)' }}>Provision a new classroom above to get started.</p>
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
        </DashboardLayout>
    );
};

export default InstructorDashboard;