import { defineStore } from 'pinia'
import authService from '../services/authService'

export const useGeneralStore = defineStore('general', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('token')
  }),
  actions: {
    setUser(userData, token) {
      this.user = userData
      this.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(userData))
      if (token) localStorage.setItem('token', token)
    },
    async fetchProfile() {
      try {
        const response = await authService.getPerfil()
        const userData = response.data.usuario || response.data
        this.user = userData
        this.isAuthenticated = true
        localStorage.setItem('user', JSON.stringify(userData))
        return userData
      } catch (error) {
        this.logout()
        throw error
      }
    },
    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})
