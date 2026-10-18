import SiteHeader from '@/components/SiteHeader';
import { VERSION } from '@/lib/version';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="wrap">{children}</main>
      <footer className="wrap site-footer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo.png" alt="MushTech Mushrooms" width={96} height={96} className="footer-logo" loading="lazy" />
        <span>Fresh mushrooms, by the kilo. <small className="ver">v{VERSION}</small></span>
      </footer>
    </>
  );
}
