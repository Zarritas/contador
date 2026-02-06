import { ref, computed, onUnmounted } from 'vue'
import { formatTime } from '../../utils/timeFormatters.js'
import { TIMER_STATES } from '../../constants/appConstants.js'

/**
 * Composable base para funcionalidad de timer
 * Proporciona estado, tiempo transcurrido y control básico
 *
 * @param {Function|null} customTick - Tick personalizado para timers derivados (countdown, etc.)
 * @returns {Object} - Estado y métodos del timer base
 */
export function useBaseTimer(customTick = null) {
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

  // Métodos
  const defaultTick = () => {
    elapsedTime.value = Date.now() - startTime.value
  }

  const activeTick = customTick || defaultTick

  const start = () => {
    if (isRunning.value) return

    state.value = TIMER_STATES.RUNNING
    startTime.value = Date.now() - elapsedTime.value
    intervalId = setInterval(activeTick, 100)
  }

  const pause = () => {
    if (!isRunning.value) return

    state.value = TIMER_STATES.PAUSED
    clearInterval(intervalId)
    intervalId = null
    elapsedTime.value = Date.now() - startTime.value
  }

  const resume = () => {
    if (!isPaused.value) return

    state.value = TIMER_STATES.RUNNING
    startTime.value = Date.now() - elapsedTime.value
    intervalId = setInterval(activeTick, 100)
  }

  const reset = () => {
    state.value = TIMER_STATES.IDLE
    clearInterval(intervalId)
    intervalId = null
    startTime.value = null
    elapsedTime.value = 0
  }

  const finish = () => {
    state.value = TIMER_STATES.FINISHED
    clearInterval(intervalId)
    intervalId = null
  }

  // Cleanup
  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
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
    finish
  }
}
