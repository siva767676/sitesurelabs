# SiteSureLabs.com

Marketing site for **SiteSureLabs**, an AI product company (Anviksha, SiteVision, Digi Reco) that also builds custom AI and software for enterprises.

- **Frontend** (`frontend/`): React 19 + TypeScript + Vite, Tailwind CSS v4, Motion for React, GSAP ScrollTrigger, Three.js / React Three Fiber.
- **Backend** (`backend/`): FastAPI + Pydantic + SQLAlchemy. Handles contact / demo / project enquiries.
- **Deployment** (`docker-compose.yml`): nginx (static site + `/api` proxy) → FastAPI → PostgreSQL.

Everything on the site is derived from the three product demo recordings supplied by the company. Nothing is invented: unconfirmed facts are marked `CONFIRM` in code and listed in [Open items](#open-items-needing-real-assets-credentials-or-confirmation).

---

## Quick start

Requirements: Node ≥ 22.18, Python ≥ 3.11.

```bash
# 1. Backend  (http://127.0.0.1:8000, docs at /api/docs in development)
cd backend
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements-dev.txt     # macOS/Linux: .venv/bin/python
cp .env.example .env                                            # edit if you like; defaults work for dev (SQLite)
.venv/Scripts/python -m uvicorn app.main:app --reload --port 8000

# 2. Frontend (http://localhost:5173, proxies /api to :8000)
cd frontend
npm install
npm run dev
```

| Command (in `frontend/`) | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with `/api` proxy |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm run lint` | ESLint (React hooks rules included) |
| `npm run build` | Type-check, production build, then `scripts/postbuild.mjs` |
| `npm run preview` | Serve `dist/` (note: Vite's preview ignores the prerendered per-route files) |

| Command (in `backend/`) | What it does |
| --- | --- |
| `python -m pytest` | 15 API tests (validation, spam, rate limit, auth, CORS, persistence) |

`npm run build` also writes, per route, `dist/<route>/index.html` with its own title, description, canonical and Open Graph tags (plus `noindex` for placeholder pages), `dist/sitemap.xml`, and `dist/404.html`. This gives crawlers correct metadata without a server-rendered framework. See [Decisions](#decisions-worth-knowing).

---

## Project structure

```
sitesurelabs/
├── docker-compose.yml          nginx + FastAPI + PostgreSQL
├── .env.example                variables used by docker-compose
├── backend/
│   ├── app/
│   │   ├── main.py             app factory, CORS, request log, health
│   │   ├── config.py           environment-based settings (pydantic-settings)
│   │   ├── schemas.py          Pydantic request/response models
│   │   ├── db.py               SQLAlchemy model + session factory
│   │   ├── security.py         rate limiter, honeypot/timing checks, Turnstile
│   │   ├── notify.py           SMTP + webhook delivery (background task)
│   │   ├── errors.py           centralised error handlers ({"error": {...}})
│   │   ├── logging_config.py   structured JSON logging (no PII)
│   │   └── routes/enquiries.py POST /api/enquiries, GET /api/admin/enquiries
│   ├── tests/test_enquiries.py
│   ├── Dockerfile  requirements*.txt  .env.example
└── frontend/
    ├── index.html  nginx.conf  Dockerfile  .env.example
    ├── scripts/
    │   ├── postbuild.mjs       per-route HTML + sitemap + 404
    │   └── encode-media.sh     rebuilds public/media from the 4K recordings
    ├── public/                 favicon, robots.txt, og-image.png, media/ (stills, loops, demo videos)
    └── src/
        ├── design/tokens.ts    JS mirror of the design tokens
        ├── styles/global.css   design tokens (@theme), type scale, buttons, dotted type
        ├── lib/                hooks, motion presets, API client, Zod schema
        ├── data/               products, services, insights, testimonials, site (structured content)
        ├── components/
        │   ├── layout/         Header, mobile drawer, Footer, Layout
        │   ├── brand/          Logo (TEMPORARY wordmark), BrandClosing
        │   ├── three/          HeroScene (WebGL), HeroFallback (SVG)
        │   ├── home/           Hero, Positioning, EcosystemShowcase, Capabilities, ProblemSolution,
        │   │                   WorkflowDeepDive, Process, WhySure, SelectedWork, ContactPaths
        │   ├── product/        ProductFeature, CaseStudyTile
        │   ├── forms/          ContactForm, Turnstile
        │   └── ui/             Button, Magnetic, Reveal, TextReveal, DottedText, ImageReveal, SectionHeading,
        │                       PageHero, CtaBand, Accordion, VideoDialog, ServiceCard, Testimonial, Seo, States
        └── pages/              Home, Products, ProductDetail, Services, About, Insights, InsightDetail,
                                Contact, Legal (privacy/terms), NotFound
```

---

## What was built

### Pages

| Route | Page |
| --- | --- |
| `/` | Home: hero, positioning, product ecosystem, capabilities, problem→solution, scroll-driven workflow, process, principles, product demos, contact paths, animated brand closing, footer |
| `/products` | Product catalogue with a different composition per product (landscape, tall, full-width band) |
| `/products/:slug` | Reusable product template, driven entirely by `src/data/products.ts` |
| `/services` | Eight custom-engineering services, each with outcome, capabilities and a use-case CTA |
| `/about` | Philosophy, principles, product-first, founder placeholder |
| `/insights`, `/insights/:slug` | Templates for case studies, engineering articles, product updates (placeholders, `noindex`) |
| `/contact` | Functional enquiry form (demo / project / general), pre-filled from `?type=&product=&service=` |
| `/privacy`, `/terms` | Drafts for legal review |
| `*` | Custom 404 |

### Design system

Tokens live in one place: `src/styles/global.css` (`@theme` and `:root`), mirrored for JS in `src/design/tokens.ts`. They cover colour, type scale (fluid `clamp()`), 8 px spacing, layout widths, radii, shadows, motion durations and easings, z-index layers and breakpoints. Dark-first with light "paper" sections (`.theme-light`) where detail needs contrast. Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (technical labels), all self-hosted via Fontsource.

### Animation and interaction

| Treatment | Where | Tech |
| --- | --- | --- |
| Letter-by-letter masked headline (screen-reader-safe) | Hero | Motion (`TextReveal`) |
| Word-masked headings, differing section reveals (fade-up, clip-up, clip-right, scale, slide) | All pages | Motion (`Reveal`, `TextReveal`) |
| Rotating dotted globe with network arcs, light trails, orbit rings, pointer parallax | Hero | React Three Fiber + custom shaders; lazy-loaded; SVG fallback |
| Halftone / dotted display type (real text, dot fill via `background-clip`) | Positioning, About, 404 | CSS |
| Scroll-lit statement | Home positioning | Motion `useScroll` |
| Interactive product showcase with active state, clip transitions and depth parallax | Home | Motion |
| Image clip reveals with settle-zoom | Product pages | Motion (`ImageReveal`) |
| Magnetic buttons (desktop, fine pointer only) | CTAs | Motion springs (`Magnetic`) |
| **Signature scroll story 1:** "From photograph to report" wipes between real Anviksha screens | Home | GSAP ScrollTrigger (lazy-loaded) |
| **Signature scroll story 2 / brand transformation:** a luminous point swells into the core, draws the ring and sight-lines, then the wordmark wipes in and the closing line + CTA arrive | Home end | GSAP ScrollTrigger (lazy-loaded) |

Neither scroll sequence pins or hijacks scrolling (CSS `position: sticky` + scrub). Both collapse to a static layout under `prefers-reduced-motion`, and the workflow story becomes a stacked list below 1024 px.

**Ownership rule:** simple interface motion lives in Motion presets (`src/lib/motion.ts`); long scroll timelines live in GSAP; 3D lives in Three.js.

### Graceful degradation

- Hero paints an SVG globe immediately; the WebGL scene mounts only after `load`, on devices with WebGL, enough CPU/memory, no `saveData`, and no reduced-motion preference. It pauses off-screen, lowers pixel ratio under load (`PerformanceMonitor`), disposes geometry on unmount, and falls back to the SVG on context loss or errors.
- Mobile: fewer particles (2,600 vs 6,200), lower DPR, no pointer effects, no annotations.
- Demo videos are never fetched until the visitor presses play; teaser loops and posters load only near the viewport.

---

## Backend API

Base path `/api`. All errors use one shape: `{"error": {"code", "message", "fields"?}}`.

| Method & path | Purpose |
| --- | --- |
| `POST /api/enquiries` | Create an enquiry. `201 {id, status, message}`. `422` per-field errors, `400` spam/verification, `429` rate-limited (with `Retry-After`). |
| `GET /api/admin/enquiries` | List stored enquiries. Requires `Authorization: Bearer $ADMIN_TOKEN`; returns 404 when `ADMIN_TOKEN` is unset. |
| `GET /api/health` | Liveness + database check. |

What `POST /api/enquiries` does: validates with Pydantic (unknown fields rejected, consent required, business email enforced, link-stuffing rejected) → rate-limits per hashed IP → checks honeypot and minimum fill time → verifies Turnstile if configured → de-duplicates identical resubmissions (24 h) → **stores** the enquiry → notifies by SMTP and/or webhook in a background task. A failed email never loses the enquiry; the outcome is recorded on the row (`notified`, `notify_error`). Raw IP addresses are never stored (salted hash only), and logs contain no personal data.

**Persistence:** PostgreSQL in production, SQLite for local development, both through SQLAlchemy via `DATABASE_URL`. Persistence is required so enquiries survive a missing or failing mail provider.

### Environment variables

Backend (`backend/.env.example` documents every one). None are ever exposed to the browser.

| Variable | Purpose |
| --- | --- |
| `APP_ENV` | `development` / `production` / `test`. Production disables `/api/docs` and refuses the default salt. |
| `CORS_ORIGINS` | Comma-separated allowed browser origins |
| `DATABASE_URL` | `sqlite:///./sitesurelabs.db` (dev) or `postgresql+psycopg://user:pass@host:5432/db` |
| `IP_HASH_SALT` | Random string; required in production |
| `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_SECONDS`, `MIN_FILL_SECONDS` | Abuse thresholds (5 per 10 min, 3 s) |
| `REQUIRE_BUSINESS_EMAIL` | Reject free-mail domains (default `true`) |
| `TRUST_PROXY_HEADERS` | `true` only behind a proxy you control (reads `X-Forwarded-For`) |
| `TURNSTILE_SECRET_KEY` | Optional Cloudflare Turnstile verification |
| `NOTIFY_TO`, `NOTIFY_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_STARTTLS` | Optional email notifications |
| `WEBHOOK_URL` | Optional CRM / automation webhook (JSON POST per enquiry) |
| `ADMIN_TOKEN` | Enables `GET /api/admin/enquiries` |

Frontend (`frontend/.env.example`; build-time, public only): `VITE_API_URL` (empty = same-origin `/api`), `VITE_TURNSTILE_SITE_KEY`.

Docker Compose variables are in the root `.env.example`.

---

## Deployment

### Option A: Docker Compose (recommended)

```bash
cp .env.example .env        # set POSTGRES_PASSWORD, IP_HASH_SALT, PUBLIC_ORIGIN, and optionally SMTP / ADMIN_TOKEN
docker compose up -d --build
# site on http://localhost:8080 (WEB_PORT). Put TLS in front: Caddy, Cloudflare, or your load balancer.
```

The `web` container serves the prerendered site with gzip, immutable caching for hashed assets, a strict Content-Security-Policy, byte-range video, a real `404` status for unknown URLs, and proxies `/api/` to the `api` container with per-IP request limiting. nginx overwrites `X-Forwarded-For`, so clients cannot spoof their address.

Reading enquiries: set `ADMIN_TOKEN`, then `curl -H "Authorization: Bearer $ADMIN_TOKEN" https://sitesurelabs.com/api/admin/enquiries`. Or query the `enquiries` table directly.

### Option B: static host + separate API

Build with `VITE_API_URL=https://api.example.com npm run build` and upload `frontend/dist/` to any static host, configured to serve `404.html` with status 404 for unknown paths and to try `<path>/index.html` for known ones. Run the API with `uvicorn app.main:app` behind TLS, set `CORS_ORIGINS` to the site origin.

### Before launch

1. Resolve the [open items](#open-items-needing-real-assets-credentials-or-confirmation) below.
2. Point `sitesurelabs.com` at the host and terminate TLS.
3. Set `IP_HASH_SALT`, a strong database password and SMTP or webhook credentials.
4. Submit the contact form once in production and confirm the notification arrives.
5. Submit `https://sitesurelabs.com/sitemap.xml` to Google Search Console.
6. Host `public/media/*.mp4` (about 36 MB) on a CDN if traffic grows. They are referenced by path in `src/data/products.ts`.

---

## Verification

Run on the final code:

| Check | Result |
| --- | --- |
| `tsc -b` | 0 errors |
| `eslint .` | 0 problems |
| `pytest` (backend) | 15 passed |
| `vite build` | succeeds; 15 route pages, 10 sitemap URLs, `404.html` |
| axe-core (WCAG 2 A/AA + best practice), 14 routes × desktop and mobile | 0 violations |
| Browser console on every route | no errors |
| Contact form, end to end against the live API | validation, success, server rejection and network failure each verified; row persisted |
| Reduced motion | no `<canvas>`, static closing, all content visible |
| Mobile drawer / keyboard | focus trap, Esc, focus restore, skip link, arrow-key tabs verified |
| Horizontal overflow | none at 390, 820, 1440 px |
| Docker stack (nginx → API → PostgreSQL), tested as deployed | every route 200 with its own `<title>`; unknown URL → real 404; strict CSP with no violations; hero WebGL renders under the CSP; form → PostgreSQL → admin endpoint; duplicate resubmission is idempotent; video `Range` → 206 |

Lighthouse (production build served by the nginx container, gzip on):

| | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Desktop | 99 | 100 | 100 | 100 |
| Mobile (simulated slow 4G, 4× CPU) | 77 | 100 | 100 | 100 |

Mobile performance is limited by client-side rendering: nothing paints until about 150 kB of gzipped JavaScript has executed on a throttled CPU, and the headline then animates in (LCP ≈ 4.7 s in the simulation, FCP 2.8 s, TBT 150 ms, CLS 0.002). The three.js chunk (≈ 245 kB gzip) is lazy and loads only after the page has loaded. If mobile LCP needs to improve further, the next step is server-side or static rendering of the hero (for example Next.js) with a CSS-driven headline entrance.

---

## Decisions worth knowing

- **Vite SPA, not Next.js.** A marketing site with a single contact form doesn't need a Node server. To avoid the usual SPA SEO weakness, `scripts/postbuild.mjs` emits per-route HTML with correct metadata, a sitemap and a real 404. Trade-off: the visible content still renders client-side, so first paint waits for JS.
- **Real screenshots only.** Product imagery is frames extracted from the supplied demo recordings (`scripts/encode-media.sh` rebuilds them). No fictional UI is presented as a product screen. The one illustration (Progress Tracker) is a labelled concept panel.
- **Placeholders are explicit.** Progress Tracker (`verified: false`) is `noindex` with "to be confirmed" copy. Insights entries are labelled templates and `noindex`. The testimonial component renders nothing until `src/data/testimonials.ts` contains approved quotes.
- **Business email enforced** on the form (client and server). Set `REQUIRE_BUSINESS_EMAIL=false` if that costs leads.
- **In-process rate limiter** is per worker (the Docker image runs one). The nginx config adds a per-IP limit in front for multi-instance setups.
- **`THREE.Clock` deprecation warning** appears in the dev console. It originates inside `@react-three/fiber` 9.x with three 0.186 and is harmless; it goes away when R3F updates.

---

## Open items needing real assets, credentials or confirmation

**Assets**
- [ ] **Official logo.** A typographic wordmark and aperture mark are temporary. Replace `LogoMark` / `Wordmark` in `src/components/brand/Logo.tsx` (also used by the closing animation), `public/favicon.svg` and `public/og-image.png`.
- [ ] **Founder photo and bio** (About page). No photo was found in the supplied folder (`d:\Siva.S\Desktop\v` held only the three videos).
- [ ] **Progress Tracker**: scope, capabilities, screenshots. All of its copy is placeholder.

**Permissions**
- [ ] **Customer branding in the demos.** The recordings and extracted stills show "My Home Group / My Home Constructions" branding and project names. Confirm permission to publish them, or re-record with neutral demo data. The figures shown are demo data and are labelled as such on the site.

**Business facts to confirm** (search the code for `CONFIRM`)
- [ ] Contact mailbox (`hello@sitesurelabs.com` is a placeholder) and any postal address / phone.
- [ ] Social profile links (none rendered until provided: `src/data/site.ts`).
- [ ] The list of services is genuinely deliverable (`src/data/services.ts`).
- [ ] About-page philosophy and principles wording (`src/data/site.ts`, `src/pages/About.tsx`), including the product-first claim.
- [ ] Deployment / integration details for each product (`deployment: null` hides that section until confirmed).
- [ ] Digi Reco scope wording (derived from the demo: steel reconciliation).
- [ ] Privacy Policy and Terms: entity name, retention period, governing law, processors (`src/pages/Legal.tsx`). Both are drafts for legal review.
- [ ] Case studies, results and testimonials, only with approval.

**Credentials**
- [ ] SMTP or webhook credentials, `ADMIN_TOKEN`, `IP_HASH_SALT`, database password.
- [ ] Optional: Cloudflare Turnstile site and secret keys.
- [ ] Domain DNS and TLS.
