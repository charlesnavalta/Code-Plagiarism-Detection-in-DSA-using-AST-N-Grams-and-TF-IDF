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

    // NEW: Analysis Results State
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
            setAnalysisResults(null); // Reset results when opening a new assignment
            setShowSubmissionsModal(true);
        } catch (error) {
            alert("Failed to load submissions.");
        }
    };

    // NEW: Trigger LogicGuard Plagiarism Engine
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

    if (loading) return <div className="loading-state">Loading classroom...</div>;
    if (!classroom) return null;

    return (
        <div className="classroom-view-container">
            <header className="classroom-header">
                <div>
                    <button onClick={() => navigate('/instructor')} className="btn-back">&larr; Back</button>
                    <h1>{classroom.name}</h1>
                </div>
                <div className="invite-badge">
                    <span>Class Code:</span>
                    <strong>{classroom.invite_code}</strong>
                </div>
            </header>

            <div className="workspace-section">
                <div className="workspace-header">
                    <h2>Assignments</h2>
                    <button className="btn-create-assignment" onClick={() => setShowCreateModal(true)}>+ Create Assignment</button>
                </div>
                
                <div className="assignments-list">
                    {assignments.map(assignment => (
                        <div key={assignment.id} className="assignment-card">
                            <div className="assignment-info">
                                <h3>{assignment.title}</h3>
                                <p>{assignment.description || "No description provided."}</p>
                            </div>
                            <div className="assignment-actions">
                                <button className="btn-view-submissions" onClick={() => handleViewSubmissions(assignment)}>
                                    View Submissions
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CREATE MODAL */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create New Assignment</h2>
                        <form onSubmit={handleCreateAssignment}>
                            <div className="form-group">
                                <label>Title</label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Instructions</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                <button type="submit" className="btn-save">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* SUBMISSIONS & ANALYSIS MODAL */}
            {showSubmissionsModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2>Submissions: {selectedAssignment?.title}</h2>
                        
                        <div className="submissions-list-container">
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>File Name</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentSubmissions.map(sub => (
                                        <tr key={sub.id}>
                                            <td><strong>{sub.student_name}</strong></td>
                                            <td className="code-font">{sub.filename}</td>
                                            <td>{sub.submitted_at}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* NEW: DISPLAY PLAGIARISM RESULTS */}
                        {analysisResults && (
                            <div className="analysis-results-section" style={{ marginTop: '30px' }}>
                                <h3 style={{ borderTop: '2px solid #ecf0f1', paddingTop: '20px' }}>LogicGuard Analysis Results</h3>
                                <table className="user-table" style={{ borderLeft: '5px solid #e74c3c' }}>
                                    <thead style={{ backgroundColor: '#fdf2f2' }}>
                                        <tr>
                                            <th>Comparison Pair</th>
                                            <th>Similarity Score</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analysisResults.map((res, index) => (
                                            <tr key={index}>
                                                <td>{res.file1} ↔ {res.file2}</td>
                                                <td style={{ fontWeight: 'bold' }}>{res.score}%</td>
                                                <td>
                                                    <span className={`status-badge status-${res.status.toLowerCase()}`}>
                                                        {res.status}
                                                    
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="modal-actions" style={{ marginTop: '30px' }}>
                            <button 
                                className="btn-save" 
                                style={{ backgroundColor: '#2c3e50' }}
                                onClick={handleRunAnalysis}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? "Processing AST..." : "Run Plagiarism Check"}
                            </button>
                            <button className="btn-cancel" onClick={() => setShowSubmissionsModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstructorClassroomView;