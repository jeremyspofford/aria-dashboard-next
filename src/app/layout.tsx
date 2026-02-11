import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import DevelopmentBanner from '@/components/DevelopmentBanner';

export const metadata: Metadata = {
  title: 'Aria Dashboard',
  description: 'Task management and infrastructure monitoring for Aria Labs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <DevelopmentBanner />
        <div className="flex h-[calc(100vh-36px)] overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gray-50 pt-16 md:pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
