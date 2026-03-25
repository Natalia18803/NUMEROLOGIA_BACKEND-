<template>
  <div>
    <header style="padding: 1rem 2rem; background: rgba(10, 10, 16, 0.8); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border);">
        <h2 style="margin:0; font-size:1.5rem;">Panel Administrativo</h2>
        <div>
            <span style="margin-right: 1.5rem; color: var(--text-secondary);">Admin</span>
            <button @click="logout" class="btn btn-outline" style="width: auto; padding: 0.5rem 1rem; font-size: 0.8rem;">Cerrar Sesión</button>
        </div>
    </header>

    <div class="admin-container">
        <div class="tabs">
            <button :class="['tab-btn', currentTab === 'users' ? 'active' : '']" @click="currentTab = 'users'">Usuarios</button>
            <button :class="['tab-btn', currentTab === 'payments' ? 'active' : '']" @click="currentTab = 'payments'">Pagos</button>
            <button :class="['tab-btn', currentTab === 'readings' ? 'active' : '']" @click="currentTab = 'readings'">Lecturas</button>
        </div>

        <div v-show="currentTab === 'users'">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!users.length"><td colspan="5" class="text-center">Cargando o sin usuarios...</td></tr>
                    <tr v-for="u in users" :key="u._id">
                        <td>{{ u.nombre }}</td>
                        <td>{{ u.email }}</td>
                        <td>{{ u.rol }}</td>
                        <td :class="['badge-' + u.estado]">{{ u.estado.toUpperCase() }}</td>
                        <td>
                            <button class="action-btn" @click="toggleStatus(u)">Cambiar Estado</button>
                            <button class="action-btn delete" @click="deleteUser(u._id)">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-show="currentTab === 'payments'">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID Pago</th>
                        <th>Usuario</th>
                        <th>Monto</th>
                        <th>Método</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!payments.length"><td colspan="5" class="text-center">Cargando o sin pagos...</td></tr>
                    <tr v-for="p in payments" :key="p._id">
                        <td style="font-size:0.8rem;">{{ p._id }}</td>
                        <td>{{ p.usuario_id?.nombre || 'Desconocido' }}</td>
                        <td>${{ p.monto }}</td>
                        <td style="text-transform:capitalize;">{{ p.metodo }}</td>
                        <td>{{ new Date(p.fecha).toLocaleDateString() }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-show="currentTab === 'readings'">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Módulo/Nº</th>
                        <th>Usuario</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!readings.length"><td colspan="4" class="text-center">Cargando o sin lecturas...</td></tr>
                    <tr v-for="l in readings" :key="l._id">
                        <td style="text-transform:capitalize;">{{ l.tipo }}</td>
                        <td>Nº {{ l.numero_calculado }}</td>
                        <td>{{ l.usuario_id?.nombre || 'Desconocido' }}</td>
                        <td>{{ new Date(l.fecha_generacion).toLocaleDateString() }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService, apiFetch } from '../api'

const router = useRouter()
const currentTab = ref('users')

const users = ref([])
const payments = ref([])
const readings = ref([])

onMounted(() => {
    loadData('users')
})

watch(currentTab, (newTab) => {
    loadData(newTab)
})

const loadData = async (tab) => {
    if (tab === 'users' && !users.value.length) {
        const { ok, data } = await apiFetch('/usuarios/todos')
        if (ok) users.value = data.usuarios
    } else if (tab === 'payments' && !payments.value.length) {
        const { ok, data } = await apiFetch('/pagos')
        if (ok) payments.value = data.pagos
    } else if (tab === 'readings' && !readings.value.length) {
        const { ok, data } = await apiFetch('/lecturas')
        if (ok) readings.value = data.lecturas
    }
}

const toggleStatus = async (userObj) => {
    const newState = userObj.estado === 'activo' ? 'inactivo' : 'activo'
    if(confirm(`¿Deseas cambiar el estado a ${newState.toUpperCase()}?`)) {
        const { ok } = await apiFetch(`/usuarios/${userObj._id}/estado`, 'PATCH', { estado: newState })
        if (ok) {
            userObj.estado = newState
        } else {
            alert('Error al cambiar el estado.')
        }
    }
}

const deleteUser = async (id) => {
    if(confirm('¿Estás seguro de eliminar este usuario permanentemente?')) {
        const { ok } = await apiFetch(`/usuarios/${id}`, 'DELETE')
        if (ok) {
            users.value = users.value.filter(u => u._id !== id)
        } else {
            alert('Error al eliminar el usuario.')
        }
    }
}

const logout = () => {
    AuthService.logout()
    router.push('/')
}
</script>

<style scoped>
.admin-container { width: 95%; max-width: 1200px; margin: 2rem auto; }
.tabs { display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; }
.tab-btn { background: transparent; color: var(--text-secondary); border: 1px solid transparent; padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer; font-family: var(--font-heading); font-weight: bold; transition: all var(--transition-speed); }
.tab-btn.active { color: var(--primary-color); background: rgba(212, 175, 55, 0.1); border-color: var(--primary-color); }

.data-table { width: 100%; border-collapse: collapse; background: var(--glass-bg); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
.data-table th { background: rgba(0,0,0,0.4); color: var(--primary-color); font-family: var(--font-heading); font-size: 0.9rem; letter-spacing: 1px; }
.data-table tr:hover { background: rgba(255,255,255,0.02); }

.action-btn { background: transparent; border: none; color: var(--text-secondary); cursor: pointer; margin-right: 0.5rem; font-size: 0.8rem; text-decoration: underline; }
.action-btn:hover { color: var(--text-primary); }
.action-btn.delete { color: #ff4d4d; }

.badge-activo { color: #28a745; font-weight: bold; }
.badge-inactivo { color: #ffc107; font-weight: bold; }
</style>
