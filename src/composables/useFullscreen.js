import { ref } from 'vue'

/**
 * Composable para gestionar pantalla completa
 */
export function useFullscreen() {
  const isFullscreen = ref(false)

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        isFullscreen.value = true
      } else {
        await document.exitFullscreen()
        isFullscreen.value = false
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err)
    }
  }

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen()
        isFullscreen.value = false
      } catch (err) {
        console.error('Error exiting fullscreen:', err)
      }
    }
  }

  // Escuchar cambios de estado
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })

  return {
    isFullscreen,
    toggleFullscreen,
    exitFullscreen
  }
}
