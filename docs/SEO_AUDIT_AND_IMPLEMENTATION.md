# SiteSureLabs SEO Audit and Implementation

> **How to read status in these SEO documents.** **Implemented in code** = on branch `feature/sitesurelabs-seo-implementation`, uncommitted, **not deployed and not live** on sitesurelabs.com. **Owner action** = needs you: an account, an approval, a fact only the company knows, or access to the live server. **External activity** = outreach, listings, directory or social accounts, paid tools, third-party validators: **none of it has been done**, and nothing is claimed as done. Authoritative status of all 16 workstreams: `SEO_FINAL_REVIEW.md`.

Branch: `feature/sitesurelabs-seo-implementation`
Final review: `SEO_FINAL_REVIEW.md` (authoritative workstream status, remaining issues and deployment sequence).
Status: **Stages 1-3 implemented on this branch (Workstreams 1-13 in code and docs; 14-16 documented). Uncommitted and not deployed.**
Method: static code inspection of the repository by three read-only audit passes (technical/rendering, content/architecture, media/performance). Nothing was built, run, or measured against the live site. Items marked *unverified* need a build or browser check in Stage 2.

---

## 1. Stack detected

| Area | Finding |
|---|---|
| Frontend | Vite 8 + React 19 + react-router-dom 7, TypeScript, Tailwind 4 (`frontend/`) |
| Rendering | Client-rendered SPA (`createRoot`, `main.tsx:23`). Not SSR, not hydrated prerender |
| "Prerender" | `frontend/scripts/postbuild.mjs` copies `dist/index.html` per route and regex-rewrites only title, description, canonical and og:title/description/url. Body is still an empty `<div id="root">` plus a generic `<noscript>` |
| Head management | Custom `components/ui/Seo.tsx` using React 19 tag hoisting |
| Backend | FastAPI + SQLite (`backend/`), only `/api/enquiries` is relevant |
| Web server | nginx (`frontend/nginx.conf`), HTTP only on port 80, TLS expected from an unspecified front proxy |
| Tests / CI | No frontend tests, no CI. Backend has pytest for enquiries only |
| Node | `>=22.18` required (postbuild imports `.ts` directly) |

## 2. What already exists (retain, do not duplicate)

- `robots.txt` (allow `/`, disallow `/api/`, sitemap reference). Correct.
- `sitemap.xml` generated at build, excludes noindex pages, URLs match canonicals.
- Per-route `<title>`, description, canonical, OG tags in static HTML via postbuild.
- Real HTTP 404 via nginx `error_page 404 /404.html`; unknown asset paths return 404.
- noindex on the unverified product (Progress Tracker) and on 404.
- CSP with inline-script hash, and a build guard that fails if the hash drifts (keep this).
- Crawlable navigation: header, mobile drawer and footer use real `<a href>` links.
- Image pipeline: WebP stills with 960/1280/1920 `srcset`, width/height, lazy loading, good alt text, hero is text-LCP (not lazy).
- Videos load only after the user opens the dialog (`preload="metadata"`).
- Route-level code splitting, three.js deferred until after `load`, font fallbacks with size-adjust.
- Contact form: validation, honeypot, consent, real success/error states, accessible.
- JSON-LD at runtime for Home (Organization), Products (ItemList), product pages (SoftwareApplication).
- Empty testimonials array (nothing fabricated is shown).

## 3. Audit findings, ranked

### Critical

| # | Finding | Evidence |
|---|---|---|
| C1 | **Crawlers receive an empty HTML shell.** No H1, copy, links, FAQs or JSON-LD in raw HTML. Bing, AI crawlers (GPTBot, PerplexityBot, etc.) and social scrapers see almost nothing. | `index.html:30-36`, `postbuild.mjs:38-44` |
| C2 | **Homepage does not say what the company does.** H1 is a tagline; "construction" is absent from the hero, title and meta description. Positioning is split between "enterprise AI" and construction products. | `Hero.tsx:89-107`, `index.html` title, `site.ts` description |
| C3 | **Product metrics may be demo data presented as real usage** (e.g. "150+ live users", "80,800 records", "100% traceability"). Digi Reco's own FAQ says its figures are demo data. Must be verified by the owner, labelled, or removed before they are repeated in schema or articles. | `products.ts:126-130, 196-200, 266-270, 337-341`, `ProductDetail.tsx:198-212` |

