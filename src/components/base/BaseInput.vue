<script setup>
/**
 * BaseInput - Componente base para inputs
 * Props:
 * - modelValue: string | number
 * - type: 'text' | 'number' | 'email' | 'password'
 * - label: string
 * - placeholder: string
 * - min/max/step: number (para type='number')
 * - disabled: boolean
 */
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  min: {
    type: Number,
    default: null
  },
  max: {
    type: Number,
    default: null
  },
  step: {
    type: Number,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleInput = (event) => {
  let value = event.target.value
  
  if (props.type === 'number') {
    value = value === '' ? '' : Number(value)
  }
  
  emit('update:modelValue', value)
}

const handleChange = (event) => {
  emit('change', event.target.value)
}
</script>

<template>
  <label class="base-input-wrapper">
    <span v-if="label" class="base-input__label">{{ label }}</span>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      class="base-input"
      @input="handleInput"
      @change="handleChange"
    />
  </label>
</template>

<style scoped>
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.base-input__label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.base-input {
  font-family: inherit;
  font-size: var(--font-size-base);
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  color: var(--color-text);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  width: 100%;
}

.base-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.base-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--color-background);
}
</style>
