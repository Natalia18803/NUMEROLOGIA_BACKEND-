<template>
  <div class="layout-container">
    <header v-if="isAuthenticated" class="main-header">
        <h2 class="header-title">Mi Portal Numérico</h2>
        <button @click="handleLogout" class="btn btn-outline logout-btn">Cerrar Sesión</button>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGeneralStore } from '../store/General'

const store = useGeneralStore()
const router = useRouter()

const isAuthenticated = computed(() => store.isAuthenticated)

const handleLogout = () => {
    store.logout()
    router.push('/')
}
</script>

<style scoped>
.layout-container {
    width: 100%;
}
.main-header {
    padding: 1rem 2rem; 
    background: rgba(10, 10, 16, 0.8); 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    border-bottom: 1px solid var(--glass-border);
}
.header-title {
    margin:0; 
    font-size:1.5rem;
}
.logout-btn {
    width: auto; 
    padding: 0.5rem 1rem; 
    font-size: 0.8rem;
}
.main-content {
    width: 100%;
    padding-top: 2rem;
    padding-bottom: 2rem;
}
</style>
