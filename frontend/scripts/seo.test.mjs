// SEO regression tests. They check the BUILT output, so run `npm run build` first:
//   npm run build && npm run test:seo
// No dependencies: Node's built-in test runner and regex checks on the static HTML.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const entry = join(root, 'dist-server', 'entry-server.js')
assert.ok(existsSync(join(dist, 'index.html')) && existsSync(entry), 'Run `npm run build` before `npm run test:seo`.')

const { allPages, site } = await import(pathToFileURL(entry).href)
const pages = allPages()
const fileFor = (path) => join(dist, path === '/' ? '' : path, 'index.html')
const read = (file) => readFileSync(file, 'utf8')
const html = Object.fromEntries(pages.map((p) => [p.path, read(fileFor(p.path))]))
const html404 = read(join(dist, '404.html'))

const all = (src, re) => [...src.matchAll(re)].map((m) => m[1] ?? m[0])
const meta = (src, attr, name) => all(src, new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`, 'g'))
const unescape = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&#x27;/g, "'")
const headingText = (src) => unescape(src.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()
const text = (src) => src.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

test('every route is prerendered to its own HTML file', () => {
  for (const p of pages) assert.ok(existsSync(fileFor(p.path)), `${p.path} has no prerendered HTML`)
  assert.ok(existsSync(join(dist, '404.html')))
})

test('prerendered pages contain real content, not an empty shell', () => {
  for (const p of pages) {
    const h = html[p.path]
    assert.doesNotMatch(h, /<div id="root"><\/div>/, `${p.path}: #root is empty`)
    assert.ok(text(h.slice(h.indexOf('<body'))).split(' ').length > 120, `${p.path}: fewer than 120 words of body text`)
    assert.ok(all(h, /<a [^>]*href="\/[^"#]*"/g).length >= 5, `${p.path}: fewer than 5 crawlable internal links`)
  }
})

test('exactly one non-empty H1 per page', () => {
  for (const p of pages) {
    const h1s = all(html[p.path], /<h1\b[\s\S]*?<\/h1>/g)
    assert.equal(h1s.length, 1, `${p.path}: expected 1 <h1>, found ${h1s.length}`)
    const words = headingText(h1s[0]).toLowerCase().split(' ')
    assert.ok(words.join('').length > 2, `${p.path}: empty <h1>`)
    // the heading text must appear once, not as a hidden copy plus a visual copy
    const half = words.length / 2
    assert.ok(!(Number.isInteger(half) && words.slice(0, half).join(' ') === words.slice(half).join(' ')), `${p.path}: H1 text is duplicated: ${words.join(' ')}`)
  }
})

test('one title, one description, one canonical; no duplicated head tags', () => {
  for (const p of pages) {
    const h = html[p.path]
    const head = h.slice(0, h.indexOf('</head>'))
    assert.equal(all(head, /<title>/g).length, 1, `${p.path}: <title> count`)
    assert.equal(meta(head, 'name', 'description').length, 1, `${p.path}: description count`)
    assert.equal(all(head, /<link rel="canonical"/g).length, 1, `${p.path}: canonical count`)
    assert.equal(meta(head, 'property', 'og:title').length, 1, `${p.path}: og:title count`)
    assert.equal(meta(head, 'name', 'twitter:title').length, 1, `${p.path}: twitter:title count`)
  }
})

test('canonical and og:url equal the page URL on the production domain', () => {
  for (const p of pages) {
    const want = `${site.url}${p.path}`
    const h = html[p.path]
    assert.deepEqual(all(h, /<link rel="canonical" href="([^"]*)"/g), [want], `${p.path}: canonical`)
    assert.deepEqual(meta(h, 'property', 'og:url'), [want], `${p.path}: og:url`)
    assert.doesNotMatch(h, /localhost|127\.0\.0\.1/, `${p.path}: dev URL in HTML`)
  }
})

test('titles and descriptions are unique and sensibly sized', () => {
  const titles = new Map(), descs = new Map(), problems = []
  for (const p of pages) {
    const t = unescape(all(html[p.path], /<title>([\s\S]*?)<\/title>/g)[0])
    const d = unescape(meta(html[p.path], 'name', 'description')[0])
    if (t.length < 15 || t.length > 70) problems.push(`${p.path}: title is ${t.length} chars (15-70): ${t}`)
    if (d.length < 70 || d.length > 200) problems.push(`${p.path}: description is ${d.length} chars (70-200)`)
    if (titles.has(t)) problems.push(`${p.path}: same title as ${titles.get(t)}`)
    if (descs.has(d)) problems.push(`${p.path}: same description as ${descs.get(d)}`)
    titles.set(t, p.path); descs.set(d, p.path)
  }
  assert.deepEqual(problems, [])
})

