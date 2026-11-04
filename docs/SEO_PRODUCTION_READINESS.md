# SiteSureLabs: SEO Production Readiness Checklist

Status: **DEPLOYED to production on 2026-11-04** (web container only; see section 15). Code on branch `feature/sitesurelabs-seo-implementation`, commit `83f594f`, pushed to GitHub and not merged into `main`. Items still open for the owner are listed at the end of section 15.

> **How to read status in these SEO documents.** **Implemented in code** = on the feature branch, uncommitted, not deployed and not live. **Owner action** = needs you or a named team. **External activity** = done outside the repo; none of it has been done. Authoritative workstream status: `SEO_FINAL_REVIEW.md`.

## Update 2026-11-04, deployment phase (read this first)

The owner approved the three articles and asked for the remaining work, image build and deployment. **Where things stand:**

| Item | Status now |
|---|---|
| Articles | **Approved by the owner**; `review: 'approved'`. They are public in the build (indexable, in sitemap, nav, blog list, `llms.txt`). The Anviksha and SiteVision teams still need to confirm the four flagged statements |
| Merge with `origin/main` | **Done** (commit `67f2fdd`). Production runs newer code than this branch had (contact-page fixes, founder bio from the founder, `support@` email, `c-[hash].js` chunk names that content blockers do not drop, route-load retry, error-boundary reset, Turnstile guard). All of it is kept. Deploying the branch without merging first would have reverted those fixes |
| Sitemap | 13 URLs (home, products, services, about, contact, four products, blog, three articles). `/privacy`, `/terms`, `/products/progress-tracker` and `404.html` stay out |
| SEO tests | **28 of 28 pass**; strict build (`SEO_REQUIRE_REVIEWED=1`) passes; Docker image build uses the strict build |
| New `og-image.png` | **Done**: matches the approved positioning, 1200x630, 90 KB |
| Demo videos | **Done**: 720p copies (44 to 55% smaller, 26 MB against 47 MB) used on phones and data-saver; originals kept; fallback to the original if a 720p file fails |
| SSL certificate for `www` | **Verified**: the certificate covers both `sitesurelabs.com` and `www.sitesurelabs.com` (valid to 27 Jan 2027) |
| Backend | Identical to what production runs (no diff against `82f0847`), so the API container does not need replacing |
| Docker image build, `nginx -t`, status matrix | **Done and passed (2026-11-04).** Docker Desktop was installed after all (in the user profile) and was started. Both images built from a clean export of commit `7fe11b6`; `nginx -t` is OK; the matrix (`deploy/verify-image-matrix.sh`) passed **65 of 65 checks**: all 16 routes, every redirect (`/about/`, `/about/index.html`, `/index.html`, query kept, `/products/sitevision` in one hop), real 404s, security headers on pages, `/assets`, `/media` and `/api`, the 13-URL sitemap. The strict review gate is in the image build; the backend smoke test passed |
| ECR images | **Pushed.** Frontend `:83f594fb4009` / `:latest` = `sha256:304e7ae3e40beacc5063b226ea2ed3894cf1f7c9d3f7d3d60f0c44e33adbd756` (deployed); earlier frontend `:7fe11b6323fd` = `sha256:0463410560ef...` (release 1, kept as a rollback tag on the server). Backend `:7fe11b6323fd` / `:latest` = `sha256:3a7c7d2876fc...` (not deployed: unchanged). The S3 bucket and the CodeBuild definition were not needed |
| Deployment to production | **Done (2026-11-04).** Web container replaced with the image `sitesurelabs-frontend:83f594fb4009`; API, data and server config untouched; 65 of 65 checks passed on the spare port, the live port and the public site; live Lighthouse mobile 93 / desktop 95, SEO and accessibility 100. See section 15 |
| HSTS and www to apex redirect on the host nginx | Owner action (the owner said they will do these after the deploy). Not touched |
| Privacy and Terms | Still `noindex` and out of the sitemap, pending legal review |
| Real phone testing | Owner action |
| Rich Results Test, Schema.org Validator | After deploy |
| Stage 4 analytics | Not started: needs the GA4 ID and the consent decision |

**How the blocker was resolved.** The server's role could only pull other products' images. The owner applied a pull-only ECR repository policy (`deploy/ecr-pull-policy.json`) on the two new repositories; the server then pulled through its own role. No credential was passed to the server, and the shared role was not changed.

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

## 13. How production runs (discovered 2026-11-04, read-only)

