/**
 * Utilidades para formateo de tiempo
 * Evita duplicación de código en múltiples componentes
 */

/**
 * Formatea milisegundos a formato MM:SS.CC
 * @param {number} ms - Milisegundos
 * @returns {string} - Tiempo formateado
 */
export function formatTime(ms) {
  if (ms < 0) ms = 0
  
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const centiseconds = Math.floor((ms % 1000) / 10)
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
}

/**
 * Formatea milisegundos a formato MM:SS
 * @param {number} ms - Milisegundos
 * @returns {string} - Tiempo formateado sin centésimas
 */
export function formatTimeShort(ms) {
  if (ms < 0) ms = 0
  
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Formatea segundos a formato legible (e.g., "5 min 30 seg")
 * @param {number} seconds - Segundos
 * @returns {string} - Tiempo legible
 */
export function formatDuration(seconds) {
  if (seconds < 60) {
    return `${seconds} seg`
  }
  
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  
  if (secs === 0) {
    return `${mins} min`
  }
  
  return `${mins} min ${secs} seg`
}

/**
 * Parsea un string de tiempo a milisegundos
 * @param {string} timeStr - String en formato MM:SS o MM:SS.CC
 * @returns {number} - Milisegundos
 */
export function parseTimeString(timeStr) {
  const parts = timeStr.split(':')
  if (parts.length < 2) return 0
  
  const minutes = parseInt(parts[0]) || 0
  const secondsParts = parts[1].split('.')
  const seconds = parseInt(secondsParts[0]) || 0
  const centiseconds = secondsParts[1] ? parseInt(secondsParts[1]) : 0
  
  return (minutes * 60 + seconds) * 1000 + centiseconds * 10
}
