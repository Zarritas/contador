<script setup>
/**
 * BaseButton - Componente base para todos los botones
 * Props:
 * - variant: 'primary' | 'danger' | 'icon' | 'default'
 * - size: 'small' | 'medium' | 'large'
 * - disabled: boolean
 * - type: 'button' | 'submit' | 'reset'
 */
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'danger', 'icon'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<template>
  <button
    :type="type"
    :class="['base-btn', `base-btn--${variant}`, `base-btn--${size}`]"
    :disabled="disabled"
    :title="title"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-family: inherit;
  font-weight: 600;
  line-height: 1.5;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.base-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.base-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.base-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.base-btn--small {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
}

.base-btn--medium {
  padding: var(--spacing-3) var(--spacing-5);
  font-size: var(--font-size-base);
}

.base-btn--large {
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-lg);
}

/* Variants */
.base-btn--default {
  color: var(--color-text);
  background-color: var(--color-surface);
}

.base-btn--default:hover:not(:disabled) {
  background-color: var(--color-background);
  border-color: var(--color-text-secondary);
}

.base-btn--primary {
  color: white;
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.base-btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.base-btn--danger {
  color: white;
  background-color: var(--color-danger);
  border-color: var(--color-danger);
}

.base-btn--danger:hover:not(:disabled) {
  background-color: #dc2626;
  border-color: #dc2626;
}

.base-btn--icon {
  padding: var(--spacing-2);
  border-radius: var(--radius-full);
  background-color: transparent;
  border: none;
}

.base-btn--icon:hover:not(:disabled) {
  background-color: var(--color-background);
}
</style>
