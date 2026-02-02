import { NextResponse } from 'next/server';
import { getCrashGameManager } from '@/lib/crash-game';
import type { CrashRoundPublic, CrashResult } from '@/app/crash/types';

export const dynamic = 'force-dynamic';

interface StatusResponse {
  round: CrashRoundPublic | null;
  history: CrashResult[];
}

export async function GET(): Promise<NextResponse<StatusResponse>> {
  const gameManager = getCrashGameManager();

  return NextResponse.json({
    round: gameManager.getPublicRoundState(),
    history: gameManager.getHistory(),
  });
}
