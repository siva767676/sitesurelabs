import { site } from '@/data/site'
import type { Product } from '@/data/products'
import { getProduct } from '@/data/products'
import type { Article } from '@/data/articles'

/**
 * Builders for the JSON-LD on each page. One module so entities are defined once and referenced by @id
 * (no conflicting duplicates). Only facts the business has stated are used:
 *  - Organization has no email, address, telephone, sameAs or founder yet. Those are pending owner input
 *    (src/data/site.ts has CONFIRM markers). Add them here when provided; do not guess.
 *  - No ratings, reviews, prices, customer counts or awards, ever.
 */

export type JsonLd = Record<string, unknown>

export const abs = (path: string) => (path.startsWith('http') ? path : `${site.url}${path}`)
export const orgId = `${site.url}/#organization`
export const siteId = `${site.url}/#website`

const graph = (...nodes: (JsonLd | null | false | undefined)[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@graph': nodes.filter(Boolean),
})

export function organization(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': orgId,
    name: site.name,
    url: site.url,
    // The brand mark as a raster image (Google does not use SVG logos).
    logo: { '@type': 'ImageObject', url: abs('/apple-touch-icon.png'), width: 180, height: 180 },
    description: site.description,
  }
}

export function website(): JsonLd {
  return { '@type': 'WebSite', '@id': siteId, url: site.url, name: site.name, description: site.description, inLanguage: 'en', publisher: { '@id': orgId } }
}

/** Home page: the Organization and the WebSite, linked. */
export const homeSchema = () => graph(organization(), website())

export function breadcrumb(trail: { name: string; path: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: abs(t.path) })),
  }
}

/** Standalone breadcrumb block for pages with no other structured data. */
export const breadcrumbSchema = (trail: { name: string; path: string }[]) => graph(breadcrumb(trail))

export function productsSchema(list: Product[]): JsonLd {
  return graph(
    {
      '@type': 'ItemList',
      itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/products/${p.slug}`), name: p.name })),
    },
    breadcrumb([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }]),
  )
}

function softwareApplication(p: Product): JsonLd {
  const url = abs(`/products/${p.slug}`)
  return {
    '@type': 'SoftwareApplication',
    '@id': `${url}#software`,
    name: p.name,
    description: p.summary,
    url,
    applicationCategory: 'BusinessApplication',
    featureList: p.capabilities.map((c) => c.title),
    image: abs(p.media.cover),
    screenshot: p.media.shots.map((s) => ({ '@type': 'ImageObject', url: abs(s.src), caption: s.caption })),
    publisher: { '@id': orgId },
  }
}

function demoVideo(p: Product): JsonLd | null {
  const { demoVideo: file, demoVideoAdded: added } = p.media
  // uploadDate is required by Google and must be real: it comes from the date the file was added to the site.
  if (!file || !added) return null
  return {
    '@type': 'VideoObject',
    '@id': `${abs(`/products/${p.slug}`)}#demo`,
    name: `${p.name} product demonstration`,
    description: `${p.summary} Product demonstration video.`,
    thumbnailUrl: abs(p.media.cover),
    uploadDate: added,
    contentUrl: abs(file),
    publisher: { '@id': orgId },
  }
}

export function productSchema(p: Product): JsonLd {
  return graph(
    softwareApplication(p),
    demoVideo(p),
    breadcrumb([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }, { name: p.name, path: `/products/${p.slug}` }]),
  )
}

export function articleSchema(a: Article): JsonLd {
  const url = abs(`/blog/${a.slug}`)
  const lead = getProduct(a.products[0])
  return graph(
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: a.title,
      description: a.description,
      datePublished: a.published,
      dateModified: a.modified ?? a.published,
      mainEntityOfPage: url,
      // The author is the organisation. No individual author is named until the business provides a real one.
      author: { '@type': 'Organization', name: site.name, url: site.url },
      publisher: { '@id': orgId },
      ...(lead && { image: abs(lead.media.cover) }),
      inLanguage: 'en',
    },
    breadcrumb([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: a.title, path: `/blog/${a.slug}` }]),
  )
}
