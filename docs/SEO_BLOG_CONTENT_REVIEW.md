# SiteSureLabs: Blog Content Review Package (for the owner)

Status: **APPROVED by the owner on 2026-11-04** (all three articles, as written; `review: 'approved'` in `frontend/src/data/articles.ts`). Not yet live: they go live when the new build is deployed. The Anviksha and SiteVision teams still need to confirm the four statements marked NEEDS CONFIRMATION (section 2), because the owner approved the text as it stands. Originally prepared for the owner's personal review on branch `feature/sitesurelabs-seo-implementation`. Generated from `frontend/src/data/articles.ts` and the built pages.

> **How to read status in these SEO documents.** **Implemented in code** = on the feature branch, uncommitted or committed there, not deployed and not live. **Owner action** = needs you or a named team. **External activity** = done outside the repo; none of it has been done.

## 0. What you need to do

1. Read each article below (sections 1 to 3). Every sentence has a reference such as **[A1.3]** or **(A2.4a)**.
2. Mark corrections in the table at the end of each article, or tell me in chat, for example "A2.4b: remove" or "A3.5: change to ...".
3. Decide per article: approved, approved with corrections, or not approved.
4. I will apply your corrections. **I will not set any article to `review: 'approved'` until you tell me to.** After you approve, the Anviksha team (articles 1 and 2) and the SiteVision team (article 3) should still confirm the product statements (see `SEO_PRODUCT_CONTENT_REVIEW.md`, section 7).

## 1. Current status of the articles

| Article | Future URL | Status | Visible now? |
|---|---|---|---|
| A1. Digital Construction Inspection: A Practical Guide | `/blog/digital-construction-inspection-guide` | `review: 'pending'` | **No.** Hidden draft |
| A2. Manual vs AI-Powered Construction Inspections | `/blog/manual-vs-ai-construction-inspection` | `review: 'pending'` | **No.** Hidden draft |
| A3. 360° Construction Site Documentation: How It Works | `/blog/360-degree-construction-documentation` | `review: 'pending'` | **No.** Hidden draft |

While an article is `pending`:

- it is **`noindex, nofollow`** and shows a visible **DRAFT** banner;
- it is **not in `sitemap.xml`**, **not in `llms.txt`**, not in the header or footer navigation, and not in the `/blog` list;
- the `/blog` page is a placeholder and also `noindex` (no Blog link appears in the navigation);
- a production build must use `SEO_REQUIRE_REVIEWED=1 npm run build`, which **refuses to build while any article is pending**. Never deploy a non-strict build: it would still contain the draft text.

**Nothing is published.** Approval is a one-word change (`review: 'approved'`) per article, which I will make only on your instruction.

To read the drafts as web pages on your machine (they are not on the live site):

```bash
cd frontend
npm run build
npx vite preview            # then open the printed address and go to /blog/<slug>
```

