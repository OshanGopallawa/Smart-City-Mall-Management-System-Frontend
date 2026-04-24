import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Pagess
import Landing from './pages/Landing';
import { UserLogin, UserRegister } from './pages/auth/UserAuth';
import { OperatorLogin, OperatorRegister } from './pages/auth/OperatorAuth';
import Layout from './components/layout/Layout';
import UserDashboard from './pages/user/UserDashboard';
import UserStores from './pages/user/UserStores';
import { UserDeals, UserEvents } from './pages/user/UserDealsEvents';
import { UserVisits, OperatorEvents } from './pages/user/UserVisits';
import { UserProfile, OperatorProfile } from './pages/user/Profile';
import OperatorDashboard from './pages/operator/OperatorDashboard';
import OperatorStores from './pages/operator/OperatorStores';
import OperatorDeals from './pages/operator/OperatorDeals';
import OperatorManagement from './pages/operator/OperatorManagement';
import OperatorDetail from './pages/operator/OperatorDetail';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';

// Protected route wrapper
function ProtectedRoute({ children, requiredType }) {
  const { isLoggedIn, authType, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div className="spinner" /></div>;
  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (requiredType && authType !== requiredType) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/operator/login" element={<OperatorLogin />} />
      <Route path="/operator/register" element={<OperatorRegister />} />

      {/* User routes */}
      <Route path="/user/*" element={
        <ProtectedRoute requiredType="user">
          <Layout>
            <Routes>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="stores" element={<UserStores />} />
              <Route path="deals" element={<UserDeals />} />
              <Route path="events" element={<UserEvents />} />
              <Route path="visits" element={<UserVisits />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />

     {/* Operator routes */}
      <Route path="/operator/*" element={
        <ProtectedRoute requiredType="operator">
          <Layout>
            <Routes>
              <Route path="dashboard" element={<OperatorDashboard />} />
              <Route path="stores" element={<OperatorStores />} />
              <Route path="deals" element={<OperatorDeals />} />
              <Route path="events" element={<OperatorEvents />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="profile" element={<OperatorProfile />} />
              <Route path="manage" element={<OperatorManagement />} />
              <Route path="view/:id" element={<OperatorDetail />} />
              <Route path="edit/:id" element={<OperatorDetail />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
    } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: 'var(--success)', secondary: 'var(--bg-card)' } },
            error: { iconTheme: { primary: 'var(--danger)', secondary: 'var(--bg-card)' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
