# ElorrietaTrack — preparación de instalación independiente

Esta copia conserva el código completo Basic y Premium. Empieza sin usuarios, licencias ni datos de producción. No está publicada. El repositorio original no se modifica.

## Siguiente paso del propietario

1. Crear la nueva cuenta en https://github.com/signup y verificar el correo.
2. Crear un repositorio **privado y vacío**, sin README, licencia ni gitignore automáticos. Elegir su nombre.
3. Crear la cuenta nueva en https://dash.cloudflare.com/sign-up y verificar el correo.
4. Comunicar únicamente el usuario de GitHub y el nombre del repositorio. No compartir contraseñas, códigos de verificación ni claves privadas.

## Configuración pendiente antes de publicar

- Conectar esta copia al nuevo repositorio (ahora no tiene remoto).
- Configurar explícitamente el identificador de la nueva cuenta Cloudflare y crear su Worker y base D1 vacía.
- Aplicar, una sola vez y por orden: server/schema.sql, server/licenses.sql, server/premium.sql y server/license-register.sql.
- Crear un administrador nuevo con scripts/create-admin.mjs; no reutilizar cuentas ni contraseñas antiguas. Borrar el SQL temporal después de importarlo.
- Generar una pareja de firma nueva. Guardar LICENSE_PRIVATE_JWK exclusivamente como secreto de la nueva cuenta; actualizar electron/license-public.json con la nueva clave pública. La clave pública incluida actualmente es una referencia del código original y debe sustituirse antes de generar instaladores.
- Sustituir https://pendiente.invalid por el nuevo servicio de licencias y establecer PUBLIC_ORIGIN.
- Elegir identidad de escritorio y carpeta de datos independientes antes de generar DMG/EXE: el código copiado todavía usa ElorrietaTrack en Documentos. No ejecutar esta copia de escritorio hasta cambiarlo si se quiere mantener ambas instalaciones separadas.
- Verificar inicio de sesión, Basic/Premium, alta y renovación de licencias y permisos. Sólo después retirar el bloqueo scripts/check-new-installation.mjs y sus llamadas.

El bloqueo es deliberado: npm run build permite compilar la web, pero despliegue, cambio de dominio y empaquetado no deben ejecutarse hasta completar la configuración. No se han copiado bases de datos, sesiones, archivos locales de alumnos, vídeos ni secretos. El historial Git del código se conserva. Los vídeos y bibliotecas locales existentes no se trasladan automáticamente al nuevo dominio.
