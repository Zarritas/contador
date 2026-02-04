import { ref, computed } from 'vue'
import { generateTimerId } from '../utils/idGenerators.js'
import { TIMER_TYPES, TIMER_DEFAULTS, STORAGE_KEYS } from '../constants/appConstants.js'

/**
 * Store centralizado para gestión de timers
 * Implementa patrón Singleton para estado global
 */
const timers = ref([])
let isInitialized = false

/**
 * Crea un nuevo timer con configuración por defecto
 */
const createTimer = (type, settings = {}) => {
  const typeConfig = TIMER_TYPES.find(t => t.type === type)
  const typeCount = timers.value.filter(t => t.type === type).length
  
  const baseTimer = {
    id: generateTimerId(),
    type,
    name: `${typeConfig.name} ${typeCount + 1}`,
    createdAt: Date.now()
  }

  // Configuración específica por tipo
  switch (type) {
    case 'countdown':
      return {
        ...baseTimer,
        duration: settings.defaultDuration * 60000 || TIMER_DEFAULTS.countdown
      }
    
    case 'rounds':
      return {
        ...baseTimer,
        step: settings.roundStep || TIMER_DEFAULTS.roundCounter.step,
        target: null
      }
    
    case 'interval':
      return {
        ...baseTimer,
        workDuration: TIMER_DEFAULTS.interval.work,
        restDuration: TIMER_DEFAULTS.interval.rest,
        rounds: TIMER_DEFAULTS.interval.rounds
      }
    
    case 'stopwatch':
    default:
      return baseTimer
  }
}

/**
 * Hook composable para acceder al store
 */
export function useTimerStore() {
  // Inicializar desde localStorage
  if (!isInitialized) {
    const stored = localStorage.getItem(STORAGE_KEYS.TIMERS)
    if (stored) {
      try {
        timers.value = JSON.parse(stored)
      } catch (e) {
        console.error('Error loading timers:', e)
      }
    }
    isInitialized = true
  }

  // Getters
  const hasTimers = computed(() => timers.value.length > 0)
  const timersCount = computed(() => timers.value.length)
  
  const getTimersByType = (type) => {
    return timers.value.filter(t => t.type === type)
  }

  // Acciones
  const addTimer = (type, settings = {}) => {
    const timer = createTimer(type, settings)
    timers.value.push(timer)
    saveTimers()
    return timer
  }

  const removeTimer = (id) => {
    timers.value = timers.value.filter(t => t.id !== id)
    saveTimers()
  }

  const updateTimer = (id, updates) => {
    const index = timers.value.findIndex(t => t.id === id)
    if (index !== -1) {
      timers.value[index] = { ...timers.value[index], ...updates }
      saveTimers()
    }
  }

  const clearAllTimers = () => {
    timers.value = []
    saveTimers()
  }

  const saveTimers = () => {
    localStorage.setItem(STORAGE_KEYS.TIMERS, JSON.stringify(timers.value))
  }

  return {
    // Estado
    timers,
    
    // Getters
    hasTimers,
    timersCount,
    getTimersByType,
    
    // Acciones
    addTimer,
    removeTimer,
    updateTimer,
    clearAllTimers
  }
}
