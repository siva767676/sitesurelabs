# SiteSureLabs: Product Content Review (for the four product teams)

Status: **prepared for review. Nothing in this document has been approved by any product team.**
Prepared 2026-11-04 on branch `feature/sitesurelabs-seo-implementation`. Not live.

**Owner decisions recorded 2026-11-04:** (1) Parichay's Aadhaar and phone-number cross-site duplicate check is owner-confirmed and stays as written. (2) The owner is reviewing the three articles personally (`SEO_BLOG_CONTENT_REVIEW.md`) before product-team review; they remain `review: 'pending'` and are not published.

> **How to read status in these SEO documents.** **Implemented in code** = on the feature branch, uncommitted, not deployed and not live. **Owner action** = needs you or a named team. **External activity** = done outside the repo; none of it has been done. Authoritative workstream status: `SEO_FINAL_REVIEW.md`.

## 1. Purpose and rules

The website text is the source for search results, AI answers and the three blog articles. Every statement must be true of the product. This checklist lets each product team confirm, correct or strike what is written.

Rules for reviewers:

1. **Confirm, correct or strike.** Mark each claim `OK`, `CORRECT TO: ...` or `REMOVE`.
2. **Do not add** features, customers, results, numbers or capabilities in this review. New claims need a separate request, with evidence.
3. Anything marked `[PRODUCT TEAM TO SUPPLY]` is unknown to the SEO work and is **not** on the site. It was not guessed.
4. Figures from demonstrations are demo data. They are not used anywhere on the site (removed earlier) and must not return unless verified with a source.
5. Edits go in `frontend/src/data/products.ts` (product pages) and `frontend/src/data/articles.ts` (articles). After approval, set the article to `review: 'approved'`.

Source of everything quoted below: `frontend/src/data/products.ts` as of this branch.

## 2. Sign-off table

| Product | Reviewer (name, role) | Page copy approved | Article(s) approved | Date |
|---|---|---|---|---|
| Anviksha | [PENDING] | [ ] | [ ] digital inspection guide; [ ] manual vs AI inspection | [PENDING] |
| SiteVision | [PENDING] | [ ] | [ ] 360° documentation | [PENDING] |
| Digi Reco | [PENDING] | [ ] | no article yet | [PENDING] |
| Parichay | [PENDING] | [ ] | no article yet | [PENDING] |

---

## 3. Anviksha (`/products/anviksha`)

**Page H1 on the site:** "AI construction quality inspection software Anviksha". **Title:** "Anviksha: AI Construction Quality Inspection".

**Product description (as published):** "AI-powered construction quality inspection. Capture a defect, locate it, and get a rated observation and report." Tagline: "See every defect. Fix it faster."

**Target customer (as published):** Site and quality engineers; project managers; contractors.

**Main problem solved (as published):** "Defects hide in plain sight. Site observations end up as scattered photos and notes." Solution: "Located, rated and explained. Each photo becomes a structured observation, ready for the contractor."

**Features currently described**

| # | Feature as written | Confirm |
|---|---|---|
| 1 | Live inspection capture: photograph a defect and pin its tower, floor, flat and room | [ ] |
| 2 | AI image insights: "instant summary, key defects, severity and recommended actions" | [ ] ("instant" needs confirming) |
| 3 | Mark-up and severity: annotate the photo; let AI rate severity, or set it yourself | [ ] |
| 4 | Quality reports: observation reports with photo, location, severity and fix | [ ] |
| 5 | Room-by-room walks: build a collection of observations and submit it in one tap | [ ] |
| 6 | AI assistant: "ask questions across inspections and spot defect trends" | [ ] **flagged in the audit as unconfirmed** |
| 7 | Workflow: Capture, Locate, Analyse ("AI checks the photo, rates severity and drafts the fix"), Report ("export a report for the contractor") | [ ] |
| 8 | Value: consistent records; faster follow-up; visibility across sites ("defect patterns become visible") | [ ] |

**Claims needing product-team confirmation**

- [ ] "Instant" summary: is that accurate in normal site connectivity? Remove the word if not.
- [ ] The AI assistant and defect-trend features: are they shipped and demonstrable today?
- [ ] "Does it work on a phone? The capture flow is built for the field." Which devices and operating systems? Does it work with poor or no connectivity? [PRODUCT TEAM TO SUPPLY]
- [ ] "The demo report carries project and company branding." Can customer reports carry the customer's branding?
- [ ] Defect types the model recognises, and the severity scale (names and meaning). [PRODUCT TEAM TO SUPPLY]
- [ ] Is the original AI suggestion kept when a user overrides the severity? (Articles ask vendors this question; know your own answer.) [PRODUCT TEAM TO SUPPLY]
- [ ] No accuracy figures appear anywhere. Confirm that none should, unless evidence exists.
- [ ] Where the data is stored and who can access it (customers ask). [PRODUCT TEAM TO SUPPLY]

