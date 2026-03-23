<template>
  <q-page class="admin-page q-pa-lg">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <div class="text-h5 text-weight-bold text-white">Centro de Soporte</div>
        <div class="text-caption text-grey-6">Atención al usuario y resolución de dudas</div>
      </div>
      <div class="row items-center q-gutter-sm">
        <div class="estado-red q-pa-sm q-px-md">
          <div class="text-caption text-grey-6" style="font-size:9px">Estado de Red</div>
          <div class="text-positive text-caption text-weight-bold">CONEXIÓN SEGURA</div>
        </div>
        <q-btn flat round icon="notifications" color="grey-5" />
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid q-mb-xl">
      <div class="kpi-card q-pa-lg">
        <div class="text-caption text-grey-6 text-uppercase letter-spacing q-mb-xs">Tickets Abiertos</div>
        <div class="text-h4 text-weight-bold text-white">{{ ticketsAbiertos }}</div>
        <q-badge color="warning" label="Activos" class="q-mt-xs" />
      </div>
      <div class="kpi-card q-pa-lg">
        <div class="text-caption text-grey-6 text-uppercase letter-spacing q-mb-xs">Tiempo de Respuesta</div>
        <div class="text-h4 text-weight-bold text-white">1h 12m</div>
        <div class="text-positive text-caption q-mt-xs">-10% hoy</div>
      </div>
      <div class="kpi-card q-pa-lg">
        <div class="text-caption text-grey-6 text-uppercase letter-spacing q-mb-xs">Satisfacción del Cliente</div>
        <div class="text-h4 text-weight-bold text-white">98.2%</div>
        <q-badge color="positive" label="Excelente" class="q-mt-xs" />
      </div>
    </div>

    <!-- Split panel -->
    <div class="soporte-grid">
      <!-- Bandeja de entrada -->
      <div class="bandeja-card q-pa-lg">
        <div class="row items-center justify-between q-mb-lg">
          <div class="text-subtitle1 text-weight-bold text-white">Bandeja de Entrada</div>
          <div class="row q-gutter-xs">
            <q-btn unelevated no-caps size="xs" color="primary" label="Todos" />
            <q-btn outline no-caps size="xs" color="warning" label="Urgentes" />
          </div>
        </div>
        <div class="q-gutter-sm">
          <div
            v-for="ticket in tickets"
            :key="ticket.id"
            class="ticket-item q-pa-md cursor-pointer"
            :class="{ 'ticket-selected': ticketSeleccionado?.id === ticket.id }"
            @click="seleccionarTicket(ticket)"
          >
            <div class="row items-center q-gutter-sm q-mb-xs">
              <q-avatar size="36px" :color="ticket.color" text-color="white">
                <q-icon name="person" size="18px" />
              </q-avatar>
              <div class="col">
                <div class="text-white text-caption text-weight-bold">{{ ticket.usuario }}</div>
                <div class="text-grey-5 text-caption" style="font-size:11px">{{ ticket.asunto }}</div>
              </div>
              <div class="text-grey-7" style="font-size:10px">{{ ticket.tiempo }}</div>
            </div>
            <div class="row items-center q-gutter-xs">
              <q-badge :color="getPrioridadColor(ticket.prioridad)" :label="ticket.prioridad" />
              <q-badge outline color="grey-6" :label="ticket.categoria" />
            </div>
          </div>
        </div>
      </div>

      <!-- Detalle del ticket -->
      <div class="detalle-card q-pa-lg">
        <div v-if="!ticketSeleccionado" class="text-center q-py-xl">
          <q-icon name="inbox" size="60px" color="grey-7" />
          <p class="text-grey-6 q-mt-md">Selecciona un ticket para ver los detalles</p>
        </div>
        <div v-else>
          <!-- Header del ticket -->
          <div class="row items-center justify-between q-mb-lg">
            <div class="row items-center q-gutter-sm">
              <q-avatar size="40px" :color="ticketSeleccionado.color" text-color="white">
                <q-icon name="person" size="20px" />
              </q-avatar>
              <div>
                <div class="text-white text-weight-bold">{{ ticketSeleccionado.usuario }}</div>
                <div class="text-grey-6 text-caption">ID Ticket: #TX-{{ ticketSeleccionado.id }}4450</div>
              </div>
            </div>
            <q-btn flat round icon="more_vert" color="grey-5" />
          </div>

          <!-- Asunto -->
          <div class="text-caption text-grey-5 text-uppercase letter-spacing q-mb-xs">Asunto</div>
          <div class="text-white text-weight-medium q-mb-lg">{{ ticketSeleccionado.asunto }}</div>

          <!-- Mensaje del usuario -->
          <div class="mensaje-card q-pa-md q-mb-lg">
            <p class="text-grey-3" style="line-height:1.6; font-style:italic; font-size:13px">
              "{{ ticketSeleccionado.mensaje }}"
            </p>
          </div>

          <!-- Respuesta rápida -->
          <div class="text-caption text-grey-5 text-uppercase letter-spacing q-mb-sm">Respuesta Rápida</div>
          <q-input
            v-model="respuesta"
            outlined
            dark
            color="primary"
            placeholder="Escribe tu respuesta aquí..."
            type="textarea"
            rows="4"
            class="custom-input q-mb-md"
          />
          <div class="row items-center justify-between">
            <div class="row q-gutter-xs">
              <q-btn flat round icon="attach_file" color="grey-5" size="sm" />
              <q-btn flat round icon="image" color="grey-5" size="sm" />
            </div>
            <q-btn unelevated no-caps color="primary" label="Enviar Respuesta" icon-right="send" @click="enviarRespuesta" />
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
const ticketSeleccionado = ref(null)
const respuesta = ref('')
const ticketsAbiertos = ref(24)

