import api from '../plugins/axios'

class UserService {
  async getAllUsuarios() {
    return api.get('/usuarios/todos')
  }

  async crearUsuario(usuarioData) {
    return api.post('/usuarios/crear', usuarioData)
  }

  async updateEstado(usuarioObj) {
    const newState = usuarioObj.estado === 'activo' ? 'inactivo' : 'activo'
    return api.patch(`/usuarios/${usuarioObj._id}/estado`, { estado: newState })
  }

  async deleteUsuario(id) {
    return api.delete(`/usuarios/${id}`)
  }
}

export default new UserService()