### High

| # | Finding | Evidence |
|---|---|---|
| H1 | HTTPS, HSTS, http to https and www to non-www redirects are not in the repo; cannot be verified. `server_name _` accepts any host. | `nginx.conf:5-6`, `docker-compose.yml:4` |
| H2 | Runtime `<Seo>` likely adds tags alongside static ones, giving duplicate title/description/canonical in the live DOM (*unverified*). Titles/descriptions are hand-copied between `postbuild.mjs` and pages, so they can drift. | `Seo.tsx:12-35`, `postbuild.mjs:23-34` |
| H3 | Raw HTML lacks JSON-LD and `twitter:title/description/image`; per-route og:image not set. | `index.html`, `Seo.tsx` |
| H4 | Trailing-slash and `/x/index.html` URLs return 200 with no 301 to the canonical form. | `nginx.conf:59` |
| H5 | Slug mismatch: product is `/products/sitevision`; requested `/products/site-vision` does not exist. Unknown product slugs render NotFound with HTTP 200 only when the SPA is used directly (soft 404). | `products.ts:133`, `ProductDetail.tsx:28` |
| H6 | No address, phone, social profiles or legal entity. Organization schema has no `sameAs`/`contactPoint`. Privacy and Terms are drafts with placeholders. Email is marked CONFIRM. | `site.ts:9-14`, `Legal.tsx` |
| H7 | Founder copy ("Founded in 2025", affiliation with named third-party companies) is unsourced and not marked CONFIRM. | `About.tsx:83-84` |
| H8 | Product H1s are the name only; problem/solution titles are `<p>`; FAQs and breadcrumbs have no schema. Services have no individual pages (five footer links point to `/services`). | `ProductDetail.tsx:58,104` |

### Medium

| # | Finding |
|---|---|
| M1 | Sitemap `lastmod` is the build date for every URL (effectively fake). `priority` is ignored by Google. |
| M2 | No `X-Robots-Tag` on `/api/`. |
| M3 | `add_header` inheritance: `/assets/` and `/media/` drop CSP and other security headers. |
| M4 | `/media/` cached 30 days with unhashed filenames, so changed files go stale. |
| M5 | No font preload and no LCP image preload (product cover). |
| M6 | `ImageReveal`/`TextReveal` start at opacity 0 until JS runs; can delay LCP, and cached images may never fire `onLoad` after hydration (*unverified*). |
| M7 | Demo videos are 9-14 MB single-tier 1080p MP4 (47 MB total), no mobile/WebM variant, no VideoObject schema. |
| M8 | No brotli; no web manifest; no 192/512 icons; `og-image.png` is 208 KB PNG. |
| M9 | Progress Tracker (placeholder copy, noindex) still appears in footer, Contact select and "next product" loop. "Robotic dog" is a form option and home section with no page. |
| M10 | `services.ts` capability list and About principles are unconfirmed drafts ("CONFIRM" markers); site promises LLM/agent/cloud work no product evidences. |
| M11 | No blog, resources, case studies, industry pages or proof content. |
| M12 | No tests, no CI, no SEO regression checks. |

### Low

`404.html` carries a canonical (should have none); home canonical `https://sitesurelabs.com` vs sitemap `/`; Organization logo is an SVG (Google prefers raster); `/privacy` and `/terms` in sitemap (low value); About H2s styled as labels; Contact has no H2 for the form; no analytics or consent mechanism (deliberate, and Legal states none is used; CSP also blocks third-party scripts).

## 4. Constraints that shape the plan

1. **Prerendering approach (decision needed).** Options: (a) build-time `react-dom/server` render of each route inside `postbuild.mjs`, hydrate on the client (smallest change, keeps stack); (b) headless-browser snapshot at build; (c) migrate to a framework (rejected: too invasive). Recommendation: (a), with a fallback to (b) if three.js/motion code is not SSR-safe.
2. **Analytics** needs a CSP change, a consent mechanism and a Privacy Policy update, and an owner-provided GA4 ID. None will be invented.
3. **Facts we cannot supply:** address, phone, social URLs, legal entity name, verified customer metrics, testimonials, case studies, author bios. These are listed as owner actions, not filled in.
4. **Keyword metrics** (volume, difficulty) need Google Keyword Planner / Search Console / Ahrefs / Semrush access. No numbers will be fabricated; the strategy will use relevance and intent only until data is supplied.
5. **Competitor and backlink research (Workstreams 6, 13)** needs web research; findings will cite sources and omit data that is not publicly available.
6. **Requested URLs vs reality.** `/products/site-vision` requires a slug rename plus a 301 from `/products/sitevision`; industry pages and blog are new content and will only be created where there is substantive, accurate copy to put on them.

