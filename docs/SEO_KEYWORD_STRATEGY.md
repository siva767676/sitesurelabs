# SiteSureLabs: SEO Keyword Strategy

> **How to read status in these SEO documents.** **Implemented in code** = on branch `feature/sitesurelabs-seo-implementation`, uncommitted, **not deployed and not live** on sitesurelabs.com. **Owner action** = needs you: an account, an approval, a fact only the company knows, or access to the live server. **External activity** = outreach, listings, directory or social accounts, paid tools, third-party validators: **none of it has been done**, and nothing is claimed as done. Authoritative status of all 16 workstreams: `SEO_FINAL_REVIEW.md`.

Status: working document. Prepared 2026-11-04. Site: https://sitesurelabs.com

## 0. Read this first: evidence and its limits

- **No numbers.** Search volume and keyword difficulty were not available to the author. Every Volume/KD cell says `Not measured`. Nothing in this file is an estimate of traffic. Section 9 says how to fill the gaps.
- **SERP evidence is thin and tool-limited.** The web-search tool is US-only and returns result titles and URLs with a short summary, not full result pages, People Also Ask boxes or autocomplete. One query was run per cluster (seven in total). The "competition note" in each row is a qualitative read of what those results looked like. Clusters and sub-terms that were NOT searched individually are marked `inferred` and should be re-checked in a browser (see section 9).
- **Geography is unknown.** The company has not confirmed where it operates. Spellings and terms ("snagging", "labour", "Aadhaar") differ by market. Do not assume a country. Re-run the SERP checks in the owner's target market(s) once confirmed.
- **Facts used about the products** come only from `frontend/src/data/products.ts`, `services.ts` and `site.ts`. No customers, awards, metrics, address or phone are assumed.

### What the SERPs looked like (observed)

| Query searched | What dominated | Intent read |
|---|---|---|
| AI construction inspection software | Vendor product pages (InspectMind AI, Opusense, TUV SUD 3D AI inspection, gNext), a no-code builder (Softr), a G2 discussion page, and some thin content-farm pages | Commercial investigation. Mixed: scan/LiDAR services, report automation, field capture apps. Photo-to-defect-observation is only one of several interpretations. |
| 360 degree construction site documentation software | Established platforms (PlanRadar SiteView, OpenSpace, HoloBuilder, docu tools, RICOH360 Projects), plus App Store listings (JobWalk) | Commercial. Strong incumbents with dedicated landing pages per feature. |
| construction steel reconciliation software | No dedicated steel-reconciliation platform. Results were a rebar reconciliation service (gemengserv.com), steel takeoff/estimating tools (AutoSteel), invoice/escrow reconciliation tools (not steel), a patent, and generic AI-agent directory pages | Mixed/unclear. Low direct competition, but also unclear that searchers use this phrase for software. Needs volume validation. |
| construction worker registration site entry pass software | MSite (Infobric), Nyfty, IQ-Pass, Simpel, WorkSitePass (Capterra listing), 10Pro Portti, BAUSTELLENCARD; many are App Store pages and several are hardware/turnstile-led, Europe/Australia-flavoured | Commercial. Competitors are mostly access-control or compliance-led. Parichay's distinct angle is registration plus duplicate check plus printed batch passes. |
| construction technology company AI solutions real estate developers | News and trade articles, developer press releases (India, UAE, US examples), vendor blogs (Alice Technologies), vendor profile (Slate Technologies on G2), event pages (CREDAI TechCon) | Mixed informational/commercial. Mostly articles and news, few pure "company" pages. A new brand will not rank for this on the homepage alone. |
| construction snagging software defect management app | PlanRadar snag app page, Capterra listings (SnagTick), Viewpoint/Trimble, Snagmaster, SnagHub, EdgeSnags, App Store pages, "best snag list software" listicles (Xenia, qualityinconstruction.com) | Commercial investigation. Heavy on listicles and directories. UK/Middle East/Asia flavoured term. |
| AI document processing workflow automation AI agents construction management | Vendor pages (Datagrid, Glide), trade/industry news (PlanRadar agents), an academic paper (Frontiers in Built Environment), directories of agents | Informational and early-commercial. Fast-moving, vendor-heavy, claims unverified. |