**Questions customers are likely to ask** (answers are for the team to write; none are on the site beyond the four existing FAQs)

1. Which phones and tablets does the capture app run on, and does it work offline? [PRODUCT TEAM TO SUPPLY]
2. How accurate is the AI on our own site photos, and can we test it before buying? [PRODUCT TEAM TO SUPPLY]
3. Can we define our own defect categories and severity scale? [PRODUCT TEAM TO SUPPLY]
4. What does the report look like, and can we export it (PDF, Excel)? [PRODUCT TEAM TO SUPPLY]
5. How is our data stored, secured and retained? [PRODUCT TEAM TO SUPPLY]
6. How long does set-up take, and what do we need to provide (drawings, tower and flat structure)? [PRODUCT TEAM TO SUPPLY]
7. How is it priced? (Do not publish unless the company wants a public price.) [OWNER DECISION]

Existing FAQs on the page: What does Anviksha produce? Can I set severity myself? Does it work on a phone? Can it carry our branding? (Answers on the site are short and cautious; confirm them.)

**Keyword targets** (`SEO_KEYWORD_STRATEGY.md`, section 3): primary **AI construction inspection software**; secondary construction site inspection software, construction defect detection, construction quality management software, snagging software (only if the product genuinely does snagging, so confirm). Volumes are not measured.

---

## 4. SiteVision (`/products/site-vision`)

**Page H1:** "360° construction site documentation and progress tracking SiteVision". **Title:** "SiteVision: 360° Construction Site Capture". The product name is written "SiteVision" on the site (the URL is `site-vision`).

**Product description:** "Construction progress visibility in 360°. Capture against the floor plan, publish walkthroughs, and track progress with AI." Tagline: "Capture once. Walk it from anywhere."

**Target customer:** Field engineers; project managers; leadership.

**Main problem solved:** "Every site changes by the day. Progress hides in scattered photos, and decisions wait for a visit." Solution: "Captured and shared in 360°. Capture is tied to the floor plan, so anyone can walk the building remotely."

**Features currently described**

| # | Feature as written | Confirm |
|---|---|---|
| 1 | Floor-plan capture: labelled points show where to capture; panoramas stitch automatically | [ ] |
| 2 | Immersive walkthroughs: walk every room in 360° with a floor-plan map and capture timeline | [ ] |
| 3 | AI progress tracking: per-floor estimates with confidence shown and coverage gaps flagged | [ ] |
| 4 | Drishti assistant: ask about progress, quality and completion in plain language | [ ] |
| 5 | Reports: PDF and Excel exports from the floor progress view | [ ] |
| 6 | Workflow: Capture, Publish, Review, Ask | [ ] |
| 7 | Roles: field engineers capture, managers review, admins set up projects, leadership asks Drishti | [ ] |

**Claims needing product-team confirmation**

- [ ] "Panoramas stitch automatically": where does stitching happen, and how long does it take? [PRODUCT TEAM TO SUPPLY]
- [ ] Which 360° cameras or apps are supported? The FAQ says only "360° photos taken at the labelled points". [PRODUCT TEAM TO SUPPLY]
- [ ] How progress is estimated and what "confidence" means. The page must not imply a measured quantity. [PRODUCT TEAM TO SUPPLY]
- [ ] What Drishti can and cannot answer, and which sources it draws on. [PRODUCT TEAM TO SUPPLY]
- [ ] The H1 says "documentation and progress tracking". Confirm both are shipped.
- [ ] "Stakeholders see the site without travelling": does access sharing for external stakeholders (clients, consultants) exist? [PRODUCT TEAM TO SUPPLY]
- [ ] No usage numbers appear (the removed "3 projects, 23 towers, 1,238 capture processes" are not on the site). Confirm whether any may return, with a source.

**Questions customers are likely to ask**

