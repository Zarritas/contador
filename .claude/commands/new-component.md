Crea un nuevo componente base llamado "$ARGUMENTS" en `src/components/base/`.

Sigue las convenciones del proyecto (ver `BaseButton.vue` como referencia):

1. Usa `<script setup>` (Composition API)
2. Define props con `defineProps()` incluyendo validadores donde aplique
3. Define emits con `defineEmits()`
4. Usa `<style scoped>` con CSS variables del tema
5. Nomenclatura BEM para clases CSS: `.base-{name}`, `.base-{name}--variant`
6. Soporte para tema claro/oscuro usando las variables CSS existentes (`--color-*`, `--spacing-*`, `--radius-*`)
7. Debe ser responsive (considerar breakpoints 768px y 480px)
8. Comentarios JSDoc en español describiendo el componente y sus props
