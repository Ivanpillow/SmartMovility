/**
 * Formatea la distancia en metros a un formato legible.
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Calcula el tiempo estimado de caminata basado en distancia.
 */
export function getWalkingTime(meters: number): string {
  const minutes = Math.ceil((meters / 1000) * 12);

  if (minutes < 1) {
    return 'menos de 1 min';
  }

  return `${minutes} min`;
}

/**
 * Formatea un porcentaje para mostrar.
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Obtiene un mensaje descriptivo basado en el porcentaje de ocupacion.
 */
export function getOccupancyMessage(percentage: number): string {
  if (percentage < 30) {
    return 'Excelente disponibilidad';
  }
  if (percentage < 50) {
    return 'Buena disponibilidad';
  }
  if (percentage < 70) {
    return 'Disponibilidad moderada';
  }
  if (percentage < 90) {
    return 'Ocupacion alta';
  }
  return 'Casi lleno';
}
