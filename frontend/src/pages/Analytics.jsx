import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { analyticsService, urlService } from '../services/api'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import { 
  AlertCircle, ArrowLeft, BarChart2, Calendar, Chrome, Clock, 
  ExternalLink, Globe, Laptop, Link2, RefreshCw, Smartphone, Tablet, 
  Sun, Moon, Bell, HelpCircle, ChevronDown, LogOut 
} from 'lucide-react'

const Analytics = () => {
  const { urlId } = useParams()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [analytics, setAnalytics] = useState(null)
  const [urlDetails, setUrlDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showFeaturesMenu, setShowFeaturesMenu] = useState(false)

  const fetchData = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true)
    setError('')
    try {
      const analyticsData = await analyticsService.get(urlId)
      setAnalytics(analyticsData)
      const urlsData = await urlService.getAll({ limit: 1000 })
      setUrlDetails(urlsData.urls?.find((u) => u._id === urlId) || null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics details')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchData() }, [urlId])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div style={s.center}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.75rem' }}>Loading analytics details...</p>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="glass-panel" style={s.errorCard}>
        <AlertCircle size={40} color="var(--danger)" />
        <h3>Error Loading Analytics</h3>
        <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem' }}>{error || 'Analytics not found'}</p>
        <Link to="/dashboard" className="btn btn-secondary">
          <ArrowLeft size={16} />Back to Dashboard
        </Link>
      </div>
    )
  }

  const chartData = analytics.dailyClicks?.map((item) => ({ ...item, formattedDate: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) })) || []
  const topDevice = getTopItem(analytics.deviceBreakdown)
  const topBrowser = getTopItem(analytics.browserBreakdown)

  return (
    <div style={s.analyticsPage}>
      {/* Top Navbar Header */}
      <header 
        style={s.header}
        onMouseLeave={() => setShowFeaturesMenu(false)}
      >
        <div style={s.headerInner}>
          <Link to="/dashboard" style={s.logoLink}>
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
            <button className="btn btn-ghost btn-icon" onClick={toggleTheme} aria-label="Toggle theme" style={s.navIconBtn}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn btn-ghost btn-icon" style={s.navIconBtn} title="Help"><HelpCircle size={18} /></button>
            <button className="btn btn-ghost btn-icon" style={s.navIconBtn} title="Notifications"><Bell size={18} /></button>
            
            {/* User Profile Menu */}
            <div style={s.profileWrapper}>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} style={s.profileBtn}>
                <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase() || 'S'}</div>
                <span style={s.profileName}>{user?.name || 'Srimathi'}</span>
                <ChevronDown size={14} style={s.chevron} />
              </button>
              {showProfileMenu && (
                <div style={s.dropdownCard}>
                  <button onClick={() => setShowProfileMenu(false)} style={s.dropCloseBtn}>×</button>
                  <div style={s.dropHeaderRow}>
                    <div style={s.dropAvatar}>{user?.name?.charAt(0).toUpperCase() || 'S'}</div>
                    <div style={s.dropDetails}>
                      <h4 style={s.dropName}>{user?.name || 'Srimathi'}</h4>
                      <p style={s.dropEmail}>{user?.email || 'srimathidurairaj05@gmail.com'}</p>
                      <div style={s.planRow}>
                        <span style={s.dropPlan}>Free Plan</span>
                      </div>
                    </div>
                  </div>
                  <div style={s.dropDivider} />
                  <button onClick={handleLogout} style={s.dropdownLogoutBtn}>
                    Log Out
                  </button>
                </div>
              )}
            </div>
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

      {/* Analytics Main View */}
      <div style={s.mainContainer}>
        <div style={s.actionHeader}>
          <Link to="/dashboard" className="btn btn-secondary" style={s.smallBtn}>
            <ArrowLeft size={16} />Back to Dashboard
          </Link>
          <button onClick={() => fetchData(true)} className="btn btn-secondary" style={s.smallBtn} disabled={refreshing}>
            <RefreshCw size={16} />{refreshing ? 'Refreshing...' : 'Refresh Stats'}
          </button>
        </div>

        {urlDetails && (
          <div className="glass-panel" style={s.metaCard}>
            <div style={s.metaLeft}>
              <div style={s.linkIconBox}><Link2 size={24} color="var(--primary-light)" /></div>
              <div style={s.metaTexts}>
                <h2 style={s.metaTitle}>{urlDetails.shortCode}</h2>
                <div style={s.metaUrls}>
                  <span style={s.metaLabel}>Short URL:</span>
                  <a href={urlDetails.shortUrl} target="_blank" rel="noopener noreferrer" style={s.metaLink}>
                    {urlDetails.shortUrl}<ExternalLink size={12} />
                  </a>
                </div>
                <div style={s.metaUrls}>
                  <span style={s.metaLabel}>Original:</span>
                  <span style={s.metaOriginal}>{urlDetails.originalUrl}</span>
                </div>
              </div>
            </div>
            <div style={s.metaRight}>
              <Calendar size={14} color="var(--text-muted)" />
              <span>Created on {new Date(urlDetails.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        )}

        <div style={s.statsGrid}>
          <Stat label="Total Clicks" value={analytics.totalClicks} sub="Lifetime redirections" />
          <Stat label="Last Visited" value={analytics.lastVisited ? formatTime(analytics.lastVisited) : 'Never'} sub="Most recent visitor log" small={!!analytics.lastVisited} />
          <Stat label="Top Platform" value={`${topDevice} on ${topBrowser}`} sub="Highest demographic slice" small />
        </div>

        <div className="glass-panel" style={s.chartCard}>
          <div style={s.chartHeader}>
            <BarChart2 size={18} color="var(--primary-light)" />
            <h3 style={s.cardTitle}>Daily Click Trend (Past 7 Days)</h3>
          </div>
          <div style={s.chartWrapper}>
            {chartData.length === 0 ? (
              <div style={s.noData}>No historical clicks to chart</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="formattedDate" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.85rem' }} />
                  <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div style={s.analyticsSplit}>
          <div style={s.demographicsCol}>
            <div className="glass-panel" style={s.splitCard}>
              <h3 style={{ ...s.cardTitle, marginBottom: '1.25rem' }}>Device Distributions</h3>
              {renderBreakdownList(analytics.deviceBreakdown, getDeviceIcon)}
              <h3 style={{ ...s.cardTitle, marginTop: '2rem', marginBottom: '1.25rem' }}>Web Browsers</h3>
              {renderBreakdownList(analytics.browserBreakdown, getBrowserIcon)}
            </div>
          </div>
          <div style={s.logsCol}>
            <div className="glass-panel" style={s.splitCard}>
              <h3 style={{ ...s.cardTitle, marginBottom: '1.25rem' }}>Recent Activity Logs</h3>
              {analytics.recentVisits?.length === 0 ? (
                <div style={s.noData}>No visit logs recorded yet</div>
              ) : (
                <div style={s.tableWrapper}>
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>Timestamp</th>
                        <th style={s.th}>Browser</th>
                        <th style={s.th}>Device</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentVisits.map((visit, index) => (
                        <tr key={index} style={s.tr}>
                          <td style={s.td}><Clock size={12} /> {formatTime(visit.timestamp)}</td>
                          <td style={s.td}>{getBrowserIcon(visit.browser)} {visit.browser}</td>
                          <td style={s.td}>{getDeviceIcon(visit.device)} {visit.device}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  )
}

const getTopItem = (breakdownObj) => {
  if (!breakdownObj || Object.keys(breakdownObj).length === 0) return 'N/A'
  return Object.entries(breakdownObj).reduce((a, b) => a[1] > b[1] ? a : b)[0]
}

const formatTime = (isoString) => isoString ? new Date(isoString).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'
const getDeviceIcon = (device = '') => device.toLowerCase() === 'mobile' ? <Smartphone size={16} /> : device.toLowerCase() === 'tablet' ? <Tablet size={16} /> : <Laptop size={16} />
const getBrowserIcon = (browser = '') => browser.toLowerCase().includes('chrome') ? <Chrome size={16} /> : <Globe size={16} />

const renderBreakdownList = (breakdown = {}, iconFor) => {
  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0) || 1
  const sorted = Object.entries(breakdown).sort((a, b) => b[1] - a[1])
  if (sorted.length === 0) return <p style={s.noDemographics}>No visitor data recorded yet</p>
  return sorted.map(([key, value]) => {
    const percentage = Math.round((value / total) * 100)
    return (
      <div key={key} className="progress-container">
        <div className="flex-between" style={{ fontSize: '0.85rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
            {iconFor(key)}{key}
          </span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
            {value} ({percentage}%)
          </span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    )
  })
}

const Stat = ({ label, value, sub, small }) => (
  <div className="glass-panel" style={s.statsCard}>
    <p style={s.statLabel}>{label}</p>
    <h3 style={{ ...s.statValue, fontSize: small ? '1.35rem' : '1.85rem' }}>{value}</h3>
    <p style={s.statSubText}>{sub}</p>
  </div>
)

const s = {
  analyticsPage: {
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
  navIconBtn: {
    padding: '0.5rem',
    borderRadius: '8px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileWrapper: {
    position: 'relative',
    marginLeft: '0.5rem',
  },
  profileBtn: {
    background: 'var(--bg-hover)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-full)',
    padding: '0.35rem 0.85rem 0.35rem 0.4rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    color: 'var(--text-primary)',
    transition: 'all var(--transition-fast)',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'var(--gradient-primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.8rem',
  },
  profileName: {
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  chevron: {
    color: 'var(--text-muted)',
  },
  dropdownCard: {
    position: 'absolute',
    top: '125%',
    right: 0,
    width: '320px',
    background: 'var(--bg-card-solid)',
    border: '1px solid var(--border-default)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: 'var(--shadow-xl)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    zIndex: 999,
  },
  dropCloseBtn: {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    background: 'var(--bg-hover)',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  dropHeaderRow: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  dropAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'var(--gradient-primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '1.5rem',
  },
  dropDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
    minWidth: 0,
  },
  dropName: {
    color: 'var(--text-primary)',
    fontWeight: 800,
    fontSize: '1.1rem',
    margin: 0,
  },
  dropEmail: {
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '180px',
  },
  planRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '0.35rem',
  },
  dropPlan: {
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  upgradeBtn: {
    background: '#15803d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.25rem 0.75rem',
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  manageAccountBtn: {
    width: '100%',
    background: '#0e7490',
    color: '#fff',
    padding: '0.65rem',
    fontWeight: 700,
    fontSize: '0.9rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  dropDivider: {
    height: '1px',
    background: 'var(--border-light)',
    margin: '0.5rem 0',
  },
  dropdownLogoutBtn: {
    width: '100%',
    border: '1px solid #0e7490',
    background: 'transparent',
    color: '#0e7490',
    padding: '0.65rem',
    fontWeight: 700,
    fontSize: '0.9rem',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  // Content wrapper
  mainContainer: {
    maxWidth: '1440px',
    width: '100%',
    margin: '0 auto',
    padding: '2rem 2rem 4rem',
    flex: 1,
  },
  container: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
  errorCard: { maxWidth: 450, margin: '4rem auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  actionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  smallBtn: { padding: '0.5rem 1.25rem', fontSize: '0.85rem' },
  metaCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderRadius: 16, flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' },
  metaLeft: { display: 'flex', alignItems: 'center', gap: '1.25rem', flex: '1 1 500px', minWidth: 0 },
  linkIconBox: { background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 12, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  metaTexts: { flex: 1, minWidth: 0 },
  metaTitle: { fontSize: '1.35rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '0.25rem' },
  metaUrls: { display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', marginBottom: '0.15rem', minWidth: 0 },
  metaLabel: { color: 'var(--text-muted)', fontWeight: 500 },
  metaLink: { color: 'var(--primary-light)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' },
  metaOriginal: { color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 350 },
  metaRight: { display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-secondary)', fontSize: '0.85rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' },
  statsCard: { borderRadius: 16, padding: '1.5rem' },
  statLabel: { color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' },
  statValue: { fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '0.25rem', textTransform: 'capitalize' },
  statSubText: { color: 'var(--text-muted)', fontSize: '0.75rem' },
  chartCard: { borderRadius: 16, padding: '1.75rem', marginBottom: '1.5rem' },
  chartHeader: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' },
  cardTitle: { color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 700 },
  chartWrapper: { width: '100%', height: 300 },
  noData: { display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', minHeight: 120 },
  analyticsSplit: { display: 'flex', gap: '1.5rem', alignItems: 'stretch', flexWrap: 'wrap' },
  demographicsCol: { flex: '1 1 380px' },
  logsCol: { flex: '2 2 550px', minWidth: 320 },
  splitCard: { padding: '1.75rem', borderRadius: 16, height: '100%' },
  noDemographics: { color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' },
  th: { padding: '0.75rem 0.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '1px solid var(--border-default)' },
  tr: { borderBottom: '1px solid var(--border-light)' },
  td: { padding: '0.75rem 0.5rem', color: 'var(--text-primary)' },
}

export default Analytics
