# SiteSureLabs: Content SEO Strategy

> **How to read status in these SEO documents.** **Implemented in code** = on branch `feature/sitesurelabs-seo-implementation`, uncommitted, **not deployed and not live** on sitesurelabs.com. **Owner action** = needs you: an account, an approval, a fact only the company knows, or access to the live server. **External activity** = outreach, listings, directory or social accounts, paid tools, third-party validators: **none of it has been done**, and nothing is claimed as done. Authoritative status of all 16 workstreams: `SEO_FINAL_REVIEW.md`.

Status: blog infrastructure and three articles **implemented, approved by the owner on 2026-11-04, and not yet live** (they go live when the build is deployed). Each is `review: 'approved'`; the review gate remains for any future article. Product-team confirmation of four statements is still open (`SEO_BLOG_CONTENT_REVIEW.md`).
Keyword targets and URL mapping live in `SEO_KEYWORD_STRATEGY.md`; this file covers how content is built and run.

## 1. What existed before

No blog, resources section, case studies or articles. The site had product pages with short FAQs, and an empty testimonials slot (correctly empty).

## 2. What was implemented

| Piece | Where |
|---|---|
| Article data (content lives in code, reviewed like code) | `frontend/src/data/articles.ts` |
| Blog listing, `/blog` | `frontend/src/pages/Blog.tsx` |
| Article template, `/blog/:slug` | `frontend/src/pages/Article.tsx` |
| Article + BreadcrumbList structured data | `frontend/src/lib/schema.ts` (`articleSchema`) |
| `og:type=article`, `article:published_time`, `article:modified_time` | `frontend/src/components/ui/Seo.tsx` |
| Prerendering, sitemap entries (approved articles only), navigation and footer (Blog link only when an article is approved) | `frontend/src/data/seo.ts`, `scripts/postbuild.mjs`, `data/site.ts` |
| Regression tests | `frontend/scripts/seo.test.mjs` (draft gating, Article schema, word count, links) |

Each article page has: one H1, a visible "short answer" box first (for readers and answer engines), a table of contents, descriptive H2/H3 headings, an FAQ, a related-product block with a demo CTA, "keep reading" links, published and modified dates, and an `Article` schema whose author is the organisation.

There is deliberately **no FAQPage markup**. Google limits FAQ rich results to well-known government and health sites, so the markup would add nothing; the FAQ is plain visible content.

## 3. Articles implemented in code (3): not live, pending product-team approval

| URL | Primary topic | Links to | Reviewer | Status |
|---|---|---|---|---|
| `/blog/digital-construction-inspection-guide` | Digital construction inspection | Anviksha | Anviksha team | Implemented, **not live**, review pending |
| `/blog/manual-vs-ai-construction-inspection` | Manual vs AI-assisted inspection | Anviksha | Anviksha team | Implemented, **not live**, review pending |
| `/blog/360-degree-construction-documentation` | 360° site documentation | SiteVision | SiteVision team | Implemented, **not live**, review pending |

**Review gate.** `npm run build` prints a warning for every article still `pending`. `SEO_REQUIRE_REVIEWED=1 npm run build` refuses to build while any is pending; use that in the deploy pipeline. Change an article to `review: 'approved'` only after the named team has approved it in writing. The factual cross-check against the product pages is in `SEO_PRODUCT_CONTENT_REVIEW.md`.

**Draft visibility.** While an article is `pending` it is: `noindex, nofollow`; absent from `sitemap.xml`, `llms.txt`, the header and footer navigation and the `/blog` list; and shows a visible DRAFT banner. `/blog` itself is `noindex` and shows a short placeholder while no article is approved. The draft pages are still built, so they can be read in a local preview. Setting an article to `approved` publishes it (indexable, in the sitemap, linked), and the first approval also adds the Blog link and makes `/blog` indexable. **Always deploy with `SEO_REQUIRE_REVIEWED=1`**; a non-strict build would still ship the draft text inside the JavaScript bundle. Owner review document: `SEO_BLOG_CONTENT_REVIEW.md`.

