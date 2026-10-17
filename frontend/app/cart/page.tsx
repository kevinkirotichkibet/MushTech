'use client';
import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { placeOrder } from '@/lib/api';
import { money } from '@/lib/format';
import { variety } from '@/lib/varieties';
import ProductImage from '@/components/ProductImage';
import Stepper from '@/components/Stepper';

export default function CartPage() {
  const { lines, setQty, remove, clear, total } = useCart();
  const { user, token, ready, logout } = useAuth();
  const [form, setForm] = useState({ customerName: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => { if (user) setForm((f) => (f.customerName ? f : { ...f, customerName: user.name })); }, [user]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setBusy(true); setError('');
    try {
      const order = await placeOrder({
        ...form,
        items: lines.map((l) => ({ productId: l.product._id, qtyKg: l.qtyKg })),
      }, token);
      clear();
      setOrderId(order._id);
    } catch (err: any) {
      if (err.status === 401) { logout(); setError('Your session expired. Please log in again.'); }
      else setError(err.message || 'Something went wrong. Please try again.');
    }
    setBusy(false);
  }

  if (orderId) {
    return (
      <section className="done">
        <h1 className="page-title" style={{ padding: 0 }}>Order received.</h1>
        <p>Thank you. We will contact you on the phone number you gave to confirm delivery.</p>
        <span className="eyebrow">Reference</span>
        <span className="ref">{orderId}</span>
        <Link href="/" className="btn">Back to the shop</Link>
      </section>
    );
  }

  if (lines.length === 0) {
    return (
      <section className="empty">
        <h1 className="page-title" style={{ padding: 0 }}>Your cart is empty.</h1>
        <p>Choose a variety and a weight, and it will show up here.</p>
        <Link href="/" className="btn">Browse the harvest</Link>
      </section>
    );
  }

  return (
    <>
      <h1 className="page-title">Your cart</h1>
      <div className="cart">
        <div className="lines">
          {lines.map((l) => {
            const v = variety(l.product.variety);
            return (
              <div className="line" key={l.product._id} style={{ '--tint': v.tint } as CSSProperties}>
                <div className="line-art"><ProductImage imageUrl={l.product.imageUrl} variety={l.product.variety} alt="" /></div>
                <div>
                  <h3>{l.product.name}</h3>
                  <p className="meta">{money(l.product.pricePerKg)} per kg</p>
                  <div className="line-row">
                    <Stepper value={l.qtyKg} max={l.product.stockKg} onChange={(n) => setQty(l.product._id, n)} label={`Kilograms of ${l.product.name}`} />
                    <button className="link-btn" onClick={() => remove(l.product._id)}>Remove</button>
                    <span className="line-sum">{money(l.qtyKg * l.product.pricePerKg)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {ready && !user ? (
          <div className="summary">
            <h2>Log in to order</h2>
            <p style={{ color: 'var(--ink-2)', marginBottom: 'var(--s-4)' }}>Your cart is saved. Log in or create an account to place the order.</p>
            <div className="total-row"><span>Total</span><strong>{money(total)}</strong></div>
            <Link href="/login?next=/cart" className="btn" style={{ width: '100%' }}>Log in</Link>
            <p className="auth-alt" style={{ marginTop: 'var(--s-3)' }}>New here? <Link href="/register?next=/cart">Create an account</Link></p>
          </div>
        ) : (
        <form className="summary" onSubmit={submit}>
          <h2>Delivery</h2>
          <div className="field"><label htmlFor="n">Full name</label><input id="n" required value={form.customerName} onChange={set('customerName')} autoComplete="name" /></div>
          <div className="field"><label htmlFor="p">Phone</label><input id="p" required type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" /></div>
          <div className="field"><label htmlFor="a">Delivery address</label><textarea id="a" required value={form.address} onChange={set('address')} autoComplete="street-address" /></div>
          <div className="total-row"><span>Total</span><strong>{money(total)}</strong></div>
          <button className="btn" style={{ width: '100%' }} disabled={busy || !ready}>{busy ? 'Placing order…' : 'Place order'}</button>
          {error && <p className="error" role="alert">{error}</p>}
        </form>
        )}
      </div>
    </>
  );
}
