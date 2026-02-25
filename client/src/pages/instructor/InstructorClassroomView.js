import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './InstructorClassroomView.css';

const InstructorClassroomView = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    // Core State
    const [classroom, setClassroom] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
    
    // Form & Data States
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [currentSubmissions, setCurrentSubmissions] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    // Analysis Results State
    const [analysisResults, setAnalysisResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const classRes = await axios.get(`http://localhost:5000/api/classrooms/${id}`, { headers });
            setClassroom(classRes.data);
            const assignRes = await axios.get(`http://localhost:5000/api/classrooms/${id}/assignments`, { headers });
            setAssignments(assignRes.data);
        } catch (error) {
            alert("Failed to load classroom details.");
            navigate('/instructor'); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, navigate]);

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/classrooms/${id}/assignments`, 
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowCreateModal(false);
            setTitle('');
            setDescription('');
            fetchData(); 
        } catch (error) {
            alert("Failed to create assignment.");
        }
    };

    const handleViewSubmissions = async (assignment) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `http://localhost:5000/api/classrooms/${id}/assignments/${assignment.id}/submissions`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCurrentSubmissions(res.data);
            setSelectedAssignment(assignment);
            setAnalysisResults(null); 
            setShowSubmissionsModal(true);
        } catch (error) {
            alert("Failed to load submissions.");
        }
    };

    const handleRunAnalysis = async () => {
        if (currentSubmissions.length < 2) {
            return alert("You need at least two submissions to perform a comparison.");
        }

        setIsAnalyzing(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `http://localhost:5000/api/analyze/${selectedAssignment.id}`,
                {}, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAnalysisResults(res.data.results);
        } catch (error) {
            alert(error.response?.data?.error || "Error running plagiarism check.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (loading) return <div className="classroom-loading"><div className="loader-spinner"></div> Loading workspace...</div>;
    if (!classroom) return null;

    return (
        <div className="classroom-view-wrapper">
            <div className="classroom-view-container">
                
                {/* UPGRADED: Banner Header */}
                <header className="classroom-banner">
                    <button onClick={() => navigate('/instructor')} className="btn-back-light">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to Dashboard
                    </button>
                    <div className="banner-content">
                        <div className="banner-text">
                            <h1>{classroom.name}</h1>
                            <p>Manage assignments and analyze submissions</p>
                        </div>
                        <div className="invite-badge-glass">
                            <span>Class Invite Code</span>
                            <strong>{classroom.invite_code}</strong>
                        </div>
                    </div>
                </header>

                <div className="workspace-section">
                    <div className="workspace-header">
                        <h2>Class Assignments</h2>
                        <button className="btn-create-assignment" onClick={() => setShowCreateModal(true)}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Create Assignment
                        </button>
                    </div>
                    
                    {assignments.length === 0 ? (
                        <div className="empty-workspace-dark">
                            <div className="empty-icon-ring">
                                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <h3>No Assignments Yet</h3>
                            <p>Create your first assignment to start accepting student submissions.</p>
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
                                            <p>{assignment.description || "No description provided."}</p>
                                        </div>
                                    </div>
                                    <button className="btn-view-submissions" onClick={() => handleViewSubmissions(assignment)}>
                                        View Submissions &rarr;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CREATE MODAL */}
                {showCreateModal && (
                    <div className="dark-modal-overlay">
                        <div className="dark-modal-content">
                            <div className="modal-header">
                                <h2>Create New Assignment</h2>
                                <button className="btn-close-icon" onClick={() => setShowCreateModal(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleCreateAssignment}>
                                <div className="dark-form-group">
                                    <label>Assignment Title</label>
                                    <input 
                                        type="text"
                                        className="dark-input-field"
                                        placeholder="e.g., Final Project Phase 1"
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="dark-form-group">
                                    <label>Instructions & Requirements</label>
                                    <textarea 
                                        className="dark-input-field"
                                        placeholder="Provide assignment details..."
                                        value={description} 
                                        onChange={(e) => setDescription(e.target.value)} 
                                        rows="5" 
                                    />
                                </div>
                                <div className="dark-modal-actions">
                                    <button type="button" className="btn-cancel-dark" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-save-dark">Publish Assignment</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* SUBMISSIONS & ANALYSIS MODAL */}
                {showSubmissionsModal && (
                    <div className="dark-modal-overlay">
                        <div className="dark-modal-content wide-modal">
                            <div className="modal-header">
                                <div>
                                    <h2>{selectedAssignment?.title}</h2>
                                    <p className="modal-subtitle">Manage submissions and run integrity checks</p>
                                </div>
                                <button className="btn-close-icon" onClick={() => setShowSubmissionsModal(false)}>&times;</button>
                            </div>
                            
                            <div className="submissions-list-container">
                                {currentSubmissions.length === 0 ? (
                                    <div className="empty-table-state">
                                        <p>No students have submitted work for this assignment yet.</p>
                                    </div>
                                ) : (
                                    <table className="dark-data-table">
                                        <thead>
                                            <tr>
                                                <th>Student Name</th>
                                                <th>File Name</th>
                                                <th>Date Submitted</th>
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
                                                    <td className="date-cell">{new Date(sub.submitted_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* DISPLAY PLAGIARISM RESULTS WITH VISUAL BARS */}
                            {analysisResults && (
                                <div className="analysis-results-section fade-in">
                                    <div className="analysis-header">
                                        <h3>CodeGuard Analysis Report</h3>
                                        <span className="analysis-badge">Scan Complete</span>
                                    </div>
                                    <div className="analysis-table-wrapper">
                                        <table className="dark-data-table results-table">
                                            <thead>
                                                <tr>
                                                    <th>Matched Files</th>
                                                    <th>Similarity Profile</th>
                                                    <th style={{width: '120px'}}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analysisResults.map((res, index) => {
                                                    // Determine color based on status
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
                                <button className="btn-cancel-dark" onClick={() => setShowSubmissionsModal(false)}>Close Window</button>
                                <button 
                                    className={`btn-run-analysis ${isAnalyzing ? 'pulsing' : ''}`} 
                                    onClick={handleRunAnalysis}
                                    disabled={isAnalyzing || currentSubmissions.length < 2}
                                >
                                    {isAnalyzing ? (
                                        <>Analyzing Codebase... <span className="loader-dots"></span></>
                                    ) : (
                                        <>
                                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                            Run LogicGuard Scan
                                        </>
                                    )}
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