# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comportamiento obligatorio

- **No asumir nada.** Ante cualquier desarrollo nuevo o cambio, si hay casos de uso, decisiones de diseño, comportamientos edge-case o criterios de aceptación que no estén explícitamente cubiertos en la solicitud, DEBES preguntar al usuario antes de implementar. Nunca tomes decisiones de diseño, UX o lógica de negocio por tu cuenta.
- **Resumen al finalizar.** Al terminar cada desarrollo, presenta siempre un resumen con:
  1. Qué cambios se realizaron (archivos creados/modificados)
  2. Por qué se hicieron de esa forma
  3. Sugerencias de mejora si consideras que algo podría optimizarse o extenderse

## Project Overview

Athletics timer web app ("Contador de Atletismo") built with Vue 3 Composition API and Vite. Fully client-side SPA with no backend, no routing, and minimal dependencies. UI language is Spanish.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview production build locally
- `npm run deploy` — Build and deploy to GitHub Pages via gh-pages

No test runner or linter is configured.

## Architecture

### State Management

Uses a custom singleton pattern with Vue 3 composables instead of Pinia/Vuex:

- **`stores/useTimerStore.js`** — Global reactive `timers` array, auto-persisted to localStorage (`athletics-timers` key). Methods: `addTimer`, `removeTimer`, `updateTimer`, `clearAllTimers`.
- **`composables/useStorage.js`** — Global reactive `settings` object, persisted to localStorage (`athletics-settings` key). Holds theme, volume, soundEnabled, defaultDuration, roundStep.

### Timer System

Four timer types defined in `constants/appConstants.js`:

1. **Stopwatch** — Elapsed time + lap recording
2. **Countdown** — Configurable duration (1-120 min) with completion alert
3. **Round Counter** — Increment/decrement with configurable step and optional target
4. **Interval (HIIT)** — Alternating work/rest phases with round tracking

Each type has a paired composable (`composables/timers/`) and display component (`components/timers/`). Timer composables extend `useBaseTimer.js` for shared start/pause/reset logic.

### Component Organization

- **`components/base/`** — Reusable primitives (BaseButton, BaseInput, BaseModal, BaseToggle)
- **`components/layout/`** — AppHeader, AppFooter, EmptyState
- **`components/modals/`** — AddTimerModal, SettingsModal
- **`components/timers/`** — TimerCard (wrapper) + type-specific display components

`App.vue` is the sole page: renders a grid of TimerCards with header/footer and conditionally shows modals.

### Audio

`composables/useAudio.js` uses the Web Audio API oscillator to synthesize beep tones (no audio files). Lazy-initializes AudioContext on first user interaction. Respects volume/soundEnabled settings.

### Theming

Light/dark theme via `data-theme` attribute on the root element. CSS custom properties define the color scheme. Primary color: `#f97316` (orange). Theme choice persists in settings.

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) auto-deploys to GitHub Pages on push to `main`. Uses Node 20.
