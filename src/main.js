import { createApp } from 'vue'
import { Quasar } from 'quasar'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './style.css'
import App from './App.vue'
import router from './router/routes'


// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const myApp = createApp(App)

const pinia = createPinia()
myApp.use(pinia)
pinia.use(piniaPluginPersistedstate)

myApp.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  config: {
    brand: {
      primary: '#6C5CE7',
      secondary: '#A29BFE',
      accent: '#FDCB6E',
      dark: '#1A1A2E',
      positive: '#00D9A5',
      negative: '#FF6B6B',
      info: '#74B9FF',
      warning: '#FFEAA7'
    }
  }
})

myApp.use(router)
myApp.mount('#app')
