import Link from 'next/link';
import { getProducts } from '@/lib/api';

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      <h1>Fresh Oyster Mushrooms</h1>
      <div className="grid">
        {products.map((p) => (
          <div className="card" key={p._id}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p><strong>${p.pricePerKg}/kg</strong> · {p.stockKg} kg left</p>
            <Link href={`/products/${p._id}`}><button>View</button></Link>
          </div>
        ))}
      </div>
    </>
  );
}
