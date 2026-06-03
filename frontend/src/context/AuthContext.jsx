import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const userData = await authService.getMe()
          setUser(userData)
        } catch (error) {
          console.error('Failed to authenticate token:', error)
          localStorage.removeItem('token')
          setUser(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password)
      localStorage.setItem('token', data.token)
      setUser(data.user)
      return data.user
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.'
      throw new Error(message)
    }
  }

  const signup = async (name, email, password) => {
    try {
      const data = await authService.signup(name, email, password)
      localStorage.setItem('token', data.token)
      setUser(data.user)
      return data.user
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      throw new Error(message)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
