'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import * as api from '@/lib/api';
import { money } from '@/lib/format';

export default function AccountPage() {
  const { user, token, ready, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<api.Order[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    if (!user || !token) { router.replace('/login?next=/account'); return; }
    api.myOrders(token).then(setOrders).catch((e) => {
      if (e.status === 401) { logout(); router.replace('/login?next=/account'); } else setError(e.message);
    });
  }, [ready, user, token, router, logout]);

  if (!ready || !user) return <p className="page-title">Loading…</p>;

  return (
    <>
      <h1 className="page-title">Hello, {user.name.split(' ')[0]}</h1>
      <p className="meta-line">{user.email}</p>
      <div className="section-head"><h2>Your orders</h2></div>
      {error && <p className="error" role="alert">{error}</p>}
      {orders && orders.length === 0 && <p>No orders yet. <Link href="/" style={{ textDecoration: 'underline' }}>Browse the harvest</Link></p>}
      <div className="orders">
        {orders?.map((o) => (
          <article className="order" key={o._id}>
            <header>
              <span className="ref">{o._id.slice(-8)}</span>
              <span className={`pill ${o.status}`}>{o.status}</span>
              <time>{new Date(o.createdAt).toLocaleDateString()}</time>
            </header>
            <ul>{(o.items ?? []).map((i, n) => <li key={n}>{i.name}, {i.qtyKg} kg <span>{money(i.qtyKg * i.unitPrice)}</span></li>)}</ul>
            <footer>Total <strong>{money(o.total)}</strong></footer>
          </article>
        ))}
      </div>
    </>
  );
}
