'use client';

import { memo } from 'react';

interface InsuranceIndicatorProps {
  insuranceBet: number;
  isVisible: boolean;
}

export const InsuranceIndicator = memo(function InsuranceIndicator({
  insuranceBet,
  isVisible,
}: InsuranceIndicatorProps) {
  const formattedAmount = insuranceBet.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div
      className="absolute h-full w-full transition-all duration-300 ease-out"
      style={{
        transform: `translateX(-400%) translateY(${isVisible ? 100 : 150}%)`,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        <span className="text-b-xs text-dark-100">INSURANCE</span>
        <div className="flex items-center justify-center gap-8 text-nowrap rounded-full p-4 pl-8 text-b-md font-semibold bg-dark-500 mt-4">
          <span className="inline-flex items-center justify-center gap-4 tabular-nums">
            {/* USDC icon */}
            <div className="flex-shrink-0 size-16">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 2000 2000" className="h-full w-full">
                <path fill="#2775ca" d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000" />
                <path fill="#fff" d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84" />
                <path fill="#fff" d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5m441.67-1300c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67" />
              </svg>
            </div>
            <span>{formattedAmount}</span>
          </span>
          {/* Blue circular icon */}
          <div className="flex-shrink-0 size-[24px] text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 25 24" className="h-full w-full">
              <circle cx="12.499" cy="11.993" r="11.993" fill="#fff" />
              <path d="M12.5 0a11.993 11.993 0 1 0 11.992 11.993A12.006 12.006 0 0 0 12.5 0M4.703 5.503 6.672 7.47a7.34 7.34 0 0 0-1.499 3.6H2.394c.185-2.048.991-3.99 2.31-5.568m-2.31 7.412H5.18a7.34 7.34 0 0 0 1.5 3.6l-1.975 1.968a10.1 10.1 0 0 1-2.31-5.568m9.183 9.183a10.1 10.1 0 0 1-5.568-2.306l1.969-1.969a7.34 7.34 0 0 0 3.599 1.49zm0-17.425a7.34 7.34 0 0 0-3.6 1.499L6.01 4.198a10.1 10.1 0 0 1 5.568-2.307zm11.027 6.397H19.82a7.34 7.34 0 0 0-1.494-3.599l1.969-1.968a10.1 10.1 0 0 1 2.31 5.567m-9.182-9.182c2.047.184 3.99.989 5.567 2.306l-1.968 1.972a7.34 7.34 0 0 0-3.6-1.5zm0 20.21v-2.785a7.34 7.34 0 0 0 3.599-1.493l1.968 1.968a10.1 10.1 0 0 1-5.567 2.31m6.873-3.615-1.969-1.969a7.34 7.34 0 0 0 1.494-3.599h2.784a10.1 10.1 0 0 1-2.31 5.568" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
});
