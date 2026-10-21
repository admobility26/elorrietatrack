# ElorrietaTrack 1.3 — Premium y dominio futuro

## Crear y renovar licencias
En la web entra como administrador y abre Administración → Licencias.
Selecciona Básico o Premium, escribe el destinatario y fecha final, y crea la clave.
Las claves nuevas Premium empiezan por PRE-; las básicas por EEM-.
La clave solo se muestra al crearla y activa un único equipo.

Para mejorar un equipo activado cambia el plan de su licencia en la lista. No crees otra activación. En ese equipo pulsa Comprobar renovación o reinicia con Internet. La comprobación automática se realiza cada diez minutos. La clave conserva su prefijo original; manda el plan firmado del servidor. La renovación de fecha y el bloqueo siguen en la misma lista. Sin Internet el permiso firmado puede seguir vigente hasta treinta días, limitado por la caducidad.

En Administración → Usuarios selecciona Básico o Premium para las cuentas web. El administrador dispone de acceso a las funciones para gestionarlas/probarlas; no obtiene acceso a los proyectos locales de otras cuentas. El usuario debe volver a entrar después de cambiar su plan.

## Usar Premium
En el mapa básico están los botones GPX + vídeo, Alumnos y RaceBox.
Con plan básico muestran el aviso de actualización. Con Premium abren el espacio completo, con botón «Básica» para regresar.
Las bibliotecas básica y Premium están separadas para conservar el funcionamiento y datos anteriores. Usa Copias de seguridad en cada espacio para exportar sus datos. No hay conversión automática ni duplicación de proyectos existentes. Los archivos de vídeo no se incluyen en los JSON: conserva sus carpetas.

En escritorio se conserva Documentos/ElorrietaTrack, la biblioteca JSON y el perfil existente; se añade Archivos GPX. En Chrome se elige una carpeta en cada espacio. La carpeta de medios se selecciona mediante Abrir carpeta y los originales se leen directamente. El cambio de nombre o ubicación requiere volver a seleccionarla.

Solo se ofrecen mapas gratuitos: geoEuskadi, PNOA y OpenStreetMap. Mantén los créditos y condiciones del proveedor. La disponibilidad de servidores públicos no está garantizada.

## Dominio: no comprar ni migrar todavía
La dirección workers.dev sigue siendo la dirección activa. No se ha comprado un dominio ni modificado DNS.
Cuando el cliente compre el dominio, debe incorporarlo como zona DNS a la misma cuenta de Cloudflare (o delegar su gestión). Con la cuenta Cloudflare conectada se puede preparar el cambio indicando únicamente el nombre:

    npm run domain -- app.ejemplo.com

Esto solo muestra una vista previa. Para conectar el dominio y publicar:

    npm run domain -- app.ejemplo.com --apply

El programa configura la ruta de dominio personalizado, la dirección pública para licencias y conserva workers.dev y los dominios anteriores. No cambia D1 ni el secreto de firma. Requiere permisos sobre el dominio y emisión correcta del certificado. No contrata el dominio ni salta comprobaciones de propiedad.

Los instaladores anteriores continúan usando workers.dev. Esta versión aprende la nueva dirección desde un permiso firmado, con retorno a workers.dev si la nueva dirección no responde. No cierres la dirección antigua mientras existan instalaciones que dependan de ella.

### Comprobación al cambiar de dirección
1. Exportar copias desde cada biblioteca web en la dirección antigua y conservar los medios.
2. Conectar el dominio y verificar HTTPS, acceso administrativo y una cuenta de prueba.
3. Iniciar sesión en el nuevo dominio e importar las copias de cada usuario. Los datos del navegador pertenecen a cada dirección; no se trasladan automáticamente por DNS. Volver a autorizar carpetas y Bluetooth.
4. Comprobar una licencia activada y su renovación. Usuarios, contraseñas y licencias siguen en la misma D1; las sesiones del navegador requieren inicio nuevo.
5. Mantener la dirección anterior como respaldo.

Un dominio nuevo conectado a este Worker no crea automáticamente una empresa aislada. Para clientes independientes hay que desplegar otra configuración con su base y marca, o añadir una arquitectura multiempresa antes de compartir un único servidor.

## Validación 1.3
Pruebas de edición básica, biblioteca/copias, pizarra y trayectorias; grabación real MP4 con audio y pausa; GPX Premium, recorte y alta mediante ficha; composición MP4 mapa + PIP con marca de agua; permisos Basic/Premium en API y escritorio, lectura GPX y vídeo por rangos. Se verifican firmas, caducidad, uso único, renovación y cambio de plan.
El emparejamiento físico con RaceBox y la ejecución del instalador en un PC Windows necesitan comprobación en esos equipos; no se simulan como conexiones reales.
