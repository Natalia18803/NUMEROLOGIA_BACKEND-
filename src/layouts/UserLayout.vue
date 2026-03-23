<template>
  <q-layout view="hHh lpR fFf" class="user-layout">
    <!-- Fondo místico -->
    <div class="fixed-full bg-dark" style="z-index:-2">
      <div class="geometric-bg absolute-full"></div>
      <div class="mystic-overlay absolute-full"></div>
    </div>

    <!-- Header / Navbar -->
    <q-header class="user-header" elevated>
      <q-toolbar class="user-toolbar">
        <!-- Logo -->
        <router-link to="/dashboard" class="logo-link row items-center no-wrap q-mr-xl">
          <q-icon name="auto_awesome" size="24px" color="primary" class="q-mr-xs" />
          <span class="logo-text">ASTRO<span class="text-primary">NÚMERO</span></span>
        </router-link>

        <q-space />

        <!-- Nav links -->
        <div class="nav-links row items-center q-gutter-md gt-sm">
          <router-link to="/explorar" class="nav-link" active-class="nav-link-active">Explorar</router-link>
          <router-link to="/lecturas" class="nav-link" active-class="nav-link-active">Lecturas</router-link>
          <router-link to="/mi-perfil" class="nav-link nav-link-profile" active-class="nav-link-active">Mi Perfil</router-link>
        </div>

        <!-- Notifications -->
        <q-btn flat round icon="notifications" color="grey-5" class="q-ml-md">
          <q-badge color="primary" floating>2</q-badge>
        </q-btn>

        <!-- Avatar menu -->
        <q-btn flat round class="q-ml-sm">
          <q-avatar size="36px" class="user-avatar">
            <q-icon name="person" color="white" />
          </q-avatar>
          <q-menu class="user-menu">
            <q-list dense style="min-width: 160px">
              <q-item clickable v-close-popup to="/mi-perfil">
                <q-item-section avatar><q-icon name="person" /></q-item-section>
                <q-item-section>Mi Perfil</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/ajustes">
                <q-item-section avatar><q-icon name="settings" /></q-item-section>
                <q-item-section>Ajustes</q-item-section>
              </q-item>
              <q-separator dark />
              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section>
                <q-item-section class="text-negative">Cerrar Sesión</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.token = ''
  authStore.usuario = null
  router.push('/login')
}
</script>

<style scoped lang="sass">
.user-layout
  background: transparent

.fixed-full
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%

.geometric-bg
  background: radial-gradient(circle at 20% 50%, rgba(108, 92, 231, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(162, 155, 254, 0.08) 0%, transparent 50%)

.mystic-overlay
  background: linear-gradient(135deg, rgba(10, 10, 30, 0.98) 0%, rgba(20, 20, 50, 0.98) 50%, rgba(10, 10, 30, 0.98) 100%)

.user-header
  background: rgba(15, 15, 35, 0.9) !important
  border-bottom: 1px solid rgba(108, 92, 231, 0.2)
  backdrop-filter: blur(20px)

.user-toolbar
  max-width: 1200px
  width: 100%
  margin: 0 auto
  padding: 0 24px

.logo-link
  text-decoration: none

.logo-text
  font-size: 16px
  font-weight: 800
  color: white
  letter-spacing: 1px

.nav-link
  text-decoration: none
  color: rgba(255, 255, 255, 0.6)
  font-size: 14px
  font-weight: 500
  transition: color 0.2s ease
  &:hover
    color: white

.nav-link-active
  color: white !important

.nav-link-profile
  color: rgba(108, 92, 231, 0.9)
  &:hover
    color: #A29BFE

.user-avatar
  background: rgba(108, 92, 231, 0.4)
  border: 2px solid rgba(108, 92, 231, 0.5)

.user-menu
  background: rgba(26, 26, 46, 0.95)
  border: 1px solid rgba(108, 92, 231, 0.3)
  backdrop-filter: blur(20px)
</style>
