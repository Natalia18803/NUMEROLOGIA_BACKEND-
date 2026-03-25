import axios from 'axios'

// Configuración global de la instancia de Axios
const api = axios.create({
  baseURL: '/api' // El Proxy de Vite (en dev) o el mismo origin (en producción) gestionarán esto
})

// Interceptor para agregar dinámicamente el Token JWT si existe
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['x-token'] = token
  }
  return config
}, error => {
  return Promise.reject(error)
})

export default api
