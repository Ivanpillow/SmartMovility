# SmartMovility

SmartMovility es una web app mobile-first para encontrar estacionamiento disponible en tiempo real cerca del campus CUCEI. El proyecto ahora usa Next.js con App Router, API Routes y está listo para desplegarse en Vercel.

## Caracteristicas

- UI mobile-first sin marco de telefono
- Navegacion inferior fija tipo app movil
- Mapa simple de CUCEI con pin manual de usuario y ruteo caminando aproximado
- Recomendaciones basadas en disponibilidad y distancia desde tu ubicacion elegida
- Chatbot simple conectado a API Routes
- Preparado para Supabase y OpenAI API

## Rutas de la app

- `/` Inicio
- `/mapa` Mapa con estacionamientos
- `/opciones` Opciones de estacionamiento
- `/recomendaciones` Mejores opciones
- `/detalle/:id` Detalle del estacionamiento
- `/ayuda` Ayuda
- `/chatbot` Chatbot
- `/splash` Pantalla de bienvenida
- `/loading` Pantalla de carga

## API Routes

- `GET /api/estacionamientos` lista de estacionamientos
- `GET /api/recomendacion` mejor estacionamiento + alternativas
- `POST /api/chatbot` respuesta del chatbot

## Stack

- Next.js 14 + React 18 + TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL)
- OpenAI API (chatbot)
- Leaflet + OpenStreetMap


## Desarrollo local

```
npm install
npm run dev
```

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. Importa el proyecto en Vercel.
3. Configura las variables de entorno en Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY`).
4. Deploy.

La app quedara disponible en `https://smartmovility.vercel.app`.
