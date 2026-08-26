import React, { useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider, useToast } from './context/NotificationContext';
import ToastContainer from './components/common/ToastContainer';

// ==========================================
// 1. CORE COMPONENTS & COMMON UI
// ==========================================
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Profile from './pages/common/Profile';
import LandingPage from './pages/common/LandingPage';

// ==========================================
// 2. AUTHENTICATION PAGES
// ==========================================
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// ==========================================
// 3. LAYOUTS
// ==========================================
import AdminLayout from './layouts/AdminLayout';

// ==========================================
// 4. ROLE-SPECIFIC DASHBOARDS & VIEWS
// ==========================================
import StudentDash from './pages/student/StudentDashboard';
import StudentClassroomView from './pages/student/StudentClassroomView';
import StudentAssignmentDetail from './pages/student/StudentAssignmentDetail';
import InstructorDash from './pages/instructor/InstructorDashboard';
import InstructorClassroomView from './pages/instructor/InstructorClassroomView';
import AdminDash from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

function AppContent() {
  useTheme();
  const toast = useToast();

  // ==========================================
  // GLOBAL INACTIVITY TIMER (AUTO-LOGOUT)
  // ==========================================
  useEffect(() => {
    let inactivityTimer;
    const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 mins

    const handleLogout = () => {
      const user = localStorage.getItem('user');
      if (user) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        toast.warning("You have been logged out due to inactivity.", "Session Timeout");
        window.location.href = '/login';
      }
    };

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(handleLogout, INACTIVITY_LIMIT);
    };

    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click'];
    activityEvents.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [toast]);

  return (
    <Router>
      <Navbar /> 
      <ToastContainer />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* STUDENT ROUTES */}
        <Route path="/student/*" element={
          <ProtectedRoute allowedRole="student">
            <Routes>
              <Route path="/" element={<StudentDash />} />
              <Route path="class/:id" element={<StudentClassroomView />} />
              <Route path="class/:id/assignment/:assignmentId" element={<StudentAssignmentDetail />} />
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
                <Route path="profile" element={<Profile />} />
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

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;