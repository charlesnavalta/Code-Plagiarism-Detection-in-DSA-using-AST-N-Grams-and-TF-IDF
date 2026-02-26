import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Changed: Using centralized api service
import api from '../../services/api'; 
import './InstructorClassroomView.css';

const InstructorClassroomView = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    // Core State Cluster
    const [classroom, setClassroom] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal Visibility
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
    
    // Data Sync States
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [currentSubmissions, setCurrentSubmissions] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    // LogicGuard Analysis State
    const [analysisResults, setAnalysisResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // --- READ: Sync Node Data ---
    const fetchData = async () => {
        try {
            // Simultaneous fetch for classroom meta and assignments
            const [classRes, assignRes] = await Promise.all([
                api.get(`/classrooms/${id}`),
                api.get(`/classrooms/${id}/assignments`)
            ]);
            
            setClassroom(classRes.data);
            setAssignments(assignRes.data);
        } catch (error) {
            alert("Security Notice: Failed to sync classroom parameters.");
            navigate('/instructor'); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    // --- CREATE: Deploy New Assignment ---
    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/classrooms/${id}/assignments`, { title, description });
            setShowCreateModal(false);
            setTitle('');
            setDescription('');
            fetchData(); 
        } catch (error) {
            alert("Protocol failure: Unable to deploy assignment.");
        }
    };

    // --- READ: Retrieve Student Submissions ---
    const handleViewSubmissions = async (assignment) => {
        try {
            const res = await api.get(`/classrooms/${id}/assignments/${assignment.id}/submissions`);
            setCurrentSubmissions(res.data);
            setSelectedAssignment(assignment);
            setAnalysisResults(null); 
            setShowSubmissionsModal(true);
        } catch (error) {
            alert("Security Notice: Access to submissions denied.");
        }
    };

    // --- EXECUTE: Run LogicGuard Plagiarism Scan ---
    const handleRunAnalysis = async () => {
        if (currentSubmissions.length < 2) {
            return alert("Logic Error: Minimum of two submissions required for cross-comparison.");
        }

        setIsAnalyzing(true);
        try {
            const res = await api.post(`/analyze/${selectedAssignment.id}`, {});
            setAnalysisResults(res.data.results);
        } catch (error) {
            alert(error.response?.data?.error || "Critical failure during LogicGuard analysis.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (loading) return (
        <div className="classroom-loading">
            <div className="loader-spinner"></div> 
            Synchronizing Workspace...
        </div>
    );
    
    if (!classroom) return null;

    return (
        <div className="classroom-view-wrapper">
            <div className="classroom-view-container">
                
                {/* --- Node Control Banner --- */}
                <header className="classroom-banner">
                    <button onClick={() => navigate('/instructor')} className="btn-back-light">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Return to Dashboard
                    </button>
                    <div className="banner-content">
                        <div className="banner-text">
                            <h1>{classroom.name}</h1>
                            <p>Provision assignments and monitor code integrity</p>
                        </div>
                        <div className="invite-badge-glass">
                            <span>Node Invite Code</span>
                            <strong>{classroom.invite_code}</strong>
                        </div>
                    </div>
                </header>

                <div className="workspace-section">
                    <div className="workspace-header">
                        <h2>Deployed Assignments</h2>
                        <button className="btn-create-assignment" onClick={() => setShowCreateModal(true)}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            New Assignment
                        </button>
                    </div>
                    
                    {assignments.length === 0 ? (
                        <div className="empty-workspace-dark">
                            <div className="empty-icon-ring">
                                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <h3>Cluster is Empty</h3>
                            <p>No assignments found. Initialize a deployment to start receiving submissions.</p>
                        </div>
                    ) : (
                        <div className="assignments-grid">
                            {assignments.map(assignment => (
                                <div key={assignment.id} className="assignment-card-rich">
                                    <div className="assignment-card-left">
                                        <div className="assignment-icon">
                                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                        </div>
                                        <div className="assignment-info">
                                            <h3>{assignment.title}</h3>
                                            <p>{assignment.description || "No manual instructions provided."}</p>
                                        </div>
                                    </div>
                                    <button className="btn-view-submissions" onClick={() => handleViewSubmissions(assignment)}>
                                        Submissions & Analysis &rarr;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- Deployment Modal --- */}
                {showCreateModal && (
                    <div className="dark-modal-overlay">
                        <div className="dark-modal-content">
                            <div className="modal-header">
                                <h2>Deploy New Assignment</h2>
                                <button className="btn-close-icon" onClick={() => setShowCreateModal(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleCreateAssignment}>
                                <div className="dark-form-group">
                                    <label>Title</label>
                                    <input 
                                        type="text"
                                        className="dark-input-field"
                                        placeholder="Assignment ID"
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="dark-form-group">
                                    <label>Requirements</label>
                                    <textarea 
                                        className="dark-input-field"
                                        placeholder="Assignment parameters and constraints..."
                                        value={description} 
                                        onChange={(e) => setDescription(e.target.value)} 
                                        rows="5" 
                                    />
                                </div>
                                <div className="dark-modal-actions">
                                    <button type="button" className="btn-cancel-dark" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-save-dark">Confirm Deployment</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- Integrity Analysis Modal --- */}
                {showSubmissionsModal && (
                    <div className="dark-modal-overlay">
                        <div className="dark-modal-content wide-modal">
                            <div className="modal-header">
                                <div>
                                    <h2>{selectedAssignment?.title}</h2>
                                    <p className="modal-subtitle">Reviewing student logic submissions</p>
                                </div>
                                <button className="btn-close-icon" onClick={() => setShowSubmissionsModal(false)}>&times;</button>
                            </div>
                            
                            <div className="submissions-list-container">
                                {currentSubmissions.length === 0 ? (
                                    <div className="empty-table-state">
                                        <p>Protocol: No incoming submissions detected for this assignment.</p>
                                    </div>
                                ) : (
                                    <table className="dark-data-table">
                                        <thead>
                                            <tr>
                                                <th>Student Identity</th>
                                                <th>Source File</th>
                                                <th>Timestamp</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentSubmissions.map(sub => (
                                                <tr key={sub.id}>
                                                    <td>
                                                        <div className="student-cell">
                                                            <div className="student-avatar">{sub.student_name.charAt(0).toUpperCase()}</div>
                                                            <strong>{sub.student_name}</strong>
                                                        </div>
                                                    </td>
                                                    <td className="code-font">{sub.filename}</td>
                                                    <td className="date-cell">{new Date(sub.submitted_at).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* LogicGuard Analysis Report */}
                            {analysisResults && (
                                <div className="analysis-results-section fade-in">
                                    <div className="analysis-header">
                                        <h3>LogicGuard Analysis Report</h3>
                                        <span className="analysis-badge">Scan Complete</span>
                                    </div>
                                    <div className="analysis-table-wrapper">
                                        <table className="dark-data-table results-table">
                                            <thead>
                                                <tr>
                                                    <th>Matched Pair</th>
                                                    <th>Similarity Profile</th>
                                                    <th style={{width: '120px'}}>Threat Level</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analysisResults.map((res, index) => {
                                                    const isHigh = res.status.toLowerCase() === 'high';
                                                    const isMed = res.status.toLowerCase() === 'medium';
                                                    const barColor = isHigh ? '#ef4444' : (isMed ? '#f59e0b' : '#10b981');
                                                    
                                                    return (
                                                        <tr key={index}>
                                                            <td className="comparison-cell">
                                                                <span className="file-tag">{res.file1}</span>
                                                                <svg className="arrow-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                                                                <span className="file-tag">{res.file2}</span>
                                                            </td>
                                                            <td>
                                                                <div className="score-container">
                                                                    <span className="score-text" style={{color: barColor}}>{res.score}%</span>
                                                                    <div className="score-bar-bg">
                                                                        <div className="score-bar-fill" style={{ width: `${res.score}%`, backgroundColor: barColor }}></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className={`status-badge status-${res.status.toLowerCase()}`}>
                                                                    {res.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            <div className="dark-modal-actions split-actions">
                                <button className="btn-cancel-dark" onClick={() => setShowSubmissionsModal(false)}>Terminate Window</button>
                                <button 
                                    className={`btn-run-analysis ${isAnalyzing ? 'pulsing' : ''}`} 
                                    onClick={handleRunAnalysis}
                                    disabled={isAnalyzing || currentSubmissions.length < 2}
                                >
                                    {isAnalyzing ? "Executing LogicGuard Analysis..." : "Run LogicGuard Analysis"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorClassroomView;