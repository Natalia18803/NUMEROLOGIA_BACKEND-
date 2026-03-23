import { defineStore } from 'pinia';
import { ref } from 'vue';    

export const useAuthStore = defineStore('auth', () => {
  let token = ref("")
  let usuario = ref(null)

  function logout() {
    token.value = ""
    usuario.value = null
  }

    return {
        token,
        usuario,
        logout
    }
},

    { persist: true }
)
