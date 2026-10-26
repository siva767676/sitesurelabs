import { Link } from 'react-router-dom'
import { LogoLockup } from '@/components/brand/Logo'
import { legalNav, nav, site } from '@/data/site'
import { products } from '@/data/products'
import { services } from '@/data/services'

/** A footer column. `list` styles the <ul>: on phones the lists sit side by side or run inline to save height. */
function Col({ title, children, list = '' }: { title: string; children: React.ReactNode; list?: string }) {
  return (
    <nav aria-label={title}>
      <p className="t-label mb-3 lg:mb-5">{title}</p>
      {/* touch screens get 44 px rows (.tap) and no extra gap; mouse layouts keep the airy 12 px gap */}
      <ul className={`space-y-3 pointer-coarse:space-y-0 ${list}`}>{children}</ul>
    </nav>
  )
}
const FLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <li><Link to={to} className="tap text-[var(--color-fg)]/85 transition-colors hover:text-[var(--color-accent)]">{children}</Link></li>
)

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-line)] bg-[var(--color-bg)] pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] pt-14 lg:pt-20">
      <div className="container-x">
        <div className="grid-12 gap-y-10 lg:gap-y-14">
          <div className="col-span-12 lg:col-span-4">
            <Link to="/" aria-label="SiteSureLabs home" className="tap inline-flex items-center"><LogoLockup className="h-11 w-auto" /></Link>
            <p className="t-body mt-5 max-w-sm lg:mt-6">{site.description}</p>
            <a href={`mailto:${site.email}`} className="link-arrow mt-6 lg:mt-8">{site.email}</a>
          </div>
          <div className="col-span-6 lg:col-span-2 lg:col-start-6">
            <Col title="Products">
              {products.map((p) => <FLink key={p.slug} to={`/products/${p.slug}`}>{p.name}</FLink>)}
            </Col>
          </div>
          <div className="col-span-6 lg:col-span-3">
            <Col title="Services">
              {services.slice(0, 5).map((s) => <FLink key={s.slug} to="/services">{s.title.split(' & ')[0]}</FLink>)}
              <FLink to="/services">All services</FLink>
            </Col>
          </div>
          <div className="col-span-12 lg:col-span-2">
            <Col title="Company" list="max-lg:flex max-lg:flex-wrap max-lg:gap-x-6">
              {nav.filter((n) => n.to !== '/products' && n.to !== '/services').map((n) => <FLink key={n.to} to={n.to}>{n.label}</FLink>)}
              <FLink to="/contact?type=demo">Request a demo</FLink>
            </Col>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-1 border-t border-[var(--color-line)] pt-6 text-[var(--fs-caption)] text-[var(--color-muted)] md:flex-row md:items-center md:justify-between lg:mt-20 lg:gap-4 lg:pt-8">
          <p>© {new Date().getFullYear()} SiteSureLabs. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-0 lg:gap-y-2">
            {legalNav.map((l) => <li key={l.to}><Link to={l.to} className="tap hover:text-[var(--color-fg)]">{l.label}</Link></li>)}
          </ul>
        </div>
      </div>
    </footer>
  )
}
