<template>
  <q-page class="admin-page q-pa-lg">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <div class="text-h5 text-weight-bold text-white">Administración de Usuarios</div>
      </div>
      <div class="row items-center q-gutter-sm">
        <q-input v-model="search" outlined dark dense color="primary" placeholder="Buscar por nombre o correo..." style="min-width:260px" class="search-input">
          <template v-slot:prepend><q-icon name="search" color="grey-6" /></template>
        </q-input>
        <q-btn flat round icon="notifications" color="grey-5" />
      </div>
    </div>

    <!-- KPI cards -->
    <div class="row q-gutter-md q-mb-xl">
      <div class="col kpi-card q-pa-lg">
        <div class="text-caption text-grey-6 text-uppercase letter-spacing q-mb-xs">Total de Usuarios</div>
        <div class="text-h4 text-weight-bold text-white">{{ totalUsuarios.toLocaleString() }}</div>
        <div class="text-positive text-caption q-mt-xs">+5.2% este mes</div>
      </div>
      <div class="col kpi-card q-pa-lg">
        <div class="text-caption text-grey-6 text-uppercase letter-spacing q-mb-xs">Nuevos Hoy</div>
        <div class="text-h4 text-weight-bold text-white">{{ nuevosHoy }}</div>
        <div class="text-grey-6 text-caption q-mt-xs">Última hora: +12 usuarios</div>
      </div>
    </div>

    <!-- Table header -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-subtitle1 text-weight-bold text-white">Listado de Usuarios</div>
      <div class="row items-center q-gutter-sm">
        <q-btn outline no-caps size="sm" color="grey-5" icon="filter_list" label="Filtrar" />
        <q-btn unelevated no-caps size="sm" color="primary" icon="person_add" label="Nuevo Usuario" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <!-- Table -->
    <div v-else class="table-card">
      <q-markup-table flat dark>
        <thead>
          <tr>
            <th class="text-left th-label">Avatar y Nombre</th>
            <th class="text-left th-label">Correo Electrónico</th>
            <th class="text-left th-label">Fecha de Registro</th>
            <th class="text-left th-label">Última Lectura</th>
            <th class="text-left th-label">Estado</th>
            <th class="text-left th-label">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usuariosFiltrados" :key="user._id" class="user-row">
            <td>
              <div class="row items-center q-gutter-sm">
                <q-avatar size="36px" class="user-avatar-table">
                  <q-icon name="person" color="white" size="18px" />
                </q-avatar>
                <div>
                  <div class="text-white text-body2 text-weight-medium">{{ user.nombre }}</div>
                  <div class="text-grey-6" style="font-size:10px">ID #{{ user._id?.slice(-4) || '0001' }}</div>
                </div>
              </div>
            </td>
            <td class="text-grey-5 text-caption">{{ user.email }}</td>
            <td class="text-grey-5 text-caption">{{ formatDate(user.fecha_registro) }}</td>
            <td>
              <span class="text-primary text-caption text-weight-medium">{{ user.ultima_lectura || 'Ninguna solicitada' }}</span>
            </td>
            <td>
              <q-badge :color="user.estado === 'activo' ? 'positive' : 'grey-7'" :label="user.estado || 'activo'" />
            </td>
            <td>
              <q-btn unelevated no-caps size="xs" color="primary" label="Acciones">
                <q-menu class="user-menu">
                  <q-list dense style="min-width:140px">
                    <q-item clickable v-close-popup>
                      <q-item-section avatar><q-icon name="visibility" size="16px" /></q-item-section>
                      <q-item-section>Ver Perfil</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup>
                      <q-item-section avatar><q-icon name="edit" size="16px" /></q-item-section>
                      <q-item-section>Editar</q-item-section>
                    </q-item>
                    <q-separator dark />
                    <q-item clickable v-close-popup @click="toggleEstado(user)">
                      <q-item-section avatar><q-icon :name="user.estado === 'activo' ? 'block' : 'check_circle'" size="16px" color="warning" /></q-item-section>
                      <q-item-section class="text-warning">{{ user.estado === 'activo' ? 'Desactivar' : 'Activar' }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </td>
          </tr>
          <tr v-if="usuariosFiltrados.length === 0">
            <td colspan="6" class="text-center text-grey-6 q-py-xl">No se encontraron usuarios</td>
          </tr>
        </tbody>
      </q-markup-table>

      <!-- Paginación -->
      <div class="row items-center justify-between q-pa-md q-pt-sm">
        <div class="text-caption text-grey-6">Mostrando {{ usuariosFiltrados.length }} de {{ totalUsuarios }} usuarios registrados</div>
        <q-pagination v-model="pagina" :max="Math.ceil(totalUsuarios / 16)" color="primary" flat active-color="primary" />
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
const usuarios = ref([])
const totalUsuarios = ref(0)
const nuevosHoy = ref(0)

const usuariosFiltrados = computed(() => {
  if (!search.value) return usuarios.value
  const q = search.value.toLowerCase()
  return usuarios.value.filter(u => u.nombre?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const toggleEstado = (user) => {
  user.estado = user.estado === 'activo' ? 'inactivo' : 'activo'
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await getData('/usuarios/todos')
    usuarios.value = Array.isArray(res) ? res : (res.usuarios || [])
    totalUsuarios.value = usuarios.value.length
    // Simular nuevos hoy
    const hoy = new Date().toDateString()
    nuevosHoy.value = usuarios.value.filter(u => new Date(u.fecha_registro).toDateString() === hoy).length
  } catch (e) {
    console.error('Error cargando usuarios:', e)
    // Demo data
    usuarios.value = [
      { _id: '001', nombre: 'Marcus Holloway', email: 'marcus.h@example.com', fecha_registro: new Date(), estado: 'activo', ultima_lectura: 'Mapa de Vida Completo' },
      { _id: '002', nombre: 'Sarah Jenkins', email: 's.jenkins@webzmail.com', fecha_registro: new Date(Date.now() - 86400000*3), estado: 'activo', ultima_lectura: 'Sinastria de Pareja' },
      { _id: '003', nombre: 'Julian Thorne', email: 'j.thorne@astro.com', fecha_registro: new Date(Date.now() - 86400000*10), estado: 'inactivo', ultima_lectura: null },
      { _id: '004', nombre: 'Elena Valerius', email: 'elena.valerius@cloud.net', fecha_registro: new Date(Date.now() - 86400000*15), estado: 'activo', ultima_lectura: 'Pronóstico Anual 2024' },
    ]
    totalUsuarios.value = 24812
    nuevosHoy.value = 142
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="sass">
.admin-page
  max-width: 1200px
  margin: 0 auto

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
  border-bottom: 1px solid rgba(108, 92, 231, 0.15)

.user-row
  transition: background 0.2s
  &:hover
    background: rgba(108, 92, 231, 0.06)
  td
    border-bottom: 1px solid rgba(108, 92, 231, 0.08)
    padding: 12px 16px

.user-avatar-table
  background: rgba(108, 92, 231, 0.3)
  border: 1.5px solid rgba(108, 92, 231, 0.3)

.search-input
  :deep(.q-field__control)
    background: rgba(26, 26, 60, 0.6)

.user-menu
  background: rgba(26, 26, 46, 0.98)
  border: 1px solid rgba(108, 92, 231, 0.3)

.letter-spacing
  letter-spacing: 1px
</style>
