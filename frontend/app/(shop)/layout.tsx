import SiteHeader from '@/components/SiteHeader';
import { VERSION } from '@/lib/version';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <SiteHeader />
      <main id="main" className="wrap">{children}</main>
      <footer className="site-footer">
        <div className="foot">
          <span className="who">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-mark.png" alt="" width={28} height={28} className="footer-logo" loading="lazy" />
            MushTech · Uyoga safi, by the kilo.
          </span>
          <span className="ver">v{VERSION}</span>
        </div>
      </footer>
    </>
  );
}