Not searched individually (inferred, verify): construction progress visualization/monitoring, virtual walkthrough software, labour management, contractor worker ID card software, material reconciliation software, steel consumption tracking, AI document processing/OCR on its own, construction automation software.

## 1. Page inventory this plan maps to

Implemented in code on the feature branch and **not yet live** (`/blog` and the three `/blog/...` articles are hidden drafts, noindex and out of the sitemap until the owner and product teams approve them; `/privacy` and `/terms` are noindex until legal review): `/`, `/products`, `/products/anviksha`, `/products/site-vision`, `/products/digi-reco`, `/products/parichay`, `/services`, `/about`, `/contact`, `/blog`, `/blog/digital-construction-inspection-guide`, `/blog/manual-vs-ai-construction-inspection`, `/blog/360-degree-construction-documentation`.

Not mapped: Progress Tracker (planned, noindex) and the robotic inspection dog (in development, no page). Do not target keywords for either until they ship and have confirmed copy.

## 2. Keyword table

Legend. Intent: I informational, C commercial investigation, T transactional, N navigational. Relevance: how well the keyword describes what the product actually does today (from the repo). Commercial intent: High / Med / Low (likelihood the searcher is evaluating or buying software). Priority: P1 build and optimise now, P2 secondary/supporting, P3 monitor or later. "Primary" in Target page means this keyword is that page's single primary keyword; "secondary" means it is supported on the page but not the primary.

### 2.1 Company and brand

| Keyword | Cluster | Intent | Relevance | Commercial intent | Volume / KD | Competition note (qualitative) | Target page | Priority |
|---|---|---|---|---|---|---|---|---|
| construction technology company | Company | C | High: this is the stated primary industry | Med | Not measured / Not measured | Results are a mix of listicles, funding news and large vendors. A new domain is unlikely to rank on the homepage soon; realistic as a supporting term. | `/` (primary) | P2 |
| AI construction solutions | Company | C | High: Anviksha, SiteVision, Digi Reco, Parichay are AI/automation products for construction | Med | Not measured / Not measured | Trade articles and developer press releases dominate; few product pages. Inferred from the real-estate AI query. | `/products` (secondary) | P2 |
| construction automation software | Company | C | Med: Digi Reco and Parichay automate site paperwork; "automation" in construction also means robotics/scheduling, so intent may not match | Med | Not measured / Not measured | Not searched individually (inferred). Likely crowded by project-management platforms. | `/` (secondary) | P3 |
| construction AI software | Company | C | High: describes the whole suite | Med | Not measured / Not measured | Inferred. Vendor-heavy. | `/products` (primary) | P2 |
| AI solutions for real estate developers | Company | C | Med: audience matches (developers); proof points (customers, results) do not exist yet | Med | Not measured / Not measured | Results were news and developer press, plus vendor profiles. Content-led, not product-led. | `/` (secondary); future `/industries/real-estate` | P3 |
| enterprise AI solutions | Enterprise AI | C | Med: Services page offers AI product development, computer vision, document processing, LLM/RAG, agents, custom software | Med | Not measured / Not measured | Inferred: dominated by very large consultancies and cloud vendors. Very hard for a small company; low expected return as a primary. | `/services` (primary) | P3 |
| SiteSureLabs | Brand | N | High | Low | Not measured / Not measured | Own brand; expect to own it once indexed. Check for name collisions in Search Console and a manual SERP. | `/about` (primary) | P1 |
| SiteSureLabs contact | Brand | N | High | Low | Not measured / Not measured | Navigational. | `/contact` (primary) | P1 |

### 2.2 Anviksha (AI inspection)

