<template>
  <div class="numerology-app">
    <!-- Fondo con efectos geométricos -->
    <div class="fixed-full bg-dark">
      <div class="geometric-bg absolute-full"></div>
      <div class="mystic-overlay absolute-full"></div>
      <div class="mystic-symbol" v-if="!loading">
        <svg class="full-width full-height text-mystic-gold" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" stroke-width="0.5"></circle>
          <circle cx="50" cy="50" fill="none" r="30" stroke="currentColor" stroke-width="0.5"></circle>
          <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke="currentColor" stroke-width="0.3"></path>
          <polygon fill="none" points="50,5 95,50 50,95 5,50" stroke="currentColor" stroke-width="0.3"></polygon>
        </svg>
      </div>
    </div>

    <!-- Navegación superior -->
    <nav class="sticky-nav glass-panel border-bottom-primary q-px-md q-py-sm">
      <div class="nav-content row justify-between items-center">
        <div class="row items-center q-gutter-sm cursor-pointer" @click="$router.push('/dashboard')">
          <q-icon name="arrow_back" color="primary" size="24px" />
          <span class="text-h6 text-weight-bold text-white text-uppercase" style="letter-spacing: -1px">AstraNumeros</span>
        </div>
        <div class="row items-center q-gutter-md">
          <q-btn flat no-caps color="white" icon="history" label="Mis Lecturas" class="hide-mobile" @click="$router.push('/dashboard')" />
          <q-btn unelevated no-caps color="primary" icon="download" label="Descargar PDF" class="shadow-btn text-weight-bold" />
          <q-avatar size="36px" color="primary" text-color="white" class="avatar-border">
            <q-icon name="person" size="18px" />
          </q-avatar>
        </div>
      </div>
    </nav>

    <!-- Contenido Principal -->
    <main class="main-container q-pa-lg q-ma-auto q-mt-xl">
      
      <div v-if="loading" class="text-center q-py-xl">
        <q-spinner-dots color="primary" size="60px" />
        <p class="text-grey-5 q-mt-md">Descifrando tu destino astronumérico...</p>
      </div>

      <div v-else class="fade-in">
        <!-- Hero Section -->
        <header class="text-center q-mb-xl">
          <div class="badge-informe q-mb-xl">INFORME PERSONALIZADO</div>
          <h1 class="hero-title text-white">
            Tu Destino <span class="text-primary text-italic">Revelado</span>
          </h1>
          <p class="hero-subtitle text-grey-5">
            Análisis vibracional para <span class="text-weight-bold text-white">{{ usuario?.nombre || 'Buscador de Luz' }}</span> <br/>
            Nacida el {{ formatDate(usuario?.fecha_nacimiento) || '14 de Mayo, 1988' }}
          </p>
        </header>

        <!-- Main Trinity Gauges -->
        <section class="trinity-grid q-mb-xl">
          <!-- Alma -->
          <div class="glass-panel gauge-card text-center">
            <div class="gauge-container q-mx-auto q-mb-md">
              <svg class="gauge-svg">
                <circle class="gauge-bg" cx="64" cy="64" r="58"></circle>
                <circle class="gauge-progress" cx="64" cy="64" r="58" stroke-dasharray="364" stroke-dashoffset="100"></circle>
              </svg>
              <span class="gauge-number number-glow">{{ numeroAlma }}</span>
            </div>
            <h3 class="gauge-title">Alma</h3>
            <p class="gauge-desc">Tus deseos internos más profundos.</p>
          </div>

          <!-- Personalidad -->
          <div class="glass-panel gauge-card text-center highlight-card">
            <div class="gauge-container q-mx-auto q-mb-md">
              <svg class="gauge-svg">
                <circle class="gauge-bg" cx="64" cy="64" r="58"></circle>
                <circle class="gauge-progress" cx="64" cy="64" r="58" stroke-dasharray="364" stroke-dashoffset="180"></circle>
              </svg>
              <span class="gauge-number number-glow">{{ numeroPersonalidad }}</span>
            </div>
            <h3 class="gauge-title">Personalidad</h3>
            <p class="gauge-desc">Cómo el mundo percibe tu energía.</p>
          </div>

          <!-- Destino -->
          <div class="glass-panel gauge-card text-center">
            <div class="gauge-container q-mx-auto q-mb-md">
              <svg class="gauge-svg">
                <circle class="gauge-bg" cx="64" cy="64" r="58"></circle>
                <circle class="gauge-progress" cx="64" cy="64" r="58" stroke-dasharray="364" stroke-dashoffset="60"></circle>
              </svg>
              <span class="gauge-number number-glow">{{ numeroDestino }}</span>
            </div>
            <h3 class="gauge-title">Destino</h3>
            <p class="gauge-desc">Tu propósito espiritual final.</p>
          </div>
        </section>

        <!-- Digital Scroll Reading -->
        <div class="scroll-container q-pa-lg q-mb-xl relative-position" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.05)">
          <div class="watermark-bg absolute-center" style="opacity: 0.05; pointer-events: none;">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4Dp9bR6cvG5zwI2GdO6mOaHMyt4FrEkHuyPVn8N-MUaVMEhnP59rC2o4n_w591s6ehBCICN576dBfACXYGXOwD6cug3ta3iMV7Vjx_SXx-Z6nPqICKoJg1zpjmFu6eWvAI3gZo5T2JiGIyWFqzo4iN1EDFab5T3s3PqHajto5GGHlowSjLbzkqk7ppGvp2p-D35KXDsfDiDRvYMNc3EfCrTgYPCnta3BtgoOqsIpZPcmKy0XDE2mgCO5gM7X_8P_UJqK5APbPWmg" style="width: 800px; height: 800px; filter: invert(1);" />
          </div>
          
          <div class="relative-position z-10 w-full" style="max-width: 100%;">
            <!-- Section 1 -->
            <article class="q-mb-xl">
              <div class="row items-center q-gutter-md q-mb-xl">
                <div class="col h-divider"></div>
                <q-icon name="auto_fix_high" color="primary" size="24px" />
                <div class="col h-divider"></div>
              </div>
              
              <h2 class="text-h4 text-weight-bold text-center text-white text-italic q-mb-lg">El Camino del Buscador Eterno</h2>
              
              <div class="reading-prose text-grey-4 text-body1" style="font-size: 1.1rem; line-height: 1.8;">
                <p class="q-mb-md" style="white-space: pre-wrap;">{{ lectura?.contenido || 'Tu número vital indica una profunda necesidad de exploración interna. Tu intuición es tu mayor herramienta; úsala para navegar los desafíos que se presentarán en el próximo ciclo lunar.' }}</p>
                <p>Las personas con esta vibración suelen ser vistas como misteriosas. Tu intuición es tu mayor herramienta; úsala para navegar los desafíos que se presentarán en el próximo ciclo lunar.</p>
              </div>
            </article>

            <!-- Section 2: Visual Insight -->
            <div class="insight-box glass-panel q-pa-xl q-mb-xl row items-center q-gutter-xl" style="background: rgba(50, 17, 212, 0.05)">
              <div class="col-12 col-md">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbq6E16bGU_K9nUwMxjg_e-Jg08Hxg5loFNM9TWMYnAlV1IEDOumS0LcHpxlaaB-088Q17OX63lVpc7fmH9ETs-2k2s6wqa3U-VJ5dDeRMHA07NX_DVQcO2qdKWguUjqjZoozijPcRkdHZeVEWmXA49YRfEHqpDbVnsFStQouFZziFLDpE2KPVZvgIVfe74Wjj5abKLlrH92PO6TaiSmAbzRxBSAt2h8felxlwn4BbUnXR6IzrWIzAXWybc2SvfMzwzr109716xac" class="insight-img shadow-24" />
              </div>
              <div class="col-12 col-md-7">
                <h4 class="text-primary text-weight-bold text-uppercase q-mb-sm insight-label" style="letter-spacing: 0.3em; font-size: 12px;">Consejo Espiritual</h4>
                <p class="text-h5 text-white text-weight-medium text-italic">"El silencio no es la ausencia de sonido, sino la presencia de la claridad."</p>
                
                <div class="row q-mt-lg q-gutter-lg">
                  <div class="column">
                    <span class="text-h4 text-weight-bold text-white">88%</span>
                    <span class="text-caption text-uppercase text-grey-6" style="font-size: 10px;">Afinidad Estelar</span>
                  </div>
                  <div class="v-divider bg-primary" style="width: 1px; height: 50px; opacity: 0.2"></div>
                  <div class="column">
                    <span class="text-h4 text-weight-bold text-white">V</span>
                    <span class="text-caption text-uppercase text-grey-6" style="font-size: 10px;">Fase de Energía</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Premium Upsell -->
            <div class="upsell-section q-pt-xl q-mt-xl" style="border-top: 2px dashed rgba(50, 17, 212, 0.2)">
              <div class="upsell-card text-center q-pa-xl relative-position overflow-hidden" style="background: linear-gradient(135deg, #3211d4 0%, #312e81 100%); border-radius: 16px;">
                <div class="upsell-icon absolute-top-right q-pa-lg" style="opacity: 0.2;">
                  <q-icon name="diamond" size="100px" color="white" />
                </div>
                <h3 class="text-h3 text-weight-bold text-white q-mb-md">Desbloquea tu Mapa Kármico 2024</h3>
                <p class="text-white q-mb-xl text-h6" style="opacity: 0.8; max-width: 600px; margin: 0 auto; line-height: 1.4;">
                  Obtén una lectura premium de 50 páginas que incluye deudas kármicas, compatibilidad amorosa detallada y pronóstico mes a mes.
                </p>
                <div class="row justify-center q-gutter-md">
                  <q-btn unelevated no-caps color="white" text-color="primary" class="text-weight-bold q-px-xl q-py-md upscale-btn text-h6" label="Obtener Premium por $29" />
                  <q-btn outline no-caps color="white" class="text-weight-bold q-px-xl q-py-md text-h6" label="Ver demo gratis" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="q-py-xl text-center text-grey-6 text-caption">
      <div class="row justify-center q-gutter-lg q-mb-md">
        <a href="#" class="text-grey-5" style="text-decoration: none;">Términos</a>
        <a href="#" class="text-grey-5" style="text-decoration: none;">Privacidad</a>
        <a href="#" class="text-grey-5" style="text-decoration: none;">Soporte</a>
      </div>
      <p>© 2024 AstraNumeros. Todos los derechos reservados. Las lecturas son para fines de entretenimiento y guía espiritual.</p>
    </footer>

    <!-- Floating Action Button -->
    <q-btn fab icon="share" color="primary" class="shadow-24 fixed-bottom-right q-ma-lg" size="lg" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getData } from '../../services/apiClient'
