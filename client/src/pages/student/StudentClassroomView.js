import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import api from '../../services/api'; 
import './StudentClassroomView.css'; 
import SubmitFileModal from './components/SubmitFileModal';
import ViewAssignmentModal from './components/ViewAssignmentModal';

const StudentClassroomView = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const dashboardRef = useRef(null);
    
    const [classroom, setClassroom] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme] = useTheme();

    // Modal States
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [activeAssignment, setActiveAssignment] = useState(null);
    const [viewAssignment, setViewAssignment] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classRes, assignRes] = await Promise.all([
                    api.get(`/classrooms/${id}`),
                    api.get(`/classrooms/${id}/assignments`)
                ]);
                setClassroom(classRes.data);
                setAssignments(assignRes.data);
            } catch (error) {
                navigate('/student'); 
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleMouseMove = (e) => {
        if (!dashboardRef.current) return;
        const cards = dashboardRef.current.querySelectorAll('.spatial-card');
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }
    };

    // 🌟 HELPER: Format Deadline
    const formatDeadline = (isoString) => {
        if (!isoString) return 'No Deadline Specified';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const handleOpenSubmission = (assignment) => {
        // 🌟 LOGIC CHECK: Double check before opening modal
        const isOverdue = assignment.deadline && new Date() > new Date(assignment.deadline);
        if (assignment.has_submitted || isOverdue) return; 
        
        setActiveAssignment(assignment);
        setShowSubmitModal(true);
    };

    const handleSubmissionSuccess = (assignmentId) => {
        setAssignments(assignments.map(a => 
            a.id === assignmentId ? { ...a, has_submitted: true, score: 'Pending' } : a
        ));
    };

    if (loading) return <div className="falsicode-loader"><div className="quantum-spinner"></div></div>;

    const completedTasks = assignments.filter(a => a.has_submitted).length;
    const totalTasks = assignments.length;
    const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return (
        <div className={`nexus-wrapper ${theme}`} ref={dashboardRef} onMouseMove={handleMouseMove}>
            <div className="aurora-canvas">
                <div className="aurora-blob blob-1"></div>
                <div className="aurora-blob blob-2"></div>
            </div>

            <div className="nexus-content student-layout">
                <header className="spatial-card cinematic-header fade-in-down">
                    <div className="header-inner">
                        <div className="top-meta">
                            <button onClick={() => navigate('/student')} className="neo-back-btn">Hub</button>
                            <div className="glass-chip">
                                <span className="mono-label">STUDENT WORKSPACE</span>
                            </div>
                        </div>
                        <h1 className="hero-title">{classroom?.name}</h1>
                        <div className="instructor-badge">
                            <span className="ins-label" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', marginRight: '10px' }}>Instructor:</span>
                            <span className="ins-name" style={{ fontWeight: 'bold' }}>{classroom?.instructor}</span>
                        </div>
                        
                        <div className="student-stats-row" style={{ marginTop: '20px', maxWidth: '400px' }}>
                            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', overflow: 'hidden', marginBottom: '8px' }}>
                                <div style={{ height: '100%', width: `${progressPercentage}%`, background: '#10b981', borderRadius: '10px', transition: 'width 0.5s ease-out', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}></div>
                            </div>
                            <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>{completedTasks} / {totalTasks} Tasks Completed</span>
                        </div>
                    </div>
                </header>

                <main className="content-hub">
                    <div className="hub-header">
                        <div className="header-titles">
                            <h2>Assignment(s)</h2>
                        </div>
                    </div>

                    <div className="assignment-grid">
                        {assignments.map((assignment, idx) => {
                            // 🌟 CORE LOCK LOGIC
                            const isSubmitted = assignment.has_submitted;
                            const isOverdue = assignment.deadline && new Date() > new Date(assignment.deadline);
                            const isDisabled = isSubmitted || isOverdue; // Lock if either condition is met
                            const language = assignment.language ? assignment.language.toUpperCase() : 'PYTHON';

                            return (
                                <div 
                                    key={assignment.id} 
                                    className={`assignment-item-row clickable-row ${isDisabled ? 'locked-card' : ''}`}
                                    onClick={() => setViewAssignment(assignment)}
                                >
                                    <div className="assignment-meta-top">
                                        <span className="task-id">
                                            TASK {String(idx + 1).padStart(2, '0')} • {language}
                                        </span>
                                        {/* 🌟 DYNAMIC STATUS BADGE */}
                                        <span 
                                            className="status-badge" 
                                            style={{
                                                backgroundColor: isSubmitted ? 'rgba(16, 185, 129, 0.2)' : isOverdue ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                color: isSubmitted ? '#34d399' : isOverdue ? '#f87171' : '#fbbf24',
                                                padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold'
                                            }}
                                        >
                                            {isSubmitted ? 'Turned In' : isOverdue ? 'Overdue' : 'Pending'}
                                        </span>
                                    </div>
                                    
                                    <h3>{assignment.title}</h3>
                                    <p>{assignment.description}</p>
                                    
                                    {/* 🌟 DEADLINE DISPLAY */}
                                    <div style={{ marginTop: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <svg width="14" height="14" fill="none" stroke={isOverdue && !isSubmitted ? "#ef4444" : "#9ca3af"} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        <span style={{ color: isOverdue && !isSubmitted ? '#ef4444' : '#9ca3af', fontWeight: '500' }}>
                                            Due: {formatDeadline(assignment.deadline)}
                                        </span>
                                    </div>
                                    
                                    <div className="card-footer-split" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div className="score-display">
                                            {isSubmitted ? (
                                                <>
                                                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>FALSICODE SCORE</span>
                                                    <span style={{ fontWeight: 'bold', color: assignment.score === 'Pending' ? '#f59e0b' : 'white' }}>{assignment.score}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>MAX SCORE</span>
                                                    <span style={{ fontWeight: 'bold' }}>{assignment.max_score} pts</span>
                                                </>
                                            )}
                                        </div>

                                        {/* 🌟 DYNAMIC BUTTON TEXT */}
                                        <button 
                                            className={`btn-glass-action ${isDisabled ? 'btn-disabled' : 'btn-active'}`} 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenSubmission(assignment);
                                            }}
                                            disabled={isDisabled}
                                            style={isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                        >
                                            {isSubmitted ? 'Node Locked' : isOverdue ? 'Deadline Passed' : 'Initialize Source File →'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>

            <SubmitFileModal 
                isOpen={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                assignment={activeAssignment}
                classroomId={id}
                onSuccess={handleSubmissionSuccess}
            />

            <ViewAssignmentModal 
                isOpen={!!viewAssignment}
                onClose={() => setViewAssignment(null)}
                assignment={viewAssignment}
            />
        </div>
    );
};

export default StudentClassroomView;