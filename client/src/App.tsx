import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Layout & Guards
import AppLayout from './components/layout/AppLayout';
import PrivateRoute from './components/guards/PrivateRoute';
import ErrorBoundary from './components/guards/ErrorBoundary';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Intern Pages
import InternDashboard from './pages/intern/InternDashboard';
import InternProfile from './pages/intern/InternProfile';
import InternAllocation from './pages/intern/InternAllocation';
import InternExplore from './pages/intern/InternExplore';

// Company Pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyProfile from './pages/company/CompanyProfile';
import CompanySlots from './pages/company/CompanySlots';
import CompanyMatches from './pages/company/CompanyMatches';
import CompanyAccepted from './pages/company/CompanyAccepted';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRunEngine from './pages/admin/AdminRunEngine';
import AdminAllocations from './pages/admin/AdminAllocations';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminReports from './pages/admin/AdminReports';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminSystemConfig from './pages/admin/AdminSystemConfig';
import AdminAuditLog from './pages/admin/AdminAuditLog';

export const App: React.FC = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Routes>
          <Route element={<AppLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* Intern Routes */}
            <Route
              path="/intern/dashboard"
              element={
                <PrivateRoute allowedRoles={['intern']}>
                  <InternDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/intern/profile"
              element={
                <PrivateRoute allowedRoles={['intern']}>
                  <InternProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/intern/allocation"
              element={
                <PrivateRoute allowedRoles={['intern']}>
                  <InternAllocation />
                </PrivateRoute>
              }
            />
            <Route
              path="/intern/explore"
              element={
                <PrivateRoute allowedRoles={['intern']}>
                  <InternExplore />
                </PrivateRoute>
              }
            />

            {/* Company Routes */}
            <Route
              path="/company/dashboard"
              element={
                <PrivateRoute allowedRoles={['company']}>
                  <CompanyDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/company/profile"
              element={
                <PrivateRoute allowedRoles={['company']}>
                  <CompanyProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/company/slots"
              element={
                <PrivateRoute allowedRoles={['company']}>
                  <CompanySlots />
                </PrivateRoute>
              }
            />
            <Route
              path="/company/matches"
              element={
                <PrivateRoute allowedRoles={['company']}>
                  <CompanyMatches />
                </PrivateRoute>
              }
            />
            <Route
              path="/company/slots/:slotId/matches"
              element={
                <PrivateRoute allowedRoles={['company']}>
                  <CompanyMatches />
                </PrivateRoute>
              }
            />
            <Route
              path="/company/accepted-interns"
              element={
                <PrivateRoute allowedRoles={['company']}>
                  <CompanyAccepted />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/run-engine"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminRunEngine />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/allocations"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminAllocations />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/companies"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminCompanies />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminReports />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminNotifications />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/system-config"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminSystemConfig />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminAuditLog />
                </PrivateRoute>
              }
            />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
