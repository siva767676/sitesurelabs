/**
 * Blog articles. Rules for this file (see docs/CONTENT_SEO_STRATEGY.md):
 *  - every statement about a SiteSureLabs product must be true of the product as described in data/products.ts;
 *  - no statistics, customer examples, research findings or credentials unless the source is cited in the article;
 *  - the author is the organisation, never an invented person.
 * `published` / `modified` are real dates (YYYY-MM-DD). Bump `modified` only for a substantive change.
 */

export type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] }

export interface Article {
  slug: string
  /**
   * Subject-matter review gate. 'pending' = drafted and fact-checked against data/products.ts by the SEO work, but NOT yet
   * approved by the relevant product team. Set to 'approved' only after that team has signed off in writing.
   * `npm run build` warns about pending articles; `SEO_REQUIRE_REVIEWED=1 npm run build` fails on them (use it in the
   * deploy pipeline).
   */
  review: 'pending' | 'approved'
  /** The page H1. */
  title: string
  /** <title> text (the brand is appended). */
  seoTitle: string
  description: string
  category: string
  published: string
  modified?: string
  /** Direct answer shown first, and used as the standfirst. */
  answer: string
  body: Block[]
  faq: { q: string; a: string }[]
  /** Product slugs this article links to. */
  products: string[]
  /** Other article slugs. */
  related: string[]
}

