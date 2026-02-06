# Reglas de arquitectura

## Dependencias
- Mantener mínimas las dependencias externas (solo Vue + Vite)
- Preferir Web APIs nativas: Web Audio API, localStorage, Fullscreen API, Notifications
- NO agregar librerías de estado (Pinia, Vuex) — usar el patrón singleton con composables
- NO agregar Vue Router — es una SPA de página única

## Constantes
- Toda configuración por defecto va en `src/constants/appConstants.js`
- Agregar nuevos tipos de timer en `TIMER_TYPES` y sus defaults en `TIMER_DEFAULTS`
- Nuevas claves de localStorage en `STORAGE_KEYS`
- Límites de inputs en `LIMITS`

## Agregar un nuevo tipo de timer (checklist)
1. Agregar tipo en `TIMER_TYPES` y defaults en `TIMER_DEFAULTS` (`appConstants.js`)
2. Crear composable `src/composables/timers/use{Tipo}.js`
3. Crear componente `src/components/timers/{Tipo}Display.vue`
4. Agregar case en `createTimer()` de `useTimerStore.js`
5. Agregar import + `v-else-if` en `TimerCard.vue`

## Temas
- Light/dark via atributo `data-theme` en `<html>`
- Variables CSS definidas en `App.vue` (`:root` y `[data-theme="dark"]`)
- Los componentes NUNCA definen colores propios, siempre variables
