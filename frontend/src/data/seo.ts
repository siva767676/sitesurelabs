import { site } from './site'
import { products } from './products'
import { articles, isPublished, publishedArticles } from './articles'

/**
 * Single source of truth for page-level SEO. Used by:
 *  - the <Seo> component on each page (what the browser and the prerendered HTML carry), and
 *  - scripts/postbuild.mjs (which routes to prerender, and what goes in sitemap.xml).
 * Product pages take their title and description from data/products.ts instead.
 */
export interface PageSeo {
  path: string
  /** `| SiteSureLabs` is appended by <Seo> unless the title already contains the brand. */
  title: string
  description: string
  /** false: rendered with noindex and left out of the sitemap. */
  index: boolean
  /**
   * ISO date (YYYY-MM-DD) of the last SIGNIFICANT content change to the page. Leave undefined when unknown:
   * sitemap.xml then omits <lastmod> instead of publishing a made-up date. Do not bump it for cosmetic edits.
   */
  modified?: string
}

export const staticPages: PageSeo[] = [
  {
    path: '/',
    title: 'SiteSureLabs | AI-Powered Construction Technology Solutions',
    description: 'SiteSureLabs builds AI-powered construction technology solutions for inspection, quality management, site monitoring and digital project visibility.',
    index: true,
  },
  {
    path: '/products',
    title: 'Products for Construction',
    description: 'Anviksha, SiteVision, Digi Reco and Parichay: products from SiteSureLabs for construction quality inspection, 360° site capture, steel reconciliation and worker entry passes.',
    index: true,
  },
  {
    path: '/services',
    title: 'AI & Engineering Services',
    description: 'SiteSureLabs is a technology partner for custom AI: computer vision, document processing and OCR, LLM applications and RAG, AI agents, custom software and AI infrastructure.',
    index: true,
  },
  {
    path: '/about',
    title: 'About',
    description: 'SiteSureLabs is an AI product company building practical, product-first AI for enterprises.',
    index: true,
  },
  {
    path: '/blog',
    title: 'Construction Technology Guides and Insights',
    description: 'Practical guides from SiteSureLabs on digital construction inspection, AI-assisted quality management and 360° site documentation.',
    // Indexable only once at least one article is approved. With none, /blog is a placeholder and stays out of search.
    index: publishedArticles().length > 0,
    modified: publishedArticles().reduce((latest, a) => ((a.modified ?? a.published) > latest ? (a.modified ?? a.published) : latest), '') || undefined,
  },
  {
    path: '/contact',
    title: 'Contact & Request a Demo',
    description: 'Request a demo of Anviksha, SiteVision, Digi Reco or Parichay, or discuss a custom AI project with SiteSureLabs.',
    index: true,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy',
    description: 'This policy explains what personal information SiteSureLabs collects through sitesurelabs.com, why we collect it and how we handle it.',
    // Draft with unresolved legal placeholders (retention period, legal identity). Reachable and linked, but kept out of
    // search and the sitemap until legal review is finished. Set back to true then. See docs/SEO_PRODUCTION_READINESS.md.
    index: false,
  },
  {
    path: '/terms',
    title: 'Terms of Use',
    description: 'These terms govern your use of sitesurelabs.com. By using the website you agree to them.',
    // Draft with an unresolved governing-law placeholder: noindex and out of the sitemap until legal review is finished.
    index: false,
  },
]

/** Every page that is prerendered, in sitemap order. */
export function allPages(): PageSeo[] {
  return [
    ...staticPages,
    ...products.map((p): PageSeo => ({
      path: `/products/${p.slug}`,
      title: p.seo.title,
      description: p.seo.description,
      index: p.verified,
    })),
    ...articles.map((a): PageSeo => ({
      path: `/blog/${a.slug}`,
      title: a.seoTitle,
      description: a.description,
      index: isPublished(a), // drafts: noindex and not in the sitemap
      modified: isPublished(a) ? (a.modified ?? a.published) : undefined,
    })),
  ]
}

export function pageSeo(path: string): PageSeo {
  const found = staticPages.find((p) => p.path === path)
  if (!found) throw new Error(`pageSeo: no SEO entry for ${path}. Add it to src/data/seo.ts`)
  return found
}

export const canonicalUrl = (path: string) => `${site.url}${path}`
