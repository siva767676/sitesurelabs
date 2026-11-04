# SiteSureLabs: SEO Production Readiness Checklist

Status: **NOT READY to deploy.** The code is complete and tested on the branch, but items below are unverified or need you. Prepared 2026-11-04 on `feature/sitesurelabs-seo-implementation`. **Nothing has been committed, merged, deployed or changed on the live server.**

> **How to read status in these SEO documents.** **Implemented in code** = on the feature branch, uncommitted, not deployed and not live. **Owner action** = needs you or a named team. **External activity** = done outside the repo; none of it has been done. Authoritative workstream status: `SEO_FINAL_REVIEW.md`.

Legend: `[x]` verified now, `[ ]` not done, **[OWNER]** needs you, **[SERVER]** needs access to the host server, **[DOCKER]** needs Docker running, **[DEPLOYED]** only possible after deployment.

## 0. Go / no-go summary

| Area | State | Blocking deployment? |
|---|---|---|
| Typecheck, lint, production build, 26 SEO tests | `[x]` pass (re-run after the draft-article and Privacy/Terms gating) | No |
| 16 routes: prerender, hydration, one H1, canonical, no console errors | `[x]` verified in headless Chrome | No |
| Sitemap (**9** indexable URLs: home, products index, services, about, contact, four product pages), robots.txt, structured data parses | `[x]` | No |
| nginx config syntax and redirect matrix | `[ ]` **[DOCKER]** not run | **Yes** (do before deploy) |
| Docker image build | `[ ]` **[DOCKER]** not run | **Yes** |
| HSTS and www redirect on the host server | `[ ]` **[SERVER]** | Not for the first deploy of this branch, but needed for SEO (duplicate host) |
| Certificate covers `www` | `[ ]` **[SERVER]** | Needed before the www redirect works over HTTPS |
| Real mobile browser test | `[ ]` **[OWNER]** | **Yes** |
| Core Web Vitals and PageSpeed baseline | `[ ]` **[DEPLOYED]** (or run against a staging URL) | No, but record a baseline |
| Rich Results Test and Schema.org Validator | `[ ]` **[DEPLOYED]** | No |
| **Owner's personal review and approval of the three articles**, then product-team confirmation | `[ ]` **[OWNER]** | **Yes for publishing them.** Drafts are hidden (noindex, no sitemap, nav, footer, list or `llms.txt`) and the strict build refuses them, so a production build cannot ship them by accident |
| Privacy Policy and Terms legal review | `[ ]` **[OWNER] (legal)**. **Both are now temporarily `noindex` and out of the sitemap**; still linked from the footer and the contact form | **Yes for a public launch**; see section 9 |
| Homepage wording approval | `[ ]` **[OWNER]** | **Yes** |
| New `og-image.png` matching the new positioning | `[ ]` **[OWNER]** designer | No (current image works but is off-message) |
| Demo video optimisation | `[ ]` | No |
| Analytics (GA4, consent, CSP) | `[ ]` Stage 4, not started | No (do not block launch; blocks measurement) |

## 1. Approvals before anything ships  **[OWNER]**

- [ ] You have reviewed the branch diff and approve a commit (this work has not been committed).
- [ ] Homepage wording approved: "AI-powered construction technology for the real world." and the lead paragraph.
- [ ] Each product team has completed `SEO_PRODUCT_CONTENT_REVIEW.md` (sections 3 to 6) for its product page.
- [ ] **You personally review and approve the three articles** using `SEO_BLOG_CONTENT_REVIEW.md`; then the Anviksha team (two articles) and the SiteVision team (one) confirm the product statements (`SEO_PRODUCT_CONTENT_REVIEW.md`, section 7). Only then set each article to `review: 'approved'` in `frontend/src/data/articles.ts`. **Nobody has approved them; they remain `pending`.**
  - **Never deploy a non-strict build.** The production build must be `SEO_REQUIRE_REVIEWED=1 npm run build`, which refuses while any article is `pending`. A non-strict build still ships the draft text inside the JavaScript bundle, and the draft URLs answer (noindex, with a DRAFT banner). If the rest of the site must go live before the articles are approved, the drafts would have to be taken out of `articles.ts` temporarily; that is your decision and has not been done.
- [ ] Founder section wording confirmed (currently only name, title, mission and role).
- [ ] Legal review of Privacy and Terms (section 9). Both are temporarily `noindex` and out of the sitemap in the meantime.

## 2. Clean build gate (run on the commit that will be deployed)

```bash
cd frontend
npm ci
npm run typecheck && npm run lint
SEO_REQUIRE_REVIEWED=1 npm run build   # fails while any article is review: 'pending'
npm run test:seo                       # 24 tests
```

