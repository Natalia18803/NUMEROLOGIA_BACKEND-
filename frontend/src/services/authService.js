import api from '../plugins/axios'

class AuthService {
  async register(nombre, email, password, fecha_nacimiento) {
    return api.post('/auth/registro', { nombre, email, password, fecha_nacimiento })
  }

  async login(email, password) {
    return api.post('/auth/login', { email, password })
  }

  async getPerfil() {
    return api.get('/auth/perfil')
  }
}

export default new AuthService()
