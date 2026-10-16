'use client';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { placeOrder } from '@/lib/api';

export default function CartPage() {
  const { lines, remove, clear, total } = useCart();
  const [form, setForm] = useState({ customerName: '', phone: '', address: '' });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true); setMsg('');
    try {
      const order = await placeOrder({
        ...form,
        items: lines.map((l) => ({ productId: l.product._id, qtyKg: l.qtyKg })),
      });
      clear();
      setMsg(`Order placed! Reference: ${order._id}`);
    } catch (e: any) { setMsg(e.message); }
    setBusy(false);
  }

  return (
    <>
      <h1>Your Cart</h1>
      {lines.length === 0 && <p>{msg || 'Cart is empty.'}</p>}
      {lines.map((l) => (
        <div className="card" key={l.product._id} style={{ marginBottom: 8 }}>
          {l.product.name} — {l.qtyKg} kg × ${l.product.pricePerKg} = ${(l.qtyKg * l.product.pricePerKg).toFixed(2)}{' '}
          <button onClick={() => remove(l.product._id)}>Remove</button>
        </div>
      ))}
      {lines.length > 0 && (
        <div className="card">
          <h3>Total: ${total.toFixed(2)}</h3>
          <input placeholder="Full name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <textarea placeholder="Delivery address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <button disabled={busy || !form.customerName || !form.phone || !form.address} onClick={submit}>
            {busy ? 'Placing…' : 'Place order'}
          </button>
          {msg && <p>{msg}</p>}
        </div>
      )}
    </>
  );
}
