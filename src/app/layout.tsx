import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'YouTube Analytics Pro | Creator Intelligence & Growth Platform',
  description: 'Enterprise-grade YouTube creator analytics, SEO analyzer, AI script generator, and revenue tracking platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased selection:bg-brand-500/20 selection:text-brand-500`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

