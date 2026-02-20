import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css'; // 1. Import the new CSS file!

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    
    // SAFELY get raw data first
    const rawUser = localStorage.getItem('user');

    // ONLY parse if data exists and isn't the literal string "undefined"
    const user = (rawUser && rawUser !== "undefined") ? JSON.parse(rawUser) : null;

    const handleLogout = () => {
        // Clear session data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    // If no valid user is found, don't show the Navbar
    if (!user) return null;

    // Hide this global navbar if we are on an Admin page
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <nav className="navbar-container">
            <div className="navbar-logo">THE SYSTEM | {user.role?.toUpperCase()}</div>
            <div className="navbar-links">
                <span className="user-greet">Welcome, {user.username}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;