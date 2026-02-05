'use client';

import { useState } from 'react';

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTos, setAcceptTos] = useState(false);

  return (
    <form className="flex flex-col gap-16">
      {/* Username */}
      <div>
        <label className="text-b-md font-semibold text-dark-200" htmlFor="register-username">
          Username *
        </label>
        <div className="h-4" />
        <input
          id="register-username"
          type="text"
          maxLength={20}
          minLength={4}
          className="h-[40px] w-full rounded-8 bg-dark-700 px-12 text-b-md font-semibold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all placeholder:text-dark-300 hover:outline-dark-400 focus:text-light-000 focus:outline-dark-400"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="text-b-md font-semibold text-dark-200" htmlFor="register-password">
          Password *
        </label>
        <div className="h-4" />
        <div className="relative">
          <input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            minLength={8}
            className="h-[40px] w-full rounded-8 bg-dark-700 px-12 pr-[40px] text-b-md font-semibold text-light-000 outline outline-2 outline-offset-[-2px] outline-transparent transition-all placeholder:text-dark-300 hover:outline-dark-400 focus:text-light-000 focus:outline-dark-400"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="group absolute inset-y-0 right-4 my-auto flex h-[32px] cursor-pointer items-center justify-center rounded-8 px-[10px] text-dark-200 transition-all hover:bg-dark-600 hover:text-light-000"
          >
            <div className="h-16 w-16">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 17" className="h-full w-full">
                <path d="M15.903 8.095C14.397 5.155 11.415 3.167 8 3.167S1.602 5.157.097 8.095a.9.9 0 0 0 0 .81c1.506 2.94 4.488 4.928 7.903 4.928s6.398-1.99 7.903-4.928a.9.9 0 0 0 0-.81M8 12.5a4 4 0 1 1 0-8 4 4 0 0 1 0 8m0-6.667a2.7 2.7 0 0 0-.703.106 1.33 1.33 0 0 1-1.858 1.858A2.66 2.66 0 1 0 8 5.833" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Email Checkbox */}
      <div>
        <div className="mb-4 flex items-center gap-8">
          <div className="relative flex h-[20px] w-[20px] shrink-0 items-center justify-center">
            <input
              id="register-email"
              type="checkbox"
              className="peer h-full w-full cursor-pointer appearance-none rounded-4 bg-dark-400 transition-colors duration-100 checked:bg-blue-600"
            />
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center peer-checked:flex">
              <div className="w-[12px] text-light-000">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 12 12" className="h-full w-full">
                  <path fillRule="evenodd" d="M10.302 3.465a.901.901 0 1 0-1.407-1.127l-4.253 5.32L2.94 6.382a.9.9 0 0 0-1.08 1.44l2.4 1.8a.9.9 0 0 0 1.243-.158z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <label className="text-b-md font-semibold text-dark-200" htmlFor="register-email">
            Email (optional)
          </label>
        </div>
      </div>

      {/* Referral Code Checkbox */}
      <div>
        <div className="mb-4 flex items-center gap-8">
          <div className="relative flex h-[20px] w-[20px] shrink-0 items-center justify-center">
            <input
              id="register-referral-code"
              type="checkbox"
              className="peer h-full w-full cursor-pointer appearance-none rounded-4 bg-dark-400 transition-colors duration-100 checked:bg-blue-600"
            />
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center peer-checked:flex">
              <div className="w-[12px] text-light-000">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 12 12" className="h-full w-full">
                  <path fillRule="evenodd" d="M10.302 3.465a.901.901 0 1 0-1.407-1.127l-4.253 5.32L2.94 6.382a.9.9 0 0 0-1.08 1.44l2.4 1.8a.9.9 0 0 0 1.243-.158z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <label className="text-b-md font-semibold text-dark-200" htmlFor="register-referral-code">
            Referral code (optional)
          </label>
        </div>
      </div>

      {/* Terms Checkbox */}
      <div>
        <div className="flex items-center gap-8">
          <div className="relative flex h-[20px] w-[20px] shrink-0 items-center justify-center">
            <input
              id="register-tos"
              type="checkbox"
              checked={acceptTos}
              onChange={(e) => setAcceptTos(e.target.checked)}
              className="peer h-full w-full cursor-pointer appearance-none rounded-4 bg-dark-400 transition-colors duration-100 checked:bg-blue-600"
              required
            />
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center peer-checked:flex">
              <div className="w-[12px] text-light-000">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 12 12" className="h-full w-full">
                  <path fillRule="evenodd" d="M10.302 3.465a.901.901 0 1 0-1.407-1.127l-4.253 5.32L2.94 6.382a.9.9 0 0 0-1.08 1.44l2.4 1.8a.9.9 0 0 0 1.243-.158z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <label className="text-b-md font-semibold text-dark-200" htmlFor="register-tos">
            I agree to the{' '}
            <a href="/policies/tos" className="underline" target="_blank">
              Terms & Conditions
            </a>{' '}
            *
          </label>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!acceptTos}
        className="flex h-[48px] w-full cursor-pointer items-center justify-center rounded-8 bg-blue-600 px-24 text-b-lg font-bold text-light-000 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-dark-400 disabled:opacity-50"
      >
        Create Account
      </button>

      {/* Separator */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-16">
        <div className="h-[1px] w-full bg-dark-400" />
        <span className="text-b-md text-dark-200">or continue with</span>
        <div className="h-[1px] w-full bg-dark-400" />
      </div>

      {/* OAuth Buttons */}
      <div className="flex gap-16">
        <button
          type="button"
          className="flex h-[48px] w-full cursor-pointer items-center justify-center gap-8 rounded-8 bg-dark-400 px-24 text-b-lg font-bold text-light-000 transition-all hover:bg-dark-300"
        >
          <div className="h-16 w-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
              <path d="M13.602 5.739q.123.707.121 1.422c0 2.13-.76 3.93-2.086 5.15h.002C10.481 13.38 8.89 14 7 14A7 7 0 0 1 7 0a6.74 6.74 0 0 1 4.683 1.821L9.685 3.821A3.8 3.8 0 0 0 7 2.77c-1.826 0-3.377 1.232-3.93 2.89a4.2 4.2 0 0 0 0 2.68h.002c.556 1.657 2.105 2.89 3.93 2.89.944 0 1.754-.242 2.382-.67h-.002a3.24 3.24 0 0 0 1.399-2.126H7V5.74z" />
            </svg>
          </div>
          <span>Google</span>
        </button>
        <button
          type="button"
          className="flex h-[48px] w-full cursor-pointer items-center justify-center gap-8 rounded-8 bg-dark-400 px-24 text-b-lg font-bold text-light-000 transition-all hover:bg-dark-300"
        >
          <div className="h-16 w-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 15" className="h-full w-full">
              <path d="M7 0a7.07 7.07 0 0 0-4.777 1.863A6.93 6.93 0 0 0 0 6.44l3.783 1.553c.32-.226.701-.35 1.094-.357h.11l1.672-2.418v-.025c.005-.516.164-1.02.458-1.446a2.64 2.64 0 0 1 1.192-.952 2.67 2.67 0 0 1 2.873.583c.367.367.616.833.716 1.34.1.506.046 1.03-.155 1.507-.2.476-.54.883-.974 1.17a2.67 2.67 0 0 1-1.466.439H9.24l-2.38 1.711v.096c.01.493-.17.97-.5 1.34a1.997 1.997 0 0 1-2.675.264 1.96 1.96 0 0 1-.757-1.216L.238 8.91a6.93 6.93 0 0 0 2.907 3.954 7.07 7.07 0 0 0 4.822 1.072 7.03 7.03 0 0 0 4.338-2.343A6.9 6.9 0 0 0 14 7a6.96 6.96 0 0 0-2.046-4.923A7.12 7.12 0 0 0 7 0M4.426 10.62l-.862-.355c.149.322.409.582.734.731a1.52 1.52 0 0 0 1.61-.343 1.48 1.48 0 0 0 .32-1.598 1.47 1.47 0 0 0-.779-.796 1.5 1.5 0 0 0-1.12-.024l.889.369a1.1 1.1 0 0 1 .592.592c.111.267.11.566 0 .833a1.08 1.08 0 0 1-.572.572c-.257.11-.548.117-.812.02m6.64-5.427a1.73 1.73 0 0 0-.307-.964 1.76 1.76 0 0 0-.795-.634 1.78 1.78 0 0 0-1.914.39 1.726 1.726 0 0 0-.374 1.898c.134.318.36.59.65.78a1.78 1.78 0 0 0 2.229-.227 1.75 1.75 0 0 0 .51-1.243m-3.082 0c.003-.26.083-.512.23-.726s.356-.38.599-.477a1.34 1.34 0 0 1 1.44.295 1.31 1.31 0 0 1 .278 1.43 1.3 1.3 0 0 1-.491.584 1.336 1.336 0 0 1-1.673-.175 1.3 1.3 0 0 1-.383-.931" />
            </svg>
          </div>
          <span>Steam</span>
        </button>
      </div>
    </form>
  );
}
