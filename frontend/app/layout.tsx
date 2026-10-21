import './globals.css';
import type { Metadata } from 'next';
import { Alfa_Slab_One, Figtree } from 'next/font/google';
import { CartProvider } from '@/lib/cart';
import { AuthProvider } from '@/lib/auth';

const display = Alfa_Slab_One({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const sans = Figtree({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'MushTech | Uyoga safi, by the kilo',
  description: 'Fresh oyster and button mushrooms (uyoga safi), weighed to order and sold by the kilo in Kenya.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
