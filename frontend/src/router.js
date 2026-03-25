import { createRouter, createWebHistory } from 'vue-router'
import { AuthService } from './api'
import Swal from 'sweetalert2'

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
  const user = AuthService.getUser() || {}

  const alertAccessDenied = (msg) => {
      Swal.fire({
          title: 'Acceso Denegado',
          text: msg,
          icon: 'error',
          background: '#161224',
          color: '#f8f8f8',
          confirmButtonColor: '#d4af37'
      })
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    alertAccessDenied('Debes iniciar sesión para entrar a este portal.')
    next({ name: 'Login' })
  } else if (to.name === 'Login' || to.name === 'Register') {
    if (isAuthenticated && user.rol) {
      next(user.rol === 'admin' ? { name: 'DashboardAdmin' } : { name: 'DashboardUser' })
    } else {
      next()
    }
  } else if (to.meta.requiresAuth) {
    if (to.meta.role && user.rol !== to.meta.role) {
      alertAccessDenied('Tus energías no tienen permisos para estar aquí.')
      next(user.rol === 'admin' ? { name: 'DashboardAdmin' } : { name: 'DashboardUser' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
