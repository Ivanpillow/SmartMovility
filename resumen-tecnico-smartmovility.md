# Resumen tecnico de SmartMovility

## 1. Objetivo de la app
SmartMovility es una aplicacion web para ayudar a usuarios del entorno CUCEI a encontrar opciones de estacionamiento, ver su disponibilidad, comparar alternativas y ubicar la mejor opcion segun distancia y ocupacion.

## 2. Tecnologias principales

### Frontend
- Next.js 14 con App Router.
- React 18.
- TypeScript.
- Tailwind CSS v4 para estilos.
- Motion para animaciones.
- Leaflet para el mapa interactivo.
- Lucide React para iconos.
- Sonner para notificaciones.
- next-themes para manejo de tema.
- Radix UI y componentes UI reutilizables.
- MUI / Emotion en dependencias del proyecto.

### Backend y datos
- Rutas API de Next.js en `src/app/api`.
- Debido a que es un prototipo y no se pueden obtener datos en tiempo real, no fue necesario ni se implemento una base de datos, solo dastos preestablecidos en codigo.
- Datos estaticos locales como respaldo.
- OSRM para calcular rutas peatonales sobre calles.

### Entorno
- Node.js >= 18.17.0.
- Proyecto configurado con TypeScript, PostCSS y Next.js.

## 3. Como se comunican los archivos

### Estructura general
- `src/app/layout.tsx` define la estructura global, metadata, `CrispChat` y `Toaster`.
- `src/app/(main)/layout.tsx` envuelve las vistas principales y agrega `BottomNav`.
- `src/app/(main)/page.tsx`, `mapa/page.tsx`, `opciones/page.tsx`, `recomendaciones/page.tsx`, `detalle/[id]/page.tsx` y `ayuda/page.tsx` forman la experiencia principal.

### Flujo de datos
- `src/data/parkingData.ts` contiene los estacionamientos base.
- `src/data/entradasData.ts` contiene las entradas del campus.
- `src/lib/parkingRouting.ts` calcula distancia, ordena opciones y guarda la ubicacion del usuario en `localStorage`.
- `src/lib/locationPrompt.ts` valida si ya existe ubicacion guardada.
- `src/components/parking/ParkingCard.tsx` muestra cada estacionamiento y dispara navegacion a detalle o mapa.
- `src/components/maps/LeafletMapView.tsx` recibe estacionamientos, entradas, ubicacion y destino de ruta, y renderiza los marcadores en el mapa.
- `src/components/navigation/BottomNav.tsx` mantiene la navegacion fija en la zona principal.
- `src/components/theme/ThemeToggle.tsx` cambia entre tema claro y oscuro.

### Comunicacion de pantalla a pantalla
- La portada revisa si existe ubicacion guardada y, si existe, muestra la mejor opcion.
- La vista de opciones ordena los estacionamientos por distancia y disponibilidad.
- La vista de recomendaciones separa la mejor opcion y las alternativas.
- La vista de mapa recibe el estacionamiento o entrada seleccionada y centra la experiencia en la ubicacion del usuario.
- La vista de detalle usa el `id` de la ruta para mostrar informacion puntual de un estacionamiento.

## 4. Backend que usa la app

### Rutas API reales
- `src/app/api/estacionamientos/route.ts`
  - Obtiene estacionamientos desde Supabase con `fetchParkingLots()`.
  - Si Supabase no responde, usa `parkingLots` como respaldo.
  - Si la URL incluye `lat` y `lng`, calcula distancia desde esa ubicacion.
  - Responde con `{ data: [...] }`.

- `src/app/api/recomendacion/route.ts`
  - Obtiene estacionamientos desde Supabase o desde datos locales.
  - Calcula distancia si recibe coordenadas.
  - Ordena por relevancia con `rankParkings()`.
  - Devuelve `{ best, alternatives }`.

### Supabase
- `src/lib/supabase.ts` crea el cliente con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Consulta la tabla `parking_lots`.
- Normaliza campos con distintos nombres posibles, por ejemplo `totalSpaces` y `total_spaces`.
- Tambien existe `updateParkingOccupancy()`, aunque en el codigo revisado no se observa un uso directo dentro de `src`.

