<template>
  <div>
    <header style="padding: 1rem 2rem; background: rgba(10, 10, 16, 0.8); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border);">
        <h2 style="margin:0; font-size:1.5rem;">Mi Portal Numérico</h2>
        <button @click="logout" class="btn btn-outline" style="width: auto; padding: 0.5rem 1rem; font-size: 0.8rem;">Cerrar Sesión</button>
    </header>

    <div class="user-container">
        <!-- Tabs -->
        <div class="tabs">
            <button :class="['tab-btn', currentTab === 'perfil' ? 'active' : '']" @click="currentTab = 'perfil'">Mi Perfil</button>
            <button :class="['tab-btn', currentTab === 'pagos' ? 'active' : '']" @click="currentTab = 'pagos'">Pagos y Suscripción</button>
            <button :class="['tab-btn', currentTab === 'lecturas' ? 'active' : '']" @click="currentTab = 'lecturas'">Mis Lecturas</button>
        </div>

        <!-- Perfil Tab -->
        <div v-show="currentTab === 'perfil'" class="glass-panel text-center" style="max-width: 600px; margin: auto;">
            <h3 style="margin-bottom: 2rem;">Información Personal</h3>
            <p><strong>Nombre:</strong> {{ user.nombre }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Fecha de Nacimiento:</strong> {{ formatearFecha(user.fecha_nacimiento) }}</p>
            
            <div style="margin-top: 1.5rem; font-size: 1.1rem;">
                <strong>Estado de Cuenta:</strong> 
                <span :class="['status-badge', user.estado === 'activo' ? 'bg-success' : 'bg-warning']" style="margin-left: 0.5rem;">
                    {{ user.estado === 'activo' ? 'Suscripción Activa' : 'Sin Suscripción (Inactivo)' }}
                </span>
            </div>
        </div>

        <!-- Pagos Tab -->
        <div v-show="currentTab === 'pagos'" class="glass-panel" style="max-width: 800px; margin: auto;">
            <div class="text-center mb-2">
                <h3>Suscripción Mensual</h3>
                <p v-if="user.estado === 'inactivo'" style="margin-bottom: 1rem;">Debes activar tu cuenta para acceder a tus lecturas diarias.</p>
                <p v-else style="margin-bottom: 1rem; color: #28a745;">¡Tu suscripción está activa!</p>
                
                <button @click="simularPago" class="btn btn-primary" :disabled="paying" style="width: auto; min-width: 250px;">
                    {{ paying ? 'Procesando...' : (user.estado === 'activo' ? 'Añadir un pago (Simulación)' : 'Pagar Suscripción (Simulación)') }}
                </button>
            </div>

            <hr style="border-color: rgba(255,255,255,0.1); margin: 2rem 0;">

            <h4 style="margin-bottom: 1rem;">Mi Historial de Pagos</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID Pago</th>
                        <th>Método</th>
                        <th>Monto</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!payments.length">
                        <td colspan="4" class="text-center">No has realizado ningún pago aún.</td>
                    </tr>
                    <tr v-for="p in payments" :key="p._id">
                        <td style="font-size:0.8rem;">{{ p._id }}</td>
                        <td style="text-transform:capitalize;">{{ p.metodo }}</td>
                        <td>${{ p.monto }}</td>
                        <td>{{ formatearFecha(p.fecha) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Lecturas Tab -->
        <div v-show="currentTab === 'lecturas'" class="glass-panel" style="max-width: 900px; margin: auto;">
            <div v-if="user.estado === 'inactivo'" class="text-center" style="padding: 2rem 0;">
                <h3 style="color:var(--text-secondary);">El Portal Está Cerrado</h3>
                <p>Las energías de los números están esperando por ti. Completa el pago de tu suscripción para revelar tus lecturas.</p>
                <button @click="currentTab = 'pagos'" class="btn btn-outline mt-2" style="width: auto;">Ir a Pagos</button>
            </div>

            <div v-else>
                <h3 class="text-center">Tus Lecturas Numerológicas</h3>
                
                <div class="reading-grid">
                    <div class="reading-card">
                        <h4 class="text-center">Mi Número Principal</h4>
                        <div class="text-center" style="margin-top: 1.5rem;">
                            <div v-if="mainReading">
                                <div class="number-highlight">Nº {{ mainReading.numero_calculado }}</div>
                                <div class="reading-text">{{ mainReading.mensaje }}</div>
                                <p style="font-size:0.8rem; color:gray; text-align:right; margin-top:1rem;">Generada: {{ formatearFecha(mainReading.fecha_generacion) }}</p>
                            </div>
                            <div v-else>
                                <p style="margin-bottom:1rem; font-size:0.9rem;">Tu destino está oculto.</p>
                                <button @click="generarLectura('principal')" class="btn btn-primary" style="width: auto;" :disabled="loadingData">Revelar Número Principal</button>
                            </div>
                        </div>
                    </div>

                    <div class="reading-card">
                        <h4 class="text-center">Lectura Diaria (Hoy)</h4>
                        <div class="text-center" style="margin-top: 1.5rem;">
                            <div v-if="dailyReading">
                                <div class="number-highlight">Nº {{ dailyReading.numero_calculado }}</div>
                                <div class="reading-text">{{ dailyReading.mensaje }}</div>
                                <p style="font-size:0.8rem; color:gray; text-align:right; margin-top:1rem;">Generada: {{ formatearFecha(dailyReading.fecha_generacion) }}</p>
                            </div>
                            <div v-else>
                                <p style="margin-bottom:1rem; font-size:0.9rem;">¿Qué te depara este día?</p>
                                <button @click="generarLectura('diaria')" class="btn btn-outline" style="width: auto;" :disabled="loadingData">Generar Lectura de Hoy</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService, apiFetch } from '../api'

const router = useRouter()
const currentTab = ref('perfil')

const user = ref({})
const payments = ref([])
const mainReading = ref(null)
const dailyReading = ref(null)

const paying = ref(false)
const loadingData = ref(false)

onMounted(async () => {
    // 1. Get profile data
    const { ok, data } = await apiFetch('/auth/perfil')
    if (!ok) {
        AuthService.logout()
        router.push('/')
        return
    }
    // Fix: Backend `getPerfil` returns the user directly, unlike login that wraps it in `usuario`.
    user.value = data.usuario || data
    localStorage.setItem('user', JSON.stringify(user.value))

    // Pre-load logic if active
    if (user.value.estado === 'activo') {
        loadReadings()
        loadPayments()
    }
})

// Tab Switcher Reactivity
watch(currentTab, (newTab) => {
    if (newTab === 'pagos') {
        loadPayments()
    } else if (newTab === 'lecturas') {
        if (user.value.estado === 'activo') loadReadings()
    }
})

const loadReadings = async () => {
    if (!user.value._id) return
    const { ok, data } = await apiFetch(`/lecturas/usuario/${user.value._id}`)
    if (ok && data.lecturas) {
        mainReading.value = data.lecturas.find(l => l.tipo === 'principal') || null
        dailyReading.value = data.lecturas.find(l => l.tipo === 'diaria') || null
    }
}

const loadPayments = async () => {
    if (!user.value._id) return
    
    // We fetch ALL payments as admin or, ideally, as user we could filter out if the backend supports it.
    // However, the backend /api/pagos/:usuario_id requires the user to be active.
    // If the user is inactive, we handle the 403 error gracefully.
    const { ok, data } = await apiFetch(`/pagos/${user.value._id}`)
    if (ok && data.pagos) {
        payments.value = data.pagos
    } else {
        payments.value = [] // backend probably returned 403 or empty array, which is fine!
    }
}

const simularPago = async () => {
    paying.value = true
    const { ok, data } = await apiFetch('/pagos', 'POST', {
        usuario_id: user.value._id,
        monto: 25.00,
        metodo: 'tarjeta'
    })
    
    if (ok) {
        Swal.fire({
            title: '¡Suscripción Activada!',
            text: 'Bienvenido al Portal Místico.',
            icon: 'success',
            background: '#161224',
            color: '#f8f8f8',
            confirmButtonColor: '#d4af37'
        })
        
        const profileRes = await apiFetch('/auth/perfil')
        if (profileRes.ok) {
            user.value = profileRes.data.usuario || profileRes.data
            localStorage.setItem('user', JSON.stringify(user.value))
        }

        await loadPayments()
        paying.value = false
    } else {
        Swal.fire({
            title: 'Error',
            text: data.msg || 'Error al procesar el pago',
            icon: 'error',
            background: '#161224',
            color: '#f8f8f8',
            confirmButtonColor: '#d4af37'
        })
        paying.value = false
    }
}

const generarLectura = async (tipo) => {
    loadingData.value = true
    const endpoint = tipo === 'principal' ? `/lecturas/principal/${user.value._id}` : `/lecturas/diaria/${user.value._id}`
    const { ok, data } = await apiFetch(endpoint, 'POST')
    
    if (ok) {
        if (tipo === 'principal') mainReading.value = data.lectura
        else dailyReading.value = data.lectura
    } else {
        Swal.fire({
            title: 'Energías Bloqueadas',
            text: data.msg || 'Error al generar lectura.',
            icon: 'warning',
            background: '#161224',
            color: '#f8f8f8',
            confirmButtonColor: '#d4af37'
        })
    }
    loadingData.value = false
}

const formatearFecha = (fecha) => {
    if (!fecha) return '...'
    return new Date(fecha).toLocaleDateString('es-ES')
}

const logout = () => {
    AuthService.logout()
    router.push('/')
}
</script>

<style scoped>
.user-container { width: 95%; max-width: 1200px; margin: 2rem auto; }
.tabs { display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; justify-content: center; }
.tab-btn { background: transparent; color: var(--text-secondary); border: 1px solid transparent; padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer; font-family: var(--font-heading); font-weight: bold; transition: all var(--transition-speed); font-size: 1rem;}
.tab-btn.active { color: var(--primary-color); background: rgba(212, 175, 55, 0.1); border-color: var(--primary-color); }

.reading-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 2rem;
}
@media (max-width: 768px) {
    .reading-grid { grid-template-columns: 1fr; }
}
.reading-card {
    background: rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 2rem;
}

.data-table { width: 100%; border-collapse: collapse; background: rgba(0,0,0,0.2); border-radius: 12px; overflow: hidden; }
.data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
.data-table th { background: rgba(0,0,0,0.4); color: var(--primary-color); font-family: var(--font-heading); font-size: 0.9rem; letter-spacing: 1px; }

.status-badge { display: inline-block; padding: 0.3em 0.8em; border-radius: 12px; font-size: 0.85rem; font-weight: bold; text-transform: uppercase; }
.bg-success { background: rgba(40, 167, 69, 0.15); color: #28a745; border: 1px solid #28a745; }
.bg-warning { background: rgba(255, 193, 7, 0.15); color: #ffc107; border: 1px solid #ffc107; }
.number-highlight { font-size: 3rem; font-family: var(--font-heading); color: var(--primary-color); text-shadow: 0 0 10px var(--primary-glow); margin-bottom: 1rem; }
.reading-text { white-space: pre-wrap; font-size: 1rem; color: #f0f0f0; text-align: left; }
</style>
