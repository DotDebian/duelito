import { NextRequest, NextResponse } from 'next/server';

const MULTIPLIERS = {
  easy: [1.04, 1.10, 1.17, 1.24, 1.32, 1.42, 1.53, 1.65, 1.80, 1.98, 2.20, 2.48, 2.83, 3.31, 3.97, 4.96, 6.61, 9.92, 19.84],
  medium: [1.08, 1.20, 1.35, 1.52, 1.73, 1.98, 2.28, 2.64, 3.08, 3.63, 4.31, 5.17, 6.28, 7.74, 9.68, 12.32, 16.00, 21.33, 32.00],
  hard: [1.12, 1.32, 1.56, 1.87, 2.24, 2.73, 3.34, 4.12, 5.12, 6.40, 8.07, 10.24, 13.11, 16.92, 22.02, 28.93, 38.40, 51.52, 77.28],
  expert: [1.16, 1.44, 1.80, 2.28, 2.92, 3.78, 4.94, 6.52, 8.68, 11.64, 15.74, 21.44, 29.44, 40.72, 56.72, 79.60, 112.48, 160.00, 256.00],
};

type Difficulty = keyof typeof MULTIPLIERS;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { betAmount, difficulty } = body;

    // Validate inputs
    if (typeof betAmount !== 'number' || betAmount < 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid bet amount',
        code: 'INVALID_BET_AMOUNT',
      }, { status: 400 });
    }

    if (!['easy', 'medium', 'hard', 'expert'].includes(difficulty)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid difficulty',
        code: 'INVALID_DIFFICULTY',
      }, { status: 400 });
    }

    const gameId = `beef_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const multipliers = MULTIPLIERS[difficulty as Difficulty];

    return NextResponse.json({
      gameId,
      betAmount,
      difficulty,
      multipliers,
      startedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    }, { status: 500 });
  }
}
