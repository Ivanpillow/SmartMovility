import { NextResponse } from 'next/server';
import { parkingLots } from '@/data/parkingData';
import { fetchParkingLots } from '@/lib/supabase';
import type { ParkingLot } from '@/types/parking';

function scoreParking(parking: ParkingLot, maxDistance: number) {
  const availability = parking.totalSpaces
    ? parking.availableSpaces / parking.totalSpaces
    : 0;
  const occupancy = 1 - parking.occupancyPercentage / 100;
  const distanceScore = maxDistance ? 1 - parking.distance / maxDistance : 0;

  return availability * 0.5 + occupancy * 0.3 + distanceScore * 0.2;
}

export async function GET() {
  const list = (await fetchParkingLots()) ?? parkingLots;
  if (list.length === 0) {
    return NextResponse.json({ best: null, alternatives: [] });
  }

  const maxDistance = Math.max(...list.map((item) => item.distance), 1);

  const sorted = [...list].sort((a, b) => scoreParking(b, maxDistance) - scoreParking(a, maxDistance));
  const [best, ...alternatives] = sorted;

  return NextResponse.json({ best, alternatives });
}