1. Which 360° camera do we need, and what does it cost? [PRODUCT TEAM TO SUPPLY]
2. How often should we capture, and how long does a floor take? [PRODUCT TEAM TO SUPPLY]
3. How accurate are the AI progress estimates, and how do we check them? [PRODUCT TEAM TO SUPPLY]
4. Can clients and consultants view walkthroughs without an account? [PRODUCT TEAM TO SUPPLY]
5. Can we compare the same room across dates? (The page says captures are tied to rooms and dates.) [PRODUCT TEAM TO SUPPLY]
6. Can it handle our floor plans (formats, multiple towers)? [PRODUCT TEAM TO SUPPLY]
7. Where is the imagery stored, and for how long? [PRODUCT TEAM TO SUPPLY]

Existing FAQs: What do I need to capture? How is progress estimated? Who uses it?

**Keyword targets:** primary **360 construction site documentation software**; secondary 360 virtual site tour, construction progress monitoring, virtual walkthrough software.

---

## 5. Digi Reco (`/products/digi-reco`)

**Page H1:** "Construction steel reconciliation software Digi Reco". **Title:** "Digi Reco: Steel Reconciliation for Construction". (During this review the H1 descriptor was corrected from "steel and material" to steel only, because the product copy covers steel only. If other materials are supported, the team should say so and the descriptor can widen.)

**Product description:** "Steel reconciliation for construction. Monthly workbooks become ledgers and an abstract by diameter, with checks and exceptions." Tagline: "Steel loss, made visible."

**Target customer:** Stores and procurement; commercial teams; portfolio leadership.

**Main problem solved:** "Steel is a top material cost. Yet reconciling it still happens in spreadsheets." Solution: "From workbook to portfolio. Ledgers, an abstract by diameter, cross-checks and a review queue."

**Features currently described**

| # | Feature as written | Confirm |
|---|---|---|
| 1 | Bulk workbook import: preview first; nothing reaches a ledger until you commit | [ ] |
| 2 | Monthly steel abstract: stock, issues, wastage and scrap by bar diameter | [ ] |
| 3 | Cross-checks and exceptions: flagged items approved with a recorded reason and name | [ ] |
| 4 | Portfolio dashboard: wastage against cap, forecast and site health at a glance | [ ] |
| 5 | GRN and scrap views: goods received by supplier, scrap sales by buyer | [ ] |
| 6 | Value: wastage you can see; decisions on record; one view across sites | [ ] |

**Claims needing product-team confirmation**

- [ ] **"Steel is a top material cost"** is a general market statement with no source. Add a verifiable source or soften it to something the product team can stand behind.
- [ ] "Forecast" and "site health": what exactly is forecast, and how? [PRODUCT TEAM TO SUPPLY]
- [ ] The workbook format(s) accepted, and whether the template is customer-specific. [PRODUCT TEAM TO SUPPLY]
- [ ] "Wastage against cap": where does the cap come from? [PRODUCT TEAM TO SUPPLY]
- [ ] The page already says "Figures in our demonstration are demo data, not performance results." Keep it.
- [ ] The removed figures ("80,800 steel records", "2.5% wastage tracked", "100% traceability") must not return unless real and sourced.
- [ ] Is material other than steel (cement, aggregates) in scope, now or soon? Do not imply it unless true.

**Questions customers are likely to ask**

1. What input files do you need, and can you read our existing workbooks? [PRODUCT TEAM TO SUPPLY]
2. Which checks does it run, and can we add our own? [PRODUCT TEAM TO SUPPLY]
3. How does it handle different bar diameters, suppliers and units? [PRODUCT TEAM TO SUPPLY]
4. Who can approve exceptions, and is there an audit trail? (The page says approvals carry a reason and a name.) [PRODUCT TEAM TO SUPPLY]
5. Can it connect to our ERP or accounting system? [PRODUCT TEAM TO SUPPLY]
6. How long does it take to onboard a site? [PRODUCT TEAM TO SUPPLY]

Existing FAQs: What input does it expect? What happens when a check fails? Is the demo data real?

**Keyword targets:** primary **construction steel reconciliation**; secondary rebar reconciliation software, steel consumption tracking, material reconciliation software (steel-qualified). Demand is unvalidated; the research found no dedicated leader, which may mean low demand. Do not expand claims to chase keywords.

---

## 6. Parichay (`/products/parichay`)

**Page H1:** "Construction worker registration and entry passes Parichay". **Title:** "Parichay: Construction Worker Entry Passes".

**Product description:** "Worker registration and entry passes for construction sites. Operators register at the gate, passes print in batches and administrators see every site on one dashboard." Tagline: "Know who's on site."

**Target customer:** Site security operators; site administrators.

