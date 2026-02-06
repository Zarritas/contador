/**
 * Generadores de IDs únicos
 */

/**
 * Genera un ID único para timers
 * @returns {string} - ID único
 */
export function generateTimerId() {
  return `timer_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

