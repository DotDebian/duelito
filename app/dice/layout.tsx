import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dice',
};

export default function DiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
