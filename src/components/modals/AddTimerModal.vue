<script setup>
import BaseModal from '../base/BaseModal.vue'
import BaseButton from '../base/BaseButton.vue'
import { TIMER_TYPES } from '../../constants/appConstants.js'

const emit = defineEmits(['select', 'close'])

const handleSelect = (type) => {
  emit('select', type)
}
</script>

<template>
  <BaseModal
    :is-open="true"
    title="Agregar Timer"
    @close="$emit('close')"
  >
    <div class="timer-types">
      <button
        v-for="timerType in TIMER_TYPES"
        :key="timerType.type"
        class="timer-type-card"
        @click="handleSelect(timerType.type)"
      >
        <div class="timer-type-card__icon">{{ timerType.icon }}</div>
        <h3 class="timer-type-card__name">{{ timerType.name }}</h3>
        <p class="timer-type-card__desc">{{ timerType.description }}</p>
      </button>
    </div>
  </BaseModal>
</template>

<style scoped>
.timer-types {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-4);
}

.timer-type-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-6);
  background-color: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.timer-type-card:hover {
  border-color: var(--color-primary);
  background-color: var(--color-surface);
  transform: translateY(-2px);
}

.timer-type-card__icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-3);
}

.timer-type-card__name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-1);
  color: var(--color-text);
}

.timer-type-card__desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

@media (max-width: 768px) {
  .timer-types {
    grid-template-columns: 1fr;
  }
}
</style>