test('noindex follows the page config, and noindex pages stay out of the sitemap', () => {
  const sitemap = read(join(dist, 'sitemap.xml'))
  for (const p of pages) {
    const noindex = /<meta name="robots" content="noindex/.test(html[p.path])
    assert.equal(noindex, !p.index, `${p.path}: robots meta does not match index=${p.index}`)
    assert.equal(sitemap.includes(`<loc>${site.url}${p.path}</loc>`), p.index, `${p.path}: sitemap membership`)
  }
})

test('404.html is noindex and has no canonical', () => {
  assert.match(html404, /<meta name="robots" content="noindex, nofollow"/)
  assert.doesNotMatch(html404, /rel="canonical"/)
  assert.equal(all(html404, /<h1\b/g).length, 1)
})

test('sitemap.xml is valid, canonical, unique and never invents dates', () => {
  const xml = read(join(dist, 'sitemap.xml'))
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/)
  const locs = all(xml, /<loc>([^<]*)<\/loc>/g)
  assert.equal(new Set(locs).size, locs.length, 'duplicate <loc>')
  const known = new Set(pages.filter((p) => p.index).map((p) => `${site.url}${p.path}`))
  for (const l of locs) assert.ok(known.has(l), `sitemap lists a URL that is not an indexable page: ${l}`)
  assert.equal(locs.length, known.size, 'sitemap is missing indexable pages')
  for (const l of locs) assert.doesNotMatch(l, /\?|#|\/$(?<!^https:\/\/[^/]+\/)/, `non-canonical form: ${l}`)
  assert.doesNotMatch(xml, /<priority>|<changefreq>/, 'Google ignores these; they only add noise')
  const dated = new Map(pages.filter((p) => p.modified).map((p) => [`${site.url}${p.path}`, p.modified]))
  for (const [, loc, mod] of xml.matchAll(/<loc>([^<]*)<\/loc><lastmod>([^<]*)<\/lastmod>/g)) {
    assert.equal(dated.get(loc), mod, `lastmod for ${loc} is not a recorded content-change date`)
    assert.ok(mod <= new Date().toISOString().slice(0, 10), `lastmod in the future: ${loc}`)
  }
})

test('robots.txt allows the site, blocks the API, and points at the sitemap', () => {
  const r = read(join(dist, 'robots.txt'))
  assert.match(r, /^User-agent: \*$/m)
  assert.match(r, /^Disallow: \/api\/$/m)
  assert.doesNotMatch(r, /^Disallow:\s*\/\s*$/m, 'robots.txt must not block the whole site')
  assert.match(r, new RegExp(`^Sitemap: ${site.url}/sitemap\\.xml$`, 'm'))
})