Expected today: everything passes except the strict build, which **correctly refuses** because the three articles are `pending`. Without the flag the build passes with a warning. Use the strict form in the deploy pipeline. Requires Node >= 22.18.

## 3. Docker image build and nginx validation  **[DOCKER]**

Not run: the Docker engine was not available when this was prepared. These commands are **untested here**.

```bash
cd frontend
docker build -t sitesurelabs-web .
docker run --rm --add-host api:127.0.0.1 sitesurelabs-web nginx -t     # config syntax check
docker run --rm -p 8080:80 --add-host api:127.0.0.1 sitesurelabs-web   # then test below
```

- [ ] Build succeeds (the build stage runs `npm run build` including the prerender; the final image contains `/etc/nginx/snippets/security-headers.conf`).
- [ ] `nginx -t` reports "syntax is ok" and "test is successful".
- [ ] Container health check passes (`/robots.txt` returns 200).

### 3.1 Complete HTTP status and redirect matrix  **[DOCKER]**

`curl -sI http://localhost:8080<path>` and compare. Redirects are relative (`Location: /about`) by design.

| Request | Expected status | Expected detail |
|---|---|---|
| `/` | 200 | one `<h1>`; `Cache-Control: no-cache`; CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` present |
| `/products`, `/services`, `/about`, `/contact` | 200 | canonical equals `https://sitesurelabs.com<path>` |
| `/privacy`, `/terms` | 200 | **`noindex, nofollow`**; linked from the footer; the contact form's consent text still links to `/privacy`; absent from the sitemap |
| `/blog` | 200 | placeholder page, **`noindex`** while no article is approved; no "Blog" link in the nav or footer |
| `/products/anviksha`, `/products/site-vision`, `/products/digi-reco`, `/products/parichay` | 200 | |
| `/products/progress-tracker` | 200 | `<meta name="robots" content="noindex, nofollow">` |
| Draft articles: `/blog/digital-construction-inspection-guide`, `/blog/manual-vs-ai-construction-inspection`, `/blog/360-degree-construction-documentation` | 200 **only in a non-strict build** | `noindex, nofollow` and a DRAFT banner; not in the sitemap, nav, footer, `/blog` list or `llms.txt`. **In production they must not exist** (the strict build refuses) |
| `/about/` | **301** | `Location: /about` |
| `/about/index.html` | **301** | `Location: /about` |
| `/index.html` | **301** | `Location: /` |
| `/about/?x=1` | **301** | `Location: /about?x=1` |
| `/products/sitevision` | **301** | `Location: /products/site-vision` (single hop) |
| `/products/sitevision/` | **301** | `Location: /products/site-vision` (single hop) |
| `/products/does-not-exist` | **404** | body is the noindex NotFound page |
| `/nope`, `/blog/nope` | **404** | same |
| `/404.html` | **404** (internal only) | not directly served |
| `/assets/<hashed file>` | 200 | `Cache-Control: public, max-age=31536000, immutable`; **CSP and security headers present** (they were missing before) |
| `/assets/missing.js` | 404 | |
| `/media/<file>` | 200 | `Cache-Control: public, max-age=2592000`; CSP present; `Accept-Ranges: bytes` |
| `/api/<any>` | proxied (will fail without the API container) | response carries `X-Robots-Tag: noindex, nofollow` |
| `/sitemap.xml` | 200 | `application/xml`; **9** `<loc>` entries; no `/blog`, no article, no `/privacy` or `/terms` |
| `/robots.txt`, `/llms.txt` | 200 | `text/plain` |

If any page redirects in a loop, the two `if ($request_uri ...)` rules in `nginx.conf` are the first suspect. Redirect-rule patterns were checked offline against 12 URLs.

## 4. Host server: HSTS, www redirect, certificate  **[SERVER] [OWNER]**

Not done. The live server was probed read-only (`curl`) and **not modified**.

Observed 2026-11-04: `http://sitesurelabs.com` 301s to https (good); `https://sitesurelabs.com` returns 200 from nginx 1.24.0 on Ubuntu with **no `Strict-Transport-Security`**; `https://www.sitesurelabs.com` returns a **full 200 page** (duplicate host).

- [ ] **HSTS:** add `add_header Strict-Transport-Security "max-age=31536000" always;` to the HTTPS server block for the apex. Start without `includeSubDomains` and `preload`.
- [ ] **www to apex:** a server block for `www.sitesurelabs.com` on ports 80 and 443 with `return 301 https://sitesurelabs.com$request_uri;`
- [ ] **Certificate covers both names**; check with
  `openssl s_client -connect www.sitesurelabs.com:443 -servername www.sitesurelabs.com </dev/null | openssl x509 -noout -ext subjectAltName`
  The output must list both `sitesurelabs.com` and `www.sitesurelabs.com` (or a matching wildcard). If not, reissue the certificate first, or the redirect from `https://www` will show a certificate warning.
