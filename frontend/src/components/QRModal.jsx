import React, { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { X, Copy, Check, Download, ExternalLink } from 'lucide-react'

const QRModal = ({ url, shortCode, onClose }) => {
  const canvasRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 220,
          margin: 2,
          color: {
            dark: '#0f172a', // deep dark blue/slate inside QR code
            light: '#ffffff', // pure white background
          },
          errorCorrectionLevel: 'H'
        },
        (err) => {
          if (err) {
            console.error('QR Code generation error:', err)
            setError('Could not generate QR Code')
          }
        }
      )
    }
  }, [url])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const handleDownload = () => {
    if (!canvasRef.current) return
    
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `tinytrack-qr-${shortCode}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={styles.modal}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <h3 style={styles.title}>QR Code & Actions</h3>
        <p style={styles.subtitle}>Short link generated successfully!</p>

        {/* QR Code Canvas */}
        <div style={styles.qrContainer}>
          {error ? (
            <p style={{ color: '#ef4444' }}>{error}</p>
          ) : (
            <div style={styles.canvasFrame}>
              <canvas ref={canvasRef} style={styles.canvas}></canvas>
            </div>
          )}
        </div>

        {/* Short Link Display & Copy */}
        <div style={styles.linkContainer}>
          <input 
            type="text" 
            readOnly 
            value={url} 
            style={styles.linkInput} 
            onClick={(e) => e.target.select()}
          />
          <button 
            onClick={handleCopy} 
            className="btn btn-secondary" 
            style={styles.copyBtn}
            title="Copy URL"
          >
            {copied ? <Check size={16} style={{ color: '#10b981' }} /> : <Copy size={16} />}
          </button>
        </div>

        {/* Buttons */}
        <div style={styles.actionButtons}>
          <button onClick={handleDownload} className="btn btn-primary" style={styles.actionBtn}>
            <Download size={16} />
            <span>Download QR</span>
          </button>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary" 
            style={{ ...styles.actionBtn, textDecoration: 'none' }}
          >
            <ExternalLink size={16} />
            <span>Visit Link</span>
          </a>
        </div>
      </div>
    </div>
  )
}

const styles = {
  modal: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    color: 'var(--text-primary)',
    fontSize: '1.25rem',
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    marginBottom: '1.5rem',
  },
  qrContainer: {
    background: '#ffffff',
    padding: '0.75rem',
    borderRadius: '14px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  canvasFrame: {
    display: 'flex',
    padding: '4px',
  },
  canvas: {
    display: 'block',
    borderRadius: '8px',
  },
  linkContainer: {
    display: 'flex',
    width: '100%',
    gap: '0.5rem',
    marginBottom: '1.25rem',
  },
  linkInput: {
    flex: 1,
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    border: '1.5px solid var(--border-default)',
    background: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    textAlign: 'center',
  },
  copyBtn: {
    padding: '0.65rem 0.75rem',
    borderRadius: '8px',
  },
  actionButtons: {
    display: 'flex',
    width: '100%',
    gap: '0.75rem',
  },
  actionBtn: {
    flex: 1,
    padding: '0.7rem 1rem',
    fontSize: '0.9rem',
    gap: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}

export default QRModal
