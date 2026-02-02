import { getCrashGameManager } from '@/lib/crash-game';
import type { CrashEvent } from '@/app/crash/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(): Promise<Response> {
  const encoder = new TextEncoder();
  const gameManager = getCrashGameManager();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial state
      const initialState = gameManager.getPublicRoundState();
      const history = gameManager.getHistory();

      if (initialState) {
        const initEvent = `data: ${JSON.stringify({
          type: 'round_start',
          data: initialState,
          timestamp: Date.now(),
        })}\n\n`;
        controller.enqueue(encoder.encode(initEvent));
      }

      if (history.length > 0) {
        const historyEvent = `data: ${JSON.stringify({
          type: 'history_update',
          data: history,
          timestamp: Date.now(),
        })}\n\n`;
        controller.enqueue(encoder.encode(historyEvent));
      }

      // Subscribe to game events
      const unsubscribe = gameManager.subscribe((event: CrashEvent) => {
        try {
          const sseData = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(sseData));
        } catch {
          // Client disconnected
          unsubscribe();
        }
      });

      // Cleanup on close
      const cleanup = () => {
        unsubscribe();
      };

      // Store cleanup for potential abort
      (controller as unknown as { cleanup?: () => void }).cleanup = cleanup;
    },
    cancel() {
      // Called when client disconnects
      console.log('[Crash SSE] Client disconnected');
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
