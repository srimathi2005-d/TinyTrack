import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, Mail, KeyRound, AlertTriangle, UserPlus, AlertCircle } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { authService } from '../services/api'
import { jwtDecode } from 'jwt-decode'

const Register = () => {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'name':
        if (!value.trim()) return 'Full name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        return ''
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address'
        return ''
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
        return ''
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== password) return 'Passwords do not match'
        return ''
      default:
        return ''
    }
  }

  const handleBlur = (fieldName, value) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }))
    setFieldErrors((prev) => ({ ...prev, [fieldName]: validateField(fieldName, value) }))
  }

  const handleFieldChange = (fieldName, value, setter) => {
    setter(value)
    if (touched[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: validateField(fieldName, value) }))
    }
  }

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return 0
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 10) score++
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return Math.min(score, 4)
  }, [password])

  const getStrengthClass = (index) => {
    if (index >= passwordStrength) return ''
    if (passwordStrength <= 1) return 'filled'
    if (passwordStrength <= 2) return 'medium'
    return 'strong'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const errors = {
      name: validateField('name', name),
      email: validateField('email', email),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
    }
    setFieldErrors(errors)
    setTouched({ name: true, email: true, password: true, confirmPassword: true })

    if (Object.values(errors).some((e) => e)) return

    setLoading(true)
    try {
      await signup(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(typeof err === 'string' ? err : (err.message || 'Registration failed'))
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
    setError('Google signup failed. Please try again.')
  }

  const fields = [
    { name: 'name', label: 'Full Name', icon: <User size={18} />, type: 'text', placeholder: 'Ravi Kumar', value: name, setter: setName, autoComplete: 'name' },
    { name: 'email', label: 'Email Address', icon: <Mail size={18} />, type: 'email', placeholder: 'ravi@example.com', value: email, setter: setEmail, autoComplete: 'email' },
    { name: 'password', label: 'Password', icon: <KeyRound size={18} />, type: 'password', placeholder: 'Min. 6 characters', value: password, setter: setPassword, autoComplete: 'new-password' },
    { name: 'confirmPassword', label: 'Confirm Password', icon: <KeyRound size={18} />, type: 'password', placeholder: 'Confirm password', value: confirmPassword, setter: setConfirmPassword, autoComplete: 'new-password' },
  ]

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Sign up to start shortening and tracking URLs</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {fields.map((field) => (
            <div className="form-group" key={field.name}>
              <label className="form-label">{field.label}</label>
              <div className="input-wrapper">
                {React.cloneElement(field.icon, { className: 'input-icon' })}
                <input
                  className={`form-input ${touched[field.name] && fieldErrors[field.name] ? 'is-invalid' : ''}`}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => handleFieldChange(field.name, e.target.value, field.setter)}
                  onBlur={() => handleBlur(field.name, field.value)}
                  disabled={loading}
                  autoComplete={field.autoComplete}
                />
              </div>
              {touched[field.name] && fieldErrors[field.name] && (
                <span className="form-error">
                  <AlertCircle size={12} />
                  {fieldErrors[field.name]}
                </span>
              )}
              {field.name === 'password' && password && (
                <div className="password-strength">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`password-strength-segment ${getStrengthClass(i)}`} />
                  ))}
                </div>
              )}
            </div>
          ))}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.8rem 1.5rem' }}>
            {loading ? (
              <div className="loading-spinner" style={{ width: '18px', height: '18px' }} />
            ) : (
              <>
                <span>Register</span>
                <UserPlus size={16} />
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
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
