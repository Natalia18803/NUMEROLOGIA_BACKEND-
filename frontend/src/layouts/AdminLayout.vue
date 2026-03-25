<template>
  <div class="layout-container admin-theme">
    <header class="admin-header">
        <h2 class="header-title"><i class="fas fa-shield-alt"></i> Matriz de Administración</h2>
        <div class="admin-controls">
            <span class="admin-badge">ADMIN</span>
            <button @click="handleLogout" class="btn btn-outline logout-btn">Desconectar</button>
        </div>
    </header>

    <main class="admin-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useGeneralStore } from '../store/General'

const store = useGeneralStore()
const router = useRouter()

const handleLogout = () => {
    store.logout()
    router.push('/')
}
</script>

<style scoped>
.layout-container {
    width: 100%;
}
.admin-theme {
    background: radial-gradient(circle at 50% 10%, #1a0f1a 0%, #050505 100%);
}
.admin-header {
    padding: 1rem 2rem; 
    background: rgba(20, 10, 20, 0.9); 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    border-bottom: 1px solid rgba(212, 175, 55, 0.4);
}
.header-title {
    margin:0; 
    font-size:1.4rem;
    color: #e6c875;
}
.admin-controls {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}
.admin-badge {
    background: #d4af37;
    color: #000;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.8rem;
    letter-spacing: 1px;
}
.logout-btn {
    width: auto; 
    padding: 0.5rem 1rem; 
    font-size: 0.8rem;
}
.admin-content {
    width: 100%;
    padding-top: 2rem;
    padding-bottom: 2rem;
}
</style>
