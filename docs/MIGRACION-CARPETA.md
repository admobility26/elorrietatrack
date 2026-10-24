# Carpeta de datos de RutasElorrieta · 1.5.3

La carpeta nueva es Documentos/RutasElorrieta en Mac y Windows. Sustituye a Documentos/elorrietatrac únicamente para datos de usuario. El código local permanece en Documentos/elorrietatrac/aplicacion y los instaladores en Documentos/elorrietatrac/Instaladores.

Al abrir la versión 1.5.3 con las anteriores cerradas se trasladan: .datos-de-la-aplicacion (licencia, preferencias, localStorage e IndexedDB), Biblioteca de recorridos.json, Archivos GPX, Vídeos MP4, App, Exportaciones y Alumnos si existe. Se mantienen los archivos byte a byte y los identificadores internos. Las rutas internas de vídeos usan el mismo protocolo y nombre de archivo. Las carpetas externas elegidas para clases se vuelven a seleccionar como antes; los originales externos no se mueven.

La migración mueve archivos localmente sin duplicar vídeos. Un registro .migracion-RutasElorrieta.json permite continuar si se interrumpe el proceso. Si hay datos en ambas ubicaciones no se mezclan ni se sobrescriben: la app muestra el conflicto y se detiene. Se comprueba que otra versión Estable/RutasElorrieta no esté abierta antes de mover datos. No se mueven el código, Privado ni Instaladores.

No volver a utilizar instaladores anteriores a 1.5.3 después del traslado: intentarían usar la carpeta antigua. No abrir dos versiones a la vez. Se mantiene el identificador de aplicación y el nombre técnico Electron ElorrietaTrack para que las claves cifradas sigan vinculadas al mismo servicio del Llavero. Nombre de ventana e instalador: RutasElorrieta.

En el Mac del desarrollo se verificó el traslado real y se guardaron copias privadas de recuperación de la biblioteca y del archivo cifrado de licencia en el directorio Privado/Migracion-1.5.3 del proyecto. No contiene claves en texto plano ni se publica en GitHub.

Chrome sigue utilizando su almacenamiento por origen y la carpeta elegida por el usuario: este cambio no mueve ni borra datos del navegador. No cambia cuentas, servidor, dominio ni licencias de Cloudflare.
