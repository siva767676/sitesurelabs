import { Seo } from '@/components/ui/Seo'
import { PageHero } from '@/components/ui/PageHero'
import { CtaBand } from '@/components/ui/CtaBand'
import { ProductsVisual } from '@/components/ui/PageVisuals'
import { PlannedProduct, ProductFeature } from '@/components/product/ProductFeature'
import { products, getProduct } from '@/data/products'
import { site } from '@/data/site'

export default function Products() {
  const anviksha = getProduct('anviksha')!, sitevision = getProduct('sitevision')!, digi = getProduct('digi-reco')!, parichay = getProduct('parichay')!
  const planned = products.filter((p) => p.status === 'planned')
  return (
    <>
      <Seo
        title="Products for Construction"
        description="Anviksha, SiteVision, Digi Reco and Parichay: products from SiteSureLabs for construction quality inspection, 360° site capture, steel reconciliation and worker entry passes."
        path="/products"
        jsonLd={{
          '@context': 'https://schema.org', '@type': 'ItemList',
          itemListElement: products.filter((p) => p.status === 'demonstrated').map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/products/${p.slug}`, name: p.name })),
        }}
      />
      <PageHero
        eyebrow="Products"
        lines={['Software that', 'sees, reads and', '*reasons.*']}
        lead="Our own products, built around specific operational problems in construction and shown here on their real screens. Explore any product, or ask for a demonstration."
        visual={<ProductsVisual />}
      />
      <section className="section !pt-8" aria-label="Product catalogue">
        <div className="container-x space-y-[clamp(72px,14vw,220px)]">
          <ProductFeature product={anviksha} layout="landscape" />
          <ProductFeature product={sitevision} layout="tall" />
          <ProductFeature product={digi} layout="band" />
          <div className="pb-8"><ProductFeature product={parichay} layout="landscape" /></div>
          {planned.map((p) => <PlannedProduct key={p.slug} product={p} />)}
        </div>
      </section>
      <CtaBand title="Not sure which fits?" body="Tell us about your sites and workflows. We will show you the product that fits, or tell you honestly if none does." primary={{ label: 'Request a Demo', to: '/contact?type=demo' }} secondary={{ label: 'Custom solutions', to: '/services' }} />
    </>
  )
}
