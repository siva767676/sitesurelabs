import { site } from '@/data/site'
import { canonicalUrl } from '@/data/seo'

interface SeoProps {
  title: string
  description: string
  path: string
  image?: string
  noindex?: boolean
  /** Pass false for pages that have no canonical address (the 404 page). */
  canonical?: boolean
  /** From data/seo.ts: false means noindex. */
  index?: boolean
  /** og:type. Articles also carry their real publish and modify dates. */
  type?: 'website' | 'article'
  published?: string
  modified?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

/** React 19 hoists <title>, <meta> and <link> rendered anywhere into <head>. */
export function Seo({ title, description, path, image = '/og-image.png', noindex, index = true, canonical = true, type = 'website', published, modified, jsonLd }: SeoProps) {
  const full = title.includes('SiteSureLabs') ? title : `${title} | SiteSureLabs`
  const url = canonicalUrl(path)
  const hidden = noindex || !index
  const img = image.startsWith('http') ? image : `${site.url}${image}`
  return (
    <>
      <title>{full}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={url} />}
      {hidden ? <meta name="robots" content="noindex, nofollow" /> : <meta name="robots" content="index, follow, max-image-preview:large" />}
      <meta property="og:type" content={type} />
      {type === 'article' && published && <meta property="article:published_time" content={published} />}
      {type === 'article' && (modified ?? published) && <meta property="article:modified_time" content={modified ?? published} />}
      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:image:alt" content={site.tagline} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:image:alt" content={site.tagline} />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </>
  )
}
