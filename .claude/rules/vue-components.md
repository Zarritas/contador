# Reglas para componentes Vue

## Estructura de un componente
- Siempre usar `<script setup>` (Composition API), nunca Options API
- Orden de secciones: `<script setup>` → `<template>` → `<style scoped>`
- Props con `defineProps()` incluyendo tipo y validadores
- Emits explícitos con `defineEmits()`

## Nomenclatura
- Componentes base: `Base{Nombre}.vue` en `src/components/base/`
- Componentes de timer: `{Tipo}Display.vue` en `src/components/timers/`
- Componentes de layout: `App{Nombre}.vue` o descriptivo en `src/components/layout/`
- Modales: `{Nombre}Modal.vue` en `src/components/modals/`

## CSS
- Siempre `<style scoped>`
- Usar CSS variables del tema: `var(--color-*)`, `var(--spacing-*)`, `var(--radius-*)`, `var(--font-size-*)`
- Clases CSS con prefijo del componente (BEM-like): `.timer-card__header`, `.base-btn--primary`
- Responsive con breakpoints: 768px (tablet) y 480px (móvil)
- NO usar colores hardcodeados, usar siempre las variables

## Idioma
- Comentarios en español
- Labels de UI en español
- Nombres de variables y funciones en inglés
