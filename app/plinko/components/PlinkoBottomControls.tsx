'use client';

import { memo } from 'react';

export const PlinkoBottomControls = memo(function PlinkoBottomControls() {
  return (
    <div className="flex w-full justify-between">
      <span>
        <div className="flex select-none items-center">
          <button
            type="button"
            className="flex h-[40px] flex-shrink-0 items-center justify-center rounded-8 px-0 py-8 text-b-md font-semibold text-dark-200 transition-all hover:bg-transparent hover:text-light-000 lg:font-bold"
          >
            <span className="flex items-center justify-center gap-4">
              <div className="flex gap-4">
                <div className="size-16">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
                    <g clipPath="url(#icon-duel-house-edge_svg__a)">
                      <path d="M6.663.082a.73.73 0 0 1 .775.064l6.27 4.702a.73.73 0 1 1-.878 1.169l-.277-.208v5.37a2.82 2.82 0 0 1-2.821 2.82H4.267a2.82 2.82 0 0 1-2.821-2.82v-5.37l-.277.208a.731.731 0 1 1-.877-1.17L6.56.148zm.336 4.828q-1.245 0-1.928.818t-.684 2.316q0 1.495.684 2.317.683.819 1.928.818 1.245 0 1.93-.818.683-.822.683-2.317 0-1.497-.683-2.316-.684-.818-1.93-.818m1.02 3.3q-.022.824-.265 1.287-.263.505-.755.505-.49 0-.758-.505a2 2 0 0 1-.123-.31zm-1.02-2.123q.492 0 .755.505.074.14.126.312l-1.901.986q.02-.834.262-1.298.268-.504.758-.505" />
                    </g>
                    <defs>
                      <clipPath id="icon-duel-house-edge_svg__a">
                        <path d="M0 0h14v14H0z" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div>Zero Edge</div>
              </div>
            </span>
          </button>
        </div>
      </span>

      <div className="flex select-none items-center">
        <button
          type="button"
          className="flex h-[40px] items-center justify-center rounded-8 px-0 py-8 text-b-md font-semibold text-dark-200 transition-all hover:bg-transparent hover:text-light-000 lg:font-bold"
        >
          <span className="flex items-center justify-center gap-4">
            <div className="size-16">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" className="h-full w-full">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="m1.176 3.27.237 5.245c.115 2.557 1.66 4.852 4.036 5.997l1.324.638a2.84 2.84 0 0 0 2.454 0l1.324-.638c2.376-1.145 3.92-3.44 4.036-5.997l.237-5.245c.017-.375-.33-.68-.705-.677a6 6 0 0 1-2.005-.33c-.746-.256-1.593-.726-2.324-1.184a3.41 3.41 0 0 0-3.58 0c-.73.458-1.578.928-2.324 1.184a6 6 0 0 1-2.005.33c-.375-.004-.722.302-.705.677m10.4 3.193a.952.952 0 0 0-1.497-1.177L7.025 9.172 5.782 8.136A.952.952 0 1 0 4.562 9.6l1.997 1.663a.95.95 0 0 0 1.358-.143z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            Provably Fair
          </span>
        </button>
      </div>
    </div>
  );
});
