'use client';

import { memo } from 'react';
import { ZeroEdgeBadge } from '@/app/components/ZeroEdgeModal';
import { ProvablyFairBadge } from '@/app/components/ProvablyFairModal';

export const PlinkoBottomControls = memo(function PlinkoBottomControls() {
  return (
    <div className="flex w-full justify-between">
      <ZeroEdgeBadge />
      <ProvablyFairBadge gameName="plinko" />
    </div>
  );
});
