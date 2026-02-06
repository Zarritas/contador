Prepara y ejecuta el despliegue a GitHub Pages.

Pasos:
1. Ejecuta `npm run build` para generar el build de producción
2. Verifica que la carpeta `dist/` se generó correctamente
3. Pregunta al usuario si desea continuar con el deploy
4. Si confirma, ejecuta `npm run deploy` (gh-pages -d dist)
5. Muestra el resultado del despliegue

IMPORTANTE: No ejecutes el deploy sin confirmación explícita del usuario.
