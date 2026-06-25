import React, { useState, useEffect } from 'react'; 
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import './Navbar.css'; 

const Navbar = () => {
    // 1. ALL HOOKS MUST GO FIRST
    const navigate = useNavigate();
    const location = useLocation(); 
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [theme, setTheme] = useTheme();
    
    // NEW: States for the Smart Scroll Navbar
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const rawUser = localStorage.getItem('user');
    const user = (rawUser && rawUser !== "undefined") ? JSON.parse(rawUser) : null;
    const displayName = user?.name || user?.username || 'User';

    // 2. DYNAMIC ROUTING LOGIC
    const targetDashboard = user ? `/${user.role}` : '/';
    const isAlreadyOnDashboard = location.pathname === targetDashboard;

    // --- EFFECTS ---
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        const closeDropdown = (e) => {
            if (!e.target.closest('.profile-menu')) setDropdownOpen(false);
        };
        window.addEventListener('click', closeDropdown);
        return () => window.removeEventListener('click', closeDropdown);
    }, []);

    // NEW: Scroll detection effect
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Hide if scrolling down past 65px, show if scrolling up
            if (currentScrollY > lastScrollY && currentScrollY > 65) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // 3. STANDARD LOGIC
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('app-theme', newTheme);
        window.dispatchEvent(new Event('storage'));
    };

    const handleLogout = () => {
        setDropdownOpen(false); 
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login'; 
    };

    // 4. EARLY RETURNS MUST GO LAST (Before the JSX)
    const hiddenRoutes = ['/login', '/register', '/'];
    if (hiddenRoutes.includes(location.pathname)) return null;
    if (!user) return null;

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        // NEW: Conditionally add the 'navbar-hidden' class based on the isVisible state
        <nav className={`navbar-nexus ${!isVisible ? 'navbar-hidden' : ''}`} data-theme={theme}>
            <div className="navbar-left">
                <Link to={targetDashboard} className="brand-anchor">
                    <div className="brand-logo-nexus">
                        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                        </svg>
                    </div>
                    <span className="brand-text-nexus">Falsicode</span>
                </Link>
                
                <span className="brand-divider-nexus">/</span>
                
                {/* STATIC BREADCRUMB */}
                <span className="brand-panel-nexus">
                    {user.role === 'admin' ? 'Admin' : user.role === 'instructor' ? 'Instructor' : 'Student'}
                </span>

                <div className="nav-links-nexus">
                    {/* FIXED: Correctly checks for either role and uses dynamic link/text */}
                    {(user.role === 'student' || user.role === 'instructor') && (
                        <Link to={targetDashboard} className={`nav-item-nexus ${isActive(targetDashboard)}`}>
                            {user.role === 'instructor' ? 'Classroom Hub' : 'My Classes'}
                        </Link>
                    )}
                </div>
            </div>

            <div className="navbar-right">
                <div className="profile-menu">
                    <button className="profile-trigger-nexus" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <div className="user-avatar-mini">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="user-name-nexus">{displayName}</span>
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    
                    {dropdownOpen && (
                        <div className="dropdown-nexus fade-in-down">
                            <div className="dropdown-header-nexus">
                                <strong>{displayName}</strong>
                                <span>{user.role} account</span>
                            </div>
                            
                            <div className="dropdown-divider-nexus"></div>
                            
                            <button className="dropdown-item-nexus" onClick={toggleTheme}>
                                <span className="item-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
                                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                            </button>

                            <Link to={`/${user.role}/profile`} className="dropdown-item-nexus">
                                <span className="item-icon">👤</span> Account
                            </Link>
                            
                            <div className="dropdown-divider-nexus"></div>
                            
                            <button onClick={handleLogout} className="dropdown-item-nexus logout-nexus">
                                <span className="item-icon">🏃</span> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;