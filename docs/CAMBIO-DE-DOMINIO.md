# Cambiar a un dominio propio sin sustituir la instalación

Estado: preparado, pendiente de disponer de un dominio y verificarlo en producción. No se ha comprado ni conectado ningún dominio de ejemplo.

## Lo que se conserva

El dominio nuevo se conecta al MISMO Worker elorrietatrack, en la misma cuenta admobility26, y a la MISMA base D1 elorrietatrack-estable-auth. No crear otra base ni volver a ejecutar los esquemas. Usuarios, contraseñas cifradas mediante hash, planes, licencias, fechas y equipos vinculados permanecen en D1. No cambiar LICENSE_PRIVATE_JWK ni electron/license-public.json; conservar la copia privada de firma por separado.

## Datos locales y acceso

Los proyectos web se guardan por dirección y cuenta en cada navegador. Cambiar el dominio no mueve localStorage, IndexedDB, vídeos ni autorizaciones de carpetas. Antes del cambio, cada usuario debe exportar su copia desde Biblioteca/Copias de seguridad y conservar GPX/vídeos originales. Después, iniciar sesión con el mismo correo y contraseña en el dominio nuevo, importar su copia y volver a seleccionar la carpeta de medios. No borrar datos del navegador antiguo hasta comprobar el resultado. Las sesiones no se trasladan: será necesario iniciar sesión de nuevo.

Como el cambio se realizará antes de incorporar clientes, sólo hay que revisar las bibliotecas de prueba del administrador y los archivos locales que interese conservar. El inicio de sesión nuevo no recupera por sí solo esos proyectos.

Los instaladores Estable 1.3.2 conservan su perfil y archivos en Documentos/elorrietatrac. Mantener la misma identidad de aplicación y carpeta en futuras actualizaciones. No hace falta reinstalarlos para conectar el dominio.

## Procedimiento cuando se contrate el dominio

1. Registrar el dominio y activar su zona DNS en ESTA cuenta Cloudflare. Elegir el nombre definitivo, por ejemplo app.nombre-del-centro.es. No requiere contratar otro alojamiento.
2. Exportar las bibliotecas web que se quieran conservar y hacer copia de medios locales. Comprobar que existe la copia privada de firma.
3. Desde el proyecto ejecutar la vista previa: npm run domain -- app.nombre-del-centro.es. No modifica datos ni publica.
4. Tras revisar el dominio, ejecutar npm run domain -- app.nombre-del-centro.es --apply.
5. El proceso exporta D1 y guarda la configuración previa en .tmp/domain-backups, excluido de Git. Esa copia contiene información privada de usuarios; conservarla con acceso restringido. No es una copia de los vídeos ni de las bibliotecas locales.
6. Primero se conecta el dominio al mismo Worker. Se comprueba HTTPS, portada y rechazo del acceso anónimo a /api/me. Sólo entonces se actualiza PUBLIC_ORIGIN para las licencias y se vuelve a publicar. Si el certificado/DNS todavía no está listo puede fallar la comprobación: revisar y reintentar; no borrar ni reinicializar D1.
7. Iniciar sesión y comprobar Administración, crear/renovar una licencia de prueba si procede y probarla en un equipo de prueba. Importar la biblioteca del administrador y comprobar que rutas, trayectorias y medios se abren. Revisar exportación de vídeo si hay recursos locales. Hacerlo antes de entregar accesos a clientes.
8. Confirmar y subir wrangler.jsonc al repositorio nuevo. Es esencial: la publicación automática de GitHub usa ese archivo. Registrar la nueva dirección en LEEME-recursos.md y en la documentación entregada.

## Compatibilidad de los instaladores existentes

Mantener workers_dev=true. Los instaladores 1.3.2 usan workers.dev para su primera activación; el permiso firmado les comunica PUBLIC_ORIGIN para comprobaciones posteriores. También lo conservan como respaldo de conexión. Desactivar workers.dev impediría activar instalaciones nuevas del DMG/EXE actual. Ambos dominios apuntan al mismo sistema de acceso; workers.dev no evita el control de usuarios/licencias.

Un cambio a otro proveedor de alojamiento o a otra cuenta Cloudflare es una migración diferente y requiere un plan adicional; este procedimiento sólo añade un dominio a la cuenta actual.

## Si algo falla

No borrar la base de datos ni rotar la firma. El script restaura el archivo local si falla, pero Cloudflare puede haber recibido un despliegue parcial: comprobar el estado remoto. La dirección workers.dev se mantiene disponible. Se puede volver a publicar la configuración previa guardada, conservando la misma D1 y firma. La restauración de D1 es un último recurso: sobrescribirla podría perder cambios posteriores y debe revisarse antes de hacerlo.

Referencias oficiales:
- https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- https://developers.cloudflare.com/workers/wrangler/configuration/
- https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
