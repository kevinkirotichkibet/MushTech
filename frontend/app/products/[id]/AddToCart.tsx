'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { money } from '@/lib/format';
import type { Product } from '@/lib/api';
import Stepper from '@/components/Stepper';

export default function AddToCart({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const soldOut = product.stockKg < 0.5;

  return (
    <div>
      <div className="buy">
        <Stepper value={qty} max={Math.max(product.stockKg, 0.5)} onChange={(n) => { setQty(n); setAdded(false); }} />
        <div className="buy-total">
          <span>Total</span>
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
