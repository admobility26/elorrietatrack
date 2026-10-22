# Licencias ADMIN

En Administración → Licencias, seleccionar ADMIN. No se pide fecha. Sólo un administrador web autenticado puede crear estas claves.

- Prefijo ADMIN- obligatorio, seguido de 32 caracteres aleatorios.
- Todas las funciones de la aplicación (plan Premium).
- Sin caducidad de licencia ni límite de equipos. Cada activación obtiene un permiso firmado y una identidad independiente; se puede reutilizar la clave.
- Bloquear la licencia bloquea nuevas activaciones y la siguiente comprobación de todos sus equipos. Sin conexión, un permiso válido puede seguir funcionando hasta 30 días. Sin caducidad no significa funcionamiento sin Internet para siempre.
- Se puede desbloquear conservando las activaciones. El contador muestra equipos distintos que se han activado, no equipos conectados en este instante.
- No concede una cuenta de administrador web, ni acceso a datos ajenos. La administración sigue requiriendo el correo y contraseña del administrador.
- Las licencias Básica y Premium mantienen un único uso/equipo y fecha de caducidad.
- La clave ADMIN es compartible por diseño: conservarla en privado. Cualquier persona que tenga la clave podría activar otro equipo.

Compatibilidad: DMG/EXE Estable 1.3.2 ya verifican estos permisos Premium sin cambios; el mensaje de activación de esos instaladores todavía describe la política normal de un equipo. La web y el código para futuros instaladores muestran la explicación actualizada. No se han sustituido los instaladores por este cambio.

Servidor: aplicar server/admin-licenses.sql UNA vez sobre la base existente antes de publicar. Las instalaciones vacías nuevas usan server/nueva-instalacion.sql, que ya lo incluye. No ejecutar ambos sobre la misma base. La migración no cambia licencias anteriores ni la firma de licencias.