export const articles: Article[] = [
  {
    slug: 'digital-construction-inspection-guide',
    review: 'approved', // approved by the owner 2026-11-04; Anviksha team to confirm product statements
    title: 'Digital Construction Inspection: A Practical Guide',
    seoTitle: 'Digital Construction Inspection: A Practical Guide',
    description: 'What digital construction inspection is, how a site inspection runs from capture to closure, what to look for in software, and where AI helps and where it does not.',
    category: 'Construction inspection',
    published: '2026-11-04',
    answer: 'Digital construction inspection means recording site observations (what was found, where, how serious, and who must act) as structured digital records, usually with a photo and a location, instead of paper forms and scattered messages. The aim is a consistent, searchable record that can be followed through to closure.',
    body: [
      { type: 'h2', text: 'Why paper and chat-based inspection breaks down' },
      { type: 'p', text: 'Observations that live in notebooks, phone galleries and chat threads are hard to compare and hard to close out. The problems are general ones that most project teams will recognise:' },
      { type: 'ul', items: [
        'Photos without a clear location: which tower, floor or room was this?',
        'Different people describe the same kind of defect in different words, so records cannot be compared.',
        'No single view of what is open, who owns it and when it was closed.',
        'Reports are assembled by hand after the visit, so they arrive late.',
      ] },
      { type: 'h2', text: 'The inspection workflow, step by step' },
      { type: 'ol', items: [
        'Define what you inspect against: drawings, specifications and the checklists agreed with the contractor.',
        'Capture on site: photograph the issue and record exactly where it is (tower, floor, flat, room).',
        'Classify it: type of defect and a severity rating, using a scale the whole team has agreed in advance.',
        'Assign it: an owner and a target date.',
        'Verify closure: re-inspect and record the fix with a new photo.',
        'Report: summarise open and closed observations for the project team and the contractor.',
      ] },
      { type: 'h2', text: 'What to look for in inspection software' },
      { type: 'ul', items: [
        'Location tied to the building structure or the floor plan, not typed as free text.',
        'Consistent defect categories and a single severity scale.',
        'Photos that can be annotated, so the exact spot is clear.',
        'Reports in a standard format that can be sent to the contractor.',
        'A record of who captured what, and when.',
        'Devices and connectivity that match site conditions. Confirm this before rolling out to a whole team.',
      ] },
      { type: 'h2', text: 'Where AI helps, and where it does not' },
      { type: 'p', text: 'AI image analysis can propose what a photo shows: a defect type, a suggested severity and a draft remedial action. That saves the time of writing every observation from scratch and makes the wording more consistent. It is a suggestion. A qualified person reviews it and can change it.' },
      { type: 'p', text: 'There are clear limits. A photo cannot show strength, depth or anything that needs testing or measurement. Poor lighting, angle or focus reduces what can be seen. Work behind finishes is not visible at all. For these, inspection and testing by a qualified engineer remain essential.' },
      { type: 'h2', text: 'How Anviksha approaches it' },
      { type: 'p', text: 'Anviksha is SiteSureLabs’ construction quality inspection product. A user photographs a defect and pins its tower, floor, flat and room. AI image insights summarise the key defects and suggest a severity and a recommended action; the user can accept the AI rating or set the severity themselves. Observations are compiled into quality observation reports with the photo, location, severity and fix, ready to send to the contractor.' },
      { type: 'h2', text: 'Starting with a small pilot' },
      { type: 'ul', items: [
        'Choose one tower or floor rather than the whole project.',
        'Agree the defect categories and the severity scale before the first capture.',
        'Run the pilot alongside your current process for a short period.',
        'Compare the two sets of records for completeness, consistency and time taken, then decide.',
      ] },
    ],
    faq: [
      { q: 'What is digital construction inspection?', a: 'Recording site observations as structured digital records, with a photo and a precise location, so that they can be rated, assigned, tracked to closure and reported consistently.' },
      { q: 'Does digital inspection replace site engineers?', a: 'No. Software structures and speeds up the record. Judgement, measurement, testing and sign-off stay with qualified people.' },
      { q: 'What should every inspection record contain?', a: 'What was observed, where it is, a severity rating, photo evidence, who is responsible, a target date, and the status, including evidence when it is closed.' },
      { q: 'Can AI find every defect in a photo?', a: 'No. It can suggest defects that are visible in the image. Anything that is hidden, or that needs measurement or testing, still has to be checked by a person.' },
    ],
    products: ['anviksha'],
    related: ['manual-vs-ai-construction-inspection', '360-degree-construction-documentation'],
  },
  {
    slug: 'manual-vs-ai-construction-inspection',
    review: 'approved', // approved by the owner 2026-11-04; Anviksha team to confirm product statements
    title: 'Manual vs AI-Powered Construction Inspections',
    seoTitle: 'Manual vs AI-Powered Construction Inspections',
    description: 'A practical comparison of manual and AI-assisted construction inspections: what changes in speed, consistency and records, what does not change, and how to combine both.',
    category: 'Construction quality management',
    published: '2026-11-04',
    answer: 'AI-assisted inspection does not remove the inspector. It changes how an observation is recorded: the photo is analysed to suggest a defect type, a severity and an action, and the inspector confirms or corrects it. Manual inspection stays essential for judgement, measurement and anything that cannot be seen in a photo.',
    body: [
      { type: 'h2', text: 'What stays the same' },
      { type: 'ul', items: [
        'Responsibility for the inspection stays with a qualified person.',
        'Work is still checked against the drawings and specifications.',
        'Physical tests and measurements are still done on site.',
        'The contractor still has to acknowledge and close each item.',
      ] },
      { type: 'h2', text: 'What changes' },
      { type: 'table', head: ['Aspect', 'Manual inspection', 'AI-assisted inspection'], rows: [
        ['Writing the observation', 'The inspector writes the description from scratch', 'AI drafts a defect summary, a suggested severity and an action; the inspector reviews it'],
        ['Consistency', 'Wording and severity vary between inspectors', 'Every observation has the same structure and categories; differences in judgement can still exist'],
        ['Location', 'Often noted as free text', 'Recorded in structured fields such as tower, floor, flat and room'],
        ['Reporting', 'Compiled by hand after the visit', 'Generated from the recorded observations'],
        ['Search and trends', 'Hard across paper and photo galleries', 'Observations can be filtered and compared across inspections'],
        ['Main risk', 'Missed or vaguely described items under time pressure', 'Over-reliance on suggestions, poor photos, and wrong suggestions that go unchecked'],
      ] },
      { type: 'h2', text: 'When manual inspection should lead' },
      { type: 'ul', items: [
        'Any structural concern.',
        'Anything that needs measurement or testing rather than a visual check.',
        'Work that is hidden or about to be covered.',
        'Disputed items where a person has to decide.',
      ] },
      { type: 'h2', text: 'A hybrid approach' },
      { type: 'ol', items: [
        'Agree the defect categories and the severity scale first.',
        'Capture each photo with its precise location.',
        'Let the AI propose the defect type, severity and action.',
        'Have the inspector confirm or edit every suggestion.',
        'Track each item to closure.',
        'Periodically compare a sample of AI suggestions with the inspectors’ final decisions, to learn where the tool is weak on your site.',
      ] },
      { type: 'h2', text: 'Questions to ask any vendor' },
      { type: 'ul', items: [
        'Can I override every AI suggestion, and is the original suggestion kept?',
        'How is location captured, and does it follow the structure of our building?',
        'What does the report look like, and can it carry our project branding?',
        'How can we evaluate accuracy on our own site photos before committing?',
      ] },
      { type: 'p', text: 'These apply to SiteSureLabs too. Anviksha lets the user set severity themselves or accept the AI rating, and produces quality observation reports with the photo, location, severity and fix. If you want to see how it behaves on your own photos, ask us for a demonstration.' },
    ],
    faq: [
      { q: 'Is AI inspection more accurate than manual inspection?', a: 'There is no general answer. Accuracy depends on the model, the quality of the photos and the type of defect. Evaluate any tool on your own site photos, with an engineer reviewing the results.' },
      { q: 'Will AI replace quality engineers?', a: 'No. AI can draft and structure observations. Qualified people remain responsible for judging, measuring, testing and signing off.' },
      { q: 'What kinds of defects can a photo show?', a: 'Visible issues such as cracks, exposed reinforcement or surface segregation. A photo cannot show strength, internal condition or work hidden behind finishes.' },
    ],
    products: ['anviksha'],
    related: ['digital-construction-inspection-guide', '360-degree-construction-documentation'],
  },
  {
    slug: '360-degree-construction-documentation',
    review: 'approved', // approved by the owner 2026-11-04; SiteVision team to confirm product statements
    title: '360° Construction Site Documentation: How It Works',
    seoTitle: '360° Construction Site Documentation: How It Works',
    description: 'How 360 degree construction site documentation works: capturing against floor plans, building walkthroughs, tracking progress over time, and the limits of what images can show.',
    category: '360 degree documentation',
    published: '2026-11-04',
    answer: '360-degree construction documentation records a site as panoramic photos taken at planned points, usually mapped to the floor plan, so people can look around each room remotely and compare it with earlier captures. It records what is visible on the day of capture and complements, rather than replaces, inspection.',
    body: [
      { type: 'h2', text: 'How capture works' },
      { type: 'ol', items: [
        'Pick the floor and open its plan.',
        'Walk to the planned capture points and take a 360° photo at each.',
        'Each photo is linked to its point on the plan and to the date.',
        'The photos are stitched and organised, in order, into a walkthrough.',
        'Repeat on a regular schedule, so the same places can be compared over time.',
      ] },
      { type: 'h2', text: 'What teams use it for' },
      { type: 'ul', items: [
        'Remote progress review by people who cannot visit the site.',
        'A dated visual record of rooms, for example before finishes cover services.',
        'Comparing the same location on different dates.',
        'Sharing context with consultants and clients without a site visit.',
      ] },
      { type: 'h2', text: 'Capture habits that make the record useful' },
      { type: 'ul', items: [
        'Use the same route and the same points each time.',
        'Name floors and rooms consistently.',
        'Avoid shooting straight into bright windows where you can.',
        'Capture before services and finishes cover the work you may need to see later.',
        'Keep a regular cadence tied to project milestones and review meetings.',
      ] },
      { type: 'h2', text: 'Where AI fits' },
      { type: 'p', text: 'AI can look across captures to estimate progress for each room or activity, and flag areas that have no recent coverage. Treat an estimate as an aid to review, not as a measured quantity. A good tool shows how confident the estimate is, so people know when to look more closely.' },
      { type: 'h2', text: 'The limits' },
      { type: 'ul', items: [
        'Images show visible surfaces only. Work inside walls or slabs is not shown unless it was captured before it was covered.',
        'Image quality, lighting and coverage decide how much can be seen.',
        '360° documentation does not replace inspection, measurement or testing.',
      ] },
      { type: 'h2', text: 'How SiteVision approaches it' },
      { type: 'p', text: 'SiteVision captures rooms in 360° against the floor plan: labelled points show where to capture, and the panoramas stitch automatically. Captures are published as walkthroughs with a floor-plan map and a capture timeline. It estimates progress per floor, shows its confidence and flags coverage gaps. Its assistant, Drishti, answers questions about progress, quality and completion in plain language, and progress views can be exported as PDF and Excel.' },
    ],
    faq: [
      { q: 'What is 360 degree construction documentation?', a: 'A record of the site as panoramic photos taken at planned points, usually mapped to the floor plan, so each room can be viewed remotely and compared across dates.' },
      { q: 'What do I need to capture a site?', a: 'A way to take 360° photos. SiteVision’s workflow expects 360° photos taken at the labelled points on the floor plan. Contact us about supported devices.' },
      { q: 'How often should a site be captured?', a: 'There is no universal rule. Choose a cadence that follows your milestones and review meetings, and keep it consistent so captures can be compared.' },
      { q: 'Can 360° documentation replace site visits?', a: 'No. It shows what is visible on the capture date. Inspection, measurement and testing still need people on site.' },
    ],
    products: ['site-vision'],
    related: ['digital-construction-inspection-guide', 'manual-vs-ai-construction-inspection'],
  },
]

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug)

/** Only approved articles are public: linked, indexed, in the sitemap and in llms.txt. Pending ones are drafts. */
export const isPublished = (a: Article) => a.review === 'approved'
export const publishedArticles = () => articles.filter(isPublished)

/** Rough reading time at ~200 words per minute, from the actual text. */
export function readingMinutes(a: Article): number {
  const words = [
    a.answer,
    ...a.body.flatMap((b) => (b.type === 'ul' || b.type === 'ol' ? b.items : b.type === 'table' ? [...b.head, ...b.rows.flat()] : [b.text])),
    ...a.faq.flatMap((f) => [f.q, f.a]),
  ].join(' ').split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}
