'use client';
import { useState } from 'react';
import * as api from '@/lib/api';
import { useAdminData } from '@/lib/useAdminData';

const VARIETIES = ['oyster', 'button', 'pink', 'blue', 'grey', 'golden', 'king'];
const EMPTY = { name: '', variety: 'oyster', description: '', pricePerKg: 0, stockKg: 0, imageUrl: '', comingSoon: false };

function Row({ p, token, onSaved, onError }: { p: api.Product; token: string; onSaved: (p: api.Product) => void; onError: (m: string) => void }) {
  const [price, setPrice] = useState(p.pricePerKg);
  const [stock, setStock] = useState(p.stockKg);
  const [active, setActive] = useState(p.active !== false);
  const [soon, setSoon] = useState(!!p.comingSoon);
  const dirty = price !== p.pricePerKg || stock !== p.stockKg || active !== (p.active !== false) || soon !== !!p.comingSoon;
  async function save() {
    try { onSaved(await api.updateProduct(p._id, { pricePerKg: price, stockKg: stock, active, comingSoon: soon }, token)); }
    catch (e: any) { onError(e.message); }
  }
  return (
    <tr>
      <td><strong>{p.name}</strong><br /><small>{p.variety}</small></td>
      <td><input type="number" min={0} step="0.5" value={price} onChange={(e) => setPrice(Number(e.target.value))} aria-label={`${p.name} price per kg`} /></td>
      <td><input type="number" min={0} step="0.5" value={stock} onChange={(e) => setStock(Number(e.target.value))} aria-label={`${p.name} stock in kg`} /></td>
      <td className="c"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} aria-label={`${p.name} visible in shop`} /></td>
      <td className="c"><input type="checkbox" checked={soon} onChange={(e) => setSoon(e.target.checked)} aria-label={`${p.name} coming soon`} /></td>
      <td><button className="btn small" disabled={!dirty} onClick={save}>Save</button></td>
    </tr>
  );
}

export default function ProductsPage() {
  const { data, setData, error, setError, loading, token } = useAdminData(api.adminProducts);
  const [np, setNp] = useState(EMPTY);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    try {
      const p = await api.createProduct({ ...np, imageUrl: np.imageUrl || undefined }, token!);
      setData((l) => [...(l ?? []), p]);
      setNp(EMPTY);
    } catch (err: any) { setError(err.message); }
  }

  return (
    <>
      <section className="panel">
        <h2>Products {data && <small>({data.length})</small>}</h2>
        {error && <p className="error" role="alert">{error}</p>}
        {loading && !data && <p>Loading…</p>}
        {data && (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Product</th><th>Price / kg</th><th>Stock kg</th><th className="c">Visible</th><th className="c">Coming soon</th><th /></tr></thead>
              <tbody>
                {data.map((p) => (
                  <Row key={p._id + p.pricePerKg + p.stockKg + String(p.active) + String(p.comingSoon)} p={p} token={token!}
                    onSaved={(u) => setData((l) => (l ? l.map((x) => (x._id === u._id ? u : x)) : l))} onError={setError} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <form className="panel add" onSubmit={add}>
        <h2>Add a product</h2>
        <div className="form-grid">
          <label>Name<input required value={np.name} onChange={(e) => setNp({ ...np, name: e.target.value })} /></label>
          <label>Type<select value={np.variety} onChange={(e) => setNp({ ...np, variety: e.target.value })}>{VARIETIES.map((v) => <option key={v}>{v}</option>)}</select></label>
          <label className="full">Description<input value={np.description} onChange={(e) => setNp({ ...np, description: e.target.value })} /></label>
          <label>Price per kg<input type="number" min={0} step="0.5" required value={np.pricePerKg} onChange={(e) => setNp({ ...np, pricePerKg: Number(e.target.value) })} /></label>
          <label>Stock (kg)<input type="number" min={0} step="0.5" required value={np.stockKg} onChange={(e) => setNp({ ...np, stockKg: Number(e.target.value) })} /></label>
          <label className="full">Photo path (optional)<input placeholder="/images/yourfile.webp" value={np.imageUrl} onChange={(e) => setNp({ ...np, imageUrl: e.target.value })} /></label>
          <label className="check full"><input type="checkbox" checked={np.comingSoon} onChange={(e) => setNp({ ...np, comingSoon: e.target.checked })} /> Show as coming soon (cannot be ordered)</label>
        </div>
        <button className="btn">Add product</button>
      </form>
    </>
  );
}
