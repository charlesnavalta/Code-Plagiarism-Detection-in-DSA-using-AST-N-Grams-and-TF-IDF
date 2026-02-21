import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch the classes the student is currently enrolled in
    const fetchEnrolledClasses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/classrooms/enrolled', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEnrolledClasses(res.data);
        } catch (error) {
            console.error("Error fetching enrolled classes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrolledClasses();
    }, []);

    // Handle joining a new class with the 6-character code
    const handleJoinClass = async (e) => {
        e.preventDefault();
        if (!inviteCode.trim() || inviteCode.length !== 6) {
            return alert("Please enter a valid 6-character invite code.");
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/classrooms/join', 
                { invite_code: inviteCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            alert(res.data.message); // "Successfully joined CS101!"
            setInviteCode('');       // Clear the input
            fetchEnrolledClasses();  // Refresh the grid
        } catch (error) {
            // Display the specific error message from your Flask backend
            if (error.response && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                alert("Failed to join classroom. Please check the code and try again.");
            }
        }
    };

    return (
        <div className="student-container">
            <div className="dashboard-header">
                <h1>Student Dashboard</h1>
                <p>Join classes and submit your Python assignments for analysis.</p>
            </div>

            {/* Join Class Section */}
            <div className="join-class-section">
                <h3>Join a Classroom</h3>
                <form onSubmit={handleJoinClass} className="join-class-form">
                    <input 
                        type="text" 
                        placeholder="Enter 6-character class code (e.g. CS9A2X)" 
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        className="class-input code-input"
                        maxLength={6}
                    />
                    <button type="submit" className="btn-join">Join Class</button>
                </form>
            </div>

            {/* Enrolled Classes Grid Section */}
            <div className="classrooms-section">
                <h3>My Enrolled Classes</h3>
                
                {loading ? (
                    <p>Loading your classes...</p>
                ) : enrolledClasses.length === 0 ? (
                    <div className="empty-state">
                        <p>You aren't enrolled in any classes yet. Ask your instructor for an invite code!</p>
                    </div>
                ) : (
                    <div className="class-grid">
                        {enrolledClasses.map((cls) => (
                            <div key={cls.id} className="class-card student-card">
                                <div className="class-card-header">
                                    <h4>{cls.name}</h4>
                                </div>
                                <div className="class-card-body">
                                    <p className="instructor-label">Instructor:</p>
                                    <p className="instructor-name">{cls.instructor}</p>
                                    
                                    <button 
                                        className="btn-enter-class"
                                        onClick={() => navigate(`/student/class/${cls.id}`)}
                                    >
                                        View Assignments &rarr;
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

export default StudentDashboard;