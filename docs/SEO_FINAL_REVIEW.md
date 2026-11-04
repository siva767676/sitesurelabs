# SiteSureLabs: SEO Final Review (Stages 2 and 3)

Reviewed 2026-11-04 on branch `feature/sitesurelabs-seo-implementation`. **Nothing is committed, merged or deployed, and the live server was not modified.** Stage 4 (analytics) has not started.

> **How to read status in these SEO documents.** **Implemented in code** = on the feature branch, uncommitted, not deployed and not live. **Owner action** = needs you or a named team. **External activity** = done outside the repo; none of it has been done. This file is the authoritative status record; the other seven SEO documents and `SEO_PRODUCT_CONTENT_REVIEW.md` and `SEO_PRODUCTION_READINESS.md` support it.

## 1. Overall assessment

**The engineering work is complete and verified to the extent possible without Docker, a phone or the live site. The site is not ready to deploy, because of approvals and unverified infrastructure, not code defects.**

What was verified in this review (re-run today, from a clean build):

| Check | Result |
|---|---|
| `npm run typecheck`, `npm run lint` | pass |
| `npm run build` | pass: 16 prerendered routes, **9** sitemap URLs, `404.html`. A warning lists the three unapproved articles |
| `npm run test:seo` | **26 of 26 pass** (24 earlier, plus tests for draft-article gating and the Privacy/Terms noindex) |
| `SEO_REQUIRE_REVIEWED=1 npm run build` | **refuses**, as designed, while articles are pending |
| All 16 routes plus an unknown URL, in headless Chrome (production build) | one H1, one title, one canonical (none on the 404), **no hydration or console errors** |
| Hydration in the development React build (readable warnings) | clean on all routes checked after the final changes |
| Sitemap | exactly the **9** indexable URLs. Excluded by design: the three draft articles, `/blog` (noindex while no article is approved), `/privacy` and `/terms` (noindex until legal review), `/products/progress-tracker`, and `404.html` |
| Unique metadata, product H1s | enforced by tests; each product H1 names the product and what it does |
| Structured data | all JSON-LD parses; no duplicate entity types; only on-domain URLs; no ratings, reviews, offers, address, email, telephone, `sameAs`. **Google's validators not run (need the live site)** |
| Internal links and canonicals | every internal link resolves to a prerendered page or file; canonical equals the production URL on every page |
| Removed claims | tests fail the build if "150+", "80,800", "100% traceability", "23,538", "Promoter Group", "Maha Cement", "Founded in 2025" and similar return |
| Backend, `docker-compose.yml`, env files | **no changes** |
| `CLAUDE.md` and AWS configuration | **untouched** (`CLAUDE.md` is still untracked, as it was before this work; no AWS-related path in the diff) |
| Diff scope | every application change is SEO, rendering, hydration or build related (see section 1.1) |

### 1.1 Why each non-obvious application change exists

| Change | Reason |
|---|---|
| `Hero.tsx`, `site.ts`, `About.tsx`, `products.ts` metrics | positioning, claim removal and founder softening you approved |
| `HeroFallback.tsx` (rounded coordinates) | server and browser printed different last digits, causing a hydration mismatch |
| `Footer.tsx` (`suppressHydrationWarning`) | year computed at render time would mismatch after New Year |
| `TextReveal.tsx` | heading text appeared twice in the HTML; now once, with a space between lines |
| `ContactForm.tsx`, `validation.ts` | the page slug became `site-vision` but the API still accepts only `sitevision` |
| `main.tsx` | hydrate prerendered pages |
| `PageVisuals.tsx`, `App.tsx` | slug rename and a client-side redirect |
| `vite.config.ts`, `package.json`, `.gitignore`, `.dockerignore`, `eslint.config.js`, `Dockerfile`, `nginx*.conf` | build, prerender and server configuration |

### 1.2 Issues found and fixed during this review

1. **Digi Reco H1 overstated the product** ("steel and material reconciliation"). The product covers steel only. Fixed to "Construction steel reconciliation software".
2. **Competitor doc said "three of six sites welcome AI crawlers" while naming four.** Re-checked against each live robots.txt: **two of six name AI crawlers** (OpenSpace names 7, Contineu 10, both allowing them); the other four use a generic group or none, and none blocks an AI crawler. Corrected.
3. **Articles could have been deployed unreviewed.** Added a `review` flag per article, a build warning, and `SEO_REQUIRE_REVIEWED=1` strict mode.
4. **nginx `/index.html` rule** was too broad (earlier in this phase; fixed and re-tested offline).
5. **Docs:** articles relabelled "implemented, not live, pending approval"; a status legend added to all documents; code vs external activity separated; owner-input checklist added.