(Vite's preview serves the homepage for some deep links; if a page shows the homepage, add a trailing slash, e.g. `/blog/digital-construction-inspection-guide/`.)

## 2. Three items I need you to look at first

### Highlighted item 1: Anviksha, "filtered and compared across inspections" (article A2)

- **Where:** A2 table, row "Search and trends", AI-assisted column (reference **(A2.4e)**): "Observations can be filtered and compared across inspections".
- **What the Anviksha product page says:** capability "AI assistant: Ask questions across inspections and spot defect trends." and value "Visibility across sites: Defect patterns become visible." Neither mentions filtering.
- **Question for you and the Anviksha team:** does Anviksha let users filter and compare observations across inspections?
- **Options:** (a) confirm the statement as written; (b) reword to match the product page, for example "Questions can be asked across inspections, and defect trends spotted" (a rewording of the product page text, subject to the team confirming); (c) remove the row. I have not changed it.

### Highlighted item 2: SiteVision, per floor versus per room (article A3)

- **Where:** **[A3.8]** "Where AI fits": "AI can look across captures to estimate progress **for each room or activity**, and flag areas that have **no recent coverage**." and **[A3.12]** "How SiteVision approaches it": "It estimates progress **per floor**, shows its confidence and flags coverage gaps."
- **What the SiteVision product page says:** capability: "**Per-floor** estimates with confidence shown and coverage gaps flagged." FAQ: "AI analyses the captures **per room and activity**, shows its confidence, and flags areas **without coverage**."
- **So the product page itself uses both terms.** The article repeats them in two places, which may read as inconsistent. It also adds the word "recent" to "coverage", which the product page does not say.
- **Question for you and the SiteVision team:** is the analysis done per room and activity and then reported per floor? If so, one wording could be used in both places, for example "analyses captures per room and activity and reports progress per floor" (my synthesis of the two product statements; **not confirmed**). Should "recent" be removed?

### Highlighted item 3: do all product descriptions and capabilities match the real products?

- I compared every product statement in the three articles with the product pages (section 3 of each article, "Statement-by-statement product check"). **Every product statement matches the website text, except four statements marked NEEDS CONFIRMATION:** (1) A2 "filtered and compared across inspections" (item 1 above); (2) A3 "each room or activity" and (3) A3 "no recent coverage" (item 2 above); (4) A3 "each photo is linked to its point on the plan" (the product page says "tied to rooms and dates").
- **What this does not prove:** the website text itself has not yet been confirmed by the product teams, and I could only compare against the website, not the real products. The teams must verify against the actual products. The checklist for them is `SEO_PRODUCT_CONTENT_REVIEW.md`.
- **What the articles do not contain:** no statistics, no customer stories, no research findings, no credentials, no benchmarks and no capability beyond the product pages. Advice that is not about a SiteSureLabs product is marked "General advice" in the check tables: it should be confirmed as sound practice by someone who knows construction inspection.

## 3. Things that apply to all three articles

- **Author line:** "By SiteSureLabs". No individual is named. If you want a named author, that person must agree and a real bio is needed.
- **Dates:** published 2026-11-04 (the day written). If these go live later, tell me the real date.
- **Not in the articles on purpose:** FAQ structured data (Google does not show it for most sites), customer examples, performance claims.
- **Where they link:** each article links to its product page and a demo request, to the other two articles, and to `/blog`.

---

## 1. Digital Construction Inspection: A Practical Guide

### A1.1 Summary

| Field | Value |
|---|---|
| Future URL (not live) | `https://sitesurelabs.com/blog/digital-construction-inspection-guide` |
| Status | **`review: 'pending'`**: hidden draft, not published |
| Product team to confirm | Anviksha team |
| SEO title (as it will appear) | Digital Construction Inspection: A Practical Guide | SiteSureLabs (65 characters) |
| Meta description | What digital construction inspection is, how a site inspection runs from capture to closure, what to look for in software, and where AI helps and where it does not. (164 characters) |
| Primary keyword | **digital construction inspection** (search volume: Not measured) |
| Secondary keywords | construction inspection checklist digital (check demand); inspection report automation |
| H1 | Digital Construction Inspection: A Practical Guide |
| Category | Construction inspection |
| Published / modified (in page and schema) | 2026-11-04 / not modified (the day the text was written; update to the true go-live date) |
| Author shown | SiteSureLabs (the organisation; no individual is named) |
| Length | about 655 words |

### A1.2 Complete article (references like **[A1.3]** let you point at any sentence)

> **H1:** Digital Construction Inspection: A Practical Guide
>
> **A1.0 The short answer** (shown first, in a highlighted box)
>
> Digital construction inspection means recording site observations (what was found, where, how serious, and who must act) as structured digital records, usually with a photo and a location, instead of paper forms and scattered messages. The aim is a consistent, searchable record that can be followed through to closure.

#### **[A1.1]** H2: Why paper and chat-based inspection breaks down

**[A1.2]** Observations that live in notebooks, phone galleries and chat threads are hard to compare and hard to close out. The problems are general ones that most project teams will recognise:

**[A1.3]** (bulleted list)

- **(A1.3a)** Photos without a clear location: which tower, floor or room was this?
- **(A1.3b)** Different people describe the same kind of defect in different words, so records cannot be compared.
- **(A1.3c)** No single view of what is open, who owns it and when it was closed.
- **(A1.3d)** Reports are assembled by hand after the visit, so they arrive late.

#### **[A1.4]** H2: The inspection workflow, step by step

**[A1.5]** (numbered list)

1. **(A1.5a)** Define what you inspect against: drawings, specifications and the checklists agreed with the contractor.
2. **(A1.5b)** Capture on site: photograph the issue and record exactly where it is (tower, floor, flat, room).
3. **(A1.5c)** Classify it: type of defect and a severity rating, using a scale the whole team has agreed in advance.
4. **(A1.5d)** Assign it: an owner and a target date.
5. **(A1.5e)** Verify closure: re-inspect and record the fix with a new photo.
6. **(A1.5f)** Report: summarise open and closed observations for the project team and the contractor.

#### **[A1.6]** H2: What to look for in inspection software

**[A1.7]** (bulleted list)

- **(A1.7a)** Location tied to the building structure or the floor plan, not typed as free text.
- **(A1.7b)** Consistent defect categories and a single severity scale.
- **(A1.7c)** Photos that can be annotated, so the exact spot is clear.
- **(A1.7d)** Reports in a standard format that can be sent to the contractor.
- **(A1.7e)** A record of who captured what, and when.
- **(A1.7f)** Devices and connectivity that match site conditions. Confirm this before rolling out to a whole team.

#### **[A1.8]** H2: Where AI helps, and where it does not

**[A1.9]** AI image analysis can propose what a photo shows: a defect type, a suggested severity and a draft remedial action. That saves the time of writing every observation from scratch and makes the wording more consistent. It is a suggestion. A qualified person reviews it and can change it.

**[A1.10]** There are clear limits. A photo cannot show strength, depth or anything that needs testing or measurement. Poor lighting, angle or focus reduces what can be seen. Work behind finishes is not visible at all. For these, inspection and testing by a qualified engineer remain essential.

#### **[A1.11]** H2: How Anviksha approaches it

**[A1.12]** Anviksha is SiteSureLabs’ construction quality inspection product. A user photographs a defect and pins its tower, floor, flat and room. AI image insights summarise the key defects and suggest a severity and a recommended action; the user can accept the AI rating or set the severity themselves. Observations are compiled into quality observation reports with the photo, location, severity and fix, ready to send to the contractor.

#### **[A1.13]** H2: Starting with a small pilot

**[A1.14]** (bulleted list)

- **(A1.14a)** Choose one tower or floor rather than the whole project.
- **(A1.14b)** Agree the defect categories and the severity scale before the first capture.
- **(A1.14c)** Run the pilot alongside your current process for a short period.
- **(A1.14d)** Compare the two sets of records for completeness, consistency and time taken, then decide.

#### Frequently asked questions

**[A1.F1] Q: What is digital construction inspection?**

A: Recording site observations as structured digital records, with a photo and a precise location, so that they can be rated, assigned, tracked to closure and reported consistently.

**[A1.F2] Q: Does digital inspection replace site engineers?**

A: No. Software structures and speeds up the record. Judgement, measurement, testing and sign-off stay with qualified people.

**[A1.F3] Q: What should every inspection record contain?**

A: What was observed, where it is, a severity rating, photo evidence, who is responsible, a target date, and the status, including evidence when it is closed.

**[A1.F4] Q: Can AI find every defect in a photo?**

A: No. It can suggest defects that are visible in the image. Anything that is hidden, or that needs measurement or testing, still has to be checked by a person.

### A1.3 Internal links and product calls to action

Links the reader sees on the published page (from the built page; header and footer omitted):

| Link target | Link text |
|---|---|
| `/` | Home |
| `/blog` | Blog |
| `/products/anviksha` | Explore Anviksha |
| `/contact?type=demo&product=anviksha` | Request a demo |
| `/blog/manual-vs-ai-construction-inspection` | Manual vs AI-Powered Construction Inspections |
| `/blog/360-degree-construction-documentation` | 360° Construction Site Documentation: How It Works |
| `/contact?type=demo` | Request a Demo |
| `/products` | Explore products |

Related products: **Anviksha** (`/products/anviksha`). Related articles: `/blog/manual-vs-ai-construction-inspection`, `/blog/360-degree-construction-documentation`. The page ends with a "Request a Demo" band (`/contact?type=demo`) and "Explore products" (`/products`).

### A1.4 Structured data on this article

Embedded in the page as JSON-LD. Facts in it: the headline, description and dates above; author and publisher are the organisation; the image is the product cover screenshot; no ratings, reviews or individual author.

```json
[
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://sitesurelabs.com/blog/digital-construction-inspection-guide#article",
        "headline": "Digital Construction Inspection: A Practical Guide",
        "description": "What digital construction inspection is, how a site inspection runs from capture to closure, what to look for in software, and where AI helps and where it does not.",
        "datePublished": "2026-11-04",
        "dateModified": "2026-11-04",
        "mainEntityOfPage": "https://sitesurelabs.com/blog/digital-construction-inspection-guide",
        "author": {
          "@type": "Organization",
          "name": "SiteSureLabs",
          "url": "https://sitesurelabs.com"
        },
        "publisher": {
          "@id": "https://sitesurelabs.com/#organization"
        },
        "image": "https://sitesurelabs.com/media/stills/anviksha-defects.webp",
        "inLanguage": "en"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://sitesurelabs.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://sitesurelabs.com/blog"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Digital Construction Inspection: A Practical Guide",
            "item": "https://sitesurelabs.com/blog/digital-construction-inspection-guide"
          }
        ]
      }
    ]
  }
]
```

### A1.5 Statement-by-statement product check

"Consistent" means the statement matches the product page text (`frontend/src/data/products.ts`) as published on the website. **The SEO work could only compare against the website; the product team must verify against the real product.**

| # | Statement in the article | What the product page says | Result |
|---|---|---|---|
| 1 | Anviksha is SiteSureLabs’ construction quality inspection product. | Product summary: "AI-powered construction quality inspection." | Consistent |
| 2 | A user photographs a defect and pins its tower, floor, flat and room. | Capability "Live inspection capture": "Photograph a defect and pin its tower, floor, flat and room." | Consistent |
| 3 | AI image insights summarise the key defects and suggest a severity and a recommended action. | Capability "AI image insights": "Instant summary, key defects, severity and recommended actions." | Consistent |
| 4 | The user can accept the AI rating or set the severity themselves. | Capability "Mark-up and severity": "Let AI rate severity, or set it yourself."; FAQ "Can I set severity myself? Yes." | Consistent |
| 5 | Observations are compiled into quality observation reports with the photo, location, severity and fix, ready to send to the contractor. | Capability "Quality reports"; workflow step "Report: Export a report for the contractor." | Consistent |
| 6 | The six-step inspection workflow, what to look for in software, the pilot advice. | Not about a SiteSureLabs product. | General advice |
| 7 | "AI ... can propose a defect type, a suggested severity and a draft remedial action" and the limits of photos (strength, depth, hidden work). | General statement; consistent with the product making no accuracy or coverage claim. | General advice |
| 8 | FAQ: "Can AI find every defect in a photo? No." | General; the product page makes no such claim. | General advice |

### A1.6 Your corrections for this article

Fill in the table (or reply in chat using the references). Use **OK**, **CHANGE TO ...** or **REMOVE**.

| Reference | Decision | Correction or comment |
|---|---|---|
| | | |
| | | |
| | | |
| | | |
| | | |
| | | |

**Overall decision for Digital Construction Inspection: A Practical Guide:**  [ ] Approved as is   [ ] Approved with the corrections above   [ ] Not approved

Reviewer: ______________________   Date: ____________

---

## 2. Manual vs AI-Powered Construction Inspections

### A2.1 Summary

| Field | Value |
|---|---|
| Future URL (not live) | `https://sitesurelabs.com/blog/manual-vs-ai-construction-inspection` |
| Status | **`review: 'pending'`**: hidden draft, not published |
| Product team to confirm | Anviksha team |
| SEO title (as it will appear) | Manual vs AI-Powered Construction Inspections | SiteSureLabs (60 characters) |
| Meta description | A practical comparison of manual and AI-assisted construction inspections: what changes in speed, consistency and records, what does not change, and how to combine both. (169 characters) |
| Primary keyword | **manual vs AI construction inspection** (search volume: Not measured) |
| Secondary keywords | construction defect detection |
| H1 | Manual vs AI-Powered Construction Inspections |
| Category | Construction quality management |
| Published / modified (in page and schema) | 2026-11-04 / not modified (the day the text was written; update to the true go-live date) |
| Author shown | SiteSureLabs (the organisation; no individual is named) |
| Length | about 508 words |

### A2.2 Complete article (references like **[A2.3]** let you point at any sentence)

> **H1:** Manual vs AI-Powered Construction Inspections
>
> **A2.0 The short answer** (shown first, in a highlighted box)
>
> AI-assisted inspection does not remove the inspector. It changes how an observation is recorded: the photo is analysed to suggest a defect type, a severity and an action, and the inspector confirms or corrects it. Manual inspection stays essential for judgement, measurement and anything that cannot be seen in a photo.

#### **[A2.1]** H2: What stays the same

**[A2.2]** (bulleted list)

- **(A2.2a)** Responsibility for the inspection stays with a qualified person.
- **(A2.2b)** Work is still checked against the drawings and specifications.
- **(A2.2c)** Physical tests and measurements are still done on site.
- **(A2.2d)** The contractor still has to acknowledge and close each item.

#### **[A2.3]** H2: What changes

**[A2.4]** (table)

| Aspect | Manual inspection | AI-assisted inspection |
|---|---|---|
| **(A2.4a)** Writing the observation | The inspector writes the description from scratch | AI drafts a defect summary, a suggested severity and an action; the inspector reviews it |
| **(A2.4b)** Consistency | Wording and severity vary between inspectors | Every observation has the same structure and categories; differences in judgement can still exist |
| **(A2.4c)** Location | Often noted as free text | Recorded in structured fields such as tower, floor, flat and room |
| **(A2.4d)** Reporting | Compiled by hand after the visit | Generated from the recorded observations |
| **(A2.4e)** Search and trends | Hard across paper and photo galleries | Observations can be filtered and compared across inspections |
| **(A2.4f)** Main risk | Missed or vaguely described items under time pressure | Over-reliance on suggestions, poor photos, and wrong suggestions that go unchecked |

#### **[A2.5]** H2: When manual inspection should lead

**[A2.6]** (bulleted list)

- **(A2.6a)** Any structural concern.
- **(A2.6b)** Anything that needs measurement or testing rather than a visual check.
- **(A2.6c)** Work that is hidden or about to be covered.
- **(A2.6d)** Disputed items where a person has to decide.

#### **[A2.7]** H2: A hybrid approach

**[A2.8]** (numbered list)

1. **(A2.8a)** Agree the defect categories and the severity scale first.
2. **(A2.8b)** Capture each photo with its precise location.
3. **(A2.8c)** Let the AI propose the defect type, severity and action.
4. **(A2.8d)** Have the inspector confirm or edit every suggestion.
5. **(A2.8e)** Track each item to closure.
6. **(A2.8f)** Periodically compare a sample of AI suggestions with the inspectors’ final decisions, to learn where the tool is weak on your site.

#### **[A2.9]** H2: Questions to ask any vendor

**[A2.10]** (bulleted list)

- **(A2.10a)** Can I override every AI suggestion, and is the original suggestion kept?
- **(A2.10b)** How is location captured, and does it follow the structure of our building?
- **(A2.10c)** What does the report look like, and can it carry our project branding?
- **(A2.10d)** How can we evaluate accuracy on our own site photos before committing?

**[A2.11]** These apply to SiteSureLabs too. Anviksha lets the user set severity themselves or accept the AI rating, and produces quality observation reports with the photo, location, severity and fix. If you want to see how it behaves on your own photos, ask us for a demonstration.

#### Frequently asked questions

**[A2.F1] Q: Is AI inspection more accurate than manual inspection?**

A: There is no general answer. Accuracy depends on the model, the quality of the photos and the type of defect. Evaluate any tool on your own site photos, with an engineer reviewing the results.

**[A2.F2] Q: Will AI replace quality engineers?**

A: No. AI can draft and structure observations. Qualified people remain responsible for judging, measuring, testing and signing off.

**[A2.F3] Q: What kinds of defects can a photo show?**

A: Visible issues such as cracks, exposed reinforcement or surface segregation. A photo cannot show strength, internal condition or work hidden behind finishes.

### A2.3 Internal links and product calls to action

Links the reader sees on the published page (from the built page; header and footer omitted):

| Link target | Link text |
|---|---|
| `/` | Home |
| `/blog` | Blog |
| `/products/anviksha` | Explore Anviksha |
| `/contact?type=demo&product=anviksha` | Request a demo |
| `/blog/digital-construction-inspection-guide` | Digital Construction Inspection: A Practical Guide |
| `/blog/360-degree-construction-documentation` | 360° Construction Site Documentation: How It Works |
| `/contact?type=demo` | Request a Demo |
| `/products` | Explore products |

Related products: **Anviksha** (`/products/anviksha`). Related articles: `/blog/digital-construction-inspection-guide`, `/blog/360-degree-construction-documentation`. The page ends with a "Request a Demo" band (`/contact?type=demo`) and "Explore products" (`/products`).

### A2.4 Structured data on this article

Embedded in the page as JSON-LD. Facts in it: the headline, description and dates above; author and publisher are the organisation; the image is the product cover screenshot; no ratings, reviews or individual author.

```json
[
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://sitesurelabs.com/blog/manual-vs-ai-construction-inspection#article",
        "headline": "Manual vs AI-Powered Construction Inspections",
        "description": "A practical comparison of manual and AI-assisted construction inspections: what changes in speed, consistency and records, what does not change, and how to combine both.",
        "datePublished": "2026-11-04",
        "dateModified": "2026-11-04",
        "mainEntityOfPage": "https://sitesurelabs.com/blog/manual-vs-ai-construction-inspection",
        "author": {
          "@type": "Organization",
          "name": "SiteSureLabs",
          "url": "https://sitesurelabs.com"
        },
        "publisher": {
          "@id": "https://sitesurelabs.com/#organization"
        },
        "image": "https://sitesurelabs.com/media/stills/anviksha-defects.webp",
        "inLanguage": "en"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://sitesurelabs.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://sitesurelabs.com/blog"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Manual vs AI-Powered Construction Inspections",
            "item": "https://sitesurelabs.com/blog/manual-vs-ai-construction-inspection"
          }
        ]
      }
    ]
  }
]
```

### A2.5 Statement-by-statement product check

"Consistent" means the statement matches the product page text (`frontend/src/data/products.ts`) as published on the website. **The SEO work could only compare against the website; the product team must verify against the real product.**

| # | Statement in the article | What the product page says | Result |
|---|---|---|---|
| 1 | Table: AI "drafts a defect summary, a suggested severity and an action; the inspector reviews it". | Workflow "Analyse": "AI checks the photo, rates severity and drafts the fix." | Consistent |
| 2 | Table: location "recorded in structured fields such as tower, floor, flat and room". | Capability "Live inspection capture". | Consistent |
| 3 | Table: reporting "generated from the recorded observations". | Capability "Quality reports". | Consistent |
| 4 | Table: every observation "has the same structure and categories; differences in judgement can still exist". | Value "Consistent records: The same structure for every defect."; screenshot caption "Location and category on every capture". | Consistent |
| 5 | Table: "Observations can be filtered and compared across inspections". | Closest product text: capability "AI assistant: Ask questions across inspections and spot defect trends." and value "Visibility across sites: Defect patterns become visible." Neither says "filtered". | **NEEDS CONFIRMATION** |
| 6 | "Anviksha lets the user set severity themselves or accept the AI rating, and produces quality observation reports with the photo, location, severity and fix." | Capabilities "Mark-up and severity" and "Quality reports". | Consistent |
| 7 | FAQ: visible issues such as "cracks, exposed reinforcement or surface segregation". | Cover and screenshot captions: exposed rebar, crack across slab, segregation, cold joint. | Consistent |
| 8 | "There is no general answer" on AI accuracy; evaluate on your own photos. | General; the product publishes no accuracy figure. | General advice |
| 9 | Vendor questions, e.g. "Can I override every AI suggestion, and is the original suggestion kept?" | General question. The Anviksha team should know its own answer to "is the original suggestion kept?" before this goes live. | General advice |
| 10 | Hybrid approach, "when manual should lead", main-risk row. | General practice. | General advice |

### A2.6 Your corrections for this article

Fill in the table (or reply in chat using the references). Use **OK**, **CHANGE TO ...** or **REMOVE**.

| Reference | Decision | Correction or comment |
|---|---|---|
| | | |
| | | |
| | | |
| | | |
| | | |
| | | |

**Overall decision for Manual vs AI-Powered Construction Inspections:**  [ ] Approved as is   [ ] Approved with the corrections above   [ ] Not approved

Reviewer: ______________________   Date: ____________

---

## 3. 360° Construction Site Documentation: How It Works

### A3.1 Summary

| Field | Value |
|---|---|
| Future URL (not live) | `https://sitesurelabs.com/blog/360-degree-construction-documentation` |
| Status | **`review: 'pending'`**: hidden draft, not published |
| Product team to confirm | SiteVision team |
| SEO title (as it will appear) | 360° Construction Site Documentation: How It Works | SiteSureLabs (65 characters) |
| Meta description | How 360 degree construction site documentation works: capturing against floor plans, building walkthroughs, tracking progress over time, and the limits of what images can show. (176 characters) |
| Primary keyword | **how to document a construction site in 360** (search volume: Not measured) |
| Secondary keywords | 360 construction documentation |
| H1 | 360° Construction Site Documentation: How It Works |
| Category | 360 degree documentation |
| Published / modified (in page and schema) | 2026-11-04 / not modified (the day the text was written; update to the true go-live date) |
| Author shown | SiteSureLabs (the organisation; no individual is named) |
| Length | about 504 words |

### A3.2 Complete article (references like **[A3.3]** let you point at any sentence)

> **H1:** 360° Construction Site Documentation: How It Works
>
> **A3.0 The short answer** (shown first, in a highlighted box)
>
> 360-degree construction documentation records a site as panoramic photos taken at planned points, usually mapped to the floor plan, so people can look around each room remotely and compare it with earlier captures. It records what is visible on the day of capture and complements, rather than replaces, inspection.

#### **[A3.1]** H2: How capture works

**[A3.2]** (numbered list)

1. **(A3.2a)** Pick the floor and open its plan.
2. **(A3.2b)** Walk to the planned capture points and take a 360° photo at each.
3. **(A3.2c)** Each photo is linked to its point on the plan and to the date.
4. **(A3.2d)** The photos are stitched and organised, in order, into a walkthrough.
5. **(A3.2e)** Repeat on a regular schedule, so the same places can be compared over time.

#### **[A3.3]** H2: What teams use it for

**[A3.4]** (bulleted list)

- **(A3.4a)** Remote progress review by people who cannot visit the site.
- **(A3.4b)** A dated visual record of rooms, for example before finishes cover services.
- **(A3.4c)** Comparing the same location on different dates.
- **(A3.4d)** Sharing context with consultants and clients without a site visit.

#### **[A3.5]** H2: Capture habits that make the record useful

**[A3.6]** (bulleted list)

- **(A3.6a)** Use the same route and the same points each time.
- **(A3.6b)** Name floors and rooms consistently.
- **(A3.6c)** Avoid shooting straight into bright windows where you can.
- **(A3.6d)** Capture before services and finishes cover the work you may need to see later.
- **(A3.6e)** Keep a regular cadence tied to project milestones and review meetings.

#### **[A3.7]** H2: Where AI fits

**[A3.8]** AI can look across captures to estimate progress for each room or activity, and flag areas that have no recent coverage. Treat an estimate as an aid to review, not as a measured quantity. A good tool shows how confident the estimate is, so people know when to look more closely.

#### **[A3.9]** H2: The limits

**[A3.10]** (bulleted list)

- **(A3.10a)** Images show visible surfaces only. Work inside walls or slabs is not shown unless it was captured before it was covered.
- **(A3.10b)** Image quality, lighting and coverage decide how much can be seen.
- **(A3.10c)** 360° documentation does not replace inspection, measurement or testing.

#### **[A3.11]** H2: How SiteVision approaches it

**[A3.12]** SiteVision captures rooms in 360° against the floor plan: labelled points show where to capture, and the panoramas stitch automatically. Captures are published as walkthroughs with a floor-plan map and a capture timeline. It estimates progress per floor, shows its confidence and flags coverage gaps. Its assistant, Drishti, answers questions about progress, quality and completion in plain language, and progress views can be exported as PDF and Excel.

#### Frequently asked questions

**[A3.F1] Q: What is 360 degree construction documentation?**

A: A record of the site as panoramic photos taken at planned points, usually mapped to the floor plan, so each room can be viewed remotely and compared across dates.

**[A3.F2] Q: What do I need to capture a site?**

A: A way to take 360° photos. SiteVision’s workflow expects 360° photos taken at the labelled points on the floor plan. Contact us about supported devices.

**[A3.F3] Q: How often should a site be captured?**

A: There is no universal rule. Choose a cadence that follows your milestones and review meetings, and keep it consistent so captures can be compared.

**[A3.F4] Q: Can 360° documentation replace site visits?**

A: No. It shows what is visible on the capture date. Inspection, measurement and testing still need people on site.

### A3.3 Internal links and product calls to action

Links the reader sees on the published page (from the built page; header and footer omitted):

| Link target | Link text |
|---|---|
| `/` | Home |
| `/blog` | Blog |
| `/products/site-vision` | Explore SiteVision |
| `/contact?type=demo&product=site-vision` | Request a demo |
| `/blog/digital-construction-inspection-guide` | Digital Construction Inspection: A Practical Guide |
| `/blog/manual-vs-ai-construction-inspection` | Manual vs AI-Powered Construction Inspections |
| `/contact?type=demo` | Request a Demo |
| `/products` | Explore products |

Related products: **SiteVision** (`/products/site-vision`). Related articles: `/blog/digital-construction-inspection-guide`, `/blog/manual-vs-ai-construction-inspection`. The page ends with a "Request a Demo" band (`/contact?type=demo`) and "Explore products" (`/products`).

### A3.4 Structured data on this article

Embedded in the page as JSON-LD. Facts in it: the headline, description and dates above; author and publisher are the organisation; the image is the product cover screenshot; no ratings, reviews or individual author.

```json
[
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://sitesurelabs.com/blog/360-degree-construction-documentation#article",
        "headline": "360° Construction Site Documentation: How It Works",
        "description": "How 360 degree construction site documentation works: capturing against floor plans, building walkthroughs, tracking progress over time, and the limits of what images can show.",
        "datePublished": "2026-11-04",
        "dateModified": "2026-11-04",
        "mainEntityOfPage": "https://sitesurelabs.com/blog/360-degree-construction-documentation",
        "author": {
          "@type": "Organization",
          "name": "SiteSureLabs",
          "url": "https://sitesurelabs.com"
        },
        "publisher": {
          "@id": "https://sitesurelabs.com/#organization"
        },
        "image": "https://sitesurelabs.com/media/stills/sitevision-walkthrough2.webp",
        "inLanguage": "en"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://sitesurelabs.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://sitesurelabs.com/blog"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "360° Construction Site Documentation: How It Works",
            "item": "https://sitesurelabs.com/blog/360-degree-construction-documentation"
          }
        ]
      }
    ]
  }
]
```

### A3.5 Statement-by-statement product check

"Consistent" means the statement matches the product page text (`frontend/src/data/products.ts`) as published on the website. **The SEO work could only compare against the website; the product team must verify against the real product.**

| # | Statement in the article | What the product page says | Result |
|---|---|---|---|
| 1 | "labelled points show where to capture, and the panoramas stitch automatically". | Capability "Floor-plan capture": "Labelled points show where to capture. Panoramas stitch automatically." | Consistent |
| 2 | Walkthroughs "with a floor-plan map and a capture timeline". | Capability "Immersive walkthroughs": "...with a floor-plan map and capture timeline." | Consistent |
| 3 | SiteVision "estimates progress per floor, shows its confidence and flags coverage gaps". | Capability "AI progress tracking": "Per-floor estimates with confidence shown and coverage gaps flagged." | Consistent |
| 4 | "AI can look across captures to estimate progress for each room or activity". | FAQ: "AI analyses the captures per room and activity". See highlighted item 2: the product page says both "per-floor" and "per room and activity". | **NEEDS CONFIRMATION** |
| 5 | "...and flag areas that have no recent coverage." | Product says "flags areas without coverage". The article adds the word "recent". | **NEEDS CONFIRMATION** |
| 6 | Drishti "answers questions about progress, quality and completion in plain language". | Capability "Drishti assistant": "Ask about progress, quality and completion in plain language." | Consistent |
| 7 | "progress views can be exported as PDF and Excel". | Capability "Reports": "PDF and Excel exports from the floor progress view." | Consistent |
| 8 | Capture steps: pick the floor and open its plan; walk to the planned points; stitched into a walkthrough in order. | Workflow "Capture / Publish": "Pick a floor, then capture at the labelled points." "Captures stitch into a walkthrough, in order." | Consistent |
| 9 | "Each photo is linked to its point on the plan and to the date." | Value "A record in order: Captures are tied to rooms and dates." "Point on the plan" is an inference from the labelled capture points. Please confirm. | **NEEDS CONFIRMATION** |
| 10 | FAQ: "SiteVision’s workflow expects 360° photos taken at the labelled points on the floor plan. Contact us about supported devices." | FAQ "What do I need to capture? 360° photos taken at the labelled points on the floor plan." Supported devices are not stated anywhere. | Consistent |
| 11 | Uses, capture habits, limits (visible surfaces only, not a replacement for inspection). | General practice. | General advice |

### A3.6 Your corrections for this article

Fill in the table (or reply in chat using the references). Use **OK**, **CHANGE TO ...** or **REMOVE**.

| Reference | Decision | Correction or comment |
|---|---|---|
| | | |
| | | |
| | | |
| | | |
| | | |
| | | |

**Overall decision for 360° Construction Site Documentation: How It Works:**  [ ] Approved as is   [ ] Approved with the corrections above   [ ] Not approved

Reviewer: ______________________   Date: ____________

---

## 4. Summary of your decisions (fill in)

| Article | Decision | Reviewer | Date |
|---|---|---|---|
| A1. Digital Construction Inspection: A Practical Guide | [ ] Approved   [ ] With corrections   [ ] Not approved | | |
| A2. Manual vs AI-Powered Construction Inspections | [ ] Approved   [ ] With corrections   [ ] Not approved | | |
| A3. 360° Construction Site Documentation: How It Works | [ ] Approved   [ ] With corrections   [ ] Not approved | | |

After your decisions: tell me which to approve. I will then apply your corrections, set the approved articles to `review: 'approved'` (only those), re-run the checks, and report. Publishing and deployment still need your separate go-ahead.
