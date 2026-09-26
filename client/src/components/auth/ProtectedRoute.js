import React from 'react';
import { Navigate } from 'react-router-dom';
import { clearAuthSession } from '../../utils/authUtils';

const ProtectedRoute = ({ children, allowedRole }) => {
    let user = null;
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
            user = JSON.parse(storedUser);
        }
    } catch (e) {
        console.error("ProtectedRoute: Corrupted session storage detected:", e);
        user = null;
    }
    const token = localStorage.getItem('token');

    // If no user OR no token is found, clean auth session and redirect
    if (!user || !token) {
        clearAuthSession(); 
        return <Navigate to="/login" replace />;
    }

    if (user.role !== allowedRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;