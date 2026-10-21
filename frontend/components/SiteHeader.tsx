'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';

export default function SiteHeader() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const path = usePathname();
  const on = (p: string) => (path === p ? 'on' : '');
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="brand" aria-label="MushTech home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-mark.png" alt="" width={32} height={32} className="brand-img" />
          MushTech
        </Link>
        <nav aria-label="Main">
          <Link href="/" className={on('/')}>Shop</Link>
          <Link href="/cart" className={`cart-link ${on('/cart')}`} aria-label={count ? `Cart, ${count} ${count === 1 ? 'item' : 'items'}` : 'Cart'}>
            Cart
            {count > 0 && <span className="badge" aria-hidden="true">{count}</span>}
          </Link>
          {user && (
            <>
              {user.role === 'admin' && <Link href="/admin">Dashboard</Link>}
              <Link href="/account" className={on('/account')}>Account</Link>
              <button className="nav-btn" onClick={logout}>Log out</button>
            </>
          )}
          {!user && <Link href="/login" className={on('/login')}>Log in</Link>}
        </nav>
      </div>
    </header>
  );
}
