import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelectorPage from './pages/RoleSelectorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EnrollPage from './pages/EnrollPage';
import AttendancePage from './pages/AttendancePage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ModeratorDashboard from './pages/ModeratorDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  return auth.token ? children : <Navigate to="/" />;
};

const DashboardDirector = () => {
    const { auth } = useAuth();
    if (!auth.user) return <div>Loading...</div>;
    switch (auth.user.role) {
        case 'Student': return <StudentDashboard />;
        case 'Teacher': return <TeacherDashboard />;
        case 'Admin': return <AdminDashboard />;
        case 'Moderator': return <ModeratorDashboard />;
        default: return <Navigate to="/" />;
    }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/" element={<RoleSelectorPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardDirector /></ProtectedRoute>} />
            <Route path="/enroll" element={<ProtectedRoute><EnrollPage /></ProtectedRoute>} />
            <Route path="/attendance/:classId" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;