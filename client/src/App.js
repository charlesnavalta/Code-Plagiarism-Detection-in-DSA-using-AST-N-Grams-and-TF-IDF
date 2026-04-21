import React, { useEffect } from 'react'; // <-- Imported useEffect
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ==========================================
// 1. CORE COMPONENTS & COMMON UI
// ==========================================
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Profile from './pages/common/Profile';

// ==========================================
// 2. AUTHENTICATION PAGES
// ==========================================
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// ==========================================
// 3. LAYOUTS
// ==========================================
import AdminLayout from './layouts/AdminLayout';

// ==========================================
// 4. ROLE-SPECIFIC DASHBOARDS & VIEWS
// ==========================================
import StudentDash from './pages/student/StudentDashboard';
import StudentClassroomView from './pages/student/StudentClassroomView';
import InstructorDash from './pages/instructor/InstructorDashboard';
import InstructorClassroomView from './pages/instructor/InstructorClassroomView';
import AdminDash from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

function App() {

  // ==========================================
  // GLOBAL INACTIVITY TIMER (AUTO-LOGOUT)
  // ==========================================
  useEffect(() => {
    let inactivityTimer;
    
    // 30 Minutes in milliseconds
    const INACTIVITY_LIMIT = 3 * 60 * 1000; 

    const handleLogout = () => {
      const user = localStorage.getItem('user');
      // Only force logout if they are actually logged in
      if (user) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        alert("You have been logged out due to inactivity.");
        window.location.href = '/login';
      }
    };

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      // Restart the 30-minute countdown
      inactivityTimer = setTimeout(handleLogout, INACTIVITY_LIMIT);
    };

    // Events that count as "activity"
    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click'];

    // Attach listeners to the window
    activityEvents.forEach(event => window.addEventListener(event, resetTimer));

    // Initialize the timer on first load
    resetTimer();

    // Cleanup listeners if the app unmounts
    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return (  
    <Router>
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* STUDENT ROUTES */}
        <Route path="/student/*" element={
          <ProtectedRoute allowedRole="student">
            <Routes>
              <Route path="/" element={<StudentDash />} />
              <Route path="class/:id" element={<StudentClassroomView />} />
              <Route path="profile" element={<Profile />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* INSTRUCTOR ROUTES */}
        <Route path="/instructor/*" element={
          <ProtectedRoute allowedRole="instructor">
            <Routes>
              <Route path="/" element={<InstructorDash />} />
              <Route path="class/:id" element={<InstructorClassroomView />} />
              <Route path="profile" element={<Profile />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* ADMIN ROUTES */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminDash />} />
                <Route path="users" element={<UserManagement />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* UNAUTHORIZED / FALLBACK */}
        <Route path="/unauthorized" element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>403 - Access Denied</h1>
                <p>You do not have permission to view this page.</p>
                <a href="/login" style={{ color: '#3498db', textDecoration: 'none' }}>Back to Login</a>
            </div>
        } />
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;