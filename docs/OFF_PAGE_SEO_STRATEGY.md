# SiteSureLabs: Off-Page SEO Strategy

> **How to read status in these SEO documents.** **Implemented in code** = on branch `feature/sitesurelabs-seo-implementation`, uncommitted, **not deployed and not live** on sitesurelabs.com. **Owner action** = needs you: an account, an approval, a fact only the company knows, or access to the live server. **External activity** = outreach, listings, directory or social accounts, paid tools, third-party validators: **none of it has been done**, and nothing is claimed as done. Authoritative status of all 16 workstreams: `SEO_FINAL_REVIEW.md`.

Status: working document. Prepared 2026-11-04. Site: https://sitesurelabs.com

**This file is entirely external activity and owner action.** There is no code behind it, and none of it has been done: no profile, listing, outreach, account or review exists as a result of this work. Every step needs the owner (accounts, approvals, company facts) and, for some, a paid tool.

Company facts that are UNKNOWN and must never be invented: registered address, phone, legal entity name, founding year, social profile URLs, customers, awards, metrics, and the country or city of operation. Everything below uses only what is in `frontend/src/data/products.ts`, `services.ts` and `site.ts`.

## (a) Principles

1. **No purchased links.** No paid placement presented as editorial, no link exchanges arranged for rankings, no "guest post packages" from vendors selling links.
2. **No link farms, PBNs, mass directory submissions, comment spam or auto-generated profiles.**
3. **No fake reviews, fake listings or fake personas.** No reviews written by staff, relatives or contractors; no invented customers, case studies, awards or statistics; no listings at addresses the company does not occupy.
4. **Sponsored or paid content, if ever bought, is labelled as such and carries `rel="sponsored"`.** Paid listing upgrades on software directories are advertising, not links earned.
5. **Earn mentions by being useful.** Original explanations of how construction inspection, 360 capture, steel reconciliation and site access actually work, using what the products really do.
6. **Consistency first.** One company description, one name spelling ("SiteSureLabs"), same URL everywhere (section d).
7. **Respect each platform's rules.** Several below restrict self-promotion or require a personal account; those rules are stated per target.
8. **No guarantees.** Links and mentions are not promised to produce rankings or AI-search citations.
9. **Disclose conflict.** When a company founder writes about its own category, say so.

## (b) Verified target list

Verification legend: **Fetched** = page loaded and contents read. **Found via search** = URL appeared in search results but the page itself could not be fetched here (blocked or not attempted). **Not verified** = dropped, not listed. No domain authority figures are given. "Plausible contribution" is what is realistic given a small, new company with no confirmed customers; whether any outlet accepts it is up to the outlet.

### b1. Construction and ConTech publications

| Name | URL | Verification | Type | Why relevant | Plausible contribution |
|---|---|---|---|---|---|
| Construction Dive | https://www.constructiondive.com/ | Fetched | Trade news site (Informa TechTarget) | Covers construction, infrastructure, labor, safety; audience of contractors and developers | Submit an opinion piece via https://www.constructiondive.com/opinion/submit-opinion/ (fetched). Rules read: exclusive piece, about 1,000 words, must be original and not written with generative AI, editors may reject promotional or biased pieces, two to three rounds of edits, response within about 3 weeks or assume rejection. So only a genuinely non-promotional opinion fits. Contact page: https://www.constructiondive.com/contact/. Press release route exists at https://www.constructiondive.com/press-release/get-started/ (paid or distribution terms not read). |
| Construction Briefing (KHL Group) | https://www.constructionbriefing.com/ | Fetched | B2B construction news | Global construction news, technology coverage | Pitch editorial by their contact page (/contact); no submission process stated on the page read. Newsworthy angle needed (a real launch or customer, which does not exist yet). |
| ENR (Engineering News-Record) | https://www.enr.com/ | Found via search (authors page https://www.enr.com/authors); site fetch returned 403 | Trade publication | Major construction and engineering news, events (ENR FutureTech was seen) | Pitch a relevant reporter from the authors page once there is something newsworthy. No contributed-content rules were verified. |
| AEC Magazine | https://aecmag.com/about-us/ | Fetched | Technology magazine | Covers BIM, AI, reality modelling, digital twins for architects, engineers and construction | Contact page https://aecmag.com/contact/ (linked from the About page, not itself fetched). No submission process stated. A pitch would need to fit a BIM/AEC technology angle; SiteVision (360 capture against floor plans) is the closest fit. |

