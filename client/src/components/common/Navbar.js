import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    const rawUser = localStorage.getItem('user');
    const user = (rawUser && rawUser !== "undefined") ? JSON.parse(rawUser) : null;

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!user) return null;
    if (location.pathname.startsWith('/admin') || user.role === 'admin') return null;

    // Helper to check active link
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className={`navbar-container ${user.role === 'instructor' ? 'instructor-theme' : 'student-theme'}`}>
            <div className="navbar-left">
                <div className="brand-logo">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                    </svg>
                </div>
                <span className="brand-text">Falsicode</span>
                <span className="brand-divider">|</span>
                <span className="brand-panel">
                    {user.role === 'instructor' ? 'Instructor Panel' : 'Student Portal'}
                </span>

                {/* Navbar Links - Middle Section */}
                <div className="navbar-center-links">
                    {user.role === 'student' && (
                        <>
                            <Link to="/student" className={`nav-link-item ${isActive('/student')}`}>My Classes</Link>
                            <Link to="/student/submissions" className={`nav-link-item ${isActive('/student/submissions')}`}>Submissions</Link>
                        </>
                    )}
                </div>
            </div>

            <div className="navbar-right">
                {/* Simplified Notification for both */}
                <div className="nav-notification" style={{color: '#94a3b8', cursor: 'pointer'}}>
                    🔔
                </div>
                
                <span className="brand-divider">|</span>

                <div className="profile-menu">
                    <button 
                        className="profile-toggle" 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <div className="user-avatar-small">
                            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                        </div>
                        {user.username} 
                        <span style={{fontSize: '0.6rem', opacity: 0.6}}>▼</span>
                    </button>
                    
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <Link 
                                to={user.role === 'instructor' ? "/instructor" : "/student"} 
                                onClick={() => setDropdownOpen(false)}
                            >
                                Dashboard Home
                            </Link>
                            <Link 
                                to={user.role === 'instructor' ? "/instructor/profile" : "/student/profile"} 
                                onClick={() => setDropdownOpen(false)}
                            >
                                Settings
                            </Link>
                            <button onClick={handleLogout} className="dropdown-logout">
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;