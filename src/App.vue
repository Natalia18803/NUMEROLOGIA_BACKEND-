<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// Rutas manejadas por vue-router
</script>

<style lang="scss">
// Variables de color globales
$primary: #3211d4;
$mystic-gold: #c5a059;
$background-dark: #131022;

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background: $background-dark;
  color: white;
}
</style>
