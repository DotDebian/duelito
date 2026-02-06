'use client';

import { useState, useCallback, useEffect } from 'react';

// Icons
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" className="h-full w-full">
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m1.176 3.27.237 5.245c.115 2.557 1.66 4.852 4.036 5.997l1.324.638a2.84 2.84 0 0 0 2.454 0l1.324-.638c2.376-1.145 3.92-3.44 4.036-5.997l.237-5.245c.017-.375-.33-.68-.705-.677a6 6 0 0 1-2.005-.33c-.746-.256-1.593-.726-2.324-1.184a3.41 3.41 0 0 0-3.58 0c-.73.458-1.578.928-2.324 1.184a6 6 0 0 1-2.005.33c-.375-.004-.722.302-.705.677m10.4 3.193a.952.952 0 0 0-1.497-1.177L7.025 9.172 5.782 8.136A.952.952 0 1 0 4.562 9.6l1.997 1.663a.95.95 0 0 0 1.358-.143z"
      clipRule="evenodd"
    />
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" className="h-full w-full">
    <g clipPath="url(#icon-duel-copy_svg__a)">
      <path
        fillRule="evenodd"
        d="M2.667.667a2 2 0 0 0-2 2V10a2 2 0 0 0 2 2H10a2 2 0 0 0 2-2V2.667a2 2 0 0 0-2-2zm12.666 4.452a.785.785 0 1 0-1.571 0v5.643a3 3 0 0 1-3 3H5.12a.786.786 0 0 0 0 1.571h6.214a4 4 0 0 0 4-4z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="icon-duel-copy_svg__a">
        <path d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
    <path d="m8.285 7 4.363-4.362c.12-.12.186-.28.186-.452a.63.63 0 0 0-.186-.45l-.383-.383a.63.63 0 0 0-.451-.186.63.63 0 0 0-.451.186L7 5.715 2.638 1.353a.63.63 0 0 0-.451-.186.63.63 0 0 0-.451.186l-.383.382a.64.64 0 0 0 0 .903L5.716 7l-4.363 4.362a.63.63 0 0 0-.186.452c0 .17.066.33.186.45l.383.383c.12.12.28.186.45.186.172 0 .332-.066.452-.186L7 8.285l4.363 4.362c.12.12.28.186.45.186.172 0 .332-.066.452-.186l.383-.382c.12-.12.186-.28.186-.451a.63.63 0 0 0-.186-.452z" />
  </svg>
);

