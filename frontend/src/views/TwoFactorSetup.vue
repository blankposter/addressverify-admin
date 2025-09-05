<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="py-10">
      <header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight text-gray-900">
            Two-Factor Authentication
          </h1>
          <p class="mt-2 text-sm text-gray-600">
            Secure your account with two-factor authentication
          </p>
        </div>
      </header>

      <main>
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
          <!-- 2FA Status -->
          <div class="bg-white shadow rounded-lg mb-6">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p class="mt-1 text-sm text-gray-600">
                    {{ user?.twoFactorEnabled ? 'Your account is secured with 2FA' : 'Add an extra layer of security to your account' }}
                  </p>
                </div>
                <div class="flex items-center">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="user?.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ user?.twoFactorEnabled ? 'Enabled' : 'Disabled' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Setup 2FA -->
          <div v-if="!user?.twoFactorEnabled" class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Enable Two-Factor Authentication</h3>
              
              <div v-if="!setupData.qrCode" class="space-y-4">
                <p class="text-sm text-gray-600">
                  Click the button below to generate a QR code that you can scan with your authenticator app.
                </p>
                <button
                  @click="startSetup"
                  :disabled="loading"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <span v-if="!loading">Generate QR Code</span>
                  <span v-else>Generating...</span>
                </button>
              </div>

              <div v-else class="space-y-6">
                <div class="text-center">
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Scan this QR code with your authenticator app</h4>
                  <div class="inline-block p-4 bg-white border rounded-lg">
                    <img :src="setupData.qrCode" alt="2FA QR Code" class="w-48 h-48" />
                  </div>
                </div>

                <div class="space-y-4">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Manual Setup</h4>
                    <p class="text-sm text-gray-600 mt-1">If you can't scan the QR code, enter this secret key manually:</p>
                    <div class="mt-2 p-3 bg-gray-50 rounded-md">
                      <code class="text-sm font-mono break-all">{{ setupData.secret }}</code>
                    </div>
                  </div>

                  <div>
                    <label for="verificationCode" class="block text-sm font-medium text-gray-700">
                      Verification Code
                    </label>
                    <div class="mt-1">
                      <input
                        id="verificationCode"
                        v-model="verificationCode"
                        type="text"
                        maxlength="6"
                        pattern="[0-9]{6}"
                        placeholder="Enter 6-digit code"
                        class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <p class="mt-2 text-sm text-gray-600">
                      Enter the 6-digit code from your authenticator app to verify the setup.
                    </p>
                  </div>

                  <div class="flex space-x-3">
                    <button
                      @click="verifySetup"
                      :disabled="!verificationCode || verificationCode.length !== 6 || loading"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      <span v-if="!loading">Verify & Enable 2FA</span>
                      <span v-else>Verifying...</span>
                    </button>
                    <button
                      @click="cancelSetup"
                      :disabled="loading"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <!-- Backup Codes -->
                <div v-if="setupData.backupCodes?.length" class="border-t pt-4">
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Backup Codes</h4>
                  <p class="text-sm text-gray-600 mb-3">
                    Save these backup codes in a secure place. You can use them to access your account if you lose your authenticator device.
                  </p>
                  <div class="grid grid-cols-2 gap-2">
                    <code v-for="code in setupData.backupCodes" :key="code" 
                          class="text-xs font-mono p-2 bg-gray-50 rounded text-center">
                      {{ code }}
                    </code>
                  </div>
                  <p class="text-xs text-red-600 mt-2">
                    ⚠️ These codes will only be shown once. Make sure to save them now!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Disable 2FA -->
          <div v-else class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Disable Two-Factor Authentication</h3>
              
              <div class="space-y-4">
                <p class="text-sm text-gray-600">
                  To disable 2FA, enter your current password for verification.
                </p>
                
                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div class="mt-1">
                    <input
                      id="password"
                      v-model="disablePassword"
                      type="password"
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <button
                  @click="disable2FA"
                  :disabled="!disablePassword || loading"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <span v-if="!loading">Disable 2FA</span>
                  <span v-else>Disabling...</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Error/Success Messages -->
          <div v-if="message" class="mt-4">
            <div class="rounded-md p-4"
                 :class="message.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'">
              <p class="text-sm"
                 :class="message.type === 'error' ? 'text-red-700' : 'text-green-700'">
                {{ message.text }}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import Navbar from '@/components/Navbar.vue'

const authStore = useAuthStore()
const user = ref(null)
const loading = ref(false)
const message = ref(null)

const setupData = reactive({
  qrCode: null,
  secret: null,
  backupCodes: []
})

const verificationCode = ref('')
const disablePassword = ref('')

const clearMessage = () => {
  message.value = null
}

const showMessage = (text, type = 'success') => {
  message.value = { text, type }
  setTimeout(clearMessage, 5000)
}

const loadUserProfile = async () => {
  try {
    const response = await api.get('/api/admin/auth/profile')
    user.value = response.data
  } catch (error) {
    console.error('Failed to load user profile:', error)
  }
}

const startSetup = async () => {
  try {
    loading.value = true
    clearMessage()
    
    const response = await api.post('/api/admin/auth/2fa/setup')
    
    if (response.data.success) {
      setupData.qrCode = response.data.qrCode
      setupData.secret = response.data.secret
      setupData.backupCodes = response.data.backupCodes || []
    } else {
      showMessage('Failed to generate 2FA setup data', 'error')
    }
  } catch (error) {
    console.error('Setup error:', error)
    showMessage(error.response?.data?.message || 'Failed to start 2FA setup', 'error')
  } finally {
    loading.value = false
  }
}

const verifySetup = async () => {
  try {
    loading.value = true
    clearMessage()
    
    const response = await api.post('/api/admin/auth/2fa/verify', {
      twoFactorCode: verificationCode.value
    })
    
    if (response.data.success) {
      showMessage('2FA has been successfully enabled!', 'success')
      await loadUserProfile()
      cancelSetup()
    } else {
      showMessage('Invalid verification code', 'error')
    }
  } catch (error) {
    console.error('Verify error:', error)
    showMessage(error.response?.data?.message || 'Failed to verify 2FA code', 'error')
  } finally {
    loading.value = false
  }
}

const disable2FA = async () => {
  try {
    loading.value = true
    clearMessage()
    
    const response = await api.post('/api/admin/auth/2fa/disable', {
      password: disablePassword.value
    })
    
    if (response.data.success) {
      showMessage('2FA has been disabled', 'success')
      await loadUserProfile()
      disablePassword.value = ''
    } else {
      showMessage('Failed to disable 2FA', 'error')
    }
  } catch (error) {
    console.error('Disable error:', error)
    showMessage(error.response?.data?.message || 'Failed to disable 2FA', 'error')
  } finally {
    loading.value = false
  }
}

const cancelSetup = () => {
  setupData.qrCode = null
  setupData.secret = null
  setupData.backupCodes = []
  verificationCode.value = ''
}

onMounted(() => {
  loadUserProfile()
})
</script>