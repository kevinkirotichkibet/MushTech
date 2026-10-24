import Link from 'next/link';

export default function LandingHero() {
  return (
    <section className="landing" aria-label="Welcome">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="landing-img" src="/images/hero.webp" alt="" width={1200} height={628} fetchPriority="high" />
      <div className="landing-shade" aria-hidden="true" />
      <div className="landing-copy">
        <h1>Fresh mushrooms, weighed to order.</h1>
        <p>Oyster and button mushrooms, sold by the kilo.</p>
        <Link href="/shop" className="btn-outline">Order now</Link>
      </div>
    </section>
  );
}
