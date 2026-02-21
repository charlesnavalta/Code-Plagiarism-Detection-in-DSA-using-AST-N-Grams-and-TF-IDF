import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../instructor/InstructorClassroomView.css'; 

const StudentClassroomView = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [classroom, setClassroom] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // NEW: Tracks the selected file for each specific assignment
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
                alert("Failed to load classroom details. You might not be enrolled.");
                navigate('/student'); 
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    // NEW: Handle selecting a file from the computer
    const handleFileChange = (assignmentId, event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFiles(prev => ({
                ...prev,
                [assignmentId]: file
            }));
        }
    };

    // NEW: Handle sending the file to the Flask backend
    const handleFileUpload = async (assignmentId) => {
        const fileToUpload = selectedFiles[assignmentId];
        
        if (!fileToUpload) {
            return alert("Please select a .py file first!");
        }

        // We MUST use FormData to send files over HTTP!
        const formData = new FormData();
        formData.append('file', fileToUpload);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `http://localhost:5000/api/classrooms/${id}/assignments/${assignmentId}/submit`, 
                formData,
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data' // Required for file uploads
                    } 
                }
            );

            alert(res.data.message); // Success!
            
            // Clear the selected file from the UI after successful upload
            setSelectedFiles(prev => ({ ...prev, [assignmentId]: null }));

        } catch (error) {
            // Display the specific error from our AST Syntax Checker
            if (error.response && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                alert("An error occurred while uploading the file.");
                console.error(error);
            }
        }
    };

    if (loading) return <div className="loading-state">Loading classroom...</div>;
    if (!classroom) return null;

    return (
        <div className="classroom-view-container">
            <header className="classroom-header">
                <div>
                    <button onClick={() => navigate('/student')} className="btn-back">
                        &larr; Back to Enrolled Classes
                    </button>
                    <h1>{classroom.name}</h1>
                    <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>Instructor: {classroom.instructor}</p>
                </div>
            </header>

            <div className="workspace-section">
                <div className="workspace-header">
                    <h2>Class Assignments</h2>
                </div>
                
                {assignments.length === 0 ? (
                    <div className="empty-workspace">
                        <p>No assignments posted yet.</p>
                        <small>Check back later when your instructor uploads a task!</small>
                    </div>
                ) : (
                    <div className="assignments-list">
                        {assignments.map(assignment => (
                            <div key={assignment.id} className="assignment-card">
                                <div className="assignment-info">
                                    <h3>{assignment.title}</h3>
                                    <p>{assignment.description || "No description provided."}</p>
                                </div>
                                
                                {/* REPLACED: This is the real, working upload section */}
                                <div className="assignment-upload-section">
                                    {/* Hidden file input that does the actual work */}
                                    <input 
                                        type="file" 
                                        accept=".py" 
                                        id={`file-${assignment.id}`} 
                                        style={{ display: 'none' }} 
                                        onChange={(e) => handleFileChange(assignment.id, e)}
                                    />
                                    
                                    {/* Custom label that triggers the hidden input */}
                                    <label htmlFor={`file-${assignment.id}`} className="btn-select-file">
                                        Choose .py File
                                    </label>
                                    
                                    {/* Show the selected filename and the Submit button only if a file is chosen */}
                                    {selectedFiles[assignment.id] && (
                                        <div className="selected-file-container">
                                            <span className="file-name-display">
                                                {selectedFiles[assignment.id].name}
                                            </span>
                                            <button 
                                                className="btn-save" 
                                                style={{ backgroundColor: '#3498db' }}
                                                onClick={() => handleFileUpload(assignment.id)}
                                            >
                                                Upload File
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
    );
};

export default StudentClassroomView;