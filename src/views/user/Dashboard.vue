<template>
  <div class="row no-wrap full-height bg-dark user-wrapper">
    <!-- Sidebar -->
    <div class="user-sidebar column shadow-up-4 border-right">
      <div class="q-pa-lg text-center">
        <q-avatar size="64px" class="profile-avatar q-mb-sm">
          <q-icon name="person" size="32px" color="white" />
        </q-avatar>
        <div class="text-subtitle1 text-weight-bold text-white">{{ usuario?.nombre || 'Elena Valerius' }}</div>
        <div class="text-mystic-gold text-caption text-uppercase letter-spacing" style="font-size: 10px;">Buscadora de Luz</div>
      </div>
      
      <q-list dark padding class="col" style="overflow-y: auto;">
        <q-item clickable v-ripple :active="activeTab === 'inicio'" active-class="active-menu-item" @click="activeTab = 'inicio'">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Inicio</q-item-section>
        </q-item>
        <q-item clickable v-ripple :active="activeTab === 'lecturas'" active-class="active-menu-item" @click="activeTab = 'lecturas'">
          <q-item-section avatar><q-icon name="auto_awesome" /></q-item-section>
          <q-item-section>Mis Lecturas</q-item-section>
        </q-item>
        <q-item clickable v-ripple :active="activeTab === 'pagos'" active-class="active-menu-item" @click="activeTab = 'pagos'">
          <q-item-section avatar><q-icon name="receipt_long" /></q-item-section>
          <q-item-section>Historial de Pagos</q-item-section>
        </q-item>
        <q-item clickable v-ripple :active="activeTab === 'ajustes'" active-class="active-menu-item" @click="activeTab = 'ajustes'">
          <q-item-section avatar><q-icon name="manage_accounts" /></q-item-section>
          <q-item-section>Ajustes de Cuenta</q-item-section>
        </q-item>
      </q-list>

      <div class="q-pa-md">
        <q-separator dark class="q-mb-md" />
        <q-btn flat no-caps color="negative" class="full-width" icon="logout" label="Cerrar Sesión" @click="logout" />
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="col user-main-area">
      <q-page class="q-pa-lg q-pt-xl">
        
        <!-- Tab: Inicio (Perfil y Resumen) -->
        <div v-if="activeTab === 'inicio'" class="fade-in">
          <h1 class="text-h5 text-weight-bold text-white q-mb-lg">Tu Perfil Astral</h1>
          
          <div class="dashboard-grid">
            <!-- Numerología y Esencia -->
            <div class="profile-card q-pa-lg">
              <div class="row q-gutter-md q-mb-lg">
                <div class="col text-center numero-badge">
                  <div class="numero-valor text-primary">{{ numeroCamino }}</div>
                  <div class="numero-label">CAMINO DE VIDA</div>
                </div>
                <div class="col text-center numero-badge">
                  <div class="numero-valor text-secondary">{{ numeroDestino }}</div>
                  <div class="numero-label">Nº DE DESTINO</div>
                </div>
              </div>
              
              <div class="q-gutter-sm q-mb-lg">
                <div class="row items-center q-gutter-xs">
                  <q-icon name="cake" size="16px" color="grey-5" />
                  <span class="text-grey-5 text-caption">{{ usuario?.fecha_nacimiento ? formatDate(usuario.fecha_nacimiento) : '14 de Mayo, 1992' }}</span>
                </div>
                <div class="row items-center q-gutter-xs">
                  <q-icon name="email" size="16px" color="grey-5" />
                  <span class="text-grey-5 text-caption">{{ usuario?.email || 'usuario@mystic.com' }}</span>
                </div>
              </div>

              <div class="esencia-card q-pa-md">
                <div class="text-mystic-gold text-caption text-uppercase text-weight-bold q-mb-sm">Esencia de Hoy</div>
                <p class="text-grey-4 text-caption q-mb-sm" style="line-height:1.5; font-style:italic">
                  "Tu energía vibra hoy en el número 3. Es un día ideal para la autoexpresión creativa y la comunicación abierta."
                </p>
                <q-btn flat no-caps size="sm" color="primary" label="Ver guía diaria" class="q-pa-none" />
              </div>
            </div>

            <!-- Actividad Reciente Rápida -->
            <div>
              <div class="text-h6 text-weight-bold text-white q-mb-md">Actividad Reciente</div>
              <div v-if="loadingPagos" class="text-center q-py-md">
                <q-spinner-dots color="primary" size="30px" />
              </div>
              <q-markup-table v-else flat dark class="activity-table">
                <thead>
                  <tr>
                    <th class="text-left text-grey-6 text-caption">SERVICIO</th>
                    <th class="text-left text-grey-6 text-caption">FECHA</th>
                    <th class="text-left text-grey-6 text-caption">ESTADO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="pago in pagos.slice(0, 3)" :key="pago._id">
                    <td class="text-white text-caption">{{ pago.concepto || pago.tipo || 'Lectura' }}</td>
                    <td class="text-grey-5 text-caption">{{ formatDate(pago.fecha) }}</td>
                    <td><q-badge :color="pago.estado === 'completado' ? 'positive' : 'warning'" :label="pago.estado" /></td>
                  </tr>
                  <tr v-if="pagos.length === 0">
                    <td colspan="3" class="text-center text-grey-6 text-caption q-py-md">No hay actividad reciente</td>
                  </tr>
                </tbody>
              </q-markup-table>
              <div class="text-center q-mt-md">
                <q-btn flat no-caps size="sm" color="primary" label="Ver historial completo" @click="activeTab = 'pagos'" />
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Mis Lecturas -->
        <div v-if="activeTab === 'lecturas'" class="fade-in">
          <div class="row items-center justify-between q-mb-lg">
            <h1 class="text-h5 text-weight-bold text-white q-ma-none">Lecturas Personalizadas</h1>
            <q-btn outline no-caps size="sm" color="primary" label="Nueva Lectura +" @click="crearNuevaLectura" :loading="isCreatingLectura" />
          </div>

          <div v-if="loadingLecturas" class="text-center q-py-xl">
            <q-spinner-dots color="primary" size="40px" />
          </div>
          <div v-else class="lecturas-grid">
            <div v-for="lectura in lecturas" :key="lectura._id" class="lectura-card q-pa-md">
              <div class="row items-center justify-between q-mb-sm">
                <q-icon :name="getLecturaIcon(lectura.tipo)" size="24px" color="primary" />
                <span class="text-caption text-grey-6">{{ formatDate(lectura.fecha) }}</span>
              </div>
              <div class="text-subtitle2 text-weight-bold text-white q-mb-xs">{{ lectura.tipo || 'Mapa de Vida Completo' }}</div>
              <p class="text-caption text-grey-5 q-mb-sm" style="line-height:1.4">{{ lectura.descripcion || 'Análisis profundo de tus números centrales.' }}</p>
              <div class="row items-center justify-between">
                <q-badge :color="lectura.estado === 'completado' ? 'positive' : 'warning'" :label="lectura.estado || 'Completado'" />
                <q-btn flat no-caps size="xs" color="primary" label="Leer ›" />
              </div>
            </div>

            <div v-if="lecturas.length === 0" class="lectura-card-locked q-pa-md text-center">
              <q-icon name="lock" size="32px" color="grey-7" class="q-mb-sm" />
              <div class="text-subtitle2 text-grey-5 q-mb-xs">Pronóstico Anual 2024</div>
              <p class="text-caption text-grey-7 q-mb-sm">Descubre lo que los números te deparan para el nuevo ciclo solar.</p>
              <q-btn unelevated no-caps size="sm" color="primary" label="Desbloquear" />
            </div>
          </div>
        </div>

        <!-- Tab: Historial de Pagos -->
        <div v-if="activeTab === 'pagos'" class="fade-in">
          <h1 class="text-h5 text-weight-bold text-white q-mb-lg">Historial de Pagos</h1>
          <div v-if="loadingPagos" class="text-center q-py-xl">
            <q-spinner-dots color="primary" size="40px" />
          </div>
          <q-markup-table v-else flat dark class="activity-table">
            <thead>
              <tr>
                <th class="text-left text-grey-6 text-caption">FECHA</th>
                <th class="text-left text-grey-6 text-caption">CONCEPTO</th>
                <th class="text-left text-grey-6 text-caption">MÉTODO</th>
                <th class="text-left text-grey-6 text-caption">MONTO</th>
                <th class="text-left text-grey-6 text-caption">ESTADO</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pago in pagos" :key="pago._id">
                <td class="text-grey-5 text-caption">{{ formatDate(pago.fecha) }}</td>
                <td class="text-white text-caption">{{ pago.concepto || pago.tipo || 'Servicio' }}</td>
                <td class="text-grey-5 text-caption">{{ pago.metodo || 'Tarjeta' }}</td>
                <td class="text-white text-caption">${{ pago.monto }}</td>
                <td><q-badge :color="pago.estado === 'completado' ? 'positive' : pago.estado === 'pendiente' ? 'warning' : 'grey'" :label="pago.estado" /></td>
              </tr>
              <tr v-if="pagos.length === 0">
                <td colspan="5" class="text-center text-grey-6 text-caption q-py-xl">No hay pagos registrados</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <!-- Tab: Ajustes -->
        <div v-if="activeTab === 'ajustes'" class="fade-in">
          <h1 class="text-h5 text-weight-bold text-white q-mb-xs">Ajustes de Cuenta</h1>
          <p class="text-grey-5 text-caption q-mb-lg">Gestiona tu identidad cósmica y preferencias personales.</p>

          <div class="settings-section q-pa-lg q-mb-md">
            <div class="row items-center q-mb-lg">
              <q-icon name="person" color="primary" size="20px" class="q-mr-sm" />
              <span class="text-subtitle1 text-weight-bold text-white">Información Personal</span>
            </div>
            <div class="row q-gutter-md q-mb-md">
              <div class="col-12 col-sm-6">
                <label class="field-label">NOMBRE COMPLETO</label>
                <q-input v-model="editForm.nombre" outlined dark color="primary" class="custom-input" />
              </div>
              <div class="col-12 col-sm-6">
                <label class="field-label">CORREO ELECTRÓNICO</label>
                <q-input v-model="editForm.email" outlined dark color="primary" type="email" class="custom-input" />
              </div>
              <div class="col-12 col-sm-6">
                <label class="field-label">FECHA DE NACIMIENTO</label>
                <q-input v-model="editForm.fecha_nacimiento" outlined dark color="primary" type="date" class="custom-input" />
              </div>
              <div class="col-12 col-sm-6">
                <label class="field-label">PAÍS / REGIÓN</label>
                <q-select v-model="editForm.pais" outlined dark color="primary" :options="paises" class="custom-input" />
              </div>
            </div>
            <div class="text-right">
              <q-btn unelevated no-caps color="primary" label="Guardar Cambios" @click="guardarCambios" />
            </div>
          </div>

          <div class="settings-section q-pa-lg">
            <div class="row items-center q-mb-lg">
              <q-icon name="notifications" color="primary" size="20px" class="q-mr-sm" />
              <span class="text-subtitle1 text-weight-bold text-white">Preferencias de Notificación</span>
            </div>
            <div class="q-gutter-md">
              <div v-for="notif in notificaciones" :key="notif.key" class="notif-row row items-center justify-between q-pa-md">
                <div>
                  <div class="text-white text-body2 text-weight-medium">{{ notif.label }}</div>
                  <div class="text-grey-6 text-caption">{{ notif.desc }}</div>
                </div>
                <q-toggle v-model="notif.active" color="primary" />
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
import { useAuthStore } from '../../store/auth'
import { getData, putData } from '../../services/apiClient'

