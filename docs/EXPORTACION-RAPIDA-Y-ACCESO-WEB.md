# 1.5.0 — exportación rápida y caducidad web

## Exportación

Rápida · mapa fijo: decodifica fotogramas, compone mapa/PIP/marcadores/HUD/marca de agua y codifica MP4 H.264/AAC por marcas de tiempo usando WebCodecs y Mediabunny 1.62.1, sin temporizar la reproducción de entrada. Funciona en Chrome y Electron compatibles, con codificación nativa/hardware cuando está disponible. No añade FFmpeg ni sube medios a Cloudflare. Se incluye MPL-2.0, autoría y enlace a la fuente original de Mediabunny en los avisos.

El mapa se encuadra al recorrido completo, se espera a que termine de cargar y se captura una vez sin el marcador móvil. La posición del vehículo, HUD, incidencias y PIP se componen por fotograma sobre esa vista fija. Se conservan tiempos normales del montaje y audio original. No se mezcla un micrófono en directo en este modo.

Tiempo real · narración conserva la cámara y la grabación anteriores, incluido micrófono y pausa de imagen con audio continuo. El micrófono selecciona automáticamente Tiempo real. Si falta compatibilidad de codificación se preselecciona Tiempo real. Si un códec concreto de entrada no es decodificable en modo rápido, se informa para usar Tiempo real; no se genera un vídeo sin su audio.

El modo rápido utiliza salida MP4 fragmentada, escritura secuencial con contrapresión y liberación de entradas y muestras para no guardar toda la clase en memoria. Sin guardado directo a disco sólo admite montajes de hasta cinco minutos, como el modo anterior. Cancelar aborta el archivo parcial. La rapidez depende del equipo, resolución, archivos, disco y carga de mapas; las pruebas cortas no permiten prometer un tiempo para una clase de 50 minutos.

## Acceso web

Migración aditiva: server/web-expiry.sql, aplicar UNA vez sobre una instalación existente. El esquema combinado para bases vacías ya la incluye. Las cuentas existentes reciben inicialmente acceso sin caducidad y no se eliminan ni se alteran sus contraseñas o planes.

Los nuevos usuarios requieren expiresAt: fecha futura en milisegundos, o 00-00-0000 (sin caducidad). La interfaz acepta DD-MM-AAAA. Renovación desde Administración → Usuarios; invalida las sesiones del usuario y exige nuevo inicio de sesión. El administrador no puede caducar mediante esa interfaz.

El servidor comprueba vencimiento al iniciar sesión, en las API y al servir recursos privados. Las sesiones con fecha finita no sobrepasan esa fecha. El monitor de cuenta existente revisa el acceso cada 15 segundos y al volver a la ventana; hace un checkpoint local antes de bloquear. Esto no es DRM sobre código o archivos que ya se hayan descargado. Los datos locales no se borran al vencer. La caducidad web no cambia licencias de escritorio ni sus firmas.

## Verificación

- Pruebas de MP4 de dos fuentes con audio de prueba, recorte, color, duración, frecuencia de audio, cancelación y exportación sin esperar al reloj de reproducción.
- Pruebas del montaje desde la interfaz y del guardado nativo en disco.
- Pruebas de API real del Worker con SQLite: fecha obligatoria, sesiones limitadas, caducidad en login/API/archivos privados, renovación, cero fecha y protección del administrador.
- Pruebas de interfaz del administrador sin crear usuarios en producción.
- Windows se genera desde Mac y requiere prueba en un equipo Windows real, en particular de sus controladores de vídeo/códecs.
