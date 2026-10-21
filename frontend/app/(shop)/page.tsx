import Link from 'next/link';
import { getProducts } from '@/lib/api';
import { money } from '@/lib/format';
import { variety } from '@/lib/varieties';
import ProductImage from '@/components/ProductImage';

// Data comes from the API at request time, never at build time.
export const dynamic = 'force-dynamic';

const TIPS = [
  ['Tear, do not slice', 'Pull oyster clusters apart along the gills. Torn edges brown and crisp far better than cut ones.'],
  ['Hot pan, no oil yet', 'Dry-sear until the water leaves and the edges colour, then add oil or butter.'],
  ['Salt at the end', 'Salt early and they steam. Salt once they are golden and they stay meaty.'],
];

export default async function Home() {
  const products = await getProducts();
  // a product is on sale only when it is not flagged "coming soon" and has a price
  const live = (p: (typeof products)[number]) => !p.comingSoon && p.pricePerKg > 0;
  const available = products.filter(live);
  const soon = products.filter((p) => !live(p));
  const totalKg = available.reduce((s, p) => s + p.stockKg, 0);

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Fresh mushrooms, by the kilo</p>
          <h1>Weighed to order, never shelved.</h1>
          <p className="lede">Oyster and button mushrooms. Choose your weight and we prepare the order.</p>
          <div className="hero-cta">
            <a href="#harvest" className="btn">Shop the harvest</a>
            <a href="#kitchen" className="link">How to cook them</a>
          </div>
          <p className="meta">
            <span>{available.length}&nbsp;available</span>
            <span>{totalKg}&nbsp;kg in stock</span>
            {soon.length > 0 && <span>{soon.length}&nbsp;coming soon</span>}
          </p>
        </div>
        <figure className="hero-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero.webp" alt="A cluster of fresh white oyster mushrooms held in two hands" width={1200} height={628} fetchPriority="high" />
        </figure>
      </section>

      <div className="section-head" id="harvest">
        <h2>The harvest</h2>
        <p>Prices per kilogram</p>
      </div>

      <div className="harvest">
        {available.map((p) => {
          const v = variety(p.variety);
          const photo = !!p.imageUrl;
          const low = p.stockKg <= 10;
          return (
            <Link key={p._id} href={`/products/${p._id}`} className={`tile ${photo ? '' : 'no-photo'}`}>
              {photo && <div className="tile-art"><ProductImage imageUrl={p.imageUrl} alt={p.name} /></div>}
              <div className="tile-body">
                <span className="eyebrow">{v.label}</span>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <div className="tile-foot">
                  <span className="price">{money(p.pricePerKg)}<small>/kg</small></span>
                  <span className={`stock ${low ? 'low' : ''}`}>{low ? `Only ${p.stockKg}\u00A0kg left` : `${p.stockKg}\u00A0kg left`}</span>
                  <span className="go">View <i aria-hidden="true">→</i></span>
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
                <button className="btn ghost small" disabled>Coming soon</button>
              </li>
            ))}
          </ul>
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
    </>
  );
}
