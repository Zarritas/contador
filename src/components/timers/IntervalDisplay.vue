<script setup>
import { watch } from 'vue'
import { useIntervalTimer } from '../../composables/timers/useIntervalTimer.js'
import { useAudio } from '../../composables/useAudio.js'
import BaseButton from '../base/BaseButton.vue'
import BaseInput from '../base/BaseInput.vue'

const props = defineProps({
  timer: Object
})

const emit = defineEmits(['update'])

const { playIntervalSwitch, playTimerEnd } = useAudio()

const interval = useIntervalTimer({
  workDuration: props.timer.workDuration,
  restDuration: props.timer.restDuration,
  rounds: props.timer.rounds
})

// Sonidos
watch(() => interval.isRunning.value, (isRunning, wasRunning) => {
  if (isRunning && !wasRunning) playIntervalSwitch()
})

watch(() => interval.isFinished.value, (isFinished) => {
  if (isFinished) playTimerEnd()
})

const handleStart = () => {
  if (interval.isRunning.value) {
    interval.pause()
  } else if (interval.isPaused.value) {
    interval.resume()
  } else {
    interval.start()
  }
}

const updateWorkDuration = (seconds) => {
  const ms = seconds * 1000
  interval.workDuration.value = ms
  emit('update', { workDuration: ms })
}

const updateRestDuration = (seconds) => {
  const ms = seconds * 1000
  interval.restDuration.value = ms
  emit('update', { restDuration: ms })
}

const updateRounds = (rounds) => {
  interval.totalRounds.value = rounds
  emit('update', { rounds })
}
</script>

<template>
  <div class="interval-display">
    <!-- Fase actual -->
    <div v-if="!interval.isIdle.value" class="phase-indicator">
      <span class="phase-label">Fase</span>
      <span :class="['phase-value', interval.phase.value]">
        {{ interval.phaseLabel.value }}
      </span>
    </div>
    
    <!-- Tiempo -->
    <div :class="['timer-display', interval.state.value]">
      {{ interval.formattedTime.value }}
    </div>
    
    <!-- Progreso total -->
    <div v-if="!interval.isIdle.value" class="progress-container">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: interval.totalProgress.value + '%' }"
        ></div>
      </div>
      <span class="rounds-info">
        Ronda {{ interval.currentRound.value }} de {{ interval.totalRounds.value }}
      </span>
    </div>
    
    <!-- Configuración (solo en idle) -->
    <div v-if="interval.isIdle.value" class="timer-config">
      <BaseInput
        type="number"
        label="Trabajo (seg)"
        :model-value="interval.workDuration.value / 1000"
        @change="updateWorkDuration(parseInt($event))"
        :min="5"
        :max="300"
      />
      
      <BaseInput
        type="number"
        label="Descanso (seg)"
        :model-value="interval.restDuration.value / 1000"
        @change="updateRestDuration(parseInt($event))"
        :min="5"
        :max="300"
      />
      
      <BaseInput
        type="number"
        label="Rondas"
        :model-value="interval.totalRounds.value"
        @change="updateRounds(parseInt($event))"
        :min="1"
        :max="50"
      />
    </div>
    
    <div class="timer-controls">
      <BaseButton 
        variant="primary" 
        @click="handleStart"
      >
        {{ interval.isRunning.value ? '⏸️ Pausar' : (interval.isPaused.value ? '▶️ Continuar' : '▶️ Iniciar') }}
      </BaseButton>
      
      <BaseButton @click="interval.reset">
        🔄 Reiniciar
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.interval-display {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.phase-indicator {
  text-align: center;
}

.phase-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
}

.phase-value {
  display: block;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
}

.phase-value.rest {
  color: var(--color-success);
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

.progress-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.progress-bar {
  height: 8px;
  background-color: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.1s linear;
}

.rounds-info {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.timer-config {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-3);
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
  
  .timer-config {
    grid-template-columns: 1fr;
  }
}
</style>
