import { useEffect } from 'react'
import { site } from '@/data/site'

// The built pages already carry their own title, description, canonical and social tags in the HTML (scripts/postbuild.mjs),
// for crawlers that do not run JavaScript. React then adds the same tags again, so the first render removes the originals.
// The tags are collected when this module loads, which is before React has put anything in <head>.
const builtTags = typeof document === 'undefined' ? [] : [...document.head.querySelectorAll('title, meta[name="description"], meta[name="robots"], link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"]')]

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
  useEffect(() => {
    builtTags.splice(0).forEach((el) => el.remove())
  }, [])
  const full = title.includes('SiteSureLabs') ? title : `${title} | SiteSureLabs`
  const url = `${site.url}${path === '/' ? '' : path}`
  const img = image.startsWith('http') ? image : `${site.url}${image}`
  return (
    <>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : <meta name="robots" content="index, follow, max-image-preview:large" />}
      <meta property="og:type" content="website" />
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
