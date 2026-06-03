import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Link2, LogOut, LayoutDashboard, User, Sun, Moon } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isDark = theme === 'dark'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header style={{ ...s.header, background: isDark ? 'rgba(5, 7, 14, 0.55)' : 'rgba(240, 244, 255, 0.75)' }}>
      <div style={s.navWrapper}>
        <Link to="/" style={s.logoLink}>
          <div style={s.iconGlow}><Link2 size={20} color="#fff" /></div>
          <span style={{ ...s.logoText, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>TinyTrack</span>
        </Link>

        <div style={s.rightGroup}>
          <button onClick={toggleTheme} className="btn btn-secondary" style={s.smallBtn}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>

          {user ? (
            <>
              <Link to="/dashboard" style={{ ...s.navLink, ...(location.pathname === '/dashboard' ? s.activeLink : {}) }}>
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </Link>
              <div style={s.userInfo}>
                <div style={s.avatar}><User size={13} color="#818cf8" /></div>
                <span>{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary" style={s.smallBtn}>
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && <Link to="/login" className="btn btn-secondary" style={s.smallBtn}>Sign In</Link>}
              {location.pathname !== '/register' && <Link to="/register" className="btn btn-primary" style={s.smallBtn}>Sign Up</Link>}
            </>
          )}
        </div>
      </div>
    </header>
  )
}

const s = {
  header: { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100, width: '100%', padding: '0.7rem 1.5rem', borderBottom: '1px solid var(--glass-border)' },
  navWrapper: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%', gap: '1rem', flexWrap: 'wrap' },
  logoLink: { display: 'flex', alignItems: 'center', gap: '0.55rem' },
  iconGlow: { background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', borderRadius: '9px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(99,102,241,0.4)' },
  logoText: { fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em' },
  logoHighlight: { background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  rightGroup: { display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' },
  navLink: { display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, padding: '0.4rem 0.7rem', borderRadius: '7px', color: 'var(--text-secondary)' },
  activeLink: { background: 'rgba(99,102,241,0.1)', color: 'var(--text-primary)' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600 },
  avatar: { background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '50%', width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  smallBtn: { padding: '0.42rem 1rem', fontSize: '0.85rem' },
}

export default Navbar
