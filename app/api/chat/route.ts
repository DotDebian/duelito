import { NextResponse } from 'next/server';
import { mockChatMessages, mockOnlineStats } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({
    messages: mockChatMessages,
    online: mockOnlineStats,
  });
}
