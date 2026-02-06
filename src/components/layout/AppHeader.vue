<script setup>
import { computed } from 'vue'
import BaseButton from '../base/BaseButton.vue'
import { useStorage } from '../../composables/useStorage.js'
import { useFullscreen } from '../../composables/useFullscreen.js'

const emit = defineEmits(['add-timer', 'open-settings'])

const { settings, updateSetting } = useStorage()
const { isFullscreen, toggleFullscreen } = useFullscreen()

const isDark = computed(() => settings.value.theme === 'dark')

const toggleTheme = () => {
  const newTheme = isDark.value ? 'light' : 'dark'
  updateSetting('theme', newTheme)
  document.documentElement.setAttribute('data-theme', newTheme)
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__content">
      <!-- Logo -->
      <div class="app-header__brand">
        <span class="app-header__logo" role="img" aria-hidden="true">⏱️</span>
        <h1 class="app-header__title">Contador de Atletismo</h1>
      </div>
      
      <!-- Acciones -->
      <nav class="app-header__actions" aria-label="Acciones principales">
        <BaseButton
          variant="icon"
          title="Agregar timer"
          aria-label="Agregar timer"
          @click="$emit('add-timer')"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </BaseButton>

        <BaseButton
          variant="icon"
          title="Configuración"
          aria-label="Configuración"
          @click="$emit('open-settings')"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </BaseButton>

        <BaseButton
          variant="icon"
          :title="isDark ? 'Modo claro' : 'Modo oscuro'"
          :aria-label="isDark ? 'Modo claro' : 'Modo oscuro'"
          @click="toggleTheme"
        >
          <svg v-if="isDark" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </BaseButton>

        <BaseButton
          variant="icon"
          :title="isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'"
          :aria-label="isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'"
          @click="toggleFullscreen"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
          </svg>
        </BaseButton>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header__content {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-4) var(--spacing-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.app-header__logo {
  font-size: var(--font-size-2xl);
}

.app-header__title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: 700;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

@media (max-width: 768px) {
  .app-header__content {
    padding: var(--spacing-3) var(--spacing-4);
  }
  
  .app-header__title {
    font-size: var(--font-size-lg);
  }
}

@media (max-width: 480px) {
  .app-header__title {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}
</style>
