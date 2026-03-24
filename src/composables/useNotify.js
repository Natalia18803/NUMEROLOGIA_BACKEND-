import { useQuasar } from 'quasar'

export function useNotify() {
  const $q = useQuasar()

  // ✨ ÉXITO — Tono dorado místico
  const notifySuccess = (message, caption = '') => {
    $q.notify({
      message,
      caption,
      icon: 'auto_awesome',
      color: 'deep-purple-9',
      textColor: 'white',
      position: 'top-right',
      timeout: 4000,
      progress: true,
      classes: 'mystic-notify mystic-notify--success',
      actions: [{ icon: 'close', color: 'white', round: true, flat: true }]
    })
  }

  // ❌ ERROR — Tono rojo oscuro
  const notifyError = (message, caption = '') => {
    $q.notify({
      message,
      caption,
      icon: 'error_outline',
      color: 'red-10',
      textColor: 'white',
      position: 'top-right',
      timeout: 5000,
      progress: true,
      classes: 'mystic-notify mystic-notify--error',
      actions: [{ icon: 'close', color: 'white', round: true, flat: true }]
    })
  }

  // ⚠️ ADVERTENCIA — Ámbar
  const notifyWarning = (message, caption = '') => {
    $q.notify({
      message,
      caption,
      icon: 'warning_amber',
      color: 'amber-9',
      textColor: 'white',
      position: 'top-right',
      timeout: 4500,
      progress: true,
      classes: 'mystic-notify mystic-notify--warning',
      actions: [{ icon: 'close', color: 'white', round: true, flat: true }]
    })
  }

  // ℹ️ INFO — Azul índigo
  const notifyInfo = (message, caption = '') => {
    $q.notify({
      message,
      caption,
      icon: 'info_outline',
      color: 'indigo-9',
      textColor: 'white',
      position: 'top-right',
      timeout: 4000,
      progress: true,
      classes: 'mystic-notify mystic-notify--info',
      actions: [{ icon: 'close', color: 'white', round: true, flat: true }]
    })
  }

  return { notifySuccess, notifyError, notifyWarning, notifyInfo }
}
