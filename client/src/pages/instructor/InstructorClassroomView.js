import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api'; 
import './InstructorClassroomView.css';

// Utilities & Shared Components
import { formatLanguageDisplay } from '../../utils/fileUtils';
import InstructorWrapper from './components/InstructorWrapper';
import QuantumLoader from './components/QuantumLoader';

// Modals
import CreateAssignmentModal from '../../modals/instructor/CreateAssignmentModal';
import SubmissionsAuditModal from '../../modals/instructor/SubmissionsAuditModal';
import EditAssignmentModal from '../../modals/instructor/EditAssignmentModal';

const InstructorClassroomView = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [classroom, setClassroom] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
    const [currentSubmissions, setCurrentSubmissions] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
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
            alert("Analysis failed: " + (error.response?.data?.error || error.message));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAssignmentUpdated = (updatedAssignment) => {
        setAssignments(assignments.map(a => a.id === updatedAssignment.id ? updatedAssignment : a));
    };

    const handleAssignmentDeleted = (deletedAssignmentId) => {
        setAssignments(currentAssignments => currentAssignments.filter(a => a.id !== deletedAssignmentId));
    };

    if (loading) return <QuantumLoader fullScreen={true} />;

    return (
        <InstructorWrapper>
            <div className="nexus-content instructor-layout">
                {/* 🌟 FIX: Removed inline styles, added 'classroom-hero-banner' class */}
                <header className="cinematic-banner-shared spatial-card fade-in-down classroom-hero-banner">
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
                            <h2>Assignment(s)</h2>
                        </div>
                        <button className="btn-primary-falsicode" onClick={() => setShowCreateModal(true)}>
                            Add New Assignment
                        </button>
                    </div>

                    <div className="assignment-grid">
                        {assignments.map((assignment, idx) => {
                            const subCount = assignment.submission_count || 0;
                            const hasSubmissions = subCount > 0;
                            const languageLabel = formatLanguageDisplay(assignment.language);

                            return (
                                <div 
                                    key={assignment.id} 
                                    className="assignment-item-row clickable-row"
                                    onClick={() => setEditingAssignment(assignment)}
                                >
                                    <div className="assignment-meta-top">
                                        <span className="task-id">
                                            TASK {String(idx + 1).padStart(2, '0')} • {languageLabel}
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

            <EditAssignmentModal
                isOpen={!!editingAssignment}
                assignment={editingAssignment}
                onClose={() => setEditingAssignment(null)}
                onAssignmentUpdated={handleAssignmentUpdated}
                onAssignmentDeleted={handleAssignmentDeleted} 
                classroomId={id} 
            />
        </InstructorWrapper>
    );
};

export default InstructorClassroomView;