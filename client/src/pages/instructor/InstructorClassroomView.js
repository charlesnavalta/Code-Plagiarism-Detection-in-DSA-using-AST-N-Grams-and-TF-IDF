import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api'; 
import './InstructorTheme.css'; 
import './InstructorClassroomView.css';

// Import our isolated components
import CreateAssignmentModal from './components/CreateAssignmentModal';
import SubmissionsAuditModal from './components/SubmissionsAuditModal';
import EditAssignmentModal from './components/EditAssignmentModal'; // <-- Newly added modal

const InstructorClassroomView = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const dashboardRef = useRef(null);
    
    const [classroom, setClassroom] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme] = useState(() => localStorage.getItem('app-theme') || 'dark');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
    const [currentSubmissions, setCurrentSubmissions] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // NEW: State to track which assignment is currently being edited
    const [editingAssignment, setEditingAssignment] = useState(null);

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
                navigate('/instructor'); 
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

    const handleViewSubmissions = async (assignment) => {
        try {
            const res = await api.get(`/classrooms/${id}/assignments/${assignment.id}/submissions`);
            setCurrentSubmissions(res.data);
            setSelectedAssignment(assignment);
            setAnalysisResults(null); 
            setShowSubmissionsModal(true);
        } catch (error) {
            alert("Access to submissions denied.");
        }
    };

    const handleRunAnalysis = async () => {
        if (currentSubmissions.length < 2) return alert("Minimum 2 submissions required.");
        setIsAnalyzing(true);
        try {
            const res = await api.post(`/analyze/${selectedAssignment.id}`, {});
            setAnalysisResults(res.data.results);
        } catch (error) {
            console.error("Full Backend Error:", error);
            alert("Analysis failed: " + (error.response?.data?.error || error.message));
        } finally {
            setIsAnalyzing(false);
        }
    };

    // NEW: Function to handle the successful update from the modal
    const handleAssignmentUpdated = (updatedAssignment) => {
        const updatedList = assignments.map(a => 
            a.id === updatedAssignment.id ? updatedAssignment : a
        );
        setAssignments(updatedList);
    };

    if (loading) return <div className="falsicode-loader"><div className="quantum-spinner"></div></div>;

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
                            <button onClick={() => navigate('/instructor')} className="neo-back-btn">Hub</button>
                            <div className="glass-chip">
                                <span className="mono-label">INVITE CODE: {classroom?.invite_code}</span>
                            </div>
                        </div>
                        <h1 className="hero-title">{classroom?.name}</h1>
                        <div className="stat-badges">
                            <span className="b-label status-active">Status: ACTIVE HUB</span>
                        </div>
                    </div>
                </header>

                <main className="content-hub">
                    <div className="hub-header">
                        <div className="header-titles">
                            <h2>Assignment</h2>
                        </div>
                        <button className="btn-primary-falsicode" onClick={() => setShowCreateModal(true)}>
                            Add New Assignment
                        </button>
                    </div>

                    <div className="assignment-grid">
                        {assignments.map((assignment, idx) => {
                            const subCount = assignment.submission_count || 0;
                            const hasSubmissions = subCount > 0;

                            return (
                                /* 🌟 NEW: Added clickable-row class and onClick handler */
                                <div 
                                    key={assignment.id} 
                                    className="assignment-item-row clickable-row"
                                    onClick={() => {
                                        console.log("Card clicked! Assignment:", assignment);
                                        setEditingAssignment(assignment);
                                    }}
                                >
                                    <div className="assignment-meta-top">
                                        <span className="task-id">
                                            TASK {String(idx + 1).padStart(2, '0')} • {assignment.language ? assignment.language.toUpperCase() : 'PYTHON'}
                                        </span>
                                        <span className={`sub-count ${hasSubmissions ? 'has-subs' : 'no-subs'}`}>
                                            {subCount} {subCount === 1 ? 'Submission' : 'Submissions'}
                                        </span>
                                    </div>
                                    
                                    <h3>{assignment.title}</h3>
                                    <p>{assignment.description}</p>
                                    
                                    <button 
                                        className={`btn-glass-action ${hasSubmissions ? 'ready-to-audit' : ''}`} 
                                        onClick={(e) => {
                                            /* 🌟 NEW: Stops the click from opening the edit modal */
                                            e.stopPropagation(); 
                                            handleViewSubmissions(assignment);
                                        }}
                                    >
                                        {hasSubmissions ? 'Launch Plagiarism Audit →' : 'View Workspace →'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>

            {/* Injected Modals */}
            <CreateAssignmentModal 
                isOpen={showCreateModal} 
                onClose={() => setShowCreateModal(false)} 
                classroomId={id}
                onAssignmentCreated={(newAssignment) => setAssignments([...assignments, newAssignment])}
            />

            <SubmissionsAuditModal 
                isOpen={showSubmissionsModal}
                onClose={() => setShowSubmissionsModal(false)}
                submissions={currentSubmissions}
                analysisResults={analysisResults}
                isAnalyzing={isAnalyzing}
                onRunAnalysis={handleRunAnalysis}
                classroomId={id} 
                assignmentId={selectedAssignment?.id} 
            />

            {/* 🌟 NEW: Pass the classroomId prop here */}
            <EditAssignmentModal
                isOpen={!!editingAssignment}
                assignment={editingAssignment}
                onClose={() => setEditingAssignment(null)}
                onAssignmentUpdated={handleAssignmentUpdated}
                classroomId={id} 
            />
        </div>
    );
};

export default InstructorClassroomView;