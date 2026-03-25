<template>
  <main class="glass-panel" style="margin: auto; max-width: 450px; width: 90%;">
    <h1>Portal Místico</h1>
    <p class="text-center mb-2">Descubre los secretos de tu destino a través de los números.</p>
    
    <form @submit.prevent="handleLogin">
        <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" v-model="email" class="form-control" autocomplete="email" required placeholder="tu@correo.com">
        </div>
        
        <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" v-model="password" class="form-control" autocomplete="current-password" required placeholder="••••••••">
        </div>

        <p v-if="errorMsg" class="error-msg active">{{ errorMsg }}</p>

        <button type="submit" class="btn btn-primary mt-2" :disabled="loading">
            {{ loading ? 'Conectando con los astros...' : 'Ingresar al Portal' }}
        </button>
    </form>

    <router-link to="/register" class="auth-link">¿No tienes cuenta? Regístrate aquí y revela tu camino.</router-link>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '../api'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

const handleLogin = async () => {
    if (!email.value || !password.value) return
    
    loading.value = true
    errorMsg.value = ''

    const { ok, data } = await AuthService.login(email.value, password.value)

    if (ok && data.token && data.usuario) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.usuario))
        
        if (data.usuario.rol === 'admin') {
            router.push('/dashboard-admin')
        } else {
            router.push('/dashboard-user')
        }
    } else {
        errorMsg.value = data.msg || 'Credenciales incorrectas.'
        loading.value = false
    }
}
</script>

<style scoped>
.form-group {
    margin-bottom: 1.5rem;
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
