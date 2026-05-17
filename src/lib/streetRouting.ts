import type { UserCoordinates } from '@/lib/parkingRouting';

type OsrmRouteResponse = {
  routes?: Array<{
    geometry?: {
      coordinates?: [number, number][];
    };
  }>;
};

/** Ruta peatonal por calles usando OSRM (OpenStreetMap). */
export async function fetchWalkingRoute(
  from: UserCoordinates,
  to: UserCoordinates,
  signal?: AbortSignal
): Promise<[number, number][]> {
  const coordinates = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const url = `https://router.project-osrm.org/route/v1/foot/${coordinates}?overview=full&geometries=geojson`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error('No se pudo calcular la ruta');
  }

  const data = (await response.json()) as OsrmRouteResponse;
  const routeCoords = data.routes?.[0]?.geometry?.coordinates;

  if (!routeCoords?.length) {
    throw new Error('Ruta vacía');
  }

  return routeCoords.map(([lng, lat]) => [lat, lng] as [number, number]);
}
