import { Seo } from '@/components/ui/Seo'
import { PageHero } from '@/components/ui/PageHero'
import { CtaBand } from '@/components/ui/CtaBand'
import { PlannedProduct, ProductFeature } from '@/components/product/ProductFeature'
import { products, getProduct } from '@/data/products'
import { site } from '@/data/site'

export default function Products() {
  const anviksha = getProduct('anviksha')!, sitevision = getProduct('sitevision')!, digi = getProduct('digi-reco')!
  const planned = products.filter((p) => p.status === 'planned')
  return (
    <>
      <Seo
        title="AI Products for Construction"
        description="Anviksha, SiteVision and Digi Reco: AI products from SiteSureLabs for construction quality inspection, 360° site capture and steel reconciliation."
        path="/products"
        jsonLd={{
          '@context': 'https://schema.org', '@type': 'ItemList',
          itemListElement: products.filter((p) => p.status === 'demonstrated').map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/products/${p.slug}`, name: p.name })),
        }}
      />
      <PageHero
        eyebrow="Products"
        lines={['Software that', 'sees, reads and', '*reasons.*']}
        lead="Our own AI products, built around specific operational problems in construction and shown here on their real screens. Explore any product, or ask for a demonstration."
      />
      <section className="section !pt-8" aria-label="Product catalogue">
        <div className="container-x space-y-[clamp(96px,14vw,220px)]">
          <ProductFeature product={anviksha} layout="landscape" />
          <ProductFeature product={sitevision} layout="tall" />
          <div className="pb-8"><ProductFeature product={digi} layout="band" /></div>
          {planned.map((p) => <PlannedProduct key={p.slug} product={p} />)}
        </div>
      </section>
      <CtaBand title="Not sure which fits?" body="Tell us about your sites and workflows. We will show you the product that fits, or tell you honestly if none does." primary={{ label: 'Request a Demo', to: '/contact?type=demo' }} secondary={{ label: 'Custom solutions', to: '/services' }} />
    </>
  )
}
