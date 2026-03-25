import { createRouter, createWebHistory } from 'vue-router'
import { AuthService } from './api'

import Login from './views/Login.vue'
import Register from './views/Register.vue'
import DashboardUser from './views/DashboardUser.vue'
import DashboardAdmin from './views/DashboardAdmin.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard-user', name: 'DashboardUser', component: DashboardUser, meta: { requiresAuth: true, role: 'usuario' } },
  { path: '/dashboard-admin', name: 'DashboardAdmin', component: DashboardAdmin, meta: { requiresAuth: true, role: 'admin' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = AuthService.isAuthenticated()
  const user = AuthService.getUser()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' || to.name === 'Register') {
    if (isAuthenticated) {
      next(user.rol === 'admin' ? { name: 'DashboardAdmin' } : { name: 'DashboardUser' })
    } else {
      next()
    }
  } else if (to.meta.requiresAuth) {
    // Check specific role
    if (to.meta.role && user.rol !== to.meta.role) {
      next(user.rol === 'admin' ? { name: 'DashboardAdmin' } : { name: 'DashboardUser' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