### 1.3 Owner decisions applied after this review (2026-11-04)

- **Parichay:** the Aadhaar and phone-number cross-site duplicate check is **owner-confirmed**. The capability and its description on the site are kept unchanged. The data-handling and Privacy Policy review stays documented for the product team and legal counsel and does **not** lead to removing or weakening the feature. No new claims about UIDAI, legal compliance, encryption, retention or consent were added.
- **Articles:** all three stay in the repository as `review: 'pending'`, are hidden (noindex; not in the sitemap, nav, footer, blog list or `llms.txt`; DRAFT banner), and the strict build gate is preserved. A full review package for you is in `SEO_BLOG_CONTENT_REVIEW.md`. I did not approve them.
- **Privacy and Terms:** temporarily `noindex` and out of the sitemap; footer and contact-form links kept; no legal content changed.
- **Homepage wording:** approved by the owner; unchanged.

## 2. Workstream status (1 to 16)

"Implemented" means in code on the branch, **not live**. "External" means done outside the repo, **not started**.

| # | Workstream | Implemented in code or docs | External / owner-dependent | Overall |
|---|---|---|---|---|
| 1 | Brand positioning and SEO foundation | Homepage H1, lead, CTA, title, description; product H1s say what each product is (Digi Reco corrected today) | **Owner:** approve the wording | Implemented; awaiting approval |
| 2 | Keyword research and mapping | `SEO_KEYWORD_STRATEGY.md`: about 50 keywords, one primary per URL, cannibalisation, missing pages | **External:** volume and difficulty ("Not measured") need Keyword Planner, Search Console, Ahrefs or Semrush | Strategy done; **data missing** |
| 3 | Architecture and landing pages | `/blog` placeholder and article template (drafts hidden), product pages, `/products/site-vision` with 301 | Industry and service pages **deliberately not built** (would be thin). **Owner/teams:** substantive content needed | Partly done |
| 4 | Technical SEO | Prerender, hydration, canonicals, sitemap, headers, redirects, real 404s, tests | **Docker:** nginx syntax and matrix not run. **Server:** HSTS, www redirect, certificate coverage | Code done; **production verification pending** |
| 5 | On-page SEO | One config, unique titles and descriptions, one H1 per page, tested | none | **Done in code** |
| 6 | Off-page and backlinks | `OFF_PAGE_SEO_STRATEGY.md` (14 verified targets, profile text, tracker) | **All of it external and owner-led:** outreach, listings, accounts. Nothing has been done | **Strategy only; not started** |
| 7 | Content SEO and blog | Blog architecture; three articles written and fact-checked against the product data. **As drafts: noindex, out of the sitemap, nav, footer, blog list and `llms.txt`; the strict build refuses them** | **Owner:** personal review and approval (`SEO_BLOG_CONTENT_REVIEW.md`), then product teams. Seven backlog topics need subject input; no case studies exist | Implemented as drafts; **not approved** |
| 8 | Local SEO | Documented in the off-page doc | **Owner:** a Google Business Profile probably needs a real address and phone, and may not suit an online-only company. Nothing created | **Blocked on owner facts** |
| 9 | Image and video SEO | og-image 212 KB to 98 KB; fonts preloaded; VideoObject (real dates); existing stills already optimised | **Designer:** new og-image. **Engineering:** re-encode videos (no ffmpeg here), AVIF, icons and manifest | Partly done |
| 10 | AEO | Answer-first boxes, question headings and FAQs in the three draft articles; existing product FAQs | **Owner:** article approval; the articles are hidden drafts | Implemented as drafts; not live |
| 11 | GEO | `llms.txt` (products and company pages; guides added only after approval); consistent profile text; organisation author | **External:** earned third-party mentions, directory listings. No inclusion in AI answers is promised | Partly done |
| 12 | Structured data | Organization, WebSite, SoftwareApplication, VideoObject, Article, BreadcrumbList, in static HTML, tested | **Pending owner facts:** sameAs, address, contact point, founder or author Person. **After deploy:** Rich Results Test, Schema.org Validator | Implemented; **not validated by Google** |
| 13 | Competitor analysis | `COMPETITOR_SEO_ANALYSIS.md`: 4 requested plus 2 verified adjacent; AI-crawler finding corrected | **External:** backlink and traffic data need paid tools | Done (research limits stated) |
| 14 | Analytics and tracking | `SEO_ANALYTICS_SETUP.md` plan and owner-input checklist. **No code** | **Owner:** GA4 ID, consent decision, Privacy Policy, Search Console, Bing | **Not started (Stage 4); blocked on owner** |
| 15 | Conversion optimisation | Second hero CTA; demo CTAs on product pages and articles; honest trust content only | **Blocked on 14:** no event tracking. **Owner:** verified proof (metrics, quotes) | Partly done |
| 16 | Monitoring and roadmap | `SEO_90_DAY_ROADMAP.md` with monthly checklist; 26 automated tests on every build | **External:** Search Console reporting starts after deployment | Docs and tests done; monitoring not started |