const router = useRouter()
const authStore = useAuthStore()
const usuario = computed(() => authStore.usuario)

const activeTab = ref('inicio')
const lecturas = ref([])
const pagos = ref([])
const loadingLecturas = ref(false)
const loadingPagos = ref(false)
const isCreatingLectura = ref(false)

const numeroCamino = ref(11)
const numeroDestino = ref(7)

const editForm = ref({
  nombre: usuario.value?.nombre || '',
  email: usuario.value?.email || '',
  fecha_nacimiento: '',
  pais: 'España'
})

const paises = ['España', 'México', 'Argentina', 'Colombia', 'Chile', 'Perú', 'Venezuela', 'Otro']

const notificaciones = ref([
  { key: 'diarias', label: 'Lecturas Diarias', desc: 'Recibe tu vibración numérica cada mañana.', active: true },
  { key: 'ofertas', label: 'Nuevas Ofertas y Servicios', desc: 'Sé el primero en saber sobre nuevas lecturas.', active: false },
  { key: 'astro', label: 'Eventos Astrológicos Críticos', desc: 'Alertas sobre fechas clave de alta vibración.', active: true },
])

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getLecturaIcon = (tipo) => {
  const icons = { 'principal': 'star', 'diaria': 'wb_sunny', 'pareja': 'favorite' }
  return icons[tipo] || 'auto_awesome'
}

