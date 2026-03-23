<template>
  <q-layout view="lHh lpR fFf" class="admin-layout">
    <!-- Fondo -->
    <div class="fixed-full" style="z-index:-2; background: #0a0a1e"></div>

    <!-- Sidebar -->
    <q-drawer
      v-model="drawerOpen"
      :width="220"
      :breakpoint="768"
      persistent
      class="admin-drawer"
    >
      <div class="drawer-content column full-height">
        <!-- Logo -->
        <div class="drawer-header row items-center q-pa-md">
          <q-icon name="auto_awesome" size="22px" color="primary" class="q-mr-sm" />
          <span class="admin-logo-text">ASTRO<span class="text-primary">ADMIN</span></span>
        </div>

        <q-separator dark class="q-mx-md" style="opacity:0.2" />

        <!-- Nav principal -->
        <div class="q-mt-md q-px-sm">
          <div class="nav-section-label q-px-sm q-mb-xs">PRINCIPAL</div>
          <q-list dense>
            <q-item
              v-for="item in mainNav"
              :key="item.path"
              :to="item.path"
              clickable
              exact
              active-class="admin-nav-active"
              class="admin-nav-item q-mb-xs"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" size="20px" />
              </q-item-section>
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="q-mt-lg q-px-sm">
          <div class="nav-section-label q-px-sm q-mb-xs">CONFIGURACIÓN</div>
          <q-list dense>
            <q-item
              v-for="item in configNav"
              :key="item.path"
              :to="item.path"
              clickable
              exact
              active-class="admin-nav-active"
              class="admin-nav-item q-mb-xs"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" size="20px" />
              </q-item-section>
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
          </q-list>
        </div>

        <q-space />

        <!-- Admin user info -->
        <div class="drawer-footer q-pa-md">
          <div class="row items-center q-gutter-sm">
            <q-avatar size="36px" class="admin-avatar">
              <q-icon name="person" color="white" size="20px" />
            </q-avatar>
            <div class="col">
              <div class="text-white text-caption text-weight-bold">{{ authStore.usuario?.nombre || 'Admin' }}</div>
              <div class="text-grey-5" style="font-size:10px; text-transform:uppercase; letter-spacing:1px">Super Admin</div>
            </div>
            <q-btn flat round icon="logout" size="sm" color="grey-5" @click="logout" />
          </div>
        </div>
      </div>
    </q-drawer>

    <!-- Page container -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const drawerOpen = ref(true)
const router = useRouter()
const authStore = useAuthStore()

const mainNav = [
  { label: 'Dashboard', icon: 'grid_view', path: '/admin' },
  { label: 'Usuarios', icon: 'group', path: '/admin/usuarios' },
  { label: 'Gestión de Pagos', icon: 'payments', path: '/admin/pagos' },
  { label: 'Lecturas', icon: 'menu_book', path: '/admin/lecturas' },
]

const configNav = [
  { label: 'Ajustes', icon: 'settings', path: '/admin/ajustes' },
  { label: 'Soporte', icon: 'help_outline', path: '/admin/soporte' },
]

const logout = () => {
  authStore.token = ''
  authStore.usuario = null
  router.push('/login')
}
</script>

<style scoped lang="sass">
.admin-layout
  background: #0a0a1e

.admin-drawer
  background: rgba(15, 12, 35, 0.98) !important
  border-right: 1px solid rgba(108, 92, 231, 0.15)

.drawer-content
  background: transparent

.drawer-header
  padding: 20px 16px 16px

.admin-logo-text
  font-size: 14px
  font-weight: 800
  color: white
  letter-spacing: 2px

.nav-section-label
  font-size: 10px
  font-weight: 700
  color: rgba(255,255,255,0.3)
  letter-spacing: 1.5px
  text-transform: uppercase

.admin-nav-item
  border-radius: 8px
  color: rgba(255,255,255,0.5)
  transition: all 0.2s
  min-height: 40px
  :deep(.q-icon)
    color: rgba(255,255,255,0.4)
  &:hover
    background: rgba(108, 92, 231, 0.1)
    color: rgba(255,255,255,0.9)

.admin-nav-active
  background: rgba(108, 92, 231, 0.2) !important
  color: white !important
  :deep(.q-icon)
    color: #A29BFE !important

.admin-avatar
  background: rgba(108, 92, 231, 0.5)
  border: 2px solid rgba(108, 92, 231, 0.4)

.drawer-footer
  border-top: 1px solid rgba(108, 92, 231, 0.15)
</style>
