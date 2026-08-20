import React, { useState, useEffect } from 'react'; 
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import './Navbar.css'; 

const Navbar = () => {
    const location = useLocation(); 
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [theme, setTheme, themePreference, cycleTheme] = useTheme();
    
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const rawUser = localStorage.getItem('user');
    const user = (rawUser && rawUser !== "undefined") ? JSON.parse(rawUser) : null;
    const displayName = user?.name || user?.username || 'User';

    const targetDashboard = user ? `/${user.role}` : '/';

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

    const getThemeIcon = (mode) => {
        if (mode === 'light') {
            return (
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            );
        }
        if (mode === 'dark') {
            return (
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            );
        }
        // Device / System icon
        return (
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
        );
    };

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
                            <div className="user-avatar-mini">{displayName.charAt(0).toUpperCase()}</div>
                            <span className="user-name-nexus">{displayName}</span>
                            <svg className={`chevron-nexus ${dropdownOpen ? 'open' : ''}`} width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>

                        {/* DESKTOP DROPDOWN */}
                        {dropdownOpen && (
                            <div className="dropdown-panel-nexus fade-in-down">
                                <div className="dropdown-user-card">
                                    <div className="user-avatar-medium">{displayName.charAt(0).toUpperCase()}</div>
                                    <div className="user-meta-nexus">
                                        <div className="meta-name">{displayName}</div>
                                        <div className="meta-role-badge">{user.role}</div>
                                    </div>
                                </div>
                                
                                <div className="dropdown-divider-nexus"></div>
                                
                                {/* 🌟 3-WAY THEME SELECTOR: Dark | Light | Device */}
                                <div className="theme-selector-container">
                                    <div className="theme-selector-label">Theme</div>
                                    <div className="theme-segmented-control">
                                        <button 
                                            type="button"
                                            className={`theme-segment-btn ${themePreference === 'dark' ? 'active' : ''}`}
                                            onClick={() => setTheme('dark')}
                                            title="Dark Mode"
                                        >
                                            {getThemeIcon('dark')}
                                            <span>Dark</span>
                                        </button>
                                        <button 
                                            type="button"
                                            className={`theme-segment-btn ${themePreference === 'light' ? 'active' : ''}`}
                                            onClick={() => setTheme('light')}
                                            title="Light Mode"
                                        >
                                            {getThemeIcon('light')}
                                            <span>Light</span>
                                        </button>
                                        <button 
                                            type="button"
                                            className={`theme-segment-btn ${themePreference === 'system' ? 'active' : ''}`}
                                            onClick={() => setTheme('system')}
                                            title="Sync with Device / System"
                                        >
                                            {getThemeIcon('system')}
                                            <span>Device</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="dropdown-divider-nexus"></div>

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

                {/* 🌟 3-WAY CYCLE ON MOBILE: Dark -> Light -> Device */}
                <button className="app-nav-item" onClick={cycleTheme} title={`Current: ${themePreference}`}>
                    {getThemeIcon(themePreference)}
                    <span>{themePreference === 'system' ? 'Device' : themePreference === 'light' ? 'Light' : 'Dark'}</span>
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