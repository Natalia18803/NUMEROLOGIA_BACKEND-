import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import Dashboard from '../views/user/Dashboard.vue'
import { useAuthStore } from '../store/auth'

// Placeholder components
// ... (if any other placeholders exist)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/crear-cuenta',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/lectura/:id',
    name: 'LecturaDetalle',
    component: () => import('../views/user/LecturaDetalle.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  console.log('Router BeforeEach -> Navigating to:', to.path, '| current token:', authStore.token)

  // 1. Si la ruta requiere autenticación y NO hay token, forzar a /login
  if (to.meta.requiresAuth && !authStore.token) {
    console.log('Blocked: requiresAuth but no token. Redirecting to /login')
    return next('/login')
  } 
  
  // 2. Si HAY token y está yendo a rutas protegidas, validamos por rol
  if (to.meta.requiresAuth && authStore.token && authStore.usuario) {
    const userRole = authStore.usuario.rol;

    if (to.path.startsWith('/admin') && userRole !== 'admin') {
      // Un usuario normal intenta entrar a /admin
      console.log('Blocked: User trying to access /admin. Redirecting to /dashboard')
      return next('/dashboard')
    }

    if (to.path.startsWith('/dashboard') && userRole === 'admin') {
      // Un admin intenta entrar a /dashboard (zona de usuarios)
      console.log('Blocked: Admin trying to access /dashboard. Redirecting to /admin')
      return next('/admin')
    }
  }

  // 3. Si un usuario ya logueado intenta ir al login, redirigirlo a su respectivo inicio
  if (authStore.token && (to.path === '/login' || to.path === '/' || to.path === '/crear-cuenta')) {
      if (authStore.usuario?.rol === 'admin') {
          return next('/admin')
      } else {
          return next('/dashboard')
      }
  }

  console.log('Allowed: next()')
  next()
})

export default router
