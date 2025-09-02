<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <router-view />
  </div>
</template>

<script setup>
import { provide } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Initialize auth store
const authStore = useAuthStore()

// Check if user is already logged in on app start
authStore.checkAuth()

// Provide theme context if needed
provide('isDarkMode', false)
</script>