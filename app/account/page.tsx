'use client';

import { useState } from 'react';

type Tab = 'account' | 'affiliates' | 'transactions';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>('account');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'account', label: 'Account' },
    { id: 'affiliates', label: 'Affiliates' },
    { id: 'transactions', label: 'Transactions' },
  ];

  const tabWidths: Record<Tab, number> = {
    account: 81,
    affiliates: 86,
    transactions: 114,
  };

  const getTabOffset = () => {
    const index = tabs.findIndex((t) => t.id === activeTab);
    let offset = 4; // Initial padding
    for (let i = 0; i < index; i++) {
      offset += tabWidths[tabs[i].id] + 4; // tab width + gap
    }
    return offset;
  };

  return (
    <div className="flex flex-col gap-24 min-h-[calc(100dvh-80px)] p-16 sm:p-32">
      {/* Settings Header */}
      <h2 className="flex items-center gap-8 text-h-md lg:text-h-lg">
        <div className="h-16 w-16 text-dark-200 lg:h-[20px] lg:w-[20px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 14 14"
            className="h-full w-full"
          >
            <g clipPath="url(#icon-duel-settings_svg__a)">
              <path
                fillRule="evenodd"
                d="m5.557.69-.463 1.195-1.594.904-1.27-.194a1.08 1.08 0 0 0-1.078.528l-.43.754a1.08 1.08 0 0 0 .086 1.217l.807 1.001v1.81L.83 8.906a1.08 1.08 0 0 0-.086 1.217l.43.754a1.08 1.08 0 0 0 1.078.528l1.27-.194 1.573.904.463 1.196a1.08 1.08 0 0 0 1 .689h.905a1.08 1.08 0 0 0 1.002-.69l.463-1.195 1.572-.904 1.27.194a1.08 1.08 0 0 0 1.078-.528l.43-.754a1.08 1.08 0 0 0-.086-1.217l-.807-1.001v-1.81l.786-1.001a1.08 1.08 0 0 0 .086-1.217l-.43-.754a1.08 1.08 0 0 0-1.078-.528l-1.27.194-1.573-.904L8.443.689A1.08 1.08 0 0 0 7.442 0h-.884a1.08 1.08 0 0 0-1.001.69M7 9.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5"
                clipRule="evenodd"
              />
            </g>
            <defs>
              <clipPath id="icon-duel-settings_svg__a">
                <path d="M0 0h14v14H0z" />
              </clipPath>
            </defs>
          </svg>
        </div>
        Settings
      </h2>

      {/* Tabs */}
      <div className="w-full self-start overflow-y-hidden scrollbar-none">
        <nav className="relative flex w-fit gap-4 overflow-y-scroll rounded-12 bg-dark-600 p-4 text-b-md font-bold scrollbar-none">
          {/* Animated Background */}
          <div
            className="absolute left-0 top-[4px] z-10 h-[calc(100%-8px)] rounded-8 bg-dark-400 transition-all duration-200"
            style={{
              width: tabWidths[activeTab] || 79,
              transform: `translateX(${getTabOffset()}px)`,
              willChange: 'transform, width',
            }}
          />
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`z-10 flex h-[40px] shrink-0 cursor-pointer items-center rounded-8 px-12 transition-all ${
                activeTab === tab.id ? 'text-light-000' : 'text-dark-200 hover:text-light-000'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'account' && <AccountTab />}
      {activeTab === 'affiliates' && <AffiliatesTab />}
      {activeTab === 'transactions' && <TransactionsTab />}
    </div>
  );
}

function AccountTab() {
  return (
    <div className="flex flex-col gap-24">
      {/* Profile Section */}
      <div className="flex flex-col gap-16">
        <h2 className="text-h-sm text-dark-200">Profile</h2>
        <div className="flex w-full flex-col gap-16 rounded-12 bg-dark-500 p-16 md:gap-32 md:p-32 lg:max-w-[630px]">
          <div className="flex items-center justify-between gap-16">
            <div className="flex items-center gap-16">
              {/* Avatar */}
              <div className="relative h-[42px] w-[42px] overflow-hidden rounded-full">
                <img
                  src="https://ui-avatars.com/api/?name=QW&background=5E6EFF&color=fff"
                  className="absolute inset-0 h-full w-full"
                  alt="Profile"
                />
              </div>
              <h4 className="text-h-sm text-light-000">DotDebian</h4>
            </div>
            <button className="flex h-[40px] cursor-pointer flex-row items-center justify-center gap-4 rounded-8 bg-dark-400 px-12 text-b-md font-semibold text-light-000 transition-all hover:bg-dark-300">
              <div className="h-16 w-16 md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="h-full w-full"
                >
                  <path
                    fillRule="evenodd"
                    d="M13.07 3.501c-.525-.477-1.408-.477-1.933 0l-8.123 7.385a1.3 1.3 0 0 0-.443.953v1.018h1.207c.452 0 .871-.164 1.169-.434l8.123-7.385c.478-.435.478-1.102 0-1.537M9.984 2.233c1.18-1.072 3.06-1.072 4.24 0 1.225 1.114 1.225 2.959 0 4.074L6.1 13.69a3.46 3.46 0 0 1-2.322.88h-1.24c-.85 0-1.68-.643-1.68-1.605V11.84c0-.85.371-1.648 1.003-2.222l.45.495-.45-.495zm-.99 11.481c0-.473.385-.857.858-.857h4.276a.857.857 0 1 1 0 1.715H9.852a.857.857 0 0 1-.857-.858"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="hidden md:inline">Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="flex flex-col gap-16">
        <h2 className="text-h-sm text-dark-200">Security</h2>
        <div className="flex w-full flex-col gap-y-0.5 overflow-hidden rounded-12 lg:max-w-[630px]">
          {/* Password */}
          <div className="flex w-full flex-col gap-16 bg-dark-500 p-16 md:gap-32 md:p-32">
            <h3 className="flex items-center gap-8 text-b-lg font-bold">
              <div className="h-[20px] w-[20px] text-dark-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
                  <path
                    fillRule="evenodd"
                    d="M7.009.583c.144.003.279.077.36.2 1.012 1.503 2.698 2.25 4.986 2.093a.44.44 0 0 1 .336.123c.09.086.142.207.142.334v2.549a7.9 7.9 0 0 1-1.33 4.38 7.66 7.66 0 0 1-3.514 2.857l-.53.212-.005.002a1.27 1.27 0 0 1-.908 0l-.005-.002-.53-.211a7.66 7.66 0 0 1-3.513-2.857 7.9 7.9 0 0 1-1.331-4.38v-2.55c0-.133.056-.259.154-.346a.44.44 0 0 1 .358-.107 5.16 5.16 0 0 0 2.764-.36A5.3 5.3 0 0 0 6.64.768a.45.45 0 0 1 .369-.185M8.75 6.417a1.75 1.75 0 0 1-.875 1.516v1.692a.875.875 0 0 1-1.75 0V7.933A1.75 1.75 0 1 1 8.75 6.417"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex h-[40px] grow items-center justify-between">
                Password
                <button className="flex h-[40px] cursor-pointer flex-row items-center justify-center rounded-8 bg-dark-400 px-12 text-b-md font-semibold text-light-000 transition-all hover:bg-dark-300 md:self-start">
                  Add Password
                </button>
              </div>
            </h3>
          </div>

          {/* Two Factor Authentication */}
          <div className="flex w-full flex-col gap-16 bg-dark-500 p-16 md:gap-32 md:p-32">
            <h3 className="flex flex-col gap-16 font-bold md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-8">
                <div className="h-[20px] w-[20px] text-dark-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14" className="h-full w-full">
                    <path
                      fillRule="evenodd"
                      d="M7.009.583c.144.003.279.077.36.2 1.012 1.503 2.698 2.25 4.986 2.093a.44.44 0 0 1 .336.123c.09.086.142.207.142.334v2.549a7.9 7.9 0 0 1-1.33 4.38 7.66 7.66 0 0 1-3.514 2.857l-.53.212-.005.002a1.27 1.27 0 0 1-.908 0l-.005-.002-.53-.211a7.66 7.66 0 0 1-3.513-2.857 7.9 7.9 0 0 1-1.331-4.38v-2.55c0-.133.056-.259.154-.346a.44.44 0 0 1 .358-.107 5.16 5.16 0 0 0 2.764-.36A5.3 5.3 0 0 0 6.64.768a.45.45 0 0 1 .369-.185M8.75 6.417a1.75 1.75 0 0 1-.875 1.516v1.692a.875.875 0 0 1-1.75 0V7.933A1.75 1.75 0 1 1 8.75 6.417"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                Two Factor Authentication
              </div>
              <button className="flex h-[40px] w-full cursor-pointer flex-row items-center justify-center rounded-8 bg-dark-400 px-12 text-b-md font-semibold text-light-000 transition-all hover:bg-dark-300 md:w-auto md:self-start">
                Enable
              </button>
            </h3>
          </div>

          {/* Email Address */}
          <div className="flex w-full flex-col gap-16 bg-dark-500 p-16 md:gap-32 md:p-32">
            <h3 className="flex items-center gap-8 text-b-lg font-bold">
              <div className="h-[20px] w-[20px] text-dark-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="h-full w-full">
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M.833 4.457c0-.52.207-1.017.576-1.384A1.97 1.97 0 0 1 2.798 2.5h14.405c.52 0 1.02.206 1.389.573.368.367.575.865.575 1.384v.446l-8.665 5.754a.95.95 0 0 1-.502.135.95.95 0 0 1-.501-.135L.833 4.903zm0 2.405v8.682c0 .518.207 1.016.576 1.383.368.367.868.573 1.389.573h14.405c.52 0 1.02-.206 1.389-.573.368-.367.575-.865.575-1.383V6.861l-7.762 5.155-.006.005a2.6 2.6 0 0 1-1.399.4c-.49 0-.986-.133-1.398-.4l-.007-.005z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              Email Address
            </h3>
            <input
              type="email"
              className="h-[40px] w-full rounded-8 bg-dark-700 px-12 text-b-md font-semibold text-dark-300 outline-none disabled:pointer-events-none disabled:opacity-50"
              value="quentin.waguet@gmail.com"
              disabled
            />
          </div>

          {/* Logout */}
          <div className="flex w-full flex-col gap-16 bg-dark-600 p-16 md:gap-32 md:p-32">
            <h3 className="flex flex-col gap-16 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-8">
                <div className="h-[20px] w-[20px] text-dark-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" className="h-full w-full">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M3.992.429C2.024.429.428 2.264.428 4.528v8.944c0 2.264 1.596 4.1 3.564 4.1h5.182c.537 0 .972-.501.972-1.119 0-.617-.435-1.118-.972-1.118H3.992c-.895 0-1.62-.834-1.62-1.863V4.528c0-1.03.725-1.863 1.62-1.863h5.182c.537 0 .972-.5.972-1.118S9.71.429 9.174.429zm13.347 8.098-3.31-2.911a.714.714 0 0 0-1.197.527v1.84H7.066a1.071 1.071 0 1 0 0 2.143h5.766v1.84c0 .621.739.946 1.197.526l3.31-2.911a.714.714 0 0 0 0-1.054"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-b-lg font-bold">Logout</span>
              </div>
              <div className="flex gap-8 md:gap-16">
                <button className="flex h-[40px] w-full cursor-pointer flex-row items-center justify-center rounded-8 bg-dark-400 px-12 text-b-md font-bold text-light-000 transition-all hover:bg-dark-300 md:w-auto">
                  This Device
                </button>
                <button className="flex h-[40px] w-full cursor-pointer flex-row items-center justify-center rounded-8 bg-dark-400 px-12 text-b-md font-bold text-light-000 transition-all hover:bg-dark-300 md:w-auto">
                  All Devices
                </button>
              </div>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

function AffiliatesTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState('DotDebian');
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`duel.com/r/${affiliateCode}`);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleButtonClick = () => {
    if (isEditing) {
      // Claim the code (save it)
      setIsEditing(false);
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };

  return (
    <div className="grid w-full grid-cols-1 overflow-hidden rounded-12 lg:max-w-[630px]">
      {/* Affiliate Code Section */}
      <div className="flex-1 overflow-hidden rounded-12">
        <div className="flex flex-col justify-between gap-16 bg-dark-500 p-16 md:flex-row md:items-center md:p-32">
          <p className="text-b-lg font-bold">Affiliate Code</p>
          <div className="flex flex-1 flex-col gap-16 md:flex-row md:items-start md:justify-between">
            <div className="relative w-full">
              <div className="flex h-[40px] items-center justify-between gap-[6px] rounded-8 bg-dark-700 px-12 text-b-md">
                {isEditing ? (
                  <input
                    type="text"
                    value={affiliateCode}
                    onChange={(e) => setAffiliateCode(e.target.value)}
                    className="w-full bg-transparent font-semibold text-light-000 outline-none"
                    autoFocus
                  />
                ) : (
                  <>
                    <p className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-dark-300">
                      duel.com/r/{affiliateCode}
                    </p>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="cursor-pointer text-dark-200 transition-colors hover:text-light-000"
                    >
                      <div className="h-16 w-16">
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
                      </div>
                    </button>
                  </>
                )}
              </div>
              {/* Copied tooltip */}
              {showCopied && (
                <div className="absolute left-1/2 top-full z-50 mt-8 -translate-x-1/2">
                  <div className="absolute -top-4 left-1/2 h-0 w-0 -translate-x-1/2 border-b-[4px] border-l-[4px] border-r-[4px] border-b-dark-900 border-l-transparent border-r-transparent" />
                  <div className="rounded-8 bg-dark-900 px-12 py-8 text-b-sm font-semibold text-light-000">
                    Copied
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleButtonClick}
              className={`flex h-[40px] cursor-pointer flex-row items-center justify-center whitespace-nowrap rounded-8 px-12 text-b-md font-semibold text-light-000 transition-all ${
                isEditing
                  ? 'bg-blue-500 hover:bg-blue-400'
                  : 'bg-dark-400 hover:bg-dark-300'
              }`}
            >
              {isEditing ? 'Claim Code' : 'Change'}
            </button>
          </div>
        </div>
      </div>

      {/* Referred Users Section */}
      <div className="mt-16 flex min-h-128 w-full flex-col items-center gap-16">
        <div className="flex w-full flex-col justify-between gap-16 sm:flex-row sm:items-end">
          <h1 className="text-h-sm font-bold text-dark-200">Referred Users</h1>
        </div>
        <table className="w-full overflow-hidden rounded-12 border-separate border-spacing-0 text-b-md text-dark-200 md:table-fixed">
          <thead>
            <tr className="h-[48px] bg-dark-700 font-semibold">
              <td className="whitespace-nowrap p-16 px-8 first-of-type:pl-16 last-of-type:pr-16 lg:px-16">
                <div className="flex w-full justify-start">Player</div>
              </td>
              <td className="whitespace-nowrap p-16 px-8 first-of-type:pl-16 last-of-type:pr-16 lg:px-16">
                <div className="flex w-full justify-end">Joined</div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr className="h-[48px] bg-dark-600">
              <td colSpan={2} className="whitespace-nowrap px-8 py-128 first-of-type:pl-16 last-of-type:pr-16 lg:px-16">
                <div className="flex items-center justify-center">
                  <span className="text-h-xs font-semibold text-dark-300">You don&apos;t have any referred users.</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TransactionsTab() {
  return (
    <div className="flex flex-col gap-16">
    </div>
  );
}
