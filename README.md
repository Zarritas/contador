# Contador de Atletismo

Herramienta de entrenamiento para atletas con multiples tipos de temporizadores. Aplicacion web progresiva (PWA) construida con Vue 3 y Vite, sin dependencias externas innecesarias.

**[cronometro.jesuslorenzo.es](https://cronometro.jesuslorenzo.es)**

## Tipos de timer

- **Cronometro** — Tiempo transcurrido con registro de vueltas (splits y totales)
- **Temporizador** — Cuenta regresiva configurable de 1 a 120 minutos
- **Contador de Rondas** — Conteo de repeticiones con incremento configurable y objetivo opcional con barra de progreso
- **Intervalos HIIT** — Fases de trabajo/descanso alternadas con countdown visual (3-2-1), sonidos de aviso y vibracion en movil

## Funcionalidades

- Multiples timers simultaneos con controles individuales
- Nombres editables (doble clic para renombrar)
- Tema claro/oscuro
- Modo pantalla completa
- Sonidos generados con Web Audio API (sin archivos de audio)
- Vibracion haptica en dispositivos moviles
- Persistencia automatica en localStorage
- PWA instalable con soporte offline via Service Worker
- Responsive: desktop, tablet y movil

## Ajustes

- Activar/desactivar sonidos
- Control de volumen
- Duracion por defecto del temporizador
- Incremento por defecto del contador de rondas
- Tema claro/oscuro
- Limpiar todos los datos

## Tech stack

- **Vue 3** (Composition API + `<script setup>`)
- **Vite 5**
- **Web APIs nativas**: Web Audio, Fullscreen, Vibration, Service Worker, localStorage
- Sin librerias de estado, router ni componentes UI externos

## Estructura del proyecto

```
src/
  components/
    base/           # Componentes reutilizables (BaseButton, BaseInput, BaseModal, BaseToggle)
    layout/         # Header, Footer, EmptyState
    modals/         # AddTimerModal, SettingsModal
    timers/         # TimerCard, StopwatchDisplay, CountdownDisplay,
                    # RoundCounterDisplay, IntervalDisplay
  composables/
    timers/         # useBaseTimer, useStopwatch, useCountdown,
                    # useRoundCounter, useIntervalTimer
    useAudio.js     # Generacion de sonidos con Web Audio API
    useFullscreen.js
    useStorage.js   # Persistencia de ajustes
  stores/
    useTimerStore.js  # Estado global de timers (patron singleton)
  constants/
    appConstants.js   # Configuracion centralizada
  utils/
    idGenerators.js
    timeFormatters.js
```

## Desarrollo

```bash
npm install      # Instalar dependencias
npm run dev      # Servidor de desarrollo (localhost:5173)
npm run build    # Build de produccion
npm run preview  # Preview del build local
```

## Despliegue

El push a `main` dispara el deploy automatico a GitHub Pages via GitHub Actions.

```bash
npm run build    # Verificar que compila antes de push
```

## Licencia

MIT