const tickets = ref([
  {
    id: 1, usuario: 'Marcus Holloway', color: 'primary',
    asunto: 'No he recibido mi Mapa de Vida Completo tras el pago',
    tiempo: 'Hace 12 min', prioridad: 'PRIORIDAD MEDIA', categoria: 'Facturación',
    mensaje: 'Hola, realicé el pago hace 2 horas por el "Mapa de Vida Completo" pero no me ha llegado el PDF al correo y tampoco aparece en mi perfil. Mi ID de transacción es #88219. ¿Podrían revisarlo? Gracias.'
  },
  {
    id: 2, usuario: 'Sarah Jenkins', color: 'secondary',
    asunto: 'Problema al acceder a la zona de miembros premium',
    tiempo: 'Hace 45 min', prioridad: 'PRIORIDAD ALTA', categoria: 'Área Técnica',
    mensaje: 'Soy suscriptora Premium Plus desde hace 3 meses pero no puedo acceder al contenido exclusivo. El sistema me dice que mi cuenta es básica. Por favor ayúdenme.'
  },
  {
    id: 3, usuario: 'Julian Rossi', color: 'positive',
    asunto: 'Consulta sobre el significado del número 11 en mi carta',
    tiempo: 'Hace 2 horas', prioridad: 'PRIORIDAD BAJA', categoria: 'Interpretación',
    mensaje: '¿Puede el número 11 aparecer como número maestro en el camino de vida y también en el número de destino? ¿Qué significa eso? Mi carta dice que tengo doble energía de maestro.'
  },
  {
    id: 4, usuario: 'Elena Martínez', color: 'warning',
    asunto: '¿Cómo puedo cambiar mi correo electrónico?',
    tiempo: 'Hace 4 horas', prioridad: 'PRIORIDAD BAJA', categoria: 'Perfil',
    mensaje: 'Necesito cambiar el correo electrónico asociado a mi cuenta. Lo intenté desde ajustes pero me dice que el correo ya está en uso aunque no creo tener otra cuenta.'
  },
])

const getPrioridadColor = (p) => {
  if (p?.includes('ALTA')) return 'negative'
  if (p?.includes('MEDIA')) return 'warning'
  return 'grey-6'
}

const seleccionarTicket = (ticket) => {
  ticketSeleccionado.value = ticket
  respuesta.value = ''
}

const enviarRespuesta = () => {
  if (!respuesta.value.trim()) return
  $q.notify({ type: 'positive', message: 'Respuesta enviada correctamente', position: 'top-right' })
  respuesta.value = ''
  ticketsAbiertos.value--
  // Remover ticket de lista
  tickets.value = tickets.value.filter(t => t.id !== ticketSeleccionado.value.id)
  ticketSeleccionado.value = null
}
</script>

<style scoped lang="sass">
.admin-page
  max-width: 1200px
  margin: 0 auto

.kpi-grid
  display: grid
  grid-template-columns: repeat(3, 1fr)
  gap: 16px
  @media (max-width: 700px)
    grid-template-columns: 1fr

.kpi-card
  background: rgba(26, 26, 60, 0.5)
  border: 1px solid rgba(108, 92, 231, 0.2)
  border-radius: 14px

.soporte-grid
  display: grid
  grid-template-columns: 1fr 1.5fr
  gap: 20px
  @media (max-width: 900px)
    grid-template-columns: 1fr

.bandeja-card, .detalle-card
  background: rgba(26, 26, 60, 0.5)
  border: 1px solid rgba(108, 92, 231, 0.2)
  border-radius: 14px

.ticket-item
  background: rgba(15, 15, 40, 0.5)
  border: 1px solid rgba(108, 92, 231, 0.1)
  border-radius: 10px
  transition: all 0.2s
  &:hover
    border-color: rgba(108, 92, 231, 0.4)
    background: rgba(108, 92, 231, 0.08)

.ticket-selected
  border-color: rgba(108, 92, 231, 0.6) !important
  background: rgba(108, 92, 231, 0.12) !important

.mensaje-card
  background: rgba(15, 15, 40, 0.5)
  border: 1px solid rgba(108, 92, 231, 0.15)
  border-radius: 10px

.custom-input
  :deep(.q-field__control)
    background: rgba(15, 15, 40, 0.5)
  :deep(.q-field__native)
    color: white

.estado-red
  background: rgba(26, 26, 60, 0.5)
  border: 1px solid rgba(0, 217, 165, 0.2)
  border-radius: 8px
  text-align: right

.letter-spacing
  letter-spacing: 1px
</style>