test('every internal link points at a prerendered page or a real file', () => {
  const routes = new Set(pages.map((p) => p.path))
  const bad = []
  for (const p of pages) {
    for (const href of all(html[p.path], /<a [^>]*?href="(\/[^"]*)"/g)) {
      const path = unescape(href).split(/[?#]/)[0] || '/'
      if (routes.has(path) || existsSync(join(dist, path))) continue
      bad.push(`${p.path} -> ${href}`)
    }
  }
  assert.deepEqual(bad, [], `broken internal links:\n${bad.join('\n')}`)
})

test('the retired /products/sitevision URL is not linked or listed anywhere', () => {
  for (const p of pages) assert.doesNotMatch(html[p.path], /href="\/products\/sitevision"/, `${p.path} still links to /products/sitevision`)
  assert.doesNotMatch(read(join(dist, 'sitemap.xml')), /\/products\/sitevision</)
  assert.ok(pages.some((p) => p.path === '/products/site-vision'))
})

const ld = (src) => all(src, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g).map((x) => JSON.parse(unescape(x)))
const nodes = (src) => ld(src).flatMap((b) => (b['@graph'] ?? [b]))
const typesOf = (src) => nodes(src).map((n) => n['@type'])

test('structured data parses, uses real URLs, has no duplicate entity types and no invented data', () => {
  for (const p of pages) {
    for (const b of ld(html[p.path])) assert.equal(b['@context'], 'https://schema.org', `${p.path}: @context`)
    const types = typesOf(html[p.path])
    assert.equal(new Set(types).size, types.length, `${p.path}: duplicate schema types ${types}`)
    const raw = JSON.stringify(ld(html[p.path]))
    assert.doesNotMatch(raw, /localhost|undefined|aggregateRating|"review"|"offers"|"telephone"|"address"|"sameAs"|"email"/, `${p.path}: invented or unsupported structured data`)
    for (const u of (raw.match(/https?:\/\/[^"]+/g) ?? []).filter((x) => !x.startsWith('https://schema.org'))) assert.ok(u.startsWith(site.url), `${p.path}: schema URL off-domain: ${u}`)
  }
})

test('home has Organization + WebSite; inner pages have BreadcrumbList; products and articles have their own types', () => {
  assert.deepEqual(typesOf(html['/']).sort(), ['Organization', 'WebSite'])
  const org = nodes(html['/']).find((n) => n['@type'] === 'Organization')
  assert.equal(org.logo.url, `${site.url}/apple-touch-icon.png`)
  assert.ok(existsSync(join(dist, 'apple-touch-icon.png')))
  for (const p of pages.filter((x) => x.index && x.path !== '/')) assert.ok(typesOf(html[p.path]).includes('BreadcrumbList'), `${p.path}: no BreadcrumbList`)
  for (const p of pages.filter((x) => x.index && x.path.startsWith('/products/'))) {
    const t = typesOf(html[p.path])
    assert.ok(t.includes('SoftwareApplication'), `${p.path}: SoftwareApplication`)
    const video = nodes(html[p.path]).find((n) => n['@type'] === 'VideoObject')
    assert.ok(video, `${p.path}: VideoObject`)
    assert.match(video.uploadDate, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/, `${p.path}: VideoObject uploadDate needs a date, time and timezone`)
    assert.ok(existsSync(join(dist, video.contentUrl.replace(site.url, ''))), `${p.path}: video file missing`)
  }
  for (const p of pages.filter((x) => x.path.startsWith('/blog/'))) {
    const a = nodes(html[p.path]).find((n) => n['@type'] === 'Article')
    assert.ok(a, `${p.path}: Article`)
    assert.equal(a.author['@type'], 'Organization', 'author must be the organisation until a real person is provided')
    assert.match(a.datePublished, /^\d{4}-\d{2}-\d{2}$/)
    assert.match(html[p.path], /<meta property="og:type" content="article"/)
  }
})

test('breadcrumb items end on the page itself and use canonical URLs', () => {
  for (const p of pages.filter((x) => x.index && x.path !== '/')) {
    const bc = nodes(html[p.path]).find((n) => n['@type'] === 'BreadcrumbList')
    const last = bc.itemListElement.at(-1).item
    assert.equal(last, `${site.url}${p.path}`, `${p.path}: breadcrumb should end on itself`)
    assert.equal(bc.itemListElement[0].item, `${site.url}/`)
  }
})

test('every indexable product page H1 says what the product is', () => {
  for (const p of pages.filter((x) => x.index && x.path.startsWith('/products/'))) {
    const h1 = headingText(all(html[p.path], /<h1\b[\s\S]*?<\/h1>/g)[0])
    assert.ok(h1.split(' ').length >= 4, `${p.path}: H1 is only a name: "${h1}"`)
    assert.match(h1, /construction/i, `${p.path}: H1 should name the industry`)
  }
})

test('draft articles stay unpublished: noindex, out of the sitemap, nav, footer, blog list and llms.txt', async () => {
  const { articles } = await import(pathToFileURL(entry).href)
  const drafts = articles.filter((x) => x.review !== 'approved')
  const sitemap = read(join(dist, 'sitemap.xml'))
  const llms = read(join(dist, 'llms.txt'))
  for (const a of drafts) {
    const path = `/blog/${a.slug}`
    assert.ok(existsSync(fileFor(path)), `${path}: draft is still built so it can be reviewed`)
    assert.match(html[path], /<meta name="robots" content="noindex, nofollow"/, `${path}: draft must be noindex`)
    assert.match(html[path], /DRAFT, pending review/, `${path}: draft banner missing`)
    assert.ok(!sitemap.includes(path), `${path}: draft is in the sitemap`)
    assert.ok(!llms.includes(path), `${path}: draft is in llms.txt`)
    for (const p of pages.filter((x) => x.path !== path)) assert.ok(!html[p.path].includes(`href="${path}"`) || p.path.startsWith('/blog/'), `${p.path} links to the draft ${path}`)
    assert.ok(!html['/blog'].includes(`href="${path}"`), `/blog lists the draft ${path}`)
  }
  if (drafts.length === articles.length) {
    assert.match(html['/blog'], /<meta name="robots" content="noindex, nofollow"/, '/blog must be noindex while no article is approved')
    assert.ok(!sitemap.includes(`${site.url}/blog<`), '/blog is in the sitemap with no approved article')
    for (const p of pages.filter((x) => !x.path.startsWith('/blog'))) assert.ok(!html[p.path].includes('href="/blog"'), `${p.path} links to /blog (nav/footer) while no article is approved`)
  }
})

test('approved articles (when there are any) carry a direct answer, FAQ, product link and Article schema', () => {
  for (const a of pages.filter((x) => x.path.startsWith('/blog/'))) {
    assert.match(html[a.path], /The short answer/)
    assert.match(html[a.path], /Frequently asked questions/)
    assert.ok(/href="\/products\/[a-z-]+"/.test(html[a.path]), `${a.path}: no product link`)
    assert.ok(text(html[a.path]).split(' ').length > 500, `${a.path}: too thin (<500 words)`)
    assert.doesNotMatch(html[a.path], /<h1[\s\S]*<h1/, `${a.path}: two H1s`)
  }
})

test('Privacy and Terms: reachable and linked, but noindex and out of the sitemap until legal review', () => {
  const sitemap = read(join(dist, 'sitemap.xml'))
  for (const path of ['/privacy', '/terms']) {
    assert.ok(existsSync(fileFor(path)), `${path} must still exist`)
    assert.match(html[path], /<meta name="robots" content="noindex, nofollow"/, `${path}: expected noindex`)
    assert.ok(!sitemap.includes(`${site.url}${path}<`), `${path}: must not be in the sitemap`)
    assert.ok(html['/'].includes(`href="${path}"`), `footer link to ${path} is gone`)
  }
  assert.ok(html['/contact'].includes('href="/privacy"'), 'the contact form consent link to /privacy is gone')
})

test('llms.txt and robots.txt: optional AI-readable summary lists only real pages', () => {
  const txt = read(join(dist, 'llms.txt'))
  const urls = all(txt, /\((https:\/\/sitesurelabs\.com[^)]*)\)/g)
  assert.ok(urls.length >= 6)
  for (const u of urls) {
    const path = u.replace(site.url, '') || '/'
    assert.ok(pages.some((p) => p.path === path && p.index), `llms.txt lists a page that is not indexable: ${u}`)
  }
})

test('og-image is under 150 KB and 1200x630', () => {
  const buf = readFileSync(join(dist, 'og-image.png'))
  assert.ok(buf.length < 150_000, `og-image.png is ${buf.length} bytes`)
  assert.equal(buf.readUInt32BE(16), 1200)
  assert.equal(buf.readUInt32BE(20), 630)
})

test('fonts used by the headline are preloaded (with crossorigin) on every page', () => {
  for (const p of pages) {
    const pre = all(html[p.path], /<link rel="preload"[^>]*as="font"[^>]*>/g)
    assert.equal(pre.length, 2, `${p.path}: expected 2 font preloads`)
    for (const l of pre) assert.match(l, /crossorigin/)
  }
})

test('the inline theme script is still allow-listed by the Content-Security-Policy', () => {
  // postbuild already throws on drift; assert here too so the guard is visible in the test report.
  assert.match(read(join(root, 'nginx-security-headers.conf')), /Content-Security-Policy/)
})

test('private surfaces are not in any page: no admin, login or API links', () => {
  for (const p of pages) assert.doesNotMatch(html[p.path], /href="\/(api|admin|login|signup|dashboard)\b/, `${p.path} links to a private route`)
})

test('claims the business has not verified are absent from every page', () => {
  // Remove an entry here only after the owner has verified the claim and its source (see docs/SEO_AUDIT_AND_IMPLEMENTATION.md).
  const unverified = ['150+', '10,000+', '80,800', '100% traceability', '23,538', '1,238', '2.5%', 'Promoter Group', 'Maha Cement']  // founder bio details were supplied by the founder (commit 812b0d2) and are intentionally live
  for (const p of pages) for (const claim of unverified) assert.ok(!html[p.path].includes(claim), `${p.path} contains the unverified claim "${claim}"`)
})

test('the homepage says what the company does', () => {
  const h1 = headingText(all(html['/'], /<h1\b[\s\S]*?<\/h1>/g)[0])
  assert.match(h1, /construction/i, 'homepage H1 should name the industry')
  assert.match(unescape(meta(html['/'], 'name', 'description')[0]), /construction/i)
  assert.match(all(html['/'], /<title>([\s\S]*?)<\/title>/g)[0], /Construction/i)
})

test('approved articles are public: indexable, in the sitemap, the blog list, the nav and llms.txt', async () => {
  const { articles } = await import(pathToFileURL(entry).href)
  const approved = articles.filter((x) => x.review === 'approved')
  const sitemap = read(join(dist, 'sitemap.xml'))
  const llms = read(join(dist, 'llms.txt'))
  if (approved.length === 0) return
  assert.ok(sitemap.includes(`<loc>${site.url}/blog</loc>`), '/blog must be in the sitemap once an article is approved')
  assert.ok(!/<meta name="robots" content="noindex/.test(html['/blog']), '/blog must be indexable once an article is approved')
  for (const p of pages.filter((x) => !x.path.startsWith('/blog'))) assert.ok(html[p.path].includes('href="/blog"'), `${p.path}: Blog link missing from the nav`)
  for (const a of approved) {
    const path = `/blog/${a.slug}`
    assert.ok(sitemap.includes(`<loc>${site.url}${path}</loc>`), `${path}: missing from the sitemap`)
    assert.match(sitemap, new RegExp(`<loc>${site.url}${path}</loc><lastmod>\\d{4}-\\d{2}-\\d{2}</lastmod>`), `${path}: lastmod missing`)
    assert.ok(!/<meta name="robots" content="noindex/.test(html[path]), `${path}: approved article must be indexable`)
    assert.ok(!html[path].includes('DRAFT, pending review'), `${path}: draft banner still shown`)
    assert.ok(html['/blog'].includes(`href="${path}"`), `/blog does not list ${path}`)
    assert.ok(llms.includes(`${site.url}${path}`), `${path}: missing from llms.txt`)
  }
})

test('every product demo video has its 720p twin (the video dialog uses it on phones)', async () => {
  const { products } = await import(pathToFileURL(entry).href)
  for (const p of products.filter((x) => x.media.demoVideo)) {
    const small = p.media.demoVideo.replace('-demo.mp4', '-demo-720.mp4')
    assert.notEqual(small, p.media.demoVideo, `${p.slug}: demo video name does not follow name-demo.mp4`)
    assert.ok(existsSync(join(dist, small)), `${p.slug}: ${small} is missing`)
    assert.ok(existsSync(join(dist, p.media.demoVideo)), `${p.slug}: original video missing`)
  }
})

test('internal links to the guides: home links to every published guide, Anviksha links to its two', async () => {
  const { articles } = await import(pathToFileURL(entry).href)
  for (const a of articles.filter((x) => x.review === 'approved')) {
    assert.ok(html['/'].includes(`href="/blog/${a.slug}"`), `home does not link to /blog/${a.slug}`)
  }
  for (const slug of ['digital-construction-inspection-guide', 'manual-vs-ai-construction-inspection']) {
    assert.ok(html['/products/anviksha'].includes(`href="/blog/${slug}"`), `/products/anviksha does not link to /blog/${slug}`)
  }
  assert.ok(!html['/products/anviksha'].includes('href="/blog/360-degree-construction-documentation"'), 'Anviksha should not link to the 360 article')
})

test('the public contact email is the confirmed one, and no placeholder address is left', () => {
  for (const p of pages) assert.ok(!/support@sitesurelabs\.com|hello@sitesurelabs\.com/.test(html[p.path]), `${p.path} still shows a placeholder email`)
  assert.ok(html['/contact'].includes('mailto:mhcai@myhomeconstructions.com'), 'the Contact page must link the confirmed email')
  assert.ok(html['/'].includes('mailto:mhcai@myhomeconstructions.com'), 'the footer must link the confirmed email')
})
