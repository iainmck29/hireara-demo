import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Layout } from '@/components/Layout';

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
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}