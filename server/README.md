# Web independiente de ElorrietaTrack

El instalable funciona con licencia de escritorio, sin cuenta web de usuario. La web conserva correo/contraseña y administración de usuarios, independientes de RutasAD. Este repositorio no publica una web automáticamente.

1. Autoriza tu cuenta: `npx wrangler login`.
2. Crea una base NUEVA: `npx wrangler d1 create elorrietatrack-auth`.
3. Añade a `wrangler.jsonc` el bloque `d1_databases` de Cloudflare con binding `AUTH`, nombre `elorrietatrack-auth` e identificador nuevo. Nunca reutilices la base de RutasAD.
4. Aplica tablas: `npx wrangler d1 execute elorrietatrack-auth --remote --file server/schema.sql`.
5. Define `ADMIN_EMAIL` y `ADMIN_PASSWORD` (8-128 caracteres) en un entorno local privado y ejecuta `node scripts/create-admin.mjs`. No uses variables VITE ni guardes contraseñas en GitHub.
6. Se genera `.tmp/admin.sql`, privado y con contraseña solo en hash. Importa: `npx wrangler d1 execute elorrietatrack-auth --remote --file .tmp/admin.sql`. Elimina el archivo temporal y las variables al terminar.
7. Publica: `npx wrangler deploy`. El Worker se llama `elorrietatrack`, distinto de `maps`.
8. Entra como administrador, crea usuarios y comprueba bloqueo y aislamiento antes de compartir el enlace.

No hay correo ni contraseña iniciales preconfigurados. Los usuarios de acceso no son un módulo de alumnos.

Se mantienen cookies HttpOnly/Secure/SameSite=Strict, sesiones revocables, hash/sal de contraseñas, control de rol y Origin y límite de intentos. D1 contiene solo cuentas/sesiones. Las bibliotecas siguen siendo locales y no se sincronizan automáticamente; el administrador no puede abrirlas remotamente. La separación local no es cifrado frente a alguien que lea el disco o perfil.

Para pruebas locales usa `--local` con una base y administrador ficticios. Nunca apliques semillas ni borrados de prueba a producción.

## Licencias de escritorio

Aplicar `server/licenses.sql` a AUTH y mantener el secreto `LICENSE_PRIVATE_JWK`, correspondiente a `electron/license-public.json`. No generar un par nuevo al recompilar: invalidaría los instaladores existentes. La producción de ElorrietaTrack ya tiene estas tablas y el secreto configurados. Véase [guía](../LICENSES-GUIA.md).
