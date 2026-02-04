/**
 * Constantes de la aplicación
 * Centraliza todos los valores por defecto y configuraciones
 */

// Configuración por defecto de la aplicación
export const DEFAULT_SETTINGS = {
  soundEnabled: true,
  volume: 80,
  defaultDuration: 5, // minutos
  roundStep: 1,
  theme: 'light'
}

// Duraciones por defecto para timers (en ms)
export const TIMER_DEFAULTS = {
  countdown: 5 * 60 * 1000, // 5 minutos
  interval: {
    work: 30 * 1000,      // 30 segundos
    rest: 10 * 1000,      // 10 segundos
    rounds: 8
  },
  stopwatch: 0,
  roundCounter: {
    step: 1,
    target: null
  }
}

// Límites para inputs
export const LIMITS = {
  duration: {
    min: 1,      // 1 minuto
    max: 120,    // 2 horas
    step: 1
  },
  workDuration: {
    min: 5,      // 5 segundos
    max: 300,    // 5 minutos
    step: 5
  },
  restDuration: {
    min: 5,
    max: 300,
    step: 5
  },
  rounds: {
    min: 1,
    max: 50,
    step: 1
  },
  roundStep: {
    min: 1,
    max: 10,
    step: 1
  },
  volume: {
    min: 0,
    max: 100,
    step: 1
  }
}

// Tipos de timers disponibles
export const TIMER_TYPES = [
  { 
    type: 'stopwatch', 
    icon: '⏱️', 
    name: 'Cronómetro', 
    description: 'Cuenta el tiempo transcurrido con vueltas'
  },
  { 
    type: 'countdown', 
    icon: '⏲️', 
    name: 'Temporizador', 
    description: 'Cuenta regresivamente desde un tiempo determinado'
  },
  { 
    type: 'rounds', 
    icon: '🔢', 
    name: 'Contador de Rondas', 
    description: 'Cuenta rondas o repeticiones con incremento configurable'
  },
  { 
    type: 'interval', 
    icon: '🔁', 
    name: 'Intervalos HIIT', 
    description: 'Alterna entre trabajo y descanso'
  }
]

// Estados posibles de un timer
export const TIMER_STATES = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  FINISHED: 'finished'
}

// Fases para interval timer
export const INTERVAL_PHASES = {
  IDLE: 'idle',
  WORK: 'work',
  REST: 'rest'
}

// Labels para fases
export const PHASE_LABELS = {
  idle: 'Listo',
  work: 'Trabajo',
  rest: 'Descanso'
}

// Claves de localStorage
export const STORAGE_KEYS = {
  SETTINGS: 'athletics-settings',
  TIMERS: 'athletics-timers'
}
