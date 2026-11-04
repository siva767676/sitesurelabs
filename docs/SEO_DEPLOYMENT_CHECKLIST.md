# SEO Deployment Checklist

> **How to read status in these SEO documents.** **Implemented in code** = on branch `feature/sitesurelabs-seo-implementation`, uncommitted, **not deployed and not live** on sitesurelabs.com. **Owner action** = needs you: an account, an approval, a fact only the company knows, or access to the live server. **External activity** = outreach, listings, directory or social accounts, paid tools, third-party validators: **none of it has been done**, and nothing is claimed as done. Authoritative status of all 16 workstreams: `SEO_FINAL_REVIEW.md`.

Status: **updated after Stage 3. Nothing here has been deployed.** Do not deploy without the owner's approval. The complete, ordered pre-production checklist is `SEO_PRODUCTION_READINESS.md`; this file keeps the live-server probe, the nginx snippets and the test matrix it refers to.
Branch: `feature/sitesurelabs-seo-implementation` (uncommitted at the time of writing).

## 1. What the live site does today (probed with `curl`, 2026-11-04)

| Check | Result | Needs action |
|---|---|---|
| `http://sitesurelabs.com` | 301 to `https://sitesurelabs.com/` | No |
| `https://sitesurelabs.com` | 200, served by nginx 1.24.0 on Ubuntu | No |
| `Strict-Transport-Security` header | **Absent** | **Yes** |
| `https://www.sitesurelabs.com` | **200 with a full page** (no redirect to the apex), so two hosts serve the same content | **Yes** |

The server answering is an Ubuntu host nginx, not this repo's container. It terminates TLS and proxies to the container. The fixes below belong in that host's nginx server blocks, which are not in this repository, so they were **not** changed here and nothing was assumed about them.

### Host nginx (TLS layer): changes to make by whoever manages the server

```nginx
# apex, HTTPS: add to the existing 443 server block for sitesurelabs.com
add_header Strict-Transport-Security "max-age=31536000" always;   # start without includeSubDomains/preload

# www -> apex, both schemes (a separate server block; reuse the same certificate, which must cover www)
server {
    listen 80;  listen 443 ssl;
    server_name www.sitesurelabs.com;
    # ssl_certificate / ssl_certificate_key: as for the apex
    return 301 https://sitesurelabs.com$request_uri;
}
```

Notes: confirm the certificate includes `www.sitesurelabs.com` first. Raise HSTS `max-age` or add `includeSubDomains`/`preload` only after the site has run cleanly on HTTPS for a while; preload is hard to undo. If the host nginx proxies to the container, keep `proxy_set_header X-Forwarded-Proto $scheme;`. The container's `add_header` values pass through the proxy, so do not duplicate the security headers at the host.

## 2. Before deploying this branch

- [ ] Owner has reviewed the diff and approved a commit and a deploy.
- [ ] `cd frontend && npm ci && npm run typecheck && npm run lint && npm run build && npm run test:seo` all pass on a clean checkout (Node >= 22.18; the Dockerfile uses Node 24).
- [ ] **Validate the nginx config** (not yet run anywhere):
  ```bash
  cd frontend && docker build -t sitesurelabs-web .
  docker run --rm --add-host api:127.0.0.1 sitesurelabs-web nginx -t
  ```
- [ ] **Run the redirect and status matrix** against the container (`docker run --rm -p 8080:80 --add-host api:127.0.0.1 sitesurelabs-web`), expected values:

  | Request | Expected |
  |---|---|
  | `GET /` | 200, HTML contains an `<h1>` and `<title>SiteSureLabs \| AI-Powered Construction Technology Solutions</title>` |
  | `GET /about` | 200, `<link rel="canonical" href="https://sitesurelabs.com/about">` |
  | `GET /about/` | 301, `Location: /about` |
  | `GET /about/index.html` | 301, `Location: /about` |
  | `GET /index.html` | 301, `Location: /` |
  | `GET /about/?x=1` | 301, `Location: /about?x=1` |
  | `GET /products/sitevision` | 301, `Location: /products/site-vision` (one hop) |
  | `GET /products/sitevision/` | 301, `Location: /products/site-vision` (one hop) |
  | `GET /products/site-vision` | 200 |
  | `GET /products/does-not-exist` | **404** with the NotFound page (noindex) |
  | `GET /nope` | **404** |
  | `GET /api/health` (or any `/api/` URL) | response carries `X-Robots-Tag: noindex, nofollow` |
  | `GET /assets/<any hashed file>` | has `Content-Security-Policy`, `X-Frame-Options`, `Cache-Control: ... immutable` |
  | `GET /media/<any file>` | has `Content-Security-Policy` and `Cache-Control: public, max-age=2592000` |
  | `GET /sitemap.xml`, `GET /robots.txt` | 200, correct content type |

  `curl -sI http://localhost:8080/<path>` shows status and headers. If `/` or any page loops on redirects, the `if ($request_uri ...)` rules in `nginx.conf` need adjusting.
