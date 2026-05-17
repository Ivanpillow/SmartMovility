import { toast } from 'sonner';
import type { UserCoordinates } from '@/lib/parkingRouting';

export const LOCATION_REQUIRED_MESSAGE =
  'Primero elige tu ubicación en el mapa.';

export function promptLocationRequired(): void {
  toast.warning(LOCATION_REQUIRED_MESSAGE, { duration: 3500 });
}

export function hasUserLocation(
  location: UserCoordinates | null | undefined
): location is UserCoordinates {
  return location !== null && location !== undefined;
}
