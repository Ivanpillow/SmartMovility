import { NextResponse } from 'next/server';
import { Entrances } from '@/data/entradasData';
import { fetchCampusEntrances } from '@/lib/supabase';
import {
  applyDistanceFromLocationToEntrances,
  parseLocationFromSearchParams,
} from '@/lib/parkingRouting';

export async function GET(request: Request) {
  const data = (await fetchCampusEntrances()) ?? Entrances;

  const { searchParams } = new URL(request.url);

  const location = parseLocationFromSearchParams(
    searchParams.get('lat'),
    searchParams.get('lng')
  );

  const withDistance = location
    ? applyDistanceFromLocationToEntrances(data, location)
    : data;

  return NextResponse.json({ data: withDistance });
}