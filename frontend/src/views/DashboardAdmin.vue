<template>
  <div class="admin-container">
    <div class="tabs text-center mb-2">
      <button :class="['tab-btn', currentTab === 'usuarios' ? 'active' : '']" @click="currentTab = 'usuarios'">
          <i class="fas fa-users"></i> Usuarios
      </button>
      <button :class="['tab-btn', currentTab === 'pagos' ? 'active' : '']" @click="currentTab = 'pagos'">
          <i class="fas fa-money-bill-wave"></i> Historial de Pagos
      </button>
    </div>

    <!-- PESTAÑA USUARIOS -->
    <div v-show="currentTab === 'usuarios'" class="glass-panel fade-in">
        <div class="dashboard-header mb-2">
            <h3><i class="fas fa-users"></i> Gestión de Usuarios</h3>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <button @click="showUserForm = !showUserForm" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
                    <i :class="showUserForm ? 'fas fa-times' : 'fas fa-plus'"></i> {{ showUserForm ? 'Cancelar' : 'Nuevo Usuario' }}
                </button>
                <div class="stats-badge">Total: {{ users.length }}</div>
            </div>
        </div>

        <!-- Fomulario de Creación Rápida -->
        <div v-if="showUserForm" class="create-user-panel mb-2">
            <h4 class="mb-1">Añadir Nueva Entidad a la Matriz</h4>
            <form @submit.prevent="handleCreateUser" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" v-model="newUser.nombre" required class="form-control" placeholder="Nombre Cósmico">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" v-model="newUser.email" required class="form-control" placeholder="admin@matriz.com">
                </div>
                <div class="form-group">
                    <label>Contraseña</label>
                    <input type="password" v-model="newUser.password" required minlength="6" class="form-control" placeholder="Mínimo 6 caracteres">
                </div>
                <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <label>Rol</label>
                        <select v-model="newUser.rol" class="form-control">
                            <option value="usuario">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div>
                        <label>Estado</label>
                        <select v-model="newUser.estado" class="form-control">
                            <option value="inactivo">Inactivo</option>
                            <option value="activo">Activo</option>
                        </select>
                    </div>
                </div>
                <div style="grid-column: 1 / -1; text-align: right; margin-top: 1rem;">
                    <button type="submit" class="btn btn-primary" :disabled="creating">
                        {{ creating ? 'Inyectando...' : 'Crear Usuario' }}
                    </button>
                </div>
            </form>
        </div>

        <div v-if="loadingUsers" class="text-center" style="padding: 3rem;">
            <div class="loading-spinner" style="color: var(--primary-color);">Accediendo a la base de datos...</div>
        </div>
        
        <table v-else class="data-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Registro</th>
                    <th>Estado</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!users.length">
                    <td colspan="6" class="text-center">No hay usuarios en la matriz.</td>
                </tr>
                <tr v-for="u in users" :key="u._id">
                    <td style="font-weight: bold;">{{ u.nombre }}</td>
                    <td>{{ u.email }}</td>
                    <td>{{ formatearFecha(u.fecha_registro) }}</td>
                    <td>
                        <span :class="['status-badge', u.estado === 'activo' ? 'bg-success' : 'bg-warning']">
                            {{ u.estado }}
                        </span>
                    </td>
                    <td>{{ u.rol }}</td>
                    <td>
                        <div v-if="u.email !== store.user.email" class="action-buttons">
                            <button @click="toggleStatus(u)" :class="['btn-action', u.estado === 'activo' ? 'btn-warning' : 'btn-success']" :title="u.estado === 'activo' ? 'Desactivar Cuenta' : 'Activar Cuenta'">
                                <i :class="u.estado === 'activo' ? 'fas fa-ban' : 'fas fa-check'"></i>
                            </button>
                            <button @click="deleteUser(u._id)" class="btn-action btn-danger" title="Eliminar Usuario">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <span v-else style="color: gray; font-size: 0.8rem; font-style: italic;">Yo</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- PESTAÑA PAGOS -->
    <div v-show="currentTab === 'pagos'" class="glass-panel fade-in">
        <div class="dashboard-header mb-2">
            <h3><i class="fas fa-money-bill-wave"></i> Registro Global de Pagos</h3>
            <div class="stats-badge">Total Transacciones: {{ payments.length }}</div>
        </div>

        <div v-if="loadingPayments" class="text-center" style="padding: 3rem;">
            <div class="loading-spinner" style="color: var(--primary-color);">Verificando nodos transaccionales...</div>
        </div>

        <table v-else class="data-table">
            <thead>
                <tr>
                    <th>ID Transacción</th>
                    <th>Usuario ID</th>
                    <th>Monto</th>
                    <th>Método</th>
                    <th>Fecha y Hora</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="!payments.length">
                    <td colspan="5" class="text-center">No hay transacciones registradas en el sistema.</td>
                </tr>
                <tr v-for="p in payments" :key="p._id">
                    <td style="font-size:0.85rem; color: #a39cb6;">{{ p._id }}</td>
                    <td style="font-size:0.85rem;">{{ p.usuario_id }}</td>
                    <td style="font-weight: bold; color: #28a745;">${{ p.monto }}</td>
                    <td style="text-transform: capitalize;">{{ p.metodo }}</td>
                    <td>{{ formatearFechaHora(p.fecha) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { ref, onMounted, reactive, watch } from 'vue'
import { formatearFecha, formatearFechaHora } from '../utils/formatDate'
import userService from '../services/userService'
import pagoService from '../services/pagoService'
import { useGeneralStore } from '../store/General'

const store = useGeneralStore()
const currentTab = ref('usuarios')

// Usuarios State
const users = ref([])
const loadingUsers = ref(true)
const showUserForm = ref(false)
const creating = ref(false)
const newUser = reactive({ nombre: '', email: '', password: '', rol: 'usuario', estado: 'inactivo' })

// Pagos State
const payments = ref([])
const loadingPayments = ref(false)

const loadUsers = async () => {
    loadingUsers.value = true
    try {
        const response = await userService.getAllUsuarios()
        users.value = Array.isArray(response.data.usuarios) ? response.data.usuarios : response.data
    } catch (e) {
        Swal.fire('Error', 'No se pudo cargar la base de usuarios.', 'error')
    } finally {
        loadingUsers.value = false
    }
}

const loadPayments = async () => {
    loadingPayments.value = true
    try {
        const response = await pagoService.getAllPagos()
        payments.value = Array.isArray(response.data.pagos) ? response.data.pagos : response.data
    } catch (e) {
        // Ignorar o logear
    } finally {
        loadingPayments.value = false
    }
}

watch(currentTab, (newTab) => {
    if (newTab === 'pagos' && payments.value.length === 0) {
        loadPayments()
    }
})

const handleCreateUser = async () => {
    creating.value = true
    try {
        await userService.crearUsuario({ ...newUser })
        Swal.fire({
            title: '¡Entidad Creada!',
            text: `El usuario ${newUser.nombre} con el rol ${newUser.rol} se ha inyectado exitosamente.`,
            icon: 'success',
            background: '#161224',
            color: '#f8f8f8',
            confirmButtonColor: '#d4af37'
        })
        
        // Limpiar
        newUser.nombre = ''
        newUser.email = ''
        newUser.password = ''
        newUser.rol = 'usuario'
        newUser.estado = 'inactivo'
        showUserForm.value = false
        
        await loadUsers()
    } catch (error) {
        const errData = error.response?.data || {}
        Swal.fire('Fallo de inyección', errData.error || errData.msg || 'Error al crear', 'error')
    } finally {
        creating.value = false
    }
}

const toggleStatus = async (user) => {
    try {
        await userService.updateEstado(user)
        await loadUsers()
        Swal.fire({
            title: 'Actualizado',
            text: `El estado ha cambiado.`,
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            background: '#161224',
            color: '#f8f8f8'
        })
    } catch (error) {
        Swal.fire('Error', 'Hubo un error al actualizar el estado.', 'error')
    }
}

const deleteUser = async (id) => {
    const result = await Swal.fire({
        title: '¿Estás completamente seguro?',
        text: "Esta entidad será borrada irrevocablemente.",
        icon: 'warning',
        showCancelButton: true,
        background: '#161224',
        color: '#f8f8f8',
        confirmButtonColor: '#ff4d4d',
        cancelButtonColor: '#a39cb6',
        confirmButtonText: 'Eliminar'
    })

    if (result.isConfirmed) {
        try {
            await userService.deleteUsuario(id)
            await loadUsers()
            Swal.fire('Purgado', 'Usuario eliminado.', 'success')
        } catch (error) {
            Swal.fire('Error', 'Error al eliminar.', 'error')
        }
    }
}

onMounted(() => {
    loadUsers()
})
</script>

<style scoped>
.admin-container {
    width: 95%;
    max-width: 1200px;
    margin: 0 auto;
}
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 1rem;
}
.stats-badge {
    background: rgba(212, 175, 55, 0.2);
    border: 1px solid var(--primary-color);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: bold;
    color: var(--primary-color);
}
.create-user-panel {
    background: rgba(0,0,0,0.4);
    border-left: 4px solid var(--primary-color);
    padding: 1.5rem;
    border-radius: 8px;
}
.form-control {
    width: 100%; padding: 0.6rem; border-radius: 6px; border: 1px solid rgba(212, 175, 55, 0.5); background: rgba(0,0,0,0.5); color: #fff;
}
.data-table { width: 100%; border-collapse: collapse; background: rgba(0,0,0,0.3); border-radius: 12px; overflow: hidden; }
.data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
.data-table th { background: rgba(0,0,0,0.6); color: var(--primary-color); font-family: var(--font-heading); font-size: 0.9rem; letter-spacing: 1px; }

.status-badge { display: inline-block; padding: 0.3em 0.8em; border-radius: 12px; font-size: 0.85rem; font-weight: bold; text-transform: uppercase; }
.bg-success { background: rgba(40, 167, 69, 0.15); color: #28a745; border: 1px solid #28a745; }
.bg-warning { background: rgba(255, 193, 7, 0.15); color: #ffc107; border: 1px solid #ffc107; }

.action-buttons {
    display: flex;
    gap: 0.5rem;
}
.btn-action {
    background: transparent;
    border: 1px solid transparent;
    color: #fff;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}
.btn-warning { border-color: #ffc107; color: #ffc107; }
.btn-warning:hover { background: #ffc107; color: #000; }
.btn-success { border-color: #28a745; color: #28a745; }
.btn-success:hover { background: #28a745; color: #fff; }
.btn-danger { border-color: #ff4d4d; color: #ff4d4d; }
.btn-danger:hover { background: #ff4d4d; color: #fff; }

.tabs { display: flex; gap: 1rem; margin-bottom: 2rem; justify-content: center; }
.tab-btn { background: transparent; color: var(--text-secondary); border: 1px solid transparent; padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer; font-family: var(--font-heading); font-weight: bold; transition: all var(--transition-speed); font-size: 1rem;}
.tab-btn.active { color: var(--primary-color); background: rgba(212, 175, 55, 0.1); border-color: var(--primary-color); }
.fade-in { animation: fadeIn 0.4s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
