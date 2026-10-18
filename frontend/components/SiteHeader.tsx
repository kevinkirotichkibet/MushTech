'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart';

export default function SiteHeader() {
  const { count } = useCart();
  const path = usePathname();
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="brand" aria-label="MushTech home">
          <span className="brand-mark" aria-hidden="true" />
          MushTech
        </Link>
        <nav aria-label="Main">
          <Link href="/" className={path === '/' ? 'on' : ''}>Shop</Link>
          <Link href="/cart" className={`cart-link ${path === '/cart' ? 'on' : ''}`}>
            Cart
            <span className={`badge ${count ? 'has' : ''}`} aria-label={`${count} items`}>{count}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
