import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import axios from 'axios';
import './InstructorDashboard.css'; 

const InstructorDashboard = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [newClassName, setNewClassName] = useState('');
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate(); // 2. Initialize the navigate function

    // Fetch the instructor's classes when the dashboard loads
    const fetchClassrooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/classrooms/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClassrooms(res.data);
        } catch (error) {
            console.error("Error fetching classrooms:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassrooms();
    }, []);

    // Handle creating a new class
    const handleCreateClass = async (e) => {
        e.preventDefault();
        if (!newClassName.trim()) return alert("Please enter a class name.");

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/classrooms/', 
                { name: newClassName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setNewClassName(''); // Clear the input field
            fetchClassrooms();   // Refresh the grid to show the new class
        } catch (error) {
            alert("Failed to create classroom. Ensure the backend is running.");
            console.error(error);
        }
    };

    return (
        <div className="instructor-container">
            <div className="dashboard-header">
                <h1>Instructor Dashboard</h1>
                <p>Manage your classes, assignments, and run Salingan plagiarism checks.</p>
            </div>

            {/* Create Class Section */}
            <div className="create-class-section">
                <h3>Create a New Class</h3>
                <form onSubmit={handleCreateClass} className="create-class-form">
                    <input 
                        type="text" 
                        placeholder="e.g., CS101 - Data Structures" 
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        className="class-input"
                    />
                    <button type="submit" className="btn-create">Create Class</button>
                </form>
            </div>

            {/* Classrooms Grid Section */}
            <div className="classrooms-section">
                <h3>My Active Classes</h3>
                
                {loading ? (
                    <p>Loading your classes...</p>
                ) : classrooms.length === 0 ? (
                    <div className="empty-state">
                        <p>You haven't created any classes yet. Create one above to generate an invite code!</p>
                    </div>
                ) : (
                    <div className="class-grid">
                        {classrooms.map((cls) => (
                            <div key={cls.id} className="class-card">
                                <div className="class-card-header">
                                    <h4>{cls.name}</h4>
                                </div>
                                <div className="class-card-body">
                                    <p className="invite-label">Student Invite Code:</p>
                                    <div className="invite-code-box">
                                        {cls.invite_code}
                                    </div>
                                    {/* 3. Add the onClick event to the button */}
                                    <button 
                                        className="btn-enter-class"
                                        onClick={() => navigate(`/instructor/class/${cls.id}`)}
                                    >
                                        Enter Classroom &rarr;
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorDashboard;