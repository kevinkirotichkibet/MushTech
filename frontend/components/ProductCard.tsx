import Link from 'next/link';
import type { Product } from '@/lib/api';
import { money } from '@/lib/format';
import { variety } from '@/lib/varieties';
import ProductImage from './ProductImage';

export default function ProductCard({ p }: { p: Product }) {
  const v = variety(p.variety);
  const photo = !!p.imageUrl;
  const out = p.stockKg <= 0;
  const low = !out && p.stockKg <= 10;
  const badges = (
    <div className={`badges ${photo ? '' : 'inline'}`}>
      <span className="chip">{v.label}</span>
      {out && <span className="chip warn">Sold out</span>}
      {low && <span className="chip warn">Only {p.stockKg}&nbsp;kg left</span>}
    </div>
  );
  return (
    <Link href={`/products/${p._id}`} className={`tile ${photo ? '' : 'no-photo'}`}>
      {photo && (
        <div className="tile-art">
          <ProductImage imageUrl={p.imageUrl} alt={p.name} />
          {badges}
        </div>
      )}
      <div className="tile-body">
        {!photo && badges}
        <h3>{p.name}</h3>
        <p>{p.description}</p>
        <div className="tile-foot">
          <span className="price">{money(p.pricePerKg)}<small>/kg</small></span>
          {!low && !out && <span className="stock">{p.stockKg}&nbsp;kg left</span>}
          <span className="go">View <i aria-hidden="true">→</i></span>
        </div>
      </div>
    </Link>
  );
}
