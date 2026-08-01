import React, { useState, useEffect } from 'react'; 
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import './Navbar.css'; 

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [theme, setTheme] = useTheme();
    
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const rawUser = localStorage.getItem('user');
    const user = (rawUser && rawUser !== "undefined") ? JSON.parse(rawUser) : null;
    const displayName = user?.name || user?.username || 'User';

    const targetDashboard = user ? `/${user.role}` : '/';
    const isAlreadyOnDashboard = location.pathname === targetDashboard;

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

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
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

    const hiddenRoutes = ['/login', '/register', '/'];
    if (hiddenRoutes.includes(location.pathname)) return null;
    if (!user) return null;

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <>
            {/* --- TOP NAVBAR (Responsive) --- */}
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
                    
                    <span className="brand-panel-nexus">
                        {user.role === 'admin' ? 'Admin' : user.role === 'instructor' ? 'Instructor' : 'Student'}
                    </span>

                    {/* Desktop Only: Inline Nav Links */}
                    <div className="nav-links-nexus desktop-only">
                        {(user.role === 'student' || user.role === 'instructor') && (
                            <Link to={targetDashboard} className={`nav-item-nexus ${isActive(targetDashboard)}`}>
                                {user.role === 'instructor' ? 'Classroom Hub' : 'My Classes'}
                            </Link>
                        )}
                    </div>
                </div>

                <div className="navbar-right desktop-only">
                    <div className="profile-menu">
                        <button className="profile-trigger-nexus" onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <div className="user-avatar-mini">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                            <span className="user-name-nexus">{displayName}</span>
                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        
                        {dropdownOpen && (
                            <div className="dropdown-nexus scale-in-tr">
                                {/* Premium Identity Header */}
                                <div className="dropdown-header-nexus">
                                    <div className="dropdown-avatar-large">
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="dropdown-user-details">
                                        <strong>{displayName}</strong>
                                        <span className={`role-badge-${user.role?.toLowerCase()}`}>
                                            {user.role} workspace
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="dropdown-divider-nexus"></div>
                                
                                {/* Theme Toggle */}
                                <button className="dropdown-item-nexus" onClick={toggleTheme}>
                                    <span className="item-icon">
                                        {theme === 'light' ? (
                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="5"></circle>
                                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                            </svg>
                                        )}
                                    </span>
                                    <span>{theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}</span>
                                </button>

                                {/* Account Link */}
                                <Link to={`/${user.role}/profile`} className="dropdown-item-nexus" onClick={() => setDropdownOpen(false)}>
                                    <span className="item-icon">
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </span>
                                    <span>Account Settings</span>
                                </Link>
                                
                                <div className="dropdown-divider-nexus"></div>
                                
                                {/* Logout Button */}
                                <button onClick={handleLogout} className="dropdown-item-nexus logout-nexus">
                                    <span className="item-icon">
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                        </svg>
                                    </span>
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* --- 📱 MOBILE BOTTOM NAV (App-like) --- */}
            <nav className={`mobile-bottom-nav ${!isVisible ? 'nav-hidden-mobile' : ''}`}>
                <Link to={targetDashboard} className={`app-nav-item ${isActive(targetDashboard)}`}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <span>Home</span>
                </Link>

                <Link to={`/${user.role}/profile`} className={`app-nav-item ${isActive(`/${user.role}/profile`)}`}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>Profile</span>
                </Link>

                <button className="app-nav-item" onClick={toggleTheme}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        {theme === 'light' 
                            ? <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                            : <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        }
                    </svg>
                    <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
                </button>

                <button className="app-nav-item text-danger" onClick={handleLogout}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span>Logout</span>
                </button>
            </nav>
        </>
    );
};

export default Navbar;