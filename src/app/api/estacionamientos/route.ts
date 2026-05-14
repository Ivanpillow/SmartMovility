import { NextResponse } from 'next/server';
import { parkingLots } from '@/data/parkingData';
import { fetchParkingLots } from '@/lib/supabase';
import { applyDistanceFromLocation, parseLocationFromSearchParams } from '@/lib/parkingRouting';

export async function GET(request: Request) {
  const data = (await fetchParkingLots()) ?? parkingLots;
  const { searchParams } = new URL(request.url);
  const location = parseLocationFromSearchParams(searchParams.get('lat'), searchParams.get('lng'));
  const withDistance = location ? applyDistanceFromLocation(data, location) : data;
  return NextResponse.json({ data: withDistance });
}