- [ ] `/contact?type=demo&product=site-vision` still pre-selects SiteVision and submits successfully (the API value stays `sitevision`).
- [ ] Open the built site in a real phone browser: hero headline fits at 360-390 px width; both CTAs reachable.
- [ ] In the browser console on the deployed site there are no hydration or CSP errors.

## 3. After deploying

- [ ] `curl -sI https://sitesurelabs.com` shows `Strict-Transport-Security` once the host change in section 1 is made.
- [ ] `curl -sI https://www.sitesurelabs.com` returns a single 301 to the apex.
- [ ] `curl -s https://sitesurelabs.com/ | grep -c '<h1'` is 1 (HTML is real without JavaScript).
- [ ] Google Rich Results Test and Schema.org Validator on `/`, `/products` and `/products/anviksha`.
- [ ] Search Console: add the property, submit `https://sitesurelabs.com/sitemap.xml`, use URL Inspection on `/` and `/products/site-vision` and request indexing. Watch Pages and Sitemaps reports for the old `/products/sitevision` URL dropping out.
- [ ] Set `modified` dates in `frontend/src/data/seo.ts` for pages whose content changed in this release (the sitemap omits `<lastmod>` until then), rebuild and redeploy.

## 4. Owner actions that no code can replace

- Host nginx: HSTS and www to apex redirect (section 1).
- Search Console and Bing Webmaster ownership, and sitemap submission.
- Confirm or restore verified product metrics (`SEO_AUDIT_AND_IMPLEMENTATION.md`, section 8.2).
- Confirm founder details and wording; company address, phone, legal entity and social profile URLs for the Organization schema.
- Approve the homepage wording ("AI-powered construction technology for the real world.").

## 5. Rollback

The change set is front-end and nginx only, with no database or API changes. Redeploy the previous image to roll back. The previous build serves `/products/sitevision`; the redirect only exists in the new nginx config, so after a rollback the new `/products/site-vision` URL will 404 until the new build is redeployed.

## 6. Added in Stage 3

New routes and files to check once deployed (all 200 unless noted):

| URL | Expected |
|---|---|
| `/blog` | 200, one `<h1>`, **`noindex`** placeholder while no article is approved; no Blog link in nav or footer |
| The three draft article URLs | **Should not exist in production.** They exist only in a non-strict (preview) build, as noindex drafts with a DRAFT banner. After the owner approves one and it is set to `review: 'approved'`, it becomes a normal 200 page with `og:type=article` and `Article` JSON-LD, joins the sitemap, and the Blog link appears in the nav |
| `/products/site-vision` | 200, `SoftwareApplication` and `VideoObject` JSON-LD |
| `/llms.txt` | 200, plain text |
| `/sitemap.xml` | lists **9** URLs (no `/blog`, no articles, no `/privacy` or `/terms`) |
| `/products/progress-tracker` | 200 but `noindex`, and absent from the sitemap |

Validate structured data on one page per type (home, a product; and an article only after it is approved) with the Google Rich Results Test and the Schema.org Validator. Expect eligibility messages only where Google supports a type; `Organization`, `WebSite` and `BreadcrumbList` are informational.

## 7. External tasks still pending (they do not block development)

These need server access, accounts or tools that are not part of this repository. Nothing here has been done, and the production server was not touched.

- [ ] **HSTS** on the Ubuntu host nginx (section 1).
- [ ] **www to apex**: one 301 from `https://www.sitesurelabs.com` and `http://www.sitesurelabs.com` to `https://sitesurelabs.com`.
- [ ] **Certificate** covers both `sitesurelabs.com` and `www.sitesurelabs.com` (`openssl s_client -connect www.sitesurelabs.com:443 -servername www.sitesurelabs.com </dev/null | openssl x509 -noout -ext subjectAltName`).
- [ ] **nginx validation and the full status/redirect matrix** (sections 2 and 6) when Docker is available.
- [ ] **Real mobile browser test** on an iPhone and an Android phone: home hero, a product page, the blog, an article, the contact form.
- [ ] Search Console and Bing Webmaster ownership, sitemap submission (`SEO_ANALYTICS_SETUP.md`).
- [ ] GA4 ID and a consent decision (`SEO_ANALYTICS_SETUP.md`).
- [ ] Owner inputs: verified product metrics, founder details, company address, phone, legal name, social URLs, confirmed contact email, a new `og-image.png` matching the new positioning.
- [ ] Review of the three articles by the Anviksha and SiteVision teams before publishing.
