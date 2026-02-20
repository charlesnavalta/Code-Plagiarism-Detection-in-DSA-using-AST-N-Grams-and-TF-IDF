import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Core Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/common/Navbar'; 
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// 2. Layouts (NEW IMPORT)
import AdminLayout from './layouts/AdminLayout';

// 3. Dashboards
import StudentDash from './pages/student/StudentDashboard';
import InstructorDash from './pages/instructor/InstructorDashboard';
import AdminDash from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement'; // We will uncomment this later!

function App() {
  console.log({ ProtectedRoute, Navbar, Login, Register, AdminLayout, StudentDash, InstructorDash, AdminDash });
  return (  
    <Router>
      {/* Note: You might want to hide this global Navbar on Admin pages since your AdminLayout has its own topbar! */}
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

        {/* ADMIN ROUTES WITH LAYOUT */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout>
              <Routes>
                {/* The default /admin route shows the Overview */}
                <Route path="/" element={<AdminDash />} />
                
                {/* The /admin/users route will show the User Management table */}
                <Route path="users" element={<UserManagement />} /> 
              </Routes>
            </AdminLayout>
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