| Item | Finding |
|---|---|
| Host | EC2 `i-0a0585c546363305e`, name `SiteSureLabs`, Ubuntu, t2.small (2 GB RAM, 1.9 GB free disk, 79% used), 3.109.250.55, ap-south-1. Reachable through SSM |
| Not part of this site | `sitevision-prod` and `anviksha-app-prod` (other EC2 instances), the `anviksha-*` and `sitevision-*` ECR repositories, and the shared `AnvikshaEC2Role`. **None of these may be changed** |
| Stack | Docker Compose project `sitesurelabs` in `/home/ubuntu/sitesurelabs` (clone of `github.com/siva767676/sitesurelabs`, branch `main`, HEAD `82f0847`). Containers `sitesurelabs-web-1` (published on port 8080, healthy) and `sitesurelabs-api-1` (healthy). Images are built on the host itself (`sitesurelabs-web:latest`, `sitesurelabs-api:latest`), **not** pulled from ECR |
| Data | Docker volume `sitesurelabs_data` (SQLite enquiries). Must never be removed or recreated |
| TLS | Host nginx (`/etc/nginx/sites-enabled/sitesurelabs.conf`, certbot) proxies `sitesurelabs.com` and `www.sitesurelabs.com` to `127.0.0.1:8080`. HTTP redirects to HTTPS. The certificate covers both names. **No HSTS and no www redirect yet** (owner action) |
| `.env` | Holds secrets (salt, SMTP, admin token). Never printed or copied. `VITE_TURNSTILE_SITE_KEY` is empty in production, so the image is built with an empty key (as today) |
| Instance role | `AnvikshaEC2Role` can pull only the `anviksha-*` images, so the host cannot pull `sitesurelabs-*` images without a change or a temporary token |

## 14. Deployment plan (nothing here has been executed)

Principles: change only the web container; leave the API container, the data volume, the host nginx, the `.env` and all other servers alone; keep a one-command rollback.

**A. Build and verify the images (needs the decision in the update at the top)**

1. Package the exact committed code (`git archive` of the commit) into the private bucket.
2. Run a CodeBuild project (dedicated role, push access to the two `sitesurelabs-*` repositories only). `buildspec.yml` builds both images, runs `nginx -t` and the full status and redirect matrix (section 3.1 above, including the 13-URL sitemap check) against the new frontend image, and **pushes to ECR only if every check passes**. Images are tagged with the git commit and `latest`.

Alternatives if the role is not approved: (1) build on the production host with `docker compose build web` as has always been done (works today, but a node build on a 2 GB, 79%-full server is the riskiest option and gives no ECR image), or (2) build on a machine with Docker and push to ECR from there.

**B. Deploy only the web container (about 5 seconds of change)**

1. Record the current image: `docker inspect sitesurelabs-web:latest --format '{{.Id}}'` (currently `sha256:d4243c9a...`) and tag it `sitesurelabs-web:pre-seo` (rollback copy).
2. Pull the new frontend image (a short-lived, pull-only token for the two new repositories; no change to the shared role), tag it `sitesurelabs-web:latest`, remove the stored token.
3. Start it on a spare port first and run the matrix once more against the real host.
4. `docker compose up -d --no-build --no-deps web` recreates only `web`. The API container and volume are untouched.
5. Verify: container healthy; `curl` the matrix through the host nginx; public HTTPS checks; contact form still reaches the API.

**C. Rollback (seconds)**: `docker tag sitesurelabs-web:pre-seo sitesurelabs-web:latest && docker compose up -d --no-build --no-deps web`. Because the compose file and `.env` are not edited, there is nothing else to undo.

**D. After deploy**: PageSpeed run, structured-data validators, then the owner's HSTS and www redirect (snippets in `SEO_DEPLOYMENT_CHECKLIST.md`, section 1).

**What stays the same in production**: `docker-compose.yml`, `.env`, the API container and its image, the data volume, the host nginx and certificates, and every other server.

**Options that were considered (resolved by the repository policy, see section 15):**

1. **Approve a temporary pull credential** (a short-lived encrypted Parameter Store entry holding an ECR pull token, deleted right after the pull). Then: pull `sitesurelabs-frontend@sha256:0463410560ef...`, run it on a spare port next to production, run the matrix on the host, swap only the web container, verify, keep the rollback tag.
2. **Build on the host** from the committed code (how it has always been deployed: `git fetch`, check out `7fe11b6`, `docker compose build web`, then the same spare-port check and swap). No credential is involved, but the image would be a rebuild (not byte-identical to the one in ECR), and a node build on a 2 GB server that is 79% full carries some risk to the running site.
3. **Transfer the image as a file**: save it locally, upload it to a private, expiring location and download it on the host with a time-limited link (this would use the S3 bucket created earlier).

## 15. Deployment record (2026-11-04)

**Deployed to production: the web container only.** Nothing else was changed on the server.

