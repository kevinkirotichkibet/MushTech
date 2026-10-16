import { getProduct } from '@/lib/api';
import AddToCart from './AddToCart';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const p = await getProduct(params.id);
  return (
    <div className="card">
      <h1>{p.name}</h1>
      <p>{p.description}</p>
      <p><strong>${p.pricePerKg}/kg</strong> · {p.stockKg} kg available</p>
      <AddToCart product={p} />
    </div>
  );
}
