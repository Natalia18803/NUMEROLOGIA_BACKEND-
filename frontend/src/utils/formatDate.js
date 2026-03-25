export const formatearFecha = (fecha) => {
    if (!fecha) return '...'
    const d = new Date(fecha)
    return d.toLocaleDateString('es-ES')
}

export const formatearFechaHora = (fecha) => {
    if (!fecha) return '...'
    const d = new Date(fecha)
    const time = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString('es-ES') + ' a las ' + time
}

export const isToday = (dateString) => {
    if (!dateString) return false
    const d = new Date(dateString)
    const today = new Date()
    return d.getDate() === today.getDate() && 
           d.getMonth() === today.getMonth() && 
           d.getFullYear() === today.getFullYear()
}
