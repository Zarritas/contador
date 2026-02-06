import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable para gestionar pantalla completa
 */
export function useFullscreen() {
  const isFullscreen = ref(!!document.fullscreenElement)

  const onFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', onFullscreenChange)
  })

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', onFullscreenChange)
  })

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err)
    }
  }

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen()
      } catch (err) {
        console.error('Error exiting fullscreen:', err)
      }
    }
  }

  return {
    isFullscreen,
    toggleFullscreen,
    exitFullscreen
  }
}
