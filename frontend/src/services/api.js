import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('admin_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/admin/auth/login', credentials),
  logout: () => api.post('/admin/auth/logout'),
  getProfile: () => api.get('/admin/auth/profile'),
  setup2FA: () => api.post('/admin/auth/2fa/setup'),
  verify2FA: (token) => api.post('/admin/auth/2fa/verify', { token }),
  disable2FA: (password) => api.post('/admin/auth/2fa/disable', { password }),
}

export const usersAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getUserSubscriptions: (userId) => api.get(`/admin/users/${userId}/subscriptions`),
}

export const creditsAPI = {
  getUserCredits: (userId) => api.get(`/admin/users/${userId}/credits`),
  addCredits: (userId, amount) => api.post(`/admin/users/${userId}/credits`, { amount }),
  removeCredits: (userId, amount) => api.delete(`/admin/users/${userId}/credits`, { data: { amount } }),
  getCreditHistory: (userId) => api.get(`/admin/users/${userId}/credit-history`),
}

export const requestsAPI = {
  getRequests: (params) => api.get('/admin/requests', { params }),
  getFailedRequests: (params) => api.get('/admin/requests/failed', { params }),
  getRequestStats: () => api.get('/admin/requests/stats'),
}

export const packagesAPI = {
  getPackages: () => api.get('/admin/packages'),
  createPackage: (data) => api.post('/admin/packages', data),
  updatePackage: (id, data) => api.put(`/admin/packages/${id}`, data),
  deletePackage: (id) => api.delete(`/admin/packages/${id}`),
}

export default api