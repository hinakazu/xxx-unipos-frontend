import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { DynamicBackground } from '@/components/ui/DynamicBackground';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Unipos - 感謝と称賛のプラットフォーム',
  description: '社内のコミュニケーションを促進し、感謝と称賛を可視化するプラットフォーム',
  keywords: ['unipos', '感謝', '称賛', 'コミュニケーション', 'チームワーク', 'ポイント'],
  authors: [{ name: 'Unipos Team' }],
  openGraph: {
    title: 'Unipos - 感謝と称賛のプラットフォーム',
    description: '社内のコミュニケーションを促進し、感謝と称賛を可視化するプラットフォーム',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unipos - 感謝と称賛のプラットフォーム',
    description: '社内のコミュニケーションを促進し、感謝と称賛を可視化するプラットフォーム',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" data-theme="light">
      <body className={inter.className}>
        <Providers>
          <DynamicBackground>
            {children}
          </DynamicBackground>
        </Providers>
      </body>
    </html>
  );
}