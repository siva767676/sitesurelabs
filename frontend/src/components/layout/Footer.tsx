import { Link } from 'react-router-dom'
import { LogoMark, Wordmark } from '@/components/brand/Logo'
import { legalNav, nav, site } from '@/data/site'
import { products } from '@/data/products'
import { services } from '@/data/services'

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <nav aria-label={title}>
      <p className="t-label mb-5">{title}</p>
      <ul className="space-y-3">{children}</ul>
    </nav>
  )
}
const FLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <li><Link to={to} className="text-[var(--color-fg)]/85 transition-colors hover:text-[var(--color-accent)]">{children}</Link></li>
)

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-line)] bg-[var(--color-bg)] pb-10 pt-20">
      <div className="container-x">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 lg:col-span-4">
            <Link to="/" aria-label="SiteSureLabs home" className="inline-flex items-center gap-3"><LogoMark size={34} /><Wordmark className="text-2xl" /></Link>
            <p className="t-body mt-6 max-w-sm">{site.description}</p>
            <a href={`mailto:${site.email}`} className="link-arrow mt-8">{site.email}</a>
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
          <div className="col-span-6 lg:col-span-2">
            <Col title="Company">
              {nav.filter((n) => n.to !== '/products' && n.to !== '/services').map((n) => <FLink key={n.to} to={n.to}>{n.label}</FLink>)}
              <FLink to="/contact?type=demo">Request a demo</FLink>
            </Col>
          </div>
        </div>
        <div className="mt-20 flex flex-col gap-4 border-t border-[var(--color-line)] pt-8 text-[var(--fs-caption)] text-[var(--color-muted)] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} SiteSureLabs. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((l) => <li key={l.to}><Link to={l.to} className="hover:text-[var(--color-fg)]">{l.label}</Link></li>)}
            <li><a href="/sitemap.xml" className="hover:text-[var(--color-fg)]">Sitemap</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
