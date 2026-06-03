import React from 'react'
import { Link } from 'react-router-dom'
import { Link2, Github, Twitter, Linkedin, Heart } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Footer = () => {
  const { theme, toggleTheme, currentLanguage, setLanguage, LANGUAGES } = useTheme()

  return (
    <footer style={s.footer}>
      <div style={s.container}>
        {/* Brand Column */}
        <div style={s.brandCol}>
          <Link to="/" style={s.logoLink}>
            <div style={s.logoIcon}>
              <Link2 size={18} color="#fff" />
            </div>
            <span style={s.logoText}>TinyTrack</span>
          </Link>
          <p style={s.tagline}>
            The premium open-source link shortener, custom alias engine, and analytics tracker.
          </p>
          <div style={s.socials}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={s.socialLink} aria-label="GitHub"><Github size={18} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={s.socialLink} aria-label="Twitter"><Twitter size={18} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={s.socialLink} aria-label="LinkedIn"><Linkedin size={18} /></a>
          </div>
        </div>

        {/* Links Columns */}
        <div style={s.linksCol}>
          <h4 style={s.columnHeader}>Features</h4>
          <ul style={s.list}>
            <li><span style={s.link}>Link Editor</span></li>
            <li><span style={s.link}>Link Management</span></li>
            <li><span style={s.link}>Branded Links</span></li>
            <li><span style={s.link}>Short URL Tracking</span></li>
            <li><span style={s.link}>QR Code Generator</span></li>
            <li><span style={s.link}>Short URL API</span></li>
          </ul>
        </div>

        <div style={s.linksCol}>
          <h4 style={s.columnHeader}>Resources</h4>
          <ul style={s.list}>
            <li><span style={s.link}>Blog</span></li>
            <li><span style={s.link}>For Developers</span></li>
            <li><span style={s.link}>Our Proven Process</span></li>
            <li><span style={s.link}>About Us</span></li>
          </ul>
        </div>

        <div style={s.linksCol}>
          <h4 style={s.columnHeader}>Contact Us</h4>
          <ul style={s.list}>
            <li><span style={s.link}>Help Desk</span></li>
            <li><span style={s.link}>Contact Sales</span></li>
            <li><span style={s.link}>Contact Support</span></li>
            <li><span style={s.link}>Report Abuse</span></li>
          </ul>
        </div>

        <div style={s.linksCol}>
          <h4 style={s.columnHeader}>Legal</h4>
          <ul style={s.list}>
            <li><span style={s.link}>Terms of Service</span></li>
            <li><span style={s.link}>Privacy Policy</span></li>
            <li><span style={s.link}>Cookie Policy</span></li>
            <li><span style={s.link}>Accessibility Statement</span></li>
            <li><span style={s.link}>Privacy Manager</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={s.bottomBar}>
        <div style={s.bottomInner}>
          <span>&copy; {new Date().getFullYear()} TinyTrack. All rights reserved.</span>
          <span style={s.devNote}>
            Crafted with <Heart size={12} style={s.heartIcon} /> for modern link tracking.
          </span>
        </div>
      </div>
    </footer>
  )
}

const s = {
  footer: {
    background: 'var(--bg-sidebar)',
    borderTop: '1px solid var(--border-default)',
    padding: '4rem 0 2rem',
    width: '100%',
    color: 'var(--text-secondary)',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1440px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '2.5rem',
    flexWrap: 'wrap',
    paddingBottom: '3rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
  },
  brandCol: {
    flex: '2 1 280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    background: 'var(--gradient-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-primary)',
  },
  logoText: {
    fontSize: '1.2rem',
    fontTheme: 'inherit',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)',
  },
  tagline: {
    fontSize: '0.9rem',
    lineHeight: 1.5,
    maxWidth: '300px',
  },
  socials: {
    display: 'flex',
    gap: '0.75rem',
  },
  socialLink: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'var(--bg-hover)',
    border: '1px solid var(--border-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    transition: 'all var(--transition-fast)',
  },
  linksCol: {
    flex: '1 1 120px',
  },
  columnHeader: {
    color: 'var(--text-primary)',
    fontSize: '0.88rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '1.25rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  link: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    transition: 'color var(--transition-fast)',
  },
  langCol: {
    flex: '1.5 1 200px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  langSelectorWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'var(--bg-hover)',
    border: '1px solid var(--border-default)',
    borderRadius: '8px',
    padding: '0.4rem 0.75rem',
    width: 'fit-content',
    gap: '0.5rem',
  },
  flagIcon: {
    fontSize: '1.1rem',
  },
  select: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    fontSize: '0.88rem',
    outline: 'none',
    cursor: 'pointer',
  },
  themeBtn: {
    width: 'fit-content',
    padding: '0.5rem 1rem',
  },
  bottomBar: {
    borderTop: '1px solid var(--border-light)',
    paddingTop: '1.5rem',
  },
  bottomInner: {
    maxWidth: '1440px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    flexWrap: 'wrap',
    gap: '1rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
  },
  devNote: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  heartIcon: {
    color: 'var(--danger)',
  }
}

// Hover effects
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.innerHTML = `
    footer a:hover { color: var(--primary-light) !important; }
    footer .social-link:hover { color: var(--primary-light) !important; border-color: var(--border-hover) !important; transform: translateY(-1px); }
  `
  document.head.appendChild(style)
}

export default Footer
