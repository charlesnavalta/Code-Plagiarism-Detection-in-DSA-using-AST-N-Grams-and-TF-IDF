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

const StudentDashboard = () => {
    const currentUser = getUserData();
    const userId = currentUser.id || currentUser.user_id || currentUser.username || 'student';
    const cacheKeyClasses = `falsicode_student_classes_${userId}`;
    const cacheKeySubs = `falsicode_student_subs_${userId}`;

    const getCached = (key) => {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    };

    const cachedClasses = getCached(cacheKeyClasses);
    const cachedSubs = getCached(cacheKeySubs);

    const [enrolledClasses, setEnrolledClasses] = useState(cachedClasses || []);
    const [submissions, setSubmissions] = useState(cachedSubs || []);
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();

    const displayName = currentUser.first_name || currentUser.name || currentUser.username || 'Student';
    const userInitial = displayName.charAt(0).toUpperCase();

    const fetchDashboardData = async () => {
        setLoading(true);
        const startTime = Date.now();
        try {
            const classRes = await api.get('/classrooms/enrolled');
            setEnrolledClasses(classRes.data);
            localStorage.setItem(cacheKeyClasses, JSON.stringify(classRes.data));

            const subRes = await api.get('/classrooms/student/history');
            setSubmissions(subRes.data);
            localStorage.setItem(cacheKeySubs, JSON.stringify(subRes.data));
        } catch (error) {
            console.error("Critical error syncing dashboard data:", error);
        } finally {
            const elapsed = Date.now() - startTime;
            const minDelay = 450;
            if (elapsed < minDelay) {
                await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
            }
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchDashboardData(); }, []);

    const handleJoinClass = async (e) => {
        e.preventDefault();
        if (!inviteCode.trim() || inviteCode.length !== 6) return toast.warning("Please enter a valid 6-digit classroom code.", "Invalid Code");

        try {
            const res = await api.post('/classrooms/join', { invite_code: inviteCode });
            toast.success(res.data.message || "Successfully joined the classroom!", "Enrolled");
            setInviteCode('');
            fetchDashboardData();
        } catch (error) {
            const backendError = error.response?.data?.error || error.response?.data?.message;
            toast.error(backendError || "Unable to join classroom. Please check the code and try again.", "Enrollment Failed");
        }
    };

    return (
        <DashboardLayout>
            <div className="nexus-layout">
                {/* --- Sidebar: Identity Node --- */}
                <aside className="nexus-sidebar fade-in-left">
                    <ProfileCard
                        displayName={displayName}
                        userInitial={userInitial}
                        roleText="Student Workspace"
                        statusLabel="ONLINE"
                        profileLink="/student/profile"
                    />
                    <StatCard
                        label="Active Enrollments"
                        value={enrolledClasses.length}
                        loading={loading}
                    />
                    <RecentSubmissions
                        submissions={submissions}
                        loading={loading}
                        role="student"
                    />
                </aside>

                {/* --- Main Hub Area --- */}
                <main className="nexus-main fade-in-up">
                    {/* Student Banner */}
                    <div className="cinematic-banner-shared spatial-card">
                        <div className="banner-content">
                            <div className="banner-text">
                                <h1>Student Hub</h1>
                                <p className="banner-subtitle desktop-only">Join classrooms and access your assignments.</p>
                            </div>

                            <form onSubmit={handleJoinClass} className="nexus-join-form">
                                <div className="input-with-icon">
                                    <input
                                        type="text" placeholder="Enter Invite Code" maxLength={6}
                                        value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                        className="nexus-input code-input"
                                    />
                                </div>
                                <button type="submit" className="nexus-btn-primary">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                    Join Class
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="workspace-section">
                        <div className="section-title-block">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            <h2>Your Active Classrooms</h2>
                        </div>

                        {loading ? (
                            cachedClasses && cachedClasses.length > 0 ? (
                                <div className="classroom-grid">
                                    <ClassroomCardSkeleton count={cachedClasses.length} />
                                </div>
                            ) : (
                                <EmptyClassroomSkeleton />
                            )
                        ) : enrolledClasses.length === 0 ? (
                            <div className="spatial-card empty-card" style={{ padding: '40px', textAlign: 'center' }}>
                                <div className="empty-icon" style={{ fontSize: '3rem', marginBottom: '10px' }}>📁</div>
                                <h3>No Classrooms Found</h3>
                                <p style={{ color: 'var(--text-dim)' }}>Gain access by entering an instructor hash code above.</p>
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
        </DashboardLayout>
    );
};

export default StudentDashboard;