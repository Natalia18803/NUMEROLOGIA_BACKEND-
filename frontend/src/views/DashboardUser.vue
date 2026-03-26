<template>
  <div>
    <div class="user-container">
        <!-- Tabs -->
        <div class="tabs">
            <button v-if="user.estado === 'activo'" :class="['tab-btn', currentTab === 'lecturas' ? 'active' : '']" @click="currentTab = 'lecturas'">
                <i class="fas fa-star"></i> Revelaciones
            </button>
            <button :class="['tab-btn', currentTab === 'perfil' ? 'active' : '']" @click="currentTab = 'perfil'">
                <i class="fas fa-user"></i> Mi Perfil
            </button>
            <button :class="['tab-btn', currentTab === 'pagos' ? 'active' : '']" @click="currentTab = 'pagos'">
                <i class="fas fa-wallet"></i> Suscripción
            </button>
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
                <span v-if="user.tipo_cuenta === 'premium'" class="status-badge bg-premium" style="margin-left: 0.5rem;">
                    <i class="fas fa-crown"></i> Miembro Premium
                </span>
            </div>
        </div>

        <!-- Pagos Tab -->
        <div v-show="currentTab === 'pagos'" class="glass-panel" style="max-width: 800px; margin: auto;">
            <div class="text-center mb-2">
                <h3>Suscripción Mensual</h3>
                <p v-if="user.estado === 'inactivo'" style="margin-bottom: 1rem;">Debes activar tu cuenta para acceder a tus lecturas diarias.</p>
                <p v-else style="margin-bottom: 1rem; color: #28a745;">¡Tu suscripción está activa!</p>
                
                <button @click="handlePago" class="btn btn-primary" :disabled="paying" style="width: auto; min-width: 250px;">
                    <i class="fab fa-shopify"></i> {{ paying ? 'Conectando con Mercado Pago...' : (user.tipo_cuenta === 'premium' ? 'Renovar Membresía Premium' : 'Activar Lecturas Ilimitadas (Premium)') }}
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

        <!-- Lecturas Tab (Inicio) -->
        <div v-show="currentTab === 'lecturas'" class="fade-in">
            <div v-if="user.estado === 'inactivo'" class="glass-panel text-center" style="max-width: 600px; margin: auto; padding: 4rem 2rem;">
                <h2 style="color:var(--primary-color); font-size: 2rem; margin-bottom: 1rem;">Portal Bloqueado</h2>
                <p>Las energías celestiales están esperando. Completa tu activación para revelar tu destino astrológico.</p>
                <button @click="currentTab = 'pagos'" class="btn btn-primary mt-2" style="padding: 1rem 3rem; font-size: 1.1rem;">Desbloquear Portal</button>
            </div>

            <div v-else>
                <!-- Hero Section for Daily Reading -->
                <div class="daily-hero-card">
                    <div class="hero-content">
                        <h2 class="hero-title">Tu Lectura de Hoy</h2>
                        <div v-if="dailyReading">
                            <div class="daily-highlight">✨ {{ extraerNumero(dailyReading.contenido) }} ✨</div>
                            <p class="hero-text">{{ dailyReading.contenido }}</p>
                            <p class="hero-date">Última Alineación: {{ formatearFechaHora(dailyReading.fecha_lectura) }}</p>
                            
                             <div v-if="!isToday(dailyReading.fecha_lectura) || user.tipo_cuenta === 'premium'" style="margin-top: 2rem;">
                                <button @click="generarLectura('diaria')" class="btn btn-primary" :disabled="loadingData">
                                    {{ user.tipo_cuenta === 'premium' ? 'Generar Nueva Lectura Premium' : 'Conectar con el Universo de Hoy' }}
                                </button>
                            </div>
                        </div>
                        <div v-else>
                            <p class="hero-text" style="color: rgba(255,255,255,0.7);">Las constelaciones tienen un mensaje para ti hoy.</p>
                            <button @click="generarLectura('diaria')" class="btn btn-primary" :disabled="loadingData" style="margin-top: 1rem;">Conectar con el Universo de Hoy</button>
                        </div>
                    </div>
                </div>

                <!-- Secondary Section: Main Reading -->
                <div class="main-reading-card" style="margin-top: 2rem;">
                    <div class="glass-panel text-center" style="max-width: 800px; margin: auto; border-top: 4px solid var(--primary-color);">
                        <h3 style="margin-bottom: 1rem; color: #fff;">Tu Número Espiritual</h3>
                        <div v-if="mainReading">
                            <div class="number-highlight" style="font-size: 3.5rem; margin-bottom: 1rem;">Nº {{ extraerNumero(mainReading.contenido) }}</div>
                            <p class="reading-text" style="font-size: 1.1rem; line-height: 1.6;">{{ mainReading.contenido }}</p>
                        </div>
                        <div v-else>
                            <p style="margin-bottom:1rem; font-size:1.1rem;">El Universo está calculando tu número de vida...</p>
                            <div class="loading-spinner" style="color: var(--primary-color);">Cargando vibraciones...</div>
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
import { formatearFecha, formatearFechaHora, isToday } from '../utils/formatDate'
import { extraerNumero } from '../utils/extractNumber'
import { useGeneralStore } from '../store/General'
import pagoService from '../services/pagoService'
import lecturaService from '../services/lecturaService'
import mercadopagoService from '../services/mercadopagoService'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useGeneralStore()
const currentTab = ref('perfil')

