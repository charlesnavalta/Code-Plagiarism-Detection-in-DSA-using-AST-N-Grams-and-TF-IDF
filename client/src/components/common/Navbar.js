import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    
    // 1. SAFELY get raw data first
    const rawUser = localStorage.getItem('user');

    // 2. ONLY parse if data exists and isn't the literal string "undefined"
    const user = (rawUser && rawUser !== "undefined") ? JSON.parse(rawUser) : null;

    const handleLogout = () => {
        // Clear session data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    // 3. If no valid user is found, don't show the Navbar
    if (!user) return null;

    return (
        <nav style={styles.nav}>
            {/* user.role and user.username are now safe to access */}
            <div style={styles.logo}>THE SYSTEM | {user.role?.toUpperCase()}</div>
            <div style={styles.links}>
                <span style={styles.userGreet}>Welcome, {user.username}</span>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        height: '60px',
        backgroundColor: '#2c3e50',
        color: '#ecf0f1',
        // Good for thesis UI: keeps navbar fixed at the top
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    logo: { fontSize: '1.2rem', fontWeight: 'bold' },
    userGreet: { marginRight: '20px' },
    logoutBtn: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: '0.3s'
    }
};

export default Navbar;