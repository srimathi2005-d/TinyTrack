import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Link2, LayoutDashboard, LogOut, Sun, Moon, Menu, X, ChevronLeft, ChevronRight, User } from 'lucide-react'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('tt-sidebar-collapsed') === 'true'
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('tt-sidebar-collapsed', collapsed)
    const layout = document.getElementById('app-layout')
    if (layout) {
      if (collapsed) {
        layout.classList.add('app-layout--collapsed')
      } else {
        layout.classList.remove('app-layout--collapsed')
      }
    }
  }, [collapsed])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  ]

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      {/* Backdrop overlay for mobile */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          'sidebar',
          collapsed ? 'sidebar--collapsed' : '',
          mobileOpen ? 'sidebar--mobile-open' : '',
        ].filter(Boolean).join(' ')}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header: Logo + collapse toggle */}
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Link2 size={17} color="#fff" />
            </div>
            {!collapsed && <span className="sidebar-logo-text">TinyTrack</span>}
          </Link>

          <button
            className="sidebar-collapse-btn desktop-only"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          <button
            className="sidebar-collapse-btn mobile-only"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="sidebar-nav">
          {!collapsed && <div className="sidebar-section-label">Navigation</div>}
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${location.pathname === link.path ? 'sidebar-link--active' : ''}`}
              title={collapsed ? link.label : undefined}
            >
              {link.icon}
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer: Theme toggle, user info, logout */}
        <div className="sidebar-footer">
          <button
            className="sidebar-link"
            onClick={toggleTheme}
            title={collapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {user && (
            <div className="sidebar-user" title={collapsed ? user.name : undefined}>
              <div className="sidebar-user-avatar">
                <User size={14} />
              </div>
              {!collapsed && (
                <div className="sidebar-user-info">
                  <span className="sidebar-user-name">{user.name}</span>
                  <span className="sidebar-user-email">{user.email}</span>
                </div>
              )}
            </div>
          )}

          <button
            className="sidebar-link sidebar-link--danger"
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
