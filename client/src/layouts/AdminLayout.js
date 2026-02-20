import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminLayout.css'; 

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();

    // Secure logout function
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            {/* Sidebar Navigation */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>LogicGuard Admin</h2>
                </div>
                <nav className="sidebar-nav">
                    {/* We will build these exact routes in App.js later */}
                    <Link to="/admin" className="nav-link">Overview</Link>
                    <Link to="/admin/users" className="nav-link">User Management</Link>
                    <Link to="/admin/settings" className="nav-link">System Settings</Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="admin-main">
                {/* Top Navigation Bar */}
                <header className="admin-topbar">
                    <span className="welcome-text">System Administrator</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </header>

                {/* This is where your actual page content will appear */}
                <main className="admin-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;