| Keyword | Cluster | Intent | Relevance | Commercial intent | Volume / KD | Competition note | Target page | Priority |
|---|---|---|---|---|---|---|---|---|
| AI construction inspection software | Anviksha | C | High: Anviksha turns photos into located, rated, explained defect observations and reports | High | Not measured / Not measured | Seen: InspectMind AI, Opusense, TUV SUD, gNext, Softr. Varied interpretations (3D scan, drone, report automation). Differentiating on "photo to rated observation and report" is the realistic angle. | `/products/anviksha` (primary) | P1 |
| construction quality management software | Anviksha | C | Med: Anviksha covers inspection and observation reporting, not a full QMS (no claims of checklists, NCR workflow or audits in the repo) | High | Not measured / Not measured | Inferred. Broad platforms (Procore, Autodesk, PlanRadar) likely dominate. Use as a secondary phrase only. | `/products/anviksha` (secondary) | P2 |
| construction defect detection | Anviksha | C/I | High: AI image insights identify key defects and severity | Med | Not measured / Not measured | Mix of research, vendor and service pages (TUV SUD, gNext show automatic defect detection). Do not claim accuracy; no accuracy figures exist. | `/products/anviksha` (secondary); `/blog/manual-vs-ai-construction-inspection` (secondary) | P2 |
| construction site inspection software | Anviksha | C | High | High | Not measured / Not measured | Inferred from the AI inspection SERP: vendor pages, builder tools, directories. | `/products/anviksha` (secondary) | P2 |
| digital construction inspection | Anviksha | I | High | Low | Not measured / Not measured | Informational guide intent; suits a long-form explainer. Not searched individually. | `/blog/digital-construction-inspection-guide` (primary) | P1 |
| manual vs AI construction inspection | Anviksha | I | High | Low-Med | Not measured / Not measured | Comparison/opinion intent. Content must be honest about where manual inspection still wins. | `/blog/manual-vs-ai-construction-inspection` (primary) | P1 |
| snagging software | Anviksha | C | Med: snagging is the handover defect list; Anviksha records located, rated observations and reports but the repo does not claim assignment, closure tracking or handover workflows | High | Not measured / Not measured | Seen: PlanRadar, SnagR, SnagHub, Snagmaster, SnagTick, EdgeSnags, Fieldwire, Autodesk Build, plus "best snag list software" listicles and Capterra pages. Crowded and directory-led. Do not make it a primary; do not imply Anviksha is a full snagging tool until it is. | `/products/anviksha` (secondary, only if copy stays truthful) | P3 |
| snag list app | Anviksha | C | Med (same caveat) | High | Not measured / Not measured | Same as above. | none (do not target) | P3 |

### 2.3 SiteVision (360 capture and progress)

| Keyword | Cluster | Intent | Relevance | Commercial intent | Volume / KD | Competition note | Target page | Priority |
|---|---|---|---|---|---|---|---|---|
| 360 construction site documentation software | SiteVision | C | High: floor-plan capture, stitched panoramas, walkthroughs, timeline | High | Not measured / Not measured | Seen: PlanRadar, OpenSpace, HoloBuilder, docu tools, RICOH360 Projects, JobWalk. Established vendors with dedicated pages. The angle that is distinctive in the repo: capture at labelled floor-plan points plus AI progress estimate with confidence and coverage gaps, plus the Drishti assistant. | `/products/site-vision` (primary) | P1 |
| 360 virtual site tour | SiteVision | C | High: "walkable tours" | Med | Not measured / Not measured | Inferred. Mixes real-estate virtual-tour tools (Matterport-style) with construction tools. Intent can be marketing tours, not construction records. | `/products/site-vision` (secondary) | P2 |
| construction progress monitoring | SiteVision | C | Med-High: AI per-floor progress estimate | High | Not measured / Not measured | Inferred. Crowded. OpenSpace was described in search as progress-tracking oriented. Note: Progress Tracker is a separate, unreleased product; keep this term on SiteVision and do not conflate. | `/products/site-vision` (secondary) | P2 |
| construction progress visualization | SiteVision | C | Med | Med | Not measured / Not measured | Inferred. Lower volume phrase variant. | `/products/site-vision` (secondary) | P3 |
| virtual walkthrough software construction | SiteVision | C | Med-High | Med | Not measured / Not measured | Inferred. | `/products/site-vision` (secondary) | P3 |
| how to document a construction site in 360 | SiteVision | I | High | Low-Med | Not measured / Not measured | Informational how-to; a blog is the right format. Note this phrase differs from the product primary so the two pages do not compete. | `/blog/360-degree-construction-documentation` (primary) | P1 |

