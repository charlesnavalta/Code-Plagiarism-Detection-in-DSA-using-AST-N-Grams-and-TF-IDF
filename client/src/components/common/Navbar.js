import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    
    // SAFELY get raw data first
    const rawUser = localStorage.getItem('user');

    // ONLY parse if data exists and isn't the literal string "undefined"
    const user = (rawUser && rawUser !== "undefined") ? JSON.parse(rawUser) : null;

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!user) return null;

    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <nav className="navbar-container">
            <div className="navbar-logo">
                <Link to={`/${user.role}`} className="logo-link">
                    LOGICGUARD | {user.role?.toUpperCase()}
                </Link>
            </div>

            {/* THE NEW NAV BUTTONS */}
            <div className="navbar-nav-items">
                {user.role === 'instructor' && (
                    <>
                        <Link to="/instructor" className="nav-button">My Classes</Link>
                        <Link to="/instructor/reports" className="nav-button">Plagiarism Reports</Link>
                        <Link to="/instructor/profile" className="nav-button">Profile</Link>
                    </>
                )}
                
                {user.role === 'student' && (
                    <>
                        <Link to="/student" className="nav-button">My Classes</Link>
                        <Link to="/student/submissions" className="nav-button">My Submissions</Link>
                        <Link to="/student/profile" className="nav-button">Profile</Link>
                    </>
                )}
            </div>

            <div className="navbar-links">
                <span className="user-greet">Welcome, {user.username}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;