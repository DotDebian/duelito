import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-dark-800 z-10 flex flex-col justify-between gap-32 pt-32 mx-auto w-full max-w-[1324px] transition-all duration-200 p-16 md:p-32">
      <div className="mx-auto">
        {/* Links Grid */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* About */}
          <div className="flex flex-1 flex-col gap-2">
            <Link href="/about/why-bonuses-suck" className="text-b-md font-bold text-white">
              About
            </Link>
            <ul className="flex flex-row flex-wrap gap-x-4 gap-y-2 text-nowrap text-b-md text-[#8b8d97] md:flex-col">
              <li>
                <Link href="/wtf-duel" className="transition-colors duration-200 hover:text-white">
                  wtf Duel?
                </Link>
              </li>
              <li>
                <Link href="/high-scores" className="transition-colors duration-200 hover:text-white">
                  High Scores
                </Link>
              </li>
              <li>
                <Link href="/referral-faq" className="transition-colors duration-200 hover:text-white">
                  Referral FAQ
                </Link>
              </li>
              <li>
                <Link href="/fairness" className="transition-colors duration-200 hover:text-white">
                  Provably Fair
                </Link>
              </li>
              <li>
                <Link href="/about/why-bonuses-suck" className="transition-colors duration-200 hover:text-white">
                  Why Bonuses Suck
                </Link>
              </li>
              <li>
                <Link href="/about/fake-bets" className="transition-colors duration-200 hover:text-white">
                  Fake Bets
                </Link>
              </li>
              <li>
                <Link href="/about/zero-edge" className="transition-colors duration-200 hover:text-white">
                  Zero Edge
                </Link>
              </li>
              <li>
                <button className="transition-colors duration-200 hover:text-white">
                  Live Support
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-b-md font-bold text-white">Legal</span>
            <ul className="flex flex-col gap-2 text-b-md text-[#8b8d97]">
              <li>
                <Link href="/policies/tos" className="transition-colors duration-200 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy-policy" className="transition-colors duration-200 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/sports-betting-rules" className="transition-colors duration-200 hover:text-white">
                  Sports Betting Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-b-md font-bold text-white">Community</span>
            <div className="flex gap-3">
              <a
                href="https://discord.gg/duel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#1f222d] text-[#8b8d97] transition-colors hover:bg-[#2a2d3a] hover:text-white"
                aria-label="Discord"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
                </svg>
              </a>
              <a
                href="https://x.com/duel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#1f222d] text-[#8b8d97] transition-colors hover:bg-[#2a2d3a] hover:text-white"
                aria-label="X (Twitter)"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Legal Text */}
        <div className="border-t border-[#1f222d] pt-8">
          <p className="mb-4 text-b-sm leading-relaxed text-[#5c5f6e]">
            Duel.com is owned and operated by Immortal Snail LLC, registration number: L22982,
            registered address: Arthur Evelyn Building, Suite 5, Main Street, Charlestown, Nevis,
            West Indies. Contact us at{' '}
            <a href="mailto:hey@duel.com" className="text-white hover:underline">
              hey@duel.com
            </a>
            . Duel.com is licensed and regulated by the Government of the Autonomous Island of
            Anjouan, Union of Comoros and operates under License No. ALSI-202411026-FI1. Duel.com
            has passed all regulatory compliance and is legally authorized to conduct gaming
            operations for any and all games of chance and wagering.
          </p>

          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-b-sm text-[#5c5f6e]">
              Copyright &copy; {new Date().getFullYear()} duel.com. All rights reserved.
            </p>
            <span className="text-b-sm text-[#5c5f6e]">18+</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
