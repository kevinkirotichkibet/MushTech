'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Product } from './api';

export type CartLine = { product: Product; qtyKg: number };
type Ctx = {
  lines: CartLine[];
  add: (p: Product, qty: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: number;
  count: number;
};
const CartCtx = createContext<Ctx>(null!);
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setLines(JSON.parse(localStorage.getItem('cart') || '[]')); } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem('cart', JSON.stringify(lines));
  }, [lines, ready]);

  const clamp = (p: Product, q: number) => Math.min(Math.max(q, 0.5), p.stockKg);
  const add = (product: Product, qty: number) =>
    setLines((l) => {
      const ex = l.find((x) => x.product._id === product._id);
      return ex
        ? l.map((x) => (x === ex ? { ...x, qtyKg: clamp(product, x.qtyKg + qty) } : x))
        : [...l, { product, qtyKg: clamp(product, qty) }];
    });
  const setQty = (id: string, qty: number) =>
    setLines((l) => l.map((x) => (x.product._id === id ? { ...x, qtyKg: clamp(x.product, qty) } : x)));
  const remove = (id: string) => setLines((l) => l.filter((x) => x.product._id !== id));
  const clear = () => setLines([]);
  const total = lines.reduce((s, x) => s + x.qtyKg * x.product.pricePerKg, 0);

  return (
    <CartCtx.Provider value={{ lines, add, setQty, remove, clear, total, count: lines.length }}>
      {children}
    </CartCtx.Provider>
  );
}
