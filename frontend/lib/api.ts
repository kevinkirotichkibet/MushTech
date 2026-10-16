const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
// On the server (inside Docker) call the API via its service name; in the browser use the published port.
const API = typeof window === 'undefined' ? process.env.API_INTERNAL_URL || PUBLIC_API : PUBLIC_API;

export type Product = {
  _id: string; name: string; variety: string; description?: string;
  pricePerKg: number; stockKg: number; imageUrl?: string;
};

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API}/products`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load products');
  return res.json();
}
export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`${API}/products/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}
export async function placeOrder(body: unknown) {
  const res = await fetch(`${API}/orders`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Order failed');
  return res.json();
}
