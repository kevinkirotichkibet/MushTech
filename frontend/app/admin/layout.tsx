'use client';
import './admin.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: 'M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z' },
  { href: '/admin/orders', label: 'Orders', icon: 'M6 2h12l2 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7zM4 7h16M9 11h6' },
  { href: '/admin/products', label: 'Products', icon: 'M12 3l9 5v8l-9 5-9-5V8zM12 12l9-5M12 12v9M12 12L3 7' },
  { href: '/admin/customers', label: 'Customers', icon: 'M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM4 21a8 8 0 0 1 16 0' },
];
const TITLES: Record<string, string> = { '/admin': 'Dashboard', '/admin/orders': 'Orders', '/admin/products': 'Products', '/admin/customers': 'Customers' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, ready, logout } = useAuth();
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { if (ready && !user) router.replace(`/login?next=${path}`); }, [ready, user, path, router]);

  if (!ready || !user) return <div className="adm-center">Loading…</div>;
  if (user.role !== 'admin') {
    return <div className="adm-center"><p>You do not have access to this area.</p><Link href="/" className="btn">Back to the shop</Link></div>;
  }
  const initials = user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className={`adm ${open ? 'open' : ''}`}>
      <aside className="adm-side" aria-label="Admin navigation">
        <div className="adm-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-mark.png" alt="" width={32} height={32} className="adm-logo" />
          <div><strong>MushTech</strong><span>Admin</span></div>
        </div>
        <nav>
          {NAV.map((n) => {
            const on = n.href === '/admin' ? path === '/admin' : path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={on ? 'on' : ''} aria-current={on ? 'page' : undefined}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={n.icon} /></svg>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/" className="adm-shop">← View shop</Link>
      </aside>
      {open && <button className="adm-scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}
      <div className="adm-main">
        <header className="adm-top">
          <button className="adm-burger" aria-label="Open menu" onClick={() => setOpen(true)}><span /><span /><span /></button>
          <h1>{TITLES[path] ?? 'Admin'}</h1>
          <div className="adm-user">
            <span className="av" aria-hidden="true">{initials}</span>
            <span className="who"><strong>{user.name}</strong><small>Administrator</small></span>
            <button className="adm-out" onClick={() => { logout(); router.replace('/login'); }}>Log out</button>
          </div>
        </header>
        <div className="adm-body">{children}</div>
      </div>
    </div>
  );
}