**Dates.** `published` (2026-11-04) is the day the text was written, and it appears in the page and in the Article structured data. If the articles go live later, or change after review, update `published`/`modified` to the true dates so the visible and structured dates stay accurate.

All statements about products were checked against `data/products.ts`. The articles contain **no statistics, customer examples, benchmarks or research findings**, so there is nothing to cite and nothing invented. Where a claim could be read as a guarantee it is hedged (for example AI suggestions "are reviewed by a qualified person").

## 4. Editorial rules

1. One reader problem per article; the first screen answers it directly.
2. No numbers unless the source is linked in the article and the number is quoted accurately.
3. Product statements must match the product pages. If the product does not do it, do not write it.
4. No fabricated authors, credentials, quotes, clients, case studies or "studies show".
5. No generic AI-written filler. Every article needs an owner who knows the subject and has reviewed it.
6. The author is "SiteSureLabs" until a real named person agrees to be credited, with a real bio (then add a `Person` author in `schema.ts`).
7. Update `modified` only for substantive changes. The sitemap and schema use it.
8. Each article links to exactly the products it is about, and to two other articles.

## 5. Backlog (from the brief; not yet written, on purpose)

Writing these needs real input, otherwise they would be thin or generic. Order is by fit with the products.

| Topic | Needs before writing | Product link |
|---|---|---|
| How AI is transforming construction quality inspections | Overlaps the launch articles; only write with a distinct angle (for example a worked inspection example from a real, shareable project) | Anviksha |
| Construction progress monitoring using visual documentation | An accurate description of progress-tracking methods; SiteVision facts are available | SiteVision |
| How developers can improve construction site visibility | A distinct angle not covered by the 360° article | SiteVision, Anviksha |
| AI agents in construction management | Confirmation of what the company really offers in agents (services page is an unconfirmed draft) | Services |
| The future of AI in real estate development | Opinion piece; needs a named author with a view, and sources | none |
| Steel reconciliation on construction sites (new, from the keyword work) | Domain input from the Digi Reco team | Digi Reco |
| Worker registration and entry passes on sites (new) | Domain input from the Parichay team | Parichay |

Categories in use: Construction inspection, Construction quality management, 360 degree documentation. Add Construction technology, Enterprise automation, Real estate technology and Digital transformation only when an article exists for them (empty categories are not pages).

## 6. Case studies

None exist and none will be created. A case study needs a named customer, their written approval and real, shareable results. **Owner action:** identify one or two customers willing to be featured, and provide the facts and approval in writing. Until then the testimonial and case-study slots stay empty.

## 7. Answer-engine (AEO) and generative-engine (GEO) practice used

- Direct answer first, in plain words, then detail.
- Question-style H2/H3 and FAQs that mirror how people ask.
- Definitions that stand alone when quoted.
- Consistent product descriptions across pages and `llms.txt`.
- Real dates and an organisation author, so the source is clear.
- `public/llms.txt` lists the real, public pages (products and company pages). Guides are added only after approval. **It is optional, is not a Google ranking factor, and no guarantee of AI-answer inclusion is made.**
- AI crawlers are not blocked in `robots.txt` (all legitimate crawlers are allowed; `/api/` is disallowed).

## 8. Publishing checklist for each new article

1. Add it to `articles.ts` (slug, titles, description 70-200 characters, answer, body, FAQ, products, related).
2. `npm run build && npm run test:seo` (checks length, links, schema, uniqueness, dates).
3. Read it on the built page, desktop and phone.
4. Add it to `public/llms.txt`.
5. After deploy: request indexing in Search Console, and link it from at least one relevant product page or article.
6. Share it where the audience is (**owner action and external activity**; see `OFF_PAGE_SEO_STRATEGY.md`). Not done.

## 9. Review cadence

Monthly: which articles get impressions and clicks (Search Console), which queries they rank for, and whether each still matches the product. Quarterly: refresh or merge anything that is outdated or competes with another page.
