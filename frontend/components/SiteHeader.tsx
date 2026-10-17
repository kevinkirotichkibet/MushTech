'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';

export default function SiteHeader() {
  const { count } = useCart();
  const { user, ready, logout } = useAuth();
  const path = usePathname();
  const on = (p: string) => (path === p ? 'on' : '');
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="brand" aria-label="MushTech home">
          <span className="brand-mark" aria-hidden="true" />
          MushTech
        </Link>
        <nav aria-label="Main">
          <Link href="/" className={on('/')}>Shop</Link>
          <Link href="/cart" className={`cart-link ${on('/cart')}`}>
            Cart
            <span className={`badge ${count ? 'has' : ''}`} aria-label={`${count} items`}>{count}</span>
          </Link>
          {ready && user && (
            <>
              {user.role === 'admin' && <Link href="/admin" className={on('/admin')}>Admin</Link>}
              <Link href="/account" className={on('/account')}>{user.name.split(' ')[0]}</Link>
              <button className="nav-btn" onClick={logout}>Log out</button>
            </>
          )}
          {ready && !user && <Link href="/login" className={on('/login')}>Log in</Link>}
        </nav>
      </div>
    </header>
  );
}
