import type { CSSProperties } from 'react';
import Link from 'next/link';
import { getProduct } from '@/lib/api';
import { money } from '@/lib/format';
import { variety } from '@/lib/varieties';
import ProductImage from '@/components/ProductImage';
import AddToCart from './AddToCart';
import CareGuide from '@/components/CareGuide';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const p = await getProduct(params.id);
  const v = variety(p.variety);
  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Shop</Link><span aria-hidden="true">/</span><span>{p.name}</span>
      </nav>
      <div className="product" style={{ '--tint': v.tint } as CSSProperties}>
        <div className={`product-art ${p.imageUrl ? 'has-photo' : ''}`}><ProductImage imageUrl={p.imageUrl} variety={p.variety} alt={`${p.name} mushrooms`} /></div>
        <div className="product-info">
          <span className="eyebrow">{v.label} oyster</span>
          <h1>{p.name}</h1>
          <p className="desc">{p.description}</p>
          <dl className="specs">
            <div><dt>Price</dt><dd>{money(p.pricePerKg)} per kg</dd></div>
            <div><dt>Available</dt><dd>{p.stockKg} kg</dd></div>
            <div><dt>Sold by</dt><dd>The kilo, in half-kilo steps</dd></div>
          </dl>
          <AddToCart product={p} />
        </div>
      </div>
      <CareGuide variety={p.variety} name={p.name} />
    </>
  );
}