const guardarCambios = async () => {
  try {
    if (usuario.value?._id) {
      await putData(`/usuarios/${usuario.value._id}`, editForm.value)
    }
  } catch (e) {
    console.error('Error guardando cambios:', e)
  }
}

const logout = () => {
  authStore.token = null
  authStore.usuario = null
  router.push('/login')
}

const crearNuevaLectura = async () => {
  if (!usuario.value?._id) return;
  isCreatingLectura.value = true;
  try {
    const response = await postData(`/lecturas/principal/${usuario.value._id}`, {});
    console.log('Lectura creada:', response);
    
    // Navegar a la vista detallada
    router.push('/lectura/' + response.lectura._id);
  } catch (error) {
    console.error('Error creando lectura:', error);
    alert(error?.response?.data?.error || 'No se pudo crear la lectura');
  } finally {
    isCreatingLectura.value = false;
  }
}


onMounted(async () => {
  if (usuario.value?._id) {
    loadingLecturas.value = true
    try {
      const res = await getData(`/lecturas/usuario/${usuario.value._id}`)
      lecturas.value = Array.isArray(res) ? res : (res.lecturas || [])
    } catch (e) {
      console.error('Error cargando lecturas:', e)
    } finally {
      loadingLecturas.value = false
    }

    loadingPagos.value = true
    try {
      const res = await getData(`/pagos/${usuario.value._id}`)
      pagos.value = Array.isArray(res) ? res : (res.pagos || [])
    } catch (e) {
      console.error('Error cargando pagos:', e)
    } finally {
      loadingPagos.value = false
    }
  }
})
</script>

