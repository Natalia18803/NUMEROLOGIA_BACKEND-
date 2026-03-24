<template>
  <div class="row no-wrap full-height bg-dark admin-wrapper">
    <!-- Sidebar -->
    <div class="admin-sidebar column shadow-up-4 border-right">
      <div class="q-pa-lg text-center">
        <q-icon name="admin_panel_settings" size="48px" color="primary" />
        <div class="text-h6 text-weight-bold text-white q-mt-sm">Admin Panel</div>
      </div>
      
      <q-list dark padding class="col" style="overflow-y: auto;">
        <q-item clickable v-ripple :active="currentView === 'Dashboard'" active-class="active-menu-item" @click="currentView = 'Dashboard'">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <q-item clickable v-ripple :active="currentView === 'Usuarios'" active-class="active-menu-item" @click="currentView = 'Usuarios'">
          <q-item-section avatar><q-icon name="group" /></q-item-section>
          <q-item-section>Usuarios</q-item-section>
        </q-item>
        <q-item clickable v-ripple :active="currentView === 'Lecturas'" active-class="active-menu-item" @click="currentView = 'Lecturas'">
          <q-item-section avatar><q-icon name="menu_book" /></q-item-section>
          <q-item-section>Lecturas</q-item-section>
        </q-item>
        <q-item clickable v-ripple :active="currentView === 'Pagos'" active-class="active-menu-item" @click="currentView = 'Pagos'">
          <q-item-section avatar><q-icon name="payments" /></q-item-section>
          <q-item-section>Pagos</q-item-section>
        </q-item>
        <q-item clickable v-ripple :active="currentView === 'Soporte'" active-class="active-menu-item" @click="currentView = 'Soporte'">
          <q-item-section avatar><q-icon name="support_agent" /></q-item-section>
          <q-item-section>Soporte</q-item-section>
        </q-item>
        <q-item clickable v-ripple :active="currentView === 'Ajustes'" active-class="active-menu-item" @click="currentView = 'Ajustes'">
          <q-item-section avatar><q-icon name="settings" /></q-item-section>
          <q-item-section>Ajustes</q-item-section>
        </q-item>
      </q-list>

      <div class="q-pa-md">
        <q-separator dark class="q-mb-md" />
        <q-btn flat no-caps color="negative" class="full-width" icon="logout" label="Cerrar Sesión" @click="logout" />
      </div>
    </div>

    <!-- Main Area -->
    <div class="col admin-main-area">
      <!-- Dynamic View Component -->
      <component :is="activeComponent" v-if="currentView !== 'Dashboard'" />
      
      <!-- Original Dashboard Content -->
      <q-page class="admin-page q-pa-lg" v-else>
        <!-- Header -->
        <div class="row items-start justify-between q-mb-xl">
          <div>
            <div class="text-h5 text-weight-bold text-white">Dashboard Principal</div>
            <div class="text-caption text-grey-6 text-uppercase letter-spacing">Vista General del Sistema</div>
          </div>
          <div class="row items-center q-gutter-sm">
            <div class="estado-astral q-pa-sm q-px-md">
              <div class="text-caption text-grey-6 text-uppercase" style="font-size:9px">Estado Astral</div>
              <div class="text-warning text-caption text-weight-bold">MERCURIO DIRECTO</div>
            </div>
            <q-btn flat round icon="notifications" color="grey-5">
              <q-badge color="primary" floating>3</q-badge>
            </q-btn>
          </div>
        </div>

        <!-- KPI Cards -->
        <div class="kpi-grid q-mb-xl">
          <div v-for="kpi in kpis" :key="kpi.label" class="kpi-card q-pa-lg">
            <div class="row items-start justify-between q-mb-md">
              <q-icon :name="kpi.icon" size="28px" :color="kpi.color" />
              <q-badge :color="kpi.badgeColor" :label="kpi.badge" />
            </div>
            <div class="text-grey-6 text-caption text-uppercase letter-spacing q-mb-xs">{{ kpi.label }}</div>
            <div class="text-h5 text-weight-bold text-white">{{ kpi.value }}</div>
          </div>
        </div>

        <!-- Gráfico de crecimiento -->
        <div class="chart-card q-pa-lg q-mb-xl">
          <div class="row items-center justify-between q-mb-lg">
            <div>
              <div class="text-h6 text-weight-bold text-white">Crecimiento de Plataforma</div>
              <div class="text-caption text-grey-6">Usuarios y Ventas en los últimos 30 días</div>
            </div>
            <div class="row items-center q-gutter-md">
              <div class="row items-center q-gutter-xs">
                <div class="legend-dot bg-primary"></div>
                <span class="text-caption text-grey-5">Usuarios</span>
              </div>
              <div class="row items-center q-gutter-xs">
                <div class="legend-dot" style="background:#A29BFE"></div>
                <span class="text-caption text-grey-5">Ventas</span>
              </div>
            </div>
          </div>
          <!-- Chart simulado con SVG -->
          <div class="chart-area">
            <svg viewBox="0 0 600 120" preserveAspectRatio="none" class="full-width" style="height:120px">
              <!-- Grid lines -->
              <line v-for="i in 5" :key="i" :x1="0" :y1="i*24" :x2="600" :y2="i*24" stroke="rgba(108,92,231,0.1)" stroke-width="1" />
              <!-- Curva usuarios -->
              <polyline
                points="0,100 60,90 120,70 180,55 240,65 300,40 360,20 420,30 480,15 540,10 600,8"
                fill="none" stroke="#6C5CE7" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round"
              />
              <!-- Curva ventas (dashed) -->
              <polyline
                points="0,110 60,100 120,95 180,80 240,85 300,70 360,55 420,60 480,45 540,35 600,25"
                fill="none" stroke="#A29BFE" stroke-width="2" stroke-dasharray="6,4"
                stroke-linecap="round" stroke-linejoin="round"
              />
            </svg>
            <!-- Eje X -->
            <div class="row justify-between q-px-xs q-mt-xs">
              <span class="text-caption text-grey-7">1 Nov</span>
              <span class="text-caption text-grey-7">10 Nov</span>
              <span class="text-caption text-grey-7">20 Nov</span>
              <span class="text-caption text-grey-7">30 Nov</span>
            </div>
          </div>
        </div>

        <!-- Bottom row -->
        <div class="row q-gutter-lg">
          <!-- Actividad reciente -->
          <div class="col-12 col-md activity-card q-pa-lg">
            <div class="row items-center justify-between q-mb-lg">
              <div class="text-subtitle1 text-weight-bold text-white">Actividad Reciente</div>
              <q-btn flat no-caps size="sm" color="primary" label="Ver Todo" />
            </div>
            <div v-if="loading" class="text-center q-py-lg">
              <q-spinner-dots color="primary" size="30px" />
            </div>
            <div v-else class="q-gutter-sm">
              <div v-for="act in actividades" :key="act.id" class="actividad-row row items-center q-pa-sm q-gutter-sm">
                <q-avatar size="32px" :color="act.color" text-color="white">
                  <q-icon :name="act.icon" size="16px" />
                </q-avatar>
                <div class="col">
                  <div class="text-white text-caption text-weight-medium">{{ act.titulo }}</div>
                  <div class="text-grey-6" style="font-size:10px">{{ act.tiempo }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Lecturas populares -->
          <div class="col-12 col-md activity-card q-pa-lg">
            <div class="row items-center justify-between q-mb-lg">
              <div class="text-subtitle1 text-weight-bold text-white">Lecturas Populares</div>
              <q-btn flat round icon="expand_more" color="grey-5" size="sm" />
            </div>
            <div class="q-gutter-md">
              <div v-for="lec in lecturasPopulares" :key="lec.nombre" class="lectura-popular-row">
                <div class="row items-center justify-between q-mb-xs">
                  <span class="text-caption text-white">{{ lec.nombre }}</span>
                  <span class="text-caption text-primary text-weight-bold">{{ lec.ventas }} ventas</span>
                </div>
                <q-linear-progress :value="lec.ventas / 350" color="primary" track-color="rgba(108,92,231,0.15)" rounded size="6px" />
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getData } from '../../services/apiClient'
import { useAuthStore } from '../../store/auth'

