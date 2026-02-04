import { ref } from 'vue'
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '../constants/appConstants.js'

/**
 * Store de configuraciones con persistencia
 * Implementa patrón Singleton
 */
const settings = ref({ ...DEFAULT_SETTINGS })
let isInitialized = false

const loadSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    if (stored) {
      settings.value = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
  } catch (e) {
    console.error('Error loading settings:', e)
  }
}

const saveSettings = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings.value))
  } catch (e) {
    console.error('Error saving settings:', e)
  }
}

export function useStorage() {
  if (!isInitialized) {
    loadSettings()
    isInitialized = true
  }

  const updateSetting = (key, value) => {
    settings.value[key] = value
    saveSettings()
  }

  const resetSettings = () => {
    settings.value = { ...DEFAULT_SETTINGS }
    saveSettings()
  }

  return {
    settings,
    updateSetting,
    resetSettings
  }
}
