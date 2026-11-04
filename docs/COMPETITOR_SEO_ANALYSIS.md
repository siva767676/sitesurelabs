# Competitor SEO Analysis: SiteSureLabs

> **How to read status in these SEO documents.** **Implemented in code** = on branch `feature/sitesurelabs-seo-implementation`, uncommitted, **not deployed and not live** on sitesurelabs.com. **Owner action** = needs you: an account, an approval, a fact only the company knows, or access to the live server. **External activity** = outreach, listings, directory or social accounts, paid tools, third-party validators: **none of it has been done**, and nothing is claimed as done. Authoritative status of all 16 workstreams: `SEO_FINAL_REVIEW.md`.

Prepared 2026-11-04. This is research only: no code depends on it, and it needs no deployment. Findings on competitors' backlinks, traffic and rankings are intentionally absent (they require paid tools). All competitor facts below were read from public pages and sitemaps on **2026-11-04** (accessed 2026-11-04); the source URL is given with each block. Quoted strings are short title/H1 excerpts only. Nothing here is a traffic, ranking, keyword-volume or backlink figure. "Observed terms" means wording seen in titles, meta descriptions and H1s, not search demand.

SiteSureLabs context (from `frontend/src/data/products.ts`): Anviksha (AI construction quality inspection, defects rated from site photos), SiteVision (360 degree capture against floor plans, tours, AI progress tracking), Digi Reco (steel/material reconciliation from site workbooks), Parichay (worker registration and entry passes). Company location, customers and metrics are unknown and are not assumed anywhere in this document.

## 1. Competitor findings

### 1.1 Procore (procore.com)

