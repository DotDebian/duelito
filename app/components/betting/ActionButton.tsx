'use client';

import { memo } from 'react';

interface ActionButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'success' | 'secondary';
  children: React.ReactNode;
}

export const ActionButton = memo(function ActionButton({
  onClick,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  children,
}: ActionButtonProps) {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-500',
    success: 'bg-green-600 hover:bg-green-500',
    secondary: 'bg-dark-400 hover:bg-dark-300',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-[48px] w-full items-center justify-center rounded-8 px-[24px] py-8 text-b-lg font-bold text-light-000 transition-transform duration-75 active:scale-95 disabled:cursor-not-allowed disabled:bg-dark-400 disabled:opacity-50 ${variantClasses[variant]}`}
    >
      <span className="flex items-center justify-center gap-8">
        {isLoading && (
          <div className="flex shrink-0 items-center justify-center size-[14px] animate-spin">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="h-full w-full">
              <g clipPath="url(#icon-loading)">
                <path d="M12.4 7a5.38 5.38 0 0 1-1.707 3.94 5.38 5.38 0 0 1-3.724 1.46A5.4 5.4 0 0 1 7 1.6.8.8 0 0 0 7 0a7 7 0 1 0 7 7.007V7a.8.8 0 1 0-1.6 0" />
              </g>
              <defs>
                <clipPath id="icon-loading">
                  <path d="M0 0h14v14H0z" />
                </clipPath>
              </defs>
            </svg>
          </div>
        )}
        <span className="truncate">{children}</span>
      </span>
    </button>
  );
});