### 2.4 Digi Reco (material and data reconciliation)

| Keyword | Cluster | Intent | Relevance | Commercial intent | Volume / KD | Competition note | Target page | Priority |
|---|---|---|---|---|---|---|---|---|
| construction steel reconciliation | Digi Reco | C/I | High: monthly steel abstract by diameter, wastage, scrap, GRN | Med-High | Not measured / Not measured | Seen: no dedicated steel-reconciliation software leader; results were a rebar reconciliation service, takeoff tools, non-steel invoice reconciliation and a patent. Low direct competition, but volume and the phrasing real buyers use are unproven. Validate before investing in content. | `/products/digi-reco` (primary) | P1 |
| rebar reconciliation software | Digi Reco | C | High (rebar = steel bars; "wastage" and "scrap" are in the product) | Med-High | Not measured / Not measured | A rebar reconciliation service page was in the SERP. Worth testing as a secondary. | `/products/digi-reco` (secondary) | P2 |
| steel consumption tracking | Digi Reco | C | Med-High: stock, issues, wastage and scrap are tracked | Med | Not measured / Not measured | Inferred. | `/products/digi-reco` (secondary) | P2 |
| material reconciliation software | Digi Reco | C | Med: Digi Reco today covers steel only (per repo); "material" implies more | Med | Not measured / Not measured | Inferred. Do not claim cement/other materials. | `/products/digi-reco` (secondary, steel-qualified copy) | P3 |
| construction data reconciliation | Digi Reco | C | Med: workbook-to-ledger with cross-checks and an exceptions queue | Low-Med | Not measured / Not measured | Inferred; also overlaps finance reconciliation tools (not relevant). | none (do not target) | P3 |
| steel wastage in construction | Digi Reco | I | High | Low | Not measured / Not measured | Inferred; a possible future blog if the steel primary shows demand. | none yet (future blog candidate) | P3 |

### 2.5 Parichay (worker registration and passes)

| Keyword | Cluster | Intent | Relevance | Commercial intent | Volume / KD | Competition note | Target page | Priority |
|---|---|---|---|---|---|---|---|---|
| construction worker registration software | Parichay | C | High: three-step registration, photo at gate, duplicate check | High | Not measured / Not measured | Seen: MSite, Nyfty, IQ-Pass, Simpel, WorkSitePass, 10Pro Portti, BAUSTELLENCARD. Many are access-control/compliance-led and Europe/Australia-leaning. Parichay's difference: registration plus duplicate check across sites plus batch printed passes plus admin dashboard. | `/products/parichay` (primary) | P1 |
| construction site entry pass | Parichay | C | High: the entry pass with photo, contractor, badge, watermark | High | Not measured / Not measured | Seen in the same SERP; digital-pass and turnstile vendors. | `/products/parichay` (secondary) | P2 |
| contractor worker ID card software | Parichay | C | High | Med-High | Not measured / Not measured | Inferred; likely lower-competition long tail. | `/products/parichay` (secondary) | P2 |
| labour management software construction | Parichay | C | Low-Med: Parichay does not claim attendance, payroll or wage features; calling it labour management would over-claim | Med | Not measured / Not measured | Inferred. Broad term; crowded by workforce/payroll tools. | none (do not target) | P3 |
| construction worker attendance system | Parichay | C | Low: attendance is not a stated capability | Med | Not measured / Not measured | Inferred. Do not target. | none | P3 |

### 2.6 Enterprise AI and services

