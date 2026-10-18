import './globals.css';
import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import { CartProvider } from '@/lib/cart';
import SiteHeader from '@/components/SiteHeader';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', axes: ['opsz'] });
const sans = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'MushTech | Oyster mushrooms by the kilo',
  description: 'Pink, blue, grey, golden and king oyster mushrooms, sold by the kilo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <CartProvider>
          <SiteHeader />
          <main className="wrap">{children}</main>
          <footer className="wrap site-footer">
            <span>MushTech</span>
            <span>Oyster mushrooms, by the kilo.</span>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
