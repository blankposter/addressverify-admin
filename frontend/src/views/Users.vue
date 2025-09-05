<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="py-10">
      <header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight text-gray-900">
            Users & Subscriptions
          </h1>
          <p class="mt-2 text-sm text-gray-600">
            Manage users and their subscription details
          </p>
        </div>
      </header>

      <main>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <!-- Stats Overview -->
          <div v-if="stats" class="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a6 6 0 01-6 6 6 6 0 01-6-6z" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.totalUsers }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Active Subs</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.activeSubscriptions }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Canceled</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.canceledSubscriptions }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Total Subs</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.totalSubscriptions }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                      <dd class="text-lg font-medium text-gray-900">${{ stats.totalRevenue.toFixed(2) }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Advanced Search and Filters -->
          <div class="bg-white shadow rounded-lg mb-8">
            <div class="px-4 py-5 sm:p-6">
              <div class="space-y-4">
                <!-- Basic Search -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Search Email/Stripe ID</label>
                    <input
                      v-model="searchQuery"
                      @input="debounceSearch"
                      type="text"
                      placeholder="Search by email or Stripe ID..."
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      v-model="filters.status"
                      @change="applyFilters"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Email Verified</label>
                    <select
                      v-model="filters.emailVerified"
                      @change="applyFilters"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">All</option>
                      <option value="true">Verified</option>
                      <option value="false">Unverified</option>
                    </select>
                  </div>
                </div>
                
                <!-- Advanced Filters Toggle -->
                <div class="flex items-center justify-between border-t pt-4">
                  <button
                    @click="showAdvancedFilters = !showAdvancedFilters"
                    class="text-sm text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
                  >
                    <span>{{ showAdvancedFilters ? 'Hide' : 'Show' }} Advanced Filters</span>
                    <svg class="ml-1 h-4 w-4 transform transition-transform" :class="{ 'rotate-180': showAdvancedFilters }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div class="flex items-center space-x-2">
                    <button
                      @click="clearFilters"
                      class="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Clear Filters
                    </button>
                    <button
                      @click="loadUsers"
                      class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
                
                <!-- Advanced Filters -->
                <div v-if="showAdvancedFilters" class="space-y-4 border-t pt-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Provider</label>
                      <select
                        v-model="filters.provider"
                        @change="applyFilters"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">All Providers</option>
                        <option value="google">Google</option>
                        <option value="email">Email</option>
                        <option value="github">GitHub</option>
                      </select>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Has Seen Welcome</label>
                      <select
                        v-model="filters.hasSeenWelcome"
                        @change="applyFilters"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">All</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Sort By</label>
                      <select
                        v-model="sortBy"
                        @change="applyFilters"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="createdAt">Date Created</option>
                        <option value="email">Email</option>
                        <option value="last_login">Last Login</option>
                        <option value="status">Status</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Limitation Range</label>
                      <div class="grid grid-cols-2 gap-2">
                        <input
                          v-model="filters.limitationMin"
                          @input="debounceSearch"
                          type="number"
                          placeholder="Min"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <input
                          v-model="filters.limitationMax"
                          @input="debounceSearch"
                          type="number"
                          placeholder="Max"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Budget Alert Range</label>
                      <div class="grid grid-cols-2 gap-2">
                        <input
                          v-model="filters.budgetAlertMin"
                          @input="debounceSearch"
                          type="number"
                          placeholder="Min"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <input
                          v-model="filters.budgetAlertMax"
                          @input="debounceSearch"
                          type="number"
                          placeholder="Max"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Created Date Range</label>
                      <div class="grid grid-cols-2 gap-2">
                        <input
                          v-model="filters.createdAfter"
                          @change="applyFilters"
                          type="date"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <input
                          v-model="filters.createdBefore"
                          @change="applyFilters"
                          type="date"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div class="flex items-end">
                      <div class="w-full">
                        <label class="block text-sm font-medium text-gray-700">Sort Order</label>
                        <select
                          v-model="sortOrder"
                          @change="applyFilters"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="desc">Newest First</option>
                          <option value="asc">Oldest First</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Users Table -->
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <div v-if="loading" class="px-4 py-5 sm:p-6">
              <div class="text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p class="mt-2 text-sm text-gray-500">Loading users...</p>
              </div>
            </div>

            <ul v-else-if="users.length > 0" role="list" class="divide-y divide-gray-200">
              <li v-for="user in users" :key="user._id" class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center">
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ user.email }}
                        </p>
                        <p class="text-sm text-gray-500">
                          Stripe ID: {{ user.stripe_id || 'N/A' }} • 
                          {{ user.provider }} • 
                          Joined {{ formatDate(user.createdAt) }}
                        </p>
                        <div class="mt-2 flex items-center space-x-4">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                :class="getStatusClass(user.status)">
                            {{ user.status }}
                          </span>
                          <span v-if="user.emailVerified" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                          <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Unverified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex-shrink-0 text-right">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.activeSubsCount }} active subscriptions
                    </div>
                    <div class="text-sm text-gray-500">
                      ${{ user.totalSpent.toFixed(2) }} total spent
                    </div>
                    <div class="mt-2">
                      <button
                        @click="viewUser(user)"
                        class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <div v-else class="px-4 py-5 sm:p-6">
              <p class="text-gray-500 text-center">
                {{ searchQuery ? 'No users found matching your search.' : 'No users found.' }}
              </p>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing {{ ((currentPage - 1) * pageSize) + 1 }} to {{ Math.min(currentPage * pageSize, totalUsers) }} of {{ totalUsers }} results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="goToPage(page)"
                    :class="page === currentPage ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- User Details Modal -->
    <div v-if="selectedUser" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">User Details</h3>
            <button @click="selectedUser = null" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">Basic Information</h4>
              <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Email:</span>
                  <span class="text-sm font-medium">{{ selectedUser.email }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Stripe ID:</span>
                  <span class="text-sm font-medium">{{ selectedUser.stripe_id || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Status:</span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getStatusClass(selectedUser.status)">
                    {{ selectedUser.status }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Last Login:</span>
                  <span class="text-sm font-medium">{{ formatDate(selectedUser.last_login) }}</span>
                </div>
              </div>
            </div>

            <div v-if="selectedUser.subscriptions.length > 0">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Subscriptions</h4>
              <div class="space-y-2">
                <div v-for="subscription in selectedUser.subscriptions" :key="subscription._id" 
                     class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex justify-between items-start mb-2">
                    <span class="text-sm font-medium">{{ subscription.sub_name }}</span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getStatusClass(subscription.status)">
                      {{ subscription.status }}
                    </span>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Rate Limit: {{ subscription.rate_limit }}/{{ subscription.rate_limit_period }}</div>
                    <div>Usage: {{ subscription.usage_count }}</div>
                    <div>Started: {{ formatDate(subscription.starts_in) }}</div>
                    <div>Expires: {{ formatDate(subscription.expires_in) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4 border-t">
              <button @click="selectedUser = null" 
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import Navbar from '@/components/Navbar.vue'

const authStore = useAuthStore()

const users = ref([])
const stats = ref(null)
const loading = ref(false)
const searchQuery = ref('')
const selectedUser = ref(null)
const showAdvancedFilters = ref(false)

// Filter states
const filters = ref({
  status: '',
  emailVerified: '',
  provider: '',
  hasSeenWelcome: '',
  limitationMin: '',
  limitationMax: '',
  budgetAlertMin: '',
  budgetAlertMax: '',
  createdAfter: '',
  createdBefore: ''
})

const sortBy = ref('createdAt')
const sortOrder = ref('desc')

const currentPage = ref(1)
const pageSize = ref(10)
const totalUsers = ref(0)
const totalPages = ref(0)

let searchTimeout = null

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const loadUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      search: searchQuery.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value
    }
    
    // Add active filters
    Object.keys(filters.value).forEach(key => {
      if (filters.value[key] !== '') {
        params[key] = filters.value[key]
      }
    })
    
    const response = await api.get('/api/admin/users', { params })
    
    users.value = response.data.users
    totalUsers.value = response.data.total
    totalPages.value = response.data.totalPages
  } catch (error) {
    console.error('Error loading users:', error)
    if (error.response?.status === 401) {
      authStore.logout()
    }
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await api.get('/api/admin/users/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadUsers()
  }, 500)
}

const viewUser = (user) => {
  selectedUser.value = user
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status) => {
  const statusClasses = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    suspended: 'bg-red-100 text-red-800',
    canceled: 'bg-red-100 text-red-800',
    trialing: 'bg-blue-100 text-blue-800',
    unpaid: 'bg-yellow-100 text-yellow-800',
    paused: 'bg-gray-100 text-gray-800',
    ended: 'bg-gray-100 text-gray-800',
    incomplete: 'bg-yellow-100 text-yellow-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadUsers()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadUsers()
  }
}

const goToPage = (page) => {
  currentPage.value = page
  loadUsers()
}

const applyFilters = () => {
  currentPage.value = 1
  loadUsers()
}

const clearFilters = () => {
  searchQuery.value = ''
  Object.keys(filters.value).forEach(key => {
    filters.value[key] = ''
  })
  sortBy.value = 'createdAt'
  sortOrder.value = 'desc'
  currentPage.value = 1
  loadUsers()
}

onMounted(() => {
  loadUsers()
  loadStats()
})
</script>