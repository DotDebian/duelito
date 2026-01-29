import { NextRequest, NextResponse } from 'next/server';
import { mockBets, mockHighRollerBets } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  if (type === 'high-rollers') {
    return NextResponse.json({ bets: mockHighRollerBets });
  }

  return NextResponse.json({ bets: mockBets });
}
