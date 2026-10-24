import type { CSSProperties } from 'react';
import Link from 'next/link';
import { getProduct } from '@/lib/api';
import { money } from '@/lib/format';
import { variety } from '@/lib/varieties';
import ProductImage from '@/components/ProductImage';
import AddToCart from './AddToCart';
import CareGuide from '@/components/CareGuide';

// Data comes from the API at request time, never at build time.
export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const p = await getProduct(params.id);
  const v = variety(p.variety);
  const photo = !!p.imageUrl;
  const soon = p.comingSoon || p.pricePerKg <= 0;
  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/shop">Shop</Link><span aria-hidden="true">/</span><span>{p.name}</span>
      </nav>
      <div className={`product ${photo ? '' : 'no-art'}`} style={{ '--tint': v.tint } as CSSProperties}>
        {photo && <div className="product-art has-photo"><ProductImage imageUrl={p.imageUrl} alt={p.name} /></div>}
        <div className="product-info">
          <span className="eyebrow">{v.label}{soon ? ' · Coming soon' : ''}</span>
          <h1>{p.name}</h1>
          <p className="desc">{p.description}</p>
          {soon ? (
            <div className="buy" style={{ marginTop: 'var(--s-5)' }}>
              <button className="btn" disabled>Coming soon</button>
            </div>
          ) : (
            <>
              <dl className="specs">
                <div><dt>Price</dt><dd>{money(p.pricePerKg)} per kg</dd></div>
                <div><dt>Available</dt><dd>{p.stockKg} kg</dd></div>
                <div><dt>Sold by</dt><dd>The kilo, in half-kilo steps</dd></div>
              </dl>
              <AddToCart product={p} />
            </>
          )}
        </div>
      </div>
      {!soon && <CareGuide variety={p.variety} name={p.name} />}
    </>
  );
}
