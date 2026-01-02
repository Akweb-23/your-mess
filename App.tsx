import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Welcome from './pages/Welcome';
import OwnerDashboard from './pages/owner/Dashboard';
import AttendancePage from './pages/owner/Attendance';
import BillingPage from './pages/owner/Billing';
import StudentsPage from './pages/owner/Students';
import StudentDashboard from './pages/student/StudentDashboard';
import Profile from './pages/Profile';
import { mockAuth } from './services/mockDb';
import { ToastProvider } from './context/ToastContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = mockAuth.getCurrentUser();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Owner Routes */}
          <Route path="/owner/dashboard" element={<PrivateRoute><OwnerDashboard /></PrivateRoute>} />
          <Route path="/owner/attendance" element={<PrivateRoute><AttendancePage /></PrivateRoute>} />
          <Route path="/owner/billing" element={<PrivateRoute><BillingPage /></PrivateRoute>} />
          <Route path="/owner/students" element={<PrivateRoute><StudentsPage /></PrivateRoute>} />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
          <Route path="/student/billing" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} /> {/* Reusing dashboard for simplicity as requested */}
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;