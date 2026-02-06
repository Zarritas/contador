# Reglas de Git y despliegue

## Ramas
- `main` es la rama de producción — todo push a main dispara deploy automático a GitHub Pages
- Crear ramas feature para cambios grandes: `feature/{nombre}`

## Commits
- Mensajes en inglés, concisos, en imperativo: "Add interval timer", "Fix countdown reset bug"
- Un commit por cambio lógico, no commits gigantes

## Despliegue
- GitHub Actions (`.github/workflows/deploy.yml`) despliega automáticamente al hacer push a `main`
- Verificar siempre con `npm run build` antes de hacer push
- El base path en `vite.config.js` es `/` — no cambiar sin revisar el workflow de deploy

## Archivos protegidos
- NO commitear: `CLAUDE.md`, `.claude/`, `dist/`, `node_modules/`, `.env`
- Estos ya están en `.gitignore`
