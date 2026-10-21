import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Figtree } from 'next/font/google';
import { CartProvider } from '@/lib/cart';
import { AuthProvider } from '@/lib/auth';

const sans = Figtree({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'MushTech | Fresh mushrooms by the kilo',
  description: 'Fresh oyster and button mushrooms (uyoga safi), weighed to order and sold by the kilo in Kenya.',
};

export const viewport: Viewport = { themeColor: '#FAF9F6' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
