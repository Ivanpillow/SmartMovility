import { NextResponse } from 'next/server';
import { parkingLots } from '@/data/parkingData';
import { fetchParkingLots } from '@/lib/supabase';
import {
  applyDistanceFromLocation,
  parseLocationFromSearchParams,
  rankParkings,
} from '@/lib/parkingRouting';

export async function GET(request: Request) {
  const list = (await fetchParkingLots()) ?? parkingLots;
  if (list.length === 0) {
    return NextResponse.json({ best: null, alternatives: [] });
  }

  const { searchParams } = new URL(request.url);
  const location = parseLocationFromSearchParams(searchParams.get('lat'), searchParams.get('lng'));
  const withDistance = location ? applyDistanceFromLocation(list, location) : list;
  const sorted = rankParkings(withDistance);
  const [best, ...alternatives] = sorted;

  return NextResponse.json({ best, alternatives });
}
