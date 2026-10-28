/**
 * Product content. Single source of truth for the home ecosystem, the project details sheet, the
 * products page and every /products/:slug page. To add a product, append one object here; to change
 * an image, edit `media`; to re-colour a product, edit `accent`.
 *
 * Copy rules: keep it short. `blurb` is one sentence (about 20 words), `highlights` are four labels of
 * one or two words, and every capability, step and answer is one line.
 *
 * VERIFICATION: Anviksha, SiteVision, Digi Reco and Parichay copy is derived from the company's own demo
 * videos (public/media). Progress Tracker has no source material yet and is flagged.
 */

export type ProductStatus = 'demonstrated' | 'planned'

export interface Shot { src: string; alt: string; caption: string }

export interface Product {
  slug: string
  name: string
  status: ProductStatus
  /** false => copy is a placeholder awaiting business confirmation */
  verified: boolean
  index: string
  category: string
  tagline: string
  /** One sentence: what it does. Shown on the home ecosystem and the details sheet. */
  blurb: string
  /** Page lead for the product's own page. */
  summary: string
  /** Four short labels shown as chips on the home ecosystem. */
  highlights: string[]
  accent: string
  audience: string[]
  problem: { title: string; body: string }
  solution: { title: string; body: string }
  /** The first four are the key ones (the details sheet shows those). */
  capabilities: { title: string; body: string }[]
  workflow: { title: string; body: string; shot?: number }[]
  value: { title: string; body: string }[]
  /** CONFIRM per product: deployment/integration facts. null => section hidden. */
  deployment: string[] | null
  media: {
    cover: string
    coverAlt: string
    shots: Shot[]
    demoVideo?: string
    /** CSS object-position used when cropping the cover. */
    focus?: string
    /** indices into `shots`: [primary, secondary] shown on the home ecosystem stage */
    showcase?: [number, number]
  }
  faq: { q: string; a: string }[]
  seo: { title: string; description: string }
  metrics?: { label: string; value: string }[]
}

const still = (n: string) => `/media/stills/${n}.webp`

