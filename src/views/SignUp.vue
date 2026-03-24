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
    <div class="signup-container">
      <!-- Header -->
      <div class="text-center q-mb-lg">
        <div class="logo-container q-mx-auto q-mb-md">
          <q-icon name="auto_awesome" size="48px" color="primary" />
        </div>
        <h1 class="text-h3 text-weight-bold text-white q-mb-sm">Numerología</h1>
        <p class="text-mystic-gold text-caption text-weight-medium text-uppercase letter-spacing">
          Crea tu cuenta y descubre tu destino
        </p>
      </div>

      <!-- Card principal -->
      <q-card class="signup-card">
        <q-card-section class="q-pb-none">
          <h2 class="text-h5 text-weight-semibold text-white q-mb-xs">Crear Nueva Cuenta</h2>
          <p class="text-grey-5 text-caption">Completa los datos para iniciar tu viaje numerológico.</p>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent class="q-gutter-md">
            <!-- Nombre Completo -->
            <div>
              <label class="field-label">NOMBRE COMPLETO</label>
              <q-input
                v-model="fullName"
                outlined
                dark
                color="primary"
                placeholder="Tu nombre completo"
                bg-color="input-bg"
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="person" color="grey-7" size="18px" />
                </template>
              </q-input>
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
              <label class="field-label">CONTRASEÑA</label>
              <q-input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                outlined
                dark
                color="primary"
                placeholder="Mínimo 8 caracteres"
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
              <p class="text-caption text-grey-6 q-mt-xs">{{ passwordStrength }}</p>
            </div>

            <!-- Confirmar Contraseña -->
            <div>
              <label class="field-label">CONFIRMAR CONTRASEÑA</label>
              <q-input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                outlined
                dark
                color="primary"
                placeholder="Repite tu contraseña"
                bg-color="input-bg"
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="grey-7" size="18px" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    color="grey-7"
                    size="18px"
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </q-input>
              <p v-if="passwordsMatch === false" class="text-caption text-negative q-mt-xs">
                Las contraseñas no coinciden
              </p>
            </div>

            <!-- Fecha de Nacimiento -->
            <div>
              <label class="field-label">FECHA DE NACIMIENTO</label>
              <q-input
                v-model="birthDate"
                type="date"
                outlined
                dark
                color="primary"
                bg-color="input-bg"
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="event" color="grey-7" size="18px" />
                </template>
              </q-input>
            </div>

            <!-- Selector de rol -->
            <div class="role-selector-wrapper">
              <label class="field-label q-mb-md">TIPO DE CUENTA</label>
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
                <template v-slot:usuario>
                  <div class="row items-center no-wrap">
                    <q-icon name="person" size="18px" class="q-mr-xs" />
                    <div>Usuario</div>
                  </div>
                </template>
                <template v-slot:admin>
                  <div class="row items-center no-wrap">
                    <q-icon name="admin_panel_settings" size="18px" class="q-mr-xs" />
                    <div>Administrador</div>
                  </div>
                </template>
              </q-btn-toggle>
            </div>

            <!-- Términos y condiciones -->
            <q-checkbox
              v-model="acceptTerms"
              dark
              color="primary"
              class="text-grey-5"
            >
              <span class="text-caption">
                Acepto los
                <a href="#" class="text-primary terms-link">términos y condiciones</a>
              </span>
            </q-checkbox>

            <!-- Botón crear cuenta -->
            <q-btn
              type="submit"
              label="Crear Cuenta"
              size="lg"
              color="primary"
              class="full-width text-weight-bold"
              :disable="!acceptTerms || !isFormValid"
              @click="handleSignUp"
            />
          </q-form>
        </q-card-section>

        <!-- Enlace a login -->
        <q-card-section class="text-center q-pt-sm">
          <p class="text-grey-5 text-caption">
            ¿Ya tienes cuenta?
            <router-link to="/login" class="text-primary text-weight-medium login-link">
              Inicia sesión aquí
            </router-link>
          </p>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { postData } from '../services/apiClient.js'
import { useNotify } from '../composables/useNotify.js'

const router = useRouter()
const { notifySuccess, notifyError, notifyWarning } = useNotify()
const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const birthDate = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const role = ref('usuario')
const acceptTerms = ref(false)
const isLoading = ref(false)

const passwordStrength = computed(() => {
  if (!password.value) return ''
  if (password.value.length < 8) return 'Contraseña muy corta (mín. 8 caracteres)'
  if (password.value.length < 12) return 'Contraseña débil'
  if (/[A-Z]/.test(password.value) && /[0-9]/.test(password.value)) return 'Contraseña fuerte'
  return 'Contraseña media'
})

const passwordsMatch = computed(() => {
  if (!confirmPassword.value) return null
  return password.value === confirmPassword.value
})

const isFormValid = computed(() => {
  return (
    fullName.value.trim() !== '' &&
    email.value.trim() !== '' &&
    password.value !== '' &&
    confirmPassword.value !== '' &&
    birthDate.value !== '' &&
    passwordsMatch.value === true
  )
})

const handleSignUp = async () => {
  if (!isFormValid.value) {
    notifyWarning('Formulario incompleto', 'Completa todos los campos antes de continuar.')
    return
  }

  isLoading.value = true

  try {
    const response = await postData('/auth/registro', {
      nombre: fullName.value,
      email: email.value,
      password: password.value,
      fecha_nacimiento: birthDate.value,
      rol: role.value
    })

    console.log('Registro exitoso:', response)
    notifySuccess('¡Bienvenido al Oráculo! ✨', 'Tu cuenta ha sido creada. Ya puedes iniciar sesión.')
    router.push('/login')
  } catch (error) {
    console.error('Error en registro:', error)
    notifyError(
      error.response?.data?.error || 'Error al crear la cuenta',
      'Intenta de nuevo o contacta soporte.'
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

.signup-container
  position: relative
  z-index: 1
  width: 100%
  max-width: 500px
  padding: 20px
  margin: 0 auto

.signup-card
  background: rgba(26, 26, 46, 0.7)
  border: 1px solid rgba(108, 92, 231, 0.2)
  border-radius: 15px
  backdrop-filter: blur(10px)
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 40px rgba(108, 92, 231, 0.1)
  max-height: 90vh
  overflow-y: auto

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

.terms-link
  text-decoration: none
  transition: color 0.3s ease
  &:hover
    text-decoration: underline
    color: #a29bfe

.login-link
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
  .signup-container
    max-width: 100%
    padding: 15px
    max-height: 100vh
  .signup-card
    max-height: 100vh
  .mystic-symbol
    width: 300px
    height: 300px
  .text-h3
    font-size: 24px !important
</style>
