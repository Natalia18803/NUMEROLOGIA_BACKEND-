<template>
  <div class="admin-container">
    <div class="glass-panel">
        <div class="dashboard-header mb-2">
            <h3><i class="fas fa-users"></i> Gestión de Usuarios</h3>
            <div class="stats-badge">Total: {{ users.length }}</div>
        </div>

        <div v-if="loading" class="text-center" style="padding: 3rem;">
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
                        <div v-if="u.rol !== 'admin'" class="action-buttons">
                            <button @click="toggleStatus(u)" :class="['btn-action', u.estado === 'activo' ? 'btn-warning' : 'btn-success']" :title="u.estado === 'activo' ? 'Desactivar Cuenta' : 'Activar Cuenta'">
                                <i :class="u.estado === 'activo' ? 'fas fa-ban' : 'fas fa-check'"></i>
                            </button>
                            <button @click="deleteUser(u._id)" class="btn-action btn-danger" title="Eliminar Usuario">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <span v-else style="color: gray; font-size: 0.8rem; font-style: italic;">Sin acciones</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { ref, onMounted } from 'vue'
import { formatearFecha } from '../utils/formatDate'
import userService from '../services/userService'

const users = ref([])
const loading = ref(true)

const loadUsers = async () => {
    loading.value = true
    try {
        const response = await userService.getAllUsuarios()
        // El array viene expuesto directamente
        users.value = Array.isArray(response.data.usuarios) ? response.data.usuarios : response.data
    } catch (e) {
        Swal.fire({
            title: 'Fallo de Conexión',
            text: 'No se pudo cargar la base de datos estelar.',
            icon: 'error',
            background: '#161224',
            color: '#f8f8f8',
            confirmButtonColor: '#d4af37'
        })
    } finally {
        loading.value = false
    }
}

const toggleStatus = async (user) => {
    try {
        await userService.updateEstado(user)
        await loadUsers()
        Swal.fire({
            title: 'Actualizado',
            text: `El estado de ${user.nombre} ahora es ${user.estado === 'activo' ? 'inactivo' : 'activo'}`,
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            background: '#161224',
            color: '#f8f8f8'
        })
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Hubo un error al actualizar el estado.',
            icon: 'error',
            background: '#161224',
            color: '#f8f8f8',
            confirmButtonColor: '#d4af37'
        })
    }
}

const deleteUser = async (id) => {
    const result = await Swal.fire({
        title: '¿Estás completamente seguro?',
        text: "Esta entidad será borrada de la base de datos permanentemente.",
        icon: 'warning',
        showCancelButton: true,
        background: '#161224',
        color: '#f8f8f8',
        confirmButtonColor: '#ff4d4d',
        cancelButtonColor: '#a39cb6',
        confirmButtonText: 'Sí, purgar registro',
        cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
        try {
            await userService.deleteUsuario(id)
            await loadUsers()
            Swal.fire({
                title: 'Purgado',
                text: 'El usuario ha sido eliminado.',
                icon: 'success',
                background: '#161224',
                color: '#f8f8f8',
                confirmButtonColor: '#d4af37'
            })
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'El registro no pudo ser purgado.',
                icon: 'error',
                background: '#161224',
                color: '#f8f8f8',
                confirmButtonColor: '#d4af37'
            })
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
</style>
