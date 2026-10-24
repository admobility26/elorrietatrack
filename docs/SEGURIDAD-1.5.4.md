# Seguridad — RutasElorrieta 1.5.4

Primer bloque de correcciones de la auditoría del 24/10/2026. Solo corresponde a `admobility26/elorrietatrack`.

## Aplicado

- Electron 44.9.1 y dependencias de construcción corregidas. La revisión npm completa queda sin avisos conocidos en la fecha de verificación; esto no es una garantía de seguridad futura.
- Se muestran como texto los campos que permitían inyectar HTML. Los importadores de alumnos comparten validación, incluidas las ausencias.
- El puente de escritorio comprueba ventana, frame principal, origen, licencia y plan. Las exportaciones pertenecen a su ventana. Se conserva una vía limitada de guardado de recuperación para una sesión que ya estaba autorizada cuando caducó la licencia.
- El arranque de desarrollo está desactivado en paquetes de producción. Se comprueban las bibliotecas antes de escribirlas.
- Audio restringido a la ventana principal autorizada; se rechazan cámara, frames y orígenes ajenos.
- Política CSP en la web y el protocolo local. Scripts propios y scripts inline concretos mediante hashes; destinos de red limitados a los servicios utilizados. La política se regenera durante la compilación.
- Se valida la clave pública del equipo antes de consumir una licencia. Una solicitud malformada no inutiliza la clave del cliente.
- Lectura de JSON limitada por bytes, incluso sin Content-Length; respuestas 400/413. Límite de comprobaciones de licencia por IP y limpieza horaria de sesiones, límites y nonces caducados.
- Fuses de integridad ASAR y carga exclusiva de ASAR activados; desactivadas opciones de Node del entorno, inspección del proceso principal, ejecución como Node y privilegios extra del protocolo file.

## Datos privados de la web

Los datos permanecen en el equipo. Cada cuenta crea una clave de datos independiente de su contraseña de acceso. PBKDF2-SHA-256 con 600.000 iteraciones y sal aleatoria deriva una clave para proteger la clave aleatoria AES-GCM de la biblioteca. Las claves operativas solo permanecen en memoria mientras se utiliza la biblioteca. No se envían claves de datos ni contenido privado al servidor.

Se cifran proyectos, alumnos, metadatos y vídeos que se hubieran guardado dentro de IndexedDB; los vídeos se procesan en bloques. Los vídeos y GPX originales de carpetas y los MP4 exportados no se convierten en archivos cifrados. Los permisos de lectura de carpetas no se guardan sin cifrar: hay que volver a elegirlas en una nueva sesión.

La migración cifra, verifica y después retira los datos antiguos de esa cuenta en el navegador. Bloquea el acceso simultáneo de la versión nueva mediante Web Locks y evita que una conexión antigua abierta provoque un borrado pendiente sin verificar. Si falla la migración o la clave es incorrecta no se crea una biblioteca vacía sobre los datos existentes.

**Cada usuario debe completar su propia migración.** Las otras cuentas antiguas no se cifran utilizando la clave del administrador. Las bibliotecas antiguas sin propietario requieren recuperación explícita desde la cuenta administradora. Las copias exportadas previamente no se cifran retrospectivamente. No compartir un perfil de navegador con datos antiguos sin migrar.

La clave de datos se puede cambiar desde la cuenta. Cambiar o restablecer la contraseña web no descifra los datos. No existe una clave maestra de recuperación. Las copias privadas usan la clave de datos; «Compartir con otra clave» cifra una copia independiente. La app de escritorio puede importar una copia web cifrada, solicitando su clave.

El cifrado protege datos cerrados frente a otras cuentas; no protege una sesión ya desbloqueada frente a código malicioso ejecutándose dentro de ella ni frente a un sistema operativo comprometido. Tampoco autentica al editor que distribuye futuras versiones.

## Pendiente o limitado

- Firma comercial Authenticode y notarización Apple: requieren certificados y credenciales del editor. El paquete Mac tiene firma ad hoc de integridad, que no acredita un editor ante Apple. Windows sigue sin firma comercial.
- El bloqueo temporal por intentos dirigidos contra un correo necesita un mecanismo adicional de desafío o segundo factor; las nuevas medidas de abuso no se presentan como solución completa de ese hallazgo.
- La biblioteca nativa, originales, MP4 y copias antiguas siguen siendo archivos normales. La migración por cuenta descrita corresponde a la web; no introduce cuentas nuevas en el instalable.
- No se ha ejecutado el EXE en un Windows físico. Las pruebas nativas se realizaron en Mac con perfiles temporales. El cifrado de vídeo se verificó con varios bloques de un archivo sintético; no se utilizó un vídeo privado de 50 minutos.

## Verificación

Pruebas: inyección, validación, emisor/frame/licencia y permisos, firmas y activaciones, caducidad web, migración de datos, Chrome y WebKit para el cifrado, cambio de clave, importación/exportación cifrada, recuperación tras contraseña errónea, migración bloqueada por otra conexión y reintento, biblioteca y creación de alumno en la web compilada con CSP, y grabación/exportación MP4 de escritorio.

Los instaladores conservan identidad, directorio de datos y clave pública de licencias. Las instalaciones ya entregadas deben actualizarse para recibir el nuevo motor Electron. No se cambia la clave privada del servidor ni se regeneran licencias existentes.
