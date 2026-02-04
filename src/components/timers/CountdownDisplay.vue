<script setup>
import { watch } from 'vue'
import { useCountdown } from '../../composables/timers/useCountdown.js'
import { useAudio } from '../../composables/useAudio.js'
import { useStorage } from '../../composables/useStorage.js'
import BaseButton from '../base/BaseButton.vue'
import BaseInput from '../base/BaseInput.vue'

const props = defineProps({
  timer: Object
})

const emit = defineEmits(['update'])

const { settings } = useStorage()
const { playIntervalSwitch, playTimerEnd } = useAudio()

const countdown = useCountdown(props.timer.duration)

// Actualizar duración si cambia en settings
watch(() => settings.value.defaultDuration, (newDuration) => {
  if (countdown.isIdle.value) {
    countdown.setDuration(newDuration * 60000)
  }
})

// Sonidos
watch(() => countdown.isRunning.value, (isRunning) => {
  if (isRunning) playIntervalSwitch()
})

watch(() => countdown.isFinished.value, (isFinished) => {
  if (isFinished) playTimerEnd()
})

const handleStart = () => {
  if (countdown.isRunning.value) {
    countdown.pause()
  } else if (countdown.isPaused.value) {
    countdown.resume()
  } else {
    countdown.start()
  }
}

const updateDuration = (minutes) => {
  const ms = minutes * 60000
  countdown.setDuration(ms)
  emit('update', { duration: ms })
}
</script>

<template>
  <div class="countdown-display">
    <div :class="['timer-display', countdown.state.value]">
      {{ countdown.formattedTime.value }}
    </div>
    
    <!-- Configuración (solo en idle) -->
    <div v-if="countdown.isIdle.value" class="timer-config">
      <BaseInput
        type="number"
        label="Duración (minutos)"
        :model-value="countdown.duration.value / 60000"
        @change="updateDuration($event)"
        :min="1"
        :max="120"
      />
    </div>
    
    <div class="timer-controls">
      <BaseButton 
        variant="primary" 
        @click="handleStart"
      >
        {{ countdown.isRunning.value ? '⏸️ Pausar' : (countdown.isPaused.value ? '▶️ Continuar' : '▶️ Iniciar') }}
      </BaseButton>
      
      <BaseButton @click="countdown.reset">
        🔄 Reiniciar
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.countdown-display {
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

.timer-display.paused {
  color: var(--color-warning);
}

.timer-display.finished {
  color: var(--color-success);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.timer-config {
  padding: var(--spacing-3);
  background-color: var(--color-background);
  border-radius: var(--radius-md);
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .timer-display {
    font-size: var(--font-size-4xl);
  }
}
</style>
