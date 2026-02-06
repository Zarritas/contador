import { ref, computed } from 'vue'
import { useBaseTimer } from './useBaseTimer.js'
import { formatTime } from '../../utils/timeFormatters.js'
import { TIMER_DEFAULTS, TIMER_STATES } from '../../constants/appConstants.js'

/**
 * Composable para Temporizador con cuenta regresiva (Countdown)
 *
 * @param {number} initialDuration - Duración inicial en ms (default: 5 min)
 * @returns {Object} - Estado y métodos del temporizador
 */
export function useCountdown(initialDuration = TIMER_DEFAULTS.countdown) {
  // Estado específico
  const duration = ref(initialDuration)
  const remainingTime = ref(initialDuration)

  // Tick personalizado que actualiza remainingTime
  const onTick = () => {
    base.elapsedTime.value = Date.now() - base.startTime.value
    remainingTime.value = Math.max(0, duration.value - base.elapsedTime.value)

    if (remainingTime.value <= 0) {
      base.finish()
    }
  }

  const base = useBaseTimer({ onTick })

  // Getters
  const formattedTime = computed(() => formatTime(remainingTime.value))
  const progress = computed(() => {
    if (duration.value === 0) return 0
    return ((duration.value - remainingTime.value) / duration.value) * 100
  })

  /**
   * Inicia el temporizador
   */
  const start = () => {
    if (base.isRunning.value) return

    base.state.value = TIMER_STATES.RUNNING
    base.startTime.value = Date.now()
    base.elapsedTime.value = 0
    base.startInterval()
  }

  /**
   * Resetea el temporizador
   */
  const reset = () => {
    base.reset()
    remainingTime.value = duration.value
  }

  /**
   * Establece nueva duración
   */
  const setDuration = (newDuration) => {
    duration.value = newDuration
    if (base.isIdle.value) {
      remainingTime.value = newDuration
    }
  }

  return {
    // Heredado de base timer
    state: base.state,
    isRunning: base.isRunning,
    isPaused: base.isPaused,
    isIdle: base.isIdle,
    isFinished: base.isFinished,

    // Estado específico
    duration,
    remainingTime,
    formattedTime,
    progress,

    // Métodos
    start,
    pause: base.pause,
    resume: base.resume,
    reset,
    setDuration
  }
}
