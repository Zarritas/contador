<script setup>
import { watch } from 'vue'
import { useRoundCounter } from '../../composables/timers/useRoundCounter.js'
import { useAudio } from '../../composables/useAudio.js'
import { useStorage } from '../../composables/useStorage.js'
import { LIMITS } from '../../constants/appConstants.js'
import BaseButton from '../base/BaseButton.vue'
import BaseInput from '../base/BaseInput.vue'

const props = defineProps({
  timer: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])

const { settings } = useStorage()
const { playTimerEnd } = useAudio()

const counter = useRoundCounter(props.timer.step)

// Configurar target si existe
if (props.timer.target) {
  counter.setTarget(props.timer.target)
}

// Watch para sonido al alcanzar meta
watch(() => counter.isTargetReached.value, (reached) => {
  if (reached) playTimerEnd()
})

const updateStep = (step) => {
  counter.setStep(step)
  emit('update', { step })
}

const updateTarget = (target) => {
  const value = target ? parseInt(target) : null
  counter.setTarget(value)
  emit('update', { target: value })
}
</script>

<template>
  <div class="round-counter-display">
    <div class="counter-controls">
      <BaseButton
        class="counter-btn"
        aria-label="Decrementar"
        @click="counter.decrement"
      >
        −
      </BaseButton>

      <div class="counter-value">
        {{ counter.count.value }}
      </div>

      <BaseButton
        class="counter-btn"
        aria-label="Incrementar"
        @click="counter.increment"
      >
        +
      </BaseButton>
    </div>
    
    <!-- Barra de progreso -->
    <div v-if="counter.hasTarget.value" class="progress-container">
      <div
        class="progress-bar"
        role="progressbar"
        :aria-valuenow="counter.count.value"
        :aria-valuemin="0"
        :aria-valuemax="counter.target.value"
        aria-label="Progreso hacia la meta"
      >
        <div
          class="progress-fill"
          :style="{ width: counter.progress.value + '%' }"
        ></div>
      </div>
      <span class="target-label">Meta: {{ counter.target.value }}</span>
    </div>
    
    <!-- Configuración -->
    <div class="timer-config">
      <BaseInput
        type="number"
        label="Incremento"
        :model-value="counter.step.value"
        @change="updateStep($event)"
        :min="LIMITS.roundStep.min"
        :max="LIMITS.roundStep.max"
        :step="LIMITS.roundStep.step"
      />
      
      <BaseInput
        type="number"
        label="Meta (opcional)"
        :model-value="counter.target.value || ''"
        @change="updateTarget($event)"
        :min="1"
        placeholder="Sin meta"
      />
    </div>
    
    <div class="timer-controls">
      <BaseButton @click="counter.reset">
        🔄 Reiniciar
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.round-counter-display {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.counter-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
}

.counter-btn {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-2xl);
  font-weight: 700;
}

.counter-value {
  font-family: var(--font-mono);
  font-size: var(--font-size-6xl);
  font-weight: 700;
  min-width: 120px;
  text-align: center;
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
  transition: width 0.3s ease;
}

.target-label {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.timer-config {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  background-color: var(--color-background);
  border-radius: var(--radius-md);
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: var(--spacing-3);
}

@media (max-width: 480px) {
  .counter-value {
    font-size: var(--font-size-5xl);
    min-width: 80px;
  }
  
  .counter-btn {
    width: 50px;
    height: 50px;
    font-size: var(--font-size-xl);
  }
}
</style>
