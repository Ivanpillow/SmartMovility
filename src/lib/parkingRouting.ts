import { EntranceQCEI } from '@/types/entradas';
import type { ParkingLot } from '@/types/parking';

export type UserCoordinates = {
  lat: number;
  lng: number;
};

export const DEFAULT_USER_LOCATION: UserCoordinates = {
  lat: 20.657411,
  lng: -103.328974, 
};

const USER_LOCATION_STORAGE_KEY = 'smartmovility:user-location';
const EARTH_RADIUS_METERS = 6371000;

export function isValidCoordinate(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

export function calculateDistanceMeters(start: UserCoordinates, end: UserCoordinates): number {
  const latDiff = toRadians(end.lat - start.lat);
  const lngDiff = toRadians(end.lng - start.lng);
  const lat1 = toRadians(start.lat);
  const lat2 = toRadians(end.lat);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_METERS * c);
}

export function estimateWalkingMinutes(distanceMeters: number): number {
  const metersPerMinute = 80;
  return Math.max(1, Math.round(distanceMeters / metersPerMinute));
}

export function loadUserLocation(): UserCoordinates | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(USER_LOCATION_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<UserCoordinates>;
    if (!isValidCoordinate(parsed.lat) || !isValidCoordinate(parsed.lng)) {
      return null;
    }

    return { lat: parsed.lat, lng: parsed.lng };
  } catch {
    return null;
  }
}

export function saveUserLocation(location: UserCoordinates): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USER_LOCATION_STORAGE_KEY, JSON.stringify(location));
}

export function parseLocationFromSearchParams(
  lat: string | null,
  lng: string | null
): UserCoordinates | null {
  if (!lat || !lng) return null;

  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  if (!isValidCoordinate(parsedLat) || !isValidCoordinate(parsedLng)) {
    return null;
  }

  return { lat: parsedLat, lng: parsedLng };
}

export function applyDistanceFromLocation(
  parkings: ParkingLot[],
  location: UserCoordinates
): ParkingLot[] {
  return parkings.map((parking) => ({
    ...parking,
    distance: calculateDistanceMeters(location, parking.coordinates),
  }));
}

export function applyDistanceFromLocationToEntrances(
  entrances: EntranceQCEI[],
  location: UserCoordinates
): EntranceQCEI[] {
  return entrances.map((entrance) => ({
    ...entrance,
    distance: calculateDistanceMeters(location, entrance.coordinates),
  }));
}

function getParkingScore(parking: ParkingLot, maxDistance: number): number {
  const availabilityRatio = parking.totalSpaces > 0 ? parking.availableSpaces / parking.totalSpaces : 0;
  const lowOccupancyRatio = 1 - parking.occupancyPercentage / 100;
  const distanceScore = maxDistance > 0 ? 1 - parking.distance / maxDistance : 0;
  return availabilityRatio * 0.5 + lowOccupancyRatio * 0.3 + distanceScore * 0.2;
}

export function rankParkings(parkings: ParkingLot[]): ParkingLot[] {
  if (parkings.length === 0) return [];

  const maxDistance = Math.max(...parkings.map((parking) => parking.distance), 1);
  const sorted = [...parkings].sort(
    (a, b) => getParkingScore(b, maxDistance) - getParkingScore(a, maxDistance)
  );

  return sorted.map((parking, index) => ({
    ...parking,
    isRecommended: index === 0,
  }));
}