## 5. Workstream checklist

Legend (see `SEO_FINAL_REVIEW.md` for the authoritative version): [x] implemented in code or docs on the branch (not live), [~] partly done or waiting on something, [ ] not started, [!] needs the owner or an external account. Nothing is deployed.

| # | Workstream | Status | Notes |
|---|---|---|---|
| 1 | Brand positioning and SEO foundation | [~] | Homepage H1, lead, CTAs, title, description rewritten for construction technology; product H1s now say what each product is. [!] Owner sign-off on wording |
| 2 | Keyword research and mapping | [~] | `SEO_KEYWORD_STRATEGY.md`: about 50 keywords, one primary per URL, cannibalisation, missing pages. Volumes and difficulty are "Not measured" [!] need Keyword Planner / Search Console / Ahrefs |
| 3 | Information architecture and landing pages | [~] | `/blog` and 3 articles added; `/products/site-vision` with 301; product pages upgraded. Industry pages **deliberately not built** (would be thin); criteria documented |
| 4 | Technical SEO | [~] | Prerender, hydration, canonicals, sitemap, headers, redirects, 404s done and tested. [!] nginx not run (no Docker); HSTS and www redirect on the host server |
| 5 | On-page SEO | [x] | One config (`data/seo.ts`), unique titles and descriptions enforced by tests, one H1 per page, single-copy heading text |
| 6 | Off-page SEO and backlink readiness | [~] | `OFF_PAGE_SEO_STRATEGY.md` (14 verified targets, profile text, tracker). [!] All outreach and account creation is the owner's |
| 7 | Content SEO and blog | [~] | Blog architecture and 3 launch articles done. 7 more topics in the backlog need real subject input. No case studies (none exist) |
| 8 | Local SEO | [!] | Documented in the off-page doc. A Google Business Profile probably does not qualify without a real address and phone; nothing was created or invented |
| 9 | Image and video SEO | [~] | og-image 212 KB to 98 KB; font preload; VideoObject on the four product pages (real upload dates). Not done: demo video re-encode (no ffmpeg), AVIF, 192/512 icons and manifest |
| 10 | AEO | [~] | Implemented in code: direct-answer box first on every article, question headings, FAQs on articles and products, consistent product descriptions. **The three articles are not live and are pending product-team approval** |
| 11 | GEO | [~] | `llms.txt` added (optional, no ranking claim); consistent profile text; organisation author. Earned third-party mentions need the owner's outreach |
| 12 | Structured data | [~] | Organization + WebSite (home), SoftwareApplication + VideoObject + BreadcrumbList (products), Article + BreadcrumbList (blog), BreadcrumbList (inner pages), all in the static HTML and tested. No FAQPage (not eligible). Person, sameAs, address, contact point pending owner. [!] Google Rich Results Test after deploy |
| 13 | Competitor analysis | [x] | `COMPETITOR_SEO_ANALYSIS.md`: 4 requested competitors plus Doxel and Contineu.ai, every claim sourced. Backlink and traffic data not available without paid tools |
| 14 | Analytics and tracking | [!] | Plan only (`SEO_ANALYTICS_SETUP.md`). Needs GA4 ID, Search Console ownership, consent decision, CSP change, privacy-policy update. No code added |
| 15 | Conversion optimisation | [~] | Second CTA on the hero, demo CTAs in every article and product page, product pages keep their demo flow. No fake trust signals. Event tracking waits on workstream 14 |
| 16 | Monitoring and roadmap | [~] | Docs and 26 automated SEO tests done. Actual monitoring (Search Console reporting, PageSpeed baselines) is external and not started |

## 6. Proposed execution plan

