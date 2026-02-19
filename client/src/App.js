import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Core Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/common/Navbar'; 
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// 2. Dashboards
import StudentDash from './pages/student/StudentDashboard';
import InstructorDash from './pages/instructor/InstructorDashboard';
import AdminDash from './pages/admin/AdminDashboard';

function App() {
  return (
    <Router>
      {/* Navbar stays outside Routes to show on every page (it hides itself in its own logic if no user) */}
      <Navbar /> 
      
      <Routes>
        {/* LANDING REDIRECT: Send the root URL to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES: Role-Based Workspaces */}
        <Route path="/student/*" element={
          <ProtectedRoute allowedRole="student">
            <StudentDash />
          </ProtectedRoute>
        } />

        <Route path="/instructor/*" element={
          <ProtectedRoute allowedRole="instructor">
            <InstructorDash />
          </ProtectedRoute>
        } />

        <Route path="/admin/*" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDash />
          </ProtectedRoute>
        } />

        {/* ERROR ROUTES */}
        <Route path="/unauthorized" element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>403 - Access Denied</h1>
                <p>You do not have permission to view this page.</p>
                <a href="/login">Back to Login</a>
            </div>
        } />
        
        {/* CATCH-ALL: Redirect any unknown URL to Login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;