## 3. Remaining technical issues

| # | Issue | Owner | Severity |
|---|---|---|---|
| T1 | nginx config and redirect matrix never executed; Docker image never built | Docker available | **High** (gate before deploy) |
| T2 | No HSTS on the live site | Server admin | High (security and SEO) |
| T3 | `www.sitesurelabs.com` serves a duplicate full page | Server admin | High (duplicate content) |
| T4 | Certificate coverage of `www` unknown | Server admin | High (breaks the redirect if missing) |
| T5 | No real-phone testing; headless Chrome cannot go below about 500 px | Owner | **High** (gate before deploy) |
| T6 | Core Web Vitals and PageSpeed never measured; hero reveal animations start at opacity 0 until JavaScript runs | After deploy | Medium |
| T7 | Demo videos 47 MB in total, single quality, unhashed, 30-day cache | Engineering | Medium |
| T8 | Structured data not checked by Google's tools | After deploy | Medium |
| T9 | VideoObject describes videos that open from a button; may not be indexed as video | Information | Low |
| T10 | Unknown product URLs hydrate with a harmless nav-highlight attribute difference (dev-mode warning only; server returns a true 404) | none | Low |
| T11 | No `<lastmod>` on most pages; only blog URLs carry dates | Set dates at deploy | Low |
| T12 | No web manifest or 192/512 icons; no AVIF | Engineering | Low |
| T13 | No analytics, so no conversion data (by design until Stage 4) | Owner inputs | n/a |
| T14 | Hero text approved? `og-image` still shows the old positioning | Owner and designer | Medium |

## 4. Remaining content issues

| # | Issue | Owner |
|---|---|---|
| C1 | Three articles are written but **not approved**. **You are reviewing them personally** (`SEO_BLOG_CONTENT_REVIEW.md`); product teams then confirm. They stay `review: 'pending'` | Owner, then Anviksha and SiteVision teams |
| C2 | Product copy needs confirmation, especially: Anviksha "instant" and AI assistant; SiteVision stitching and Drishti scope; Digi Reco "steel is a top material cost" (unsourced); Parichay "know who's on site" (entry/exit?). **Parichay's Aadhaar and phone cross-site duplicate check is owner-confirmed and stays exactly as written.** No claim about UIDAI integration, legal compliance, encryption, retention or consent is made, and none will be until separately verified | Product teams |
| C3 | One article statement needs confirmation ("observations can be filtered and compared across inspections") and one wording point (per floor vs per room) | Anviksha, SiteVision teams |
| C4 | Services page and About principles are unconfirmed drafts ("CONFIRM" markers) | Engineering team, founder |
| C5 | Founder section is minimal; details only with written sign-off | Founder |
| C6 | No verified metrics, testimonials or case studies exist; none were invented | Owner (customer consent needed) |
| C7 | Privacy Policy and Terms are drafts with placeholders (retention period, governing law, legal identity). **Both are now `noindex` and out of the sitemap**, still linked from the footer and the contact form. Legal checklist: `SEO_PRODUCTION_READINESS.md`, section 9 | Legal |
| C8 | Company address, phone, legal name, LinkedIn and social URLs, confirmed email are all unknown | Owner |
| C9 | Target countries and languages are undefined | Owner |
| C10 | Progress Tracker and the robotic-dog section are placeholders or in development | Owner |

