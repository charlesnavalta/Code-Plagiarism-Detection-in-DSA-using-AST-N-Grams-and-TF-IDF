import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
    // We parse the user object from localStorage
    const user = JSON.parse(localStorage.getItem('user')); 

    // 1. If no user is found, send them back to Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. If the user's role doesn't match the required role, send to "Unauthorized"
    if (user.role !== allowedRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 3. If everything is correct, show the requested page
    return children;
};

export default ProtectedRoute;