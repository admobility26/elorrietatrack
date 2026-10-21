# Revisión documental de la distribución ElorrietaTrack 1.2
Fecha: 21/10/2026. Autor original: Aitor Delgado Martínez · AD Mobility.

## Código y distribución
Se inventariaron las dependencias de ejecución de package-lock.json. Sus licencias declaradas son MIT, ISC, BSD-2-Clause, BSD-3-Clause y MIT OR Apache-2.0. Se conservan los textos originales y sus avisos; `murmurhash-js` guarda su licencia MIT en README y ahora también se recoge. El inventario está en `dependency-inventory.json`. No se extiende a ellas la restricción no comercial propia.

Se comparó byte a byte el bundle PDF con pdf-lib 1.17.1 del registro npm, verificando SHA-512 del tarball. Se recopilaron licencias de pdf-lib, @pdf-lib/standard-fonts 1.0.0, @pdf-lib/upng 1.0.1, pako 1.0.11 y tslib 1.11.1. Los avisos Apache de Microsoft incrustados se mantienen. Las tipografías DM Sans, DM Mono y Manrope se distribuyen sin modificación con sus textos SIL OFL 1.1, desde el repositorio oficial google/fonts. Ya no se solicitan fuentes a Google al abrir la app.

El instalador incorpora Electron y los avisos íntegros de Chromium de los binarios oficiales mediante after-pack. Se conservan además los avisos originales del motor. Créditos accesibles sin conexión desde el inicio. No se ha cambiado el motor de códecs; esta revisión de avisos no certifica ausencia de patentes o condiciones específicas aplicables a cada explotación.

## Mapas
- geoEuskadi: fuente visible Gobierno Vasco, con enlace oficial. El catálogo permite uso con reconocimiento; revisar las particularidades de las capas que se añadan en el futuro. https://www.geo.euskadi.eus/webgeo00-content/es/ y https://www.euskadi.eus/geograficos/servicio-de-visualizacion-de-ortofotografias-de-la-comunidad-autonoma-del-pais-vasco/web01-tramite/es/
- PNOA: GetCapabilities del servicio consultado declara `CC BY 4.0 scne.es`. Se citan IGN / SCNE, la licencia y la composición derivada con anotaciones en las exportaciones; no se inventa un año de vuelo para un mosaico de fechas variables. https://www.ign.es/wmts/pnoa-ma?SERVICE=WMTS&REQUEST=GetCapabilities y https://www.ign.es/resources/licencia/Condiciones_licenciaUso_IGN.pdf
- OSM: ODbL, reconocimiento y enlace de copyright. El servidor estándar solo se usa para visualización interactiva; no hay descarga offline, archivo de teselas ni precarga masiva OSM. El navegador conserva caché HTTP y Referer; escritorio identifica app y contacto con User-Agent. Sin SLA ni promesa comercial de disponibilidad. Para volumen de clientes, contratar proveedor o usar infraestructura propia. https://www.openstreetmap.org/copyright y https://operations.osmfoundation.org/policies/tiles/

Las atribuciones se mantienen visibles en mapas, carátulas y composiciones PNG/PDF/MP4. Las anotaciones didácticas no se presentan como modificaciones oficiales de los datos originales. No se restringen los derechos concedidos sobre mapas y componentes ajenos.

## Condiciones comerciales e identidad
Se añadió a LICENSE autorización expresa de uso profesional/docente remunerado para quienes reciban una licencia de la app, independiente de reutilizar su código. No equivale a un contrato completo de venta, soporte, garantía o privacidad.

El logo EEM fue suministrado por el promotor; no hay autorización comercial de su titular acreditada en el repositorio. Obtener y conservar autorización escrita antes de comercializar la edición con esa marca. Atribuirla no basta ni acredita afiliación. No se ha verificado la cadena de titularidad de aportaciones históricas; el usuario declara ser titular de su código original.

La app no incorpora imágenes externas de señales DGT: los símbolos y vehículos se construyen en SVG/canvas en su código. No se anuncia homologación ni respaldo DGT. El usuario conserva responsabilidad sobre los derechos de las voces, vídeos y demás contenido que aporte.

Esta revisión técnica documental no es dictamen jurídico ni garantía de cumplimiento de toda ley. Antes de venta a terceros, revisar contrato, marca autorizada y obligaciones de privacidad e imagen según el uso real.

## Ampliación Premium 1.3
Se han añadido los módulos de Capacitor y la integración de FichaAutoescuela. El inventario generado recoge las licencias adicionales. Los PDF de formularios del módulo de alumnos conservan su procedencia en public/premium-ficha/SOURCE.md; no se atribuyen a AD Mobility. La revisión anterior de símbolos SVG no comprende la autorización de estos formularios oficiales para cada explotación comercial.
