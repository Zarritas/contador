<script setup>
/**
 * BaseModal - Componente base para todos los modales
 * Props:
 * - isOpen: boolean - Controla visibilidad
 * - title: string - Título del modal
 * - maxWidth: string - Ancho máximo (default: '600px')
 */
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: String,
    default: '600px'
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

const handleOverlayClick = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="base-modal" @click.self="handleOverlayClick">
        <div class="base-modal__overlay"></div>
        <div class="base-modal__content" :style="{ maxWidth }">
          <header v-if="title" class="base-modal__header">
            <h2 class="base-modal__title">{{ title }}</h2>
            <BaseButton variant="icon" size="small" @click="handleClose" title="Cerrar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </BaseButton>
          </header>
          <div class="base-modal__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="base-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
// Importar BaseButton para uso en este componente
import BaseButton from './BaseButton.vue'
export { BaseButton }
</script>

<style scoped>
.base-modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
}

.base-modal__overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.base-modal__content {
  position: relative;
  background-color: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.base-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-5) var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
}

.base-modal__title {
  margin: 0;
  font-size: var(--font-size-xl);
}

.base-modal__body {
  padding: var(--spacing-6);
  overflow-y: auto;
  flex: 1;
}

.base-modal__footer {
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--transition-base);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .base-modal__content,
.modal-leave-active .base-modal__content {
  transition: transform var(--transition-base);
}

.modal-enter-from .base-modal__content,
.modal-leave-to .base-modal__content {
  transform: scale(0.95);
}
</style>
