<template>
  <q-page class="admin-page q-pa-lg">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <div class="text-h5 text-weight-bold text-white">Ajustes del Sistema</div>
        <div class="text-caption text-grey-6">Configuración global de la plataforma</div>
      </div>
      <q-btn unelevated no-caps color="primary" label="Guardar Cambios" icon="save" @click="guardar" />
    </div>

    <div class="settings-grid">
      <!-- Configuración del Sistema -->
      <div class="settings-card q-pa-lg">
        <div class="row items-center q-mb-lg">
          <q-icon name="settings" color="primary" size="20px" class="q-mr-sm" />
          <span class="text-subtitle1 text-weight-bold text-white">Configuración del Sistema</span>
        </div>
        <div class="q-gutter-md">
          <div>
            <label class="field-label">TARIFA BASE DE LECTURA (USD)</label>
            <q-input v-model="config.tarifaBase" outlined dark color="primary" class="custom-input" type="number" />
          </div>
          <div>
            <label class="field-label">MONEDA PRINCIPAL</label>
            <q-select v-model="config.moneda" outlined dark color="primary" :options="monedas" class="custom-input" />
          </div>
          <div class="row items-center justify-between notif-row q-pa-md">
            <div>
              <div class="text-white text-body2 text-weight-medium">Mantenimiento Activo</div>
              <div class="text-grey-6 text-caption">Desactiva el acceso a usuarios finales</div>
            </div>
            <q-toggle v-model="config.mantenimiento" color="primary" />
          </div>
        </div>
      </div>

      <!-- Gestión de Equipo -->
      <div class="settings-card q-pa-lg">
        <div class="row items-center q-mb-lg">
          <q-icon name="group" color="primary" size="20px" class="q-mr-sm" />
          <span class="text-subtitle1 text-weight-bold text-white">Gestión de Equipo</span>
        </div>
        <div class="q-gutter-sm">
          <div v-for="miembro in equipo" :key="miembro.nombre" class="miembro-card q-pa-md row items-center">
            <q-avatar size="40px" class="miembro-avatar q-mr-md">
              <q-icon name="person" color="white" size="20px" />
            </q-avatar>
            <div class="col">
              <div class="text-white text-caption text-weight-bold">{{ miembro.nombre }}</div>
              <div class="text-grey-6" style="font-size:10px; text-transform:uppercase; letter-spacing:1px">{{ miembro.rol }}</div>
            </div>
            <q-btn flat round icon="delete" color="grey-6" size="sm" @click="eliminarMiembro(miembro)" />
          </div>
          <q-btn flat no-caps color="primary" icon="person_add" label="Añadir Miembro del Equipo" class="full-width q-mt-sm" />
        </div>
      </div>

      <!-- Integraciones de Pago -->
      <div class="settings-card q-pa-lg">
        <div class="row items-center q-mb-lg">
          <q-icon name="credit_card" color="primary" size="20px" class="q-mr-sm" />
          <span class="text-subtitle1 text-weight-bold text-white">Integraciones de Pago</span>
        </div>
        <div class="q-gutter-md">
          <div class="integracion-card q-pa-md">
            <div class="row items-center justify-between q-mb-sm">
              <div class="row items-center q-gutter-sm">
                <q-icon name="credit_card" color="blue-4" size="20px" />
                <span class="text-white text-weight-medium">Stripe</span>
              </div>
              <q-toggle v-model="config.stripeActivo" color="primary" />
            </div>
            <q-input v-if="config.stripeActivo" v-model="config.stripeKey" outlined dark color="primary" type="password" placeholder="sk_live_..." class="custom-input" dense />
          </div>
          <div class="integracion-card q-pa-md">
            <div class="row items-center justify-between q-mb-sm">
              <div class="row items-center q-gutter-sm">
                <q-icon name="account_balance" color="blue-6" size="20px" />
                <span class="text-white text-weight-medium">PayPal</span>
              </div>
              <q-toggle v-model="config.paypalActivo" color="primary" />
            </div>
            <q-input v-if="config.paypalActivo" v-model="config.paypalClientId" outlined dark color="primary" placeholder="Client ID" class="custom-input" dense />
          </div>
        </div>
      </div>

      <!-- Personalización de Marca -->
      <div class="settings-card q-pa-lg">
        <div class="row items-center q-mb-lg">
          <q-icon name="palette" color="primary" size="20px" class="q-mr-sm" />
          <span class="text-subtitle1 text-weight-bold text-white">Personalización de Marca</span>
        </div>
        <div class="row q-gutter-md">
          <div class="col-12">
            <label class="field-label">LOGO DEL SITIO</label>
            <div class="logo-upload q-pa-xl text-center">
              <q-icon name="upload_file" size="32px" color="grey-6" />
              <div class="text-caption text-grey-6 q-mt-sm">PNG, SVG (Max 2MB)</div>
            </div>
          </div>
          <div class="col-12 row q-gutter-md">
            <div class="col">
              <label class="field-label">COLOR PRIMARIO</label>
              <div class="color-preview row items-center q-gutter-sm q-mt-xs">
                <div class="color-dot" style="background:#6C5CE7"></div>
                <span class="text-white text-caption">#6C5CE7</span>
              </div>
            </div>
            <div class="col">
              <label class="field-label">COLOR DE ACENTO</label>
              <div class="color-preview row items-center q-gutter-sm q-mt-xs">
                <div class="color-dot" style="background:#A29BFE"></div>
                <span class="text-white text-caption">#A29BFE</span>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="notif-row row items-center justify-between q-pa-md">
              <div>
                <div class="text-white text-body2 text-weight-medium">Modo Oscuro Forzado</div>
                <div class="text-grey-6 text-caption">Los usuarios no podrán cambiar el tema</div>
              </div>
              <q-toggle v-model="config.modoOscuroForzado" color="primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const config = ref({
  tarifaBase: 45.00,
  moneda: 'USD - Dólar Estadounidense',
  mantenimiento: false,
  stripeActivo: true,
  stripeKey: '••••••••••••••',
  paypalActivo: false,
  paypalClientId: '',
  modoOscuroForzado: true,
})

