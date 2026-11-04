import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { ConsentBanner } from '@/components/privacy/ConsentBanner';

export const metadata: Metadata = {
  title: 'YouTube Analytics Pro | Creator Intelligence & Growth Platform',
  description: 'Enterprise-grade YouTube creator analytics, SEO analyzer, AI script generator, and revenue tracking platform.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased selection:bg-brand-500/20 selection:text-brand-500">
        <AppProvider>
          {children}
          <ConsentBanner />
        </AppProvider>
      </body>
    </html>
  );
}

