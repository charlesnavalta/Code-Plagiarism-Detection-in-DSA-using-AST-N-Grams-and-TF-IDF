import React, { useState, useEffect } from 'react'; // Added useEffect to imports
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    const rawUser = localStorage.getItem('user');
    const user = (rawUser && rawUser !== "undefined") ? JSON.parse(rawUser) : null;

    // ==========================================
    // UI IMPROVEMENT: Auto-Close Dropdown
    // ==========================================
    // This effect listens for any click on the window. 
    // If you click outside the '.profile-menu', it automatically closes the dropdown.
    useEffect(() => {
        const closeDropdown = (e) => {
            if (!e.target.closest('.profile-menu')) {
                setDropdownOpen(false);
            }
        };
        window.addEventListener('click', closeDropdown);
        
        // Cleanup listener when component unmounts to prevent memory leaks
        return () => window.removeEventListener('click', closeDropdown);
    }, []);

    // ==========================================
    // AUTH LOGIC: Hard Reset Logout
    // ==========================================
    const handleLogout = () => {
        setDropdownOpen(false); // Explicitly close dropdown
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // This forces a full browser reload at the login screen.
        // It ensures no role-leakage, memory state, or "Mori" account data 
        // remains when switching to a different account.
        window.location.href = '/login'; 
    };

    // If no user is found, the navbar will not render (e.g., on Login/Register pages)
    if (!user) return null;

    // Helper to check active link for CSS highlighting
    const isActive = (path) => location.pathname === path ? 'active' : '';

    // Determine the theme class based on the logged-in user role
    const getThemeClass = () => {
        if (user.role === 'admin') return 'admin-theme';
        return user.role === 'instructor' ? 'instructor-theme' : 'student-theme';
    };

    return (
        <nav className={`navbar-container ${getThemeClass()}`}>
            <div className="navbar-left">
                {/* Brand Identity Section */}
                <div className="brand-logo">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                    </svg>
                </div>
                <span className="brand-text">Falsicode</span>
                <span className="brand-divider">|</span>
                <span className="brand-panel">  
                    {user.role === 'admin' ? 'System Root' : user.role === 'instructor' ? 'Instructor Panel' : 'Student Portal'}
                </span>

                {/* Navbar Links Section - Dynamic based on Role */}
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
                {/* System Notifications */}
                <div className="nav-notification">🔔</div>
                <span className="brand-divider">|</span>

                {/* Profile Access & Logout Menu */}
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
                    
                    {/* Dropdown Card */}
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <Link 
                                to={user.role === 'admin' ? "/admin" : user.role === 'instructor' ? "/instructor" : "/student"} 
                                onClick={() => setDropdownOpen(false)}
                            >
                                Dashboard Home
                            </Link>
                            {/* Sign Out triggers the hard reset logout */}
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