| Keyword | Cluster | Intent | Relevance | Commercial intent | Volume / KD | Competition note | Target page | Priority |
|---|---|---|---|---|---|---|---|---|
| AI document processing for construction | Enterprise AI | C/I | Med-High: services list document processing and OCR, workbook ingestion with exception review | Med | Not measured / Not measured | Seen: vendor pages (Datagrid, Glide) focused on submittals, RFIs, tenders; claims unverified. | `/services` (secondary) | P3 |
| document OCR and data extraction services | Enterprise AI | C | Med: listed capability | Med | Not measured / Not measured | Inferred. Dominated by large OCR/IDP vendors and cloud APIs. | `/services` (secondary) | P3 |
| AI workflow automation | Enterprise AI | C | Med: "AI agents and workflow automation" is a listed service | Med | Not measured / Not measured | Inferred. Extremely broad and crowded. | `/services` (secondary) | P3 |
| AI agents for construction management | Enterprise AI | I/C | Med: agents listed as a service; no construction-agent product exists in the repo (Drishti and Anviksha assistants answer questions over project data) | Low-Med | Not measured / Not measured | Seen: vendor pages and a January 2026 academic paper; platform vendors (Autodesk, Procore) building their own. Evolving; mostly informational. | none (future blog candidate) | P3 |
| custom AI product development company | Enterprise AI | C | High: "AI product development" is service 01 | High | Not measured / Not measured | Inferred. Agency-dominated. | `/services` (secondary) | P2 |

## 3. Keyword-to-URL map (one primary per page, no sharing)

| URL | Primary keyword | Secondary keywords (supporting only) | Page type |
|---|---|---|---|
| `/` | construction technology company | construction automation software, AI solutions for real estate developers | Brand / hub |
| `/products` | construction AI software | AI construction solutions | Product index |
| `/products/anviksha` | AI construction inspection software | construction site inspection software, construction defect detection, construction quality management software, snagging software (only if truthful) | Product |
| `/products/site-vision` | 360 construction site documentation software | 360 virtual site tour, construction progress monitoring, virtual walkthrough software | Product |
| `/products/digi-reco` | construction steel reconciliation | rebar reconciliation software, steel consumption tracking, material reconciliation software (steel-qualified) | Product |
| `/products/parichay` | construction worker registration software | construction site entry pass, contractor worker ID card software | Product |
| `/services` | enterprise AI solutions | custom AI product development, AI document processing for construction, OCR and data extraction, AI workflow automation | Service |
| `/about` | SiteSureLabs | (brand only) | Brand |
| `/contact` | SiteSureLabs contact | (brand only) | Brand |
| `/blog` | (none; index page, noindex-follow pagination if it grows) | | Index |
| `/blog/digital-construction-inspection-guide` | digital construction inspection | construction inspection checklist digital (check demand), inspection report automation | Guide |
| `/blog/manual-vs-ai-construction-inspection` | manual vs AI construction inspection | construction defect detection | Comparison |
| `/blog/360-degree-construction-documentation` | how to document a construction site in 360 | 360 construction documentation | How-to |

Product pages must not be rewritten to chase keywords that overstate the product (see "do not target" rows). Progress Tracker stays `noindex`; do not link to it from copy using keyword anchors.

## 4. Cannibalisation risks and how each is avoided

| Risk | Pages involved | Avoidance |
|---|---|---|
| "AI construction inspection" appears on three pages | Anviksha, inspection guide blog, manual-vs-AI blog | Anviksha owns the commercial phrase "AI construction inspection software". The guide targets "digital construction inspection" (concept, process, tools in general). The comparison targets the "manual vs AI" decision. Each blog links to Anviksha with a descriptive anchor and never repeats the product primary as its H1/title. |
| 360 documentation: product vs how-to | SiteVision, 360 blog | Product primary is the software phrase; the blog primary is the how-to phrase. The blog's title and H1 are about method and process; it does not list SiteVision as "the best". |
| Brand pages | `/`, `/about`, `/contact` | `/` targets the category phrase, `/about` the brand name, `/contact` brand plus contact. No page uses another page's primary in its title tag. |
| `/products` index vs product pages | `/products` vs each product | `/products` targets the umbrella "construction AI software" and describes each product in one line linking to its page; it does not repeat product-specific primaries in the H1 or title. |
| Services vs products | `/services` vs product pages | `/services` is about building custom AI for a client; it must not target product keywords (inspection, 360, steel, entry pass). Its computer-vision and document sections link to the matching product as a worked example, not a competing target. |
| Snagging and quality management | Anviksha vs future pages | Only a secondary on Anviksha. If a dedicated page ever exists, it needs genuinely different capabilities (assignment, closure workflow) in the product. |
| Progress terms | SiteVision vs Progress Tracker | Progress Tracker is noindex and planned. Keep "progress monitoring" on SiteVision until Progress Tracker is confirmed, then re-split. |
| Duplicate or near-duplicate titles/descriptions | all | Check in Search Console (Pages, Performance by page+query) quarterly for two URLs ranking for one query. |

