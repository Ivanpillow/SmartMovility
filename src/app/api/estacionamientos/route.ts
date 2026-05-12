import { NextResponse } from 'next/server';
import { parkingLots } from '@/data/parkingData';
import { fetchParkingLots } from '@/lib/supabase';

export async function GET() {
  const data = (await fetchParkingLots()) ?? parkingLots;
  return NextResponse.json({ data });
}
