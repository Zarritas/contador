const CACHE_NAME = 'contador-atletismo-v1'

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
]

// Instalar: cachear shell de la app
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE)
    })
  )
  self.skipWaiting()
})

// Activar: limpiar caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

// Fetch: network first, fallback a cache
self.addEventListener('fetch', (event) => {
  // Solo cachear requests GET del mismo origen
  if (event.request.method !== 'GET') return
  if (!event.request.url.startsWith(self.location.origin)) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cachear la respuesta nueva
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone)
        })
        return response
      })
      .catch(() => {
        // Sin red: servir desde cache
        return caches.match(event.request)
      })
  )
})
