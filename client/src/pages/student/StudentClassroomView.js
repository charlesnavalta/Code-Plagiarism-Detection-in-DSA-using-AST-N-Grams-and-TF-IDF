import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api'; 
import './StudentClassroomView.css'; 
import SubmitFileModal from './components/SubmitFileModal';
import ViewAssignmentModal from './components/ViewAssignmentModal'; // <-- 1. Import new modal

const StudentClassroomView = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const dashboardRef = useRef(null);
    
    const [classroom, setClassroom] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme] = useState(() => localStorage.getItem('app-theme') || 'dark');

    // Modal States
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [activeAssignment, setActiveAssignment] = useState(null);
    const [viewAssignment, setViewAssignment] = useState(null); // <-- 2. New state for viewing

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
        if (assignment.has_submitted) return; 
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
        <div className={`falsicode-wrapper ${theme}`} ref={dashboardRef} onMouseMove={handleMouseMove}>
            <div className="aurora-canvas">
                <div className="aurora-blob blob-1"></div>
                <div className="aurora-blob blob-2"></div>
            </div>

            <div className="classroom-layout">
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
                            <h2>Assignment Queue</h2>
                            <p className="sub-text">Review requirements and deploy your source code nodes.</p>
                        </div>
                    </div>

                    <div className="assignment-grid">
                        {assignments.map((assignment, idx) => {
                            const isLocked = assignment.has_submitted;
                            const language = assignment.language ? assignment.language.toUpperCase() : 'PYTHON';

                            return (
                                /* 3. Added clickable-row class and onClick to open the View modal */
                                <div 
                                    key={assignment.id} 
                                    className={`assignment-item-row clickable-row ${isLocked ? 'locked-card' : ''}`}
                                    onClick={() => setViewAssignment(assignment)}
                                >
                                    <div className="assignment-meta-top">
                                        <span className="task-id">
                                            TASK {String(idx + 1).padStart(2, '0')} • {language}
                                        </span>
                                        <span className={`status-badge ${isLocked ? 'badge-completed' : 'badge-pending'}`}>
                                            {isLocked ? '✓ Turned In' : 'Pending'}
                                        </span>
                                    </div>
                                    
                                    <h3>{assignment.title}</h3>
                                    <p>{assignment.description}</p>
                                    
                                    <div className="card-footer-split" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div className="score-display">
                                            {isLocked ? (
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

                                        <button 
                                            className={`btn-glass-action ${isLocked ? 'btn-disabled' : 'btn-active'}`} 
                                            onClick={(e) => {
                                                /* 4. Stop propagation so clicking the button doesn't open the View modal */
                                                e.stopPropagation();
                                                handleOpenSubmission(assignment);
                                            }}
                                            disabled={isLocked}
                                            style={isLocked ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                        >
                                            {isLocked ? '🔒 Node Locked' : 'Initialize Source File →'}
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

            {/* 5. Inject the View Modal */}
            <ViewAssignmentModal 
                isOpen={!!viewAssignment}
                onClose={() => setViewAssignment(null)}
                assignment={viewAssignment}
            />
        </div>
    );
};

export default StudentClassroomView;