| Stage | Scope | Specialised agents |
|---|---|---|
| 1 | Audit (this document) | done |
| 2 | WS 1-5: prerender real HTML, single SEO config, canonical/redirect/header fixes, sitemap lastmod, homepage H1/positioning, slug redirect, SEO tests | rendering engineer, nginx/security, on-page content |
| 3 | WS 6-13: keyword and competitor docs, schema, product page upgrades, AEO sections, blog infrastructure, media optimisation | research agents, schema, media |
| 4 | WS 14-16: consent-aware analytics (placeholders only), conversion events, roadmap and monthly checklist | analytics, docs |
| 5 | Review: lint, typecheck, build, SEO tests, git diff review, deployment checklist. **No deployment without explicit approval.** | reviewer |

## 7. Owner actions already identified

- Confirm TLS, HSTS, http to https and www redirects on the front proxy.
- Provide or confirm: company address, phone, legal entity, social profile URLs, founder bio and sourcing for affiliation and founding year.
- Confirm or retract each product metric; confirm which are real production figures versus demo data.
- Confirm or edit the services list and About principles (CONFIRM markers).
- Provide Search Console and GA4 access or IDs; approve consent and privacy-policy changes.
- ~~Decide whether to rename `sitevision` to `site-vision`~~ Approved and implemented in Stage 2.

## 8. Stage 2 implementation (Workstreams 1-5)

### 8.1 What changed

**Prerendering (fixes C1).** The build renders every public route with the real React app and writes the result to `dist/<route>/index.html`; the browser hydrates that markup.
- `src/entry-server.tsx` (new): `render(url)` using React 19 `prerender` (`react-dom/static`) inside react-router's `StaticRouter`. `prerender` waits for Suspense, so lazy route chunks are in the output rather than a loading fallback.
- `src/main.tsx`: `hydrateRoot` when the page was prerendered, `createRoot` in the dev server.
- `scripts/postbuild.mjs` (rewritten): renders each route, moves the `<title>`, `<meta>` and `<link>` tags React emits into `<head>`, writes `404.html` and `sitemap.xml`. It no longer regex-patches head tags with hand-copied strings. The CSP-hash guard is kept.
- `package.json`: `build` also runs `vite build --ssr src/entry-server.tsx --outDir dist-server`; new `npm run test:seo`.
- `vite.config.ts`: the server build does not copy `public/` (49 MB of media) into `dist-server`.
- Browser-only code (three.js scenes, `window` and `document` use) already lived in effects or lazy chunks, so no component needed a server guard. `HeroFallback` now rounds its computed coordinates: Node and Chrome printed different last digits for `Math.sin/cos`, and React flagged the SVG as a hydration mismatch.
- No bot-specific rendering: every visitor and crawler receives the same HTML.

**Single SEO config (fixes H2, H3).** `src/data/seo.ts` holds title, description and index flag for every static page; product pages keep theirs in `src/data/products.ts`. `<Seo>` (`components/ui/Seo.tsx`) is the only place head tags are produced, and the pages spread `pageSeo('/path')` into it. The 404 page has no canonical. `index.html` no longer carries page-specific tags (they are inserted per route), so the live DOM has exactly one title and canonical per page.

**Sitemap (fixes M1).** Generated from the same config. `<lastmod>` is emitted only when a page's `modified` date in `src/data/seo.ts` is set; only blog pages carry dates so far (their real publish dates); other pages publish none until the owner sets them at deploy time. `<priority>` removed (ignored by Google). Set `modified` for a page only when its content really changes, ideally at deploy time.

**SiteVision URL (H5).** `slug: 'site-vision'`. nginx 301s `/products/sitevision` and `/products/sitevision/` straight to `/products/site-vision` (one hop). A client-side `<Navigate>` covers in-app navigation. Internal links, canonical, sitemap and the SoftwareApplication `url` follow the slug automatically. The enquiry API still takes the interest value `sitevision` (backend enum, deliberately unchanged), mapped by `interestForProduct()` in `lib/validation.ts`. Media filenames are unchanged.

