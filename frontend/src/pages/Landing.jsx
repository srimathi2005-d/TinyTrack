import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import { Link2, Sun, Moon, Sparkles, ChevronRight, Info } from 'lucide-react'

const Landing = () => {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  
  const [showLoader, setShowLoader] = useState(true)
  const [progress, setProgress] = useState(0)
  const [statusIndex, setStatusIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('shorten') // 'shorten' or 'qr'
  const [showFeaturesMenu, setShowFeaturesMenu] = useState(false)

  const statusMessages = [
    'Initializing secure connection...',
    'Syncing link redirection nodes...',
    'Retrieving user session...',
    'Optimizing click track telemetry...',
    'Ready! Redirecting...'
  ]

  useEffect(() => {
    // Run loading progress bar smoothly
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, 15)

    return () => clearInterval(progressInterval)
  }, [])

  useEffect(() => {
    if (progress < 25) {
      setStatusIndex(0)
    } else if (progress < 50) {
      setStatusIndex(1)
    } else if (progress < 70) {
      setStatusIndex(2)
    } else if (progress < 90) {
      setStatusIndex(3)
    } else {
      setStatusIndex(4)
    }

    if (progress === 100) {
      const redirectTimeout = setTimeout(() => {
        if (user) {
          navigate('/dashboard')
        } else {
          setShowLoader(false)
        }
      }, 300)
      return () => clearTimeout(redirectTimeout)
    }
  }, [progress, user, navigate])

  const handleActionClick = () => {
    // User must log in or sign up to shorten links
    navigate('/login')
  }

  // Render Loader Splash Screen
  if (showLoader) {
    return (
      <div style={s.splashContainer}>
        <div className="card" style={s.splashCard}>
          <div style={s.logoWrapper}>
            <div style={s.logoPulseRing} />
            <div style={s.logoGlowIcon}>
              <Link2 size={32} color="#fff" style={s.logoIcon} />
            </div>
          </div>
          <h1 style={s.brandName}>
            TINY<span className="text-gradient">TRACK</span>
          </h1>
          <p style={s.tagline}>Securing &amp; Shortening Your Telemetry</p>

          <div style={s.progressWrapper}>
            <div style={s.progressBarBg}>
              <div style={{ ...s.progressBarFill, width: `${progress}%` }} />
            </div>
            <div style={s.progressMetrics}>
              <span style={s.statusText}>{statusMessages[statusIndex]}</span>
              <span style={s.progressText}>{progress}%</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render TinyURL-style Home Screen
  return (
    <div style={s.homePage}>
      {/* Local Navbar Header */}
      <header 
        style={s.header}
        onMouseLeave={() => setShowFeaturesMenu(false)}
      >
        <div style={s.headerInner}>
          <Link to="/" style={s.logoLink}>
            <div style={s.logoGlowIconMini}>
              <Link2 size={16} color="#fff" />
            </div>
            <span style={s.headerLogoText}>TINYTRACK</span>
          </Link>
          
          <nav style={s.navGroup}>
            <span 
              style={{ ...s.navItem, ...(showFeaturesMenu ? s.navItemActive : {}) }}
              onMouseEnter={() => setShowFeaturesMenu(true)}
            >
              Features
            </span>
            <span style={s.navItem}>Domains</span>
            <span style={s.navItem}>Resources</span>
          </nav>

          <div style={s.headerActions}>
            <button className="btn btn-ghost btn-sm" onClick={toggleTheme} aria-label="Toggle theme" style={{ marginRight: '0.5rem' }}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link to="/login" className="btn btn-ghost btn-sm" style={s.loginBtn}>Log In</Link>
            <Link to="/register" className="btn btn-primary btn-sm" style={s.signUpBtn}>Sign Up</Link>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        {showFeaturesMenu && (
          <div style={s.megaMenu}>
            <div style={s.megaMenuInner}>
              <div style={s.megaLeftCol}>
                <h2 style={s.megaTitle}>Features</h2>
              </div>
              <div style={s.megaGrid}>
                <div style={s.megaItem}>
                  <h4 style={s.megaItemTitle}>✏️ Link Editor</h4>
                  <p style={s.megaItemDesc}>Keep all your links dynamic, and extend their value in the long run</p>
                </div>
                <div style={s.megaItem}>
                  <h4 style={s.megaItemTitle}>🔗 Branded Links</h4>
                  <p style={s.megaItemDesc}>Turn heads and hold attention with fully custom short links</p>
                </div>
                <div style={s.megaItem}>
                  <h4 style={s.megaItemTitle}>📱 QR Code Generator</h4>
                  <p style={s.megaItemDesc}>Elevate your customer's experiences with dynamic, scannable codes</p>
                </div>
                <div style={s.megaItem}>
                  <h4 style={s.megaItemTitle}>📋 Link Management</h4>
                  <p style={s.megaItemDesc}>Organize as many links as you need with our powerful, intuitive platform</p>
                </div>
                <div style={s.megaItem}>
                  <h4 style={s.megaItemTitle}>📈 Short URL Tracking</h4>
                  <p style={s.megaItemDesc}>Measure the success of your efforts and make smarter, data-driven choices</p>
                </div>
                <div style={s.megaItem}>
                  <h4 style={s.megaItemTitle}>&lt;/&gt; Short URL API</h4>
                  <p style={s.megaItemDesc}>Build powerful apps and automations with our link shortening API</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Hero Section */}
      <section style={s.heroSection}>
        <div style={s.heroContainer}>
          {/* Hero Left Content */}
          <div style={s.heroLeft}>
            <h1 style={s.heroTitle}>
              URL Shortener, Branded Short Links &amp; Analytics
            </h1>
            <p style={s.heroSubtitle}>
              Welcome to the premium link shortener — simplifying your internet redirection tunnels. Secure your aliases and track click telemetry instantly.
            </p>
            <p style={s.heroSubtitleSecondary}>
              Create customized campaigns, downloadable QR codes, and trace visitor distributions with our advanced dashboard.
            </p>
            <div style={s.heroCtaGroup}>
              <Link to="/login" className="btn btn-secondary btn-lg" style={s.btnPlans}>View Plans</Link>
              <Link to="/register" className="btn btn-primary btn-lg" style={s.btnCreate}>Create Free Account</Link>
            </div>
          </div>

          {/* Hero Right Interactive Mock Form */}
          <div style={s.heroRight}>
            <div style={s.mockCard}>
              {/* Form Tabs */}
              <div style={s.tabsHeader}>
                <button 
                  onClick={() => setActiveTab('shorten')} 
                  style={{ ...s.tabBtn, ...(activeTab === 'shorten' ? s.tabActive : {}) }}
                >
                  <Link2 size={16} />
                  <span>Shorten a Link</span>
                </button>
                <button 
                  onClick={() => setActiveTab('qr')} 
                  style={{ ...s.tabBtn, ...(activeTab === 'qr' ? s.tabActive : {}) }}
                >
                  <Sparkles size={16} />
                  <span>Generate QR Code</span>
                </button>
              </div>

              {/* Form Body */}
              <div style={s.formBody}>
                {activeTab === 'shorten' ? (
                  <>
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label" style={s.mockLabel}>Long URL <span style={{ color: 'var(--danger)' }}>*</span></label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Paste long URL here" 
                        onClick={handleActionClick}
                        readOnly
                        style={s.mockInput}
                      />
                    </div>
                    <div style={s.inputGrid}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label" style={s.mockLabel}>Domain</label>
                        <select className="form-input" style={s.mockSelect} disabled>
                          <option>tinytrack.com</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ flex: 1.2 }}>
                        <label className="form-label" style={s.mockLabel}>Alias (optional)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Add alias here" 
                          onClick={handleActionClick}
                          readOnly
                          style={s.mockInput}
                        />
                      </div>
                    </div>
                    <button className="btn btn-primary btn-block" style={s.shortenBtn} onClick={handleActionClick}>
                      Shorten Link
                    </button>
                  </>
                ) : (
                  <>
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label" style={s.mockLabel}>Enter Target URL <span style={{ color: 'var(--danger)' }}>*</span></label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Paste URL to embed in QR code" 
                        onClick={handleActionClick}
                        readOnly
                        style={s.mockInput}
                      />
                    </div>
                    <button className="btn btn-primary btn-block" style={s.shortenBtn} onClick={handleActionClick}>
                      Generate QR Code
                    </button>
                  </>
                )}

                <p style={s.disclaimer}>
                  By clicking action, you agree to our Terms of Service, Privacy Policy, and Cookie logs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Links Section */}
        <div style={s.recentLinksContainer}>
          <h3 style={s.recentTitle}>Your Recent Links:</h3>
          <div style={s.recentAlert}>
            <Info size={16} color="var(--primary-light)" />
            <span>No links yet in your history. Sign in or register to shorten URLs and trace logs.</span>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  )
}