// Copyable field component
function CopyableField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <div>
      <span className="text-b-md font-semibold">{label}</span>
      <div className="w-full">
        <div className="flex h-[44px] items-center justify-between gap-[6px] rounded-8 bg-dark-700 px-[12px] text-b-md mt-4">
          <p
            className="min-w-0 flex-1 font-semibold overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer text-dark-300"
            onClick={handleCopy}
          >
            {value}
          </p>
          <div
            className="cursor-pointer text-dark-200 hover:text-light-000 transition-colors"
            onClick={handleCopy}
          >
            <div className="size-16">
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" className="h-full w-full text-green-500">
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
                </svg>
              ) : (
                <CopyIcon />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate random seed
function generateRandomSeed(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

interface ProvablyFairModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameName?: string;
}

export function ProvablyFairModal({ isOpen, onClose, gameName = 'dice' }: ProvablyFairModalProps) {
  // Mock data - in a real app this would come from an API
  const [clientSeed, setClientSeed] = useState('L77bl3aHkfwT0Zga');
  const [newClientSeed, setNewClientSeed] = useState('Xg12bQBCDSXTBbfz');
  const serverSeedHashed = '46f4c00c4141c2eca4af143126a9865b4191ffa81e8a487c574bc9fba7cabd12';
  const nextServerSeedHashed = '024b32451aa505aafa11187132664426f72f17696abc2352f6ba1c8951efadba';
  const [nonce, setNonce] = useState(373);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleRotateSeed = useCallback(() => {
    setClientSeed(newClientSeed);
    setNewClientSeed(generateRandomSeed());
    setNonce((prev) => prev + 1);
  }, [newClientSeed]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal */}
      <div
        className="fixed inset-0 m-auto flex items-center justify-center transition-all duration-300"
        style={{ zIndex: 104 }}
      >
        <div className="absolute inset-0 bg-dark-900/90" onClick={onClose} />
        <div
          className="relative rounded-12 w-[440px] flex flex-col z-10 touch-none bg-dark-500"
          style={{
            maxWidth: 'unset',
            transform: 'translateY(0%)',
            transition: 'transform 0.3s',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >

          <div className="flex h-full flex-col overflow-hidden rounded-12">
            {/* Header */}
            <div>
              <div className="flex flex-col gap-8 px-16 py-32 sm:px-32">
                <h2 className="flex items-center gap-8 text-h-md text-light-000">
                  <div className="size-[20px] text-dark-200">
                    <ShieldIcon />
                  </div>
                  Provably Fair
                </h2>
                <span className="text-b-md text-dark-200">
                  Use these values to verify that every bet placed had a truly random and unpredictable outcome. Read
                  more about how it works{' '}
                  <a href={`/fairness?returnTo=/${gameName}`} className="underline hover:text-light-000">
                    here
                  </a>
                  .
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="scrollbar overflow-y-overlay flex flex-1 flex-col justify-between overflow-x-hidden px-16 pb-16 pt-0 sm:px-32 sm:pb-32">
              <div>
                {/* Active seeds section */}
                <div className="flex flex-col gap-16 text-dark-200">
                  <CopyableField label="Active client seed" value={clientSeed} />
                  <CopyableField label="Active server seed (Hashed)" value={serverSeedHashed} />
                  <CopyableField label="Nonce" value={nonce.toString()} />
                </div>

                <hr className="my-32 text-dark-400" />

                {/* New seeds section */}
                <div className="flex flex-col gap-16 text-dark-200">
                  <div className="flex flex-col">
                    <span className="text-b-md font-semibold">New client seed</span>
                    <input
                      autoComplete="do-not-autofill"
                      type="text"
                      inputMode="text"
                      className="bg-dark-700 text-dark-300 outline outline-2 outline-offset-[-2px] outline-transparent transition-all [&:valid:not(:placeholder-shown)]:text-light-000 hover:outline-dark-400 active:text-light-000 focus:text-light-000 active:outline-dark-400 focus:outline-dark-400 px-[12px] h-[40px] text-b-md font-semibold gap-4 rounded-8 py-8 placeholder:text-dark-300 mt-4"
                      spellCheck="false"
                      value={newClientSeed}
                      onChange={(e) => setNewClientSeed(e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-b-md font-semibold">Next server seed (Hashed)</span>
                    </div>
                    <CopyableField label="" value={nextServerSeedHashed} />
                  </div>

                  <div>
                    <button
                      onClick={handleRotateSeed}
                      className="touch-manipulation outline-none mt-16 cursor-pointer bg-blue-600 text-light-000 hover:bg-blue-500 active:bg-blue-500 disabled:bg-dark-400 disabled:opacity-50 w-full px-[12px] h-[40px] text-b-md font-semibold flex flex-row items-center justify-center rounded-8 py-8 transition-all disabled:cursor-not-allowed"
                      data-testid="rotate-seed-button"
                    >
                      <span className="flex items-center justify-center w-full gap-4 flex-row">Rotate seed</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="touch-manipulation outline-none absolute right-[14px] top-[14px] z-10 cursor-pointer !px-16 text-dark-100 hover:text-light-000 hover:bg-dark-600 active:text-light-000 disabled:bg-transparent disabled:text-light-000 disabled:opacity-50 px-[24px] h-[48px] text-b-lg font-bold flex flex-row items-center justify-center rounded-8 py-8 transition-all disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center w-full gap-8 flex-row">
              <div className="size-16">
                <CloseIcon />
              </div>
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

// Provably Fair Badge component - clickable to open modal
interface ProvablyFairBadgeProps {
  className?: string;
  gameName?: string;
  showLabel?: boolean;
}

export function ProvablyFairBadge({ className = '', gameName = 'dice', showLabel = true }: ProvablyFairBadgeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-4 text-b-md text-dark-200 font-bold hover:text-light-200 transition-colors cursor-pointer ${className}`}
        data-testid="open-fairness-modal"
      >
        <div className="size-16">
          <ShieldIcon />
        </div>
        {showLabel && <span>Provably Fair</span>}
      </button>

      <ProvablyFairModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} gameName={gameName} />
    </>
  );
}
