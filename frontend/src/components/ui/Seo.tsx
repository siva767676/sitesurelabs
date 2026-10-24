import { site } from '@/data/site'

interface SeoProps {
  title: string
  description: string
  path: string
  image?: string
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

/** React 19 hoists <title>, <meta> and <link> rendered anywhere into <head>. */
export function Seo({ title, description, path, image = '/og-image.png', noindex, jsonLd }: SeoProps) {
  const full = title.includes('SiteSureLabs') ? title : `${title} | SiteSureLabs`
  const url = `${site.url}${path === '/' ? '' : path}`
  const img = image.startsWith('http') ? image : `${site.url}${image}`
  return (
    <>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </>
  )
}
