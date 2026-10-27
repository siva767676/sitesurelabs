# SiteSureLabs.com

Marketing site for **SiteSureLabs**, an AI product company (Anviksha, SiteVision, Digi Reco, Parichay) that also builds custom AI and software for enterprises.

- **Frontend** (`frontend/`): React 19 + TypeScript + Vite, Tailwind CSS v4, Motion for React, GSAP ScrollTrigger, Three.js / React Three Fiber.
- **Backend** (`backend/`): FastAPI + Pydantic + SQLAlchemy. Handles contact / demo / project enquiries.
- **Database:** SQLite, one file. No database server to run.
- **Deployment** (`docker-compose.yml`): nginx (static site + `/api` proxy) → FastAPI, with the SQLite file on a Docker volume.

Everything on the site is derived from the four product demo recordings supplied by the company. Nothing is invented: unconfirmed facts are marked `CONFIRM` in code and listed in [Open items](#open-items-needing-real-assets-credentials-or-confirmation).

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
| `npm run dev` | Vite dev server with `/api` proxy (point it elsewhere with `API_PROXY=http://127.0.0.1:8001 npm run dev`). To share it through a tunnel such as ngrok, the hostname must be allowed: the current ngrok host is built in, and others can be added with `ALLOWED_HOSTS=your-name.ngrok-free.dev npm run dev` (comma-separated). Vite otherwise answers `403 Blocked request` |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm run lint` | ESLint (React hooks rules included) |
| `npm run build` | Type-check, production build, then `scripts/postbuild.mjs` |
| `npm run preview` | Serve `dist/` (note: Vite's preview ignores the prerendered per-route files) |

| Command (in `backend/`) | What it does |
| --- | --- |
| `python -m pytest` | 31 API tests (validation, spam, rate limit, auth, CORS, persistence, and SQLite itself: UTC timestamps, the 24-hour duplicate window, WAL mode, concurrent writers, notification results saved, in-memory databases, non-SQLite URLs refused) |

`npm run build` also writes, per route, `dist/<route>/index.html` with its own title, description, canonical and Open Graph tags (plus `noindex` for placeholder pages), `dist/sitemap.xml`, and `dist/404.html`. This gives crawlers correct metadata without a server-rendered framework. See [Decisions](#decisions-worth-knowing).

---

## Project structure

```
sitesurelabs/
├── docker-compose.yml          nginx + FastAPI (SQLite on the "data" volume)
├── .env.example                variables used by docker-compose
├── backend/
│   ├── app/
│   │   ├── main.py             app factory, CORS, request log, health
│   │   ├── config.py           environment-based settings (pydantic-settings)
│   │   ├── schemas.py          Pydantic request/response models
│   │   ├── db.py               SQLAlchemy model + SQLite engine (WAL mode, UTC timestamps)
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
    │   └── encode-media.sh     rebuilds public/media from the 4K recordings (and the 960 / 1280 px copies of the stills); a recording that is missing is skipped
    ├── brand/                  logo-source.jpg: the supplied logo artwork the vector logo was traced from
    ├── public/                 brand/ (logo SVGs), favicon, apple-touch icon, robots.txt, og-image.png, media/ (stills, demo videos)
    └── src/
        ├── design/tokens.ts    JS mirror of the design tokens
        ├── styles/global.css   design tokens (@theme), colour palettes (dark and light), type scale, buttons, dotted type
        ├── lib/                theme (light/dark), responsive images, hooks, motion presets, API client, Zod schema
        ├── data/               products, services, testimonials, site (structured content)
        ├── components/
        │   ├── layout/         Header, mobile drawer, Footer, Layout
        │   ├── brand/          Logo (the supplied logo as theme-aware SVG), logo-data (its traced paths), BrandClosing
        │   ├── three/          HeroScene (WebGL), HeroFallback (SVG); RobotDogScene (WebGL), RobotDogFallback (SVG),
        │   │                   robotDog (the robot's proportions, trot and leg IK, shared by both)
        │   ├── home/           Hero, ProductScroll, RobotDog (the robotic inspection dog), WhySure, ContactPaths ("Start here"),
        │   │                   Process (used by the Services page)
        │   ├── product/        ProductSheet (project details), ProductFeature, CaseStudyTile
        │   ├── forms/          ContactForm, Turnstile
        │   └── ui/             Button, Magnetic, Reveal, TextReveal, DottedText, ImageReveal, SectionHeading,
        │                       PageHero, CtaBand, Accordion, VideoDialog, ServiceCard, SwipeList, Testimonial, ThemeToggle, Seo, States
        └── pages/              Home, Products, ProductDetail, Services, About,
                                Contact, Legal (privacy/terms), NotFound
```

---

## What was built

### Pages

| Route | Page |
| --- | --- |
| `/` | Home: hero, product ecosystem (scroll-driven, with project details), the robotic inspection dog (in development), why SiteSureLabs, start here, animated brand closing |
| `/products` | Product catalogue with a different composition per product (landscape, tall, full-width band) |
| `/products/:slug` | Reusable product template, driven entirely by `src/data/products.ts` |
| `/services` | Eight custom-engineering services, each with outcome, capabilities and a use-case CTA |
| `/about` | Philosophy, principles, product-first, founder placeholder |
| `/contact` | Functional enquiry form (demo / project / general), pre-filled from `?type=&product=&service=` |
| `/privacy`, `/terms` | Drafts for legal review, with a sticky "On this page" index (it follows the section being read) and a contact card beside the text |
| `*` | Custom 404 |

### The homepage

Six blocks: hero, product ecosystem, the robotic inspection dog, why SiteSureLabs, start here, and the animated brand closing. The hero has one button ("Explore Our Products"). The sections that were removed (Who we are, From problem to solution, the Anviksha deep dive, Enterprise engagement, Selected works) are not repeated elsewhere on the home page: the deep dive now lives in each project's details sheet, and the process row is still on the Services page.

| Section | What it is |
| --- | --- |
| **Product ecosystem** (`ProductScroll`) | A sticky stage scrubbed by GSAP ScrollTrigger: as you scroll, the product name, copy and screen change. A rail (01–04) shows progress and jumps to a product. The one-word **Details** label opens that project's full details. Phones and tablets get a swipeable card carousel; reduced-motion users get a static grid. |
| **Project details** (`ProductSheet`) | Native `<dialog>`: problem → solution, audience, four key capabilities, and the former deep dive as a clickable Capture → Locate → Analyse → Report walkthrough over the real screens. Focus is trapped, Esc closes, the page behind is locked. Links to the demo video, the demo request form and the full product page. |
| **Robotic inspection dog** (`RobotDog`) | Announces the four-legged inspection robot the company is developing, and nothing more: "In development", a "Concept render" label, one line of copy and a "Register interest" button (the form opens with *Robotic inspection dog* chosen). It is the only section built as one framed stage, a dark "field monitor" in both themes, with a live 3D render of a procedural robot (described under Animation). The render is a concept made for the site: no dimension, sensor or capability is claimed. Reduced motion, no WebGL and low-power devices get a still drawing of the same robot. |
| **Why SiteSureLabs** (`WhySure`) | Four reasons, one line each. The row at the middle of the screen lights up as you scroll (line draws, icon draws, cursor spotlight on hover). |
| **Start here** (`ContactPaths`) | The page's contrast band (light in dark mode, dark in light mode): one wide "Request a demo" panel with drifting light, a dot grid, a rotating conic border and a cursor spotlight on hover. |

Content for all of it comes from `src/data/products.ts` and `src/data/site.ts`. Keep the copy short: a product has a one-sentence `blurb`, four `highlights` and four key `capabilities` (the details sheet shows the first four).

### Design system

Tokens live in one place: `src/styles/global.css` (`@theme`, `:root` and the colour palettes), mirrored for JS in `src/design/tokens.ts`. They cover colour, type scale (fluid `clamp()`), 8 px spacing, layout widths, radii, shadows, motion durations and easings, z-index layers and breakpoints. Dark by default, with a light theme (below) and contrast bands (`.theme-invert`) where detail needs contrast. Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (technical labels), all self-hosted via Fontsource.

### Page layout

Every section sits in one container (`.container-x`): content at most 1680 px wide (`--container-max`) between gutters of 20 to 56 px (`--gutter`), centred. Up to about 1790 px the content simply fills the screen; beyond that the margins grow evenly on both sides. A 1920 px screen has about 110 px each side (the earlier 1360 px container left 270 px) and nothing is pushed to one side.

The hero globe is placed against that container, not against the edge of the screen (`.hero-globe` in `global.css`, from 1024 px). Its sphere ends at the content edge, the same line as the header button and the product strip. It is sized to fit beside the headline and between the header and the product strip (at most 920 px), and it is never cut off. The four small annotations around it show from 1280 px, where there is room for them; below 1024 px the globe is centred behind the copy.

Paired buttons (call-to-action bands, product pages) sit side by side from 640 px and stack at full width below it. `Button` passes its width classes (`w-full sm:w-auto`) on to the magnetic wrapper; without that the wrapper stayed full width on desktop and pushed the second button onto its own line.

**Interior page heroes.** From 1024 px each interior page puts something beside its headline instead of leaving the right side empty (`PageHero`'s `visual` slot, components in `src/components/ui/PageVisuals.tsx`): Products shows its three real product screens layered; Services shows a live index of the eight services (it lights down to the one being read and jumps to it); About shows the logo with the four working principles around it; Contact shows a signal leaving the mark, with the email. Privacy and Terms get a sticky "On this page" index and a contact card. They are built from existing content and theme tokens, and are left out below 1024 px.

### Brand

The logo is the artwork supplied for the site: a charcoal "S" mark with an orange cap and three grey bars, "SITE" in charcoal and "SURE" in orange, and "LABS" set wide between two rules. Only a 1536 × 1024 JPG was supplied (kept in `frontend/brand/logo-source.jpg`), so it was traced to vector and is drawn as inline SVG. That keeps it sharp at every size and lets the charcoal parts reverse to off-white on a dark page.

| Where | What |
| --- | --- |
| Header and footer | `Logo` / `LogoStacked`: the artwork exactly as supplied, mark above the wordmark with LABS between its two rules (`src/components/brand/Logo.tsx`). From 1024 px the header is 88 px tall instead of 72 px so the lettering reads |
| End of the home page | `LogoStacked`: the artwork as supplied. `BrandClosing` builds it piece by piece as you scroll: the grey bars rise like floors, the dark S drives in, the orange slab caps it, then the wordmark and its rules arrive |
| Browser tab, home screen | `public/favicon.svg` (the mark on a tile: a charcoal tile on a light tab strip, a paper tile on a dark one), `favicon-32.png`, `apple-touch-icon.png` |
| Link previews | `public/og-image.png` (1200 × 630) |
| Standalone files | `public/brand/logo.svg` (for light backgrounds), `logo-reversed.svg` (for dark backgrounds), `logo-mark.svg` (the mark alone) |

The shapes live in `src/components/brand/logo-data.ts`. Their colours come from `--logo-ink`, `--logo-orange` and `--logo-gray`, so the logo follows the theme like everything else. To check the trace, the SVG was rendered in Chromium and compared with the JPG pixel by pixel: the mean difference is 6.4 out of 255 and 0.6% of pixels differ, all on anti-aliased edges. A trace is still an approximation: if the designer has the original vector file (SVG, AI or PDF), put it in `public/brand/` and replace `logo-data.ts`.

**Palette.** The logo's three colours drive the whole site, softened rather than saturated: graphite and warm off-white are the two page colours and the logo orange is the single accent. Contrast is measured against the page colour.

| Role | Dark | Light |
| --- | --- | --- |
| Page | `#141619` graphite | `#f7f4ef` warm paper |
| Raised surface | `#22252a` | `#ffffff` |
| Text | `#f4f1ec` (16.1:1) | `#22252a` (14.0:1) |
| Secondary text | `#adb1b7` (8.4:1) | `#565b62` (6.2:1) |
| Brand orange: buttons, dotted type, glows | `#f06623` | `#f06623` |
| Orange as small text, icons and lines | `#f47a3c` (6.6:1) | `#b8400b` (5.1:1) |
| Orange as large display type | `#f06623` (5.7:1) | `#d65a1c` (3.6:1) |
| The logo's grey, for secondary marks | `#8f969e` | `#6d737a` |

Orange fills carry charcoal text (4.85:1), never white. The products take a calm family of warm accents around the logo orange: Anviksha `#f06623`, SiteVision amber `#e8a14a`, Digi Reco terracotta `#d9744f`, Parichay sand `#cfae72`, Progress Tracker stone `#9aa6a0`.

### Light and dark themes

A toggle in the header (also in the mobile menu) switches the whole site between dark and light. A first-time visitor sees dark, the brand look; the choice is remembered (`localStorage` key `ssl-theme`) and followed by other open tabs.

| Piece | How it works |
| --- | --- |
| Active theme | `data-theme="light"` on `<html>` (absent or `dark` means dark). `src/lib/theme.ts` is the only code that changes it, and `useTheme()` reads it. |
| No flash on load | A one-line inline script in `index.html` applies the saved theme before first paint and sets the browser UI colour (`theme-color`). Under the production Content-Security-Policy its SHA-256 is allow-listed in `nginx.conf`; `scripts/postbuild.mjs` fails the build if the script and the hash drift apart. After editing the script, run `npm run build` and paste the hash it prints into both policy lines. |
| Colour | Every colour is a CSS custom property declared in two blocks in `src/styles/global.css` ("Colour palettes": dark and light, same names in the same order). Components use `var(--color-fg)`, `var(--color-bg-2)`, `var(--color-accent)` and so on, so they follow the theme with no per-theme code. Do not hard-code a hex, `white` or `black` in a component: add a token to both blocks instead. |
| Contrast bands | `.theme-invert` renders a section in the opposite palette (a light band in dark mode, a dark band in light mode): "Start here", the problem/solution and principles bands, the services process. `.theme-dark` and `.theme-light` force one palette (the robot's stage is `.theme-dark` in both themes); `.theme-root` returns to the page's palette inside a band (the "Start here" panel). |
| Product accents | A product's accent colour goes through `accentVars()` (`src/lib/accent.ts`), the `.accent-scope` class and `var(--accent-ink)`: full strength on dark, mixed toward ink on light, so small labels stay readable in both. |
| Images | Screenshots are never altered. The faded bottom edge that hides the recordings' burned-in subtitles dissolves into whatever the screenshot sits on: a slightly raised graphite matte in dark mode (`--color-shot`), the paper itself in light mode (`--color-shot: transparent`), so light and dark screens both end softly. Glows, shadows and hairline rings come from per-theme tokens. |
| WebGL globe | Reads the theme from `useTheme()`. Dark: light adds up (additive blending), warm off-white land dots with an orange network. Light: charcoal land dots and the same orange network composite normally, and nodes get a dark core (`globe` in `src/design/tokens.ts`). Colours update in place; nothing is rebuilt. |
| Switching | Where the browser supports the View Transitions API, the new theme is revealed as a circle growing from the toggle. Elsewhere the colours cross-fade. With `prefers-reduced-motion` it is instant. |

To follow the visitor's OS setting on first visit instead of defaulting to dark, change `DEFAULT_THEME` and the inline script as described in `src/lib/theme.ts`.

### Mobile

Checked at 320, 360, 390 and 430 px, on tablets (768 and 820 px) and in landscape (844 × 390), in both themes. What a phone gets that a desktop does not:

| Area | On a phone |
| --- | --- |
| Rhythm | Section padding is 64 px instead of 88 px (`--section-y`; desktop spacing is unchanged). The brand closing's scroll track is 2.1 screens instead of 2.8. The home page is **7.9 screens** on a phone (see Verification), the Anviksha page **8.4** (was 12.4), Products **7.0** (was 7.6). |
| First screen | Buttons are full width, the product strip is a 2 x 2 grid (one row from 1024 px), the headline sets on exactly three lines from 320 px up, and the lead paragraph is there from the first paint: it is the largest thing painted (the LCP), so it is not faded in. |
| Image stacks | Product cards, workflow steps and application screens are swipe rows (`SwipeList`: native scroll-snap, position dots, keyboard-focusable) instead of long stacks. From 768 px up the same markup is the grid it always was. |
| Touch | Every button and link is at least 44 px tall where the primary pointer is coarse (`@media (pointer: coarse)`); mouse layouts are untouched. Hover effects only run where hover exists (`@media (hover: hover)`), so nothing is left "stuck" after a tap. No grey tap flash. |
| Forms | The enquiry form comes before the "what happens next" notes. The three enquiry types are full-width 48 px options, fields are 16 px (iOS does not zoom) and ask for the right keyboard (email, capitals, Next key), and the submit button is full width. |
| Menu | The drawer scrolls on short screens, sizes its links to the screen height and drops the product chips under 700 px tall, so "Request a Demo" and the theme toggle are always reachable (checked at 320 × 568 and in landscape). |
| Images | Every still has 960 and 1280 px copies (`scripts/encode-media.sh`, `src/lib/images.ts`) and each image says how wide it is drawn (`sizes`), so a phone downloads a third to a half of the bytes (the Anviksha page: 315 kB of stills down to 90 to 110 kB). Heavily cropped images keep the full file. |
| Fonts | Inter and Space Grotesk have metric-matched fallbacks (`Inter Fallback`, `Space Grotesk Fallback` in `global.css`, measured against the real fonts), so the web font swap moves nothing: layout shift 0. |
| Effects | The 3D globe starts later on a phone and not at all on slow connections or data saver. The robot render stacks above its copy below 1024 px and draws fewer dust particles; vertical swipes over it still scroll the page. The "Start here" light show is static on phones. The header's glass uses less blur on touch screens, with the `-webkit-` property for iOS before 18. |
| Dialogs | The details sheet's actions take two rows (a fifth of the screen at most). The video fits a landscape phone with its close button and caption on screen. |
| Safe areas | Page gutters respect the notch in landscape; the footer and menu clear the home indicator. |

### Animation and interaction

| Treatment | Where | Tech |
| --- | --- | --- |
| Letter-by-letter masked headline (screen-reader-safe) | Hero | Motion (`TextReveal`) |
| Word-masked headings, differing section reveals (fade-up, clip-up, clip-right, scale, slide) | All pages | Motion (`Reveal`, `TextReveal`) |
| Rotating dotted globe with network arcs, light trails, orbit rings, pointer parallax | Hero | React Three Fiber + custom shaders; lazy-loaded; SVG fallback |
| Halftone / dotted display type (real text, dot radius driven by scroll, light sweep, hover sweep) | About, 404 | CSS + Motion `useScroll` |
| **Scroll-driven product stage:** name, copy and screen change as you scroll; layers wipe in, front screen gets depth | Home ecosystem | GSAP ScrollTrigger (lazy-loaded) + Motion |
| Reading-guide list: active row draws its line and icon, cursor spotlight | Home why | Motion `useInView` + CSS |
| **Robotic inspection dog:** the stage powers on like a screen (a bright line opens out into the picture); the status line decodes from random glyphs; the robot arrives as a wireframe and a scan sweep turns it solid, then its visor lights. It trots in place (diagonal pairs, two-bone leg IK) while the floor grid, a building grid of columns and beams and the dust slide past; a sonar ring pulses across the floor and lights the columns it reaches; a scan band climbs the body. Scrolling orbits the camera, a horizontal drag turns it with inertia, the mouse adds parallax. A reticle tracks the head, a readout shows the viewing angle and a gait panel lights the feet on the floor, all live from the render. A light runs round the frame. Pause button; it stops off screen | Home robotics | React Three Fiber + custom GLSL (lazy-loaded, procedural, no model files); Motion `useScroll` / `useInView`; CSS `@property` |
| Aurora panel, rotating conic border, cursor spotlight, clip reveal | Home start here | CSS + Motion |
| Project details sheet: scale-in, staggered content, clip-wipe between workflow screens | Home ecosystem | CSS + Motion |
| Image clip reveals with settle-zoom | Product pages | Motion (`ImageReveal`) |
| Magnetic buttons (desktop, fine pointer only) | CTAs | Motion springs (`Magnetic`) |
| **Theme switch:** the new theme is revealed as a circle growing from the toggle; the sun and moon swap places | Header toggle | View Transitions API (cross-fade fallback) + CSS |
| **Brand transformation:** the logo assembles as you scroll: the three grey bars rise, the dark S drives in around them, the orange slab caps it, the wordmark and its rules arrive, then the closing line and CTA | Home end | GSAP ScrollTrigger (lazy-loaded) |

The two scroll-driven sequences (product stage, brand closing) use CSS `position: sticky` plus a scrub: no pinning, no scroll hijacking. Under `prefers-reduced-motion` they become static (a product grid, and the finished closing), and below 1024 px the product stage becomes a swipeable carousel.

**Ownership rule:** simple interface motion lives in Motion presets (`src/lib/motion.ts`); long scroll timelines live in GSAP; 3D lives in Three.js.

### Graceful degradation

- Hero paints an SVG globe immediately; the WebGL scene mounts only after `load`, on devices with WebGL, enough CPU/memory, no `saveData`, and no reduced-motion preference. It pauses off-screen, lowers pixel ratio under load (`PerformanceMonitor`), disposes geometry on unmount, and falls back to the SVG on context loss or errors.
- Mobile: fewer particles (2,600 vs 6,200), lower DPR, no pointer effects, no annotations, and the scene starts 2.8 s after load instead of 0.5 s. On connections reporting 2G/3G (or data saver) it is skipped and the static globe stays.
- The robot's 3D scene is fetched only when its section comes within 600 px of the screen, and only on devices that pass the same WebGL and low-power checks; otherwise (and for reduced motion) the still drawing is shown. It renders only while on screen and while not paused, caps the pixel ratio at 1.75 and drops to 1 under load (`PerformanceMonitor`), disposes its geometry and materials on unmount, and falls back to the still on context loss or errors. It reuses the three.js chunk the hero already loaded.
- Demo videos are fetched only when the visitor presses Demo. Screenshots are lazy-loaded WebP.
- The demo recordings have subtitles burned into the bottom edge; screenshots fade that edge (`.fade-caption`) so the subtitles don't compete with the layout.
- If GSAP fails to load, the product section falls back to the static card layout instead of an empty scroll track.

---

## Backend API

Base path `/api`. All errors use one shape: `{"error": {"code", "message", "fields"?}}`.

| Method & path | Purpose |
| --- | --- |
| `POST /api/enquiries` | Create an enquiry. `201 {id, status, message}`. `422` per-field errors, `400` spam/verification, `429` rate-limited (with `Retry-After`). |
| `GET /api/admin/enquiries` | List stored enquiries. Requires `Authorization: Bearer $ADMIN_TOKEN`; returns 404 when `ADMIN_TOKEN` is unset. |
| `GET /api/health` | Liveness + database check. |

What `POST /api/enquiries` does: validates with Pydantic (unknown fields rejected, consent required, business email enforced, link-stuffing rejected) → rate-limits per hashed IP → checks honeypot and minimum fill time → verifies Turnstile if configured → de-duplicates identical resubmissions (24 h) → **stores** the enquiry → notifies by SMTP and/or webhook in a background task. A failed email never loses the enquiry; the outcome is recorded on the row (`notified`, `notify_error`). Raw IP addresses are never stored (salted hash only), and logs contain no personal data.

**Persistence:** SQLite, through SQLAlchemy, everywhere: development, tests and production. The database is one file (`DATABASE_URL`: `./sitesurelabs.db` in development, `/data/sitesurelabs.db` on the `data` volume in Docker); the file, its folder and the table are created on first start. Persistence is required so enquiries survive a missing or failing mail provider.

| SQLite detail | How it is handled (`backend/app/db.py`) |
| --- | --- |
| One writer at a time | WAL mode (`PRAGMA journal_mode=WAL`): reads never wait for a write, and a writer that finds the file locked waits up to 15 s instead of failing. Saving a notification result in the background while a request reads or writes is safe. |
| Threads | Sessions are used from FastAPI's thread pool and from background tasks, so connections may cross threads (`check_same_thread=False`). |
| Time zones | SQLite has no time zone type. Timestamps are stored as UTC and read back as UTC (`UTCDateTime`), so the 24-hour duplicate window compares correctly and the admin API and webhooks send `…+00:00`. Rows written before this change read back the same way. |
| Scale | One API worker, a few writes a day: far below what SQLite handles. Keep the file on a local disk (the Docker volume), not a network share, where WAL locking does not work. |

Only SQLite URLs are accepted (`sqlite:///relative/path.db`, `sqlite:////absolute/path.db`, or `sqlite://` for a throwaway in-memory database); anything else stops the API at start-up with a clear message.

### Environment variables

Backend (`backend/.env.example` documents every one). None are ever exposed to the browser.

| Variable | Purpose |
| --- | --- |
| `APP_ENV` | `development` / `production` / `test`. Production disables `/api/docs` and refuses the default salt. |
| `CORS_ORIGINS` | Comma-separated allowed browser origins |
| `DATABASE_URL` | The SQLite file: `sqlite:///./sitesurelabs.db` (default, relative to the folder the API starts in). The Docker image sets `sqlite:////data/sitesurelabs.db` |
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
cp .env.example .env        # set IP_HASH_SALT, PUBLIC_ORIGIN, and optionally SMTP / ADMIN_TOKEN
docker compose up -d --build
# site on http://localhost:8080 (WEB_PORT). Put TLS in front: Caddy, Cloudflare, or your load balancer.
```

The `web` container serves the prerendered site with gzip, immutable caching for hashed assets, a strict Content-Security-Policy, byte-range video, a real `404` status for unknown URLs, and proxies `/api/` to the `api` container with per-IP request limiting. nginx overwrites `X-Forwarded-For`, so clients cannot spoof their address. The policy allow-lists exactly one inline script, by SHA-256: the theme bootstrap in `index.html` (see [Light and dark themes](#light-and-dark-themes)).

Reading enquiries: set `ADMIN_TOKEN`, then `curl -H "Authorization: Bearer $ADMIN_TOKEN" https://sitesurelabs.com/api/admin/enquiries`. Or open a backup (below) in any SQLite tool, such as the `sqlite3` shell or DB Browser for SQLite, and read the `enquiries` table.

**The data and backups.** Enquiries live in `/data/sitesurelabs.db` in the `api` container, on the named volume `data` (`<project>_data`). The volume survives `docker compose down`, rebuilds and restarts; `docker compose down -v` deletes it. Back it up with SQLite's backup API, which takes a consistent copy while the API keeps running (copying the `.db` file alone can miss writes still in its `-wal` file):

```bash
docker compose exec api python -c "import sqlite3; sqlite3.connect('/data/sitesurelabs.db').backup(sqlite3.connect('/data/backup.db'))"
docker compose cp api:/data/backup.db ./sitesurelabs-backup.db
docker compose exec api rm /data/backup.db
```

To restore, stop the stack, copy the backup into the volume as `sitesurelabs.db` (with no `-wal` or `-shm` file beside it), and start it again.

### Option B: static host + separate API

Build with `VITE_API_URL=https://api.example.com npm run build` and upload `frontend/dist/` to any static host, configured to serve `404.html` with status 404 for unknown paths and to try `<path>/index.html` for known ones. Run the API with `uvicorn app.main:app` behind TLS, set `CORS_ORIGINS` to the site origin, and point `DATABASE_URL` at a file on a persistent local disk.

### Before launch

1. Resolve the [open items](#open-items-needing-real-assets-credentials-or-confirmation) below.
2. Point `sitesurelabs.com` at the host and terminate TLS.
3. Set `IP_HASH_SALT` and SMTP or webhook credentials, and schedule a backup of the database (see [the data and backups](#option-a-docker-compose-recommended)).
4. Submit the contact form once in production and confirm the notification arrives.
5. Submit `https://sitesurelabs.com/sitemap.xml` to Google Search Console.
6. Host `public/media/*.mp4` (about 47 MB) on a CDN if traffic grows. They are referenced by path in `src/data/products.ts`.

---

## Verification

Run on the final code with scripted browser checks (Playwright, axe-core, Lighthouse). The scripts are not part of the repo.

| Check | Result |
| --- | --- |
| `tsc -b` | 0 errors |
| `eslint .` | 0 problems |
| `pytest` (backend) | 31 passed |
| `vite build` | succeeds; 12 route pages, 11 sitemap URLs, `404.html` |
| axe-core (WCAG 2 A/AA + best practice) | 0 violations **in both the dark and the light theme** (56 audits each): the homepage in every motion state (stage at four scroll positions, the robot stage once powered on, each section, closing, footer, details sheet, phone menu) on desktop and phone, the contact form with its validation errors showing, and all 13 routes at both sizes |
| Browser console | no errors or warnings |
| Theme behaviour checks (27) | first visit is dark and nothing is stored; the toggle switches, saves the choice, updates the browser UI colour and keeps the choice after reload; with the app JavaScript blocked the saved theme is already applied (no flash); Enter and Space work and focus is visible; a second tab follows; with storage blocked the page still loads dark and switches for the visit; on a phone the header toggle is at least 44 px and the menu has its own; no horizontal overflow or header collision at 320 and 360 px; the cross-fade path works without the View Transitions API |
| Content-Security-Policy | the production bundle under the real nginx policy: the inline theme script runs when its hash is in the policy and is blocked when it is not, and the build fails if the two ever differ |
| Existing behaviour suite (37) | passes in both themes on the dev server (the nginx container was last checked before the robot section) |
| Mobile behaviour checks (43), in both themes | no horizontal overflow and no console errors on every page at 320 × 568, 360 × 740, 390 × 844, 430 × 932, 768 × 1024 and 844 × 390; every button and link at least 44 px tall on touch (13 pages, 390 and 320 px wide); a tap leaves nothing in its hover state; the lead paragraph is visible from the first paint on a phone and still animates in on desktop; a 2x phone gets the 960 px image and a 3x phone the 1280 px one; the menu's CTA and theme toggle are reachable at 320 × 568 and in landscape; product pages use swipe rows on a phone and grids on a tablet; the contact form comes first on a phone and beside the notes on desktop; keyboards and 16 px fields; page and closing-track lengths; the hero headline on exactly three lines from 320 to 430 px; the details sheet's footer fits two rows; the video, its close button and caption fit a landscape phone |
| Behaviour checks (37) | name changes as you scroll and is reversible; rail buttons by keyboard and mouse; Details opens the sheet, focus moves in and is trapped, the page behind is locked, Esc closes, focus returns; the sheet's stepper by arrow keys; demo plays inside the sheet and Esc closes only the video; planned product shows "In development" instead of Details; "Start here" has the one demo panel and the hero the one button; phone carousel and sheet; reduced motion |
| Robot section checks (39), in both themes | the 3D scene is not fetched until the section is near, then mounts and powers on (the heading is visible and hit-testable); heading, "In development" and "Concept render" are in the page and the visual has an accessible name; the gait readout alternates the diagonal pairs; scrolling orbits the camera and a drag turns it, and the drag hint then fades; pause freezes the render and marks the stage so its CSS loops stop, play resumes; it stops rendering off screen; "Register interest" opens the form with *Robotic inspection dog* chosen; reduced motion, no WebGL and a low-power device get the still drawing (no pause button when nothing moves); on a phone the robot sits above the copy, vertical swipes still scroll, nothing overflows; no console errors |
| Horizontal overflow | none at 320, 360, 390, 430, 768, 820, 1440 px or in landscape (844 × 390), on every page |
| Docker stack (nginx → API → SQLite), tested as deployed | every route 200 with its own `<title>`; unknown URL → real 404; strict CSP with no violations; hero WebGL renders under the CSP; the behaviour suite passes against nginx; video `Range` → 206. After the move to SQLite (rebuilt and re-tested): health reports the database; the real contact form, submitted in a browser, is stored and listed with its `+00:00` time; the file sits in `/data` (owned by the app user, WAL mode); the data survives an API restart and the containers being removed and recreated; the backup command produces a readable copy; no PostgreSQL package is in the image |

Lighthouse (production build, gzip on):

| | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Home, desktop, dark | 99 | 100 | 100 | 100 |
| Home, desktop, light | 99 | 100 | 100 | 100 |
| Home, mobile, dark (simulated slow 4G, 4× CPU) | 88 to 91 | 100 | 100 | 100 |
| Home, mobile, light | 89 to 93 | 100 | 100 | 100 |
| Home, mobile, with the 3D scene running (software WebGL in the test browser) | 82 to 86 | 100 | 100 | 100 |

On a phone the page is client-rendered, so nothing paints until about 155 kB of gzipped JavaScript has run on a throttled CPU (FCP about 2.7 s in the simulation). The lead paragraph is the largest thing painted, so it is shown from the first paint instead of fading in: LCP is 2.6 to 3.3 s (it was 4.7 s). The web-font swap moves nothing (layout shift 0, it was 0.002). The 3D scene starts 2.8 s after load, so total blocking time is 40 to 50 ms (it was about 165 ms); with the scene running in the test browser (software WebGL, much slower than a real GPU) it is 200 to 290 ms. If LCP needs to improve further, the next step is static prerendering of the hero (for example Next.js).

Homepage size, measured the same way before and after this change (same machine, same method):

| Homepage | Before | After |
| --- | --- | --- |
| Height, desktop (1440 × 900) | 21.75 screens | **11.52 screens** |
| Height, mobile (390 × 844) | 22.27 screens | **7.87 screens** |
| Words (real text nodes, excluding decorative duplicates) | 1,145 | **389** desktop / **350** mobile |

"After" includes the robotic inspection dog stage added later (about 1 screen on desktop, 0.9 on a phone, 19 words; it was 10.51 and 7.30 screens before it). The brand closing is still the largest single block (3.2 screens on desktop). Trimming its scroll distance (`h-[210vh] md:h-[320vh]` in `BrandClosing.tsx`; it was 280vh on phones) is the easiest way to shorten the page further.

---

## Decisions worth knowing

- **Vite SPA, not Next.js.** A marketing site with a single contact form doesn't need a Node server. To avoid the usual SPA SEO weakness, `scripts/postbuild.mjs` emits per-route HTML with correct metadata, a sitemap and a real 404. Trade-off: the visible content still renders client-side, so first paint waits for JS.
- **Real screenshots only.** Product imagery is frames extracted from the supplied demo recordings (`scripts/encode-media.sh` rebuilds them). No fictional UI is presented as a product screen. The two illustrations are labelled as such: Progress Tracker's concept panel, and the robotic inspection dog's "Concept render".
- **Dark by default, light on request.** The brand look is dark, so that is what a first-time visitor sees; the toggle remembers the choice. Light is a full second palette, not an inversion filter, and the contrast bands flip against whichever theme is active. Product screenshots are shown as they are in both themes.
- **Orange is the accent, not the background.** The palette comes from the logo (charcoal, orange, grey) and is kept calm: graphite or warm paper behind everything, orange only on fills (buttons, dotted type, glows, the globe's network) and in a few text roles. Small orange text uses `--color-accent` (lighter on graphite, burnt orange on paper) so it passes WCAG AA; large display words use `--color-accent-display`; buttons keep the pure logo orange with charcoal text. Never put the raw logo orange on paper as small text (2.9:1).
- **Touch behaviour keys off the input device, not the screen width.** Finger-sized targets use `(pointer: coarse)` and hover effects use `(hover: hover)`, so a narrow desktop window keeps its mouse layout and a large tablet gets finger-sized controls.
- **Responsive images by file name.** `name.webp` (1920 px) sits beside `name-1280.webp` and `name-960.webp`; `stillSet()` builds the `srcset` and each place that shows a still states its `sizes`. Heavily cropped images (the tall Products feature) keep the full file on purpose: a cover crop scales them by height, not width, so the browser's width-based choice would be too small.
- **Placeholders are explicit.** Progress Tracker (`verified: false`) is `noindex` with "to be confirmed" copy. The testimonial component renders nothing until `src/data/testimonials.ts` contains approved quotes.
- **SQLite, not a database server.** The only data is enquiries: a few rows a day, written by one API worker. A single SQLite file handles that with nothing extra to run, secure or patch, and it backs up as one file. If the API ever has to run on several machines at once, that is the point to move to a database server.
- **Business email enforced** on the form (client and server). Set `REQUIRE_BUSINESS_EMAIL=false` if that costs leads.
- **In-process rate limiter** is per worker (the Docker image runs one). The nginx config adds a per-IP limit in front for multi-instance setups.
- **`THREE.Clock` deprecation warning** appears in the dev console. It originates inside `@react-three/fiber` 9.x with three 0.186 and is harmless; it goes away when R3F updates.

---

## Open items needing real assets, credentials or confirmation

**Assets**
- [ ] **Original logo vector.** The logo in use is a trace of the supplied 1536 × 1024 JPG (see Brand above). If the designer has the original SVG, AI or PDF, swap it into `public/brand/` and `src/components/brand/logo-data.ts`; the favicon, touch icon and `og-image.png` were drawn from the same shapes and would be redone from it.
- [ ] **Founder photo and bio** (About page). No photo was found in the supplied folder (`d:\Siva.S\Desktop\v` held only the product videos).
- [ ] **Progress Tracker**: scope, capabilities, screenshots. All of its copy is placeholder.
- [ ] **Robotic inspection dog.** The home section shows a concept render made for the site (procedural shapes, labelled "Concept render"), not the real robot. Confirm the company is happy to announce it publicly, whether it has a name, and send real renders, photos or video when they exist (they would replace the scene in `src/components/home/RobotDog.tsx`). "Register interest" enquiries arrive with interest `robotic-dog`.

**Permissions**
- [ ] **Customer branding in the demos.** The recordings and extracted stills show "My Home Group / My Home Constructions" branding and project names. Confirm permission to publish them, or re-record with neutral demo data. The figures shown are demo data and are labelled as such on the site.
- [ ] **Parichay recording.** It shows worker names and photos (illustrated avatars), Aadhaar-style numbers, contractor and site names and pass counts (434 in total), under the "My Home Group" brand. The site avoids the records table, but the pass preview and dashboard stills show some of it. Confirm it is demo data, or that it may be published; otherwise re-record with neutral data. The Parichay page makes no claim about the data being real or demo.

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
- [ ] SMTP or webhook credentials, `ADMIN_TOKEN`, `IP_HASH_SALT`.
- [ ] A backup schedule for the SQLite database (see Deployment).
- [ ] Optional: Cloudflare Turnstile site and secret keys.
- [ ] Domain DNS and TLS.
