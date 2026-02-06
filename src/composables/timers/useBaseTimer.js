import { ref, computed, onUnmounted } from 'vue'
import { formatTime } from '../../utils/timeFormatters.js'
import { TIMER_STATES } from '../../constants/appConstants.js'

/**
 * Composable base para funcionalidad de timer
 * Proporciona estado, tiempo transcurrido y control básico
 *
 * @param {Object} options - Opciones de configuración
 * @param {Function} options.onTick - Función tick personalizada (opcional)
 * @returns {Object} - Estado y métodos del timer base
 */
export function useBaseTimer(options = {}) {
  // Estado
  const state = ref(TIMER_STATES.IDLE)
  const startTime = ref(null)
  const elapsedTime = ref(0)
  let intervalId = null

  // Getters
  const isRunning = computed(() => state.value === TIMER_STATES.RUNNING)
  const isPaused = computed(() => state.value === TIMER_STATES.PAUSED)
  const isIdle = computed(() => state.value === TIMER_STATES.IDLE)
  const isFinished = computed(() => state.value === TIMER_STATES.FINISHED)

  const formattedTime = computed(() => formatTime(elapsedTime.value))

  // Tick por defecto o personalizado
  const defaultTick = () => {
    elapsedTime.value = Date.now() - startTime.value
  }
  const tick = options.onTick || defaultTick

  const clearTimer = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const startInterval = () => {
    clearTimer()
    intervalId = setInterval(tick, 100)
  }

  const start = () => {
    if (isRunning.value) return

    state.value = TIMER_STATES.RUNNING
    startTime.value = Date.now() - elapsedTime.value
    startInterval()
  }

  const pause = () => {
    if (!isRunning.value) return

    state.value = TIMER_STATES.PAUSED
    clearTimer()
    elapsedTime.value = Date.now() - startTime.value
  }

  const resume = () => {
    if (!isPaused.value) return

    state.value = TIMER_STATES.RUNNING
    startTime.value = Date.now() - elapsedTime.value
    startInterval()
  }

  const reset = () => {
    state.value = TIMER_STATES.IDLE
    clearTimer()
    startTime.value = null
    elapsedTime.value = 0
  }

  const finish = () => {
    state.value = TIMER_STATES.FINISHED
    clearTimer()
  }

  // Cleanup
  onUnmounted(() => {
    clearTimer()
  })

  return {
    // Estado
    state,
    startTime,
    elapsedTime,

    // Getters computados
    isRunning,
    isPaused,
    isIdle,
    isFinished,
    formattedTime,

    // Métodos
    start,
    pause,
    resume,
    reset,
    finish,
    clearTimer,
    startInterval
  }
}