### Servicios externos
- `src/lib/streetRouting.ts` consulta OSRM en `router.project-osrm.org` para trazar la ruta peatonal.
- `src/components/maps/LeafletMapView.tsx` usa teselas de OpenStreetMap.
- `src/components/chatbot/ChatCrisp.tsx` integra Crisp para soporte o chat.

## 5. Frontend que usa la app

### Paginas principales
- Inicio: muestra la mejor opcion y accesos rapidos al mapa y a las opciones.
- Mapa: permite ver estacionamientos, entradas y la ruta peatonal.
- Opciones: lista las mejores opciones ordenadas.
- Recomendaciones: destaca el mejor estacionamiento y alternativas cercanas.
- Detalle: muestra informacion especifica por estacionamiento.
- Ayuda: centraliza soporte o guia.
- Splash y loading: mejoran la transicion visual.

### Componentes clave
- `ParkingCard`: tarjeta principal para cada estacionamiento.
- `StatusBadge`: etiqueta visual del estado.
- `OccupancyIndicator`: indicador de ocupacion.
- `MapPin`: simbolo visual para mapas.
- `BottomNav`: barra inferior de navegacion.
- `LeafletMapView`: componente mas importante del mapa interactivo.

### Interaccion de usuario
- El usuario puede marcar su ubicacion en el mapa.
- Esa ubicacion se guarda localmente y se usa para ordenar opciones.
- Las tarjetas y botones llevan a detalle, mapa u otras vistas.
- La recomendacion se calcula en funcion de distancia y disponibilidad.

## 6. Alcance funcional
- Buscar el estacionamiento mas conveniente para CUCEI.
- Comparar estacionamientos por disponibilidad y distancia.
- Ver ubicacion de estacionamientos y entradas en un mapa.
- Calcular una ruta peatonal desde la ubicacion del usuario.
- Mostrar una recomendacion principal y alternativas.
- Consultar detalles de cada estacionamiento.
- Dar soporte visual con chatbot, toasts y tema claro/oscuro.

## 7. Limites observados
- El proyecto depende de datos locales si Supabase no esta disponible.
- La ubicacion del usuario no se obtiene automaticamente por GPS en el flujo principal; se guarda y reutiliza desde el mapa.
- Hay valores fijos visibles en la interfaz, por ejemplo contadores de estados en la portada.
- Algunas acciones de navegacion usan ids o parametros fijos en ciertos botones.
- La ruta peatonal depende del servicio publico de OSRM.
- Si una API externa falla, la app recae en datos locales o en estados de vacio.
- En el codigo revisado no se encontro una ruta API de chatbot propia; la ayuda visible depende de la integracion de Crisp.

## 8. Resumen de comunicacion entre capas
1. El frontend carga la informacion base desde componentes y datos locales.
2. Si hay conexion a Supabase, el backend de Next.js usa esa fuente para estacionamientos.
3. Si Supabase falla, la app usa los datos estaticos del proyecto.
4. El mapa consume las coordenadas y calcula la ruta peatonal con OSRM.
5. La logica de ranking decide la opcion mas conveniente y la muestra en inicio, opciones y recomendaciones.

## 9. Archivos mas relevantes
- `src/app/layout.tsx`
- `src/app/(main)/layout.tsx`
- `src/app/(main)/page.tsx`
- `src/app/(main)/mapa/page.tsx`
- `src/app/(main)/opciones/page.tsx`
- `src/app/(main)/recomendaciones/page.tsx`
- `src/app/(main)/detalle/[id]/page.tsx`
- `src/app/api/estacionamientos/route.ts`
- `src/app/api/recomendacion/route.ts`
- `src/components/maps/LeafletMapView.tsx`
- `src/lib/parkingRouting.ts`
- `src/lib/streetRouting.ts`
- `src/lib/supabase.ts`
- `src/data/parkingData.ts`
- `src/data/entradasData.ts`

## 10. Conclusiones
SmartMovility esta montada como una aplicacion web moderna con Next.js, con una separacion clara entre presentacion, logica de calculo y fuentes de datos. Su propuesta central es recomendar estacionamientos de forma practica para CUCEI, usando una mezcla de datos estaticos, Supabase, mapa interactivo y ruteo peatonal externo.