import AdminUsuarios from './AdminUsuarios.vue'
import AdminLecturas from './AdminLecturas.vue'
import AdminPagos from './AdminPagos.vue'
import AdminSoporte from './AdminSoporte.vue'
import AdminAjustes from './AdminAjustes.vue'

const currentView = ref('Dashboard')
const router = useRouter()
const authStore = useAuthStore()

const activeComponent = computed(() => {
  switch (currentView.value) {
    case 'Usuarios': return AdminUsuarios
    case 'Lecturas': return AdminLecturas
    case 'Pagos': return AdminPagos
    case 'Soporte': return AdminSoporte
    case 'Ajustes': return AdminAjustes
    default: return null
  }
})

const logout = () => {
  authStore.token = null
  authStore.usuario = null
  router.push('/login')
}

const loading = ref(false)

const kpis = ref([
  { label: 'Ingresos Totales', value: '$48,290.50', icon: 'payments', color: 'primary', badge: '+12.4%', badgeColor: 'positive' },
  { label: 'Usuarios Totales', value: '12,842', icon: 'group', color: 'secondary', badge: '+8.2%', badgeColor: 'positive' },
  { label: 'Lecturas Pendientes', value: '86', icon: 'menu_book', color: 'warning', badge: '24h urg.', badgeColor: 'warning' },
  { label: 'Tasa de Conversión', value: '4.28%', icon: 'trending_up', color: 'positive', badge: '+3.1%', badgeColor: 'positive' },
])

