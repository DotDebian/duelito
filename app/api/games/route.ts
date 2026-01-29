import { NextResponse } from 'next/server';
import { originalsGames, casinoGames } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  if (category === 'originals') {
    return NextResponse.json(originalsGames);
  }

  if (category === 'casino') {
    return NextResponse.json(casinoGames);
  }

  return NextResponse.json([...originalsGames, ...casinoGames]);
}
