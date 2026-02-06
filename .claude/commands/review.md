Revisa la calidad del código del archivo o componente: $ARGUMENTS

Analiza los siguientes aspectos:

1. **Consistencia**: ¿Sigue los patrones del proyecto? (Composition API, CSS variables, BEM, español en comentarios)
2. **Reactividad**: ¿Usa correctamente `ref`, `computed`, `watch`? ¿Hay fugas de memoria (intervalos, event listeners sin cleanup)?
3. **Props y Emits**: ¿Están bien definidos con tipos y validadores?
4. **CSS**: ¿Usa variables del tema? ¿Los estilos son scoped? ¿Es responsive?
5. **Rendimiento**: ¿Hay cálculos innecesarios en el render? ¿Se podrían usar `computed` en vez de métodos?
6. **Accesibilidad**: ¿Tiene atributos ARIA, títulos, alt text donde corresponda?

Presenta los hallazgos organizados por severidad (crítico, mejora, sugerencia).