const actividades = ref([
  { id: 1, titulo: 'Nuevo registro: Marcus Holloway', tiempo: 'Hace 2 minutos', icon: 'person_add', color: 'primary' },
  { id: 2, titulo: 'Pago completado: Sarah Jenkins ($75.00)', tiempo: 'Hace 12 minutos', icon: 'payments', color: 'positive' },
  { id: 3, titulo: 'Nueva lectura solicitada: Mapa de Vida', tiempo: 'Hace 45 minutos', icon: 'auto_awesome', color: 'secondary' },
  { id: 4, titulo: 'Nueva reseña recibida (5 estrellas)', tiempo: 'Hace 1 hora', icon: 'star', color: 'warning' },
])

const lecturasPopulares = ref([
  { nombre: 'Mapa de Vida Completo', ventas: 342 },
  { nombre: 'Sinastria de Pareja', ventas: 210 },
  { nombre: 'Pronóstico Anual 2024', ventas: 185 },
  { nombre: 'Guía Diaria (Suscripción)', ventas: 120 },
  { nombre: 'Numerología Express', ventas: 94 },
])

onMounted(async () => {
  loading.value = true
  try {
    const usuarios = await getData('/usuarios/todos')
    if (usuarios) {
      const total = Array.isArray(usuarios) ? usuarios.length : (usuarios.total || 0)
      kpis.value[1].value = total.toLocaleString()
    }
  } catch (e) {
    console.error('Error cargando datos del dashboard:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="sass">
.admin-wrapper
  height: 100vh
  overflow: hidden

.admin-sidebar
  width: 260px
  background: rgba(26, 26, 46, 0.95)
  border-right: 1px solid rgba(108, 92, 231, 0.2)
  z-index: 10

.admin-main-area
  height: 100vh
  overflow-y: auto
  position: relative

.active-menu-item
  color: #6C5CE7
  background: rgba(108, 92, 231, 0.15)
  border-right: 3px solid #6C5CE7

.border-right
  border-right: 1px solid rgba(108, 92, 231, 0.2)

.admin-page
  max-width: 1200px
  margin-left: auto
  margin-right: auto
  min-height: auto

.kpi-grid
  display: grid
  grid-template-columns: repeat(4, 1fr)
  gap: 16px
  @media (max-width: 900px)
    grid-template-columns: repeat(2, 1fr)
  @media (max-width: 500px)
    grid-template-columns: 1fr

.kpi-card
  background: rgba(26, 26, 60, 0.5)
  border: 1px solid rgba(108, 92, 231, 0.2)
  border-radius: 14px
  backdrop-filter: blur(10px)
  transition: border-color 0.2s
  &:hover
    border-color: rgba(108, 92, 231, 0.4)

.chart-card
  background: rgba(26, 26, 60, 0.5)
  border: 1px solid rgba(108, 92, 231, 0.2)
  border-radius: 14px

.chart-area
  padding: 8px 0

.legend-dot
  width: 10px
  height: 10px
  border-radius: 50%

.activity-card
  background: rgba(26, 26, 60, 0.5)
  border: 1px solid rgba(108, 92, 231, 0.2)
  border-radius: 14px
  min-width: 0

.actividad-row
  border-radius: 8px
  transition: background 0.2s
  &:hover
    background: rgba(108, 92, 231, 0.08)

.lectura-popular-row
  padding: 4px 0

.estado-astral
  background: rgba(26, 26, 60, 0.5)
  border: 1px solid rgba(253, 203, 110, 0.2)
  border-radius: 8px
  text-align: right

.letter-spacing
  letter-spacing: 1.5px
</style>
