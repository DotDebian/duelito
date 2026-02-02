import { NextResponse } from 'next/server';
import { getCrashGameManager } from '@/lib/crash-game';
import type { JoinRoundRequest, JoinRoundResponse } from '@/app/crash/types';

export async function POST(request: Request): Promise<NextResponse<JoinRoundResponse>> {
  try {
    const body: JoinRoundRequest = await request.json();
    const { username, avatarUrl, betAmount, autoCashoutAt } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    if (typeof betAmount !== 'number' || betAmount < 0) {
      return NextResponse.json(
        { success: false, error: 'Valid bet amount is required' },
        { status: 400 }
      );
    }

    const gameManager = getCrashGameManager();
    const result = gameManager.joinRound(
      username,
      avatarUrl || '/images/avatars/default.png',
      betAmount,
      autoCashoutAt
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      playerId: result.playerId,
    });
  } catch (error) {
    console.error('[Crash API] Join error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
