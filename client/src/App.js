import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ==========================================
// 1. CORE COMPONENTS & COMMON UI
// ==========================================
import ProtectedRoute from './components/auth/ProtectedRoute';
import Profile from './pages/common/Profile';

// ==========================================
// 2. AUTHENTICATION PAGES
// ==========================================
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// ==========================================
// 3. MASTER & ROLE LAYOUTS
// ==========================================
// RootLayout ensures the dark navy theme and top Navbar are persistent
import RootLayout from './layouts/RootLayout'; 
import AdminLayout from './layouts/AdminLayout';

// ==========================================
// 4. ROLE-SPECIFIC DASHBOARDS & VIEWS
// ==========================================
// Student Views
import StudentDash from './pages/student/StudentDashboard';
import StudentClassroomView from './pages/student/StudentClassroomView';

// Instructor Views
import InstructorDash from './pages/instructor/InstructorDashboard';
import InstructorClassroomView from './pages/instructor/InstructorClassroomView';

// Admin Views
import AdminDash from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

function App() {
  return (  
    <Router>
      {/* ROOT WRAPPER: Handles the Global Navy Theme & Top Navbar */}
      <RootLayout>
        <Routes>
          {/* LANDING REDIRECT: Automatically send the root URL to Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* ==========================================
              PUBLIC ROUTES (No authentication required)
          ========================================== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ==========================================
              STUDENT ROUTES (Nested Routing)
          ========================================== */}
          <Route path="/student/*" element={
            <ProtectedRoute allowedRole="student">
              <Routes>
                {/* Default route: /student/ shows the enrolled classes dashboard */}
                <Route path="/" element={<StudentDash />} />
                
                {/* Dynamic route: /student/class/:id shows a specific classroom's workspace */}
                <Route path="class/:id" element={<StudentClassroomView />} />
                
                {/* Shared route: /student/profile for account management */}
                <Route path="profile" element={<Profile />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* ==========================================
              INSTRUCTOR ROUTES (Nested Routing)
          ========================================== */}
          <Route path="/instructor/*" element={
            <ProtectedRoute allowedRole="instructor">
              <Routes>
                {/* Default route: /instructor/ shows the main dashboard grid */}
                <Route path="/" element={<InstructorDash />} />
                
                {/* Dynamic route: /instructor/class/:id shows a specific classroom's workspace */}
                <Route path="class/:id" element={<InstructorClassroomView />} />
                
                {/* Shared route: /instructor/profile for account management */}
                <Route path="profile" element={<Profile />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* ==========================================
              ADMIN ROUTES (Nested with Sidebar Layout)
          ========================================== */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRole="admin">
              {/* AdminLayout handles the specialized Bento Sidebar */}
              <AdminLayout>
                <Routes>
                  {/* Default route: /admin/ shows the Overview statistics */}
                  <Route path="/" element={<AdminDash />} />
                  
                  {/* Secondary route: /admin/users shows the User Management table */}
                  <Route path="users" element={<UserManagement />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* ==========================================
              ERROR & FALLBACK ROUTES
          ========================================== */}
          <Route path="/unauthorized" element={
              <div style={{ textAlign: 'center', marginTop: '100px', color: '#e2e8f0' }}>
                  <h1>403 - Access Denied</h1>
                  <p>System security protocols prevent your access to this node.</p>
                  <a href="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>Return to Terminal</a>
              </div>
          } />
          
          {/* CATCH-ALL: Redirect any unknown URL to Login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </RootLayout>
    </Router>
  );
}

export default App;