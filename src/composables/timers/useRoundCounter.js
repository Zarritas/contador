import { ref, computed } from 'vue'
import { TIMER_DEFAULTS } from '../../constants/appConstants.js'

/**
 * Composable para Contador de Rondas
 * Simple contador con incremento configurable
 * 
 * @param {number} initialStep - Incremento por defecto
 * @returns {Object} - Estado y métodos del contador
 */
export function useRoundCounter(initialStep = TIMER_DEFAULTS.roundCounter.step) {
  // Estado
  const count = ref(0)
  const step = ref(initialStep)
  const target = ref(null)

  // Getters
  const hasTarget = computed(() => target.value !== null && target.value > 0)
  const progress = computed(() => {
    if (!hasTarget.value) return 0
    return Math.min((count.value / target.value) * 100, 100)
  })
  const isTargetReached = computed(() => {
    if (!hasTarget.value) return false
    return count.value >= target.value
  })

  /**
   * Incrementa el contador
   */
  const increment = () => {
    count.value += step.value
  }

  /**
   * Decrementa el contador (no baja de 0)
   */
  const decrement = () => {
    count.value = Math.max(0, count.value - step.value)
  }

  /**
   * Resetea el contador
   */
  const reset = () => {
    count.value = 0
  }

  /**
   * Establece el incremento
   */
  const setStep = (newStep) => {
    step.value = Math.max(1, newStep)
  }

  /**
   * Establece el objetivo
   */
  const setTarget = (newTarget) => {
    target.value = (newTarget != null && newTarget > 0) ? newTarget : null
  }

  return {
    // Estado
    count,
    step,
    target,
    
    // Getters
    hasTarget,
    progress,
    isTargetReached,
    
    // Métodos
    increment,
    decrement,
    reset,
    setStep,
    setTarget
  }
}
