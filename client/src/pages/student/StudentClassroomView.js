import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import api from '../../services/api'; 
import './StudentClassroomView.css'; 
import SubmitFileModal from '../../modals/student/SubmitFileModal';
import ViewAssignmentModal from '../../modals/student/ViewAssignmentModal';

// Shared Utilities & Components
import { formatLanguageDisplay } from '../../utils/fileUtils';
import { formatDeadline } from '../../utils/dateUtils';
import InstructorWrapper from '../instructor/components/InstructorWrapper';
import QuantumLoader from '../instructor/components/QuantumLoader';

const StudentClassroomView = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const dashboardRef = useRef(null);
    
    const [classroom, setClassroom] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme] = useTheme();

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

    const handleOpenSubmission = (assignment) => {
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

    if (loading) return <QuantumLoader fullScreen={true} />;

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
                            <div className="glass-chip">
                                <span className="mono-label">STUDENT WORKSPACE</span>
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
                            const isDisabled = isSubmitted || isOverdue; 
                            
                            const language = formatLanguageDisplay(assignment.language);
                            
                            // Determine dynamic status classes
                            let statusClass = 'badge-pending';
                            let statusText = 'Pending';
                            if (isSubmitted) {
                                statusClass = 'badge-submitted';
                                statusText = 'Turned In';
                            } else if (isOverdue) {
                                statusClass = 'badge-overdue';
                                statusText = 'Overdue';
                            }

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
                                        <span className={`status-badge ${statusClass}`}>
                                            {statusText}
                                        </span>
                                    </div>
                                    
                                    <h3>{assignment.title}</h3>
                                    <p>{assignment.description}</p>
                                    
                                    <div className={`deadline-row ${isOverdue && !isSubmitted ? 'deadline-missed' : ''}`}>
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <span>Due: {formatDeadline(assignment.deadline)}</span>
                                    </div>
                                    
                                    <div className="card-footer-split">
                                        <div className="score-display">
                                            {isSubmitted ? (
                                                <>
                                                    <span className="score-label">FALSICODE SCORE</span>
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
                                            className={`btn-glass-action ${isDisabled ? 'btn-disabled' : 'btn-active'}`} 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenSubmission(assignment);
                                            }}
                                            disabled={isDisabled}
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
        </InstructorWrapper>
    );
};

export default StudentClassroomView;