import { useAuthStore } from '../../store/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const lectura = ref(null)
const usuario = computed(() => authStore.usuario)

// Extraer el numero del texto si es generado por IA
const numeroDestino = computed(() => {
  if (!lectura.value?.contenido) return 11;
  const match = lectura.value.contenido.match(/Camino de Vida es (\d+)/);
  if (match) return parseInt(match[1]);
  // Buscar cualquier número
  const anyMatch = lectura.value.contenido.match(/\b([1-9]|11|22|33)\b/);
  return anyMatch ? parseInt(anyMatch[1]) : 11;
})

const numeroAlma = computed(() => (numeroDestino.value + 2) % 9 || 7)
const numeroPersonalidad = computed(() => (numeroDestino.value + 5) % 9 || 5)

const formatDate = (date) => {
  if (!date) return '14 de Mayo, 1988'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

onMounted(async () => {
  const id = route.params.id
  if (id) {
    try {
      const resp = await getData('/lecturas/' + id)
      lectura.value = resp
    } catch (error) {
      console.error('Error al cargar la lectura:', error)
    } finally {
      loading.value = false
    }
  } else {
    loading.value = false
  }
})
</script>

<style scoped lang="sass">
.numerology-app
  position: relative
  min-height: 100vh
  background: #131022
  color: #fff
  font-family: 'Inter', sans-serif

.fixed-full
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 0

.geometric-bg
  background: radial-gradient(circle at 20% 50%, rgba(50, 17, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(108, 92, 231, 0.1) 0%, transparent 50%)
  z-index: 1

.mystic-overlay
  background: linear-gradient(135deg, rgba(19, 16, 34, 0.9) 0%, rgba(26, 26, 46, 0.8) 50%, rgba(19, 16, 34, 0.95) 100%)
  z-index: 2

.mystic-symbol
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  width: 600px
  height: 600px
  opacity: 0.05
  z-index: 3
  animation: float 15s ease-in-out infinite

.text-mystic-gold
  color: #FDCB6E

.sticky-nav
  position: sticky
  top: 0
  z-index: 50
  backdrop-filter: blur(12px)

.glass-panel
  background: rgba(19, 16, 34, 0.7)
  backdrop-filter: blur(12px)
  border: 1px solid rgba(50, 17, 212, 0.2)
  border-radius: 12px

.border-bottom-primary
  border-bottom: 1px solid rgba(50, 17, 212, 0.2)

.nav-content
  max-width: 1200px
  margin: 0 auto

.shadow-btn
  box-shadow: 0 4px 14px 0 rgba(50, 17, 212, 0.39)

.avatar-border
  border: 1px solid rgba(50, 17, 212, 0.4)
  background: rgba(50, 17, 212, 0.2)

.main-container
  position: relative
  z-index: 10
  max-width: 900px
  margin: 0 auto

.badge-informe
  display: inline-block
  padding: 6px 16px
  border-radius: 50px
  background: rgba(50, 17, 212, 0.1)
  border: 1px solid rgba(50, 17, 212, 0.2)
  color: #8c78f1
  font-size: 11px
  font-weight: 700
  letter-spacing: 0.2em

.hero-title
  font-size: 3.5rem
  font-weight: 800
  letter-spacing: -1px
  line-height: 1.1
  margin-bottom: 16px
  @media (min-width: 768px)
    font-size: 4rem

.hero-subtitle
  font-size: 1.2rem
  max-width: 600px
  margin: 0 auto

.trinity-grid
  display: grid
  grid-template-columns: 1fr
  gap: 32px
  @media (min-width: 768px)
    grid-template-columns: repeat(3, 1fr)

.gauge-card
  padding: 32px
  display: flex
  flex-direction: column
  align-items: center

.highlight-card
  transform: scale(1.05)
  box-shadow: 0 20px 40px rgba(50, 17, 212, 0.15)
  border: 2px solid rgba(50, 17, 212, 0.4)

.gauge-container
  position: relative
  width: 128px
  height: 128px

.gauge-svg
  width: 100%
  height: 100%
  transform: rotate(-90deg)

.gauge-bg
  fill: transparent
  stroke: rgba(50, 17, 212, 0.1)
  stroke-width: 6

.gauge-progress
  fill: transparent
  stroke: #3211d4
  stroke-width: 8

.gauge-number
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  font-size: 36px
  font-weight: 900

.number-glow
  text-shadow: 0 0 15px rgba(50, 17, 212, 0.6)

.gauge-title
  font-size: 14px
  font-weight: 700
  text-transform: uppercase
  letter-spacing: 2px
  color: #8c78f1
  margin-top: 16px
  margin-bottom: 8px
  line-height: 1

.gauge-desc
  font-size: 12px
  color: #94a3b8

.scroll-container
  background: linear-gradient(180deg, rgba(19, 16, 34, 1) 0%, rgba(25, 20, 50, 1) 100%)
  box-shadow: 0 0 40px rgba(50, 17, 212, 0.1)

.h-divider
  height: 1px
  background: rgba(50, 17, 212, 0.2)

.insight-img
  width: 100%
  height: 250px
  object-fit: cover
  border-radius: 8px

.upscale-btn
  border-radius: 8px
  transition: all 0.3s
  &:hover
    background: #f1f5f9
    transform: translateY(-2px)

.fade-in
  animation: fadeIn 0.4s ease-in

@keyframes fadeIn
  from
    opacity: 0
    transform: translateY(10px)
  to
    opacity: 1
    transform: translateY(0)
</style>
