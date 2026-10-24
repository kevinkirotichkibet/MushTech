import type { Metadata } from 'next';
import { getProducts } from '@/lib/api';
import ProductBrowser from '@/components/ProductBrowser';

export const metadata: Metadata = { title: 'Shop | MushTech' };
// Data comes from the API at request time, never at build time.
export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await getProducts();
  return <ProductBrowser products={products} />;
}
