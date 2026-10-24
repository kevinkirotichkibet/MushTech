'use client';
import { useMemo, useState } from 'react';
import type { Product } from '@/lib/api';
import { variety } from '@/lib/varieties';
import ProductCard from './ProductCard';

const SORTS = [
  ['featured', 'Featured'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
  ['name', 'Name: A to Z'],
  ['stock', 'Most in stock'],
] as const;

const isLive = (p: Product) => !p.comingSoon && p.pricePerKg > 0;

function sortList(list: Product[], sort: string) {
  const l = [...list];
  if (sort === 'price-asc') l.sort((a, b) => a.pricePerKg - b.pricePerKg);
  if (sort === 'price-desc') l.sort((a, b) => b.pricePerKg - a.pricePerKg);
  if (sort === 'name') l.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'stock') l.sort((a, b) => b.stockKg - a.stockKg);
  return l;
}

export default function ProductBrowser({ products }: { products: Product[] }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('featured');

  const cats = useMemo(() => {
    const seen = new Map<string, string>();
    products.forEach((p) => seen.set(p.variety, variety(p.variety).label));
    return [...seen.entries()];
  }, [products]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (cat === 'all' || p.variety === cat) &&
        (!term || `${p.name} ${p.description ?? ''} ${variety(p.variety).label}`.toLowerCase().includes(term)),
    );
  }, [products, q, cat]);

  const live = sortList(filtered.filter(isLive), sort);
  const soon = filtered.filter((p) => !isLive(p));

  return (
    <>
      <form className="searchbar" role="search" onSubmit={(e) => e.preventDefault()}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input type="search" name="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search mushrooms…" aria-label="Search mushrooms" autoComplete="off" spellCheck={false} />
        <button className="btn small" type="submit">Search</button>
      </form>

      <div className="filter">
        <p className="filter-label">Filter by category</p>
        <div className="chips-row" role="group" aria-label="Categories">
          <button type="button" className="chip-btn" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>All products</button>
          {cats.map(([key, label]) => (
            <button key={key} type="button" className="chip-btn" aria-pressed={cat === key} onClick={() => setCat(key)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="shop-head">
        <div>
          <h1>{cat === 'all' ? 'All products' : variety(cat).label}</h1>
          <p className="count" aria-live="polite">{live.length} {live.length === 1 ? 'product' : 'products'} available</p>
        </div>
        <label className="sort">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
        </label>
      </div>

      {live.length > 0 && <div className="harvest">{live.map((p) => <ProductCard key={p._id} p={p} />)}</div>}

      {soon.length > 0 && (
        <section aria-labelledby="soon-title">
          <div className="section-head">
            <h2 id="soon-title">Coming soon</h2>
            <p>Not available to order yet</p>
          </div>
          <ul className="soon">
            {soon.map((p) => (
              <li key={p._id}>
                <div><h3>{p.name}</h3><p>{p.description}</p></div>
                <button className="btn ghost small" disabled>Coming soon</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {live.length === 0 && soon.length === 0 && (
        <div className="empty">
          <p>No products match your search.</p>
          <button className="btn ghost" onClick={() => { setQ(''); setCat('all'); }}>Clear filters</button>
        </div>
      )}
    </>
  );
}
