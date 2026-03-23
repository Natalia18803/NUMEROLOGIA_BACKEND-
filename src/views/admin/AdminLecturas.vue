<template>
  <q-page class="admin-page q-pa-lg">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl">
      <div class="text-h5 text-weight-bold text-white">Administración de Lecturas Numerológicas</div>
      <div class="row items-center q-gutter-sm">
        <q-input v-model="search" outlined dark dense color="primary" placeholder="Buscar por usuario o lectura..."
          style="min-width:260px" class="search-input">
          <template v-slot:prepend><q-icon name="search" color="grey-6" /></template>
        </q-input>
        <q-btn flat round icon="notifications" color="grey-5" />
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid q-mb-xl">
      <div class="kpi-card q-pa-lg" style="border-color: rgba(255,165,0,0.3)">
        <div class="row items-center q-gutter-sm q-mb-sm">
          <q-icon name="menu_book" color="warning" size="24px" />
          <div class="text-caption text-grey-6 text-uppercase letter-spacing">Lecturas Pendientes</div>
        </div>
        <div class="text-h4 text-weight-bold text-white">{{ lecturasPendientes }}</div>
        <div class="text-warning text-caption q-mt-xs">↑ Urgentes: 5</div>
      </div>
      <div class="kpi-card q-pa-lg" style="border-color: rgba(0,217,165,0.3)">
        <div class="row items-center q-gutter-sm q-mb-sm">
          <q-icon name="check_circle" color="positive" size="24px" />
          <div class="text-caption text-grey-6 text-uppercase letter-spacing">Lecturas Entregadas</div>
        </div>
        <div class="text-h4 text-weight-bold text-white">{{ lecturasEntregadas.toLocaleString() }}</div>
        <div class="text-positive text-caption q-mt-xs">+12% este mes</div>
      </div>
      <div class="kpi-card q-pa-lg">
        <div class="row items-center q-gutter-sm q-mb-sm">
          <q-icon name="schedule" color="primary" size="24px" />
          <div class="text-caption text-grey-6 text-uppercase letter-spacing">Tiempo Promedio</div>
        </div>
        <div class="text-h4 text-weight-bold text-white">{{ tiempoPromedio }}</div>
        <div class="text-positive text-caption q-mt-xs">↓ 15min mejora de velocidad</div>
      </div>
    </div>

    <!-- Table header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-subtitle1 text-weight-bold text-white">Solicitudes de Interpretación</div>
        <div class="text-caption text-grey-6">Gestiona y procesa las lecturas personalizadas de los usuarios</div>
      </div>
      <q-btn outline no-caps size="sm" color="grey-5" icon="filter_list" label="Filtrar" />
    </div>

    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <div v-else class="table-card">
      <q-markup-table flat dark>
        <thead>
          <tr>
            <th class="text-left th-label">Usuario</th>
            <th class="text-left th-label">Tipo de Lectura</th>
            <th class="text-left th-label">Fecha Solicitud</th>
            <th class="text-left th-label">Estado</th>
            <th class="text-left th-label">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lec in lecturasFiltradas" :key="lec._id" class="lectura-row">
            <td>
              <div class="row items-center q-gutter-sm">
                <q-avatar size="36px" class="lec-avatar">
                  <q-icon name="person" color="white" size="18px" />
                </q-avatar>
                <div>
                  <div class="text-white text-caption text-weight-medium">{{ lec.usuario_nombre || lec.usuario?.nombre
                    ||
                    'Usuario' }}</div>
                  <div class="text-grey-7" style="font-size:10px">{{ lec.usuario_email || '' }}</div>
                </div>
              </div>
            </td>
            <td>
              <div class="text-white text-caption text-weight-medium">{{ lec.tipo || 'Mapa Natal Completo' }}</div>
              <div class="text-primary" style="font-size:10px">{{ lec.subtipo || 'Interpretación Profunda' }}</div>
            </td>
            <td>
              <div class="text-white text-caption">{{ formatFecha(lec.fecha) }}</div>
              <div class="text-warning" style="font-size:10px; font-weight:600">{{ lec.urgencia || '' }}</div>
            </td>
            <td>
              <q-btn unelevated no-caps size="xs" :color="getEstadoColor(lec.estado)"
                :label="lec.estado || 'En Proceso'" icon-right="arrow_drop_down" />
            </td>
            <td>
              <q-btn unelevated no-caps size="xs" color="primary" label="Ver Detalles" @click="verDetalles(lec)" />
            </td>
          </tr>
          <tr v-if="lecturasFiltradas.length === 0">
            <td colspan="5" class="text-center text-grey-6 q-py-xl">No hay lecturas registradas</td>
          </tr>
        </tbody>
      </q-markup-table>

      <!-- Paginación -->
      <div class="row items-center justify-between q-pa-md">
        <div class="text-caption text-grey-6">Mostrando {{ lecturasFiltradas.length }} de {{ lecturasPendientes }}
          lecturas
          pendientes</div>
        <q-pagination v-model="pagina" :max="Math.ceil(lecturasPendientes / 4)" color="primary" flat
          active-color="primary" />
      </div>
    </div>

    <!-- Dialog detalles -->
    <q-dialog v-model="showDetalles">
      <q-card class="detalle-card q-pa-lg" style="min-width:400px">
        <q-card-section class="q-pb-sm">
          <div class="text-h6 text-white q-mb-xs">Detalles de Lectura</div>
          <q-btn flat round icon="close" color="grey-5" class="absolute-top-right q-mt-sm q-mr-sm" v-close-popup />
        </q-card-section>
        <q-card-section v-if="lecturaSeleccionada">
          <div class="q-gutter-sm">
            <div><span class="text-grey-5 text-caption">Usuario:</span> <span class="text-white">{{
              lecturaSeleccionada.usuario_nombre }}</span></div>
            <div><span class="text-grey-5 text-caption">Tipo:</span> <span class="text-white">{{
                lecturaSeleccionada.tipo
                }}</span></div>
            <div><span class="text-grey-5 text-caption">Fecha:</span> <span class="text-white">{{
              formatFecha(lecturaSeleccionada.fecha) }}</span></div>
            <div><span class="text-grey-5 text-caption">Estado:</span> <q-badge
                :color="getEstadoColor(lecturaSeleccionada.estado)" :label="lecturaSeleccionada.estado" /></div>
          </div>
          <div class="q-mt-lg row q-gutter-sm">
            <q-btn unelevated no-caps color="positive" label="Marcar Completado" />
            <q-btn outline no-caps color="warning" label="En Proceso" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getData } from '../../services/apiClient'