| Item | Detail |
|---|---|
| Code | Branch `feature/sitesurelabs-seo-implementation`, commit `83f594f` (merged with the latest `origin/main`). Pushed to GitHub. **Not merged into `main`** |
| Image | ECR `196338354246.dkr.ecr.ap-south-1.amazonaws.com/sitesurelabs-frontend:83f594fb4009` (also `:latest`), digest `sha256:304e7ae3e40beacc5063b226ea2ed3894cf1f7c9d3f7d3d60f0c44e33adbd756`. Backend image `sitesurelabs-backend:7fe11b6323fd` / `:latest` (`sha256:3a7c7d28...`) is in ECR but **was not deployed**: the backend is identical to what production already runs |
| Server | EC2 `i-0a0585c546363305e`. Pulled with the server's own role after the owner applied the repository policy in `deploy/ecr-pull-policy.json` (no credential was passed to the server). The temporary AWS CLI container image was removed afterwards |
| Method | Pull, run on a spare localhost-only port next to production, run the 65-check matrix there, then `docker compose up -d --no-build --no-deps web` (recreates only `web`), then the matrix again on port 8080 and through the public HTTPS site. Automatic rollback was armed |
| Result | Web container healthy; 65 of 65 checks passed three times (spare port, live port, public site). API container unchanged (same container id, up 25 hours). Data volume, `.env`, `docker-compose.yml`, host nginx and the other servers untouched |
| Outside check | All baseline URLs unchanged (200/301/404 as before); `/blog` and the three articles went from 404 to 200; one H1, title and canonical per page, no browser console errors on `/`, `/contact`, `/products/anviksha`, `/blog`; Contact form renders |

**Two releases were deployed, and the first one had a problem that was found by measuring and fixed.** Release 1 (commit `7fe11b6`) made the hero text invisible until JavaScript hydrated, which pushed mobile LCP to about 7 s. It was caught with Lighthouse on the live URL, reproduced locally against the old site (old: LCP 1.0 s; release 1: 5.4 s), fixed by moving the above-the-fold entrance animations to CSS, and released as release 2 (commit `83f594f`). Release 1 was live for about an hour.

**Live Lighthouse after release 2 (lab data, `https://sitesurelabs.com/`)**

| | Performance | SEO | Accessibility | Best practices | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Mobile | 93 | 100 | 100 | 100 | 1.4 s | 1.4 s | 280 ms | 0 |
| Desktop | 95 | 100 | 100 | 100 | 0.4 s | 0.4 s | 170 ms | 0 |

(Run locally with Lighthouse 13.6 and Chrome; Google's own PageSpeed Insights could not be used because its anonymous daily quota was exhausted. Field data from real users needs about 28 days of traffic in Search Console.)

**Rollback (seconds), on the server, as root:**

```bash
cd /home/ubuntu/sitesurelabs
# back to release 1 (first SEO release):
docker tag sitesurelabs-web:seo-v1-7fe11b6323fd sitesurelabs-web:latest && docker compose up -d --no-build --no-deps web
# or back to the exact pre-SEO site:
docker tag sitesurelabs-web:pre-seo-20261104 sitesurelabs-web:latest && docker compose up -d --no-build --no-deps web
```

The two rollback tags stay on the server (about 180 MB each; disk is about 80% used, so remove them with `docker rmi` once you are happy).

**Important for future deployments.** The server's repo (`/home/ubuntu/sitesurelabs`) tracks `main`, which does **not** contain this work. Running `git pull && docker compose up -d --build` there would rebuild the OLD site and undo it. Merge `feature/sitesurelabs-seo-implementation` into `main` (a pull request is open at `https://github.com/siva767676/sitesurelabs/pull/new/feature/sitesurelabs-seo-implementation`) and then pull on the server, or keep deploying from ECR images.

**Still open (not done, owner or later):**

- HSTS and the www to apex redirect on the host nginx (the owner said they will do these; snippets in `SEO_DEPLOYMENT_CHECKLIST.md`). `www.sitesurelabs.com` still serves a duplicate page.
- Real iPhone and Android testing.
- Google Rich Results Test and Schema.org Validator on the live URLs (they have no API).
- Search Console and Bing: verify, submit `https://sitesurelabs.com/sitemap.xml`, request indexing.
- Legal review of Privacy and Terms (still `noindex` and out of the sitemap).
- Product-team confirmation of the four flagged article statements.
- The founder bio now live (from `main`) names "My Home Constructions" and says the tools are deployed across its sites; the owner should confirm that wording.
- Delete the unused S3 bucket `sitesurelabs-build-src-196338354246` (the owner said they will).
- Stage 4 analytics: needs the GA4 ID and the consent decision.
