import '@/app/globals.css';
import { Inter } from 'next/font/google';
import React from 'react';

import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import { getPageSession } from '@/lib/auth/utils';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Interior AI',
  description: 'Transform your interior spaces with AI',
};

export default async function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  const session = await getPageSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        {session && <Header />}
          <main className="min-h-screen bg-background">
            {children}
          </main>
        <Toaster />
      </body>
    </html>
  );
}