'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { money, weight } from '@/lib/format';
import { minOf, stepOf, type Product } from '@/lib/api';
import Stepper from '@/components/Stepper';

export default function AddToCart({ product }: { product: Product }) {
  const min = minOf(product);
  const step = stepOf(product);
  const maxQty = Math.floor(product.stockKg / step + 1e-9) * step;
  const soldOut = maxQty < min;
  const [qty, setQty] = useState(min);
  const [added, setAdded] = useState(false);
  const { add } = useCart();

  return (
    <div>
      <div className="buy">
        <Stepper value={qty} min={min} max={Math.max(maxQty, min)} step={step} onChange={(n) => { setQty(n); setAdded(false); }} />
        <div className="buy-total">
          <span>Total for {weight(qty)}</span>
          <strong>{money(qty * product.pricePerKg)}</strong>
        </div>
      </div>
      <div style={{ marginTop: 'var(--s-5)' }}>
        <button className="btn" disabled={soldOut} onClick={() => { add(product, qty); setAdded(true); }}>
          {soldOut ? 'Sold out' : 'Add to cart'}
        </button>
      </div>
      {added && (
        <p className="added" role="status">
          Added to your cart. <Link href="/cart" className="link-btn" style={{ color: 'inherit' }}>View cart</Link>
        </p>
      )}
    </div>
  );
}
