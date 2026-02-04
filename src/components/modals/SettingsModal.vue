<script setup>
import BaseModal from '../base/BaseModal.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseToggle from '../base/BaseToggle.vue'
import BaseInput from '../base/BaseInput.vue'
import { useStorage } from '../../composables/useStorage.js'
import { LIMITS } from '../../constants/appConstants.js'

const emit = defineEmits(['close', 'clear-data'])
const { settings, updateSetting } = useStorage()

const handleClearData = () => {
  if (confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
    emit('clear-data')
    emit('close')
  }
}
</script>

<template>
  <BaseModal
    :is-open="true"
    title="Configuración"
    @close="$emit('close')"
  >
    <div class="settings-sections">
      <!-- Sonido -->
      <section class="settings-section">
        <h3 class="settings-section__title">Sonido</h3>
        
        <BaseToggle
          :model-value="settings.soundEnabled"
          @update:model-value="updateSetting('soundEnabled', $event)"
          label="Activar sonidos"
        />
        
        <BaseInput
          type="range"
          label="Volumen"
          :model-value="settings.volume"
          @update:model-value="updateSetting('volume', $event)"
          :min="LIMITS.volume.min"
          :max="LIMITS.volume.max"
          :step="LIMITS.volume.step"
        />
      </section>
      
      <!-- Temporizador por defecto -->
      <section class="settings-section">
        <h3 class="settings-section__title">Temporizador por defecto</h3>
        
        <BaseInput
          type="number"
          label="Duración (minutos)"
          :model-value="settings.defaultDuration"
          @update:model-value="updateSetting('defaultDuration', $event)"
          :min="LIMITS.duration.min"
          :max="LIMITS.duration.max"
          :step="LIMITS.duration.step"
        />
      </section>
      
      <!-- Contador de rondas -->
      <section class="settings-section">
        <h3 class="settings-section__title">Contador de rondas</h3>
        
        <BaseInput
          type="number"
          label="Incremento por defecto"
          :model-value="settings.roundStep"
          @update:model-value="updateSetting('roundStep', $event)"
          :min="LIMITS.roundStep.min"
          :max="LIMITS.roundStep.max"
          :step="LIMITS.roundStep.step"
        />
      </section>
      
      <!-- Datos -->
      <section class="settings-section">
        <h3 class="settings-section__title">Datos</h3>
        <BaseButton variant="danger" @click="handleClearData">
          Borrar todos los datos
        </BaseButton>
      </section>
    </div>
  </BaseModal>
</template>

<style scoped>
.settings-sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.settings-section {
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--color-border);
}

.settings-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.settings-section__title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
