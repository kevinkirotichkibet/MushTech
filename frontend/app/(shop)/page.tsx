import Link from 'next/link';
import { getProducts } from '@/lib/api';
import LandingHero from '@/components/LandingHero';
import ProductCard from '@/components/ProductCard';

// Data comes from the API at request time, never at build time.
export const dynamic = 'force-dynamic';

const TIPS = [
  ['Tear, do not slice', 'Pull oyster clusters apart along the gills. Torn edges brown and crisp far better than cut ones.'],
  ['Hot pan, no oil yet', 'Dry-sear until the water leaves and the edges colour, then add oil or butter.'],
  ['Salt at the end', 'Salt early and they steam. Salt once they are golden and they stay meaty.'],
];

export default async function Home() {
  const products = await getProducts();
  const featured = products.filter((p) => !p.comingSoon && p.pricePerKg > 0).slice(0, 3);

  return (
    <>
      <LandingHero />

      <div className="wrap">
        <section className="about" id="about">
          <figure className="about-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/cluster.webp" alt="Oyster mushrooms growing in a cluster on a tree trunk" loading="lazy" width={683} height={1024} />
          </figure>
          <div className="about-copy">
            <p className="eyebrow">About MushTech</p>
            <h2>Fresh mushrooms, sold by the kilo.</h2>
            <p className="lede-s">Oyster and button mushrooms to start, with more varieties on the way. Pick your weight, place the order, and we prepare it for you.</p>
            <ul className="plain">
              <li>Choose your weight in half-kilo steps.</li>
              <li>Stock on the page is what is on hand right now.</li>
              <li>Orders are prepared once you place them.</li>
            </ul>
            <Link href="/shop" className="btn">Shop the harvest</Link>
          </div>
        </section>

        {featured.length > 0 && (
          <section aria-labelledby="products-title">
            <div className="section-head">
              <h2 id="products-title">Our products</h2>
              <Link href="/shop" className="link">View all products</Link>
            </div>
            <div className="harvest">{featured.map((p) => <ProductCard key={p._id} p={p} />)}</div>
          </section>
        )}

        <section className="kitchen" id="kitchen">
          <figure className="kitchen-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/plate.webp" alt="Roasted oyster mushrooms on a white plate with rosemary" loading="lazy" width={680} height={1019} />
          </figure>
          <div className="kitchen-copy">
            <p className="eyebrow">In the kitchen</p>
            <h2>From the crate to the pan in ten minutes.</h2>
            <ol className="tips">
              {TIPS.map(([t, d], i) => (
                <li key={t}><span className="n">0{i + 1}</span><div><h3>{t}</h3><p>{d}</p></div></li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </>
  );
}
