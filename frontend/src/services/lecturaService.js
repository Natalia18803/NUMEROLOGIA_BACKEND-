import api from '../plugins/axios'

class LecturaService {
  async getAllLecturas() {
    return api.get('/lecturas')
  }

  async getLecturasByUsuario(usuario_id) {
    return api.get(`/lecturas/usuario/${usuario_id}`)
  }

  async generarLectura(tipo, usuario_id) {
    const endpoint = tipo === 'principal' ? `/lecturas/principal/${usuario_id}` : `/lecturas/diaria/${usuario_id}`
    return api.post(endpoint)
  }
}

export default new LecturaService()
