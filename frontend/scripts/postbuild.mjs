// Post-build: prerender every public route to static HTML, then write sitemap.xml and 404.html.
//
// `vite build` produces dist/ (the browser app) and `vite build --ssr` produces dist-server/entry-server.js, which
// renders the real React app for a URL. Here each route is rendered with that bundle, so the HTML a crawler (or a
// visitor with JavaScript off) receives already holds the page's headings, copy, links, structured data and head tags.
// The browser then hydrates the same markup (src/main.tsx). Every visitor and bot gets identical HTML: no cloaking.
//
// Titles, descriptions and canonical URLs are no longer copied by hand here: they come from src/data/seo.ts via the
// <Seo> component, so the prerendered HTML and the live DOM cannot drift apart.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
// SEO_DIST / SEO_SERVER_DIST let a debug build (unminified React, readable hydration errors) run through the same step.
const dist = join(root, process.env.SEO_DIST ?? 'dist')
const serverEntry = join(root, process.env.SEO_SERVER_DIST ?? 'dist-server', 'entry-server.js')
if (!existsSync(serverEntry)) throw new Error('postbuild: dist-server/entry-server.js is missing. Run `npm run build`, which builds it first.')

const { render, allPages, site, articles } = await import(pathToFileURL(serverEntry).href)
const template = readFileSync(join(dist, 'index.html'), 'utf8')

// index.html carries a small inline script that applies the saved light/dark theme before first paint.
// The production Content-Security-Policy (nginx-security-headers.conf) only runs it if its SHA-256 is allow-listed, so a
// script edit that is not mirrored there would silently flash the wrong theme. Fail the build instead.
const cspLines = readFileSync(join(root, 'nginx-security-headers.conf'), 'utf8').split('\n').filter((l) => l.includes('Content-Security-Policy'))
for (const [, code] of template.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
  const hash = `'sha256-${createHash('sha256').update(code).digest('base64')}'`
  if (!cspLines.length || !cspLines.every((l) => l.includes(hash))) {
    throw new Error(`postbuild: the inline <script> in index.html is not allowed by the Content-Security-Policy in nginx-security-headers.conf.\n  Add ${hash} to script-src there.`)
  }
}

// Preload the Latin variable fonts that paint the headline and body copy. Without this the browser only learns of them
// after the stylesheet downloads, which delays the largest text paint (LCP). Hashed names are looked up from the build.
const fontPreloads = ['space-grotesk-latin-wght-normal', 'inter-latin-wght-normal']
  .map((stem) => readdirSync(join(dist, 'assets')).find((f) => f.startsWith(`${stem}-`) && f.endsWith('.woff2')))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`)
  .join('')
if (fontPreloads.split('<link').length - 1 !== 2) throw new Error('postbuild: expected two font files to preload (check the @fontsource imports in src/main.tsx).')

const HEAD_MARKER = /<!--seo-head:[\s\S]*?-->/
const ROOT_DIV = '<div id="root"></div>'
if (!HEAD_MARKER.test(template) || !template.includes(ROOT_DIV)) throw new Error('postbuild: index.html lost its <!--seo-head--> marker or empty #root.')

// React 19 hoists <title>, <meta> and <link> rendered by <Seo> and emits them first. Move them into <head>.
const HOISTED = /^((?:<title>[\s\S]*?<\/title>|<(?:meta|link)\b[^>]*\/>)+)/

async function prerenderRoute(url) {
  const out = await render(url)
  const m = out.match(HOISTED)
  if (!m) throw new Error(`postbuild: ${url} rendered no <title>/<meta> head tags. Does the page render <Seo>?`)
  return template.replace(HEAD_MARKER, () => m[1] + fontPreloads).replace(ROOT_DIV, () => `<div id="root">${out.slice(m[1].length)}</div>`)
}

// Articles stay 'pending' until the product team has approved them in writing (see src/data/articles.ts).
const unreviewed = articles.filter((a) => a.review !== 'approved').map((a) => a.slug)
if (unreviewed.length) {
  const msg = `postbuild: ${unreviewed.length} article(s) not yet approved by the product team: ${unreviewed.join(', ')}`
  if (process.env.SEO_REQUIRE_REVIEWED === '1') throw new Error(`${msg}
  SEO_REQUIRE_REVIEWED=1 is set, so the build is refused. Get sign-off, then set review: 'approved'.`)
  console.warn(`WARNING ${msg}`)
}

const pages = allPages()
for (const p of pages) {
  const dir = p.path === '/' ? dist : join(dist, p.path)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), await prerenderRoute(p.path))
}

// 404.html: served with a real 404 status by the web server (nginx error_page). It is the NotFound page, prerendered,
// noindex and without a canonical.
writeFileSync(join(dist, '404.html'), await prerenderRoute('/page-not-found'))

// sitemap.xml: canonical, indexable URLs only. <lastmod> appears only where src/data/seo.ts records a real
// content-change date; a build date would be wrong for every page that did not change. Google ignores <priority>.
const urls = pages
  .filter((p) => p.index)
  .map((p) => `  <url><loc>${site.url}${p.path}</loc>${p.modified ? `<lastmod>${p.modified}</lastmod>` : ''}</url>`)
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)

console.log(`postbuild: ${pages.length} prerendered routes, ${urls.length} sitemap URLs, 404.html`)
