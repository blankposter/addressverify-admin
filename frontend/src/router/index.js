import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Views
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import TwoFactorSetup from '@/views/TwoFactorSetup.vue'
import Users from '@/views/Users.vue'
import Credits from '@/views/Credits.vue'
import Requests from '@/views/Requests.vue'
import Packages from '@/views/Packages.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/2fa-setup',
    name: 'TwoFactorSetup',
    component: TwoFactorSetup,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { requiresAuth: true }
  },
  {
    path: '/credits',
    name: 'Credits',
    component: Credits,
    meta: { requiresAuth: true }
  },
  {
    path: '/requests',
    name: 'Requests',
    component: Requests,
    meta: { requiresAuth: true }
  },
  {
    path: '/packages',
    name: 'Packages',
    component: Packages,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router