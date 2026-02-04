'use client';

import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'login' | 'register';
  onTabChange: (tab: 'login' | 'register') => void;
}

const authTabWidths = {
  login: 182,
  register: 182,
};

const getAuthTabOffset = (tab: 'login' | 'register') => {
  return tab === 'login' ? 4 : 190;
};

export function AuthModal({ isOpen, onClose, activeTab, onTabChange }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 m-auto flex items-center justify-center transition-all duration-300" style={{ zIndex: 103 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 flex w-[440px] max-w-[90vw] touch-none flex-col rounded-12 bg-dark-500"
        style={{ maxWidth: '480px' }}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-12">
          <div className="pt-[80px] md:pt-32" />

          <div className="scrollbar flex flex-1 flex-col justify-between overflow-y-auto overflow-x-hidden px-16 pb-16 pt-0 sm:px-32 sm:pb-32">
            {/* Tabs */}
            <div className="relative mb-16 inline-flex h-[48px] w-full gap-4 rounded-12 bg-dark-600 p-4 md:mb-32">
              {/* Animated Background */}
              <div
                className="absolute left-0 top-[4px] z-10 h-[calc(100%-8px)] rounded-8 bg-dark-400 transition-all duration-200"
                style={{
                  width: authTabWidths[activeTab],
                  transform: `translateX(${getAuthTabOffset(activeTab)}px)`,
                  willChange: 'transform, width',
                }}
              />

              <button
                onClick={() => onTabChange('login')}
                className={`z-20 flex h-full w-full cursor-pointer items-center justify-center rounded-8 py-8 text-b-md font-semibold transition-all duration-100 ${
                  activeTab === 'login' ? 'text-light-000' : 'text-dark-200 hover:text-light-000'
                }`}
              >
                Login
              </button>

              <button
                onClick={() => onTabChange('register')}
                className={`z-20 flex h-full w-full cursor-pointer items-center justify-center rounded-8 py-8 text-b-md font-semibold transition-all duration-100 ${
                  activeTab === 'register' ? 'text-light-000' : 'text-dark-200 hover:text-light-000'
                }`}
              >
                Register
              </button>
            </div>

            {/* Tab Content */}
            <div className="w-full transition-all duration-150">
              {activeTab === 'login' && <LoginForm />}
              {activeTab === 'register' && <RegisterForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
