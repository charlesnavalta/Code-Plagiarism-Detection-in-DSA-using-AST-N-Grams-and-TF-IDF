import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useSpatialSpotlight } from '../../hooks/useSpatialSpotlight';
import api from '../../services/api'; 
import './StudentClassroomView.css'; 

// Shared Utilities & Components
import { formatLanguageDisplay } from '../../utils/fileUtils';
import { formatDeadline } from '../../utils/dateUtils';
import InstructorWrapper from '../instructor/components/InstructorWrapper';
import ClassroomViewSkeleton from '../instructor/components/ClassroomViewSkeleton';

// Classroom Management & Modals
import ClassroomActionMenu from '../../components/classroom/ClassroomActionMenu';
import StudentClassmatesModal from '../../modals/classroom/StudentClassmatesModal';
import LeaveClassroomModal from '../../modals/classroom/LeaveClassroomModal';

const StudentClassroomView = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const dashboardRef = useRef(null);
    
    const [classroom, setClassroom] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [classError, setClassError] = useState(null);
    const [theme] = useTheme();
    const handleMouseMove = useSpatialSpotlight(dashboardRef);

    const [classmatesModalOpen, setClassmatesModalOpen] = useState(false);
    const [leaveModalOpen, setLeaveModalOpen] = useState(false);

    const handleClassroomLeft = () => {
        navigate('/student');
    };

    const fetchData = async () => {
        setLoading(true);
        setClassError(null);
        const startTime = Date.now();
        try {
            const [classRes, assignRes] = await Promise.all([
                api.get(`/classrooms/${id}`),
                api.get(`/classrooms/${id}/assignments`)
            ]);
            setClassroom(classRes.data);
            setAssignments(assignRes.data);
        } catch (error) {
            console.error("Error fetching classroom:", error);
            const errMsg = error.response?.data?.error || error.response?.data?.message || "Classroom not found or access denied.";
            setClassError(errMsg);
        } finally {
            const elapsed = Date.now() - startTime;
            const minDelay = 450;
            if (elapsed < minDelay) {
                await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) return <ClassroomViewSkeleton role="student" />;

    if (classError || !classroom) {
        return (
            <InstructorWrapper>
                <div className={`nexus-content student-layout ${theme}`} ref={dashboardRef} onMouseMove={handleMouseMove} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <div className="spatial-card" style={{ padding: '36px', maxWidth: '540px', width: '100%', textAlign: 'center', background: 'var(--card-bg, rgba(255,255,255,0.03))', borderRadius: '16px', border: '1px solid var(--border-color, rgba(255,255,255,0.1))' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: '#ef4444' }}>
                            <svg width="30" height="30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main, #f3f4f6)' }}>
                            Classroom Inaccessible
                        </h2>
                        <p style={{ color: 'var(--text-dim, #9ca3af)', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
                            {classError || "Unable to retrieve classroom data. You may not be enrolled or this section does not exist."}
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                className="neo-back-btn"
                                onClick={() => navigate('/student')}
                            >
                                ← Back to Student Hub
                            </button>
                            <button
                                type="button"
                                className="btn-submit-code-primary"
                                style={{ width: 'auto', padding: '9px 20px', fontSize: '13px' }}
                                onClick={fetchData}
                            >
                                ↻ Retry
                            </button>
                        </div>
                    </div>
                </div>
            </InstructorWrapper>
        );
    }

    const completedTasks = assignments.filter(a => a.has_submitted).length;
    const totalTasks = assignments.length;
    const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return (
        <InstructorWrapper>
            <div className={`nexus-content student-layout ${theme}`} ref={dashboardRef} onMouseMove={handleMouseMove}>
                
                {/* --- CINEMATIC CLASSROOM HEADER --- */}
                <header className="cinematic-banner-shared spatial-card fade-in-down classroom-hero-banner">
                    <div className="header-inner">
                        <div className="top-meta">
                            <button onClick={() => navigate('/student')} className="neo-back-btn">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="back-icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
                                </svg>
                                Hub
                            </button>
                            <div className="header-actions-cluster">
                                <div className="glass-chip">
                                    <span className="mono-label">STUDENT WORKSPACE</span>
                                </div>
                                <ClassroomActionMenu
                                    role="student"
                                    classroom={classroom}
                                    variant="header"
                                    onViewClassmates={() => setClassmatesModalOpen(true)}
                                    onLeave={() => setLeaveModalOpen(true)}
                                />
                            </div>
                        </div>
                        
                        <h1 className="hero-title">{classroom?.name}</h1>
                        
                        <div className="instructor-badge">
                            <span className="ins-label">Instructor:</span>
                            <span className="ins-name">{classroom?.instructor}</span>
                        </div>
                        
                        <div className="student-stats-row">
                            <div className="progress-track">
                                {/* The dynamic width MUST stay inline, everything else is in CSS */}
                                <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                            <span className="progress-text">{completedTasks} / {totalTasks} Tasks Completed</span>
                        </div>
                    </div>
                </header>

                {/* --- ASSIGNMENT STREAM --- */}
                <main className="content-hub">
                    <div className="hub-header">
                        <div className="header-titles">
                            <h2>Assignment(s)</h2>
                        </div>
                    </div>

                    <div className="assignment-grid">
                        {assignments.map((assignment, idx) => {
                            const isSubmitted = assignment.has_submitted;
                            const isOverdue = assignment.deadline && new Date() > new Date(assignment.deadline);
                            
                            // Read resubmission flag from backend
                            const isUnlocked = assignment.allow_resubmit; 
                            
                            // Only disable the card if they are completely locked out
                            const isDisabled = (isSubmitted && !isUnlocked) || (isOverdue && !isUnlocked); 
                            
                            const language = formatLanguageDisplay(assignment.language);
                            
                            // Determine dynamic status classes
                            let statusClass = 'badge-pending';
                            let statusText = 'Pending';
                            
                            if (isUnlocked) {
                                statusClass = 'badge-unlocked'; // Custom styling for unlocked state
                                statusText = 'Resubmit Requested';
                            } else if (isSubmitted) {
                                statusClass = 'badge-submitted';
                                statusText = 'Turned In';
                            } else if (isOverdue) {
                                statusClass = 'badge-overdue';
                                statusText = 'Overdue';
                            }

                            // Dynamic Button Text
                            let buttonText = 'Open Workspace & Submit →';
                            if (isUnlocked) buttonText = 'Resubmit Source File →';
                            else if (isSubmitted) buttonText = 'View Submitted Solution →';
                            else if (isOverdue) buttonText = 'View Assignment (Closed)';

                            return (
                                <div 
                                    key={assignment.id} 
                                    className={`assignment-item-row clickable-row ${isDisabled ? 'locked-card' : ''} ${isUnlocked ? 'unlocked-card' : ''}`}
                                    onClick={() => navigate(`/student/class/${id}/assignment/${assignment.id}`)}
                                >
                                    <div className="assignment-meta-top">
                                        <span className="task-id">
                                            TASK {String(idx + 1).padStart(2, '0')} • {language}
                                        </span>
                                        <span className={`status-badge ${statusClass}`}>
                                            {statusText}
                                        </span>
                                    </div>
                                    
                                    <h3>{assignment.title}</h3>
                                    <p>{assignment.description}</p>
                                    
                                    <div className={`deadline-row ${isOverdue && !isSubmitted && !isUnlocked ? 'deadline-missed' : ''}`}>
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <span>Due: {formatDeadline(assignment.deadline)}</span>
                                    </div>
                                    
                                    <div className="card-footer-split">
                                        <div className="score-display">
                                            {isSubmitted ? (
                                                <>
                                                    <span className="score-label">SCORE</span>
                                                    <span className={`score-value ${assignment.score === 'Pending' ? 'pending' : ''}`}>
                                                        {assignment.score}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="score-label">MAX SCORE</span>
                                                    <span className="score-value">{assignment.max_score} pts</span>
                                                </>
                                            )}
                                        </div>

                                        <button 
                                            className={`btn-glass-action btn-active ${isUnlocked ? 'btn-pulse' : ''}`} 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/student/class/${id}/assignment/${assignment.id}`);
                                            }}
                                        >
                                            {buttonText}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>

            {/* Student Classroom Modals */}
            <StudentClassmatesModal
                isOpen={classmatesModalOpen}
                onClose={() => setClassmatesModalOpen(false)}
                classroom={classroom}
            />

            <LeaveClassroomModal
                isOpen={leaveModalOpen}
                onClose={() => setLeaveModalOpen(false)}
                classroom={classroom}
                onClassroomLeft={handleClassroomLeft}
            />
        </InstructorWrapper>
    );
};

export default StudentClassroomView;