'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import type { Product } from '@/lib/api';

export default function AddToCart({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const router = useRouter();
  return (
    <div>
      <label>Quantity (kg)
        <input type="number" min={0.5} step={0.5} max={product.stockKg} value={qty}
          onChange={(e) => setQty(Number(e.target.value))} />
      </label>
      <button disabled={product.stockKg <= 0} onClick={() => { add(product, qty); router.push('/cart'); }}>
        Add to cart
      </button>
    </div>
  );
}
