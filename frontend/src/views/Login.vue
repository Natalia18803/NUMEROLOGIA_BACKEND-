<template>
  <div class="text-center" style="margin-top: 5rem;">
    <h1 class="mb-1">Portal Místico</h1>
    <p class="mb-2">Descubre los secretos de tu numerología</p>
    
    <form @submit.prevent="handleLogin" class="glass-panel" style="max-width: 400px; margin: 0 auto; padding: 2.5rem;">
        <div class="form-group mb-1 text-left">
            <label for="email" style="display: block; margin-bottom: 0.5rem;">Correo Electrónico</label>
            <input type="email" id="email" v-model="email" class="form-control w-100" autocomplete="username" required placeholder="tu@correo.com" style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--primary-color); background: rgba(0,0,0,0.5); color: #fff;">
        </div>

        <div class="form-group text-left mb-2">
            <label for="password" style="display: block; margin-bottom: 0.5rem;">Contraseña</label>
            <input type="password" id="password" v-model="password" class="form-control w-100" autocomplete="current-password" required placeholder="••••••••" style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--primary-color); background: rgba(0,0,0,0.5); color: #fff;">
        </div>

        <button type="submit" class="btn btn-primary w-100 mt-2" :disabled="loading" style="width: 100%;">
            {{ loading ? 'Conectando con los astros...' : 'Ingresar al Portal' }}
        </button>

        <p style="margin-top: 1.5rem; font-size: 0.9rem;">
            ¿No tienes cuenta? 
            <router-link to="/register" style="color: var(--primary-color); font-weight: bold; text-decoration: none;">Regístrate aquí</router-link>
        </p>
    </form>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService'
import { useGeneralStore } from '../store/General'

const store = useGeneralStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
    if (!email.value || !password.value) return
    loading.value = true

    try {
        const response = await authService.login(email.value, password.value)
        const data = response.data
        if (data.token && data.usuario) {
            store.setUser(data.usuario, data.token)
            
            if (data.usuario.rol === 'admin') {
                router.push('/admin')
            } else {
                router.push('/dashboard-user')
            }
        }
    } catch (error) {
        const errData = error.response?.data || {}
        Swal.fire({
            title: 'Desconexión',
            text: errData.error || errData.msg || 'Credenciales incorrectas.',
            icon: 'error',
            background: '#161224',
            color: '#f8f8f8',
            confirmButtonColor: '#d4af37'
        })
    } finally {
        loading.value = false
    }
}
</script>