- **Architecture** (accessed 2026-11-04; https://www.procore.com/, https://www.procore.com/server-sitemap.xml). Locale-prefixed paths (my fetch was served `/en-sg/`; other prefixes seen: en-au, en-ca, en-gb, en-ae, fr, fr-ca, es, de). Top-level pages: `/platform`, `/products`, `/ai`, `/project-execution`, `/project-lifecycle-management`, `/cost-management`, `/resource-management`, `/quality-safety` (with `/inspections`, `/observations`, `/forms`, `/incidents`, `/site-diary`, `/action-plans`, `/iso-standards`), and role pages `/general-contractors`, `/owners`, `/subcontractors`, `/professional-services`. AI has its own subtree: `/ai/agents/<task>` (for example `field-observations`, `photo-analyst`, `site-safety`, `daily-log`). Industries are expressed as role pages rather than building-type pages in what I saw.
- **Positioning.** Homepage title "Construction Project Management Software | Procore"; H1 "Construction Project Management Software"; meta description about connecting site and office with real-time visibility (https://www.procore.com/). Main-contractor page title "Procore for Main Contractors | Construction Management Software | Procore", H1 "The #1 end-to-end construction management solution for main contractors" (https://www.procore.com/en-sg/general-contractors). Project-execution page title "Construction project execution | Procore" (https://www.procore.com/en-sg/project-execution). The `/ai/agents/field-observations` page returned only the generic site title and no H1 in static HTML, so its on-page positioning is **not retrievable** by plain fetch (likely client-rendered).
- **Observed terms:** construction project management software, construction management software, project execution, main contractors, quality and safety, AI agents.
- **Content scale** (sitemap https://www.procore.com/server-sitemap.xml): 6,243 `<loc>` entries across all locales. Roughly 250-285 `/blog` URLs per locale, 461 URLs total in the `en-sg` locale, with `/casestudies` (20 in en-sg), `/ebooks` (23), `/webinars` (5). A second sitemap, `/jobsite/sitemap.xml`, returned no parseable `<loc>` entries: unknown.
- **Conversion.** CTAs seen: "Request a demo", "Contact us", "contact sales" (role pages). Demo flow lives under `/offer/demo/...`. Ebooks and ROI reports sit under `/ebooks/` (gating not verified).
- **Demonstration.** A `/video-tour` page and `/whats-new` exist (links in homepage HTML). Interactive demo not observed.
- **Structured data.** Homepage: Organization only. Role and execution pages: FAQPage / Question / Answer. Product pages with no JSON-LD seen (field-observations page).
- **robots/sitemap.** robots.txt present, allows all except `/snapengage/` and `/testflight/`; declares two sitemaps (https://www.procore.com/robots.txt).

### 1.2 Autodesk Construction Cloud (construction.autodesk.com)

- **Naming note.** The homepage meta description reads "Autodesk Forma (formerly Autodesk Construction Cloud)", so the brand is mid-rename (https://construction.autodesk.com/). Search-facing naming is therefore split.
- **Architecture** (https://construction.autodesk.com/, https://construction.autodesk.com/sitemap.xml). `/products/<name>/` (autodesk-build, autodesk-docs, autodesk-takeoff, autodesk-estimate, buildingconnected, plangrid, assemble, model-management bundles), `/solutions/<audience>/` (general-contractors, owners, specialty-contractors, designers, commercial, industrial, infrastructure, institutional, sustainability), `/workflows/`, `/pricing/<product>/`, `/product-tour/<name>/`, `/resources/` (general-contractor, owner, subcontractor, customer-success-stories), `/webinars/`, `/champion/`, `/big-room/`, `/master-class/`, `/events/`, `/partners/`. Industries and sectors are explicit (commercial, industrial, infrastructure, institutional). Autodesk Build's product URL 301-redirects to `autodesk.com/products/forma-build/overview`, which returned 403 to my fetch: **not retrievable**.
- **Positioning.** Homepage title "Construction Management Software | Autodesk Construction Cloud", H1 "CONSTRUCTION MANAGEMENT SOFTWARE". GC page title "General Contractor Software | Autodesk Forma", H1 "General Contractor Software" (https://construction.autodesk.com/solutions/general-contractors/).
- **Observed terms:** construction management software, general contractor software, bid management, takeoff, model management.
- **Content scale.** `sitemap.xml` holds 230 `<loc>` entries (53 under `/champion`, 29 `/tools`, 27 `/go`, 21 `/workflows`, 19 `/products`, 13 `/webinars`). A separate resources sitemap index lists 76 child sitemaps (their contents not counted): total unknown.
- **Conversion.** "Get Demo", "Watch video", "Contact Us" with a phone number, and a visible public pricing section with "get-pricing" form pages (`/contact/get-pricing/`). Product tours are separate pages (7 listed in sitemap).
- **Demonstration.** Dedicated `/product-tour/` pages plus video.
- **Structured data.** Organization only on pages fetched.
- **robots/sitemap.** Present; allows all, disallows `/meet/`, `/sitecon/`, `/precon/`, `/trial/...`, `/editor`, one report path; three sitemap declarations (https://construction.autodesk.com/robots.txt). The main `autodesk.com` robots endpoint returned Access Denied to my client.

### 1.3 OpenSpace (openspace.ai)

- **Architecture** (https://www.openspace.ai/, https://www.openspace.ai/sitemap.xml). WordPress. `/platform/` (capture, coordinate, act, ai-agents-and-apis), `/products/<name>/` (capture, air, field, progress-tracking, bimplus, mobile-app, walk-services), `/solutions/<audience>/`, and a distinctive `/resources/use-cases/<topic>/` set (qa-qc, punch-lists, safety, documentation, coordination, insurance-costs, remote-work). Locale folders `/de/`, `/ja/`, `/nl/`.
- **Positioning.** Homepage title "OpenSpace: The Visual Intelligence Platform for Builders", H1 "The Visual Intelligence Platform for the built world". Capture page title "360 reality capture software for construction | OpenSpace", H1 "Capture your site. See clearly." QA/QC page title "Construction Quality Control Software | OpenSpace", H1 "Construction quality control, with nothing missed" (https://www.openspace.ai/resources/use-cases/qa-qc/). Progress page title "Construction Progress Tracking Software | OpenSpace".
- **Observed terms:** visual intelligence, 360 reality capture, quality control, progress tracking, punch lists, QA/QC.
- **Content scale** (child sitemaps, `<loc>` counts): posts 280, pages 153, case studies 89, videos 65, webinars 79, podcasts 22, news 167, use cases 25, ebooks 5, data sheets 13, learning hub 14, events 27, press releases 36, solutions 13. This is the most diversified content-type mix of the set.
- **Conversion.** "Get a demo", "Interactive Demo", "Pricing" visible on product pages; pricing page exists.
- **Demonstration.** Interactive demo plus imagery of plan-mapped 360 views.
- **Structured data.** Rich: Organization, WebSite/SearchAction, SoftwareApplication, Offer, BreadcrumbList, FAQPage, and HowTo/HowToStep on the QA/QC page.
- **robots/sitemap.** robots.txt carries a Content-Signal line (ai-train/search/ai-input = yes) and explicitly names AI crawlers; single sitemap index (https://www.openspace.ai/robots.txt).

### 1.4 Buildots (buildots.com)

- **Architecture** (https://buildots.com/, https://buildots.com/sitemap_index.xml). WordPress. `/product/`, `/product/capture-services/`, `/construction-intelligence-platform/`, `/solutions/<topic-or-sector>/` mixing sectors (airports, commercial, data-centers, education) and problems (delay-risk-mitigation, deviation-detection), `/case-studies/`, `/blog/`, `/resources/webinar/`, `/resources/whitepaper/`, plus a research-style `/lab/` section with sector, content-type and region taxonomies.
- **Positioning.** Homepage title "Construction Intelligence Platform | Buildots", H1 "Construction intelligence to power your whole operation." Product page title "Construction Management Software | Buildots", H1 "Turn construction into a predictable, efficient machine." (https://buildots.com/product/).
- **Observed terms:** construction intelligence platform, construction management software, delay prediction, deviation detection, element-level monitoring.
- **Content scale** (child sitemaps): pages 59, blog 105, case studies 14, lab 14.
- **Conversion.** Single dominant "Get a demo" (`/demo/`), "Contact us".
- **Structured data.** Organization, WebSite/SearchAction, BreadcrumbList, WebPage, ImageObject; FAQPage on the product page.
- **robots/sitemap.** Standard WordPress robots (blocks wp-admin, wp-includes); one sitemap index.

### 1.5 Adjacent, verified additions

- **Doxel (doxel.ai)** (https://doxel.ai/, https://doxel.ai/product, https://doxel.ai/sitemap.xml). Relevant because it competes with SiteVision's AI progress tracking. Homepage title "Doxel: Construction's most complete progress tracking"; H1 "Physical Intelligence for Construction"; product H1 "Track. Optimize. Deliver." The product-page meta description carries a "95%" tracking-time claim and an "11%" delivery claim: these are Doxel's own marketing claims, unverified by me. 122 sitemap URLs (61 under `/blog`), stakeholder pages (`/stakeholder/owners`, `superintendents`, `bim-vdc`, `project-executives`) and "Get a Demo" CTAs. No JSON-LD seen. robots.txt contains only a sitemap line.
- **Contineu.ai (contineu.ai)** (https://contineu.ai/, https://contineu.ai/sitemap.xml). Relevant because it is the closest in subject to Anviksha: its meta description describes an "AI-native construction site capture and defect detection platform built for real estate developers in India". Search coverage (YourStory, Indian Startup News) places it in Bengaluru. Title "Contineu — The 360 site visibility platform", H1 "Find defects on your site using 360 cameras". Sitemap: 16 URLs, mostly static `.html` blog posts with defect-focused topics (for example slugs on defect types, snag list turnaround, low-bandwidth sites). JSON-LD includes SoftwareApplication, Organization, WebSite, Country. Its robots.txt is annotated as welcoming AI crawlers. Small and early; scale unknown.

## 2. Comparison table

| | Procore | Autodesk (Forma/ACC) | OpenSpace | Buildots | Doxel | Contineu |
|---|---|---|---|---|---|---|
| Homepage H1 theme | Project management software | Construction management software | Visual intelligence | Construction intelligence | Physical intelligence / progress tracking | Defects from 360 cameras |
| Sub-products with own URLs | Yes (modules, AI agents) | Yes (many products) | Yes (7 products) | Few (product, capture services) | One product page | Single product |
| Industry/sector pages | Role-based | Sector and role | Role, use case | Sector and problem | Stakeholder | Not seen |
| Quality/inspection pages | Yes (`/quality-safety/*`) | Not verified | Yes (`/use-cases/qa-qc`) | Deviation detection | No | Core |
| Content types seen | Blog, case studies, ebooks, webinars | Webinars, tours, workflows, events | Blog, case, video, webinar, podcast, ebook, data sheet, hub | Blog, case, whitepaper, webinar, lab | Blog | Blog |
| Sitemap URL count (counted) | 6,243 (all locales) | 230 + 76 child sitemaps | about 1,000+ across child sitemaps (my sum of those listed: roughly 1,060) | about 205 | 122 | 16 |
| Primary CTA | Request a demo | Get Demo, pricing | Get a demo, Interactive Demo | Get a demo | Get a Demo | Contact |
| Public pricing | Not seen | Yes | Pricing page | Not seen | Not seen | Not seen |
| JSON-LD seen | Organization, FAQPage | Organization | Rich (SoftwareApplication, HowTo, FAQ) | WebSite, FAQ, Breadcrumb | None | SoftwareApplication |

## 3. Cross-cutting observations

- Generic head terms ("construction management software", "construction project management software") are held by Procore and Autodesk; OpenSpace and Buildots deliberately differentiate with category labels ("visual intelligence", "construction intelligence") plus feature pages carrying plain descriptive titles ("Construction Quality Control Software", "Construction Progress Tracking Software").
- The strongest SEO structure in the set is OpenSpace: use-case pages for named jobs, schema on those pages, and many content types.
- Demo-request is the universal conversion path; none of the pages I read presented a self-serve trial as the primary action. Ebooks sit in their own sections; whether forms gate downloads was not verified.
- AI crawlers (re-checked against each live robots.txt on 2026-11-04): **two of the six sites name AI crawlers explicitly, and both allow them.** OpenSpace lists seven (GPTBot, ClaudeBot, PerplexityBot, CCBot, anthropic-ai, OAI-SearchBot, Google-Extended) and adds a `Content-Signal: ai-train=yes, search=yes, ai-input=yes` line; Contineu lists ten (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, anthropic-ai, PerplexityBot, Google-Extended, Applebot-Extended, CCBot) with `Allow: /`. Procore, Autodesk (construction.autodesk.com) and Buildots use a single generic group with no AI-specific rule, and Doxel's file has only a Sitemap line, so these four allow AI crawlers by default rather than by declaration. **None of the six blocks an AI crawler by name.** The main autodesk.com robots.txt could not be retrieved (403). An earlier draft of this line said "three of six" while naming four sites; that was wrong.

## 4. What SiteSureLabs can do better or differently

1. **Own narrow, named jobs rather than "construction management".** The large suites cover quality control as one module among many. Pages dedicated to site quality inspection, snag/defect lists, defect severity rating and inspection reports (Anviksha) can be more specific than Procore's module pages. OpenSpace's use-case pattern shows the format works; SiteSureLabs can adapt it with its own wording and demonstrated workflow.
2. **Steel and material reconciliation (Digi Reco) and worker entry passes (Parichay).** In the sitemaps and navigation I read, I did not see dedicated pages for these two jobs at any of the six competitors. That suggests low direct competition on those phrases, but it may equally mean low demand. Needs keyword-volume checking before investment.
3. **Show real demos honestly.** Competitors use interactive demos and tours. SiteSureLabs has demo videos and stills; per-product demo pages with transcripts and captions are plain, crawlable content. Label anything from demonstrations as demo data.
4. **Structured data on every product page.** SoftwareApplication, BreadcrumbList and FAQPage on each product page; HowTo on workflow pages. Only OpenSpace does this comprehensively.
5. **Glossary and how-to content** (what is a snag list, what is steel reconciliation, how worker induction passes work). Only a few of the sitemaps I read showed glossary-style content; this is an opening, subject to verification of demand.
6. **Emerging-market / India angle: hypothesis, unverified.** Contineu positions explicitly for Indian developers, and Procore and OpenSpace publish regional pages, but SiteSureLabs' location and market are unknown. If it does serve such markets, topics like low-bandwidth sites, local compliance and entry-pass regulation could be differentiating. Do not publish market claims without confirmation from the business.
7. **Four-product cohesion.** A single company covering inspection, capture, reconciliation and entry control can use one "site ecosystem" hub linking to the four products, a story the single-purpose competitors cannot tell.

## 5. What not to copy

- Taglines and invented category names such as "visual intelligence" or "construction intelligence": they are competitor-owned brand language.
- Competitor statistics (for example Doxel's percentages, OpenSpace's project counts): do not repeat them; SiteSureLabs has no verified metrics.
- Superlatives like "#1": unverifiable for us.
- Locale-prefix sprawl (Procore's about nine locale blog copies): high maintenance for a small team; add hreflang only when a translated page genuinely exists.
- Generic head-term targeting ("construction management software") against Procore and Autodesk; the products do not describe that scope.
- Heavy gating of all content: it would hide the text search engines need; test it before adopting it.
- Client-side-only rendering for product copy: the Procore AI agent page showed only a generic title in static HTML. SiteSureLabs should keep pre-rendered titles, H1s and schema.

## 6. Gaps we cannot assess without paid tools

- **Backlink profiles, referring domains, domain authority:** requires Ahrefs, Semrush or Moz. Unavailable here; not estimated.
- Organic traffic, keyword rankings, keyword volumes and difficulty, SERP features owned, paid-search spend.
- True indexed page counts (sitemaps show only submitted URLs; Autodesk's 76 resource child sitemaps and Procore's second sitemap were not counted).
- Core Web Vitals field data, gated-content behaviour and form fields, conversion rates, brand-search demand for each competitor, and the actual demand for steel reconciliation or entry-pass queries.

## 7. Pages not retrievable

- https://construction.autodesk.com/products/autodesk-build/ redirected to https://www.autodesk.com/products/forma-build/overview, which returned 403.
- https://www.autodesk.com/robots.txt: Access Denied.
- Procore `/ai/agents/field-observations`: fetched but returned only a generic title and no H1 (rendered client-side); positioning not retrievable.
- Procore `/jobsite/sitemap.xml`: no parseable URL entries.
- Procore localisation: my request was served the `/en-sg/` locale; other regional variants were not compared.

## 8. References (all accessed 2026-11-04)

- https://www.procore.com/ , /robots.txt , /server-sitemap.xml , /en-sg/general-contractors , /en-sg/project-execution , /en-sg/ai/agents/field-observations
- https://construction.autodesk.com/ , /robots.txt , /sitemap.xml , /solutions/general-contractors/ , /products/autodesk-build/
- https://www.openspace.ai/ , /robots.txt , /sitemap.xml (and child sitemaps), /products/capture/ , /products/progress-tracking/ , /resources/use-cases/qa-qc/
- https://buildots.com/ , /robots.txt , /sitemap_index.xml (and child sitemaps), /product/
- https://doxel.ai/ , /product , /robots.txt , /sitemap.xml
- https://contineu.ai/ , /robots.txt , /sitemap.xml
- https://yourstory.com/2025/09/contineu-ai-startup-construction-quality-checks-india (search result, location and category context only; not fetched)