### b2. Real estate and proptech publications

| Name | URL | Verification | Type | Why relevant | Plausible contribution |
|---|---|---|---|---|---|
| Property Industry Eye | https://propertyindustryeye.com/ | Fetched | UK property trade news | Has a Tech category (https://propertyindustryeye.com/category/tech/); contact page https://propertyindustryeye.com/contact-us/ | UK-market focus; relevant only if the company serves that market (unconfirmed). Enquiry via contact page; no press release policy was visible. |
| CREDAI | https://credai.org/ | Fetched | Real estate developers' association (India) | Describes itself as the apex body of private real estate developers in India, 13,000+ developers; "Become a Member" page exists | Relevant ONLY if the company operates in India (unconfirmed). Membership terms and any technology-vendor category were not shown; ask via their contact page. |

No dedicated proptech outlet with a clear, verified guest-contribution process was confirmed, so none is listed. Candidates seen in search but not verified as accepting contributions (do not pitch until their own "write for us" pages are read): Housing Technology, CommercialCafe, ButterflyMX blog (it publishes guest posts but is a competitor-adjacent vendor blog and a real-estate access-control brand, so likely poor fit).

### b3. AI and enterprise-tech publications

No specific outlet was verified. Search results returned vendor blogs and low-quality "guest post" listings, which are excluded. When the owner is ready, find outlets by reading each candidate's own contributor guidelines page, and prefer outlets that edit contributions (like the Construction Dive rules above) over pay-to-post sites. Placeholder: `[PENDING RESEARCH: 3 to 5 AI/enterprise-tech outlets with published editorial guidelines]`.

### b4. Industry and professional associations

