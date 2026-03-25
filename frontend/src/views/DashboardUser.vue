<template>
  <div>
    <header style="padding: 1rem 2rem; background: rgba(10, 10, 16, 0.8); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border);">
        <h2 style="margin:0; font-size:1.5rem;">Numerología</h2>
        <button @click="logout" class="btn btn-outline" style="width: auto; padding: 0.5rem 1rem; font-size: 0.8rem;">Cerrar Sesión</button>
    </header>

    <div class="dashboard-container">
        <!-- Sidebar Profile -->
        <aside class="glass-panel text-center">
            <h3>{{ user.nombre || 'Perfil...' }}</h3>
            <p>Email: <span>{{ user.email }}</span></p>
            <p>Nacimiento: <span>{{ formatearFecha(user.fecha_nacimiento) }}</span></p>
            
            <div style="margin-top: 1rem;">
                Estado: 
                <span :class="['status-badge', user.estado === 'activo' ? 'bg-success' : 'bg-warning']">
                    {{ user.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                </span>
            </div>

            <!-- Payment Simulation -->
            <div v-if="user.estado === 'inactivo'" style="margin-top: 2rem;">
                <hr style="border-color: rgba(255,255,255,0.1); margin-bottom:1rem;">
                <p style="font-size:0.85rem; margin-bottom: 1rem;">Debes activar tu cuenta para acceder a tus lecturas diarias.</p>
                <button @click="simularPago" class="btn btn-primary" :disabled="paying" style="font-size: 0.9rem;">
                    {{ paying ? 'Procesando...' : 'Simular Pago (Activar)' }}
                </button>
            </div>
        </aside>

        <!-- Main Content (Readings) -->
        <main class="glass-panel">
            <div v-if="user.estado === 'inactivo'" class="text-center" style="padding: 3rem 0;">
                <h3 style="color:var(--text-secondary);">Portal Cerrado</h3>
                <p>Las energías de los números están esperando por ti. Completa tu activación para revelar tus lecturas.</p>
            </div>

            <div v-else>
                <h3>Lecturas Numerológicas</h3>
                <p v-if="sysMsg" class="error-msg active">{{ sysMsg }}</p>
                
                <div class="reading-section">
                    <h4>Mi Número Principal</h4>
                    <div class="text-center">
                        <div v-if="mainReading">
                            <div class="number-highlight" style="font-size:2rem; margin-bottom:1rem;">Nº {{ mainReading.numero_calculado }}</div>
                            <div class="reading-text" style="text-align:left;">{{ mainReading.mensaje }}</div>
                            <p style="font-size:0.8rem; color:gray; text-align:right; margin-top:1rem;">Generada: {{ formatearFecha(mainReading.fecha_generacion) }}</p>
                        </div>
                        <div v-else>
                            <p style="margin-bottom:1rem; font-size:0.9rem;">Aún no has generado tu lectura principal.</p>
                            <button @click="generarLectura('principal')" class="btn btn-primary" style="width: auto;">Generar Lectura Principal</button>
                        </div>
                    </div>
                </div>

                <div class="reading-section" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1);">
                    <h4>Lectura Diaria</h4>
                    <div class="text-center">
                        <div v-if="dailyReading">
                            <div class="number-highlight" style="font-size:2rem; margin-bottom:1rem;">Nº {{ dailyReading.numero_calculado }}</div>
                            <div class="reading-text" style="text-align:left;">{{ dailyReading.mensaje }}</div>
                            <p style="font-size:0.8rem; color:gray; text-align:right; margin-top:1rem;">Generada: {{ formatearFecha(dailyReading.fecha_generacion) }}</p>
                        </div>
                        <div v-else>
                            <button @click="generarLectura('diaria')" class="btn btn-outline" style="width: auto;">Generar Lectura de Hoy</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService, apiFetch } from '../api'

const router = useRouter()
const user = ref({})
const mainReading = ref(null)
const dailyReading = ref(null)
const paying = ref(false)
const sysMsg = ref('')

onMounted(async () => {
    const { ok, data } = await apiFetch('/auth/perfil')
    if (!ok) {
        AuthService.logout()
        router.push('/')
        return
    }
    user.value = data.usuario
    localStorage.setItem('user', JSON.stringify(user.value))

    if (user.value.estado === 'activo') {
        loadReadings()
    }
})

const loadReadings = async () => {
    const { ok, data } = await apiFetch(`/lecturas/usuario/${user.value._id}`)
    if (ok && data.lecturas) {
        mainReading.value = data.lecturas.find(l => l.tipo === 'principal') || null
        dailyReading.value = data.lecturas.find(l => l.tipo === 'diaria') || null
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
        alert('¡Pago exitoso! Bienvenido al Portal Místico.')
        window.location.reload()
    } else {
        alert(data.msg || 'Error al procesar el pago')
        paying.value = false
    }
}

const generarLectura = async (tipo) => {
    const endpoint = tipo === 'principal' ? `/lecturas/principal/${user.value._id}` : `/lecturas/diaria/${user.value._id}`
    const { ok, data } = await apiFetch(endpoint, 'POST')
    
    if (ok) {
        if (tipo === 'principal') mainReading.value = data.lectura
        else dailyReading.value = data.lectura
        sysMsg.value = ''
    } else {
        sysMsg.value = data.msg || 'Error al generar lectura.'
    }
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
.dashboard-container {
    width: 90%;
    max-width: 900px;
    margin: 2rem auto;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
}

@media (max-width: 768px) {
    .dashboard-container {
        grid-template-columns: 1fr;
    }
}

.status-badge { display: inline-block; padding: 0.3em 0.8em; border-radius: 12px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; }
.bg-success { background: rgba(40, 167, 69, 0.2); color: #28a745; border: 1px solid #28a745; }
.bg-warning { background: rgba(255, 193, 7, 0.2); color: #ffc107; border: 1px solid #ffc107; }
.number-highlight { font-family: var(--font-heading); color: var(--primary-color); text-shadow: 0 0 10px var(--primary-glow); }
.reading-text { white-space: pre-wrap; font-size: 0.95rem; color: #ddd; }
</style>
