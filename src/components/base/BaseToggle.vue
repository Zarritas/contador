<script setup>
/**
 * BaseToggle - Componente base para switches/toggles
 * Props:
 * - modelValue: boolean
 * - label: string
 */
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const handleToggle = () => {
  emit('update:modelValue', !props.modelValue)
}

const handleKeydown = (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleToggle()
  }
}
</script>

<template>
  <label
    class="base-toggle"
    role="switch"
    :aria-checked="modelValue"
    tabindex="0"
    @click="handleToggle"
    @keydown="handleKeydown"
  >
    <span class="base-toggle__label">{{ label }}</span>
    <span class="base-toggle__switch" aria-hidden="true"></span>
  </label>
</template>

<style scoped>
.base-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: var(--spacing-3) 0;
}

.base-toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.base-toggle__label {
  font-weight: 500;
}

.base-toggle__switch {
  width: 48px;
  height: 24px;
  background-color: var(--color-border);
  border-radius: var(--radius-full);
  position: relative;
  transition: background-color var(--transition-fast);
  flex-shrink: 0;
}

.base-toggle__switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: var(--color-surface);
  border-radius: 50%;
  transition: transform var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

[aria-checked="true"] .base-toggle__switch {
  background-color: var(--color-primary);
}

[aria-checked="true"] .base-toggle__switch::after {
  transform: translateX(24px);
}
</style>
