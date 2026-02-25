import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                const classRes = await axios.get(`http://localhost:5000/api/classrooms/${id}`, { headers });
                setClassroom(classRes.data);
                const assignRes = await axios.get(`http://localhost:5000/api/classrooms/${id}/assignments`, { headers });
                setAssignments(assignRes.data);
            } catch (error) {
                alert("Failed to load classroom details.");
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
        if (!fileToUpload) return alert("Please select a .py file first!");
        const formData = new FormData();
        formData.append('file', fileToUpload);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `http://localhost:5000/api/classrooms/${id}/assignments/${assignmentId}/submit`, 
                formData,
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
            );
            alert(res.data.message);
            setSelectedFiles(prev => ({ ...prev, [assignmentId]: null }));
        } catch (error) {
            alert(error.response?.data?.error || "Error uploading file.");
        }
    };

    if (loading) return <div className="student-loading-screen"><div className="cyber-spinner"></div></div>;
    if (!classroom) return null;

    return (
        <div className="student-workspace-wrapper">
            <div className="workspace-container">
                <header className="workspace-banner">
                    <button onClick={() => navigate('/student')} className="btn-back-glow">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Dashboard
                    </button>
                    <div className="banner-details">
                        <div className="banner-title-group">
                            <h1>{classroom.name}</h1>
                            <p className="instructor-tag">Instructor: <strong>{classroom.instructor}</strong></p>
                        </div>
                        <div className="status-pill-glass">
                            <span>Enrollment Status</span>
                            <strong className="status-enrolled">ENROLLED</strong>
                        </div>
                    </div>
                </header>

                <div className="assignment-section">
                    <h2 className="section-label">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Class Assignments
                    </h2>
                    
                    {assignments.length === 0 ? (
                        <div className="empty-assignment-box">
                            <p>No assignments posted yet.</p>
                        </div>
                    ) : (
                        <div className="assignment-stack">
                            {assignments.map(assignment => (
                                <div key={assignment.id} className="cyber-assignment-card">
                                    <div className="assignment-content">
                                        <h3>{assignment.title}</h3>
                                        <p>{assignment.description || "No specific instructions provided."}</p>
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
                                                Choose .py File
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
                                                    Submit to LogicGuard
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