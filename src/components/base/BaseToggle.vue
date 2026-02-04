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
</script>

<template>
  <label class="base-toggle" @click.prevent="handleToggle">
    <span class="base-toggle__label">{{ label }}</span>
    <input
      type="checkbox"
      :checked="modelValue"
      class="base-toggle__input"
    />
    <span class="base-toggle__switch"></span>
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

.base-toggle__label {
  font-weight: 500;
}

.base-toggle__input {
  display: none;
}

.base-toggle__switch {
  width: 48px;
  height: 24px;
  background-color: var(--color-border);
  border-radius: var(--radius-full);
  position: relative;
  transition: background-color var(--transition-fast);
}

.base-toggle__switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform var(--transition-fast);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.base-toggle__input:checked + .base-toggle__switch {
  background-color: var(--color-primary);
}

.base-toggle__input:checked + .base-toggle__switch::after {
  transform: translateX(24px);
}
</style>
