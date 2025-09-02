<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <Navbar />

    <!-- Content -->
    <div class="py-10">
      <header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight text-gray-900">
            Admin Dashboard
          </h1>
        </div>
      </header>

      <main>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <!-- Welcome Message -->
          <div class="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div class="px-4 py-5 sm:p-6">
              <h2 class="text-lg font-medium text-gray-900 mb-2">
                Welcome back, {{ authStore.currentAdmin?.fullName }}!
              </h2>
              <p class="text-sm text-gray-500">
                Here's what's happening with your system today.
              </p>
            </div>
          </div>

          <!-- Stats Overview -->
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <!-- Total Users -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <UsersIcon class="h-6 w-6 text-gray-400" />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Total Users
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ stats.totalUsers || '0' }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <!-- Active Subscriptions -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <CreditCardIcon class="h-6 w-6 text-gray-400" />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Active Subscriptions
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ stats.activeSubscriptions || '0' }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <!-- Failed Requests (24h) -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <ExclamationTriangleIcon class="h-6 w-6 text-red-400" />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Failed Requests (24h)
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ stats.failedRequests || '0' }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <!-- Revenue (MTD) -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <CurrencyDollarIcon class="h-6 w-6 text-green-400" />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Revenue (MTD)
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        ${{ (stats.monthlyRevenue || 0).toLocaleString() }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <!-- Recent Activities -->
            <div class="bg-white shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Recent Activities
                </h3>
                <div class="space-y-3">
                  <div v-if="loading" class="text-center py-4">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </div>
                  <div v-else-if="activities.length === 0" class="text-gray-500 text-center py-4">
                    No recent activities
                  </div>
                  <div v-else v-for="activity in activities" :key="activity.id" class="flex">
                    <div class="flex-shrink-0">
                      <div class="h-2 w-2 bg-primary-600 rounded-full mt-2"></div>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-gray-900">{{ activity.description }}</p>
                      <p class="text-xs text-gray-500">{{ formatDate(activity.timestamp) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div class="grid grid-cols-1 gap-3">
                  <router-link
                    to="/users"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <UsersIcon class="-ml-1 mr-2 h-5 w-5" />
                    Manage Users
                  </router-link>
                  
                  <router-link
                    to="/requests"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <DocumentTextIcon class="-ml-1 mr-2 h-5 w-5" />
                    View Requests
                  </router-link>
                  
                  <router-link
                    to="/credits"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <CreditCardIcon class="-ml-1 mr-2 h-5 w-5" />
                    Manage Credits
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  UsersIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'

const authStore = useAuthStore()

const stats = ref({
  totalUsers: 0,
  activeSubscriptions: 0,
  failedRequests: 0,
  monthlyRevenue: 0,
})

const activities = ref([])
const loading = ref(false)

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

const loadDashboardData = async () => {
  loading.value = true
  try {
    // Mock data for now - replace with actual API calls
    stats.value = {
      totalUsers: 1250,
      activeSubscriptions: 890,
      failedRequests: 23,
      monthlyRevenue: 45600,
    }
    
    activities.value = [
      {
        id: 1,
        description: 'New user registered: john@example.com',
        timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      },
      {
        id: 2,
        description: 'Subscription upgraded: Enterprise plan',
        timestamp: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
      },
      {
        id: 3,
        description: 'Failed API request detected',
        timestamp: new Date(Date.now() - 1000 * 60 * 300) // 5 hours ago
      }
    ]
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>