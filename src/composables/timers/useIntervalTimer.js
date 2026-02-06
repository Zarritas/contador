import { ref, computed, onUnmounted } from 'vue'
import { formatTime } from '../../utils/timeFormatters.js'
import { TIMER_DEFAULTS, TIMER_STATES, INTERVAL_PHASES, PHASE_LABELS } from '../../constants/appConstants.js'

/**
 * Composable para Timer de Intervalos (HIIT)
 * Alterna entre fases de trabajo y descanso con aviso 3-2-1
 *
 * @param {Object} options - Opciones de configuración
 * @returns {Object} - Estado y métodos del timer de intervalos
 */
export function useIntervalTimer(options = {}) {
  // Configuración
  const workDuration = ref(options.workDuration || TIMER_DEFAULTS.interval.work)
  const restDuration = ref(options.restDuration || TIMER_DEFAULTS.interval.rest)
  const totalRounds = ref(options.rounds || TIMER_DEFAULTS.interval.rounds)

  // Estado
  const state = ref(TIMER_STATES.IDLE)
  const currentRound = ref(0)
  const phase = ref(INTERVAL_PHASES.IDLE)
  const remainingTime = ref(workDuration.value)
  const countdownWarning = ref(0) // 3, 2, 1, 0 — para aviso visual/sonoro

  let startTime = null
  let elapsedTime = 0
  let intervalId = null
  let lastWarningSecond = 0

  // Getters
  const isRunning = computed(() => state.value === TIMER_STATES.RUNNING)
  const isPaused = computed(() => state.value === TIMER_STATES.PAUSED)
  const isIdle = computed(() => state.value === TIMER_STATES.IDLE)
  const phaseLabel = computed(() => PHASE_LABELS[phase.value] || 'Listo')

  const formattedTime = computed(() => formatTime(remainingTime.value))

  const totalProgress = computed(() => {
    if (isIdle.value) return 0
    const totalTime = (workDuration.value + restDuration.value) * totalRounds.value
    const currentPhaseTime = phase.value === INTERVAL_PHASES.WORK ? workDuration.value : restDuration.value
    const elapsedInPhase = currentPhaseTime - remainingTime.value
    const completedRoundsTime = (currentRound.value - 1) * (workDuration.value + restDuration.value)
    const previousPhaseTime = phase.value === INTERVAL_PHASES.WORK ? 0 : workDuration.value
    const elapsedTotal = completedRoundsTime + previousPhaseTime + elapsedInPhase

    return totalTime > 0 ? Math.min((elapsedTotal / totalTime) * 100, 100) : 0
  })

  const phaseProgress = computed(() => {
    const currentPhaseDuration = phase.value === INTERVAL_PHASES.WORK ? workDuration.value : restDuration.value
    if (currentPhaseDuration === 0) return 0
    return ((currentPhaseDuration - remainingTime.value) / currentPhaseDuration) * 100
  })

  // Métodos privados
  const tick = () => {
    elapsedTime = Date.now() - startTime
    const currentPhaseDuration = phase.value === INTERVAL_PHASES.WORK ? workDuration.value : restDuration.value
    remainingTime.value = Math.max(0, currentPhaseDuration - elapsedTime)

    // Aviso 3-2-1 cuando quedan 3 segundos o menos
    const secondsLeft = Math.ceil(remainingTime.value / 1000)
    if (secondsLeft <= 3 && secondsLeft > 0 && secondsLeft !== lastWarningSecond) {
      lastWarningSecond = secondsLeft
      countdownWarning.value = secondsLeft
    } else if (secondsLeft > 3) {
      countdownWarning.value = 0
      lastWarningSecond = 0
    }

    if (remainingTime.value <= 0) {
      countdownWarning.value = 0
      lastWarningSecond = 0
      switchPhase()
    }
  }

  const switchPhase = () => {
    if (phase.value === INTERVAL_PHASES.WORK) {
      // Cambiar a descanso
      phase.value = INTERVAL_PHASES.REST
      startTime = Date.now()
      elapsedTime = 0
      remainingTime.value = restDuration.value
    } else if (phase.value === INTERVAL_PHASES.REST) {
      // Verificar si terminamos todas las rondas
      if (currentRound.value >= totalRounds.value) {
        finish()
        return
      }
      // Cambiar a trabajo en nueva ronda
      currentRound.value++
      phase.value = INTERVAL_PHASES.WORK
      startTime = Date.now()
      elapsedTime = 0
      remainingTime.value = workDuration.value
    }
  }

  // Métodos públicos
  const start = () => {
    if (isRunning.value) return

    if (isIdle.value) {
      currentRound.value = 1
      phase.value = INTERVAL_PHASES.WORK
      remainingTime.value = workDuration.value
    }

    state.value = TIMER_STATES.RUNNING
    startTime = Date.now()
    elapsedTime = 0
    lastWarningSecond = 0
    countdownWarning.value = 0
    intervalId = setInterval(tick, 100)
  }

  const pause = () => {
    if (!isRunning.value) return

    state.value = TIMER_STATES.PAUSED
    clearInterval(intervalId)
    intervalId = null
    elapsedTime = Date.now() - startTime
  }

  const resume = () => {
    if (!isPaused.value) return

    state.value = TIMER_STATES.RUNNING
    startTime = Date.now() - elapsedTime
    lastWarningSecond = 0
    intervalId = setInterval(tick, 100)
  }

  const reset = () => {
    state.value = TIMER_STATES.IDLE
    clearInterval(intervalId)
    intervalId = null
    startTime = null
    elapsedTime = 0
    currentRound.value = 0
    phase.value = INTERVAL_PHASES.IDLE
    remainingTime.value = workDuration.value
    countdownWarning.value = 0
    lastWarningSecond = 0
  }

  const finish = () => {
    state.value = TIMER_STATES.FINISHED
    clearInterval(intervalId)
    intervalId = null
    countdownWarning.value = 0
  }

  // Cleanup
  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  })

  return {
    // Configuración
    workDuration,
    restDuration,
    totalRounds,

    // Estado
    state,
    currentRound,
    phase,
    remainingTime,
    countdownWarning,

    // Getters
    isRunning,
    isPaused,
    isIdle,
    phaseLabel,
    formattedTime,
    totalProgress,
    phaseProgress,

    // Métodos
    start,
    pause,
    resume,
    reset
  }
}
