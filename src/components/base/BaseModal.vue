<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'
import BaseButton from './BaseButton.vue'

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

const contentRef = ref(null)
let previousActiveElement = null

const handleClose = () => {
  emit('close')
}

const handleOverlayClick = () => {
  emit('close')
}

const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    handleClose()
    return
  }

  // Focus trap: Tab y Shift+Tab
  if (e.key === 'Tab' && contentRef.value) {
    const focusable = contentRef.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    previousActiveElement = document.activeElement
    nextTick(() => {
      if (contentRef.value) {
        const firstFocusable = contentRef.value.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (firstFocusable) firstFocusable.focus()
      }
    })
  } else {
    if (previousActiveElement) {
      previousActiveElement.focus()
      previousActiveElement = null
    }
  }
}, { immediate: true })

onUnmounted(() => {
  if (previousActiveElement) {
    previousActiveElement.focus()
    previousActiveElement = null
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="base-modal"
        @keydown="handleKeydown"
      >
        <div class="base-modal__overlay" @click="handleOverlayClick"></div>
        <div
          ref="contentRef"
          class="base-modal__content"
          role="dialog"
          aria-modal="true"
          :aria-label="title || undefined"
          :style="{ maxWidth }"
        >
          <header v-if="title" class="base-modal__header">
            <h2 class="base-modal__title">{{ title }}</h2>
            <BaseButton variant="icon" size="small" @click="handleClose" title="Cerrar" aria-label="Cerrar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
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
  background-color: var(--color-overlay);
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
