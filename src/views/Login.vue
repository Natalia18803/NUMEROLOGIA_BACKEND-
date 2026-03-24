<template>
  <div class="numerology-app">
    <!-- Fondo con efectos geométricos -->
    <div class="fixed-full bg-dark">
      <div class="geometric-bg absolute-full"></div>
      <div class="mystic-overlay absolute-full"></div>
      <div class="mystic-symbol">
        <svg class="full-width full-height text-mystic-gold" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" stroke-width="0.5"></circle>
          <circle cx="50" cy="50" fill="none" r="30" stroke="currentColor" stroke-width="0.5"></circle>
          <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke="currentColor" stroke-width="0.3"></path>
          <polygon fill="none" points="50,5 95,50 50,95 5,50" stroke="currentColor" stroke-width="0.3"></polygon>
        </svg>
      </div>
    </div>

    <!-- Elementos decorativos flotantes -->
    <div class="floating-circle floating-circle-1"></div>
    <div class="floating-circle floating-circle-2"></div>

    <!-- Contenido principal -->
    <div class="login-container">
      <!-- Header -->
      <div class="text-center q-mb-lg">
        <div class="logo-container q-mx-auto q-mb-md">
          <q-icon name="auto_awesome" size="48px" color="primary" />
        </div>
        <h1 class="text-h3 text-weight-bold text-white q-mb-sm">Numerología</h1>
        <p class="text-mystic-gold text-caption text-weight-medium text-uppercase letter-spacing">
          Descubre tu destino en los números
        </p>
      </div>

      <!-- Card principal -->
      <q-card class="login-card">
        <q-card-section class="q-pb-none">
          <h2 class="text-h5 text-weight-semibold text-white q-mb-xs">Bienvenido al Oráculo</h2>
          <p class="text-grey-5 text-caption">Ingresa tus credenciales para continuar tu viaje.</p>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="handleLogin" class="q-gutter-md">
            <!-- Selector de rol -->
            <div class="role-selector-wrapper">
              <q-btn-toggle
                v-model="role"
                spread
                no-caps
                unelevated
                toggle-color="primary"
                text-color="grey-5"
                class="role-selector"
                :options="[
                  { label: 'Usuario', value: 'usuario', icon: 'person', slot: 'usuario' },
                  { label: 'Administrador', value: 'admin', icon: 'admin_panel_settings', slot: 'admin' }
                ]"
              >
                
              </q-btn-toggle>
            </div>

            <!-- Email -->
            <div>
              <label class="field-label">CORREO ELECTRÓNICO</label>
              <q-input
                v-model="email"
                type="email"
                outlined
                dark
                color="primary"
                placeholder="tu@email.com"
                bg-color="input-bg"
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="alternate_email" color="grey-7" size="18px" />
                </template>
              </q-input>
            </div>

            <!-- Contraseña -->
            <div>
              <div class="row items-center justify-between q-mb-xs">
                <label class="field-label">CONTRASEÑA</label>
                <a href="#" class="text-primary text-caption text-weight-medium forgot-link">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <q-input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                outlined
                dark
                color="primary"
                placeholder="••••••••"
                bg-color="input-bg"
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="grey-7" size="18px" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    color="grey-7"
                    size="18px"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
            </div>

            <!-- Remember me -->
            <q-checkbox
              v-model="rememberMe"
              label="Recuerda mis credenciales"
              dark
              color="primary"
              class="text-grey-5"
            />

            <!-- Botón login -->
            <q-btn
              type="submit"
              label="Ingresar"
              size="lg"
              color="primary"
              class="full-width text-weight-bold"
              :loading="isLoading"
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Ingresando...
              </template>
            </q-btn>

          </q-form>
        </q-card-section>

        <!-- Enlace a crear cuenta -->
        <q-card-section class="text-center q-pt-sm">
          <p class="text-grey-5 text-caption">
            ¿No tienes cuenta?
            <router-link to="/crear-cuenta" class="text-primary text-weight-medium signup-link">
              Crea una aquí
            </router-link>
          </p>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { postData } from '../services/apiClient.js'
import { useAuthStore } from '../store/auth'
import { useNotify } from '../composables/useNotify.js'