| Name | URL | Verification | Why relevant | Plausible contribution |
|---|---|---|---|---|
| RICS Tech Partner Programme | Official page URL not verified. Program seen via search (a vendor page, https://leica-geosystems.com/about-us/news-room/news-overview/2024/01/rics_tech_partner) | Found via search only | Royal Institution of Chartered Surveyors programme for technology companies serving land, real estate, construction and infrastructure | Check eligibility, cost and relevance on the official RICS site before applying; it is a paid association programme and is likely to need a track record. |
| AGC technology page | https://www.agc.org/industry-priorities/technology | Found via search | Associated General Contractors of America technology priorities and conference (US contractors) | Relevant only if serving US contractors. No vendor programme was confirmed. Exhibiting or sponsoring is advertising, not a link strategy. |
| Construction Industry Institute (CII) | https://www.construction-institute.org/ | Found via search (a CII PDF resource link was returned) | Research consortium of owners, contractors and suppliers | Membership is a commercial decision; no vendor tier verified. Low priority. |

### b5. Software directories

Only list a product where it is a real, shippable, publicly available product. The repo marks Anviksha, SiteVision, Digi Reco and Parichay as `demonstrated`; the owner must confirm each is generally available before listing it (directories generally expect a product that buyers can obtain). Never list Progress Tracker (planned) or the robotic inspection dog.

| Name | URL | Verification | Rules read | Notes |
|---|---|---|---|---|
| G2 | https://sell.g2.com/ (profile creation: https://sell.g2.com/create-a-profile; add product: https://www.g2.com/products/new) | sell.g2.com fetched; products/new returned 403 | Page says reviews should be authentic customer reviews and points to Community Guidelines and scoring methodology pages, which were not read | Read those guidelines before collecting any reviews. Incentivised reviews have their own rules; do not offer incentives unless G2's current policy explicitly allows it. |
| Capterra, GetApp, Software Advice (Gartner Digital Markets) | https://digital-markets.gartner.com/capterra-vendor-signup | Found via search | Search summaries describe a free "Launch" listing that covers a profile and review collection, with paid options for leads; vendor sign-up page itself not fetched. A listing approved on one appears across the three sites per that summary | Treat the free tier as the only reasonable starting point. Paid placement is advertising and does not buy a ranking claim. Verify the current terms on the sign-up page. |
| SourceForge | https://sourceforge.net/software/vendors/ | Fetched | Offers "Add a Commercial Product"; upgraded listings are paid and placement is tied to plan price; no eligibility rules were shown | Low priority; free listing only if the owner wants broader presence. |
| Product Hunt | https://www.producthunt.com/launch | Fetched | Personal accounts only (company accounts are prohibited); do not ask for upvotes (you may ask people to visit and comment); relaunch only for significant updates; makers encouraged to submit their own product | Poor fit for niche B2B construction software unless the company wants developer/startup attention. Only after a real public product exists. |

Not listed (not verified as relevant to ConTech or rules unknown): Crozdesk, SaaSworthy, AlternativeTo, Trustpilot. Check before use; do not create profiles in bulk.

Construction-specific marketplaces (Autodesk, Procore and similar app marketplaces) were not verified here. They would need integrations the repo does not show; skip unless an integration is built.

### b6. India-relevant directories and bodies: ONLY IF the company operates in India (UNCONFIRMED)

The repo's Parichay copy mentions Aadhaar and Indian site terms (tower, flat, labour camp), which suggests India but does not confirm where the company is registered or operates. Treat as unconfirmed.

| Name | URL | Verification | Condition |
|---|---|---|---|
| CREDAI (see b2) | https://credai.org/ | Fetched | If the company operates in India and wants developer-community exposure; membership terms unknown. CREDAI TechCon event pages appeared in search results (not fetched or verified here). |

Other Indian bodies and directories (for example business registries or startup directories) were not verified and are intentionally not listed. If operating in India, add entries only after reading each one's own page.

## (c) Guest-post and PR ideas grounded in what the products do

No fabricated case studies, no statistics, no customer names. Each idea relies on the product's described behaviour or on general, attributable knowledge.

1. **"From scattered photos to a structured defect record: what a good site observation contains."** Explains the fields (tower, floor, flat, room, category, severity, recommended fix, photo mark-up) and why consistent structure matters. Links to Anviksha. Format: how-to for QA/QC teams.
2. **"Manual vs AI inspection: where each helps and where each does not."** Honest comparison; mentions human review of AI-rated severity (Anviksha lets users override severity). Pair with the on-site comparison post (`/blog/manual-vs-ai-construction-inspection`).
3. **"How to capture a building in 360 against the floor plan, and what to do with it."** Method: capture points, stitching, review timeline, report export. Pair with `/blog/360-degree-construction-documentation`. Include honest limits (coverage gaps and AI confidence are surfaced in SiteVision's progress view, not hidden).
4. **"Why steel reconciliation still happens in spreadsheets."** Explains stock, issues, wastage and scrap by bar diameter and why cross-checks and recorded approvals matter. Use only demonstration-labelled illustrations (the demo data is not performance results). Hold until keyword demand is validated.
5. **"What a site gate needs to know about every worker."** Registration steps, duplicate checks across sites, entry-pass contents, site-scoped access, retention as the customer's choice. Avoid legal claims about labour law or identity-document handling; get owner/legal review first.
6. **"Building AI products for construction: what we learned running our own."** Founder voice, reflects the "Product-first" principle in `site.ts` (marked CONFIRM for founder sign-off). Needs real, owner-supplied lessons; do not invent.
7. **Podcast and interview angle:** founder on practical AI for site teams (principles: practical AI, built for operators). Only with a real founder who approves the quotes.
8. **Press release (only on a genuine event):** public availability of a product, or a first confirmed deployment, once the owner can name it with permission. Nothing before that.
9. **Resource pitches:** offer an editor a neutral checklist (for example a digital inspection checklist) that the company authors; no product mention required.

Pitch hygiene: one outlet at a time, read their guidelines, personalise, disclose affiliation, accept edits, never submit the same article to several outlets, never use generative AI where the outlet bans it (Construction Dive does).

## (d) Consistent company profile (use everywhere)

Facts source: `site.ts` (name, URL, description, tagline, email), `products.ts`, `services.ts`.

**Canonical name:** SiteSureLabs (one word, capital S, S, L). Do not write "Site Sure Labs", "SSL" or other variants.
**Tagline:** Intelligence engineered for the real world.
**URL:** https://sitesurelabs.com (no trailing path variations, always HTTPS).
**Email:** mhcai@myhomeconstructions.com (confirmed by the owner 2026-11-09 as the public contact address; it is on the website).

### 25-word description (exactly 25)

SiteSureLabs builds AI-powered construction technology and enterprise software for inspection, project visibility and efficiency. Its products: Anviksha, SiteVision, Digi Reco, Parichay built for site teams.

### 50-word description (exactly 50)

SiteSureLabs builds AI-powered construction technology and enterprise software that improve inspection, project visibility and efficiency. Anviksha turns site photos into rated defect observations and reports. SiteVision captures sites in 360° against floor plans. Digi Reco reconciles steel from site workbooks. Parichay registers workers at the gate and prints entry passes.

### 150-word description (exactly 150)

SiteSureLabs builds AI-powered construction technology and enterprise software that improve construction inspection, project visibility, operational efficiency and digital transformation. Its products are built for the people on site. Anviksha is AI construction quality inspection: capture a defect, locate it by tower, floor, flat and room, and get a rated, explained observation and a quality report. SiteVision captures rooms in 360° against the floor plan, publishes walkable tours and tracks progress with AI. Digi Reco turns monthly site workbooks into steel ledgers and an abstract by diameter, with cross-checks and exceptions. Parichay registers workers at the gate, flags duplicates across sites and prints entry passes. SiteSureLabs also takes on AI product development, computer vision, document processing, LLM applications and workflow automation, working from a real prototype on your data to deployment. Start with a time-boxed proof of concept and an honest go or no-go read. Visit sitesurelabs.com to see product demonstrations.

(Word counts were checked by hand; re-check with a counter before submitting to a form with a hard limit.)

### Product one-liners (use verbatim)

- **Anviksha:** Turn site photos into located, rated defect observations and quality reports.
- **SiteVision:** Capture rooms in 360° against the floor plan, then review progress remotely with AI.
- **Digi Reco:** Turn monthly site workbooks into a reconciled steel abstract, with wastage and exceptions flagged.
- **Parichay:** Register every worker at the gate and print their entry pass, with duplicates flagged before a second card is issued.
- **Progress Tracker:** In development. Do NOT list or promote it on any third-party profile.
- **Robotic inspection dog:** In development. Do NOT mention on third-party profiles until the owner approves.

### Do not include in any profile
Customer names, awards, user counts, accuracy or time-saving claims, founding year, headcount, locations, certifications, integrations, pricing.

### [PENDING OWNER INPUT] placeholders

| Placeholder | Needed for | Status |
|---|---|---|
| `[LEGAL ENTITY NAME]` | Directories, Google Business Profile, legal pages, schema.org Organization | Unknown |
| `[FOUNDING YEAR]` | Profiles, schema | Unknown |
| `[REGISTERED ADDRESS]` (street-level, physical) | Google Business Profile, directories, NAP | Unknown, `site.address` is null |
| `[PUBLIC PHONE NUMBER]` | Local listings, NAP | Unknown |
| `[COUNTRY / CITY OF OPERATION]` | Directory and association choice, local SEO, language variant | Unknown |
| `[LINKEDIN URL]`, `[X/TWITTER URL]`, `[YOUTUBE URL]`, `[GITHUB URL]` | `sameAs` schema, profile cross-links | Unknown, `site.social` is empty |
| `[LOGO FILES]` (SVG, square PNG 400x400 or larger, white and dark variants, favicon) | Every profile | Not provided |
| `[FOUNDER NAME(S) / BIO / PHOTO]` | About page, author profiles, pitches | Unknown |
| `[CONFIRMED PUBLIC CONTACT EMAIL]` | Profiles | Placeholder mailbox |
| `[PRODUCT AVAILABILITY]` per product (live / pilot / demo only) | Directory eligibility | Repo says "demonstrated"; confirm |
| `[PRICING MODEL]` (if any may be published) | Directories | Unknown |

## (e) Local SEO

### Honest eligibility assessment for Google Business Profile (GBP)

From Google's guidelines (https://support.google.com/business/answer/3038177, fetched):

- A business qualifies if it either "has a physical location that customers can visit, or travels to customers where they are".
- A service-area business may hide its address but still needs a real base; a P.O. box or a remote mailbox is not acceptable, and the address must match the real physical location.
- A virtual office (rented mailing address from which the business does not operate) is not eligible. A co-working space counts only with clear signage, customers received in business hours and staff present then.
- Service areas generally should not stretch more than about two hours' driving from the business.

Assessment for SiteSureLabs:
- It is a software and AI company. If it has no staffed office, no customer-facing premises and does not visit customer sites, it **likely does not qualify**. Do not create a profile with a made-up, virtual-office or mailbox address; suspension risk and misleading results follow.
- It **may qualify** if there is a real staffed office with signage that receives visitors (display the address), or if staff genuinely travel to clients' sites for services such as inspections or integration work (service-area profile; address hidden; within the service-area limit).
- Decision depends on facts not in the repo. Owner to answer: Is there a physical office staffed during stated hours? Do you visit customer sites? Where?
- If the answer is "fully remote and online", skip GBP and rely on web directories, LinkedIn and software review profiles. Local SEO is then largely irrelevant for this business model.

### If eligible: claim and verify steps

1. Confirm the legal name, real address, phone and hours with the owner. `[PENDING OWNER INPUT]`
2. Search Google Maps for an existing listing before creating a new one; claim rather than duplicate.
3. Create the profile at https://business.google.com using the exact legal or trading name used on the website (no keywords added to the name).
4. Choose primary category honestly (for example Software company); add secondary categories only if accurate.
5. Hide the address if service-area only; set a service area within the allowed radius.
6. Add the website https://sitesurelabs.com, hours, a description (use the 50-word text in section d), logo and real photos of the actual office or team (stock photos are not acceptable).
7. Verify using the method Google offers (postcard, phone, email or video). Do not use third-party "verification" services.
8. Keep hours and details current; respond to reviews.

### NAP consistency rules

- **N**ame: always "SiteSureLabs", identical to the legal or trading name used with the registry; no added keywords.
- **A**ddress: formatted identically everywhere (suite or floor on line 2). The same address on the website footer and contact page, GBP, directories, `Organization` schema and legal pages.
- **P**hone: one local number in one format; the same on the site and every listing. Include country code format consistently.
- Do not list a virtual office, mailbox or co-working desk the team does not use.
- Audit every listing quarterly; update all at once after any change; maintain a master sheet (section g).
- Until address and phone are confirmed, do NOT publish any NAP anywhere; leave fields empty rather than inventing.

### Directory list

Use only where the details are real: GBP (if eligible), LinkedIn company page, G2 and Capterra family (software, section b5), and any national company registry or industry association that the owner's real jurisdiction supports (unknown). Skip generic "citation packages".

### Review-collection policy

- Ask real customers who have actually used the product, after they have used it, with a neutral request ("tell us your honest experience").
- **No review gating:** do not screen customers and only ask the happy ones to post publicly; do not discourage negative reviews.
- No incentives unless the specific platform's current rules allow them and the incentive is disclosed as that platform requires.
- No staff, relative or contractor reviews; no reviews written on a customer's behalf; no bulk or automated review generation.
- Respond to every review professionally and factually; never argue or reveal confidential data.
- Use each platform's own review request tools and keep the invitation wording consistent and non-leading.

### What we will NOT do

- Create a GBP with a fake, virtual-office or mailbox address, or fake service areas.
- Buy reviews, links, listings or "citations".
- Create multiple profiles for the same business or for products as fake "locations".
- Use keyword-stuffed business names.
- Claim an office, city, customers, awards or results that have not been confirmed.
- Spam directories, forums or comment sections.
- Use AI-generated reviews or fabricated personas.

## (f) AI-search and brand-mention tactics (honest, no guarantees)

No tactic guarantees citation in AI answers or any ranking. These raise the chance that accurate information about the company exists in places machines read.

1. **Be precise and consistent.** Use the exact descriptions and one-liners in section d on the site, in directories and on social profiles; models and search systems resolve the entity by repeated, consistent mentions.
2. **Clear entity pages.** Keep `/about` and product pages in plain, factual language: who, what, for whom, what the product does and does not do. Add an `Organization` schema with only confirmed properties, and `sameAs` links once real profiles exist.
3. **Machine-readable basics.** Keep the sitemap, server-rendered or prerendered content and robots rules correct so crawlers (including AI crawlers) can read pages; decide deliberately which AI crawlers to allow in `robots.txt`; confirm with logs rather than assume. An `llms.txt` file is an optional, unproven convention; if added, treat it as low-cost, not as a ranking lever.
4. **Earn third-party mentions in reliable places:** a G2 or Capterra profile with genuine reviews, a LinkedIn company page, trade-press bylines (section b), conference talks. Independent descriptions help more than self-description.
5. **Publish useful, specific explainers** (section c) that directly answer questions people ask about construction inspection, 360 documentation, steel reconciliation and site access, with clear headings, definitions, step lists and honest limits.
6. **Keep claims verifiable.** Avoid unattributable numbers; AI systems and editors both discount or contradict unsupported claims.
7. **Monitor, do not promise.** Monthly: ask several assistants and search engines factual questions about the brand and products (log the date, prompt, answer, citations); note errors; fix the source content, then request corrections via the platforms' own feedback tools. Treat results as a sample, not a metric.
8. **Do not manipulate:** no hidden text for AI, no prompt-injection in pages, no fake Q&A seeding on forums, no mass-generated pages.

## (g) Outreach tracking template

Copy into a spreadsheet or the team's tracker. One row per target.

| ID | Target (name, URL) | Type (publication, directory, association, podcast) | Contact (name, role, source of contact) | Why relevant (one line, evidence) | Asset or ask (article, listing, quote, profile) | Product/page linked | Rules checked (link to guidelines, date) | Date contacted | Follow-up date (once, no more than 2 total) | Status (not started, pitched, in edit, published, declined, no response) | Result URL | Link attribute (follow/nofollow/sponsored, observed not assumed) | Disclosure made? | Notes / lessons | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

Companion tab, **NAP and profile master**: Platform | Profile URL | Name as shown | Address as shown | Phone as shown | Description version used (25/50/150) | Logo version | Created by | Date verified | Last audited | Login owner (role account, not personal) | Review count (real) | Issues.

Companion tab, **Review log**: Platform | Date | Reviewer (public name) | Rating | Responded (date) | Invited via (method) | Notes. (Never log fabricated entries.)

Rules for the tracker: never pitch the same idea to two outlets at once; log rejections (editors sometimes explain why); record the observed link attribute rather than assuming; one reply to a non-response, then stop.

## (h) What needs the owner

| Item | Why it is needed | Who |
|---|---|---|
| Confirm country and cities of operation | Directory, association and language choices; local SEO decision | Owner |
| Legal entity name, registered address, phone, founding year | Directories, GBP, schema | Owner |
| Answer the GBP eligibility questions (physical staffed office? visits clients?) | Decides if GBP is allowed | Owner |
| Social accounts: create and own LinkedIn company page (and any of X, YouTube, GitHub) using a role-based company email, then share URLs | `sameAs`, profile links | Owner |
| Role-based company email (for example the hello@ mailbox once it exists) | Account ownership, verification codes, review-platform logins | Owner / IT |
| Verification actions: Google Search Console (DNS TXT record), Google Business Profile (postcard, phone, email or video), Bing Webmaster Tools, G2 and Capterra vendor-account verification (usually work email on the company domain) | Cannot be done by an agent or contractor without owner-controlled access | Owner |
| Confirm product availability and publishable status for each product (generally available, pilot, demo only) | Directory eligibility; honest listings | Owner |
| Logo files and approved screenshots (use existing product stills in `public/media/stills` only if the owner approves public use) | Profiles | Owner / designer |
| Founder names, bios, photos, approved quotes | Bylines, pitches, About page | Founder |
| Permission and wording for any customer or pilot mention (none known today) | Case studies, press | Owner and customer |
| Budget decision on paid items (directory upgrades, events), recorded as advertising | Avoid mislabelled paid placement | Owner |
| Legal review of any claims about worker identity data (Parichay) and data retention | Compliance | Owner / counsel |

## Order of work (suggested)

1. Resolve section h basics (country, entity, email, social, logo).
2. Set up consistent profiles: LinkedIn, plus Search Console and Bing Webmaster.
3. Decide GBP eligibility; skip it if the company is online-only.
4. Publish the three blog posts; create the section c explainers.
5. List eligible products on the free tiers of G2 and Capterra only once real customers exist to review honestly.
6. Pitch one outlet at a time (Construction Dive opinion or AEC Magazine are the best-documented routes); track in section g.
7. Review quarterly with the on-page strategy in `docs/SEO_KEYWORD_STRATEGY.md`.
