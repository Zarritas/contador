<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTimerStore } from './stores/useTimerStore.js'
import { useStorage } from './composables/useStorage.js'
import { useAudio } from './composables/useAudio.js'

// Components
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import EmptyState from './components/layout/EmptyState.vue'
import TimerCard from './components/timers/TimerCard.vue'
import AddTimerModal from './components/modals/AddTimerModal.vue'
import SettingsModal from './components/modals/SettingsModal.vue'

const { timers, hasTimers, addTimer, removeTimer, updateTimer, clearAllTimers } = useTimerStore()
const { settings } = useStorage()
const { setupAudio } = useAudio()

// UI State
const showAddModal = ref(false)
const showSettingsModal = ref(false)

// Initialize
onMounted(() => {
  setupAudio()
  
  // Apply theme
  document.documentElement.setAttribute('data-theme', settings.value.theme)
  
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
})

// Keyboard shortcuts
onMounted(() => {
  const handleKeydown = (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
      showAddModal.value = false
      showSettingsModal.value = false
    }
    
    // Space to start/pause first timer
    if (e.key === ' ' && !e.target.matches('input, textarea, button')) {
      e.preventDefault()
      // Esta funcionalidad requeriría emitir eventos desde TimerCard
      // Por simplicidad, la omitimos por ahora
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  return () => {
    document.removeEventListener('keydown', handleKeydown)
  }
})

const handleAddTimer = (type) => {
  addTimer(type, settings.value)
  showAddModal.value = false
}

const handleUpdateTimer = (id, updates) => {
  updateTimer(id, updates)
}

const handleClearData = () => {
  clearAllTimers()
}
</script>

<template>
  <div class="app">
    <AppHeader
      @add-timer="showAddModal = true"
      @open-settings="showSettingsModal = true"
    />
    
    <main class="main">
      <div class="timers-container">
        <EmptyState
          v-if="!hasTimers"
          @add="showAddModal = true"
        />
        
        <TimerCard
          v-for="timer in timers"
          :key="timer.id"
          :timer="timer"
          @delete="removeTimer"
          @update="handleUpdateTimer(timer.id, $event)"
        />
      </div>
    </main>
    
    <AppFooter />
    
    <AddTimerModal
      v-if="showAddModal"
      @select="handleAddTimer"
      @close="showAddModal = false"
    />
    
    <SettingsModal
      v-if="showSettingsModal"
      @close="showSettingsModal = false"
      @clear-data="handleClearData"
    />
  </div>
</template>

<style>
/* CSS Variables */
:root {
  /* Colors - Light Theme */
  --color-primary: #f97316;
  --color-primary-dark: #ea580c;
  --color-primary-light: #fb923c;
  --color-secondary: #1e293b;
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #1e293b;
  --color-text-secondary: #64748b;
  --color-border: #e2e8f0;
  --color-success: #22c55e;
  --color-danger: #ef4444;
  --color-warning: #eab308;
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  --font-size-6xl: 3.75rem;
  
  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
}

/* Dark Theme */
[data-theme="dark"] {
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-border: #334155;
}

/* Reset & Base Styles */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  touch-action: manipulation;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-background);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: var(--spacing-4);
}

h1 { font-size: var(--font-size-3xl); }
h2 { font-size: var(--font-size-2xl); }
h3 { font-size: var(--font-size-xl); }

p {
  margin-bottom: var(--spacing-4);
}

/* Main Content */
.main {
  flex: 1;
  padding: var(--spacing-6);
}

/* Timers Container */
.timers-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-6);
}

/* Fullscreen Mode */
:fullscreen .app-header,
:fullscreen .app-footer {
  display: none;
}

:fullscreen .main {
  padding: 0;
}

:fullscreen .timers-container {
  max-width: 100%;
  height: 100vh;
  align-content: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main {
    padding: var(--spacing-4);
  }
  
  .timers-container {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }
}

/* Utility Classes */
.sr-only {
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
</style>
