import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: '/',
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
  login: (credentials) => api.post('/api/admin/auth/login', credentials),
  logout: () => api.post('/api/admin/auth/logout'),
  getProfile: () => api.get('/api/admin/auth/profile'),
  setup2FA: () => api.post('/api/admin/auth/2fa/setup'),
  verify2FA: (token) => api.post('/api/admin/auth/2fa/verify', { token }),
  disable2FA: (password) => api.post('/api/admin/auth/2fa/disable', { password }),
}

export const usersAPI = {
  getUsers: (params) => api.get('/api/admin/users', { params }),
  getUser: (id) => api.get(`/api/admin/users/${id}`),
  updateUserStatus: (id, status) => api.put(`/api/admin/users/${id}/status`, { status }),
  updateUserLimitation: (id, limitation) => api.put(`/api/admin/users/${id}/limitation`, { limitation }),
  getStats: () => api.get('/api/admin/users/stats'),
}

export const requestsAPI = {
  getAllRequests: (params) => api.get('/api/admin/requests/all', { params }),
  getFailedRequests: (params) => api.get('/api/admin/requests/failed', { params }),
  getRequestStats: () => api.get('/api/admin/requests/stats'),
  getRequestsByEndpoint: () => api.get('/api/admin/requests/by-endpoint'),
  getErrorsTimeline: (hours) => api.get('/api/admin/requests/errors-timeline', { params: { hours } }),
}

export const subscriptionsAPI = {
  getSubscriptions: (params) => api.get('/api/admin/subscriptions', { params }),
  getSubscription: (id) => api.get(`/api/admin/subscriptions/${id}`),
  updateSubscriptionStatus: (id, status) => api.put(`/api/admin/subscriptions/${id}/status`, { status }),
  getStats: () => api.get('/api/admin/subscriptions/stats'),
  getExpiringSubscriptions: (days) => api.get('/api/admin/subscriptions/expiring', { params: { days } }),
  getSubscriptionsByUser: (userId) => api.get(`/api/admin/subscriptions/user/${userId}`),
}

export default api