## 5. Actions that need you

**Decisions and approvals**
1. Review the branch diff and approve a commit (not committed).
2. Approve the homepage wording.
3. Arrange legal review of Privacy and Terms (both are already temporarily `noindex` and out of the sitemap; checklist in `SEO_PRODUCTION_READINESS.md`, section 9).
4. Review the three articles yourself (`SEO_BLOG_CONTENT_REVIEW.md`), then arrange product-team review (`SEO_PRODUCT_CONTENT_REVIEW.md`).

**Server and accounts (external; none done)**
5. Host nginx: HSTS; www to apex 301; confirm the certificate covers both.
6. Start Docker, then run the image build, `nginx -t` and the status matrix.
7. Test on real iPhone and Android phones.
8. Search Console and Bing Webmaster Tools ownership; submit the sitemap after deployment.
9. Provide the owner inputs in `SEO_ANALYTICS_SETUP.md`, section 7: GA4 ID, consent approach, Privacy Policy approval, target countries and languages, LinkedIn and social URLs, confirmed email, legal name and address.

**Creative and engineering**
10. A new og-image consistent with the new positioning (designer).
11. Video re-encoding and `VideoDialog` sources (engineering).

**Outreach (after the above; external)**
12. Directory listings, contributed articles and any Google Business Profile, only with real company facts and each venue's rules.

## 6. Production readiness status

**NOT READY.** Ready on the code side; blocked on:

- **Must be done before deploy:** T1 (Docker build, nginx validation, matrix), T5 (real-phone test), approval of the homepage wording, and legal review of Privacy/Terms for a public launch. Articles are separate: they are drafts, and **a production build must use `SEO_REQUIRE_REVIEWED=1`, which refuses until you approve them** (or until they are removed). Never deploy a non-strict build.
- **Should be done at or just after deploy:** HSTS, www redirect, certificate check, structured-data validation, PageSpeed baseline, sitemap submission, new og-image.
- **Can follow:** video optimisation, analytics (Stage 4), outreach, case studies.

Full ordered checklist with commands and the complete status/redirect matrix: `SEO_PRODUCTION_READINESS.md`.

## 7. Analytics implementation prerequisites

Stage 4 will **not** start until you provide at least the **GA4 Measurement ID** and the **consent decision**. Also required before any tracking is live: an approved Privacy Policy that describes analytics (the current text says none is used), a deliberate CSP change (the current policy blocks Google scripts), Search Console access and a decision on target countries (consent law depends on them). Everything is listed, with a "Provided?" column, in `SEO_ANALYTICS_SETUP.md`, section 7. **No GA4 code was added and the CSP was not touched.**

## 8. Recommended deployment sequence

1. **Approve** the diff and the homepage wording (you). Review the three articles at your own pace; they do not block the rest.
2. **Product teams** complete `SEO_PRODUCT_CONTENT_REVIEW.md`; fix any corrections in `products.ts` and `articles.ts`; set approved articles to `review: 'approved'`. If not ready, remove the unapproved articles and hide `/blog`.
3. **Commit** on the feature branch (after your approval).
4. **Docker:** build the image, run `nginx -t`, run the full matrix (`SEO_PRODUCTION_READINESS.md`, section 3.1). Fix anything that fails and re-run the tests.
5. **Strict build** in the pipeline: `SEO_REQUIRE_REVIEWED=1 npm run build` and `npm run test:seo`.
6. **Real-phone test** on a staging or preview URL.
7. **Server:** prepare the HSTS and www redirect changes and confirm the certificate (do not apply them without a maintenance window).
8. **Deploy** the image (with your explicit approval).
9. **Verify live:** re-run the matrix on `https://sitesurelabs.com`, check pages without JavaScript, run the structured-data validators.
10. **Apply** the host changes (HSTS, www redirect) and verify with `curl`.
11. **Search Console and Bing:** verify, submit the sitemap, request indexing for the main pages.
12. **Set `modified` dates**, rebuild and redeploy.
13. **Record PageSpeed baselines**, then start the 90-day roadmap.
14. **Stage 4** only after you provide the GA4 ID and the consent decision.
