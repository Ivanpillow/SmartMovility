import { createClient } from '@supabase/supabase-js';
import type { ParkingLot } from '@/types/parking';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const PARKING_TABLE = 'parking_lots';

export async function fetchParkingLots(): Promise<ParkingLot[] | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.from(PARKING_TABLE).select('*');
  if (error || !data) {
    return null;
  }

  return data.map((row: any) => {
    const totalSpaces = Number(row.totalSpaces ?? row.total_spaces ?? 0);
    const occupiedSpaces = Number(row.occupiedSpaces ?? row.occupied_spaces ?? 0);
    const availableSpaces = Number(
      row.availableSpaces ?? row.available_spaces ?? Math.max(totalSpaces - occupiedSpaces, 0)
    );
    const occupancyPercentage = Number(
      row.occupancyPercentage ??
        row.occupancy_percentage ??
        (totalSpaces ? Math.round((occupiedSpaces / totalSpaces) * 100) : 0)
    );

    return {
      id: String(row.id),
      name: String(row.name ?? row.title ?? 'Estacionamiento'),
      totalSpaces,
      occupiedSpaces,
      availableSpaces,
      distance: Number(row.distance ?? 0),
      occupancyPercentage,
      status: (row.status ?? 'available') as ParkingLot['status'],
      coordinates: {
        lat: Number(row.lat ?? row.latitude ?? 0),
        lng: Number(row.lng ?? row.longitude ?? 0),
      },
      isRecommended: Boolean(row.isRecommended ?? row.is_recommended ?? false),
    };
  });
}

export async function updateParkingOccupancy(
  parkingId: string,
  occupiedSpaces: number
): Promise<ParkingLot | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(PARKING_TABLE)
    .update({ occupied_spaces: occupiedSpaces })
    .eq('id', parkingId)
    .select('*')
    .single();

  if (error || !data) {
    return null;
  }

  const totalSpaces = Number(data.totalSpaces ?? data.total_spaces ?? 0);
  const occupiedSpacesValue = Number(data.occupiedSpaces ?? data.occupied_spaces ?? 0);
  const availableSpaces = Number(
    data.availableSpaces ?? data.available_spaces ?? Math.max(totalSpaces - occupiedSpacesValue, 0)
  );
  const occupancyPercentage = Number(
    data.occupancyPercentage ??
      data.occupancy_percentage ??
      (totalSpaces ? Math.round((occupiedSpacesValue / totalSpaces) * 100) : 0)
  );

  return {
    id: String(data.id),
    name: String(data.name ?? 'Estacionamiento'),
    totalSpaces,
    occupiedSpaces: occupiedSpacesValue,
    availableSpaces,
    distance: Number(data.distance ?? 0),
    occupancyPercentage,
    status: (data.status ?? 'available') as ParkingLot['status'],
    coordinates: {
      lat: Number(data.lat ?? data.latitude ?? 0),
      lng: Number(data.lng ?? data.longitude ?? 0),
    },
    isRecommended: Boolean(data.isRecommended ?? data.is_recommended ?? false),
  };
}
