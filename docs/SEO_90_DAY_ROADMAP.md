# SiteSureLabs: 90-Day SEO Roadmap and Monthly Audit

> **How to read status in these SEO documents.** **Implemented in code** = on branch `feature/sitesurelabs-seo-implementation`, uncommitted, **not deployed and not live** on sitesurelabs.com. **Owner action** = needs you: an account, an approval, a fact only the company knows, or access to the live server. **External activity** = outreach, listings, directory or social accounts, paid tools, third-party validators: **none of it has been done**, and nothing is claimed as done. Authoritative status of all 16 workstreams: `SEO_FINAL_REVIEW.md`.

Day 1 = the day the branch `feature/sitesurelabs-seo-implementation` is deployed (not yet decided). Status as of 2026-11-04, before deployment.
Legend: [x] implemented in code on the branch (not live), [~] partly done, [ ] not started, [!] needs the owner or an external account. A ticked item is never a claim that something is live or that an external activity happened.

## Days 1-30: Foundation

| Item | Status |
|---|---|
| Full technical audit | [x] `SEO_AUDIT_AND_IMPLEMENTATION.md` |
| Real HTML for every page (prerender + hydration) | [x] |
| One SEO config, correct canonicals, no duplicate tags | [x] |
| Sitemap with honest dates, robots.txt, real 404s, redirect for the SiteVision URL | [x] code; [!] nginx not yet run (needs Docker) |
| Security headers on every nginx location | [x] code |
| HSTS and www to apex redirect on the host nginx | [!] owner/server admin |
| Verify TLS certificate covers `www` | [!] |
| Homepage positioning and product H1s | [x] wording needs owner sign-off [!] |
| Structured data: Organization, WebSite, SoftwareApplication, VideoObject, Article, BreadcrumbList | [x]; [!] validate with Google Rich Results Test after deploy |
| Remove unverified claims | [x]; [!] owner to verify and supply real figures |
| Keyword map | [x] `SEO_KEYWORD_STRATEGY.md`; [!] volumes need Keyword Planner / Search Console |
| Search Console and Bing set up, sitemap submitted | [!] |
| GA4 and consent | [!] Stage 4 code after owner inputs (`SEO_ANALYTICS_SETUP.md`) |
| Deploy, then request indexing for the home page and product pages (articles only after the owner approves them) | [!] after approval |

- [!] Privacy Policy and Terms: legal review, then remove the temporary `noindex` and re-add them to the sitemap (see `SEO_PRODUCTION_READINESS.md`, section 9).

## Days 31-60: Content and authority

- [ ] Review Search Console: which pages are indexed, impressions per page, any "Crawled, not indexed".
- [~] Three articles **implemented in code as hidden drafts (noindex, not in sitemap, nav or `llms.txt`), not live**, awaiting **your personal review** (`SEO_BLOG_CONTENT_REVIEW.md`) and then product-team approval [!]. They go live only after approval, with `review: 'approved'`.
- [ ] Write the next 2 articles from the backlog in `CONTENT_SEO_STRATEGY.md`, each with real subject-matter input.
- [ ] Product pages: add real, owner-verified proof (metrics with sources, customer-approved quotes) where available [!].
- [ ] Case study: only with a named, consenting customer [!].
- [ ] Citations and directories from `OFF_PAGE_SEO_STRATEGY.md` (owner confirms product availability, contact email and company facts first) [!].
- [ ] First outreach: one genuine contributed article or product listing, following each outlet's rules (see off-page doc).
- [ ] Improve demo flow from analytics data once GA4 is live.
- [ ] Video: create 720p and WebM variants of the four demo videos (47 MB total today) [ ] needs ffmpeg or the original footage.

## Days 61-90: Growth

- [ ] Keyword review: queries that earn impressions but little clicks (improve titles and descriptions); pages on positions 8-20 (strengthen content and internal links).
- [ ] Decide on industry landing pages only if there is substantive, distinct content for each (criteria in `SEO_KEYWORD_STRATEGY.md`, section 5).
- [ ] Review backlink and brand-mention growth with a tool, if one is available.
- [ ] Technical health: Search Console Pages and Core Web Vitals, broken links, redirect chains.
- [ ] Analyse organic conversions and the paths that lead to demo requests.
- [ ] Prepare the next quarter's plan.

## Monthly SEO audit checklist (about 90 minutes)

**Indexing and crawl**
- [ ] Search Console, Pages: indexed count vs sitemap count; read each "not indexed" reason.
- [ ] Sitemap: still submitted, no errors; contains only indexable canonical URLs.
- [ ] `robots.txt` unchanged and not blocking the site.
- [ ] URL Inspection on any new or changed key page.

**Performance in search**
- [ ] Top pages and top queries by clicks and impressions, compared with last month.
- [ ] Branded vs non-branded split.
- [ ] Pages with high impressions and low CTR: rewrite title/description.

**Technical**
- [ ] `npm run build && npm run test:seo` pass on the current main branch.
- [ ] PageSpeed Insights (mobile and desktop) for `/`, a product page and an article; note LCP, INP, CLS.
- [ ] Core Web Vitals report: pages classed Poor or Needs improvement.
- [ ] Crawl for broken internal links and redirect chains (the test checks internal links at build time; external links need a crawler).
- [ ] Security headers still present on `/`, `/assets/...`, `/media/...` (`curl -I`).
- [ ] HTTPS, HSTS and www redirect still correct.

**Content**
- [ ] Every article and product page still true (products change; update copy and `modified`).
- [ ] New article published or scheduled; each links to products and to two other articles.
- [ ] Remove or update anything outdated.

**Structured data**
- [ ] Rich Results Test and Schema.org Validator on one page per type (home, product, article).
- [ ] Search Console enhancement reports (if shown) have no errors.
- [ ] Organization details still correct; add address, contact point and social profiles once the owner provides them [!].

**Authority and brand**
- [ ] New referring domains and mentions (tool or manual search); log them in the outreach tracker.
- [ ] Directory and profile details consistent with the company profile.
- [ ] Reviews: only genuine ones, responded to politely.

**Conversion**
- [ ] Enquiries and demo requests this month, by source.
- [ ] Test the contact form on a phone; check the confirmation state.
- [ ] Test every CTA link.

**Report**
- [ ] One page: what moved, what is blocked, one decision for next month.

## Quarterly

Re-run the competitor review (`COMPETITOR_SEO_ANALYSIS.md`), refresh the keyword map with real data, prune or merge underperforming pages, and re-plan the content backlog.
