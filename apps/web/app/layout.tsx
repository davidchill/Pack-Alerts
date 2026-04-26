import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PackAlert.gg — TCG Restock Alerts',
  description:
    'Real-time Pokémon TCG restock alerts delivered to Discord. Never miss a drop again.',
  openGraph: {
    title: 'PackAlert.gg',
    description: 'Never miss a TCG drop again.',
    url: 'https://packalert.gg',
    siteName: 'PackAlert.gg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>{children}</body>
    </html>
  );
}