const monedas = ['USD - Dólar Estadounidense', 'EUR - Euro', 'MXN - Peso Mexicano', 'COP - Peso Colombiano']

const equipo = ref([
  { nombre: 'Javier Morales', rol: 'Numerólogo Senior' },
  { nombre: 'Carla Benítez', rol: 'Administrador de Contenido' },
])

const eliminarMiembro = (miembro) => {
  equipo.value = equipo.value.filter(m => m.nombre !== miembro.nombre)
}

const guardar = () => {
  $q.notify({ type: 'positive', message: 'Configuración guardada exitosamente', position: 'top-right' })
}
</script>

<style scoped lang="sass">
.admin-page
  max-width: 1200px
  margin: 0 auto

.settings-grid
  display: grid
  grid-template-columns: repeat(2, 1fr)
  gap: 20px
  @media (max-width: 800px)
    grid-template-columns: 1fr

.settings-card
  background: rgba(26, 26, 60, 0.5)
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

.miembro-card
  background: rgba(15, 15, 40, 0.5)
  border: 1px solid rgba(108, 92, 231, 0.15)
  border-radius: 10px

.miembro-avatar
  background: rgba(108, 92, 231, 0.3)
  border: 2px solid rgba(108, 92, 231, 0.3)

.integracion-card
  background: rgba(15, 15, 40, 0.5)
  border: 1px solid rgba(108, 92, 231, 0.15)
  border-radius: 10px

.notif-row
  background: rgba(15, 15, 40, 0.4)
  border: 1px solid rgba(108, 92, 231, 0.15)
  border-radius: 10px

.logo-upload
  background: rgba(15, 15, 40, 0.4)
  border: 2px dashed rgba(108, 92, 231, 0.25)
  border-radius: 10px
  cursor: pointer
  transition: border-color 0.2s
  &:hover
    border-color: rgba(108, 92, 231, 0.5)

.color-dot
  width: 24px
  height: 24px
  border-radius: 6px
  border: 2px solid rgba(255,255,255,0.2)
</style>
