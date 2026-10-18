import type { CSSProperties } from 'react';
import Link from 'next/link';
import { getProducts } from '@/lib/api';
import { money } from '@/lib/format';
import { variety } from '@/lib/varieties';
import ProductImage from '@/components/ProductImage';

// Data comes from the API at request time, never at build time.
export const dynamic = 'force-dynamic';

const SPANS = [7, 5, 5, 7, 12]; // asymmetric rhythm, repeats

const TIPS = [
  ['Tear, do not slice', 'Pull oyster clusters apart along the gills. Torn edges brown and crisp far better than cut ones.'],
  ['Hot pan, no oil yet', 'Dry-sear until the water leaves and the edges colour, then add oil or butter.'],
  ['Salt at the end', 'Salt early and they steam. Salt once they are golden and they stay meaty.'],
];

export default async function Home() {
  const products = await getProducts();
  const available = products.filter((p) => !p.comingSoon);
  const soon = products.filter((p) => p.comingSoon);
  const totalKg = available.reduce((s, p) => s + p.stockKg, 0);
  const cheapest = available.length ? Math.min(...available.map((p) => p.pricePerKg)) : 0;
  const maxStock = Math.max(1, ...available.map((p) => p.stockKg));

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Fresh mushrooms, by the kilo</p>
          <h1>Weighed to <em>order</em>, not to shelf.</h1>
          <p className="lede">Pick a mushroom, choose your kilos, and we prepare the order. The stock shown below is what is on hand right now.</p>
          <a href="#harvest" className="btn">Browse the harvest</a>
          <dl className="stats">
            <div><dd>{available.length}</dd><dt>available now</dt></div>
            <div><dd>{totalKg}</dd><dt>kg in stock</dt></div>
            {available.length > 0 && <div><dd>{money(cheapest)}</dd><dt>per kg, from</dt></div>}
            {soon.length > 0 && <div><dd>{soon.length}</dd><dt>coming soon</dt></div>}
          </dl>
        </div>
        <figure className="hero-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero.webp" alt="A cluster of fresh white oyster mushrooms held in two hands" width={1200} height={628} fetchPriority="high" />
          <figcaption>Fresh clusters, sold whole</figcaption>
        </figure>
      </section>

      <div className="section-head" id="harvest">
        <h2>The harvest</h2>
        <p>Prices per kilogram</p>
      </div>

      <div className="harvest">
        {available.map((p, i) => {
          const span = SPANS[i % SPANS.length];
          const v = variety(p.variety);
          const photo = !!p.imageUrl;
          return (
            <Link
              key={p._id}
              href={`/products/${p._id}`}
              className={`tile span-${span} rise ${photo ? '' : 'no-photo'}`}
              style={{ '--tint': v.tint, '--i': i } as CSSProperties}
            >
              {photo && <div className="tile-art has-photo"><ProductImage imageUrl={p.imageUrl} alt={`${p.name}`} /></div>}
              <div className="tile-body">
                <span className="eyebrow">{v.label}</span>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <div className="meter" aria-hidden="true">
                  <span style={{ width: `${Math.max(6, (p.stockKg / maxStock) * 100)}%` }} />
                </div>
                <div className="tile-foot">
                  <span className="price">{money(p.pricePerKg)}<small>/kg</small></span>
                  <span className="stock">{p.stockKg} kg left</span>
                  <span className="go">View <i>→</i></span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {soon.length > 0 && (
        <section aria-labelledby="soon-title">
          <div className="section-head">
            <h2 id="soon-title">Coming soon</h2>
            <p>Not available to order yet</p>
          </div>
          <ul className="soon">
            {soon.map((p) => (
              <li key={p._id}>
                <div>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                </div>
                <button className="btn" disabled>Coming soon</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="kitchen">
        <div className="kitchen-photos" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="k1" src="/images/plate.webp" alt="" loading="lazy" width={680} height={1019} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="k2" src="/images/cluster.webp" alt="" loading="lazy" width={683} height={1024} />
        </div>
        <div className="kitchen-copy">
          <p className="eyebrow">In the kitchen</p>
          <h2>From the cluster to the pan in ten minutes.</h2>
          <ol className="tips">
            {TIPS.map(([t, d], i) => (
              <li key={t}><span className="n">0{i + 1}</span><div><h3>{t}</h3><p>{d}</p></div></li>
            ))}
          </ol>
          <a href="#harvest" className="btn ghost">Order a kilo</a>
        </div>
      </section>
    </>
  );
}
