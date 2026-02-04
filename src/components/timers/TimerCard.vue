<script setup>
import { ref } from 'vue'
import BaseButton from '../base/BaseButton.vue'
import StopwatchDisplay from './StopwatchDisplay.vue'
import CountdownDisplay from './CountdownDisplay.vue'
import RoundCounterDisplay from './RoundCounterDisplay.vue'
import IntervalDisplay from './IntervalDisplay.vue'

const props = defineProps({
  timer: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete', 'update'])

const isEditing = ref(false)
const editedName = ref(props.timer.name)

const getIcon = () => {
  const icons = {
    stopwatch: '⏱️',
    countdown: '⏲️',
    rounds: '🔢',
    interval: '🔁'
  }
  return icons[props.timer.type] || '⏱️'
}

const getTypeLabel = () => {
  const labels = {
    stopwatch: 'Cronómetro',
    countdown: 'Temporizador',
    rounds: 'Contador',
    interval: 'HIIT'
  }
  return labels[props.timer.type] || 'Timer'
}

const startEditing = () => {
  editedName.value = props.timer.name
  isEditing.value = true
}

const saveName = () => {
  if (editedName.value.trim()) {
    emit('update', { name: editedName.value.trim() })
  }
  isEditing.value = false
}

const cancelEdit = () => {
  editedName.value = props.timer.name
  isEditing.value = false
}

const handleUpdate = (updates) => {
  emit('update', updates)
}
</script>

<template>
  <div class="timer-card">
    <!-- Header -->
    <div class="timer-card__header">
      <div class="timer-card__title">
        <span class="timer-card__icon">{{ getIcon() }}</span>
        
        <template v-if="isEditing">
          <input
            v-model="editedName"
            class="timer-card__name-input"
            @keyup.enter="saveName"
            @keyup.esc="cancelEdit"
            @blur="saveName"
            ref="nameInput"
          />
        </template>
        <template v-else>
          <h3 @dblclick="startEditing" class="timer-card__name">
            {{ timer.name }}
          </h3>
        </template>
      </div>
      
      <div class="timer-card__actions">
        <BaseButton 
          variant="icon" 
          size="small"
          title="Editar nombre"
          @click="startEditing"
        >
          ✏️
        </BaseButton>
        <BaseButton 
          variant="icon" 
          size="small"
          title="Eliminar"
          @click="$emit('delete', timer.id)"
        >
          🗑️
        </BaseButton>
      </div>
    </div>
    
    <!-- Body - Componente específico según tipo -->
    <div class="timer-card__body">
      <StopwatchDisplay
        v-if="timer.type === 'stopwatch'"
        :timer="timer"
        @update="handleUpdate"
      />
      
      <CountdownDisplay
        v-else-if="timer.type === 'countdown'"
        :timer="timer"
        @update="handleUpdate"
      />
      
      <RoundCounterDisplay
        v-else-if="timer.type === 'rounds'"
        :timer="timer"
        @update="handleUpdate"
      />
      
      <IntervalDisplay
        v-else-if="timer.type === 'interval'"
        :timer="timer"
        @update="handleUpdate"
      />
    </div>
  </div>
</template>

<style scoped>
.timer-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.timer-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.timer-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4);
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

.timer-card__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex: 1;
  min-width: 0;
}

.timer-card__icon {
  font-size: var(--font-size-xl);
  flex-shrink: 0;
}

.timer-card__name {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timer-card__name:hover {
  color: var(--color-primary);
}

.timer-card__name-input {
  font-size: var(--font-size-lg);
  font-weight: 600;
  padding: var(--spacing-1) var(--spacing-2);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  color: var(--color-text);
  width: 100%;
  min-width: 0;
}

.timer-card__name-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.timer-card__actions {
  display: flex;
  gap: var(--spacing-1);
  flex-shrink: 0;
}

.timer-card__body {
  padding: var(--spacing-6);
}

@media (max-width: 480px) {
  .timer-card__header {
    padding: var(--spacing-3);
  }
  
  .timer-card__body {
    padding: var(--spacing-4);
  }
}
</style>
