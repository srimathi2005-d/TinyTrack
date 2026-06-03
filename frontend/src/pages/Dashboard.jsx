import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { urlService } from '../services/api'
import QRModal from '../components/QRModal'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import { 
  AlertCircle, BarChart3, Calendar, Check, Copy, ExternalLink, 
  Link2, Plus, QrCode, Search, Trash2, X, Sun, Moon, Bell, HelpCircle, 
  ChevronDown, LogOut 
} from 'lucide-react'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  // States from original dashboard
  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [originalUrl, setOriginalUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUrls, setTotalUrls] = useState(0)
  const [copiedId, setCopiedId] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [qrModalUrl, setQrModalUrl] = useState('')
  const [qrModalCode, setQrModalCode] = useState('')
  const [activeTab, setActiveTab] = useState('shorten')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showFeaturesMenu, setShowFeaturesMenu] = useState(false)
  const [showDomainsMenu, setShowDomainsMenu] = useState(false)
  const [showResourcesMenu, setShowResourcesMenu] = useState(false)
  const limit = 6

  const closeAllMenus = () => {
    setShowFeaturesMenu(false)
    setShowDomainsMenu(false)
    setShowResourcesMenu(false)
  }

  const fetchUrls = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await urlService.getAll({ search, page, limit })
      setUrls(data.urls || [])
      setTotalPages(data.totalPages || 1)
      setTotalUrls(data.total || 0)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load URLs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUrls()
  }, [search, page])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!originalUrl) {
      setError('Please provide a URL to shorten')
      return
    }
    setFormLoading(true)
    try {
      const newUrl = await urlService.create(originalUrl, customAlias)
      setSuccess('URL shortened successfully!')
      setOriginalUrl('')
      setCustomAlias('')
      page === 1 ? fetchUrls() : setPage(1)
      setQrModalUrl(newUrl.shortUrl)
      setQrModalCode(newUrl.shortCode)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to shorten URL')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleteLoading(true)
    try {
      await urlService.delete(id)
      setDeleteConfirmId(null)
      urls.length === 1 && page > 1 ? setPage(page - 1) : fetchUrls()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete URL')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCopy = async (id, shortUrl) => {
    await navigator.clipboard.writeText(shortUrl)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div style={s.dashboardPage}>
      {/* Top Navbar Header */}
      <header 
        style={s.header}
        onMouseLeave={closeAllMenus}
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
              onMouseEnter={() => { closeAllMenus(); setShowFeaturesMenu(true) }}
            >
              Features
            </span>
            <span
              style={{ ...s.navItem, ...(showDomainsMenu ? s.navItemActive : {}) }}
              onMouseEnter={() => { closeAllMenus(); setShowDomainsMenu(true) }}
            >
              Domains
            </span>
            <span
              style={{ ...s.navItem, ...(showResourcesMenu ? s.navItemActive : {}) }}
              onMouseEnter={() => { closeAllMenus(); setShowResourcesMenu(true) }}
            >
              Resources
            </span>
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

        {/* Features Mega Menu Dropdown */}
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

        {/* Domains Mega Menu */}
        {showDomainsMenu && (
          <div style={s.megaMenu}>
            <div style={s.domainsMegaInner}>
              <div style={s.domainsLeft}>
                <h2 style={s.domainsBigTitle}>Custom Domains:</h2>
                <h2 style={{ ...s.domainsBigTitle, fontStyle: 'italic', color: 'var(--primary-light)' }}>Your Links, Your Branding</h2>
                <p style={s.domainsDesc}>
                  Branded domains are used exclusively to create short, appealing, and informative links that put your branding or core message front-and-center.
                </p>
                <p style={{ ...s.domainsDesc, marginTop: '0.75rem' }}>
                  TinyTrack subscribers can purchase domains directly through our platform. Try it now!
                </p>
                <button style={s.domainsBtn}>Get Started</button>
              </div>
              <div style={s.domainsRight}>
                <div style={s.domainSearchBox}>
                  <span style={s.domainSearchLabel}>🔍 Search for a domain</span>
                  <div style={s.domainSearchRow}>
                    <input
                      type="text"
                      placeholder="yourbrand.com"
                      readOnly
                      style={s.domainSearchInput}
                    />
                    <button style={s.domainSearchBtn}>Search</button>
                  </div>
                  <div style={s.domainExtensions}>
                    {['.com', '.net', '.org', '.io', '.dev', '.app'].map(ext => (
                      <span key={ext} style={s.domainExtBadge}>{ext}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resources Mega Menu */}
        {showResourcesMenu && (
          <div style={s.megaMenu}>
            <div style={s.megaMenuInner}>
              <div style={s.megaLeftCol}>
                <h2 style={s.megaTitle}>Resources</h2>
              </div>
              <div style={s.megaGrid}>
                <div style={s.megaItem}>
                  <h4 style={s.megaItemTitle}>📝 Blog</h4>
                  <p style={s.megaItemDesc}>Read the latest tips and tricks from the top experts in link shortening</p>
                </div>
                <div style={s.megaItem}>
                  <h4 style={s.megaItemTitle}>💻 For Developers</h4>
                  <p style={s.megaItemDesc}>Power your apps and software with automated, fully custom URL shortening</p>
                </div>
                <div style={s.megaItem}>
                  <h4 style={s.megaItemTitle}>✅ Our Proven Process</h4>
                  <p style={s.megaItemDesc}>Learn how our customers go from zero to hero with our link management tools</p>
                </div>
                <div style={s.megaItem}>
                  <h4 style={s.megaItemTitle}>🏢 About Us</h4>
                  <p style={s.megaItemDesc}>Learn about TinyTrack's journey as the first link shortener</p>
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
          </div>

          {/* Hero Right Interactive Form */}
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
                  <QrCode size={16} />
                  <span>Generate QR Code</span>
                </button>
              </div>

              {/* Form Body */}
              <div style={s.formBody}>
                {error && !deleteConfirmId && <div className="alert alert-error" style={{ marginBottom: '1rem' }}><AlertCircle size={18} /><span>{error}</span></div>}
                {success && <div className="alert alert-success" style={{ marginBottom: '1rem' }}><Check size={18} /><span>{success}</span></div>}

                <form onSubmit={handleCreate}>
                  {activeTab === 'shorten' ? (
                    <>
                      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label" style={s.mockLabel}>Long URL <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <input 
                          type="url" 
                          className="form-input" 
                          placeholder="Paste long URL here" 
                          value={originalUrl}
                          onChange={(e) => setOriginalUrl(e.target.value)}
                          disabled={formLoading}
                          required
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
                            value={customAlias}
                            onChange={(e) => setCustomAlias(e.target.value)}
                            disabled={formLoading}
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary btn-block" style={s.shortenBtn} disabled={formLoading}>
                        {formLoading ? 'Shortening...' : 'Shorten Link'}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label" style={s.mockLabel}>Enter Target URL <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <input 
                          type="url" 
                          className="form-input" 
                          placeholder="Paste URL to embed in QR code" 
                          value={originalUrl}
                          onChange={(e) => setOriginalUrl(e.target.value)}
                          disabled={formLoading}
                          required
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
                            value={customAlias}
                            onChange={(e) => setCustomAlias(e.target.value)}
                            disabled={formLoading}
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary btn-block" style={s.shortenBtn} disabled={formLoading}>
                        {formLoading ? 'Generating...' : 'Generate QR Code'}
                      </button>
                    </>
                  )}
                </form>

                <p style={s.disclaimer}>
                  By clicking action, you agree to our Terms of Service, Privacy Policy, and Cookie logs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Links Section */}
        <div style={s.recentLinksContainer}>
          <div style={s.listHeaderWrapper}>
            <h3 style={s.recentTitle}>Your Recent Links:</h3>
            
            {/* Search filter */}
            <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1) }} style={s.searchForm}>
              <div style={s.searchWrapper}>
                <Search size={16} style={s.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search links..." 
                  className="form-input" 
                  style={s.searchInput} 
                  value={searchInput} 
                  onChange={(e) => setSearchInput(e.target.value)} 
                />
                {search && <button type="button" onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }} style={s.clearSearchBtn}><X size={14} /></button>}
              </div>
            </form>
          </div>

          {loading ? (
            <div style={s.centerSpinner}>
              <div className="loading-spinner" style={{ width: 36, height: 36 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading links...</p>
            </div>
          ) : urls.length === 0 ? (
            <div style={s.recentAlert}>
              <Info size={16} color="var(--primary-light)" />
              <span>{search ? 'No links match your search parameters.' : 'No links yet in your history. Paste a URL above to get started.'}</span>
            </div>
          ) : (
            <div style={s.urlsGrid}>
              {urls.map((url) => (
                <div key={url._id} className="card" style={s.urlCard}>
                  <div style={s.urlCardHeader}>
                    <div style={s.urlLeft}>
                      <h4 style={s.urlShortCode}>{url.shortCode}</h4>
                      <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" style={s.urlOriginal}>
                        {url.originalUrl}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <div style={s.urlRight}>
                      <div className="badge badge-primary" style={{ gap: '0.3rem' }}>
                        <strong>{url.clicks || 0}</strong>
                        <span>clicks</span>
                      </div>
                      <div style={s.urlDate}>
                        <Calendar size={12} />
                        <span>{new Date(url.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  <div style={s.urlDivider}></div>
                  <div style={s.urlActions}>
                    <input 
                      type="text" 
                      readOnly 
                      value={url.shortUrl} 
                      style={s.cardLinkInput} 
                      onClick={(e) => e.target.select()} 
                    />
                    <div style={s.actionBtnGroup}>
                      <button className="btn btn-secondary" style={s.iconBtn} onClick={() => handleCopy(url._id, url.shortUrl)} title="Copy link">
                        {copiedId === url._id ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                      </button>
                      <button className="btn btn-secondary" style={s.iconBtn} onClick={() => { setQrModalUrl(url.shortUrl); setQrModalCode(url.shortCode) }} title="QR Code">
                        <QrCode size={14} />
                      </button>
                      <Link to={`/analytics/${url._id}`} className="btn btn-secondary" style={s.iconBtn} title="Analytics">
                        <BarChart3 size={14} />
                      </Link>
                      <button className="btn btn-danger" style={s.iconBtn} onClick={() => setDeleteConfirmId(url._id)} title="Delete permanent">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={s.pagination}>
              <button className="btn btn-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
              <span style={s.pageText}>Page {page} of {totalPages}</span>
              <button className="btn btn-secondary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </div>
      </section>

      {/* FAQs */}
      <FAQ />

      {/* Footer */}
      <Footer />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={s.confirmModal}>
            <h3 style={{ color: 'var(--danger-light)', marginBottom: '0.5rem' }}>Confirm Deletion</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete this short URL? This action cannot be undone.
            </p>
            <div style={s.confirmActions}>
              <button onClick={() => handleDelete(deleteConfirmId)} className="btn btn-danger" disabled={deleteLoading}>
                {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
              <button onClick={() => setDeleteConfirmId(null)} className="btn btn-secondary" disabled={deleteLoading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal Popup */}
      {qrModalUrl && (
        <QRModal 
          url={qrModalUrl} 
          shortCode={qrModalCode} 
          onClose={() => { setQrModalUrl(''); setQrModalCode('') }} 
        />
      )}
    </div>
  )
}

const s = {
  dashboardPage: {
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
    padding: '2.5rem 2rem',
    animation: 'slideDown 0.25s var(--ease-smooth)',
  },
  megaMenuInner: {
    maxWidth: '1440px',
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

  // Domains Mega Menu
  domainsMegaInner: {
    maxWidth: '1440px',
    margin: '0 auto',
    display: 'flex',
    gap: '4rem',
    alignItems: 'center',
    width: '100%',
    minHeight: '200px',
  },
  domainsLeft: {
    flex: '1 1 420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    textAlign: 'left',
  },
  domainsBigTitle: {
    fontSize: '2rem',
    fontWeight: 900,
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)',
    margin: 0,
  },
  domainsDesc: {
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: 'var(--text-secondary)',
    maxWidth: '420px',
    margin: 0,
  },
  domainsBtn: {
    marginTop: '0.75rem',
    display: 'inline-block',
    width: 'fit-content',
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.7rem 1.75rem',
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-primary)',
    transition: 'all var(--transition-fast)',
    fontFamily: 'inherit',
  },
  domainsRight: {
    flex: '1 1 380px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  domainSearchBox: {
    background: 'var(--bg-card)',
    border: '1.5px solid var(--border-default)',
    borderRadius: '16px',
    padding: '1.75rem',
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: 'var(--shadow-xl)',
  },
  domainSearchLabel: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
  },
  domainSearchRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  domainSearchInput: {
    flex: 1,
    padding: '0.65rem 1rem',
    background: 'var(--bg-input)',
    border: '1.5px solid var(--border-default)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    cursor: 'default',
  },
  domainSearchBtn: {
    padding: '0.65rem 1.25rem',
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '0.88rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
  },
  domainExtensions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  domainExtBadge: {
    padding: '0.3rem 0.75rem',
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    borderRadius: '6px',
    color: 'var(--primary-light)',
    fontSize: '0.82rem',
    fontWeight: 700,
    cursor: 'pointer',
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
    cursor: 'pointer',
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
    background: '#15803d',
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
  listHeaderWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  recentTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
  },
  searchForm: {
    flex: '0 1 300px',
    width: '100%',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '0.85rem',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  searchInput: {
    padding: '0.5rem 2rem 0.5rem 2.25rem',
    fontSize: '0.85rem',
    borderRadius: 8,
    width: '100%',
  },
  clearSearchBtn: {
    position: 'absolute',
    right: '0.75rem',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
  },
  centerSpinner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '3rem 0',
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
  },
  urlsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.25rem',
  },
  urlCard: {
    borderRadius: 16,
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  urlCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  urlLeft: {
    flex: 1,
    minWidth: 0,
  },
  urlShortCode: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    marginBottom: '0.2rem',
  },
  urlOriginal: {
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
  urlRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.45rem',
  },
  urlDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
  },
  urlDivider: {
    height: 1,
    background: 'var(--border-light)',
    margin: '1.25rem 0',
  },
  urlActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  cardLinkInput: {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-light)',
    color: 'var(--primary-light)',
    fontSize: '0.85rem',
    fontWeight: 600,
    padding: '0.6rem 0.75rem',
    outline: 'none',
    borderRadius: 8,
    textAlign: 'center',
  },
  actionBtnGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '0.5rem',
  },
  iconBtn: {
    flex: 1,
    padding: '0.55rem',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem',
    borderTop: '1px solid var(--border-light)',
    paddingTop: '1.5rem',
  },
  pageText: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  confirmModal: {
    textAlign: 'center',
    maxWidth: 400,
  },
  confirmActions: {
    display: 'flex',
    gap: '0.75rem',
    width: '100%',
    justifyContent: 'center',
  }
}

// Media Query Style elements
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.innerHTML = `
    .dropdown-item-hover:hover { background: var(--bg-hover) !important; }
  `
  document.head.appendChild(style)
}

export default Dashboard