const user = ref({})
const payments = ref([])
const mainReading = ref(null)
const dailyReading = ref(null)

const paying = ref(false)
const loadingData = ref(false)

onMounted(async () => {
    try {
        const userData = await store.fetchProfile()
        user.value = userData
        
        if (user.value.estado === 'activo') {
            currentTab.value = 'lecturas'
            loadReadings()
            loadPayments()
        } else {
            currentTab.value = 'perfil'
        }

        // Verificar resultados de pago en la URL
        checkPaymentResult()
    } catch (e) {
        // Handled by store
    }
})

watch(currentTab, (newTab) => {
    if (newTab === 'pagos') {
        loadPayments()
    } else if (newTab === 'lecturas') {
        if (user.value.estado === 'activo') loadReadings()
    }
})

const loadReadings = async () => {
    if (!user.value._id) return
    try {
        const response = await lecturaService.getLecturasByUsuario(user.value._id)
        const lecturasArray = Array.isArray(response.data) ? response.data : (response.data.lecturas || [])
        
        mainReading.value = lecturasArray.find(l => l.tipo === 'principal') || null
        dailyReading.value = lecturasArray.find(l => l.tipo === 'diaria') || null
        
        if (!mainReading.value) {
            await generarLectura('principal', true)
        }
    } catch(e) {}
}

const loadPayments = async () => {
    if (!user.value._id) return
    try {
        const response = await pagoService.getPagosByUsuario(user.value._id)
        if (response.data && response.data.pagos) {
            payments.value = response.data.pagos
        }
    } catch(e) {
        payments.value = []
    }
}

const checkPaymentResult = () => {
    if (route.query.pago === 'exitoso') {
        Swal.fire({
            title: '¡Pago Confirmado!',
            text: 'Tu conexión con la Matriz ahora es Premium e ilimitada.',
            icon: 'success',
            background: '#161224',
            color: '#f8f8f8',
            confirmButtonColor: '#d4af37'
        })
    } else if (route.query.pago === 'fallido') {
        Swal.fire({
            title: 'Pago Fallido',
            text: 'Hubo un error al procesar tu transacción mística.',
            icon: 'error',
            background: '#161224',
            color: '#f8f8f8',
            confirmButtonColor: '#d4af37'
        })
    }
}

