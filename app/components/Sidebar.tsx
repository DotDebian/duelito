'use client';

import { useState, useEffect } from 'react';
import { ChatMessage, OnlineStats } from '@/types';
import { useSidebar } from '@/app/contexts/SidebarContext';

interface ChatData {
  messages: ChatMessage[];
  online: OnlineStats;
}

export function Sidebar() {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const { isOpen, setIsOpen } = useSidebar();

  useEffect(() => {
    fetch('/api/chat')
      .then((res) => res.json())
      .then(setChatData);
  }, []);

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 flex h-10 w-10 items-center justify-center rounded-full bg-dark-600 text-dark-200 hover:text-light-000 lg:hidden ${
          isOpen ? 'left-[25rem] top-16' : 'left-2 top-16'
        }`}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`group/chat sticky left-0 top-[var(--navbar-height)] z-10 h-[calc(100vh-var(--navbar-height))] flex-shrink-0 bg-dark-900 transition-[width,border-color] duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'hidden w-[400px] border-r border-dark-600 lg:flex' : 'hidden w-0 border-r-0 lg:flex'
        }`}
      >
        {/* Inner wrapper to maintain content width during animation */}
        <div className="flex h-full w-[400px] flex-shrink-0 flex-col px-16 pb-16">
          {/* Top gradient (mobile) */}
          <div className="absolute top-0 z-10 h-[12px] w-full bg-gradient-to-t from-transparent to-dark-900 lg:hidden" />

          {/* Online Counter */}
          <div className="flex items-center gap-4 px-4 pb-2 pt-4 text-b-sm text-dark-200">
            <div className="h-2 w-2 rounded-full bg-green-700" />
            <span>{chatData?.online.count || 0} Online</span>
          </div>

          {/* Announcement */}
          <div className="flex flex-col items-center gap-4 px-4 pb-2 pt-2">
            <div className="flex w-full cursor-pointer items-center gap-4 rounded-lg border border-blue-600 bg-dark-600 px-3 py-1.5 text-b-sm text-light-000 transition-colors duration-100 hover:border-blue-500 hover:bg-dark-500">
              <span className="break-words">{chatData?.online.announcement}</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="scrollbar hoverable dark grow overflow-y-auto overflow-x-hidden overscroll-contain">
            {chatData?.messages.map((msg) => (
              <ChatMessageItem key={msg.id} message={msg} />
            ))}
          </div>

          {/* Online counter (bottom, hidden by default) */}
          <div className="hidden flex-row-reverse items-center gap-4 px-4 pb-2 text-b-sm text-dark-200">
            <div className="h-2 w-2 rounded-full bg-green-700" />
            <span>{chatData?.online.count || 0} Online</span>
          </div>

          {/* Chat Input */}
          <div className="relative">
            <div className="flex items-end gap-4 p-4 pt-0 lg:pt-4">
              <div className="flex min-h-[40px] flex-1 items-end justify-between gap-x-4 rounded-lg bg-dark-700 py-1 pl-3 pr-1">
                <input
                  type="text"
                  disabled
                  className="relative w-full bg-dark-700 py-1.5 text-b-lg outline-none placeholder:text-dark-300 disabled:cursor-not-allowed"
                  placeholder="Say something..."
                />
                <button
                  disabled
                  className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-light-000 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-dark-400 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-16 w-16">
                    <g clipPath="url(#icon-envelope)">
                      <path d="M13.895.653a.29.29 0 0 0-.297-.07L.18 6.125A.29.29 0 0 0 0 6.417a.3.3 0 0 0 .187.268l3.692 1.43a.3.3 0 0 0 .274-.03l4.9-3.5a.292.292 0 1 1 .374.45L5.343 8.971a.3.3 0 0 0-.087.21v3.943a.286.286 0 0 0 .216.28.286.286 0 0 0 .326-.134l1.85-3.162a.146.146 0 0 1 .192-.058l3.4 1.872a.29.29 0 0 0 .427-.192L14 .939a.29.29 0 0 0-.105-.286" />
                    </g>
                    <defs>
                      <clipPath id="icon-envelope">
                        <path d="M0 0h14v14H0z" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Close button (desktop) */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-[16px] top-[13px] flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-dark-600 px-[10px] py-2 text-dark-200 opacity-0 outline-none transition-all duration-300 hover:bg-dark-500 hover:text-light-000 active:bg-blue-500 active:text-light-000 group-hover/chat:opacity-100 lg:right-[12px] lg:top-[11px]"
          >
            <span className="flex w-full flex-row items-center justify-center gap-1">
              <div className="h-[16px] w-[16px]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
                  <path d="m8.285 7 4.363-4.362c.12-.12.186-.28.186-.452a.63.63 0 0 0-.186-.45l-.383-.383a.63.63 0 0 0-.451-.186.63.63 0 0 0-.451.186L7 5.715 2.638 1.353a.63.63 0 0 0-.451-.186.63.63 0 0 0-.451.186l-.383.382a.64.64 0 0 0 0 .903L5.716 7l-4.363 4.362a.63.63 0 0 0-.186.452c0 .17.066.33.186.45l.383.383c.12.12.28.186.45.186.172 0 .332-.066.452-.186L7 8.285l4.363 4.362c.12.12.28.186.45.186.172 0 .332-.066.452-.186l.383-.382c.12-.12.186-.28.186-.451a.63.63 0 0 0-.186-.452z" />
                </svg>
              </div>
            </span>
          </button>
        </div>
      </aside>

      {/* Expand button when collapsed (desktop) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          type="button"
          className="fixed bottom-16 left-16 z-30 hidden h-[56px] w-[56px] flex-row items-center justify-center rounded-[8px] bg-dark-600 p-0 text-dark-200 shadow-lg transition-all duration-200 hover:bg-dark-500 hover:text-light-000 active:bg-dark-500 active:text-light-000 lg:flex"
        >
          <div className="h-[16px] w-[16px] text-dark-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
              <path fillRule="evenodd" d="M2.875.583A1.375 1.375 0 0 0 1.5 1.958v8.176l-.893 2.68a.459.459 0 0 0 .545.59l3.612-.904h7.277a1.375 1.375 0 0 0 1.375-1.375V1.958A1.375 1.375 0 0 0 12.042.583zm1.26 4.443c0-.318.257-.573.573-.573h5.5a.573.573 0 0 1 0 1.146h-5.5a.573.573 0 0 1-.573-.573m.573 2.46a.573.573 0 1 0 0 1.145h3.667a.573.573 0 0 0 0-1.146z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
      )}
    </>
  );
}

function ChatMessageItem({ message }: { message: ChatMessage }) {
  // System message (like mod actions)
  if (message.isSystem) {
    return (
      <div className="bg-gradient-to-r from-[rgba(239,68,68,0.14)] to-transparent px-4 py-1.5 text-b-md text-red-500">
        <div className="inline-flex max-w-[175px] truncate align-middle">
          <div className="mr-2 h-4 w-4 flex-shrink-0 translate-y-0.5 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="h-full w-full">
              <g clipPath="url(#icon-muted_svg__a)">
                <path d="M8.658 12.07c-.375.12-.658.452-.658.845 0 .498.443.883.922.747a7 7 0 0 0 2.39-1.218l.122.122a.8.8 0 0 0 1.132-1.132l-10-10a.8.8 0 0 0-1.132 1.132l1.53 1.529-.181.158a1 1 0 0 1-.659.247H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1.124a1 1 0 0 1 .659.247l2.888 2.527a.5.5 0 0 0 .829-.376V7.631l1.612 1.612a.9.9 0 0 0-.112.43c0 .572.548.99 1.04.698q.062-.037.123-.077l1.007 1.007c-.456.331-.965.593-1.512.769M14 6.93c0 1.109-.258 2.158-.717 3.09l-1.217-1.217a5.402 5.402 0 0 0-3.408-7.015C8.283 1.668 8 1.336 8 .943c0-.498.443-.883.922-.747A7 7 0 0 1 14 6.93" />
                <path d="M11 6.93q-.001.38-.068.739L9.174 5.911a2.4 2.4 0 0 0-.695-.872C8.209 4.827 8 4.527 8 4.185c0-.572.548-.99 1.04-.697A4 4 0 0 1 11 6.929M6.5 2.102v1.135L5.307 2.044l.364-.318a.5.5 0 0 1 .829.376" />
              </g>
              <defs>
                <clipPath id="icon-muted_svg__a">
                  <path d="M0 0h14v14H0z" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <span className="align-middle">{message.message}</span>
      </div>
    );
  }

  return (
    <div className="relative transition-opacity duration-100 opacity-100">
      <div className="group relative px-4 py-1.5 text-b-md transition-colors duration-150 hover:bg-dark-800">
        {/* Reply indicator */}
        {message.replyTo && (
          <div className="flex cursor-pointer items-center gap-1 text-b-sm text-dark-300">
            <div className="h-1.5 w-1.5 flex-shrink-0 translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 7 6" className="h-full w-full">
                <path stroke="currentColor" strokeLinecap="round" d="M6.5.5h-2a4 4 0 0 0-4 4v1" />
              </svg>
            </div>
            <span className="font-bold"> @{message.replyTo.username}: </span>
            <span className="truncate">{message.replyTo.message}</span>
          </div>
        )}

        {/* Username and message */}
        <div className="inline-block">
          <div className="inline-block cursor-pointer">
            <span className="mr-1 inline-flex align-middle font-semibold text-dark-200 transition-colors hover:text-dark-100">
              {message.username}
              <span className="text-light-000">:</span>
            </span>
          </div>
        </div>
        <span className="align-middle font-normal text-light-000">
          <span className="break-words">{message.message}</span>
        </span>

        {/* Reply button on hover */}
        <div className="z-1 absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded bg-dark-900/80 p-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <button className="flex h-6 w-6 items-center justify-center rounded bg-transparent p-0 text-light-000 transition-colors duration-150 hover:text-dark-200">
            <div className="h-3.5 w-3.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10" className="h-full w-full">
                <path
                  fill="currentColor"
                  d="M4.291.22a.77.77 0 0 1 1.08 0 .74.74 0 0 1 0 1.06L2.654 3.95H8.95c1.685 0 3.051 1.343 3.051 3v.8c0 .442-.364.8-.813.8a.807.807 0 0 1-.814-.8v-.8c0-.773-.638-1.4-1.424-1.4H2.655L5.37 8.22a.74.74 0 0 1 0 1.06.77.77 0 0 1-1.079 0l-4.067-4a.74.74 0 0 1 0-1.06z"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
