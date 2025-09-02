<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="py-10">
      <header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 class="text-3xl font-bold leading-tight text-gray-900">
                Enterprise Packages
              </h1>
              <p class="mt-2 text-sm text-gray-600">
                Create and manage enterprise packages for customers
              </p>
            </div>
            <div class="mt-4 sm:mt-0">
              <button
                @click="showCreateModal = true"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                New Package
              </button>
            </div>
          </div>
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
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Total Packages</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.totalPackages }}</dd>
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
                      <dt class="text-sm font-medium text-gray-500 truncate">Active</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.activePackages }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Drafts</dt>
                      <dd class="text-lg font-medium text-gray-900">{{ stats.draftPackages }}</dd>
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
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Monthly Value</dt>
                      <dd class="text-lg font-medium text-gray-900">${{ stats.totalMonthlyValue.toLocaleString() }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="bg-white shadow rounded-lg mb-8">
            <div class="px-4 py-5 sm:p-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    v-model="filterStatus"
                    @change="loadPackages"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    v-model="filterType"
                    @change="loadPackages"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div class="flex items-end">
                  <button
                    @click="loadPackages"
                    class="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Packages Grid -->
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p class="mt-2 text-sm text-gray-500">Loading packages...</p>
          </div>

          <div v-else-if="packages.length === 0" class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <p class="text-gray-500 text-center py-8">No packages found.</p>
            </div>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="package in packages" :key="package._id" 
                 class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
              <div class="px-4 py-5 sm:p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-medium text-gray-900">{{ package.name }}</h3>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getStatusClass(package.status)">
                    {{ package.status }}
                  </span>
                </div>
                
                <p class="text-sm text-gray-500 mb-4">{{ package.description }}</p>
                
                <div class="space-y-2 mb-4">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Type:</span>
                    <span class="text-sm font-medium capitalize">{{ package.type }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Monthly:</span>
                    <span class="text-sm font-medium">${{ package.monthlyPrice.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Yearly:</span>
                    <span class="text-sm font-medium">${{ package.yearlyPrice.toLocaleString() }}</span>
                  </div>
                  <div v-if="package.isCustom" class="flex justify-between">
                    <span class="text-sm text-gray-600">Customer:</span>
                    <span class="text-sm font-medium">{{ package.customerEmail || 'N/A' }}</span>
                  </div>
                </div>

                <div class="flex justify-between items-center pt-4 border-t">
                  <div class="flex space-x-2">
                    <button
                      @click="viewPackage(package)"
                      class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      View
                    </button>
                    <button
                      @click="editPackage(package)"
                      class="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      @click="duplicatePackage(package._id)"
                      class="text-green-600 hover:text-green-900 text-sm font-medium"
                    >
                      Duplicate
                    </button>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      v-if="package.status !== 'active'"
                      @click="updateStatus(package._id, 'active')"
                      class="text-green-600 hover:text-green-900 text-sm font-medium"
                    >
                      Activate
                    </button>
                    <button
                      v-if="package.status === 'active'"
                      @click="updateStatus(package._id, 'inactive')"
                      class="text-yellow-600 hover:text-yellow-900 text-sm font-medium"
                    >
                      Deactivate
                    </button>
                    <button
                      @click="deletePackage(package._id)"
                      class="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center mt-8">
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
      </main>
    </div>

    <!-- Create/Edit Package Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <form @submit.prevent="showCreateModal ? createPackage() : updatePackage()">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ showCreateModal ? 'Create New Package' : 'Edit Package' }}
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Package Name</label>
                <input
                  v-model="packageForm.name"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Type</label>
                <select
                  v-model="packageForm.type"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Monthly Price ($)</label>
                <input
                  v-model.number="packageForm.monthlyPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Yearly Price ($)</label>
                <input
                  v-model.number="packageForm.yearlyPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  v-model="packageForm.description"
                  rows="3"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="closeModals"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="processing"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ processing ? 'Processing...' : (showCreateModal ? 'Create Package' : 'Update Package') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- View Package Modal -->
    <div v-if="selectedPackage" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Package Details</h3>
            <button @click="selectedPackage = null" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">Basic Information</h4>
              <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Name:</span>
                  <span class="text-sm font-medium">{{ selectedPackage.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Type:</span>
                  <span class="text-sm font-medium capitalize">{{ selectedPackage.type }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Status:</span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getStatusClass(selectedPackage.status)">
                    {{ selectedPackage.status }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Created:</span>
                  <span class="text-sm font-medium">{{ formatDate(selectedPackage.createdAt) }}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">Pricing</h4>
              <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Monthly:</span>
                  <span class="text-sm font-medium">${{ selectedPackage.monthlyPrice.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Yearly:</span>
                  <span class="text-sm font-medium">${{ selectedPackage.yearlyPrice.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Setup Fee:</span>
                  <span class="text-sm font-medium">${{ (selectedPackage.setupFee || 0).toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Yearly Savings:</span>
                  <span class="text-sm font-medium text-green-600">
                    ${{ ((selectedPackage.monthlyPrice * 12) - selectedPackage.yearlyPrice).toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedPackage.description" class="mt-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Description</h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-800">{{ selectedPackage.description }}</p>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button @click="selectedPackage = null" 
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Close
            </button>
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
const packages = ref([])
const loading = ref(false)
const processing = ref(false)
const selectedPackage = ref(null)

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingPackageId = ref(null)

const filterStatus = ref('')
const filterType = ref('')

const currentPage = ref(1)
const pageSize = ref(9) // 3x3 grid
const totalPackages = ref(0)
const totalPages = ref(0)

const packageForm = ref({
  name: '',
  description: '',
  type: 'standard',
  monthlyPrice: 0,
  yearlyPrice: 0,
  features: {
    apiCalls: 1000,
    rateLimit: 100,
    rateLimitPeriod: '1m',
    bulkProcessing: false,
    prioritySupport: false,
    dedicatedAccount: false,
    customIntegration: false,
    whitelabeling: false,
    analytics: false
  },
  includedServices: [],
  setupFee: 0,
  notes: ''
})

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
    const response = await api.get('/api/admin/packages/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const loadPackages = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/admin/packages', {
      params: {
        page: currentPage.value,
        limit: pageSize.value,
        status: filterStatus.value,
        type: filterType.value
      }
    })
    
    packages.value = response.data.packages
    totalPackages.value = response.data.total
    totalPages.value = response.data.totalPages
  } catch (error) {
    console.error('Error loading packages:', error)
    if (error.response?.status === 401) {
      authStore.logout()
    }
  } finally {
    loading.value = false
  }
}

const createPackage = async () => {
  processing.value = true
  try {
    const response = await api.post('/api/admin/packages', packageForm.value)
    if (response.data.success) {
      closeModals()
      loadStats()
      loadPackages()
      alert('Package created successfully!')
    } else {
      alert('Error: ' + response.data.error)
    }
  } catch (error) {
    console.error('Error creating package:', error)
    alert('Error creating package')
  } finally {
    processing.value = false
  }
}

const updatePackage = async () => {
  processing.value = true
  try {
    const response = await api.put(`/api/admin/packages/${editingPackageId.value}`, packageForm.value)
    if (response.data.success) {
      closeModals()
      loadStats()
      loadPackages()
      alert('Package updated successfully!')
    } else {
      alert('Error: ' + response.data.error)
    }
  } catch (error) {
    console.error('Error updating package:', error)
    alert('Error updating package')
  } finally {
    processing.value = false
  }
}

const viewPackage = (pkg) => {
  selectedPackage.value = pkg
}

const editPackage = (pkg) => {
  packageForm.value = {
    name: pkg.name,
    description: pkg.description,
    type: pkg.type,
    monthlyPrice: pkg.monthlyPrice,
    yearlyPrice: pkg.yearlyPrice,
    features: pkg.features,
    includedServices: pkg.includedServices || [],
    setupFee: pkg.setupFee || 0,
    notes: pkg.notes || ''
  }
  editingPackageId.value = pkg._id
  showEditModal.value = true
}

const duplicatePackage = async (packageId) => {
  if (confirm('Are you sure you want to duplicate this package?')) {
    try {
      const response = await api.post(`/api/admin/packages/${packageId}/duplicate`)
      if (response.data.success) {
        loadStats()
        loadPackages()
        alert('Package duplicated successfully!')
      } else {
        alert('Error: ' + response.data.error)
      }
    } catch (error) {
      console.error('Error duplicating package:', error)
      alert('Error duplicating package')
    }
  }
}

const updateStatus = async (packageId, status) => {
  try {
    const response = await api.put(`/api/admin/packages/${packageId}/status`, { status })
    if (response.data.success) {
      loadStats()
      loadPackages()
      alert(`Package ${status === 'active' ? 'activated' : 'deactivated'} successfully!`)
    } else {
      alert('Error: ' + response.data.error)
    }
  } catch (error) {
    console.error('Error updating status:', error)
    alert('Error updating package status')
  }
}

const deletePackage = async (packageId) => {
  if (confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
    try {
      const response = await api.delete(`/api/admin/packages/${packageId}`)
      if (response.data.success) {
        loadStats()
        loadPackages()
        alert('Package deleted successfully!')
      } else {
        alert('Error: ' + response.data.error)
      }
    } catch (error) {
      console.error('Error deleting package:', error)
      alert('Error deleting package')
    }
  }
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingPackageId.value = null
  packageForm.value = {
    name: '',
    description: '',
    type: 'standard',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: {
      apiCalls: 1000,
      rateLimit: 100,
      rateLimitPeriod: '1m',
      bulkProcessing: false,
      prioritySupport: false,
      dedicatedAccount: false,
      customIntegration: false,
      whitelabeling: false,
      analytics: false
    },
    includedServices: [],
    setupFee: 0,
    notes: ''
  }
}

const getStatusClass = (status) => {
  const statusClasses = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    draft: 'bg-yellow-100 text-yellow-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadPackages()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadPackages()
  }
}

const goToPage = (page) => {
  currentPage.value = page
  loadPackages()
}

onMounted(() => {
  loadStats()
  loadPackages()
})
</script>