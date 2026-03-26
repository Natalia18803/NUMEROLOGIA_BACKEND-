import api from '../plugins/axios'

/**
 * Servicio para integración con Mercado Pago
 */
class MercadoPagoService {
  /**
   * Crea una preferencia de pago en el backend
   * @param {Object} data - { usuario_id, monto }
   */
  async createPreference(data) {
    return api.post('/mercadopago/create-preference', data)
  }
}

export default new MercadoPagoService()