**nginx (H4, M2, M3).** `nginx.conf` and the new `nginx-security-headers.conf` (installed by the Dockerfile as `/etc/nginx/snippets/security-headers.conf`):
- security headers and CSP are included in every location, so `/assets/`, `/media/`, `/api/` and `404.html` no longer lose them;
- `/about/` and `/about/index.html` 301 to `/about` (tested against `$request_uri`, so `try_files` cannot loop);
- `absolute_redirect off`, so redirects never downgrade to `http://` behind the TLS proxy;
- `X-Robots-Tag: noindex, nofollow` on `/api/`;
- unknown URLs return a real 404 with the prerendered NotFound page.

**Homepage and content.** H1 is now "AI-powered construction technology for the real world."; lead paragraph, `site.description`, title and meta description use the approved positioning; a second CTA "Request a Demo" sits beside "Explore Our Products". Unverified product metrics were removed; the founder section no longer states a founding year or named company affiliations. Privacy and Terms were left indexable at this stage; they were later set to `noindex` and removed from the sitemap pending legal review (section 12).

**Other.** Product titles for SiteVision (73 chars) and Parichay (86 chars) were shortened to fit search results. The old noscript blurb (with a second H1) was replaced by real prerendered content plus a small style that un-hides animation-initial text for visitors without JavaScript. `.gitignore`, `.dockerignore` and ESLint ignore `dist-server`.

### 8.2 Removed claims, kept here so the owner can verify and restore

| Product | Removed figures (as previously shown) |
|---|---|
| Anviksha | 10,000+ images processed; 150+ live users; 4 steps capture to report |
| SiteVision | 3 projects; 23 towers; 1,238 capture processes for AI progress |
| Digi Reco | 80,800 steel records processed; 2.5% steel wastage tracked; 100% digital record traceability |
| Parichay | 10 sites; 23,538 cards generated; 1 card per worker |

Digi Reco's own FAQ says figures in its demonstration are demo data. To restore one: re-add `metrics` to the product in `src/data/products.ts`, remove its string from the `unverified` list in `scripts/seo.test.mjs`, and label demo values as demo or sample data. Do not use any of these in schema, articles or descriptions until verified.

Founder section: removed "Founded in 2025" and the Promoter Group affiliation with named companies. Retained: name, title (Founder & CEO), the mission sentence and the description of the role. Re-add details only with the founder's written sign-off.

