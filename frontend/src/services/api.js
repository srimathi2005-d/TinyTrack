import axios from 'axios'

// Backend API Base URL
const API_BASE_URL = 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Automatically attach Bearer token if it exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const authService = {
  signup: async (name, email, password) => {
    const response = await api.post('/api/auth/signup', { name, email, password })
    return response.data
  },
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password })
    return response.data
  },
  googleAuth: async (name, email) => {
    const response = await api.post('/api/auth/google', { name, email })
    return response.data
  },
  getMe: async () => {
    const response = await api.get('/api/auth/me')
    return response.data
  },
}

export const urlService = {
  create: async (originalUrl, customAlias) => {
    const response = await api.post('/api/urls', { originalUrl, customAlias })
    return response.data
  },
  getAll: async (params = {}) => {
    const response = await api.get('/api/urls', { params })
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/api/urls/${id}`)
    return response.data
  },
}

export const analyticsService = {
  get: async (urlId) => {
    const response = await api.get(`/api/analytics/${urlId}`)
    return response.data
  },
}

export default api
