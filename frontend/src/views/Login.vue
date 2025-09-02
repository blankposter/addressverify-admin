<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Panel Login
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          AddressVerify Administrative Access
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Username or Email</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              v-model="form.username"
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Username or Email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              v-model="form.password"
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              :class="{ 'rounded-b-md': !showTwoFactor }"
              placeholder="Password"
            />
          </div>
          
          <!-- Two Factor Code Input -->
          <div v-if="showTwoFactor">
            <label for="twoFactorCode" class="sr-only">Two Factor Code</label>
            <input
              id="twoFactorCode"
              name="twoFactorCode"
              type="text"
              required
              v-model="form.twoFactorCode"
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="2FA Code (6 digits)"
              maxlength="6"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="authStore.error" class="text-red-600 text-sm text-center">
          {{ authStore.error }}
        </div>

        <!-- Two Factor Message -->
        <div v-if="showTwoFactor && !authStore.error" class="text-blue-600 text-sm text-center">
          Enter the 6-digit code from your authenticator app
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockClosedIcon class="h-5 w-5 text-primary-500 group-hover:text-primary-400" />
            </span>
            <span v-if="!authStore.loading">
              {{ showTwoFactor ? 'Verify & Login' : 'Sign In' }}
            </span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { LockClosedIcon } from '@heroicons/vue/20/solid'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showTwoFactor = ref(false)

const form = reactive({
  username: '',
  password: '',
  twoFactorCode: ''
})

const handleLogin = async () => {
  try {
    authStore.clearError()
    
    const result = await authStore.login({
      username: form.username,
      password: form.password,
      twoFactorCode: form.twoFactorCode || undefined
    })

    if (result.requiresTwoFactor) {
      showTwoFactor.value = true
      return
    }

    if (result.success) {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}
</script>