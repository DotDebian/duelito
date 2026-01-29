import { NextResponse } from 'next/server';
import { plinkoConfig, BUCKET_COLORS } from '@/lib/plinko-config';

export async function GET() {
  return NextResponse.json({
    config: plinkoConfig,
    bucketColors: BUCKET_COLORS,
  });
}
