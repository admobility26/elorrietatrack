# ElorrietaTrack

Edición educativa independiente de RutasAD, creada por **Aitor Delgado Martínez · AD Mobility**.

## Funciones

- Trayectorias: capas, nombres/colores, edición individual de puntos, reordenación, arrastre, recolocación y eliminación, cámara, reproducción y catálogo completo de señales y puntos conflictivos.
- Pizarra: copia de trazadas y señales, dibujo, flechas, vehículos animados, semáforos, preguntas/respuestas, pasos independientes, presentación, puntero, deshacer, guardado y biblioteca de explicaciones.
- Grabación MP4 con marca de agua del logo del cliente y micrófono; pausa de imagen manteniendo el audio y reanudación. PNG/PDF y guardado como proyecto de trayectoria.
- Biblioteca con carátulas, búsqueda, ordenación, apertura y eliminación: **Trayectorias** y **Pizarras**.
- Mapas gratuitos: **geoEuskadi**, **PNOA - IGN** y **OpenStreetMap**. Descarga de zonas solo con los dos primeros; OSM usa caché HTTP normal sin precarga masiva.
- Autoguardado y recuperación; copias JSON con vista previa y conservar/actualizar; carpeta de datos en Chrome.
- Euskera predeterminado y castellano seleccionable.

El plan Premium añade alumnos, fichas/clases, GPX con vídeo PIP y montaje MP4, recorte a pizarra y RaceBox Mini/Mini S. El plan básico conserva las funciones anteriores y muestra aviso de actualización. No incluye Google Maps ni Mapbox. [Planes, licencias y dominio futuro](docs/PREMIUM-Y-DOMINIO.md).

## Independencia

Repositorio, aplicación, protocolo nativo, cookies, almacenamiento del navegador y carpetas son propios. No migra ni modifica datos de RutasAD. Las copias JSON son específicas de esta edición; los vídeos se guardan por separado.

Escritorio: `Documentos/ElorrietaTrack/`, con `Biblioteca de recorridos.json`, `Vídeos MP4`, `Archivos GPX`, `Exportaciones`, `App/Copias de seguridad` y perfil interno `.datos-de-la-aplicacion`.

## Desarrollo e instalación

Requiere Node.js compatible con Vite 6 y Electron 44.

```sh
npm ci
npm run dev -- --port 5176
npm run build
npm run package:win
```

Windows: `release/ElorrietaTrack-1.3.0-Windows-x64-Setup.exe`. El EXE no está firmado; hay que probarlo en los equipos del centro antes de entregarlo. No se promete compatibilidad con cualquier versión antigua de Windows.

Vite es para pruebas locales sin identificación. La web de producción conserva administración propia y requiere una base D1 nueva y su administrador antes de publicarse: [configuración](server/README.md). No contiene contraseñas reales ni identificadores de la base de RutasAD.

## Licencias de escritorio

Windows y Mac requieren una clave de un solo uso vinculada al equipo, con caducidad y hasta 30 días sin conexión. Crear, renovar y bloquear desde la Administración web: [guía de licencias](LICENSES-GUIA.md). El DMG Apple Silicon se genera con `npm run package:mac`.

## Pruebas

Con Vite en 5174:

```sh
npm test
npm run test:recording
npm run test:desktop
node tests/board-expanded.mjs
node tests/didactic-board.mjs
node tests/autosave-browser.mjs
node tests/trajectory-camera.mjs
```

Los mapas de las pruebas son imágenes sintéticas locales; no se sobrecargan servidores públicos. Se crean MP4 reales y se comprueba el audio durante la pausa. El escritorio de prueba usa una carpeta temporal de Documentos.

## Autoría

© 2026 Aitor Delgado Martínez · AD Mobility. Derivada de RutasAD por el mismo autor. Se conservan [LICENSE](LICENSE) y las licencias de terceros. El titular puede conceder separadamente la licencia de uso acordada con el centro. El logo del centro se incorpora a partir del archivo facilitado por el usuario, conservando la imagen recibida. Los derechos de esa marca corresponden a su titular, separados de la autoría del código.

## Ayuda, créditos y uso comercial

Manual integrado Euskara/Castellano, disponible sin conexión e imprimible como PDF. Contacto: admobility26@gmail.com. El logo regresa al inicio tras guardar/finalizar el trabajo.

La revisión de licencias, inventario y límites se documenta en [legal/REVISION-COMERCIAL.md](legal/REVISION-COMERCIAL.md). El uso comercial del logo EEM requiere autorización de su titular; los avisos de autoría no la sustituyen. Las dependencias y los mapas mantienen sus propias licencias; la autorización de uso profesional de la app no concede derechos sobre ellos.

## Actualización 1.3
Antes de publicar sobre una base existente, aplicar una sola vez `server/premium.sql`. Conserva usuarios y licencias como básicos; el administrador puede cambiar su plan. No regenerar las claves de firma. Bibliotecas básica y Premium separadas y copias propias. Para pruebas de navegador inicia Vite en 5176 (o define TEST_URL). Pruebas: `npm test`, `npm run test:recording`, `npm run test:licensing`, `npm run test:premium`. Se añade la guía de conexión de dominio sin contratarlo todavía; conserva workers.dev.
