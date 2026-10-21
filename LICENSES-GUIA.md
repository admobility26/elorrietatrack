# Licencias de ElorrietaTrack 1.1

## Crear y entregar una clave
1. Entra en la web de ElorrietaTrack con tu cuenta administradora.
2. Abre **Administración** y baja a **Licencias de escritorio**.
3. Indica el centro/persona y la fecha final; pulsa **Crear licencia**.
4. Copia la clave en ese momento. El servidor solo guarda su hash; no se puede consultar después.
5. Entrega una clave por ordenador. En el EXE o DMG, introducirla y pulsar **Activar este equipo**, con Internet.

Una clave activa exactamente un equipo, una sola vez. Ni renovarla ni desbloquearla la dejan libre para otra instalación. La fecha se interpreta al final del día elegido, en la zona horaria del administrador. La pantalla muestra si está sin usar, usada o bloqueada.

## Renovar
En la misma lista, elige una nueva fecha futura en la licencia correspondiente y pulsa **Renovar**. El ordenador recibe el nuevo plazo al abrir la app con Internet o en la comprobación automática (cada diez minutos). Si ya está bloqueado por caducidad, pulsa **Comprobar renovación**. No se introduce de nuevo la clave.

**Desbloquear** recupera una licencia bloqueada manualmente, pero no amplía su fecha. **Renovar** amplía la fecha, pero no elimina un bloqueo manual.

## Sustitución o pérdida de un ordenador
Bloquea la licencia anterior y crea una nueva para el equipo sustituto. No hay botón de reiniciar o liberar claves consumidas. Si se borra el perfil de la app o se reinstala el sistema perdiendo sus credenciales, también se necesita una nueva clave. Una instalación normal que conserva sus datos no requiere reactivación.

## Conexión y datos
La primera activación necesita Internet. Después permite hasta 30 días desde la última comprobación correcta, siempre dentro de la fecha de vigencia. Al bloquear una licencia, un equipo conectado lo detectará en la siguiente comprobación; uno desconectado puede seguir hasta el límite del permiso firmado que ya recibió. Los proyectos y vídeos no se borran al caducar.

Las claves son aleatorias y solo se guardan con hash en Cloudflare D1. El permiso local lleva firma Ed25519; la clave privada que autoriza las licencias está en el secreto `LICENSE_PRIVATE_JWK` del Worker, nunca en el EXE, DMG o GitHub. El equipo genera su propio par de claves y protege la privada con el almacén seguro de Windows/macOS. El permiso se vincula al identificador de ese equipo. No se envían proyectos, vídeos ni datos de alumnos.

El administrador web y las licencias de escritorio son independientes. El instalable no pide el correo ni la contraseña de administración. Los instaladores antiguos sin este sistema no quedan bloqueados retroactivamente.

## Mantenimiento técnico
- Tablas adicionales: aplicar `server/licenses.sql` en la base AUTH.
- Conservar el secreto de firma existente: **no generar otro par de claves al compilar**. La clave pública compatible está en `electron/license-public.json`.
- Copia privada de recuperación en este Mac: `~/.config/ElorrietaTrack/license-signing-private.json`, con acceso solo para su propietario. Guardar una copia segura aparte. No subirla a GitHub ni compartirla con los instaladores.
- La comprobación offline mitiga retrasos del reloj, pero no ofrece protección absoluta frente a la manipulación del equipo o una versión modificada del programa.
- Prueba de protocolo, SQLite real, concurrencia, firmas, caducidad y caché: `node tests/licensing.mjs` (Node 24).
- Mac: DMG Apple Silicon, sin firma Developer ID/notarización. Windows: EXE x64 sin firma comercial; pendiente de probar en un Windows físico.