const s = {
  // Splash Loader Styles
  splashContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100dvh',
    width: '100vw',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
    background: 'var(--bg-page)',
  },
  splashCard: {
    width: '100%',
    maxWidth: '420px',
    padding: '3rem 2rem',
    borderRadius: '24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    animation: 'scaleUp 0.6s var(--ease-bounce) both',
  },
  logoWrapper: {
    position: 'relative',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem',
  },
  logoPulseRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '24px',
    background: 'var(--gradient-primary)',
    opacity: 0.15,
    animation: 'pulse 2s infinite ease-in-out',
  },
  logoGlowIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '18px',
    background: 'var(--gradient-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-primary)',
    zIndex: 1,
  },
  logoIcon: {
    animation: 'spin 6s infinite linear',
  },
  brandName: {
    fontSize: '2rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    lineHeight: 1.2,
  },
  tagline: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    marginTop: '-0.75rem',
  },
  progressWrapper: {
    width: '100%',
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  progressBarBg: {
    width: '100%',
    height: '6px',
    background: 'var(--border-default)',
    borderRadius: '10px',
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    background: 'var(--gradient-primary)',
    borderRadius: '10px',
    transition: 'width 0.05s linear',
    boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
  },
  progressMetrics: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8rem',
  },
  statusText: {
    color: 'var(--text-secondary)',
    fontWeight: 500,
    animation: 'pulse 1.5s infinite ease-in-out',
  },
  progressText: {
    color: 'var(--primary-light)',
    fontWeight: 700,
  },

  // Home Screen Layout
  homePage: {
    width: '100%',
    background: 'var(--bg-page)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    width: '100%',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    background: 'var(--bg-card)',
    borderBottom: '1px solid var(--border-default)',
    position: 'sticky',
    top: 0,
    zIndex: 900,
    padding: '0 2rem',
  },
  headerInner: {
    maxWidth: '1440px',
    margin: '0 auto',
    display: 'flex',
    height: '70px',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoGlowIconMini: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    background: 'var(--gradient-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-primary)',
  },
  headerLogoText: {
    fontSize: '1.25rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
  },
  navGroup: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    flex: 1,
    paddingLeft: '2.5rem',
  },
  navItem: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'color var(--transition-fast)',
    borderBottom: '2px solid transparent',
    paddingBottom: '0.25rem',
  },
  navItemActive: {
    color: 'var(--primary-light)',
    borderBottom: '2px solid var(--primary)',
  },
  megaMenu: {
    position: 'absolute',
    top: '70px',
    left: 0,
    width: '100%',
    background: 'var(--bg-card-solid)',
    borderBottom: '1px solid var(--border-default)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 999,
    padding: '2.5rem 1.5rem',
    animation: 'slideDown 0.25s var(--ease-smooth)',
  },
  megaMenuInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    gap: '4rem',
    alignItems: 'flex-start',
    width: '100%',
  },
  megaLeftCol: {
    flex: '0 0 200px',
  },
  megaTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    textAlign: 'left',
  },
  megaGrid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.75rem 2.5rem',
  },
  megaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    textAlign: 'left',
  },
  megaItemTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  megaItemDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.45,
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  loginBtn: {
    fontWeight: 600,
    fontSize: '0.88rem',
  },
  signUpBtn: {
    fontWeight: 700,
    fontSize: '0.88rem',
    padding: '0.5rem 1.25rem',
  },

  // Hero Section
  heroSection: {
    width: '100%',
    background: 'var(--bg-card)',
    borderBottom: '1px solid var(--border-default)',
    padding: '4rem 0',
    flex: 1,
  },
  heroContainer: {
    maxWidth: '1440px',
    width: '100%',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    gap: '4rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  heroLeft: {
    flex: '1.2 1 450px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)',
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    lineHeight: 1.6,
    color: 'var(--text-secondary)',
  },
  heroSubtitleSecondary: {
    fontSize: '0.95rem',
    lineHeight: 1.6,
    color: 'var(--text-muted)',
    marginTop: '-0.5rem',
  },
  heroCtaGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  btnPlans: {
    padding: '0.85rem 1.75rem',
    fontSize: '0.95rem',
  },
  btnCreate: {
    padding: '0.85rem 1.75rem',
    fontSize: '0.95rem',
  },

  // Hero Right Form
  heroRight: {
    flex: '1 1 380px',
  },
  mockCard: {
    background: 'var(--bg-card)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1.5px solid var(--border-default)',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-xl)',
  },
  tabsHeader: {
    display: 'flex',
    borderBottom: '1.5px solid var(--border-default)',
    background: 'var(--bg-sidebar)',
  },
  tabBtn: {
    flex: 1,
    padding: '1.1rem 0.5rem',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontWeight: 600,
    fontSize: '0.88rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all var(--transition-fast)',
  },
  tabActive: {
    background: 'var(--bg-card)',
    color: 'var(--text-primary)',
    borderBottom: '2px solid var(--primary)',
    marginTop: '-1.5px',
  },
  formBody: {
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column',
  },
  mockLabel: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '0.45rem',
  },
  mockInput: {
    cursor: 'pointer',
  },
  mockSelect: {
    cursor: 'not-allowed',
    opacity: 0.85,
  },
  inputGrid: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  shortenBtn: {
    background: '#15803d', // Solid clean deep green matching screenshot
    color: '#ffffff',
    padding: '0.85rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 700,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
  },
  disclaimer: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4,
    marginTop: '1rem',
    textAlign: 'center',
  },

  // Recent links list
  recentLinksContainer: {
    maxWidth: '1440px',
    width: '100%',
    margin: '4rem auto 0',
    borderTop: '1px solid var(--border-light)',
    paddingTop: '2.5rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
  },
  recentTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    marginBottom: '1rem',
    color: 'var(--text-primary)',
  },
  recentAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1.15rem 1.5rem',
    borderRadius: '12px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-default)',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  }
}

// Media Query for small screens
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.innerHTML = `
    @media (max-width: 768px) {
      .hero-nav-group { display: none !important; }
      nav { display: none !important; }
    }
  `
  document.head.appendChild(style)
}

export default Landing
