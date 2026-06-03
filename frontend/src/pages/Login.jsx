import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { KeyRound, Mail, AlertTriangle, ArrowRight, AlertCircle } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { authService } from '../services/api'
import { jwtDecode } from 'jwt-decode'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address'
        return ''
      case 'password':
        if (!value) return 'Password is required'
        return ''
      default:
        return ''
    }
  }

  const handleBlur = (name, value) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate all fields
    const errors = {
      email: validateField('email', email),
      password: validateField('password', password),
    }
    setFieldErrors(errors)
    setTouched({ email: true, password: true })

    if (Object.values(errors).some((e) => e)) return

    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)
    try {
      const decoded = jwtDecode(credentialResponse.credential)
      const { name, email } = decoded
      const response = await authService.googleAuth(name, email)
      localStorage.setItem('token', response.token)
      // Trigger AuthContext state update so UI reflects login
      window.location.href = '/dashboard'
    } catch (err) {
      setError('Google authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.')
  }

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Enter your details to manage your short links</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                className={`form-input ${touched.email && fieldErrors.email ? 'is-invalid' : ''}`}
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (touched.email) setFieldErrors((p) => ({ ...p, email: validateField('email', e.target.value) }))
                }}
                onBlur={() => handleBlur('email', email)}
                disabled={loading}
                autoComplete="email"
              />
            </div>
            {touched.email && fieldErrors.email && (
              <span className="form-error">
                <AlertCircle size={12} />
                {fieldErrors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <KeyRound size={18} className="input-icon" />
              <input
                className={`form-input ${touched.password && fieldErrors.password ? 'is-invalid' : ''}`}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (touched.password) setFieldErrors((p) => ({ ...p, password: validateField('password', e.target.value) }))
                }}
                onBlur={() => handleBlur('password', password)}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
            {touched.password && fieldErrors.password && (
              <span className="form-error">
                <AlertCircle size={12} />
                {fieldErrors.password}
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.8rem 1.5rem' }}>
            {loading ? (
              <div className="loading-spinner" style={{ width: '18px', height: '18px' }} />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">Or</span>
          <div className="divider-line" />
        </div>

        <div className="google-login-wrapper">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create one now</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