export const products: Product[] = [
  {
    slug: 'anviksha',
    name: 'Anviksha',
    status: 'demonstrated',
    verified: true,
    index: '01',
    category: 'AI construction inspection',
    tagline: 'See every defect. Fix it faster.',
    blurb: 'Turn site photos into located, rated defect observations and quality reports.',
    summary: 'AI-powered construction quality inspection. Capture a defect, locate it, and get a rated observation and report.',
    highlights: ['Live capture', 'AI insights', 'Severity rating', 'Quality reports'],
    accent: '#f06623',
    audience: ['Site and quality engineers', 'Project managers', 'Contractors'],
    problem: {
      title: 'Defects hide in plain sight',
      body: 'Site observations end up as scattered photos and notes.',
    },
    solution: {
      title: 'Located, rated and explained',
      body: 'Each photo becomes a structured observation, ready for the contractor.',
    },
    capabilities: [
      { title: 'Live inspection capture', body: 'Photograph a defect and pin its tower, floor, flat and room.' },
      { title: 'AI image insights', body: 'Instant summary, key defects, severity and recommended actions.' },
      { title: 'Mark-up and severity', body: 'Annotate the photo. Let AI rate severity, or set it yourself.' },
      { title: 'Quality reports', body: 'Observation reports with photo, location, severity and fix.' },
      { title: 'Room-by-room walks', body: 'Build a collection of observations and submit it in one tap.' },
      { title: 'AI assistant', body: 'Ask questions across inspections and spot defect trends.' },
    ],
    workflow: [
      { title: 'Capture', body: 'Photograph a defect from site.', shot: 5 },
      { title: 'Locate', body: 'Tag tower, floor, flat and room.', shot: 1 },
      { title: 'Analyse', body: 'AI checks the photo, rates severity and drafts the fix.', shot: 2 },
      { title: 'Report', body: 'Export a report for the contractor.', shot: 3 },
    ],
    value: [
      { title: 'Consistent records', body: 'The same structure for every defect.' },
      { title: 'Faster follow-up', body: 'Observations arrive located, rated and explained.' },
      { title: 'Visibility across sites', body: 'Defect patterns become visible.' },
    ],
    deployment: null,
    media: {
      cover: still('anviksha-defects'),
      coverAlt: 'Three photographs of concrete defects with exposed rebar, a crack across a slab and a cold joint circled by the Anviksha vision model.',
      focus: '50% 40%',
      showcase: [0, 3],
      demoVideo: '/media/anviksha-demo.mp4',
      shots: [
        { src: still('anviksha-defects'), alt: 'Defects detected and labelled on concrete photographs', caption: 'Defects located and labelled' },
        { src: still('anviksha-collection'), alt: 'Anviksha inspection screen showing a location details form', caption: 'Location and category on every capture' },
        { src: still('anviksha-analysis'), alt: 'Anviksha vision model card showing a segregation defect with medium severity', caption: 'Vision model: defect, category, severity' },
        { src: still('anviksha-report'), alt: 'Anviksha quality observation report with defect photograph and details table', caption: 'Quality observation report' },
        { src: still('anviksha-chat'), alt: 'Anviksha AI analysis summary listing key defects and evidence', caption: 'AI analysis: summary, defects, significance' },
        { src: still('anviksha-modes'), alt: 'Anviksha inspection mode selection screen', caption: 'Live inspection or AI image insights' },
      ],
    },
    faq: [
      { q: 'What does Anviksha produce?', a: 'A structured observation for each photo, and a quality observation report.' },
      { q: 'Can I set severity myself?', a: 'Yes. Leave it to the AI or set it when you add the observation.' },
      { q: 'Does it work on a phone?', a: 'The capture flow is built for the field. Contact us about devices and site conditions.' },
      { q: 'Can it carry our branding?', a: 'The demo report carries project and company branding. Ask us about yours.' },
    ],
    seo: {
      title: 'Anviksha: AI Construction Quality Inspection',
      description: 'Anviksha by SiteSureLabs turns site photos into located, rated and explained defect observations, with AI image analysis and quality observation reports.',
    },
    metrics: [
      { label: 'Images processed', value: '10,000+' },
      { label: 'Live users', value: '150+' },
      { label: 'Steps, capture to report', value: '4' },
    ],
  },
  {
    slug: 'sitevision',
    name: 'SiteVision',
    status: 'demonstrated',
    verified: true,
    index: '02',
    category: 'Visual intelligence · 360° site capture',
    tagline: 'Capture once. Walk it from anywhere.',
    blurb: 'Capture rooms in 360° against the floor plan, then review progress remotely with AI.',
    summary: 'Construction progress visibility in 360°. Capture against the floor plan, publish walkthroughs, and track progress with AI.',
    highlights: ['Floor-plan capture', '360° walkthroughs', 'AI progress', 'Drishti assistant'],
    accent: '#e8a14a',
    audience: ['Field engineers', 'Project managers', 'Leadership'],
    problem: {
      title: 'Every site changes by the day',
      body: 'Progress hides in scattered photos, and decisions wait for a visit.',
    },
    solution: {
      title: 'Captured and shared in 360°',
      body: 'Capture is tied to the floor plan, so anyone can walk the building remotely.',
    },
    capabilities: [
      { title: 'Floor-plan capture', body: 'Labelled points show where to capture. Panoramas stitch automatically.' },
      { title: 'Immersive walkthroughs', body: 'Walk every room in 360° with a floor-plan map and capture timeline.' },
      { title: 'AI progress tracking', body: 'Per-floor estimates with confidence shown and coverage gaps flagged.' },
      { title: 'Drishti assistant', body: 'Ask about progress, quality and completion in plain language.' },
      { title: 'Reports', body: 'PDF and Excel exports from the floor progress view.' },
    ],
    workflow: [
      { title: 'Capture', body: 'Pick a floor, then capture at the labelled points.', shot: 1 },
      { title: 'Publish', body: 'Captures stitch into a walkthrough, in order.', shot: 0 },
      { title: 'Review', body: 'Walk every room in 360° with the floor plan alongside.', shot: 3 },
      { title: 'Ask', body: 'Ask Drishti how the project is progressing.', shot: 5 },
    ],
    value: [
      { title: 'Remote visibility', body: 'Stakeholders see the site without travelling.' },
      { title: 'A record in order', body: 'Captures are tied to rooms and dates.' },
      { title: 'Faster answers', body: 'Progress questions answered from the data.' },
    ],
    deployment: null,
    media: {
      cover: still('sitevision-walkthrough2'),
      coverAlt: 'SiteVision 360-degree walkthrough of an interior room with a floor plan map overlay.',
      focus: '50% 45%',
      showcase: [3, 4],
      demoVideo: '/media/sitevision-demo.mp4',
      shots: [
        { src: still('sitevision-floorplan'), alt: 'Floor plan with labelled capture points', caption: 'The floor plan becomes the map' },
        { src: still('sitevision-capture'), alt: 'SiteVision New Capture screen to select a project', caption: 'Field capture, project by project' },
        { src: still('sitevision-walkthrough'), alt: 'SiteVision walkthrough viewer with floor plan inset', caption: 'Immersive walkthrough with floor-plan inset' },
        { src: still('sitevision-walkthrough2'), alt: 'SiteVision 360-degree room view with floor plan and capture timeline', caption: 'Walk every room in 360°' },
        { src: still('sitevision-progress'), alt: 'SiteVision floor progress dashboard with AI summary', caption: 'AI progress tracking per floor' },
        { src: still('sitevision-chat'), alt: 'Drishti AI assistant answering a progress question', caption: 'Drishti, the construction intelligence assistant' },
      ],
    },
    faq: [
      { q: 'What do I need to capture?', a: '360° photos taken at the labelled points on the floor plan.' },
      { q: 'How is progress estimated?', a: 'AI analyses the captures per room and activity, shows its confidence, and flags areas without coverage.' },
      { q: 'Who uses it?', a: 'Field engineers capture, managers review, admins set up projects and leadership asks Drishti.' },
    ],
    seo: {
      title: 'SiteVision: 360° Construction Site Capture and AI Progress',
      description: 'SiteVision by SiteSureLabs captures construction sites in 360° against the floor plan, publishes walkable tours and tracks progress with AI and the Drishti assistant.',
    },
    metrics: [
      { label: 'Capture of every room', value: '360°' },
      { label: 'Steps, capture to answer', value: '4' },
      { label: 'Report formats: PDF, Excel', value: '2' },
    ],
  },
  {
    slug: 'digi-reco',
    name: 'Digi Reco',
    status: 'demonstrated',
    verified: true,
    index: '03',
    category: 'Intelligent document & data reconciliation',
    tagline: 'Steel loss, made visible.',
    blurb: 'Turn monthly site workbooks into a reconciled steel abstract, with wastage and exceptions flagged.',
    summary: 'Steel reconciliation for construction. Monthly workbooks become ledgers and an abstract by diameter, with checks and exceptions.',
    highlights: ['Bulk import', 'Steel abstract', 'Cross-checks', 'Portfolio view'],
    accent: '#d9744f',
    audience: ['Stores and procurement', 'Commercial teams', 'Portfolio leadership'],
    problem: {
      title: 'Steel is a top material cost',
      body: 'Yet reconciling it still happens in spreadsheets.',
    },
    solution: {
      title: 'From workbook to portfolio',
      body: 'Ledgers, an abstract by diameter, cross-checks and a review queue.',
    },
    capabilities: [
      { title: 'Bulk workbook import', body: 'Preview first. Nothing reaches a ledger until you commit.' },
      { title: 'Monthly steel abstract', body: 'Stock, issues, wastage and scrap by bar diameter.' },
      { title: 'Cross-checks and exceptions', body: 'Flagged items are approved with a recorded reason and name.' },
      { title: 'Portfolio dashboard', body: 'Wastage against cap, forecast and site health at a glance.' },
      { title: 'GRN and scrap views', body: 'Goods received by supplier, scrap sales by buyer.' },
    ],
    workflow: [
      { title: 'Workbooks', body: 'Drop in the month’s files.', shot: 1 },
      { title: 'Ledgers', body: 'Rows are filed once you review and commit.', shot: 3 },
      { title: 'Abstract', body: 'Calculated by diameter, then cross-checked.', shot: 0 },
      { title: 'Portfolio', body: 'Results roll up to a company-wide view.', shot: 4 },
    ],
    value: [
      { title: 'Wastage you can see', body: 'Loss against plan, per site and month.' },
      { title: 'Decisions on record', body: 'Every approval carries a reason and a name.' },
      { title: 'One view across sites', body: 'Leadership sees portfolio wastage.' },
    ],
    deployment: null,
    media: {
      cover: still('digireco-abstract'),
      coverAlt: 'Digi Reco monthly steel abstract table with cross-check warnings and wastage summary.',
      focus: '50% 20%',
      showcase: [0, 4],
      demoVideo: '/media/digireco-demo.mp4',
      shots: [
        { src: still('digireco-abstract'), alt: 'Monthly steel abstract with cross-check warnings', caption: 'Monthly steel abstract' },
        { src: still('digireco-bulk'), alt: 'Bulk import preview showing rows ready to commit', caption: 'Bulk import, reviewed before commit' },
        { src: still('digireco-exceptions'), alt: 'Exceptions queue listing flagged items', caption: 'Exceptions queue' },
        { src: still('digireco-grn'), alt: 'GRN view listing goods received by supplier', caption: 'Goods received by supplier' },
        { src: still('digireco-dashboard'), alt: 'Admin dashboard with portfolio wastage grade and site map', caption: 'Portfolio dashboard' },
        { src: still('digireco-sites'), alt: 'Digi Reco site cards with health ratings', caption: 'Site health at a glance' },
      ],
    },
    faq: [
      { q: 'What input does it expect?', a: 'The monthly site workbooks you already keep, previewed before anything is committed.' },
      { q: 'What happens when a check fails?', a: 'The item joins the exceptions queue for correction, or approval with a recorded reason.' },
      { q: 'Is the demo data real?', a: 'No. Figures in our demonstration are demo data, not performance results.' },
    ],
    seo: {
      title: 'Digi Reco: Steel Reconciliation for Construction',
      description: 'Digi Reco by SiteSureLabs turns monthly site workbooks into ledgers and a steel abstract by diameter, with cross-checks, exceptions and a portfolio wastage dashboard.',
    },
    metrics: [
      { label: 'Rows filed before you commit', value: '0' },
      { label: 'Steps, workbook to portfolio', value: '4' },
      { label: 'Extra views: GRN and scrap', value: '2' },
    ],
  },
  {
    slug: 'parichay',
    name: 'Parichay',
    status: 'demonstrated',
    verified: true,
    index: '04',
    category: 'Worker registration & entry passes',
    tagline: 'Know who’s on site.',
    blurb: 'Register every worker at the gate and print their entry pass, with duplicates flagged before a second card is issued.',
    summary: 'Worker registration and entry passes for construction sites. Operators register at the gate, passes print in batches and administrators see every site on one dashboard.',
    highlights: ['Gate registration', 'Duplicate check', 'Batch printing', 'Admin dashboard'],
    accent: '#cfae72',
    audience: ['Site security operators', 'Site administrators'],
    problem: {
      title: 'Hundreds walk through the gate',
      body: 'Every one needs a pass, and someone has to know exactly who is inside.',
    },
    solution: {
      title: 'Registered once, passed at the gate',
      body: 'A checked three-step form, a photo on the spot and a printed pass.',
    },
    capabilities: [
      { title: 'Three-step registration', body: 'Personal, work and photo, with every field checked before you move on.' },
      { title: 'Duplicate check', body: 'Aadhaar and phone number are checked across sites before a second card is issued.' },
      { title: 'Entry pass', body: 'Photo, contractor, labour-camp badge, site watermark and supervisor contact.' },
      { title: 'Batch printing', body: 'Nine passes print together on one A4 sheet.' },
      { title: 'Admin dashboard', body: 'Passes by site, contractor, role, age, state and district, with records and Excel export.' },
      { title: 'Site-scoped access', body: 'Operators and site admins reach only their own site, and records stay visible for as long as you choose.' },
    ],
    workflow: [
      { title: 'Register', body: 'Personal and work details, checked as you go.', shot: 0 },
      { title: 'Check', body: 'Duplicates are flagged before a second card is issued.', shot: 2 },
      { title: 'Issue', body: 'A pass with photo, site watermark and supervisor contact.', shot: 3 },
      { title: 'Print', body: 'Passes print nine to an A4 sheet.', shot: 4 },
    ],
    value: [
      { title: 'One worker, one pass', body: 'Duplicates are flagged before a second card is issued.' },
      { title: 'Every site in view', body: 'Administrators see passes by site, contractor and role.' },
      { title: 'Data stays in its place', body: 'Access is scoped to the site, and retention is your choice.' },
    ],
    deployment: null,
    media: {
      cover: still('parichay-title'),
      coverAlt: 'Parichay by SiteSureLabs: worker registration and entry passes.',
      focus: '50% 50%',
      showcase: [3, 5],
      demoVideo: '/media/parichay-demo.mp4',
      shots: [
        { src: still('parichay-register'), alt: 'Parichay registration form with personal details and the batch queue of passes beside it', caption: 'Three-step registration' },
        { src: still('parichay-photo'), alt: 'Parichay photo capture step, with the worker’s photo taken at the gate', caption: 'Photo taken at the gate' },
        { src: still('parichay-duplicate'), alt: 'Parichay warning that the worker is already registered at another site', caption: 'Duplicates flagged across sites' },
        { src: still('parichay-pass'), alt: 'Parichay pass preview with contractor, labour-camp badge, photo and site watermark', caption: 'The entry pass' },
        { src: still('parichay-batch'), alt: 'Parichay nine passes laid out on one A4 sheet', caption: 'Nine passes, one A4 sheet' },
        { src: still('parichay-dashboard'), alt: 'Parichay admin dashboard with passes by designation, age group, state and district', caption: 'Admin dashboard' },
      ],
    },
    faq: [
      { q: 'Who uses it?', a: 'Site security operators register workers and site administrators manage records. Each sees only their own site.' },
      { q: 'What happens with a duplicate?', a: 'The operator is shown where the worker is already registered and can cancel or continue.' },
      { q: 'What does the pass carry?', a: 'The worker’s photo, contractor, labour-camp badge, a site watermark and the supervisor’s contact.' },
    ],
    seo: {
      title: 'Parichay: Worker Registration and Entry Passes for Construction Sites',
      description: 'Parichay by SiteSureLabs registers workers at the site gate, flags duplicates across sites, prints entry passes in batches and gives administrators a dashboard of every site.',
    },
    metrics: [
      { label: 'Passes on one A4 sheet', value: '9' },
      { label: 'Registration steps', value: '3' },
      { label: 'Cards per worker', value: '1' },
    ],
  },
  {
    slug: 'progress-tracker',
    name: 'Progress Tracker',
    status: 'planned',
    verified: false,
    index: '05',
    category: 'Milestone monitoring · In development',
    tagline: 'Milestones, visible before they slip.',
    // CONFIRM: Progress Tracker has no source material yet. Scope, capabilities and visuals await business confirmation.
    blurb: 'Milestone monitoring, progress visibility and automated alerts. Details to be confirmed.',
    summary: 'Milestone monitoring, progress visibility and automated alerts. Scope is being finalised.',
    highlights: ['Milestones', 'Progress', 'Alerts'],
    accent: '#9aa6a0',
    audience: ['Project managers', 'Programme leads'],
    problem: { title: 'Slippage is noticed late', body: 'To be confirmed.' },
    solution: { title: 'Progress visibility with alerts', body: 'To be confirmed.' },
    capabilities: [
      { title: 'Milestone monitoring', body: 'To be confirmed.' },
      { title: 'Progress visibility', body: 'To be confirmed.' },
      { title: 'Automated alerts', body: 'To be confirmed.' },
    ],
    workflow: [
      { title: 'Define', body: 'To be confirmed.' },
      { title: 'Monitor', body: 'To be confirmed.' },
      { title: 'Alert', body: 'To be confirmed.' },
    ],
    value: [{ title: 'To be confirmed', body: 'Added once the scope is verified.' }],
    deployment: null,
    media: {
      cover: '',
      coverAlt: 'Concept illustration of a project milestone timeline.',
      shots: [],
    },
    faq: [{ q: 'When will Progress Tracker be available?', a: 'Timing has not been confirmed. Contact us to register interest.' }],
    seo: {
      title: 'Progress Tracker: Milestone Monitoring (In Development)',
      description: 'Progress Tracker by SiteSureLabs is in development: project milestone monitoring, progress visibility and automated alerts.',
    },
  },
]

export const getProduct = (slug: string) => products.find((p) => p.slug === slug)
export const liveProducts = products.filter((p) => p.status === 'demonstrated')
