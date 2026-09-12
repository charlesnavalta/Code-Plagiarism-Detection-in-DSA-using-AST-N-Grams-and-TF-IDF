import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
    const [theme] = useTheme();
    const location = useLocation();

    // Desktop collapsed state (false = expanded 250px, true = mini icon rail 68px)
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('admin_sidebar_collapsed');
            return saved === 'true';
        }
        return false;
    });

    // Mobile / Tablet drawer open state
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleSidebar = () => {
        if (window.innerWidth <= 1024) {
            setMobileOpen(prev => !prev);
        } else {
            setIsCollapsed(prev => {
                const next = !prev;
                localStorage.setItem('admin_sidebar_collapsed', String(next));
                return next;
            });
        }
    };

    // Close mobile drawer on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Handle ESC key to close mobile drawer
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setMobileOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Lock body scroll when mobile drawer is open
    useEffect(() => {
        if (mobileOpen && window.innerWidth <= 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    return (
        <div className="admin-layout-root" data-theme={theme}>
            {/* Backdrop for Mobile / Tablet Drawer */}
            <div 
                className={`admin-sidebar-backdrop ${mobileOpen ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
            />

            {/* Sidebar (Desktop Collapsible Rail / Mobile Slide-out Drawer) */}
            <aside className={`admin-sidebar-nexus ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header-nexus">
                    <div className="sidebar-label">System Terminal</div>
                    <button 
                        className="sidebar-hamburger-btn"
                        onClick={toggleSidebar}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                            <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                            <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
                            <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                
                <nav className="sidebar-nav-list" aria-label="Admin Navigation">
                    <NavLink 
                        to="/admin" 
                        end 
                        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                        onClick={() => { if (window.innerWidth <= 1024) setMobileOpen(false); }}
                        title="Overview"
                    >
                        <div className="nav-icon">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                            </svg>
                        </div>
                        <span className="nav-label">Overview</span>
                    </NavLink>
                    
                    <NavLink 
                        to="/admin/users" 
                        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                        onClick={() => { if (window.innerWidth <= 1024) setMobileOpen(false); }}
                        title="Users"
                    >
                        <div className="nav-icon">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <span className="nav-label">Users</span>
                    </NavLink>

                    <NavLink 
                        to="/admin/classrooms" 
                        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                        onClick={() => { if (window.innerWidth <= 1024) setMobileOpen(false); }}
                        title="Classrooms"
                    >
                        <div className="nav-icon">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <span className="nav-label">Classrooms</span>
                    </NavLink>

                    <NavLink 
                        to="/admin/assignments" 
                        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                        onClick={() => { if (window.innerWidth <= 1024) setMobileOpen(false); }}
                        title="Assignments"
                    >
                        <div className="nav-icon">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                            </svg>
                        </div>
                        <span className="nav-label">Assignments</span>
                    </NavLink>
                    
                    <NavLink 
                        to="/admin/profile" 
                        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                        onClick={() => { if (window.innerWidth <= 1024) setMobileOpen(false); }}
                        title="Admin Profile"
                    >
                        <div className="nav-icon">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <span className="nav-label">Admin Profile</span>
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="admin-viewport-main">
                {/* Mobile / Tablet top bar with hamburger button */}
                <div className="admin-mobile-top-bar">
                    <button 
                        className="mobile-hamburger-trigger"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open navigation menu"
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                            <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                            <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
                            <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
                        </svg>
                    </button>
                    <span className="mobile-top-bar-title">Terminal</span>
                </div>

                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
