<script setup>
import BaseButton from '../base/BaseButton.vue'

const emit = defineEmits(['add'])
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__icon">🏃</div>
    <h2 class="empty-state__title">Comienza tu entrenamiento</h2>
    <p class="empty-state__text">Agrega tu primer timer para comenzar</p>
    <BaseButton variant="primary" size="large" @click="$emit('add')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Agregar Timer
    </BaseButton>
  </div>
</template>

<style scoped>
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--spacing-12) var(--spacing-6);
}

.empty-state__icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-4);
}

.empty-state__title {
  color: var(--color-text);
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-2xl);
}

.empty-state__text {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-6);
  font-size: var(--font-size-lg);
}
</style>
