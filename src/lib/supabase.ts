import { createClient } from '@supabase/supabase-js';
import type { ParkingLot } from '@/types/parking';
import type { EntranceQCEI } from '@/types/entradas';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  '';

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const PARKING_TABLE = 'parking_lots';
const ENTRANCES_TABLE = 'campus_entrances';

type ParkingLotRow = {
  id: string;
  name: string;
  total_spaces: number;
  occupied_spaces: number;
  available_spaces: number;
  distance: number;
  occupancy_percentage: number;
  status: ParkingLot['status'];
  lat: number;
  lng: number;
  is_recommended: boolean;
};

type EntranceRow = {
  id: string;
  name: string;
  status: EntranceQCEI['status'];
  distance: number | null;
  lat: number;
  lng: number;
};

function mapParkingLot(row: ParkingLotRow): ParkingLot {
  return {
    id: String(row.id),
    name: String(row.name ?? 'Estacionamiento'),
    totalSpaces: Number(row.total_spaces ?? 0),
    occupiedSpaces: Number(row.occupied_spaces ?? 0),
    availableSpaces: Number(row.available_spaces ?? 0),
    distance: Number(row.distance ?? 0),
    occupancyPercentage: Number(row.occupancy_percentage ?? 0),
    status: (row.status ?? 'available') as ParkingLot['status'],
    coordinates: {
      lat: Number(row.lat ?? 0),
      lng: Number(row.lng ?? 0),
    },
    isRecommended: Boolean(row.is_recommended ?? false),
  };
}

function mapEntrance(row: EntranceRow): EntranceQCEI {
  return {
    id: String(row.id),
    name: String(row.name ?? 'Entrada'),
    status: (row.status ?? 'available') as EntranceQCEI['status'],
    distance: typeof row.distance === 'number' ? row.distance : undefined,
    coordinates: {
      lat: Number(row.lat ?? 0),
      lng: Number(row.lng ?? 0),
    },
  };
}

export async function fetchParkingLots(): Promise<ParkingLot[] | null> {
  if (!supabase) {
    console.warn('Supabase no está configurado. Revisa las variables de entorno.');
    return null;
  }

  const { data, error } = await supabase
    .from(PARKING_TABLE)
    .select(
      `
      id,
      name,
      total_spaces,
      occupied_spaces,
      available_spaces,
      distance,
      occupancy_percentage,
      status,
      lat,
      lng,
      is_recommended
    `
    )
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error || !data) {
    console.error('Error al obtener estacionamientos desde Supabase:', error?.message);
    return null;
  }

  return data.map((row) => mapParkingLot(row as ParkingLotRow));
}

export async function fetchCampusEntrances(): Promise<EntranceQCEI[] | null> {
  if (!supabase) {
    console.warn('Supabase no está configurado. Revisa las variables de entorno.');
    return null;
  }

  const { data, error } = await supabase
    .from(ENTRANCES_TABLE)
    .select(
      `
      id,
      name,
      status,
      distance,
      lat,
      lng
    `
    )
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error || !data) {
    console.error('Error al obtener entradas desde Supabase:', error?.message);
    return null;
  }

  return data.map((row) => mapEntrance(row as EntranceRow));
}

export async function updateParkingOccupancy(
  parkingId: string,
  occupiedSpaces: number
): Promise<ParkingLot | null> {
  if (!supabase) {
    console.warn('Supabase no está configurado. Revisa las variables de entorno.');
    return null;
  }

  const { data, error } = await supabase
    .from(PARKING_TABLE)
    .update({ occupied_spaces: occupiedSpaces })
    .eq('id', parkingId)
    .select(
      `
      id,
      name,
      total_spaces,
      occupied_spaces,
      available_spaces,
      distance,
      occupancy_percentage,
      status,
      lat,
      lng,
      is_recommended
    `
    )
    .single();

  if (error || !data) {
    console.error('Error al actualizar ocupación:', error?.message);
    return null;
  }

  return mapParkingLot(data as ParkingLotRow);
}