## 5. Missing landing pages: build only when substantive

Industry pages are deliberately not built. A thin page that restates the home page is worse than none. Build each only when the content below exists and is verifiable.

| Page (missing) | Would target | Real content that would justify it | Build only when |
|---|---|---|---|
| `/industries/construction` | construction technology / contractor-focused terms | A genuine walk through the four live products by site role (QA/QC engineer, project manager, stores, gate security), with real screenshots and workflows already in the repo; at least one verified customer story or pilot with permission; a method note on how data is handled | A named, permissioned customer or pilot exists, or at least role-based workflow pages with original content beyond what product pages say |
| `/industries/real-estate` | AI solutions for real estate developers, proptech | Developer-specific workflows (tower/floor/flat/room defect location in Anviksha, handover documentation, multi-site portfolio views in Digi Reco and Parichay), and ideally a developer's perspective or case | Same: a real developer use case or a substantive, original handover/portfolio guide |
| `/industries/infrastructure` | infrastructure inspection/progress terms | Evidence the products work for linear or civil assets. The repo shows building-oriented capture (tower, floor, flat, room, floor plans). Nothing demonstrates infrastructure use | A demonstrated infrastructure pilot or product capability. Do not build on aspiration |
| `/industries/project-management` | PMC / project management consultancy workflows | Workflow for PMCs: inspection reports for contractors, remote progress review, reconciliation oversight; sample report templates the company owns | Sample deliverables and a PMC-relevant workflow guide exist |

Status for all four: **missing, build only when substantive.**

Possible later supporting content (not scheduled): a steel wastage explainer (if Digi Reco keyword volume validates), an AI-agents-in-construction explainer (informational, grounded in what the products do), a worker-registration and site-access explainer (only without legal claims about local labour law).

## 6. Content-to-product internal linking plan

| From | To | Anchor style (descriptive, not exact-match stuffing) | Placement |
|---|---|---|---|
| `/blog/digital-construction-inspection-guide` | `/products/anviksha` | "see how Anviksha turns site photos into rated observations" | After the section on digital capture |
| `/blog/digital-construction-inspection-guide` | `/blog/manual-vs-ai-construction-inspection` | "manual versus AI inspection" | Section on limitations |
| `/blog/manual-vs-ai-construction-inspection` | `/products/anviksha` | "AI image insights and severity rating in Anviksha" | Where AI strengths are discussed |
| `/blog/manual-vs-ai-construction-inspection` | `/blog/digital-construction-inspection-guide` | "digital inspection workflow" | Intro or conclusion |
| `/blog/360-degree-construction-documentation` | `/products/site-vision` | "SiteVision captures against the floor plan" | After the capture-method section |
| `/blog/360-degree-construction-documentation` | `/blog/digital-construction-inspection-guide` | "documenting defects" | Related reading |
| `/products/anviksha` | both inspection blogs | "Read: digital inspection guide" and "Manual vs AI inspection" | Below FAQ |
| `/products/site-vision` | `/blog/360-degree-construction-documentation` | "How to document a site in 360" | Below workflow |
| `/products` | each product page | product name as anchor | Product cards |
| `/` | `/products`, each product, `/services`, `/about` | natural labels | Hero, ecosystem, footer |
| `/services` | `/products/anviksha`, `/products/site-vision`, `/products/digi-reco` | "built as our own products" examples next to computer vision and document sections | Matching service sections |
| `/about`, `/contact` | `/products`, `/services` | nav labels | Body and footer |
| Product pages | `/contact` | "Request a demo / talk to us" (match the CTA copy that exists) | Page CTA |

Rules: every blog post links to at least one product page and one sibling post; product pages link to related posts; no page links to Progress Tracker with a keyword anchor; no orphan pages (confirm all URLs appear in the sitemap and are linked from navigation or a hub).

## 7. On-page rules that keep the strategy honest

