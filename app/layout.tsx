import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Navbar } from '@/components/navbar';
import { FloatingChat } from '@/components/chat/floating-chat';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AIFTW - AI Solutions Platform',
  description: 'Tailored AI solutions to meet your business needs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-4">
              {children}
            </main>
            <FloatingChat />
          </div>
        </Providers>
      </body>
    </html>
  );
}