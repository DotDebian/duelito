import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Beef',
};

export default function BeefLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
