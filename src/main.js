import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

// Registrar Service Worker para soporte offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service Worker no soportado o fallo silencioso
    })
  })
}
