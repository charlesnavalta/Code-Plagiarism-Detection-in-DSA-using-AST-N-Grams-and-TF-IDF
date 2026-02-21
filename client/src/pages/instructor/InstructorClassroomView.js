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

    // Modal Form State
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Fetch both classroom details AND assignments
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, navigate]);

    // Submit new assignment to the database
    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        if (!title.trim()) return alert("Assignment title is required!");

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/classrooms/${id}/assignments`, 
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Close modal, clear form, and refresh the list
            setShowModal(false);
            setTitle('');
            setDescription('');
            fetchData(); 
        } catch (error) {
            alert("Failed to create assignment.");
            console.error(error);
        }
    };

    if (loading) return <div className="loading-state">Loading classroom...</div>;
    if (!classroom) return null;

    return (
        <div className="classroom-view-container">
            <header className="classroom-header">
                <div>
                    <button onClick={() => navigate('/instructor')} className="btn-back">
                        &larr; Back to Dashboard
                    </button>
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
                    <button 
                        className="btn-create-assignment"
                        onClick={() => setShowModal(true)}
                    >
                        + Create Assignment
                    </button>
                </div>
                
                {/* Dynamically show assignments or the empty state */}
                {assignments.length === 0 ? (
                    <div className="empty-workspace">
                        <p>No assignments created yet.</p>
                        <small>Click "Create Assignment" to ask students for their .py files.</small>
                    </div>
                ) : (
                    <div className="assignments-list">
                        {assignments.map(assignment => (
                            <div key={assignment.id} className="assignment-card">
                                <div className="assignment-info">
                                    <h3>{assignment.title}</h3>
                                    <p>{assignment.description || "No description provided."}</p>
                                </div>
                                <div className="assignment-actions">
                                    <button className="btn-view-submissions">
                                        View Submissions
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL POPUP (Only visible when showModal is true) */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create New Assignment</h2>
                        <form onSubmit={handleCreateAssignment}>
                            <div className="form-group">
                                <label>Assignment Title</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Final Lab Exam - Plagiarism Detector"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Instructions (Optional)</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Provide guidelines for the code submission..."
                                    rows="4"
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstructorClassroomView;