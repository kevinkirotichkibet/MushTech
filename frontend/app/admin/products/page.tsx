'use client';
import { useRef, useState } from 'react';
import * as api from '@/lib/api';
import { useAdminData } from '@/lib/useAdminData';
import { variety } from '@/lib/varieties';

const SUGGESTED = ['shiitake', 'portobello', 'king oyster', 'pink oyster', 'blue oyster', 'golden oyster', 'button'];
const EMPTY = { name: '', variety: '', description: '', pricePerKg: 0, stockKg: 0, minG: 250, stepG: 250, imageUrl: '', comingSoon: false };
const MAX_BYTES = 3 * 1024 * 1024;

// returns an error message, or '' when the file is fine
function checkImage(file: File) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return 'Use a JPEG, PNG or WebP image.';
  if (file.size > MAX_BYTES) return 'The image is larger than 3 MB. Resize it and try again.';
  return '';
}

function Thumb({ url, name }: { url?: string; name: string }) {
  if (!url) return <span className="thumb none" aria-hidden="true" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="thumb" src={api.imageSrc(url)} alt={`${name} photo`} width={44} height={44} />;
}

function Row({ p, token, onSaved, onDeleted, onError }: {
  p: api.Product; token: string;
  onSaved: (p: api.Product) => void; onDeleted: (id: string) => void; onError: (m: string) => void;
}) {
  const [price, setPrice] = useState(p.pricePerKg);
  const [stock, setStock] = useState(p.stockKg);
  const [active, setActive] = useState(p.active !== false);
  const [soon, setSoon] = useState(!!p.comingSoon);
  const [minG, setMinG] = useState(Math.round(api.minOf(p) * 1000));
  const [stepG, setStepG] = useState(Math.round(api.stepOf(p) * 1000));
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dirty = price !== p.pricePerKg || stock !== p.stockKg || active !== (p.active !== false) || soon !== !!p.comingSoon ||
    minG !== Math.round(api.minOf(p) * 1000) || stepG !== Math.round(api.stepOf(p) * 1000);

  async function save() {
    if (minG < 50 || stepG < 50) return onError('Minimum order and step must be at least 50 g.');
    try { onSaved(await api.updateProduct(p._id, { pricePerKg: price, stockKg: stock, active, comingSoon: soon, minOrderKg: minG / 1000, stepKg: stepG / 1000 }, token)); }
    catch (e: any) { onError(e.message); }
  }
  async function changePhoto(file?: File) {
    if (!file) return;
    const bad = checkImage(file);
    if (bad) return onError(bad);
    setBusy(true);
    try {
      const { url } = await api.uploadImage(file, token);
      onSaved(await api.updateProduct(p._id, { imageUrl: url }, token));
    } catch (e: any) { onError(e.message); }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  }
  async function remove() {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone. To hide it for now, untick Visible instead.`)) return;
    try { await api.deleteProduct(p._id, token); onDeleted(p._id); }
    catch (e: any) { onError(e.message); }
  }

  return (
    <tr>
      <td>
        <div className="prod-cell">
          <Thumb url={p.imageUrl} name={p.name} />
          <div><strong>{p.name}</strong><br /><small>{variety(p.variety).label}</small></div>
        </div>
      </td>
      <td><input type="number" min={0} step="0.5" value={price} onChange={(e) => setPrice(Number(e.target.value))} aria-label={`${p.name} price per kg`} /></td>
      <td><input type="number" min={0} step="0.05" value={stock} onChange={(e) => setStock(Number(e.target.value))} aria-label={`${p.name} stock in kg`} /></td>
      <td>
        <div className="mini-pair">
          <input type="number" min={50} step={50} value={minG} onChange={(e) => setMinG(Number(e.target.value))} aria-label={`${p.name} smallest order in grams`} />
          <input type="number" min={50} step={50} value={stepG} onChange={(e) => setStepG(Number(e.target.value))} aria-label={`${p.name} order step in grams`} />
        </div>
      </td>
      <td className="c"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} aria-label={`${p.name} visible in shop`} /></td>
      <td className="c"><input type="checkbox" checked={soon} onChange={(e) => setSoon(e.target.checked)} aria-label={`${p.name} coming soon`} /></td>
      <td>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => changePhoto(e.target.files?.[0])} aria-label={`Upload a photo for ${p.name}`} />
        <button className="btn ghost small" type="button" disabled={busy} onClick={() => fileRef.current?.click()}>{busy ? 'Uploading…' : p.imageUrl ? 'Change photo' : 'Add photo'}</button>
      </td>
      <td>
        <div className="row-actions">
          <button className="btn small" disabled={!dirty} onClick={save}>Save</button>
          <button className="link-btn" onClick={remove}>Delete</button>
        </div>
      </td>
    </tr>
  );
}

export default function ProductsPage() {
  const { data, setData, error, setError, loading, token } = useAdminData(api.adminProducts);
  const [np, setNp] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [added, setAdded] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const categories = Array.from(new Set([...(data ?? []).map((p) => p.variety), ...SUGGESTED]));

  async function pickPhoto(file?: File) {
    if (!file) return;
    const bad = checkImage(file);
    if (bad) { setError(bad); return; }
    setUploading(true); setError('');
    try { const { url } = await api.uploadImage(file, token!); setNp((f) => ({ ...f, imageUrl: url })); }
    catch (e: any) { setError(e.message); }
    setUploading(false);
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setAdded('');
    try {
      if (np.minG < 50 || np.stepG < 50) { setError('Minimum order and step must be at least 50 g.'); return; }
      const body = {
        name: np.name.trim(), variety: np.variety.trim().toLowerCase(), description: np.description,
        pricePerKg: np.pricePerKg, stockKg: np.stockKg, minOrderKg: np.minG / 1000, stepKg: np.stepG / 1000,
        imageUrl: np.imageUrl || undefined, comingSoon: np.comingSoon,
      };
      const p = await api.createProduct(body, token!);
      setData((l) => [...(l ?? []), p]);
      setAdded(`${p.name} was added.`);
      setNp(EMPTY);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err: any) { setError(err.message); }
  }

  return (
    <>
      <section className="panel">
        <h2>Products {data && <small>({data.length})</small>}</h2>
        {error && <p className="error" role="alert">{error}</p>}
        {loading && !data && <p>Loading…</p>}
        {data && data.length === 0 && <p className="muted">No products yet. Add your first one below.</p>}
        {data && data.length > 0 && (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Product</th><th>Price / kg (Ksh)</th><th>Stock kg</th><th>Min / step (g)</th><th className="c">Visible</th><th className="c">Coming soon</th><th>Photo</th><th /></tr></thead>
              <tbody>
                {data.map((p) => (
                  <Row key={p._id + p.pricePerKg + p.stockKg + String(p.active) + String(p.comingSoon) + (p.imageUrl ?? '') + (p.minOrderKg ?? '') + (p.stepKg ?? '')} p={p} token={token!}
                    onSaved={(u) => setData((l) => (l ? l.map((x) => (x._id === u._id ? u : x)) : l))}
                    onDeleted={(id) => setData((l) => (l ? l.filter((x) => x._id !== id) : l))}
                    onError={setError} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <form className="panel add" onSubmit={add}>
        <h2>Add a mushroom</h2>
        <div className="form-grid">
          <label>Name<input required value={np.name} onChange={(e) => setNp({ ...np, name: e.target.value })} placeholder="Shiitake Mushrooms" /></label>
          <label>Category
            <input required minLength={2} maxLength={40} list="categories" value={np.variety} onChange={(e) => setNp({ ...np, variety: e.target.value })} placeholder="shiitake" />
            <datalist id="categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          </label>
          <label className="full">Description<input value={np.description} onChange={(e) => setNp({ ...np, description: e.target.value })} placeholder="A short line customers will read" /></label>
          <label>Price per kg (Ksh)<input type="number" min={0} step="0.5" required value={np.pricePerKg} onChange={(e) => setNp({ ...np, pricePerKg: Number(e.target.value) })} /></label>
          <label>Stock (kg)<input type="number" min={0} step="0.05" required value={np.stockKg} onChange={(e) => setNp({ ...np, stockKg: Number(e.target.value) })} /></label>
          <label>Smallest order (g)<input type="number" min={50} step={50} required value={np.minG} onChange={(e) => setNp({ ...np, minG: Number(e.target.value) })} /></label>
          <label>Order step (g)<input type="number" min={50} step={50} required value={np.stepG} onChange={(e) => setNp({ ...np, stepG: Number(e.target.value) })} /></label>
          <div className="full photo-pick">
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => pickPhoto(e.target.files?.[0])} aria-label="Upload a photo" />
            <Thumb url={np.imageUrl} name={np.name || 'New product'} />
            <button className="btn ghost small" type="button" disabled={uploading} onClick={() => fileRef.current?.click()}>{uploading ? 'Uploading…' : np.imageUrl ? 'Change photo' : 'Upload photo'}</button>
            <span className="hint">JPEG, PNG or WebP, up to 3 MB. Optional.</span>
          </div>
          <label className="check full"><input type="checkbox" checked={np.comingSoon} onChange={(e) => setNp({ ...np, comingSoon: e.target.checked })} /> Show as coming soon (cannot be ordered yet)</label>
        </div>
        <button className="btn" disabled={uploading}>Add mushroom</button>
        {added && <p className="added" role="status">{added}</p>}
      </form>
    </>
  );
}
