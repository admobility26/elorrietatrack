# ElorrietaTrack

Edición educativa independiente de RutasAD, creada por **Aitor Delgado Martínez · AD Mobility**.

## Funciones

- Trayectorias: capas, nombres/colores, edición individual de puntos, reordenación, arrastre, recolocación y eliminación, cámara, reproducción y catálogo completo de señales y puntos conflictivos.
- Pizarra: copia de trazadas y señales, dibujo, flechas, vehículos animados, semáforos, preguntas/respuestas, pasos independientes, presentación, puntero, deshacer, guardado y biblioteca de explicaciones.
- Grabación MP4 con micrófono; pausa de imagen manteniendo el audio y reanudación. PNG/PDF y guardado como proyecto de trayectoria.
- Biblioteca con carátulas, búsqueda, ordenación, apertura y eliminación: **Trayectorias** y **Pizarras**.
- Mapas gratuitos: **geoEuskadi**, **PNOA - IGN** y **OpenStreetMap**. Descarga de zonas solo con los dos primeros; OSM usa caché HTTP normal sin precarga masiva.
- Autoguardado y recuperación; copias JSON con vista previa y conservar/actualizar; carpeta de datos en Chrome.
- Euskera predeterminado y castellano seleccionable.

No incluye alumnado, fichas/clases, GPX/PIP, RaceBox, Google Maps ni Mapbox. No se empaquetan sus SDK ni credenciales.

## Independencia

Repositorio, aplicación, protocolo nativo, cookies, almacenamiento del navegador y carpetas son propios. No migra ni modifica datos de RutasAD. Las copias JSON son específicas de esta edición; los vídeos se guardan por separado.

Escritorio: `Documentos/ElorrietaTrack/`, con `Biblioteca de recorridos.json`, `Vídeos MP4`, `Exportaciones`, `App/Copias de seguridad` y perfil interno `.datos-de-la-aplicacion`.

## Desarrollo e instalación

Requiere Node.js compatible con Vite 6 y Electron 44.

```sh
npm ci
npm run dev -- --port 5174
npm run build
npm run package:win
```

Windows: `release/ElorrietaTrack-1.0.0-Windows-x64-Setup.exe`. El EXE no está firmado; hay que probarlo en los equipos del centro antes de entregarlo. No se promete compatibilidad con cualquier versión antigua de Windows.

Vite es para pruebas locales sin identificación. La web de producción conserva administración propia y requiere una base D1 nueva y su administrador antes de publicarse: [configuración](server/README.md). No contiene contraseñas reales ni identificadores de la base de RutasAD.

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

© 2026 Aitor Delgado Martínez · AD Mobility. Derivada de RutasAD por el mismo autor. Se conservan [LICENSE](LICENSE) y las licencias de terceros. El titular puede conceder separadamente la licencia de uso acordada con el centro. No se incluye la marca oficial del instituto sin su archivo de imagen.
