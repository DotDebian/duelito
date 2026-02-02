import { NextResponse } from 'next/server';
import { getCrashGameManager } from '@/lib/crash-game';
import type { CashoutRequest, CashoutResponse } from '@/app/crash/types';

export async function POST(request: Request): Promise<NextResponse<CashoutResponse>> {
  try {
    const body: CashoutRequest = await request.json();
    const { playerId } = body;

    if (!playerId || typeof playerId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Player ID is required' },
        { status: 400 }
      );
    }

    const gameManager = getCrashGameManager();
    const result = gameManager.cashout(playerId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      multiplier: result.multiplier,
      payout: result.payout,
    });
  } catch (error) {
    console.error('[Crash API] Cashout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
