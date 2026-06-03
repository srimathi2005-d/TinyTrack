import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Sidebar from './components/Sidebar';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Link2, Sun, Moon } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center flex-col gap-md" style={{ height: '100vh', background: 'var(--bg-page)' }}>
        <div className="loading-spinner" style={{ width: '40px', height: '40px' }} />
        <p className="text-secondary text-sm" style={{ letterSpacing: '0.05em' }}>RESTORING SESSION...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route wrapper (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center flex-col gap-md" style={{ height: '100vh', background: 'var(--bg-page)' }}>
        <div className="loading-spinner" style={{ width: '40px', height: '40px' }} />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public layout: minimal header + content (for Landing, Login, Register)
const PublicLayout = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isSplash = location.pathname === '/';

  return (
    <div className="public-layout">
      {!isSplash && (
        <header className="public-header">
          <div className="public-header-inner">
            <Link to="/" className="public-header-logo">
              <div className="logo-icon">
                <Link2 size={17} color="#fff" />
              </div>
              <span className="logo-text">TinyTrack</span>
            </Link>
            <div className="public-header-actions">
              <button className="btn btn-ghost btn-sm" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-sm">Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                  <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </header>
      )}
      <main className="public-main" style={isSplash ? { padding: 0, maxWidth: 'none', width: '100%' } : undefined}>
        <Outlet />
      </main>
      {!isSplash && (
        <>
          <FAQ />
          <Footer />
        </>
      )}
    </div>
  );
};

const AppLayout = () => {
  return <Outlet />;
};

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
      </Route>

      {/* Protected routes with sidebar */}
      <Route element={<AppLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/:urlId"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
