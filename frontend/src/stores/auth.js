import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  // State
  const admin = ref(null)
  const token = ref(localStorage.getItem('admin_token'))
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const currentAdmin = computed(() => admin.value)

  // Actions
  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post('/api/admin/auth/login', credentials)
      
      if (response.data.requiresTwoFactor) {
        return { requiresTwoFactor: true }
      }
      
      token.value = response.data.access_token
      admin.value = response.data.admin
      localStorage.setItem('admin_token', token.value)
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await axios.post('/api/admin/auth/logout')
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      token.value = null
      admin.value = null
      localStorage.removeItem('admin_token')
      delete axios.defaults.headers.common['Authorization']
    }
  }

  const checkAuth = async () => {
    if (!token.value) return

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      const response = await axios.get('/api/admin/auth/profile')
      admin.value = response.data
    } catch (err) {
      // Token is invalid
      logout()
    }
  }

  const setup2FA = async () => {
    try {
      const response = await axios.post('/api/admin/auth/2fa/setup')
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || '2FA setup failed'
      throw err
    }
  }

  const verify2FA = async (token) => {
    try {
      const response = await axios.post('/api/admin/auth/2fa/verify', { token })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || '2FA verification failed'
      throw err
    }
  }

  const disable2FA = async (password) => {
    try {
      const response = await axios.post('/api/admin/auth/2fa/disable', { password })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || '2FA disable failed'
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    admin,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    currentAdmin,
    // Actions
    login,
    logout,
    checkAuth,
    setup2FA,
    verify2FA,
    disable2FA,
    clearError
  }
})