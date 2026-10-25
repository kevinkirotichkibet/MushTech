import SiteHeader from '@/components/SiteHeader';
import { VERSION } from '@/lib/version';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <SiteHeader />
      <main id="main">{children}</main>
      <footer className="site-footer" data-version={VERSION}>
        <div className="foot">
          <span className="who">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-mark.png" alt="" width={28} height={28} className="footer-logo" loading="lazy" />
            MushTech · Uyoga safi
          </span>
        </div>
      </footer>
    </>
  );
}
