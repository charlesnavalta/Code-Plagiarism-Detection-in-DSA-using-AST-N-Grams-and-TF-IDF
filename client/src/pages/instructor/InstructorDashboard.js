import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/NotificationContext';

// DRY: Shared Dashboard Components
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import ProfileCard from '../../components/dashboard/ProfileCard';
import StatCard from '../../components/dashboard/StatCard';
import RecentSubmissions from '../../components/dashboard/RecentSubmissions';
import ClassroomCardSkeleton, { EmptyClassroomSkeleton } from '../../components/dashboard/ClassroomCardSkeleton';

// Utilities
import { getUserData } from '../../utils/authUtils';

// Classroom Management & Modals
import ClassroomActionMenu from '../../components/classroom/ClassroomActionMenu';
import EditClassroomModal from '../../modals/classroom/EditClassroomModal';
import DeleteClassroomModal from '../../modals/classroom/DeleteClassroomModal';
import InstructorRosterModal from '../../modals/classroom/InstructorRosterModal';
import BatchAnalysisModal from '../../modals/instructor/BatchAnalysisModal';

const InstructorDashboard = () => {
    const [user, setUser] = useState(() => getUserData());
    const userId = user.id || user.user_id || user.username || 'instructor';
    const cacheKeyClasses = `falsicode_instructor_classes_${userId}`;
    const cacheKeyActivity = `falsicode_instructor_activity_${userId}`;

    const [batchModalOpen, setBatchModalOpen] = useState(false);

    useEffect(() => {
        const handleUserUpdate = (e) => {
            if (e.detail) setUser(e.detail);
            else setUser(getUserData());
        };
        window.addEventListener('user-avatar-changed', handleUserUpdate);
        window.addEventListener('storage', handleUserUpdate);
        return () => {
            window.removeEventListener('user-avatar-changed', handleUserUpdate);
            window.removeEventListener('storage', handleUserUpdate);
        };
    }, []);

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

    // Modal States
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [rosterModalOpen, setRosterModalOpen] = useState(false);
    const [targetClassroom, setTargetClassroom] = useState(null);

    const handleClassroomUpdated = (updated) => {
        setClassrooms(prev => {
            const next = prev.map(c => c.id === updated.id ? { ...c, ...updated } : c);
            localStorage.setItem(cacheKeyClasses, JSON.stringify(next));
            return next;
        });
    };

    const handleClassroomDeleted = (deletedId) => {
        setClassrooms(prev => {
            const next = prev.filter(c => c.id !== deletedId);
            localStorage.setItem(cacheKeyClasses, JSON.stringify(next));
            return next;
        });
    };

    const displayName = user.name || user.username || 'Instructor';
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
                        avatarUrl={user.avatar_url}
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
                        <div className="section-title-block" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                <h2>My Classroom(s)</h2>
                            </div>

                            <button
                                type="button"
                                className="btn-secondary-falsicode"
                                onClick={() => setBatchModalOpen(true)}
                                title="Upload multiple files, a folder, or a ZIP archive for immediate batch plagiarism analysis"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '7px 14px',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    fontSize: '0.82rem',
                                    background: 'rgba(59, 130, 246, 0.12)',
                                    color: 'var(--accent-primary, #3b82f6)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                                </svg>
                                Batch Folder / Files Audit
                            </button>
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
                                <div className="empty-icon" style={{ marginBottom: '14px', color: 'var(--text-dim)' }}>
                                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </div>
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
                                            <div className="card-top-action-row">
                                                <span className="node-badge">Classroom</span>
                                                <ClassroomActionMenu
                                                    role="instructor"
                                                    classroom={cls}
                                                    onEdit={(c) => { setTargetClassroom(c); setEditModalOpen(true); }}
                                                    onViewRoster={(c) => { setTargetClassroom(c); setRosterModalOpen(true); }}
                                                    onDelete={(c) => { setTargetClassroom(c); setDeleteModalOpen(true); }}
                                                />
                                            </div>
                                            <h3 className="course-title">{cls.name}</h3>

                                            <div className="course-card-meta-row">
                                                <div 
                                                    className="card-code-pill"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText(cls.invite_code);
                                                        toast.success(`Invite code "${cls.invite_code}" copied to clipboard!`, "Code Copied");
                                                    }}
                                                    title="Click to copy invite code"
                                                >
                                                    <span className="code-pill-label">Code:</span>
                                                    <strong className="code-pill-value">{cls.invite_code}</strong>
                                                    <svg className="code-pill-icon" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                                    </svg>
                                                </div>

                                                <div className="card-students-badge" title={`${cls.student_count || 0} enrolled students`}>
                                                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                                    </svg>
                                                    <span>{cls.student_count || 0} / 50 Students</span>
                                                </div>
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

            {/* Classroom Modals */}
            <EditClassroomModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                classroom={targetClassroom}
                onClassroomUpdated={handleClassroomUpdated}
            />

            <DeleteClassroomModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                classroom={targetClassroom}
                onClassroomDeleted={handleClassroomDeleted}
            />

            <InstructorRosterModal
                isOpen={rosterModalOpen}
                onClose={() => setRosterModalOpen(false)}
                classroom={targetClassroom}
            />

            <BatchAnalysisModal
                isOpen={batchModalOpen}
                onClose={() => setBatchModalOpen(false)}
            />
        </DashboardLayout>
    );
};

export default InstructorDashboard;