const router = useRouter()
const authStore = useAuthStore()
const { notifySuccess, notifyError, notifyWarning } = useNotify()
const role = ref('usuario')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    notifyWarning('Campos incompletos', 'Por favor completa tu correo y contraseña.')
    return
  }
  
  isLoading.value = true
  
  try {
    const response = await postData('/auth/login', {
      email: email.value,
      password: password.value,
      rol: role.value
    })
    
    console.log('Login exitoso:', response)
    
    // Guardar token en el store de auth
    authStore.token = response.token || ''
    authStore.usuario = response.usuario || null
    
    // Redirigir según el rol devuelto por el servidor (ya validado por el backend)
    if (response.usuario && response.usuario.rol === 'admin') {
      router.push('/admin')
    } else if (response.usuario) {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Error en login:', error)
    notifyError(
      error.response?.data?.error || 'Error al iniciar sesión',
      'Verifica tus credenciales e intenta nuevamente.'
    )
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="sass">
.numerology-app
  position: relative
  min-height: 100vh
  display: flex
  align-items: center
  justify-content: center
  overflow: hidden

.fixed-full
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: -2

.geometric-bg
  background: radial-gradient(circle at 20% 50%, rgba(108, 92, 231, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(162, 155, 254, 0.1) 0%, transparent 50%)
  z-index: -2

.mystic-overlay
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(35, 42, 76, 0.8) 50%, rgba(26, 26, 46, 0.8) 100%)
  z-index: -1

.mystic-symbol
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  width: 600px
  height: 600px
  opacity: 0.05
  z-index: -1
  animation: float 15s ease-in-out infinite

.floating-circle
  position: fixed
  border-radius: 50%
  background: radial-gradient(circle at 30% 30%, rgba(108, 92, 231, 0.3), transparent 70%)
  filter: blur(40px)
  z-index: -1

.floating-circle-1
  width: 300px
  height: 300px
  top: -100px
  right: -100px
  animation: float 20s ease-in-out infinite

.floating-circle-2
  width: 250px
  height: 250px
  bottom: -80px
  left: -80px
  animation: float 25s ease-in-out infinite reverse

@keyframes float
  0%, 100%
    transform: translate(0, 0)
  25%
    transform: translate(30px, -30px)
  50%
    transform: translate(-30px, 30px)
  75%
    transform: translate(-30px, -30px)

.login-container
  position: relative
  z-index: 1
  width: 100%
  max-width: 450px
  padding: 20px
  margin: 0 auto

.login-card
  background: rgba(26, 26, 46, 0.7)
  border: 1px solid rgba(108, 92, 231, 0.2)
  border-radius: 15px
  backdrop-filter: blur(10px)
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 40px rgba(108, 92, 231, 0.1)

.role-selector-wrapper
  margin-bottom: 12px

.role-selector
  background: rgba(108, 92, 231, 0.1)
  border: 1px solid rgba(108, 92, 231, 0.3)
  border-radius: 8px
  padding: 4px
  :deep(.q-btn)
    border-radius: 6px
    font-size: 13px
    padding: 8px 16px

.field-label
  display: block
  font-size: 12px
  font-weight: 600
  letter-spacing: 1px
  color: rgba(253, 203, 110, 0.8)
  text-transform: uppercase
  margin-bottom: 8px

.custom-input
  :deep(.q-field__control)
    background-color: rgba(26, 26, 46, 0.5)
  :deep(.q-field__native)
    color: #fff
  :deep(.q-field__native::placeholder)
    color: rgba(255, 255, 255, 0.4)
  :deep(.q-field__input)
    color: #fff
  :deep(.q-field__input::placeholder)
    color: rgba(255, 255, 255, 0.4)

.forgot-link
  transition: color 0.3s ease
  text-decoration: none
  &:hover
    color: #a29bfe

.signup-link
  text-decoration: none
  transition: color 0.3s ease
  &:hover
    text-decoration: underline
    color: #a29bfe

.text-mystic-gold
  color: #FDCB6E

.letter-spacing
  letter-spacing: 2px

@media (max-width: 600px)
  .login-container
    max-width: 100%
    padding: 15px
  .mystic-symbol
    width: 300px
    height: 300px
  .text-h3
    font-size: 24px !important
</style>
