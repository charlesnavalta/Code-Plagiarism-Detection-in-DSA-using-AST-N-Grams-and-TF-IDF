import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Changed: Using centralized api service
import api from '../../services/api'; 
import './StudentClassroomView.css'; 

const StudentClassroomView = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [classroom, setClassroom] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch classroom meta and assignments using relative paths
                const [classRes, assignRes] = await Promise.all([
                    api.get(`/classrooms/${id}`),
                    api.get(`/classrooms/${id}/assignments`)
                ]);
                
                setClassroom(classRes.data);
                setAssignments(assignRes.data);
            } catch (error) {
                alert("Security Notice: Failed to synchronize classroom node.");
                navigate('/student'); 
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleFileChange = (assignmentId, event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFiles(prev => ({ ...prev, [assignmentId]: file }));
        }
    };

    const handleFileUpload = async (assignmentId) => {
        const fileToUpload = selectedFiles[assignmentId];
        if (!fileToUpload) return alert("System Notice: Please select a valid .py file.");
        
        const formData = new FormData();
        formData.append('file', fileToUpload);

        try {
            // Interceptor handles Authorization; browser handles multipart boundary
            const res = await api.post(
                `/classrooms/${id}/assignments/${assignmentId}/submit`, 
                formData
            );
            alert(res.data.message);
            setSelectedFiles(prev => ({ ...prev, [assignmentId]: null }));
        } catch (error) {
            alert(error.response?.data?.error || "Critical failure uploading file to node.");
        }
    };

    if (loading) return (
        <div className="student-loading-screen">
            <div className="cyber-spinner"></div>
            <p>Accessing Node Data...</p>
        </div>
    );

    if (!classroom) return null;

    return (
        <div className="student-workspace-wrapper">
            <div className="workspace-container">
                <header className="workspace-banner">
                    <button onClick={() => navigate('/student')} className="btn-back-glow">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Exit Workspace
                    </button>
                    <div className="banner-details">
                        <div className="banner-title-group">
                            <h1>{classroom.name}</h1>
                            <p className="instructor-tag">Lead Instructor: <strong>{classroom.instructor}</strong></p>
                        </div>
                        <div className="status-pill-glass">
                            <span>Status</span>
                            <strong className="status-enrolled">AUTHORIZED</strong>
                        </div>
                    </div>
                </header>

                <div className="assignment-section">
                    <h2 className="section-label">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Node Assignment Queue
                    </h2>
                    
                    {assignments.length === 0 ? (
                        <div className="empty-assignment-box">
                            <p>No assignment protocols detected in this cluster.</p>
                        </div>
                    ) : (
                        <div className="assignment-stack">
                            {assignments.map(assignment => (
                                <div key={assignment.id} className="cyber-assignment-card">
                                    <div className="assignment-content">
                                        <h3>{assignment.title}</h3>
                                        <p>{assignment.description || "No specific parameters provided."}</p>
                                    </div>
                                    
                                    <div className="assignment-actions">
                                        <input 
                                            type="file" 
                                            accept=".py" 
                                            id={`file-${assignment.id}`} 
                                            className="hidden-file-input" 
                                            onChange={(e) => handleFileChange(assignment.id, e)}
                                        />
                                        
                                        {!selectedFiles[assignment.id] ? (
                                            <label htmlFor={`file-${assignment.id}`} className="btn-select-cyber">
                                                Select .py Source
                                            </label>
                                        ) : (
                                            <div className="upload-prep-container">
                                                <div className="selected-file-pill">
                                                    <code>{selectedFiles[assignment.id].name}</code>
                                                </div>
                                                <button 
                                                    className="btn-glow-submit" 
                                                    onClick={() => handleFileUpload(assignment.id)}
                                                >
                                                    Deploy to LogicGuard
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentClassroomView;