# Reglas para composables

## Convenciones
- Nombre del archivo: `use{Nombre}.js` (camelCase con prefijo `use`)
- Función exportada: `export function use{Nombre}() { ... }`
- Ubicación: `src/composables/` (general) o `src/composables/timers/` (específicos de timer)

## Composables de timer
- Deben extender `useBaseTimer()` cuando necesiten funcionalidad de cronómetro
- Patrón: crear instancia base, agregar estado/métodos propios, retornar `{ ...base, ...propio }`
- Usar `onUnmounted()` para limpiar intervalos y event listeners
- Las funciones `ref()` que son estado interno NO se exponen; solo las que el componente necesita

## Estado global (stores)
- `useTimerStore()` y `useStorage()` son singletons (estado definido fuera de la función)
- La persistencia en localStorage es automática — llamar `saveTimers()` después de mutaciones
- Usar las claves de `STORAGE_KEYS` en `appConstants.js`, nunca strings sueltos

## Web Audio
- Usar `useAudio()` para sonidos — nunca archivos de audio
- Siempre verificar `soundEnabled` y `volume` del settings antes de reproducir