**Main problem solved:** "Hundreds walk through the gate. Every one needs a pass, and someone has to know exactly who is inside." Solution: "Registered once, passed at the gate. A checked three-step form, a photo on the spot and a printed pass."

**Features currently described**

| # | Feature as written | Confirm |
|---|---|---|
| 1 | Three-step registration: personal, work and photo, each field checked | [ ] |
| 2 | Duplicate check: **"Aadhaar and phone number are checked across sites before a second card is issued"** | **OWNER-CONFIRMED (2026-11-04): genuine capability. Keep exactly as written** |
| 3 | Entry pass: photo, contractor, labour-camp badge, site watermark, supervisor contact | [ ] |
| 4 | Batch printing: nine passes on one A4 sheet | [ ] |
| 5 | Admin dashboard: passes by site, contractor, role, age, state and district, with records and Excel export | [ ] |
| 6 | Site-scoped access: operators and site admins reach only their own site; "records stay visible for as long as you choose" | [ ] |

**Claims needing product-team confirmation**

- [x] **Aadhaar and phone duplicate check: owner-confirmed.** The owner confirmed that Parichay genuinely checks Aadhaar numbers and phone numbers across sites before issuing a second card. The feature and its description **stay on the site exactly as written; they are not to be removed, hidden, weakened or replaced with generic wording.** The separate data-handling and legal review below is recorded for the product team and legal counsel and **must not result in removing the confirmed functionality or its description**.
- [ ] **Not claimed anywhere, and not to be claimed until separately verified:** any UIDAI integration or authorisation, legal compliance with any law, encryption or other security measures, data retention periods, or how worker consent is obtained. The website says none of these. [PRODUCT TEAM AND LEGAL TO CONFIRM BEFORE ANY SUCH CLAIM IS ADDED]
- [ ] **Data-handling and Privacy Policy coverage** (for the product team and legal counsel): how worker data (including Aadhaar numbers) is collected, stored, secured, retained and consented to, and whether the Privacy Policy or separate worker-data terms must cover it. This is a documentation and review task only.
- [ ] "Know who's on site": does the product record entry and exit (a live headcount), or only registration and passes? The tagline can be read as a live presence claim. [PRODUCT TEAM TO SUPPLY]
- [ ] "Records stay visible for as long as you choose": is retention configurable by the customer? [PRODUCT TEAM TO SUPPLY]
- [ ] "Labour-camp badge" and "nine per A4 sheet": confirm these are standard, not customer-specific.
- [ ] The removed figures ("10 sites", "23,538 cards") must not return unless real and sourced.
- [ ] The site is written for an Indian context (Aadhaar, state and district). The company's countries of operation are not stated anywhere (see `SEO_ANALYTICS_SETUP.md`, row 6). [OWNER ACTION]

**Questions customers are likely to ask**

1. Is worker data stored securely, where, and for how long? [PRODUCT TEAM TO SUPPLY]
2. Do we need workers' consent, and how is it recorded? [PRODUCT TEAM AND LEGAL]
3. Does it work with our gate hardware (printers, cameras, scanners)? [PRODUCT TEAM TO SUPPLY]
4. Can it record entry and exit? [PRODUCT TEAM TO SUPPLY]
5. Can contractors manage their own workers? [PRODUCT TEAM TO SUPPLY]
6. How does it handle a worker with no phone or document? [PRODUCT TEAM TO SUPPLY]

Existing FAQs: Who uses it? What happens with a duplicate? What does the pass carry?

**Keyword targets:** primary **construction worker registration software**; secondary construction site entry pass, contractor worker ID card software. Do **not** target "labour management" or "attendance" (the product does not do them; marked "do not target" in the keyword strategy).

---

## 7. Factual consistency of the three articles with the product pages

Method: every product statement in each article was compared, line by line, with `products.ts`. Statements of general practice (not about a SiteSureLabs product) are marked "general advice" and are the subject-matter reviewer's to judge as sound practice. **No article contains a statistic, a customer example, a research finding or a credential.** The result is **consistent on all product statements**, with the items below flagged for confirmation. Articles remain `review: 'pending'` and are **not live**.

### 7.1 `digital-construction-inspection-guide` (Anviksha team)