const loading = ref(false)
const search = ref('')
const pagina = ref(1)
const lecturas = ref([])
const lecturasPendientes = ref(24)
const lecturasEntregadas = ref(1482)
const tiempoPromedio = ref('4.2h')
const showDetalles = ref(false)
const lecturaSeleccionada = ref(null)

const lecturasFiltradas = computed(() => {
  if (!search.value) return lecturas.value
  const q = search.value.toLowerCase()
  return lecturas.value.filter(l =>
    l.usuario_nombre?.toLowerCase().includes(q) ||
    l.tipo?.toLowerCase().includes(q)
  )
})

const formatFecha = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const getEstadoColor = (estado) => {
  const colores = { completado: 'positive', 'en proceso': 'primary', cancelado: 'negative', pendiente: 'warning' }
  return colores[estado?.toLowerCase()] || 'primary'
}

const verDetalles = (lec) => {
  lecturaSeleccionada.value = lec
  showDetalles.value = true
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await getData('/lecturas')
    lecturas.value = Array.isArray(res) ? res : (res.lecturas || [])
  } catch (e) {
    console.error('Error cargando lecturas:', e)
    lecturas.value = [
      { _id: '001', usuario_nombre: 'Marcus Holloway', usuario_email: 'marcus.r@example.com', tipo: 'Mapa Natal Completo', subtipo: 'Interpretación Profunda', fecha: new Date(), estado: 'en proceso', urgencia: 'HACE 2 HORAS' },
      { _id: '002', usuario_nombre: 'Sarah Jenkins', usuario_email: 's.jenkins@webzmail.com', tipo: 'Sinastria de Pareja', subtipo: 'Especial Numerológico', fecha: new Date(Date.now() - 86400000), estado: 'completado', urgencia: 'Hace 1 día' },
      { _id: '003', usuario_nombre: 'Julian Thorne', usuario_email: 'j.thorne@astro.net', tipo: 'Pronóstico Anual 2024', subtipo: 'Ciclo de 9 años', fecha: new Date(Date.now() - 86400000 * 2), estado: 'cancelado', urgencia: 'Hace 2 días' },
      { _id: '004', usuario_nombre: 'Elena Valerius', usuario_email: 'elena.v@mystic.com', tipo: 'Misión de Vida', subtipo: 'Lectura Kármica', fecha: new Date(Date.now() - 86400000 * 3), estado: 'en proceso', urgencia: 'Hace 3 días' },
    ]
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="sass">
.admin-page
  max-width: 1200px
  margin: 0 auto

.kpi-grid
  display: grid
  grid-template-columns: repeat(3, 1fr)
  gap: 16px
  @media (max-width: 700px)
    grid-template-columns: 1fr

.kpi-card
  background: rgba(26, 26, 60, 0.5)
  border: 1px solid rgba(108, 92, 231, 0.2)
  border-radius: 14px

.table-card
  background: rgba(26, 26, 60, 0.4)
  border: 1px solid rgba(108, 92, 231, 0.2)
  border-radius: 14px
  overflow: hidden

.th-label
  font-size: 10px
  font-weight: 700
  letter-spacing: 1px
  text-transform: uppercase
  color: rgba(255,255,255,0.4)
  padding: 12px 16px
  border-bottom: 1px solid rgba(108,92,231,0.15)

.lectura-row
  transition: background 0.2s
  &:hover
    background: rgba(108, 92, 231, 0.05)
  td
    border-bottom: 1px solid rgba(108,92,231,0.08)
    padding: 12px 16px

.lec-avatar
  background: rgba(108, 92, 231, 0.3)
  border: 1.5px solid rgba(108, 92, 231, 0.3)

.search-input
  :deep(.q-field__control)
    background: rgba(26, 26, 60, 0.6)

.detalle-card
  background: rgba(20, 20, 50, 0.98)
  border: 1px solid rgba(108, 92, 231, 0.3)
  border-radius: 16px

.letter-spacing
  letter-spacing: 1px
</style>
