import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blackjack',
};

export default function BlackjackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