| Statement in the article | Source on the product page | Result |
|---|---|---|
| Anviksha is SiteSureLabs' construction quality inspection product | Product summary | Consistent |
| User photographs a defect and pins its tower, floor, flat and room | Capability "Live inspection capture" | Consistent |
| AI image insights summarise key defects and suggest a severity and a recommended action | Capability "AI image insights" | Consistent |
| The user can accept the AI rating or set severity themselves | Capability "Mark-up and severity"; FAQ | Consistent |
| Observations become quality observation reports with photo, location, severity and fix, ready for the contractor | Capability "Quality reports"; workflow "Report" | Consistent |
| Workflow steps, checklist items, "what to look for in software", pilot advice | none (not about the product) | General advice: reviewer to confirm it is sound |
| "Can AI find every defect in a photo? No" and the listed limits of photos | none | General advice; consistent with the product making no accuracy claim |

### 7.2 `manual-vs-ai-construction-inspection` (Anviksha team)

| Statement | Source | Result |
|---|---|---|
| AI drafts a defect summary, a suggested severity and an action; the inspector reviews | "AI checks the photo, rates severity and drafts the fix" | Consistent |
| Location recorded in structured fields (tower, floor, flat, room) | Capability 1 | Consistent |
| Reports generated from recorded observations | Capability 4 | Consistent |
| **"Observations can be filtered and compared across inspections"** (table, AI-assisted column) | Closest source: "ask questions across inspections and spot defect trends"; "defect patterns become visible" | **Needs confirmation.** "Filtered" is not stated on the page. The table column describes AI-assisted inspection in general, but confirm the product does this, or reword |
| Visible defects named (cracks, exposed reinforcement, surface segregation) | Cover and screenshot captions (exposed rebar, crack across slab, segregation) | Consistent |
| "Anviksha lets the user set severity themselves or accept the AI rating ... reports with photo, location, severity and fix" | Capabilities 3 and 4 | Consistent |
| Vendor-evaluation questions; "no general answer" on accuracy | none | General advice; consistent with the product publishing no accuracy figure |

### 7.3 `360-degree-construction-documentation` (SiteVision team)

| Statement | Source | Result |
|---|---|---|
| Labelled capture points show where to capture; panoramas stitch automatically | Capability 1 | Consistent |
| Captures published as walkthroughs with a floor-plan map and a capture timeline | Capability 2 | Consistent |
| Progress estimated per floor, confidence shown, coverage gaps flagged | Capability 3; FAQ | Consistent. The article also says "for each room or activity": the FAQ says "per room and activity". Confirm "per floor" vs "per room" wording |
| Drishti answers progress, quality and completion questions in plain language | Capability 4 | Consistent |
| Progress views exportable as PDF and Excel | Capability 5 | Consistent |
| "Each photo is linked to its point on the plan and to the date" | "Captures are tied to rooms and dates" | Consistent in substance; confirm "point on the plan" |
| "Contact us about supported devices" | FAQ says only "360° photos at the labelled points" | Consistent; supported devices are unknown |
| Capture practice (same route, lighting, naming, cadence) and limits of imagery | none | General advice: reviewer to confirm |

### 7.4 Result

No invented product capability was found in the three articles. **Four statements need confirmation:** 7.2 "filtered and compared across inspections"; 7.3 "each room or activity" (vs the page's "per-floor" estimates); 7.3 "no recent coverage" (the page says "without coverage"); 7.3 "linked to its point on the plan" (the page says "tied to rooms and dates"). The owner is reviewing all three articles personally first (`SEO_BLOG_CONTENT_REVIEW.md`); they stay **pending** until the owner and then the named team approve in writing.

---

## 8. Site-wide copy outside the product pages that also needs confirmation

These are not part of the four products but affect how the company is understood by search engines and AI systems.

- [ ] **Homepage lead:** "SiteSureLabs builds AI products for real estate developers, construction companies and project teams ... plus custom enterprise AI." Confirm the audience wording and the "custom enterprise AI" scope. [OWNER]
- [ ] **Services page** (eight services) is marked "CONFIRM: the engineering team should verify every capability" in `services.ts`. Unconfirmed draft. [ENGINEERING TEAM]
- [ ] **About page principles** (Product-first, Practical AI, Built for operators, End-to-end) are marked "CONFIRM: wording needs founder sign-off". [FOUNDER]
- [ ] **Founder section:** only name, title and role description remain; founding year and named affiliations were removed. Add details back only with written sign-off. [FOUNDER]
- [ ] **Robotic inspection dog** (home page section, contact option): in development, no page. Confirm the public wording. [OWNER]
- [ ] **Progress Tracker:** placeholder page, noindex. Decide whether to keep, complete or remove it. [OWNER]
- [ ] **Hero text "AI-powered construction technology for the real world."** approval. [OWNER]