- [ ] After the change: `curl -sI https://www.sitesurelabs.com` shows one 301 to `https://sitesurelabs.com/`, and `curl -sI https://sitesurelabs.com` shows the HSTS header.
- [ ] Keep `proxy_set_header X-Forwarded-Proto $scheme;` toward the container. Do not duplicate the container's security headers at the host.

## 5. Mobile layout testing  **[OWNER]**

Headless Chrome could not render below about 500 px wide, so **no phone-width check has been done**.

- [ ] iPhone (Safari) and an Android phone (Chrome), portrait, 360 to 430 px wide.
- [ ] Home: hero headline fits without clipping, both CTAs reachable, product strip readable, nav drawer opens (5 nav items; the Blog link appears only after an article is approved).
- [ ] A product page (H1 with descriptor line above the name, CTAs, video dialog).
- [ ] After approval only: `/blog` and an approved article (table scrolls horizontally inside its box, table of contents hidden on phones, answer box readable). Drafts can be checked on a local non-strict build.
- [ ] Contact form: fields, validation messages, success state, consent link.
- [ ] Light and dark theme toggle.
- [ ] Landscape and a small phone (360 px) for the longest hero word ("construction").

## 6. Core Web Vitals and PageSpeed  **[DEPLOYED] [OWNER]**

Not measured. Targets: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1.

- [ ] Run PageSpeed Insights (mobile and desktop) on `/`, `/products/anviksha` (and, after approval, `/blog` and one article) **before and after** the branch is deployed, and record the numbers in `SEO_90_DAY_ROADMAP.md` or a spreadsheet. (A baseline of the current live site would show whether this work helped.)
- [ ] After 28 days, read field data in Search Console, Core Web Vitals.
- Known risks to watch: scroll-reveal animations start at opacity 0 until JavaScript runs (existing behaviour, LCP effect unknown); the three.js hero scene loads after the page `load` event; `/media` videos load only when a visitor opens the demo.
- Already improved on this branch: real HTML in the first response; two headline fonts preloaded; og-image smaller (not a page-weight item).

## 7. Structured data validation  **[DEPLOYED]**

Offline checks already enforce: valid JSON, `@context`, no duplicate entity types, only on-domain URLs, no ratings, reviews, offers, address, email or telephone, VideoObject has a real `uploadDate`, Article author is the organisation. **Google's tools have not been run.**

- [ ] Google Rich Results Test and Schema.org Validator on: `/`, `/products`, `/products/anviksha`, `/products/site-vision`, `/about`. Add `/blog` and an article only after approval; until then they are noindex drafts. (Drafts can be validated on a local non-strict build.)
- [ ] Expect: Organization, WebSite, SoftwareApplication, VideoObject, Article, BreadcrumbList parsed with no errors. SoftwareApplication carries no price or rating, so it is not eligible for a software-app rich result; that is intentional. VideoObject describes a video that opens in a dialog, so Google may not treat the page as a video page.
- [ ] Record any warnings and decide; do not add ratings or prices to silence one.

## 8. Open Graph image and demo videos

**OG image  [OWNER] (designer)**
- [ ] Replace `frontend/public/og-image.png`. The current image (compressed to 98 KB) still reads "AI Products · Enterprise Engineering" and the old tagline, which contradicts the new positioning.
- [ ] Spec: 1200 x 630, PNG or JPG, under 150 KB (a test enforces this), readable at thumbnail size, uses the logo and construction-technology wording approved in section 1.
- [ ] After deploy, refresh the cached previews: Facebook Sharing Debugger and LinkedIn Post Inspector ("scrape again"). X caches separately.

**Demo videos (47 MB across four files)  [ENGINEERING]**
- [ ] Source footage or the current MP4s, and ffmpeg. Not available here, so **nothing was re-encoded**.
- [ ] Example (untested): `ffmpeg -i anviksha-demo.mp4 -vf scale=-2:720 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 96k -movflags +faststart anviksha-demo-720.mp4` and a WebM/VP9 or AV1 variant.
- [ ] Update `VideoDialog` to offer `<source>` entries (and a lower tier for phones); keep `preload="metadata"` and the poster.
- [ ] Files are not content-hashed and are cached 30 days: rename or version them when changed, or shorten `max-age`.
- [ ] Update `contentUrl` in the VideoObject (`lib/schema.ts`) if the primary file changes. Videos still load only when a visitor opens the dialog, so page weight is unaffected.

## 9. Privacy Policy and Terms of Use  **[OWNER] (legal)**

