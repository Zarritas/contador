import { ref } from 'vue'
import { useStorage } from './useStorage.js'

const { settings } = useStorage()

let audioContext = null

const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
}

/**
 * Genera un beep con Web Audio API
 */
const playBeep = (frequency = 800, duration = 200, type = 'sine') => {
  if (!settings.value.soundEnabled || !audioContext) return
  
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = frequency
  oscillator.type = type
  
  const volume = (settings.value.volume || 80) / 100
  gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration / 1000)
}

export function useAudio() {
  const setupAudio = () => {
    document.addEventListener('click', initAudioContext, { once: true })
    document.addEventListener('touchstart', initAudioContext, { once: true })
  }

  const playTimerEnd = () => {
    playBeep(600, 150)
    setTimeout(() => playBeep(800, 150), 200)
    setTimeout(() => playBeep(1000, 300), 400)
  }

  const playIntervalSwitch = () => {
    playBeep(1000, 150)
  }

  const playClick = () => {
    playBeep(400, 50)
  }

  const playCountdownWarning = () => {
    playBeep(500, 100)
  }

  const playCountdownGo = () => {
    playBeep(900, 250)
  }

  const vibrate = (pattern = [50]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }

  return {
    setupAudio,
    playTimerEnd,
    playIntervalSwitch,
    playClick,
    playCountdownWarning,
    playCountdownGo,
    playBeep,
    vibrate
  }
}