- One H1 per page containing the primary keyword in natural wording; title tag and meta description already exist per product in `products.ts` (`seo` field); do not rewrite them to stuff secondaries.
- Do not add claims that the products do not support (no accuracy figures, time savings, customer names, awards, ROI). Digi Reco figures in demos are demo data and must be labelled as such.
- Do not use "labour management", "attendance", "full QMS", "snag closure workflow", "infrastructure" or "BIM" language for products unless capability is confirmed.
- Use Product/SoftwareApplication structured data only for fields that are true; Organization data must not include unknown address, phone or social URLs.

## 8. Priorities summary

- **P1 now:** AI construction inspection software, 360 construction site documentation software, construction steel reconciliation (validate demand), construction worker registration software, the three blog primaries, brand terms.
- **P2:** secondary product phrases, construction AI software, enterprise-services secondaries.
- **P3:** broad category terms (enterprise AI solutions, construction automation software), snagging, labour management; monitor only.

Realism: head terms in Anviksha and SiteVision clusters are held by established vendors. Expect long-tail and branded terms first; no ranking or timeline is promised.

## 9. Data to pull manually

Do all of this in the owner's actual target market(s) once confirmed; run it again per country if more than one.

1. **Google Keyword Planner** (free Google Ads account, no campaign needed).
   - Tools > Keyword Planner > "Discover new keywords". Enter the primaries from section 3 (one product cluster at a time) and set Location and Language to the target market(s).
   - Add the keywords from section 2 using "Get search volume and forecasts". Export CSV: keyword, average monthly searches (note Planner returns ranges unless the account has spend), competition, top-of-page bid low/high.
   - Record the date and location in the sheet. Do not copy numbers into this file until measured.
2. **Google Search Console** (Domain property for sitesurelabs.com, verified via DNS).
   - Performance > Search results, date range last 3 months once data exists, then 16 months later. Export Queries, Pages and the Query+Page tab (add Page filter per URL). Look for: queries with impressions but position beyond 10, two URLs per query (cannibalisation), branded vs non-branded.
   - Pages > "Why pages aren't indexed" for each URL in section 1; confirm Progress Tracker is excluded by noindex as intended.
3. **Ahrefs or Semrush** (if a licence is available).
   - Keywords Explorer: paste the section 2 keywords, set country, export Volume, Keyword Difficulty, Traffic potential, Clicks, Parent topic, SERP features and "Top 10 results".
   - Site Explorer: enter 5 to 8 competitor domains seen in the SERPs (for example PlanRadar, OpenSpace, HoloBuilder, MSite, Opusense, InspectMind AI) > Organic keywords and Top pages; export. Use Content gap against sitesurelabs.com.
   - Record that KD scales differ between tools and are not comparable across them.
4. **Manual SERP checks** (logged-out browser, target country, incognito): for each primary, record who ranks 1 to 10, the result type (vendor product page, directory, listicle, app-store, news, forum), whether People Also Ask/autocomplete suggest different phrasing, and screenshot the date. Use autocomplete and "Related searches" to confirm real buyer phrasing for the "Digi Reco" and "Parichay" clusters especially.
5. **Terminology validation**: interview 3 to 5 target users (site engineers, stores staff, security) in the target market to learn what they actually call these problems before committing to "reconciliation", "snagging" or "worker registration".
6. **Fill-in sheet columns**: Keyword | Country | Monthly volume (source, date) | KD (tool, date) | Current rank | Ranking URL | Notes | Decision.

## 10. Review cadence

| Frequency | Task |
|---|---|
| Weekly (first 8 weeks after launch) | Search Console coverage and indexing: sitemap read, each URL indexed, no unexpected noindex; check rich result errors |
| Monthly | Performance report by page and query; update the keyword sheet; flag cannibalisation; review new impressions that fit no mapped keyword |
| Quarterly | Re-run manual SERP checks for each primary; refresh competitor set; re-validate "do not target" decisions; re-read this file against any product capability changes |
| On each product release | Update product page copy and keyword map only for capabilities that actually shipped; promote Progress Tracker to the map only when the page is live, indexable and the scope is confirmed |
| Every 6 months | Decide whether any industry page now meets the "substantive" bar; decide on new blog posts based on measured demand |
