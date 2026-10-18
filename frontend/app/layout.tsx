import './globals.css';
import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import { CartProvider } from '@/lib/cart';
import { AuthProvider } from '@/lib/auth';

const display = Fraunces({ subsets: ['latin'], variable: '--font-display', axes: ['opsz'] });
const sans = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'MushTech | Fresh mushrooms by the kilo',
  description: 'Oyster and button mushrooms, sold by the kilo.',
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
