import api from '../plugins/axios'

class PagoService {
  async getAllPagos() {
    return api.get('/pagos')
  }

  async getPagosByUsuario(usuario_id) {
    return api.get(`/pagos/${usuario_id}`)
  }

  async createPago(payload) {
    // payload ex: { usuario_id, monto, metodo }
    return api.post('/pagos', payload)
  }
}

export default new PagoService()
