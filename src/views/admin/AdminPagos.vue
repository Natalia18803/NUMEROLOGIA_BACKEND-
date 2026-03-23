<template>
  <q-page class="admin-page q-pa-lg">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl">
      <div class="text-h5 text-weight-bold text-white">Gestión de Pagos Globales</div>
      <div class="row items-center q-gutter-sm">
        <q-input v-model="search" outlined dark dense color="primary" placeholder="Buscar transacción o usuario..." style="min-width:260px" class="search-input">
          <template v-slot:prepend><q-icon name="search" color="grey-6" /></template>
        </q-input>
        <q-btn flat round icon="notifications" color="grey-5" />
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid q-mb-xl">
      <div class="kpi-card q-pa-lg">
        <div class="text-caption text-grey-6 text-uppercase letter-spacing q-mb-xs">Ingresos Totales</div>
        <div class="text-h4 text-weight-bold text-white">${{ ingresos.toLocaleString() }}</div>
        <div class="text-positive text-caption q-mt-xs">+12% vs. mes anterior</div>
      </div>
      <div class="kpi-card q-pa-lg">
        <div class="text-caption text-grey-6 text-uppercase letter-spacing q-mb-xs">Ventas del Mes</div>
        <div class="text-h4 text-weight-bold text-white">{{ ventasMes.toLocaleString() }}</div>
        <div class="text-positive text-caption q-mt-xs">+8.4% nuevos servicios</div>
      </div>
      <div class="kpi-card q-pa-lg">
        <div class="text-caption text-grey-6 text-uppercase letter-spacing q-mb-xs">Usuarios Activos</div>
        <div class="text-h4 text-weight-bold text-white">{{ usuariosActivos.toLocaleString() }}</div>
        <div class="text-positive text-caption q-mt-xs">+2.1% crecimiento diario</div>
      </div>
    </div>

    <!-- Table header -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-subtitle1 text-weight-bold text-white">Historial de Transacciones</div>
      <div class="row items-center q-gutter-sm">
        <q-btn outline no-caps size="sm" color="grey-5" icon="filter_list" label="Filtrar" />
        <q-btn unelevated no-caps size="sm" color="primary" icon="download" label="Exportar" />
      </div>
    </div>

    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <div v-else class="table-card">
      <q-markup-table flat dark>
        <thead>
          <tr>
            <th class="text-left th-label">Usuario</th>
            <th class="text-left th-label">Servicio</th>
            <th class="text-left th-label">Fecha</th>
            <th class="text-left th-label">Monto</th>
            <th class="text-left th-label">Método</th>
            <th class="text-left th-label">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pago in pagosFiltrados" :key="pago._id" class="pago-row">
            <td>
              <div class="row items-center q-gutter-sm">
                <q-avatar size="32px" class="pago-avatar">
                  <q-icon name="person" color="white" size="16px" />
                </q-avatar>
                <div>
                  <div class="text-white text-caption text-weight-medium">{{ pago.usuario_nombre || pago.usuario?.nombre || 'Usuario' }}</div>
                  <div class="text-grey-7" style="font-size:10px">ID #{{ pago.usuario_id?.slice(-4) || pago._id?.slice(-4) || '0001' }}</div>
                </div>
              </div>
            </td>
            <td>
              <div class="text-white text-caption text-weight-medium">{{ pago.concepto || pago.tipo || 'Servicio' }}</div>
              <div class="text-primary" style="font-size:10px">{{ pago.subtipo || '' }}</div>
            </td>
            <td class="text-grey-5 text-caption">{{ formatDate(pago.fecha) }}</td>
            <td class="text-white text-body2 text-weight-bold">${{ pago.monto }}</td>
            <td class="text-grey-5 text-caption">{{ pago.metodo || 'Tarjeta' }}</td>
            <td>
              <q-badge
                :color="getEstadoColor(pago.estado)"
                :label="(pago.estado || 'completado').toUpperCase()"
                class="estado-badge"
              />
            </td>
          </tr>
          <tr v-if="pagosFiltrados.length === 0">
            <td colspan="6" class="text-center text-grey-6 q-py-xl">No se encontraron transacciones</td>
          </tr>
        </tbody>
      </q-markup-table>

      <!-- Paginación -->
      <div class="row items-center justify-between q-pa-md">
        <div class="text-caption text-grey-6">Mostrando {{ pagosFiltrados.length }} de {{ totalPagos }} resultados</div>
        <q-pagination v-model="pagina" :max="Math.ceil(totalPagos / 10)" color="primary" flat active-color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getData } from '../../services/apiClient'

const loading = ref(false)
const search = ref('')
const pagina = ref(1)
const pagos = ref([])
const totalPagos = ref(0)
const ingresos = ref(124592)
const ventasMes = ref(1248)
const usuariosActivos = ref(18502)

const pagosFiltrados = computed(() => {
  if (!search.value) return pagos.value
  const q = search.value.toLowerCase()
  return pagos.value.filter(p =>
    p.usuario_nombre?.toLowerCase().includes(q) ||
    p.concepto?.toLowerCase().includes(q) ||
    p.tipo?.toLowerCase().includes(q)
  )
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getEstadoColor = (estado) => {
  const colores = { completado: 'positive', pendiente: 'warning', reembolsado: 'negative', cancelado: 'grey' }
  return colores[estado] || 'positive'
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await getData('/pagos')
    pagos.value = Array.isArray(res) ? res : (res.pagos || [])
    totalPagos.value = pagos.value.length
  } catch (e) {
    console.error('Error cargando pagos:', e)
    // Demo data
    pagos.value = [
      { _id: '001', usuario_nombre: 'Marcus Holloway', usuario_id: '001', concepto: 'Mapa de Vida Completo', subtipo: 'Lectura Profunda', fecha: new Date(), monto: 49.99, metodo: 'Visa **** 4492', estado: 'completado' },
      { _id: '002', usuario_nombre: 'Sarah Jenkins', usuario_id: '002', concepto: 'Sinastria de Pareja', subtipo: 'Sesión Zoom', fecha: new Date(Date.now() - 86400000), monto: 75.00, metodo: 'PayPal', estado: 'pendiente' },
      { _id: '003', usuario_nombre: 'Julian Thorne', usuario_id: '003', concepto: 'Guía Diaria (Anual)', subtipo: 'Suscripción', fecha: new Date(Date.now() - 86400000*3), monto: 99.00, metodo: 'Mastercard **** 1102', estado: 'reembolsado' },
      { _id: '004', usuario_nombre: 'Elena Valerius', usuario_id: '004', concepto: 'Pronóstico Anual 2024', fecha: new Date(Date.now() - 86400000*8), monto: 35.00, metodo: 'Visa **** 8821', estado: 'completado' },
    ]
    totalPagos.value = 1248
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

.pago-row
  transition: background 0.2s
  &:hover
    background: rgba(108, 92, 231, 0.05)
  td
    border-bottom: 1px solid rgba(108,92,231,0.08)
    padding: 12px 16px

.pago-avatar
  background: rgba(108, 92, 231, 0.25)
  border: 1.5px solid rgba(108, 92, 231, 0.3)

.search-input
  :deep(.q-field__control)
    background: rgba(26, 26, 60, 0.6)

.letter-spacing
  letter-spacing: 1px
</style>
