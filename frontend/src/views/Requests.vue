<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="py-10">
      <header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight text-gray-900">
            Request Monitoring
          </h1>
          <p class="mt-2 text-sm text-gray-600">
            Monitor API requests and analyze service failures
          </p>
        </div>
      </header>

      <main>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <!-- Stats Overview -->
          <div v-if="stats" class="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Total Requests</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.totalRequests.toLocaleString() }}</dd>
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
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Failed Requests</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.failedRequests.toLocaleString() }}</dd>
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
                      <dt class="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.successRate }}%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Avg Response</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.averageResponseTime }}ms</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Distribution -->
          <div v-if="stats && stats.requestsByStatus" class="bg-white shadow rounded-lg mb-8">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Request Status Distribution</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="(count, status) in stats.requestsByStatus" :key="status" 
                     class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-gray-900">{{ count.toLocaleString() }}</div>
                  <div class="text-sm text-gray-500">{{ status }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Filters and Controls -->
          <div class="bg-white shadow rounded-lg mb-8">
            <div class="px-4 py-5 sm:p-6">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">View</label>
                  <select
                    v-model="viewMode"
                    @change="loadRequests"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="failed">Failed Requests Only</option>
                    <option value="all">All Requests</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Status Code</label>
                  <select
                    v-model="filterStatusCode"
                    @change="loadRequests"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">All Status Codes</option>
                    <option value="400">400 Bad Request</option>
                    <option value="401">401 Unauthorized</option>
                    <option value="403">403 Forbidden</option>
                    <option value="404">404 Not Found</option>
                    <option value="429">429 Too Many Requests</option>
                    <option value="500">500 Internal Error</option>
                    <option value="502">502 Bad Gateway</option>
                    <option value="503">503 Service Unavailable</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Endpoint</label>
                  <input
                    v-model="filterEndpoint"
                    @input="debounceSearch"
                    type="text"
                    placeholder="Filter by endpoint..."
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">User ID</label>
                  <input
                    v-model="filterUserId"
                    @input="debounceSearch"
                    type="text"
                    placeholder="Filter by user ID..."
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Requests Table -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    {{ viewMode === 'failed' ? 'Failed Requests' : 'All Requests' }}
                  </h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    {{ viewMode === 'failed' ? 'Requests with 4xx or 5xx status codes' : 'Complete request history' }}
                  </p>
                </div>
              </div>

              <div v-if="loading" class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p class="mt-2 text-sm text-gray-500">Loading requests...</p>
              </div>

              <div v-else-if="requests.length === 0" class="text-center py-8">
                <p class="text-gray-500">No requests found matching your criteria.</p>
              </div>

              <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="request in requests" :key="request._id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              :class="getStatusClass(request.status_code)">
                          {{ request.status_code }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">{{ request.endpoint }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">{{ request.userEmail || 'Unknown' }}</div>
                        <div class="text-sm text-gray-500">{{ request.user_id.substring(0, 8) }}...</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ request.response_time }}ms
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ request.ip }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ formatDate(request.date) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          @click="viewRequestDetails(request)"
                          class="text-indigo-600 hover:text-indigo-900"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                <div class="flex flex-1 justify-between sm:hidden">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p class="text-sm text-gray-700">
                      Showing {{ ((currentPage - 1) * pageSize) + 1 }} to {{ Math.min(currentPage * pageSize, totalRequests) }} of {{ totalRequests }} results
                    </p>
                  </div>
                  <div>
                    <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm">
                      <button
                        @click="previousPage"
                        :disabled="currentPage === 1"
                        class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        v-for="page in visiblePages"
                        :key="page"
                        @click="goToPage(page)"
                        :class="page === currentPage ? 'bg-indigo-600 text-white' : 'text-gray-900 bg-white hover:bg-gray-50'"
                        class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300"
                      >
                        {{ page }}
                      </button>
                      <button
                        @click="nextPage"
                        :disabled="currentPage === totalPages"
                        class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Request Details Modal -->
    <div v-if="selectedRequest" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Request Details</h3>
            <button @click="selectedRequest = null" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-2">Request Info</h4>
                <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Status:</span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getStatusClass(selectedRequest.status_code)">
                      {{ selectedRequest.status_code }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Endpoint:</span>
                    <span class="text-sm font-medium">{{ selectedRequest.endpoint }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Response Time:</span>
                    <span class="text-sm font-medium">{{ selectedRequest.response_time }}ms</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Cost:</span>
                    <span class="text-sm font-medium">${{ (selectedRequest.cost || 0).toFixed(4) }}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-2">User Info</h4>
                <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Email:</span>
                    <span class="text-sm font-medium">{{ selectedRequest.userEmail || 'Unknown' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">User ID:</span>
                    <span class="text-sm font-medium">{{ selectedRequest.user_id }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">IP Address:</span>
                    <span class="text-sm font-medium">{{ selectedRequest.ip }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Date:</span>
                    <span class="text-sm font-medium">{{ formatDate(selectedRequest.date) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selectedRequest.input_data">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Input Data</h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ formatJson(selectedRequest.input_data) }}</pre>
              </div>
            </div>

            <div v-if="selectedRequest.response_data">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Response Data</h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ formatJson(selectedRequest.response_data) }}</pre>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4 border-t">
              <button @click="selectedRequest = null" 
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

const stats = ref(null)
const requests = ref([])
const loading = ref(false)
const selectedRequest = ref(null)

const viewMode = ref('failed')
const filterStatusCode = ref('')
const filterEndpoint = ref('')
const filterUserId = ref('')

const currentPage = ref(1)
const pageSize = ref(10)
const totalRequests = ref(0)
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

const loadStats = async () => {
  try {
    const response = await api.get('/api/admin/requests/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const loadRequests = async () => {
  loading.value = true
  try {
    const endpoint = viewMode.value === 'failed' ? '/api/admin/requests/failed' : '/api/admin/requests/all'
    const response = await api.get(endpoint, {
      params: {
        page: currentPage.value,
        limit: pageSize.value,
        statusCode: filterStatusCode.value,
        endpoint: filterEndpoint.value,
        userId: filterUserId.value
      }
    })
    
    requests.value = response.data.requests
    totalRequests.value = response.data.total
    totalPages.value = response.data.totalPages
  } catch (error) {
    console.error('Error loading requests:', error)
    if (error.response?.status === 401) {
      authStore.logout()
    }
  } finally {
    loading.value = false
  }
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadRequests()
  }, 500)
}

const viewRequestDetails = (request) => {
  selectedRequest.value = request
}

const getStatusClass = (statusCode) => {
  if (statusCode >= 200 && statusCode < 300) return 'bg-green-100 text-green-800'
  if (statusCode >= 300 && statusCode < 400) return 'bg-blue-100 text-blue-800'
  if (statusCode >= 400 && statusCode < 500) return 'bg-yellow-100 text-yellow-800'
  if (statusCode >= 500) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatJson = (jsonString) => {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2)
  } catch {
    return jsonString
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadRequests()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadRequests()
  }
}

const goToPage = (page) => {
  currentPage.value = page
  loadRequests()
}

onMounted(() => {
  loadStats()
  loadRequests()
})
</script>