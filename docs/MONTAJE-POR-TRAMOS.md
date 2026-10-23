# GPX + PIP por tramos — 1.4.0

1. En GPX + vídeo, pulsar Añadir tracks GPX. Se puede seleccionar uno o varios; añadir más conserva el montaje existente.
2. Abrir Tramos del montaje. Cada tramo se compone de un GPX con tiempos completos y un vídeo. Abrir el tramo, seleccionar su vídeo y ajustar su sincronización si hace falta.
3. Subir/bajar cambia el orden. Quitar tramo sólo lo retira del proyecto, no borra originales. Los puntos críticos siguen a su tramo y son editables con el editor habitual.
4. Para archivos largos usar la misma carpeta con todos los originales: Cargar clase abre el primero; Añadir como tramo añade las parejas siguientes. Guardar proyecto conserva el montaje. Al mover la carpeta, volver a seleccionarla. Las bibliotecas y copias guardan las asociaciones, no los vídeos.
5. Mapa + PIP · MP4 exporta un solo archivo con cambio automático del vídeo PIP y continuidad del mapa. Los tramos se unen sin los tiempos de espera entre grabaciones ni líneas ficticias entre sus posiciones. Se conserva el tiempo original de los puntos como sourceTime; el montaje tiene un reloj consecutivo propio.
6. Activar Narrar con micrófono para mezclar la explicación con el audio de los vídeos. Usar auriculares si se monitoriza el resultado por otros medios. Pausar imagen mantiene la grabación del micrófono; Reanudar imagen continúa mapa/vídeo. Mantener la ventana visible y la pantalla encendida.

Los archivos originales nunca se recortan ni sobrescriben. Se necesitan vídeos que cubran el intervalo de su GPX; si falta alguno o es demasiado corto, se interrumpe la exportación con un mensaje y se aborta el archivo parcial. La sincronización es independiente por tramo. Hasta 100 tramos y 100.000 puntos por montaje. Los GPX sin horas siguen abriéndose individualmente, pero no pueden unirse a este montaje sincronizado. La exportación se realiza en tiempo real, más el tiempo de las pausas de explicación.

Recortar puede generar una copia de varios tramos en biblioteca. Para enviar a pizarra con vídeo, seleccionar un solo tramo por fragmento; el reproductor de la pizarra sigue utilizando un vídeo. Los proyectos antiguos con un único GPX y vídeo siguen abriéndose.

Comprobaciones: pruebas de modelo para relojes, offsets, reordenación, eliminación, incidencias, recuperación y recorte; prueba de interfaz de importación múltiple, dos vídeos, copia, recarga y exportación; MP4 real con dos fuentes de colores diferentes y audio de micrófono de prueba, con pausa de imagen; regresión de exportación simple y escritorio. Windows se empaqueta desde Mac; requiere prueba adicional en un equipo Windows real.
