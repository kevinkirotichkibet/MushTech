'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import * as api from '@/lib/api';
import { money } from '@/lib/format';

const STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled'];
const VARIETIES = ['pink', 'blue', 'grey', 'golden', 'king'];

function ProductRow({ p, token, onSaved, onError }: { p: api.Product; token: string; onSaved: (p: api.Product) => void; onError: (m: string) => void }) {
  const [price, setPrice] = useState(p.pricePerKg);
  const [stock, setStock] = useState(p.stockKg);
  const [active, setActive] = useState(p.active !== false);
  const dirty = price !== p.pricePerKg || stock !== p.stockKg || active !== (p.active !== false);
  async function save() {
    try { onSaved(await api.updateProduct(p._id, { pricePerKg: price, stockKg: stock, active }, token)); }
    catch (e: any) { onError(e.message); }
  }
  return (
    <tr>
      <td>{p.name}</td>
      <td><input type="number" min={0} step="0.5" value={price} onChange={(e) => setPrice(Number(e.target.value))} aria-label={`${p.name} price per kg`} /></td>
      <td><input type="number" min={0} step="0.5" value={stock} onChange={(e) => setStock(Number(e.target.value))} aria-label={`${p.name} stock in kg`} /></td>
      <td><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} aria-label={`${p.name} visible in shop`} /></td>
      <td><button className="btn small" disabled={!dirty} onClick={save}>Save</button></td>
    </tr>
  );
}

export default function AdminPage() {
  const { user, token, ready, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'orders' | 'products'>('orders');
  const [orders, setOrders] = useState<api.Order[]>([]);
  const [products, setProducts] = useState<api.Product[]>([]);
  const [error, setError] = useState('');
  const [np, setNp] = useState({ name: '', variety: 'grey', description: '', pricePerKg: 0, stockKg: 0, imageUrl: '' });

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const [o, p] = await Promise.all([api.allOrders(token), api.adminProducts(token)]);
      setOrders(o); setProducts(p); setError('');
    } catch (e: any) {
      if (e.status === 401) { logout(); router.replace('/login?next=/admin'); } else setError(e.message);
    }
  }, [token, logout, router]);

  useEffect(() => {
    if (!ready) return;
    if (!user) { router.replace('/login?next=/admin'); return; }
    if (user.role === 'admin') load();
  }, [ready, user, load, router]);

  if (!ready || !user) return <p className="page-title">Loading…</p>;
  if (user.role !== 'admin') return <p className="page-title">Not authorised.</p>;

  async function status(id: string, s: string) {
    try { const o = await api.setOrderStatus(id, s, token!); setOrders((l) => l.map((x) => (x._id === id ? o : x))); }
    catch (e: any) { setError(e.message); }
  }
  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    try {
      const body = { ...np, imageUrl: np.imageUrl || undefined };
      const p = await api.createProduct(body, token!);
      setProducts((l) => [...l, p]);
      setNp({ name: '', variety: 'grey', description: '', pricePerKg: 0, stockKg: 0, imageUrl: '' });
    } catch (e: any) { setError(e.message); }
  }

  return (
    <>
      <h1 className="page-title">Admin</h1>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'orders'} onClick={() => setTab('orders')}>Orders ({orders.length})</button>
        <button role="tab" aria-selected={tab === 'products'} onClick={() => setTab('products')}>Products ({products.length})</button>
      </div>
      {error && <p className="error" role="alert">{error}</p>}

      {tab === 'orders' && (
        <div className="orders">
          {orders.length === 0 && <p>No orders yet.</p>}
          {orders.map((o) => (
            <article className="order" key={o._id}>
              <header>
                <span className="ref">{o._id.slice(-8)}</span>
                <select value={o.status} onChange={(e) => status(o._id, e.target.value)} aria-label="Order status">
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <time>{new Date(o.createdAt).toLocaleString()}</time>
              </header>
              <p className="cust"><strong>{o.customerName}</strong> · {o.phone}<br />{o.address}</p>
              <ul>{o.items.map((i, n) => <li key={n}>{i.name}, {i.qtyKg} kg <span>{money(i.qtyKg * i.unitPrice)}</span></li>)}</ul>
              <footer>Total <strong>{money(o.total)}</strong></footer>
            </article>
          ))}
        </div>
      )}

      {tab === 'products' && (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Product</th><th>Price / kg</th><th>Stock kg</th><th>Visible</th><th /></tr></thead>
              <tbody>
                {products.map((p) => (
                  <ProductRow key={p._id + p.pricePerKg + p.stockKg + String(p.active)} p={p} token={token!}
                    onSaved={(u) => setProducts((l) => l.map((x) => (x._id === u._id ? u : x)))} onError={setError} />
                ))}
              </tbody>
            </table>
          </div>
          <form className="summary add-product" onSubmit={addProduct}>
            <h2>Add a product</h2>
            <div className="field"><label htmlFor="an">Name</label><input id="an" required value={np.name} onChange={(e) => setNp({ ...np, name: e.target.value })} /></div>
            <div className="field"><label htmlFor="av">Variety</label>
              <select id="av" value={np.variety} onChange={(e) => setNp({ ...np, variety: e.target.value })}>{VARIETIES.map((v) => <option key={v}>{v}</option>)}</select></div>
            <div className="field"><label htmlFor="ad">Description</label><input id="ad" value={np.description} onChange={(e) => setNp({ ...np, description: e.target.value })} /></div>
            <div className="field"><label htmlFor="ap">Price per kg</label><input id="ap" type="number" min={0} step="0.5" required value={np.pricePerKg} onChange={(e) => setNp({ ...np, pricePerKg: Number(e.target.value) })} /></div>
            <div className="field"><label htmlFor="as">Stock (kg)</label><input id="as" type="number" min={0} step="0.5" required value={np.stockKg} onChange={(e) => setNp({ ...np, stockKg: Number(e.target.value) })} /></div>
            <div className="field"><label htmlFor="ai">Image path (optional)</label><input id="ai" placeholder="/images/yourfile.webp" value={np.imageUrl} onChange={(e) => setNp({ ...np, imageUrl: e.target.value })} /></div>
            <button className="btn">Add product</button>
          </form>
        </>
      )}
    </>
  );
}
