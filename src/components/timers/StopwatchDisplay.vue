<script setup>
import { watch } from 'vue'
import { useStopwatch } from '../../composables/timers/useStopwatch.js'
import { formatTime } from '../../utils/timeFormatters.js'
import { useAudio } from '../../composables/useAudio.js'

import BaseButton from '../base/BaseButton.vue'

const props = defineProps({
  timer: Object
})

const emit = defineEmits(['update'])

const { playIntervalSwitch } = useAudio()
const stopwatch = useStopwatch()

// Sincronizar nombre
const updateName = (newName) => {
  emit('update', { name: newName })
}

// Observar estado para sonidos
watch(() => stopwatch.isRunning.value, (isRunning) => {
  if (isRunning) playIntervalSwitch()
})

const handleStart = () => {
  if (stopwatch.isRunning.value) {
    stopwatch.pause()
  } else if (stopwatch.isPaused.value) {
    stopwatch.resume()
  } else {
    stopwatch.start()
  }
}
</script>

<template>
  <div class="stopwatch-display">
    <div :class="['timer-display', stopwatch.state.value]">
      {{ stopwatch.formattedTime.value }}
    </div>
    
    <div class="timer-controls">
      <BaseButton 
        :variant="'primary'" 
        @click="handleStart"
      >
        {{ stopwatch.isRunning.value ? '⏸️ Pausar' : (stopwatch.isPaused.value ? '▶️ Continuar' : '▶️ Iniciar') }}
      </BaseButton>
      
      <BaseButton 
        @click="stopwatch.recordLap" 
        :disabled="!stopwatch.isRunning.value"
      >
        🏁 Vuelta
      </BaseButton>
      
      <BaseButton @click="stopwatch.reset">
        🔄 Reiniciar
      </BaseButton>
    </div>

    <!-- Vueltas -->
    <div v-if="stopwatch.hasLaps.value" class="laps-container">
      <h4>Vueltas</h4>
      <div class="laps-list">
        <div 
          v-for="lap in stopwatch.laps.value" 
          :key="lap.number" 
          class="lap-item"
        >
          <span>#{{ lap.number }}</span>
          <span>+{{ formatTime(lap.splitTime) }}</span>
          <span>{{ formatTime(lap.totalTime) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stopwatch-display {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.timer-display {
  font-family: var(--font-mono);
  font-size: var(--font-size-5xl);
  font-weight: 700;
  text-align: center;
  color: var(--color-text);
  line-height: 1;
}

.timer-display.running {
  color: var(--color-primary);
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

.laps-container {
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-border);
}

.laps-container h4 {
  margin-bottom: var(--spacing-3);
  font-size: var(--font-size-base);
}

.laps-list {
  max-height: 150px;
  overflow-y: auto;
}

.lap-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-2);
  border-bottom: 1px solid var(--color-border);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
}

.lap-item:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .timer-display {
    font-size: var(--font-size-4xl);
  }
}
</style>