### 8.3 What was tested

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run lint` | pass |
| `npm run build` (client, server bundle, postbuild) | pass: 12 prerendered routes, 11 sitemap URLs, 404.html |
| `npm run test:seo` (17 tests at the end of Stage 2; now 24) | 17 pass at that time |
| Hydration in headless Chrome, production build, 14 URLs | no errors; 1 title and 1 canonical in the live DOM on every page |
| Hydration in headless Chrome, development React build (readable warnings) | clean on `/`, `/about`, `/products/site-vision` after the globe fix |
| Desktop render with reduced motion | headline, lead, both CTAs and product strip render correctly |
| Live TLS layer probe (`curl`) | http to https 301 works; **no HSTS header; `www` serves 200 (duplicate host)** |

`test:seo` asserts: every route prerendered with real content; one H1; one title, description and canonical; canonical equals the production URL; unique, sensibly sized titles and descriptions; noindex flags match config and noindex pages are not in the sitemap; 404 is noindex without canonical; sitemap validity, canonical form and no invented dates; robots.txt; every internal link resolves; the retired slug is not linked; JSON-LD parses with no duplicate types; no unverified claims; the homepage names the industry.

### 8.4 Known limitations and not verified

- **nginx was not executed.** Docker's engine is not running on this machine and nginx is not installed, so `nginx.conf` (redirects, include snippet, 404) was checked by reading only. Run the commands in `SEO_DEPLOYMENT_CHECKLIST.md` before deploying.
- **No true mobile-width screenshot.** Headless Chrome will not render below about 500 px wide here. The longest hero word is the same length as before ("construction" vs "Intelligence"), so overflow is not expected, but check on a real phone.
- **Unknown product URLs** (`/products/foo`): the shared 404 page is prerendered without knowing it sits under `/products`, so the "Products" nav highlight differs and dev builds log an attribute warning. Content is identical and the server still returns a true 404. Cosmetic, left as is.
- **Without JavaScript**, headlines are visible (noscript style) but scroll-reveal animations do not run.
- **Hero reveals** (`TextReveal`) still start at opacity 0 until the animation runs. This is existing behaviour and its LCP effect is unmeasured (Stage 3, performance).
- **PageSpeed and Core Web Vitals** were not measured this stage.
- **Rich Results Test and Schema.org Validator** not run (they need the deployed URL). Structured data is unchanged apart from now being present in the static HTML.

## 9. Stage 2 final review (before Stage 3)

Full `git diff` reviewed (27 modified, 5 new files at that point), against `SEO_DEPLOYMENT_CHECKLIST.md`.

| Check | Result |
|---|---|
| Unrelated changes in the diff | None. All changes are SEO, build or nginx related |
| `CLAUDE.md` | Untouched (still untracked, as before this work) |
| Prerendering and hydration | Clean in headless Chrome on every route, development and production builds |
| Canonicals, metadata, sitemap, robots.txt, structured data | Covered by `npm run test:seo` |
| Redirects | **One bug found and fixed:** the `/index.html` rule would also have matched names like `/myindex.html`. Tightened to match only `index.html`. The two redirect expressions were then tested against 12 URLs in a JavaScript regex harness (the engines agree for these patterns) |
| nginx | **Still not executed** (Docker engine unavailable, nginx not installed). Tracked as an external task |

## 10. Stage 3 implementation (Workstreams 6-13)

### 10.1 Product pages and headings (WS 1, 3, 5)

- Product H1 now says what the product is, for example "AI construction quality inspection software Anviksha" (descriptor from `data/products.ts`; the animated name keeps its design). The accessible name is "Anviksha: AI construction quality inspection software".
- "The problem" and "The solution" titles are real `<h3>` headings (they were paragraphs).
- **Sitewide fix:** animated headings used to carry two copies of their text in the HTML (a hidden duplicate plus letter-by-letter spans), so anything reading the HTML as text saw each H1 twice. `TextReveal` now names the heading once with `aria-label`, keeps a single copy in the DOM with spaces between lines. A test fails the build if an H1 is duplicated.

### 10.2 Structured data (WS 12)

`src/lib/schema.ts` is the only place JSON-LD is built; entities are linked by `@id` so none conflict.

| Page | Types |
|---|---|
| Home | Organization (name, URL, PNG logo, description), WebSite |
| Product pages | SoftwareApplication (category BusinessApplication, feature list, image, screenshots), VideoObject (real upload date from git history), BreadcrumbList |
| Products | ItemList, BreadcrumbList |
| Blog, articles | BreadcrumbList; Article with an Organization author and real dates |
| About, Services, Contact, Privacy, Terms | BreadcrumbList |

Not included on purpose: ratings, reviews, prices, offers, customer counts, awards, email, address, telephone, `sameAs` and `founder` (all pending owner input), FAQPage (Google no longer shows it for most sites), and a Person author (none named yet). The tests fail on any of these appearing.

Pending validation: Google Rich Results Test and the Schema.org Validator need the deployed URLs. The VideoObject describes a video that opens from a "Watch the demo" button, so Google may not index it as a video page; it is still accurate metadata.

### 10.3 Blog and content (WS 7, 10)

See `CONTENT_SEO_STRATEGY.md`. `/blog`, `/blog/:slug`, three articles (digital inspection guide, manual vs AI inspection, 360° documentation; **implemented, not live, pending product-team approval**), each with a direct answer first, table of contents, FAQ, product and article links. Blog is in the main navigation and footer, in the sitemap with real dates, and covered by tests (at least 500 words, product link, answer box, FAQ, Article schema).

### 10.4 Image and video (WS 9)

- `og-image.png` 212,673 to 97,649 bytes, same 1200x630 size; visually checked. Its text still reads "AI Products · Enterprise Engineering"; a new image matching the new positioning needs a designer [!].
- The two Latin variable fonts that paint the headline and body are preloaded on every page (hashed names looked up at build time).
- VideoObject structured data for the four demos.
- Not done: the demo videos (9-14 MB each, 47 MB total) are not re-encoded because there is no ffmpeg here; no AVIF; no 192/512 icons or manifest. The existing stills already use WebP with `srcset`, dimensions, lazy loading and descriptive alt text, and were left as they are.

### 10.5 GEO (WS 11)

`public/llms.txt` lists the real pages. It is optional, is not a ranking factor, and no inclusion in AI answers is promised. A test checks that every URL in it is a real indexable page.

### 10.6 Research documents (WS 2, 6, 8, 13)

Written by research agents using live web searches and page fetches, then spot-checked: `SEO_KEYWORD_STRATEGY.md`, `OFF_PAGE_SEO_STRATEGY.md` (includes local SEO and the company profile), `COMPETITOR_SEO_ANALYSIS.md`. Key points: no search volumes or difficulty were fabricated ("Not measured"); competitors' backlinks and traffic are marked unavailable; unverifiable targets were dropped and listed; the Google Business Profile finding is that a purely online company probably does not qualify.

### 10.7 What was tested in Stage 3

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run lint` | pass |
| `npm run build` | pass: 16 prerendered routes, 15 sitemap URLs at that time (now 9: drafts, `/blog`, `/privacy`, `/terms` are excluded), `404.html` |
| `npm run test:seo` | 24 of 24 passed at that time (now 26) |
| Hydration, headless Chrome, 14 routes, production and development builds | no errors; one title and one canonical per page |
| Visual check (desktop, reduced motion): product page, blog list, article | renders as designed |
| Control-character scan of every changed file | none found (a stray backspace character from a scripting slip was found in the test file and fixed) |

