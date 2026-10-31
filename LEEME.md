# Control de zócalos para OBS (GitHub Pages)

Todo es estático: no hay Python ni servidor.

## Publicar
1. Subí esta carpeta a un repositorio de GitHub.
2. Settings → Pages → *Deploy from a branch* → `main` / `/ (root)`.
3. Quedan en `https://USUARIO.github.io/REPO/` (panel) y `.../overlay.html` (overlay).

## OBS
- Fuente **Navegador**: URL del overlay, 1920×1080, por encima de la cámara.
- **Opción A** (sin internet entre panel y overlay): cargá el panel como *Dock de navegador personalizado* (Docks → Docks de navegador personalizados). Comparte perfil con la fuente de navegador y se sincroniza solo.
- **Opción B** (otro dispositivo): en el panel, abrí "Conexión con OBS", *Generar* código de sala y usá la URL del overlay que muestra (`overlay.html?room=CODIGO`). Usa el relé gratuito ntfy.sh.
- Si abrís panel y overlay en dos navegadores distintos sin sala, NO se sincronizan.

## Rótulo
Campo libre con sugerencias; podés guardar/quitar rótulos propios (se guardan en el navegador). Vacío = se oculta el rótulo.
