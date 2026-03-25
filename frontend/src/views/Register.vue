<template>
  <div class="text-center" style="margin-top: 3rem;">
    <h1 class="mb-1">Comienza tu Viaje</h1>
    <p class="mb-2">Ingresa tus datos celestiales</p>
    
    <form @submit.prevent="handleRegister" class="glass-panel" style="max-width: 450px; margin: 0 auto; padding: 2.5rem; text-align: left;">
        <div class="form-group mb-1">
            <label for="nombre" style="display: block; margin-bottom: 0.5rem;">Nombre Completo</label>
            <input type="text" id="nombre" v-model="form.nombre" class="form-control" autocomplete="name" required placeholder="Tu Nombre Astral" style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--primary-color); background: rgba(0,0,0,0.5); color: #fff;">
        </div>

        <div class="form-group mb-1">
            <label for="email" style="display: block; margin-bottom: 0.5rem;">Correo Electrónico</label>
            <input type="email" id="email" v-model="form.email" class="form-control" autocomplete="email" required placeholder="tu@cosmos.com" style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--primary-color); background: rgba(0,0,0,0.5); color: #fff;">
        </div>

        <div class="form-group mb-1">
            <label for="fecha" style="display: block; margin-bottom: 0.5rem;">Fecha de Nacimiento</label>
            <input type="date" id="fecha" v-model="form.fecha_nacimiento" class="form-control" required style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--primary-color); background: rgba(0,0,0,0.5); color: #fff;">
        </div>

        <div class="form-group mb-2">
            <label for="password" style="display: block; margin-bottom: 0.5rem;">Contraseña</label>
            <input type="password" id="password" v-model="form.password" class="form-control" autocomplete="new-password" required placeholder="••••••••" minlength="6" style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--primary-color); background: rgba(0,0,0,0.5); color: #fff;">
        </div>

        <button type="submit" class="btn btn-primary w-100 mt-2" :disabled="loading" style="width: 100%;">
            {{ loading ? 'Calculando tus números...' : 'Revelar mi Destino' }}
        </button>

        <p class="text-center" style="margin-top: 1.5rem; font-size: 0.9rem;">
            ¿Ya perteneces a la matriz? 
            <router-link to="/" style="color: var(--primary-color); font-weight: bold; text-decoration: none;">Inicia sesión</router-link>
        </p>
    </form>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService'
import { useGeneralStore } from '../store/General'

const store = useGeneralStore()
const router = useRouter()
const form = reactive({ nombre: '', email: '', fecha_nacimiento: '', password: '' })
const loading = ref(false)

const handleRegister = async () => {
    if (!form.nombre || !form.email || !form.fecha_nacimiento || !form.password) return
    loading.value = true

    try {
        const response = await authService.register(form.nombre, form.email, form.password, form.fecha_nacimiento)
        const data = response.data
        if (data.token && data.usuario) {
            store.setUser(data.usuario, data.token)
            
            Swal.fire({
                title: '¡Destino Revelado!',
                text: 'Tu cuenta ha sido creada exitosamente.',
                icon: 'success',
                background: '#161224',
                color: '#f8f8f8',
                confirmButtonColor: '#d4af37'
            }).then(() => {
                router.push('/dashboard-user')
            })
        }
    } catch (error) {
        const errData = error.response?.data || {}
        let msg = errData.msg || 'Error al completar el registro.'
        if (errData.errors && errData.errors.length > 0) msg = errData.errors[0].msg
        if (errData.error) msg = errData.error

        Swal.fire({
            title: 'Sincronización Fallida',
            text: msg,
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
