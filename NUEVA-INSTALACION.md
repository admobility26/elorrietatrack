# ElorrietaTrack — instalación independiente

Web: https://elorrietatrack.admobility26.workers.dev
Repositorio: https://github.com/admobility26/elorrietatrack
Cuenta Cloudflare: admobility26@gmail.com
Worker: elorrietatrack
Base D1: elorrietatrack-estable-auth
ID D1: 2c770bdc-780c-4dfe-b3a9-43a82991aac0

## Carpetas

- aplicacion: código, dependencias y compilación. No son datos de clientes.
- Privado (fuera del repositorio): contraseña inicial de administrador y copia de recuperación de firma. No subir a GitHub ni compartir. La pérdida de la firma impediría validar licencias ya emitidas; conservar copia segura.
- Los futuros instaladores de esta copia usan Documentos/elorrietatrac para sus datos. Los instaladores antiguos siguen usando su configuración original y no se han modificado ni generado nuevos.
- El navegador guarda los proyectos localmente por usuario/origen y los medios en la carpeta seleccionada. No se copian las bibliotecas antiguas al dominio nuevo automáticamente.

## Consultar recursos por empresa

En Cloudflare, dentro de esta cuenta:
1. Workers & Pages → elorrietatrack → Metrics: peticiones, errores y tiempo de CPU disponible en el panel.
2. D1 → elorrietatrack-estable-auth → métricas: tamaño de base, lecturas y escrituras.
3. Consultar Usage/Billing de la cuenta para consumo y límites del plan. El consumo total de cuenta incluye todas sus aplicaciones; seleccionar este Worker y esta D1 para distinguir esta empresa.

La carpeta local sólo permite medir disco local, no CPU ni facturación del servidor. Los vídeos/GPX locales no ocupan D1. Los mapas gratuitos se solicitan a sus proveedores; no son almacenamiento de vídeo en Cloudflare. Al añadir otra empresa, usar recursos y carpeta separados con nombres propios. No se ha instalado un monitor automático ni alarmas de consumo.

## Estado

Tablas inicializadas; administrador nuevo admobility26@gmail.com. Contraseña inicial en Privado/Acceso-administrador.txt: cambiarla desde la app tras entrar. Firma nueva y distinta de la instalación anterior. No volver a ejecutar server/nueva-instalacion.sql: es sólo para bases vacías.

Antes de publicar, scripts/check-new-installation.mjs comprueba que se utiliza la cuenta y base correctas. La conexión de GitHub permite publicar cambios de main; usar otra rama/repositorio para experimentar. No subir Privado al repositorio.