<style scoped lang="sass">
.user-wrapper
  height: 100vh
  overflow: hidden

.user-sidebar
  width: 260px
  background: rgba(26, 26, 46, 0.95)
  border-right: 1px solid rgba(108, 92, 231, 0.2)
  z-index: 10

.user-main-area
  height: 100vh
  overflow-y: auto
  position: relative
  max-width: 1000px
  margin: 0 auto

.active-menu-item
  color: #6C5CE7
  background: rgba(108, 92, 231, 0.15)
  border-right: 3px solid #6C5CE7

.border-right
  border-right: 1px solid rgba(108, 92, 231, 0.2)
  
.fade-in
  animation: fadeIn 0.3s ease-in

@keyframes fadeIn
  from
    opacity: 0
    transform: translateY(5px)
  to
    opacity: 1
    transform: translateY(0)

.dashboard-grid
  display: grid
  grid-template-columns: 320px 1fr
  gap: 24px
  @media (max-width: 850px)
    grid-template-columns: 1fr

.profile-card
  background: rgba(26, 26, 60, 0.5)
  border: 1px solid rgba(108, 92, 231, 0.2)
  border-radius: 16px
  backdrop-filter: blur(10px)

.profile-avatar
  background: linear-gradient(135deg, rgba(108,92,231,0.6), rgba(162,155,254,0.4))
  border: 2px solid rgba(108,92,231,0.4)
  margin: 0 auto

.numero-badge
  background: rgba(108, 92, 231, 0.1)
  border: 1px solid rgba(108, 92, 231, 0.2)
  border-radius: 10px
  padding: 10px 8px

.numero-valor
  font-size: 28px
  font-weight: 800
  line-height: 1

.numero-label
  font-size: 9px
  font-weight: 600
  letter-spacing: 1px
  color: rgba(255,255,255,0.4)
  text-transform: uppercase
  margin-top: 4px

.esencia-card
  background: rgba(108, 92, 231, 0.08)
  border: 1px solid rgba(108, 92, 231, 0.2)
  border-radius: 10px

.lecturas-grid
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))
  gap: 16px

.lectura-card
  background: rgba(26, 26, 60, 0.4)
  border: 1px solid rgba(108, 92, 231, 0.2)
  border-radius: 12px
  transition: border-color 0.2s
  &:hover
    border-color: rgba(108, 92, 231, 0.5)

.lectura-card-locked
  background: rgba(26, 26, 60, 0.3)
  border: 1px dashed rgba(108, 92, 231, 0.25)
  border-radius: 12px
  opacity: 0.8

.activity-table
  background: rgba(26, 26, 60, 0.3)
  border: 1px solid rgba(108, 92, 231, 0.15)
  border-radius: 12px
  :deep(th), :deep(td)
    border-bottom: 1px solid rgba(108, 92, 231, 0.1)
    padding: 10px 16px

.settings-section
  background: rgba(26, 26, 60, 0.4)
  border: 1px solid rgba(108, 92, 231, 0.2)
  border-radius: 14px

.field-label
  display: block
  font-size: 11px
  font-weight: 600
  letter-spacing: 1px
  color: rgba(253, 203, 110, 0.7)
  text-transform: uppercase
  margin-bottom: 6px

.custom-input
  :deep(.q-field__control)
    background: rgba(15, 15, 40, 0.5)
  :deep(.q-field__native)
    color: white

.notif-row
  background: rgba(15, 15, 40, 0.4)
  border: 1px solid rgba(108, 92, 231, 0.15)
  border-radius: 10px

.text-mystic-gold
  color: #FDCB6E

.letter-spacing
  letter-spacing: 2px

.text-secondary
  color: #A29BFE
</style>
