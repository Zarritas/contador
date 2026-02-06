Crea un nuevo tipo de timer llamado "$ARGUMENTS" siguiendo la arquitectura del proyecto.

Archivos a crear:
1. `src/composables/timers/use{Name}.js` — Composable que extiende `useBaseTimer()` (ver `useStopwatch.js` como referencia)
2. `src/components/timers/{Name}Display.vue` — Componente de visualización con `<script setup>` (ver `StopwatchDisplay.vue` como referencia)

Archivos a modificar:
3. `src/constants/appConstants.js` — Agregar entrada en `TIMER_TYPES` y defaults en `TIMER_DEFAULTS`
4. `src/stores/useTimerStore.js` — Agregar case en `createTimer()` switch
5. `src/components/timers/TimerCard.vue` — Agregar import y bloque `v-else-if` para el nuevo tipo

Patrones a seguir:
- El composable retorna spread de `...base` más estado y métodos específicos
- El componente recibe prop `timer` (Object) y emite `update`
- Usar CSS variables del tema (`var(--color-*)`, `var(--spacing-*)`)
- Usar `<style scoped>` con clases BEM-like
- Comentarios en español
- Integrar `useAudio()` si el timer necesita sonidos
