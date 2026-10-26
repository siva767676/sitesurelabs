// Post-build: per-route static HTML (title, description, canonical, Open Graph), sitemap.xml and 404.html.
// A client-rendered SPA otherwise serves identical <head> metadata for every URL.
// Node >= 22.18 strips TypeScript types natively, so the data modules are imported directly.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { products } from '../src/data/products.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const SITE = 'https://sitesurelabs.com'
const template = readFileSync(join(dist, 'index.html'), 'utf8')

// index.html carries a small inline script that applies the saved light/dark theme before first paint.
// The production Content-Security-Policy (nginx.conf) only runs it if its SHA-256 is allow-listed, so a
// script edit that is not mirrored there would silently flash the wrong theme. Fail the build instead.
const nginxCsp = readFileSync(join(root, 'nginx.conf'), 'utf8').split('\n').filter((l) => l.includes('Content-Security-Policy'))
for (const [, code] of template.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
  const hash = `'sha256-${createHash('sha256').update(code).digest('base64')}'`
  if (!nginxCsp.length || !nginxCsp.every((l) => l.includes(hash))) {
    throw new Error(`postbuild: the inline <script> in index.html is not allowed by every Content-Security-Policy line in nginx.conf.\n  Add ${hash} to script-src there.`)
  }
}

const pages = [
  { path: '/', title: 'SiteSureLabs | AI Products & Enterprise Engineering', description: 'SiteSureLabs builds AI-powered products and intelligent systems for enterprises: computer vision, document intelligence, LLM applications and workflow automation.', index: true, priority: '1.0' },
  { path: '/products', title: 'Products for Construction | SiteSureLabs', description: 'Anviksha, SiteVision, Digi Reco and Parichay: products from SiteSureLabs for construction quality inspection, 360° site capture, steel reconciliation and worker entry passes.', index: true, priority: '0.9' },
  { path: '/services', title: 'AI & Engineering Services | SiteSureLabs', description: 'SiteSureLabs is a technology partner for custom AI: computer vision, document processing and OCR, LLM applications and RAG, AI agents, custom software and AI infrastructure.', index: true, priority: '0.9' },
  { path: '/about', title: 'About | SiteSureLabs', description: 'SiteSureLabs is an AI product company building practical, product-first AI for enterprises.', index: true, priority: '0.6' },
  { path: '/contact', title: 'Contact & Request a Demo | SiteSureLabs', description: 'Request a demo of Anviksha, SiteVision, Digi Reco or Parichay, or discuss a custom AI project with SiteSureLabs.', index: true, priority: '0.8' },
  { path: '/privacy', title: 'Privacy Policy | SiteSureLabs', description: 'How SiteSureLabs collects and handles personal information submitted through this website.', index: true, priority: '0.3' },
  { path: '/terms', title: 'Terms of Use | SiteSureLabs', description: 'Terms governing use of the SiteSureLabs website.', index: true, priority: '0.3' },
  ...products.map((p) => ({ path: `/products/${p.slug}`, title: `${p.seo.title} | SiteSureLabs`, description: p.seo.description, index: p.verified, priority: '0.8' })),
]

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function render(p) {
  const url = SITE + (p.path === '/' ? '' : p.path)
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(p.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(p.description)}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(p.title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(p.description)}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
  if (!p.index) html = html.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n  </head>')
  return html
}

for (const p of pages) {
  const dir = p.path === '/' ? dist : join(dist, p.path)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), render(p))
}

// 404.html: served with a real 404 status by the web server; the SPA boots and renders its NotFound page.
writeFileSync(join(dist, '404.html'), render({ path: '/404', title: 'Page not found | SiteSureLabs', description: 'The page you are looking for does not exist.', index: false }))

const today = new Date().toISOString().slice(0, 10)
const urls = pages.filter((p) => p.index).map((p) => `  <url><loc>${SITE}${p.path === '/' ? '/' : p.path}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`)
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)

console.log(`postbuild: ${pages.length} route pages, ${urls.length} sitemap URLs, 404.html`)
