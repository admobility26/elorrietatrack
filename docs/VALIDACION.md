# Validación de ElorrietaTrack 1.0.0

- Compilación Vite y empaquetado NSIS Windows x64 completados con dependencias propias del repositorio.
- Edición reducida: solo tres mapas gratuitos, biblioteca de trayectorias y pizarras, apertura de explicaciones guardadas, borrado individual, copias conservar/actualizar, rechazo de coordenadas inválidas y ausencia de modificaciones en el espacio de RutasAD.
- Trayectorias: reordenar, recolocar y eliminar puntos; persistencia; cámara fija durante la edición; paso de trazadas y señales a pizarra sin modificar el original; continuar el trazo tras mover el mapa.
- Pizarra: catálogo completo, señales de dirección/velocidad, fases de semáforo, edición y borrado, vehículos animados, formas, pasos independientes, preguntas y presentación, PNG/PDF reales y recuperación de autoguardado.
- Grabación: MP4 real, audio durante la pausa, reanudación, puntero solo en mapa, señales añadidas en pausa, guardado y fotogramas de mapa coloreados. La prueba de pizarra comprueba también el audio decodificado de la grabación.
- Escritorio: protocolo y Documentos/ElorrietaTrack independientes, mapa y MP4 real guardado tras pausa/reanudación. Comprobado con Electron en Mac, también cargando el código empaquetado del instalador.
- Archivo ASAR de Windows: versión, dependencias reducidas y comparación de todos los paquetes web y archivos nativos con la compilación comprobada.

Las pruebas utilizan mapas sintéticos locales para evitar descargas automatizadas de servicios públicos. No acreditan disponibilidad permanente de geoEuskadi, PNOA u OSM.

Pendiente: ejecutar el EXE en Windows real en los equipos del centro. La web no se ha desplegado: requiere base D1 nueva y alta de su propio administrador. No se ha reutilizado ninguna base, cuenta ni contraseña de RutasAD.
