import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Layout } from '@/components/Layout';
import { TimeTrackingProvider } from '@/contexts/TimeTrackingContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TaskFlow Dashboard',
  description: 'AI-powered task management and analytics platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TimeTrackingProvider>
          <Layout>{children}</Layout>
        </TimeTrackingProvider>
      </body>
    </html>
  );
}