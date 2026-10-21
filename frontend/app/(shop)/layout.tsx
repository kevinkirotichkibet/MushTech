import SiteHeader from '@/components/SiteHeader';
import { VERSION } from '@/lib/version';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="wrap">{children}</main>
      <footer className="site-footer">
        <div className="wrap foot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="MushTech Mushrooms" width={100} height={100} className="footer-logo" loading="lazy" />
          <p>Uyoga safi, by the kilo. <small className="ver">v{VERSION}</small></p>
        </div>
      </footer>
    </>
  );
}
