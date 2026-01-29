'use client';

import { memo } from 'react';
import type { ActiveBucket } from '../types';
import type { PlinkoMultiplierConfig } from '@/types';

interface PlinkoBucketsProps {
  multipliers: PlinkoMultiplierConfig[];
  bucketColors: string[];
  activeBuckets: ActiveBucket[];
}

function formatMultiplier(value: number): string {
  if (value >= 1000) {
    const k = value / 1000;
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
  }
  if (value >= 100) {
    return `${value}`;
  }
  return `${value}x`;
}

export const PlinkoBuckets = memo(function PlinkoBuckets({
  multipliers,
  bucketColors,
  activeBuckets,
}: PlinkoBucketsProps) {
  return (
    <div className="flex w-full max-w-[600px] justify-center gap-1" style={{ padding: '0px 14px' }}>
      {multipliers.map((config, index) => {
        const activeBucket = activeBuckets.find((ab) => ab.index === index);
        const scale = activeBucket
          ? 1 + 0.3 * (1 - activeBucket.progress)
          : 1;

        return (
          <div key={index} className="relative flex-1">
            <div
              className="plinko-bucket"
              style={{
                background: bucketColors[index] || 'rgb(255, 193, 0)',
                borderRadius: '4px',
                display: 'flex',
                padding: '8px 2px 4px',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                maxHeight: '30px',
                width: '100%',
                fontSize: '11px',
                fontWeight: 'bold',
                color: 'rgb(31, 41, 55)',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 4px',
                textAlign: 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                transform: `scale(${scale})`,
                transition: activeBucket ? 'none' : 'transform 0.25s ease-in-out',
              }}
            >
              <div className="plinko-bucket-hole" />
              <div className="plinko-bucket-content">
                {formatMultiplier(config.multiplier)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
