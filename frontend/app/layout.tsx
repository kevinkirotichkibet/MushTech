import './globals.css';
import Link from 'next/link';
import { CartProvider } from '@/lib/cart';

export const metadata = { title: 'MushTech – Fresh Oyster Mushrooms' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <header>
            <Link href="/"><strong>🍄 MushTech</strong></Link>
            <nav><Link href="/">Shop</Link><Link href="/cart">Cart</Link></nav>
          </header>
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