Nothing in the legal text was changed. Findings from `frontend/src/pages/Legal.tsx`:

| Item | Where | State |
|---|---|---|
| Both pages say "Draft, pending legal review" and show a visible note "This document is a draft for legal review. Bracketed items need confirmation before launch." | both | Draft banner is public |
| **"[Retention period to be confirmed.]"** | Privacy, Retention | Placeholder |
| **"[Governing law and jurisdiction to be confirmed.]"** | Terms, Governing law | Placeholder |
| Company legal name and registered address | not stated in either document | Missing (code comment says they must be confirmed) |
| Contact email `hello@sitesurelabs.com` | both, via `site.email` | Marked a placeholder in `site.ts` until the mailbox exists |
| Hosting and email "service providers" | Privacy, Who we share it with | Unnamed; processors to be confirmed (code comment) |
| "This website does not set advertising cookies. If analytics are added in future, this policy will be updated" | Privacy | **Must be updated before analytics (Stage 4)** |
| Rights section | Privacy | Generic; not tied to any country's law. Target countries are unknown |
| Worker data (Parichay) | not covered | The policy covers this website's forms only. Parichay's worker-data handling needs its own legal review (documented in `SEO_PRODUCT_CONTENT_REVIEW.md`). **The owner-confirmed Aadhaar and phone duplicate check and its description stay on the site; this review does not remove or weaken them.** UIDAI integration, legal compliance, encryption, retention and consent are **not claimed anywhere** and stay unverified until separately confirmed |
| Terms: "Interfaces and data shown in demonstrations are demo data" | Terms | Consistent with the removed metrics |

**Decision applied (temporary).** Because placeholders remain, both pages are now **`noindex, nofollow` and excluded from the sitemap** (`index: false` in `frontend/src/data/seo.ts`). They stay **reachable and linked**: the footer links are kept, and the contact form's consent text still links to the Privacy Policy. No legal wording, company details, retention period, governing law or service-provider names were added or invented.

**Before a public launch, legal counsel must:**
1. Confirm the company's legal name and registered address and state them in the policy.
2. Replace "[Retention period to be confirmed.]" with the real retention period.
3. Replace "[Governing law and jurisdiction to be confirmed.]" with the real governing law and jurisdiction.
4. Name or describe the hosting and email service providers (processors).
5. Make the Rights section match the laws that apply to the target countries (not yet decided).
6. Add analytics wording, a consent description and a cookie description before any analytics goes live (Stage 4).
7. Decide how Parichay worker data is covered (separately from this website policy).
8. Confirm the contact email (`hello@sitesurelabs.com` is marked a placeholder).

**When the policies are final:** remove the "Draft, pending legal review" label and the draft banner, set a real "last updated" date, set `index: true` for `/privacy` and `/terms` in `seo.ts`, rebuild, and update the SEO tests (the Privacy/Terms test and the sitemap count of 9 become 11).

## 10. Search and analytics prerequisites (Stage 4 is not started)

Stage 4 does not begin until you provide the GA4 Measurement ID and the consent decision. The full owner-input checklist (GA4 ID, consent approach, Privacy Policy approval, Search Console, Bing Webmaster Tools, target countries and languages, LinkedIn and social profiles, confirmed contact email, legal name and address) is in `SEO_ANALYTICS_SETUP.md`, section 7. **None of it is provided; no field was guessed.**

- [ ] Search Console Domain property verified; sitemap submitted after deployment **[OWNER] [EXTERNAL]**.
- [ ] Bing Webmaster Tools verified; sitemap submitted **[OWNER] [EXTERNAL]**.

## 11. Deploy day

1. [ ] Sections 1 to 3 complete (approvals, strict build, Docker build, `nginx -t`, matrix).
2. [ ] Section 4 changes made on the host, or scheduled right after.
3. [ ] Deploy the image **[OWNER approves; nothing deployed yet]**.
4. [ ] Re-run the matrix against `https://sitesurelabs.com` (replace `http://localhost:8080`).
5. [ ] Spot-check three pages with JavaScript disabled: real content and links visible.
6. [ ] Section 7 validators; section 5 phone test on the live URL.
7. [ ] Submit the sitemap; request indexing for `/`, the four product pages and the other indexable pages. Articles and `/blog` only after approval.
8. [ ] Set `modified` dates in `src/data/seo.ts` for pages whose content truly changed, and the article `published` dates to the go-live date if different; rebuild and redeploy.
9. [ ] Record PageSpeed baselines (section 6).

## 12. Rollback

Front end and nginx only; no database or API change. Redeploy the previous image. After a rollback `/products/site-vision` returns 404 until the new build returns, because the old build serves `/products/sitevision`. The new `/blog` URLs also disappear.
