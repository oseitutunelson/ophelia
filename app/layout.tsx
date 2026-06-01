import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import { Toaster } from '@/components/ui/toaster';
import { EdgeStoreProvider } from '@/lib/edgestore';
import ModalProvider from '@/providers/modal-provider';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: 'Ophelia — Discover the World\'s Top Designers & Creative Professionals',
  description:
    'Find Top Designers & Creative Professionals on Ophelia. We are where designers gain inspiration, feedback, community, and jobs.',
  openGraph: {
    url: '/',
    title: 'Ophelia — Discover the World\'s Top Designers & Creative Professionals',
    description:
      'Find Top Designers & Creative Professionals on Ophelia. We are where designers gain inspiration, feedback, community, and jobs.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ophelia — Discover the World\'s Top Designers & Creative Professionals',
    description:
      'Find Top Designers & Creative Professionals on Ophelia. We are where designers gain inspiration, feedback, community, and jobs.'
  }
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={`${inter.variable} ${playfair.variable} font-sans`}>
          <EdgeStoreProvider>{children}</EdgeStoreProvider>
          <Toaster />
          <ModalProvider />
        </body>
      </html>
    </ClerkProvider>
  );
}
