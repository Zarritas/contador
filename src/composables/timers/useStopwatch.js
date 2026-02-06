import { ref, computed } from 'vue'
import { useBaseTimer } from './useBaseTimer.js'

/**
 * Composable para Cronómetro (Stopwatch)
 * Extiende useBaseTimer con funcionalidad de vueltas
 * 
 * @returns {Object} - Estado y métodos del cronómetro
 */
export function useStopwatch() {
  const base = useBaseTimer()
  const laps = ref([])

  const hasLaps = computed(() => laps.value.length > 0)

  /**
   * Registra una vuelta
   */
  const recordLap = () => {
    if (!base.isRunning.value) return
    
    const lapTime = base.elapsedTime.value
    const previousLapTime = laps.value.length > 0 
      ? laps.value[laps.value.length - 1].totalTime 
      : 0
    const splitTime = lapTime - previousLapTime
    
    laps.value.push({
      number: laps.value.length + 1,
      splitTime,
      totalTime: lapTime
    })
  }

  /**
   * Resetea el cronómetro y limpia las vueltas
   */
  const reset = () => {
    base.reset()
    laps.value = []
  }

  return {
    // Heredado de base timer
    ...base,
    
    // Estado específico
    laps,
    hasLaps,
    
    // Métodos específicos
    recordLap,
    reset
  }
}
