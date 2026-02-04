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

/**
 * Genera un ID corto aleatorio
 * @param {number} length - Longitud del ID
 * @returns {string} - ID aleatorio
 */
export function generateShortId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
