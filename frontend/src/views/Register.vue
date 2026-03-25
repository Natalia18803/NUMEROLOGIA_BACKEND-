<template>
  <main class="glass-panel" style="margin: auto; max-width: 500px; width: 90%; margin-top: 2rem; margin-bottom: 2rem;">
    <h1 style="font-size: 2rem;">Inicia Tu Viaje</h1>
    <p class="text-center mb-2">Los números de tu fecha de nacimiento revelarán tu verdadero potencial.</p>
    
    <form @submit.prevent="handleRegister">
        <div class="form-group">
            <label for="nombre">Nombre Completo</label>
            <input type="text" id="nombre" v-model="form.nombre" class="form-control" autocomplete="name" required placeholder="Tus nombres y apellidos">
        </div>

        <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" v-model="form.email" class="form-control" autocomplete="email" required placeholder="tu@correo.com">
        </div>
        
        <div class="form-group">
            <label for="fecha_nacimiento">Fecha de Nacimiento</label>
            <input type="date" id="fecha_nacimiento" v-model="form.fecha_nacimiento" class="form-control" required>
        </div>

        <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" v-model="form.password" class="form-control" autocomplete="new-password" required placeholder="••••••••" minlength="6">
        </div>

        <button type="submit" class="btn btn-primary mt-2" :disabled="loading">
            {{ loading ? 'Calculando tus números...' : 'Revelar mi Destino' }}
        </button>
    </form>

    <router-link to="/" class="auth-link">¿Ya tienes cuenta? Ingresa aquí.</router-link>
  </main>
</template>

<script setup>
import Swal from 'sweetalert2'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '../api'

const router = useRouter()
const form = reactive({ nombre: '', email: '', fecha_nacimiento: '', password: '' })
const loading = ref(false)

const handleRegister = async () => {
    if (!form.nombre || !form.email || !form.fecha_nacimiento || !form.password) return
    
    loading.value = true

    const { ok, data } = await AuthService.register(form.nombre, form.email, form.password, form.fecha_nacimiento)

    if (ok && data.token && data.usuario) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.usuario))
        
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
    } else {
        let msg = data.msg || 'Error al completar el registro.'
        if (data.errors && data.errors.length > 0) msg = data.errors[0].msg
        if (data.error) msg = data.error

        Swal.fire({
            title: 'Sincronización Fallida',
            text: msg,
            icon: 'error',
            background: '#161224',
            color: '#f8f8f8',
            confirmButtonColor: '#d4af37'
        })
        loading.value = false
    }
}
</script>

<style scoped>
.form-group {
    margin-bottom: 1.5rem;
    position: relative;
}
.form-group label {
    display: block;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
}
.form-control {
    width: 100%;
    padding: 0.8rem 1.2rem;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 1rem;
    transition: all var(--transition-speed);
}
.form-control:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
    background: rgba(0, 0, 0, 0.4);
}
</style>
