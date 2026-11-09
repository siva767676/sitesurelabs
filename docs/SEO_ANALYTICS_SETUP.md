# SiteSureLabs: SEO Analytics Setup

> **How to read status in these SEO documents.** **Implemented in code** = on branch `feature/sitesurelabs-seo-implementation`, uncommitted, **not deployed and not live** on sitesurelabs.com. **Owner action** = needs you: an account, an approval, a fact only the company knows, or access to the live server. **External activity** = outreach, listings, directory or social accounts, paid tools, third-party validators: **none of it has been done**, and nothing is claimed as done. Authoritative status of all 16 workstreams: `SEO_FINAL_REVIEW.md`.

Status: **nothing is configured. No analytics code has been added.** This is the plan for Workstream 14 (Stage 4) and the steps only the owner can do.

## 1. What exists today

| Item | State |
|---|---|
| Google Search Console | Unknown. Not verifiable from the repo. Treat as **not configured** until confirmed |
| Bing Webmaster Tools | Not configured |
| Google Analytics 4 / Tag Manager | None in the code |
| Consent mechanism | None |
| Privacy policy | Draft; states that no analytics are used (`Legal.tsx`). **Must be updated before any analytics goes live** |
| Content-Security-Policy | `script-src 'self' ... challenges.cloudflare.com`, `connect-src 'self'`. Blocks Google scripts and beacons until the policy is changed deliberately |
| Conversion events | None tracked. The enquiry form submits to `/api/enquiries` and shows its own success state |

## 2. Owner actions (cannot be done by code)

1. **Search Console**: add a Domain property for `sitesurelabs.com`; verify with the DNS TXT record from the host or registrar. Then Sitemaps, submit `https://sitesurelabs.com/sitemap.xml`.
2. **Bing Webmaster Tools**: import from Search Console, or verify separately; submit the same sitemap. (Bing also feeds some AI search products.)
3. **GA4**: create a property and a Web data stream for `https://sitesurelabs.com`. Send the Measurement ID (`G-XXXXXXXXXX`) to the developer. **No ID has been invented or placed in the code.**
4. Decide the **consent approach** with whoever owns privacy and legal. Audience location is unknown to this plan; if visitors from the EU, UK or India are expected, a consent banner and a lawful basis are likely required.
5. Approve the privacy policy wording that describes analytics.
6. Link Search Console to GA4 (Admin, Product links).

## 3. Implementation plan (Stage 4, after the owner provides the ID and consent decision)

1. **Consent-aware loading.** Load the GA4 tag only after consent where consent is required; default to denied (Consent Mode v2 `analytics_storage: denied`). Keep it off in development.
2. **CSP change**, narrowly: add `https://www.googletagmanager.com` to `script-src` and `https://www.google-analytics.com`, `https://*.analytics.google.com`, `https://*.googletagmanager.com` to `connect-src` (and `img-src` if needed) in `frontend/nginx-security-headers.conf`. The theme-script hash guard in `postbuild.mjs` keeps working. Do not use `unsafe-inline` for scripts.
3. **Events** (names are suggestions; one place in code, `src/lib/analytics.ts`):

   | Event | When | Parameters (no personal data) |
   |---|---|---|
   | `generate_lead` | enquiry submitted successfully | `kind` (demo/project/general), `interest` (product), `page_path` |
   | `demo_request_start` | demo form shown with `type=demo` | `product` |
   | `cta_click` | primary CTAs (Request a Demo, Explore Products, product CTAs) | `cta`, `location`, `product` |
   | `video_play` | product demo opened | `product` |
   | `outbound_click` | links leaving the site | `domain` only |
   | `article_read` | article scrolled to the FAQ | `slug` |

4. **Never send** names, emails, company names, message text, enquiry reference ids or IP addresses. Form fields stay out of event parameters.
5. Mark `generate_lead` as a Key event in GA4. Build an exploration: organic landing page to `generate_lead`.
6. Test with GA4 DebugView and the Tag Assistant; confirm nothing fires before consent where consent is required.

## 4. What to measure (SEO)

| Metric | Source |
|---|---|
| Impressions, clicks, CTR, average position (by page and query) | Search Console, Performance |
| Indexed pages, excluded pages and reasons | Search Console, Pages |
| Sitemap status and discovered URLs | Search Console, Sitemaps |
| Core Web Vitals (LCP, INP, CLS) field data | Search Console, Core Web Vitals; PageSpeed Insights |
| Organic sessions, engaged sessions, organic landing pages | GA4 |
| Demo requests and enquiries from organic traffic | GA4 `generate_lead` by channel, plus the backend enquiry records |
| Branded vs non-branded queries | Search Console (filter on "sitesurelabs", "anviksha", "sitevision", "digi reco", "parichay") |
| Referring domains and backlink growth | Needs Ahrefs, Semrush or Moz (not available to this project) |
| AI referral traffic | GA4 sessions with source containing `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com` (volume will be small and attribution is incomplete) |

## 5. Reporting

Monthly one-page report: clicks, impressions, CTR and position for the top 10 pages and top 20 queries; indexed page count; new and lost referring domains (if a tool is available); organic leads; one decision for next month. Template and cadence are in `SEO_90_DAY_ROADMAP.md`.

## 6. Verification before go-live

- [ ] Search Console property verified; sitemap submitted; no errors.
- [ ] GA4 receives a test `generate_lead` from a staging or production test enquiry, and **no personal data** is visible in DebugView.
- [ ] With consent denied, no `google-analytics` or `googletagmanager` requests appear in the browser network tab (where consent is required).
- [ ] CSP has no new console violations.
- [ ] Privacy policy updated and published.

## 7. Owner-input checklist (nothing here is known or assumed)

Stage 4 does not start until the first two rows are answered. Every row is an **owner action**; none is done.

| # | Input needed from the owner | Why it is needed | Provided? |
|---|---|---|---|
| 1 | **GA4 Measurement ID** (`G-...`) from a property you own | Without it no tag can be added. No ID will be invented | No |
| 2 | **Consent approach**: banner with opt-in before analytics (recommended where EU, UK or India visitors are expected), or cookieless/no analytics | Decides whether and how the tag loads | No |
| 3 | **Privacy Policy** reviewed and approved with analytics wording, controller identity, retention period | The current text says no analytics are used and has placeholders | No |
| 4 | **Google Search Console** access: Domain property verified (DNS TXT) and the owner Google account | Indexing and performance data; sitemap submission | No |
| 5 | **Bing Webmaster Tools** access (import from Search Console or verify) | Bing indexing; some AI search products draw on Bing | No |
| 6 | **Target countries and languages** (for example India only, or global; English only?) | Sets hreflang needs, directory choices, consent law, Search Console international targeting | No |
| 7 | **Company LinkedIn page and other social profile URLs** | Needed for Organization `sameAs`; none are on the site today and none will be invented | No |
| 8 | **Confirmed public contact email**: `mhcai@myhomeconstructions.com`, confirmed by the owner 2026-11-09 and now on the website. Not yet in the structured data (contact-point schema can be added on request) | Shown on the site, used in profiles | **Yes** |
| 9 | **Company legal name, registered address, phone** (if they are to be public) | Privacy policy identity, Organization schema, directories, any Google Business Profile | No |
| 10 | **Who receives the monthly SEO report**, and who owns Search Console and GA4 day to day | Access and accountability | No |

Until each row is provided, the related field stays absent from the site (not guessed), and the matching schema property stays out of the structured data.
