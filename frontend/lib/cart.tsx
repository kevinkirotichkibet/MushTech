'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Product } from './api';

export type CartLine = { product: Product; qtyKg: number };
type Ctx = {
  lines: CartLine[]; add: (p: Product, qty: number) => void;
  remove: (id: string) => void; clear: () => void; total: number;
};
const CartCtx = createContext<Ctx>(null!);
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  useEffect(() => { try { setLines(JSON.parse(localStorage.getItem('cart') || '[]')); } catch {} }, []);
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(lines)); }, [lines]);

  const add = (product: Product, qty: number) =>
    setLines((l) => {
      const ex = l.find((x) => x.product._id === product._id);
      return ex ? l.map((x) => (x === ex ? { ...x, qtyKg: x.qtyKg + qty } : x)) : [...l, { product, qtyKg: qty }];
    });
  const remove = (id: string) => setLines((l) => l.filter((x) => x.product._id !== id));
  const clear = () => setLines([]);
  const total = lines.reduce((s, x) => s + x.qtyKg * x.product.pricePerKg, 0);
  return <CartCtx.Provider value={{ lines, add, remove, clear, total }}>{children}</CartCtx.Provider>;
}
