import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api'; 
import './StudentClassroomView.css'; 

const StudentClassroomView = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [classroom, setClassroom] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState({});
    
    // --- Dynamic Theme & Spatial Sync ---
    const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'dark');
    const workspaceRef = useRef(null);

    useEffect(() => {
        const handleSync = () => setTheme(localStorage.getItem('app-theme') || 'dark');
        window.addEventListener('storage', handleSync);
        return () => window.removeEventListener('storage', handleSync);
    }, []);

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
        if (!workspaceRef.current) return;
        const cards = workspaceRef.current.querySelectorAll('.spatial-card');
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }
    };

    const handleFileChange = (assignmentId, event) => {
        const file = event.target.files[0];
        if (file) setSelectedFiles(prev => ({ ...prev, [assignmentId]: file }));
    };

    const handleFileUpload = async (assignmentId) => {
        const fileToUpload = selectedFiles[assignmentId];
        // Dynamic error message based on file type
        if (!fileToUpload) return alert("Please select a file to deploy.");
        
        const formData = new FormData();
        formData.append('file', fileToUpload);
        try {
            await api.post(`/classrooms/${id}/assignments/${assignmentId}/submit`, formData);
            alert("Node Deployment Successful.");
            setSelectedFiles(prev => ({ ...prev, [assignmentId]: null }));
            
            setAssignments(prev => prev.map(a => 
                a.id === assignmentId ? { ...a, has_submitted: true, score: 'Pending' } : a
            ));
        } catch (error) { 
            alert(error.response?.data?.error || "Upload failed."); 
        }
    };

    if (loading) return <div className={`nexus-loader ${theme}`}><div className="quantum-spinner"></div></div>;
    if (!classroom) return null;

    return (
        <div className={`nexus-wrapper ${theme}`} ref={workspaceRef} onMouseMove={handleMouseMove}>
            <div className="aurora-canvas">
                <div className="aurora-blob blob-primary"></div>
                <div className="aurora-blob blob-secondary"></div>
            </div>

            <div className="nexus-content">
                <header className="spatial-card nexus-action-header fade-in">
                    <div className="header-box-content">
                        <div className="header-top-row">
                            <button onClick={() => navigate('/student')} className="back-pill-nexus">
                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                                Return to Hub
                            </button>
                        </div>
                        
                        <div className="identity-block">
                            <h1 className="nexus-title-main">{classroom.name}</h1>
                            
                            <div className="instructor-row-nexus">
                                <span className="ins-label">Instructor</span>
                                <div className="ins-name-pill">
                                    <span className="ins-name-text">{classroom.instructor}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="assignment-nexus slide-up">
                    <div className="stream-header-nexus">
                        <h2>Assignment Queue</h2>
                        <div className="label-line-nexus"></div>
                    </div>
                    
                    <div className="assignment-stack">
                        {assignments.length === 0 ? (
                            <div className="spatial-card empty-card-nexus">
                                <p>No active protocols detected in this cluster.</p>
                            </div>
                        ) : (
                            assignments.map((assignment, index) => {
                                // --- UPDATED: Safety net allows both .java and .py if backend is missing the language field ---
                                const isJava = assignment.language?.toLowerCase() === 'java';
                                const fileExtension = isJava ? '.java' : '.py, .java';
                                
                                return (
                                <div key={assignment.id} className="spatial-card assignment-row-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="card-glass-layer"></div>
                                    <div className="row-grid-content">
                                        <div className="row-info-nexus">
                                            <span className="row-op-tag">
                                                OP_TASK_0{index + 1} 
                                                <span style={{color: isJava ? '#fb923c' : '#60a5fa', marginLeft: '10px'}}>
                                                    [{isJava ? 'JAVA' : 'PYTHON'}]
                                                </span>
                                            </span>
                                            <h3>{assignment.title}</h3>
                                            <p>{assignment.description || "Parameters standard."}</p>
                                        </div>
                                        
                                        <div className="row-actions-nexus">
                                            {assignment.has_submitted ? (
                                                <div className="submitted-status-group">
                                                    <span className="status-pill success">✓ Turned In</span>
                                                    <div className="score-display">
                                                        <span className="score-label">FALSICODE SCORE</span>
                                                        <span className={`score-value ${assignment.score === 'Pending' ? 'pending' : ''}`}>
                                                            {assignment.score}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <input 
                                                        type="file" 
                                                        accept={fileExtension} 
                                                        id={`f-${assignment.id}`} 
                                                        style={{display: 'none'}} 
                                                        onChange={(e) => handleFileChange(assignment.id, e)} 
                                                    />
                                                    
                                                    {!selectedFiles[assignment.id] ? (
                                                        <label htmlFor={`f-${assignment.id}`} className="nexus-select-btn">
                                                            Initialize {isJava ? 'Java' : 'Source'} File
                                                        </label>
                                                    ) : (
                                                        <div className="nexus-deploy-group">
                                                            <div className="nexus-file-pill"><code>{selectedFiles[assignment.id].name}</code></div>
                                                            <button className="nexus-deploy-btn" onClick={() => handleFileUpload(assignment.id)}>Deploy Node</button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )})
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StudentClassroomView;