const handlePago = async () => {
    paying.value = true
    try {
        const response = await mercadopagoService.createPreference({
            usuario_id: user.value._id,
            monto: 25.00
        })
        
        // Redirigir al Checkout de Mercado Pago
        if (response.data.init_point) {
            window.location.href = response.data.init_point
        }
    } catch (error) {
        const errData = error.response?.data || {}
        Swal.fire({
            title: 'Error de Red',
            text: errData.msg || errData.error || 'No se pudo conectar con Mercado Pago',
            icon: 'error',
            background: '#161224',
            color: '#f8f8f8',
            confirmButtonColor: '#d4af37'
        })
    } finally {
        paying.value = false
    }
}

const generarLectura = async (tipo, silent = false) => {
    loadingData.value = true
    try {
        const response = await lecturaService.generarLectura(tipo, user.value._id)
        const data = response.data
        if (tipo === 'principal') mainReading.value = data.lectura
        else dailyReading.value = data.lectura
    } catch (error) {
        if (!silent) {
            const errData = error.response?.data || {}
            Swal.fire({
                title: 'Energías Bloqueadas',
                text: errData.error || errData.msg || 'Error al generar lectura.',
                icon: 'warning',
                background: '#161224',
                color: '#f8f8f8',
                confirmButtonColor: '#d4af37'
            })
        }
    } finally {
        loadingData.value = false
    }
}
</script>

<style scoped>
.user-container { width: 95%; max-width: 1200px; margin: 0 auto; }
.tabs { display: flex; gap: 1rem; margin-bottom: 2rem; padding-bottom: 1rem; justify-content: center; }
.tab-btn { background: transparent; color: var(--text-secondary); border: 1px solid transparent; padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer; font-family: var(--font-heading); font-weight: bold; transition: all var(--transition-speed); font-size: 1rem;}
.tab-btn.active { color: var(--primary-color); background: rgba(212, 175, 55, 0.1); border-color: var(--primary-color); }

.fade-in { animation: fadeIn 0.4s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Hero Styling */
.daily-hero-card {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(10, 10, 16, 0.8) 100%);
    border: 1px solid var(--primary-color);
    border-radius: 20px;
    padding: 3rem 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(212, 175, 55, 0.1);
    position: relative;
    overflow: hidden;
    text-align: center;
}
.daily-hero-card::before {
    content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
    background: radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 60%);
    z-index: 0; pointer-events: none;
}
.hero-content { position: relative; z-index: 1; }
.hero-title { font-family: var(--font-heading); color: #fff; font-size: 1.5rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1.5rem; }
.hero-text { font-size: 1.25rem; line-height: 1.8; color: #f0f0f0; max-width: 800px; margin: 0 auto; white-space: pre-wrap; }
.daily-highlight { font-size: 4rem; color: var(--primary-color); text-shadow: 0 0 20px var(--primary-glow); margin: 1rem 0; font-family: var(--font-heading); }
.hero-date { margin-top: 1.5rem; font-size: 0.85rem; color: rgba(255,255,255,0.5); font-style: italic; }

.main-reading-card p { color: #e0e0e0; }

.data-table { width: 100%; border-collapse: collapse; background: rgba(0,0,0,0.2); border-radius: 12px; overflow: hidden; }
.data-table th, .data-table td { padding: 1rem; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
.data-table th { background: rgba(0,0,0,0.4); color: var(--primary-color); font-family: var(--font-heading); font-size: 0.9rem; letter-spacing: 1px; }

.status-badge { display: inline-block; padding: 0.3em 0.8em; border-radius: 12px; font-size: 0.85rem; font-weight: bold; text-transform: uppercase; }
.bg-success { background: rgba(40, 167, 69, 0.15); color: #28a745; border: 1px solid #28a745; }
.bg-warning { background: rgba(255, 193, 7, 0.15); color: #ffc107; border: 1px solid #ffc107; }
.bg-premium { background: rgba(212, 175, 55, 0.15); color: var(--primary-color); border: 1px solid var(--primary-color); box-shadow: 0 0 10px rgba(212, 175, 55, 0.2); }
</style>