### 10.8 Limitations and not verified

- nginx not run; HSTS and www redirect not done (host server, owner).
- Mobile layout checked only by reasoning; real phone test pending.
- Core Web Vitals, PageSpeed, Rich Results Test, Schema.org Validator not run (need the deployed site).
- Hero and heading reveal animations still start at opacity 0 until JavaScript runs (existing behaviour); text is in the HTML, but its effect on LCP is unmeasured.
- Articles are written to be accurate and cautious, not exhaustive; they should be reviewed by the product teams before publishing.
- Keyword demand, competitor backlinks and traffic are unknown without paid tools.
- Industry pages, case studies and testimonials do not exist and were not fabricated.

## 11. Change log

| Date | Stage | Change |
|---|---|---|
| 2026-11-04 | 1 | Created branch; wrote this audit. No code changes. |
| 2026-11-04 | 2 | Prerendering, central SEO config, sitemap, nginx and redirect fixes, SiteVision slug, homepage positioning, claim removal, SEO tests. Uncommitted. |
| 2026-11-04 | 2 review | Reviewed the full diff; tightened the `/index.html` nginx rule. |
| 2026-11-04 | 3 | Product H1s, structured data module, blog and 3 articles, llms.txt, og-image compression, font preload, single-copy headings, research docs, extra tests. Uncommitted. |
| 2026-11-04 | Final review | Full diff and behaviour review; competitor AI-crawler count corrected; article review gate added (`review` flag, build warning, `SEO_REQUIRE_REVIEWED=1`); docs made consistent; added `SEO_FINAL_REVIEW.md`, `SEO_PRODUCT_CONTENT_REVIEW.md`, `SEO_PRODUCTION_READINESS.md`. |

## 12. Owner decisions applied after the final review (2026-11-04)

- **Parichay Aadhaar and phone duplicate check:** confirmed by the owner; the capability and its description are kept unchanged. No claims on UIDAI integration, legal compliance, encryption, retention or consent. Legal and product review stays documented, with no removal.
- **Articles:** remain `review: 'pending'` in the repository and are hidden drafts: noindex, out of the sitemap, nav, footer, `/blog` list and `llms.txt`, with a DRAFT banner. `/blog` is noindex while nothing is approved. The strict build gate (`SEO_REQUIRE_REVIEWED=1`) is preserved. Review package: `SEO_BLOG_CONTENT_REVIEW.md`.
- **Privacy and Terms:** `noindex` and out of the sitemap until legal review; footer and contact-form links kept; legal text unchanged.
- **Sitemap now has 9 URLs.** The earlier "15 URLs" and "24 tests" figures in sections 8 to 10 describe the state at that time.

| Date | Stage | Change |
|---|---|---|
| 2026-11-04 | Owner decisions | Draft-article gating (noindex, sitemap, nav, footer, list, llms.txt, banner), blog placeholder, Privacy/Terms noindex, 2 new tests, blog review package. |
