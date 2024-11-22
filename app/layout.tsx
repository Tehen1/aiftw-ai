import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Navbar } from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Chat Platform',
  description: 'A modern AI chat platform with multiple model support',
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
          </div>
        </Providers>
      </body>
    </html>
  );
}