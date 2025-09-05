<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="py-10">
      <header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight text-gray-900">
            Subscriptions
          </h1>
          <p class="mt-2 text-sm text-gray-600">
            Manage user subscriptions and billing
          </p>
        </div>
      </header>

      <main>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Total Subscriptions</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.totalSubscriptions || 0 }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Active</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.activeSubscriptions || 0 }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Trial</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.trialingSubscriptions || 0 }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Canceled</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.canceledSubscriptions || 0 }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Subscriptions Table -->
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <div class="px-4 py-5 sm:p-6">
              <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                  <h2 class="text-lg font-medium text-gray-900">All Subscriptions</h2>
                  <p class="mt-2 text-sm text-gray-700">A list of all subscriptions in your account.</p>
                </div>
              </div>

              <!-- Search and Filters -->
              <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <input
                    v-model="search"
                    type="text"
                    placeholder="Search subscriptions..."
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    @input="debouncedSearch"
                  />
                </div>
                <div>
                  <select
                    v-model="statusFilter"
                    @change="loadSubscriptions"
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="trialing">Trialing</option>
                    <option value="canceled">Canceled</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="paused">Paused</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
                <div>
                  <select
                    v-model="sortOrder"
                    @change="loadSubscriptions"
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>

              <div class="mt-8 flow-root">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                      <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                          <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                              User
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Plan
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Status
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Usage
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Expires
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-for="subscription in subscriptions" :key="subscription._id">
                            <td class="px-6 py-4 whitespace-nowrap">
                              <div class="flex items-center">
                                <div>
                                  <div class="text-sm font-medium text-gray-900">
                                    {{ subscription.userEmail }}
                                  </div>
                                  <div class="text-sm text-gray-500">
                                    {{ subscription.stripe_user_id }}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <div class="text-sm text-gray-900">{{ subscription.sub_name }}</div>
                              <div class="text-sm text-gray-500">{{ subscription.stripe_plan_id }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                    :class="getStatusClass(subscription.status)">
                                {{ subscription.status }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {{ subscription.usage_count || 0 }}
                              <div class="text-sm text-gray-500">
                                Limit: {{ subscription.total_request_limit || 'Unlimited' }}
                              </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {{ formatDate(subscription.expires_in) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <select
                                :value="subscription.status"
                                @change="updateStatus(subscription._id, $event.target.value)"
                                class="text-sm border-gray-300 rounded"
                              >
                                <option value="active">Active</option>
                                <option value="trialing">Trialing</option>
                                <option value="canceled">Canceled</option>
                                <option value="unpaid">Unpaid</option>
                                <option value="paused">Paused</option>
                                <option value="ended">Ended</option>
                              </select>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div class="mt-6 flex items-center justify-between">
                <div class="text-sm text-gray-700">
                  Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalItems) }} of {{ totalItems }} results
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="goToPage(currentPage - 1)"
                    :disabled="currentPage <= 1"
                    class="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span class="px-3 py-1 text-sm">
                    Page {{ currentPage }} of {{ totalPages }}
                  </span>
                  <button
                    @click="goToPage(currentPage + 1)"
                    :disabled="currentPage >= totalPages"
                    class="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
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
import { ref, reactive, onMounted } from 'vue'
import { subscriptionsAPI } from '@/services/api'
import Navbar from '@/components/Navbar.vue'
import { debounce } from 'lodash'

// Reactive data
const subscriptions = ref([])
const stats = reactive({
  totalSubscriptions: 0,
  activeSubscriptions: 0,
  trialingSubscriptions: 0,
  canceledSubscriptions: 0
})

// Filters
const search = ref('')
const statusFilter = ref('')
const sortOrder = ref('desc')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const totalPages = ref(0)

// Loading state
const loading = ref(false)

// Debounced search
const debouncedSearch = debounce(() => {
  currentPage.value = 1
  loadSubscriptions()
}, 300)

// Methods
const loadStats = async () => {
  try {
    const response = await subscriptionsAPI.getStats()
    Object.assign(stats, response.data)
  } catch (error) {
    console.error('Error loading subscription stats:', error)
  }
}

const loadSubscriptions = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: search.value,
      status: statusFilter.value,
      sortOrder: sortOrder.value
    }

    const response = await subscriptionsAPI.getSubscriptions(params)
    subscriptions.value = response.data.subscriptions
    totalItems.value = response.data.total
    totalPages.value = response.data.totalPages
    currentPage.value = response.data.page
  } catch (error) {
    console.error('Error loading subscriptions:', error)
  } finally {
    loading.value = false
  }
}

const updateStatus = async (id, status) => {
  try {
    await subscriptionsAPI.updateSubscriptionStatus(id, status)
    await Promise.all([loadSubscriptions(), loadStats()])
  } catch (error) {
    console.error('Error updating subscription status:', error)
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadSubscriptions()
  }
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    trialing: 'bg-blue-100 text-blue-800',
    canceled: 'bg-red-100 text-red-800',
    unpaid: 'bg-yellow-100 text-yellow-800',
    paused: 'bg-gray-100 text-gray-800',
    ended: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

// Load data on mount
onMounted(() => {
  Promise.all([loadStats(), loadSubscriptions()])
})
</script>