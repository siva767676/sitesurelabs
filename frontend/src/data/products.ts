/**
 * Product content. Single source of truth for the showcase, the products page and
 * every /products/:slug page. To add a product, append one object here; to change an
 * image, edit `media`; to re-colour a product, edit `accent`.
 *
 * VERIFICATION: Anviksha, SiteVision and Digi Reco copy is derived from the company's own
 * demo videos (public/media). Progress Tracker has no source material yet and is flagged.
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
  summary: string
  accent: string
  audience: string[]
  problem: { title: string; body: string }
  solution: { title: string; body: string }
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
    loopVideo?: string
    /** CSS object-position used when cropping the cover. */
    focus?: string
    /** indices into `shots`: [primary, secondary] used by the home showcase stage */
    showcase?: [number, number]
  }
  faq: { q: string; a: string }[]
  seo: { title: string; description: string }
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
    summary:
      'Capture a defect on site, locate it by tower, floor, flat and room, and let the Anviksha vision model identify it, rate its severity and draft the observation, then export a clean quality report.',
    accent: '#ff6b5e',
    audience: ['Quality and site engineers', 'Project and construction managers', 'Developers and contractors'],
    problem: {
      title: 'Defects hide in plain sight',
      body: 'On a busy site, quality observations end up as scattered photos and ad-hoc notes. Locating, rating and explaining each defect consistently takes time, and the follow-up depends on how well it was written down.',
    },
    solution: {
      title: 'Every defect located, rated and explained',
      body: 'Anviksha turns a photograph into a structured observation: where it is, what it is, how severe it is and what to do next. The record is ready for the contractor without retyping.',
    },
    capabilities: [
      { title: 'Live inspection capture', body: 'Photograph or upload a defect from site, then pin its exact location: project, tower, floor, flat and room.' },
      { title: 'AI image insights', body: 'Drop any photo into AI Analysis for an instant expert-style read: summary, key defects, evidence, significance and prioritised actions.' },
      { title: 'Severity, decided for you', body: 'Let the AI rate severity or set it yourself. Each observation carries a category, defect type and rating.' },
      { title: 'Mark-up that carries through', body: 'Annotate the defect directly on the photo. The mark travels into the final report.' },
      { title: 'Walk room by room', body: 'Build a collection of observations as you move through the building and submit the whole walk in one tap.' },
      { title: 'Quality observation reports', body: 'Branded reports with the photo, location, category, severity, observation and recommended action.' },
      { title: 'AI assistant', body: 'Ask questions across your inspections and surface defect trends across sites.' },
    ],
    workflow: [
      { title: 'Capture', body: 'Take or upload a photo from the field, without leaving the site.', shot: 5 },
      { title: 'Locate', body: 'Tag tower, floor, flat and room so every observation has an address.', shot: 1 },
      { title: 'Analyse', body: 'The vision model checks relevance, analyses the defect, rates severity and writes the observation and fix.', shot: 2 },
      { title: 'Report', body: 'Export a quality observation report that is ready for the contractor.', shot: 3 },
    ],
    value: [
      { title: 'Consistent records', body: 'The same structure for every defect, whoever captured it.' },
      { title: 'Faster follow-up', body: 'Observations arrive located, rated and explained, so teams can act on them sooner.' },
      { title: 'Visibility across sites', body: 'Defect patterns become visible instead of living in individual photo folders.' },
    ],
    deployment: null,
    media: {
      cover: still('anviksha-defects'),
      coverAlt: 'Three photographs of concrete defects with exposed rebar, a crack across a slab and a cold joint circled by the Anviksha vision model.',
      focus: '50% 40%',
      showcase: [0, 3],
      demoVideo: '/media/anviksha-demo.mp4',
      loopVideo: '/media/anviksha-loop.mp4',
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
      { q: 'What does Anviksha produce?', a: 'For each photo it produces a structured observation (location, category, defect, severity, observation and recommended action) and can compile them into a quality observation report.' },
      { q: 'Can I choose the severity myself?', a: 'Yes. Severity can be left to the AI or set manually when you add an observation to the collection.' },
      { q: 'Does it work from a phone on site?', a: 'The capture flow is designed for use in the field. Please contact us to discuss supported devices and your site conditions.' },
      { q: 'Can it be branded for our company?', a: 'The report in the demo carries the project and company branding. Contact us to discuss branding for your deployment.' },
    ],
    seo: {
      title: 'Anviksha: AI Construction Quality Inspection',
      description: 'Anviksha by SiteSureLabs turns site photos into located, rated and explained defect observations, with AI image analysis and quality observation reports.',
    },
  },
  {
    slug: 'sitevision',
    name: 'SiteVision',
    status: 'demonstrated',
    verified: true,
    index: '02',
    category: 'Visual intelligence · 360° site capture',
    tagline: 'Capture once. Walk it from anywhere.',
    summary:
      'Field engineers capture rooms against the floor plan, SiteVision stitches them into walkable 360° tours, and managers and leadership review progress remotely with AI progress estimates and a built-in assistant.',
    accent: '#58d5ff',
    audience: ['Field engineers', 'Project managers', 'Admins', 'Leadership and stakeholders'],
    problem: {
      title: 'Every site changes by the day',
      body: 'Progress hides in scattered photos, and decisions wait until someone can visit. Stakeholders who are not on site rely on second-hand updates.',
    },
    solution: {
      title: 'Your entire site, captured and shared in 360°',
      body: 'Capture is anchored to the floor plan, so every photo has a place. Tours are published in walkthrough order, and anyone with access can walk the building remotely and see what changed.',
    },
    capabilities: [
      { title: 'Floor-plan capture points', body: 'Labelled points on the floor plan tell the field engineer exactly where to capture. Tap a point to upload.' },
      { title: 'Auto-stitched panoramas', body: 'Uploaded captures are stitched into a 360° panorama automatically; the pin turns green once the capture is in.' },
      { title: 'Published walkthroughs', body: 'Generate and publish a tour in walkthrough order for the floor.' },
      { title: 'Immersive remote review', body: 'Walk every room in 360° with a floor-plan map and a capture timeline.' },
      { title: 'AI progress tracking', body: 'Per-floor progress estimates room by room and activity by activity, with the analysis confidence shown and coverage gaps called out.' },
      { title: 'Reports', body: 'PDF and Excel report exports from the floor progress view.' },
      { title: 'Drishti, the AI assistant', body: 'Ask about project progress, finishing status, quality, captures and completion outlook in plain language.' },
    ],
    workflow: [
      { title: 'Capture', body: 'A field engineer picks the project, tower and floor, then captures at labelled points.', shot: 1 },
      { title: 'Publish', body: 'Captures stitch into panoramas and publish as a walkthrough in order.', shot: 0 },
      { title: 'Review', body: 'Managers walk every room in immersive 360° with the floor plan alongside.', shot: 3 },
      { title: 'Ask', body: 'Leadership asks Drishti how the project is progressing and gets an answer grounded in the captures.', shot: 5 },
    ],
    value: [
      { title: 'Remote visibility', body: 'Stakeholders see the site without travelling to it.' },
      { title: 'A record that stays in order', body: 'Captures are tied to rooms and dates, so change over time is visible.' },
      { title: 'Faster answers', body: 'Progress questions are answered from the data instead of a status meeting.' },
    ],
    deployment: null,
    media: {
      cover: still('sitevision-walkthrough2'),
      coverAlt: 'SiteVision 360-degree walkthrough of an interior room with a floor plan map overlay.',
      focus: '50% 45%',
      showcase: [3, 4],
      demoVideo: '/media/sitevision-demo.mp4',
      loopVideo: '/media/sitevision-loop.mp4',
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
      { q: 'What do I need to capture?', a: '360° photographs taken at the labelled capture points on the floor plan. Contact us to discuss capture equipment for your project.' },
      { q: 'How is progress estimated?', a: 'SiteVision analyses the captured images and estimates progress per floor, room and activity. It shows the confidence of the analysis and flags areas without photo coverage rather than guessing.' },
      { q: 'Who uses it?', a: 'Field engineers capture, managers review, admins configure projects, and leadership can ask Drishti questions.' },
    ],
    seo: {
      title: 'SiteVision: 360° Construction Site Capture and AI Progress',
      description: 'SiteVision by SiteSureLabs captures construction sites in 360° against the floor plan, publishes walkable tours and tracks progress with AI and the Drishti assistant.',
    },
  },
  {
    slug: 'digi-reco',
    name: 'Digi Reco',
    status: 'demonstrated',
    verified: true,
    index: '03',
    category: 'Intelligent document & data reconciliation',
    tagline: 'Steel loss, made visible.',
    summary:
      'Steel reconciliation for construction. Digi Reco turns a month of site workbooks into structured ledgers and a steel abstract by diameter, cross-checks it against plan and flags wastage and exceptions for review.',
    accent: '#e5484d',
    audience: ['Stores and procurement teams', 'Quantity surveying and commercial teams', 'Portfolio and operations leadership'],
    problem: {
      title: 'Steel is one of the largest material costs on any project',
      body: 'Reconciling it still happens in spreadsheets: scattered monthly workbooks, manual cross-checks and exceptions that surface late.',
    },
    solution: {
      title: 'From workbook to portfolio',
      body: 'Drop in the month’s workbooks and Digi Reco files every row into ledgers, builds the abstract by diameter, runs the cross-checks and queues anything that needs a human decision.',
    },
    capabilities: [
      { title: 'Bulk workbook import', body: 'Drop the month’s workbooks. A preview shows rows ready to commit, rows already present and rows needing attention; nothing reaches a ledger until you commit.' },
      { title: 'Monthly steel abstract', body: 'Stock position by bar diameter: received, transferred, issued, consumption, work in progress, physical stock, wastage and scrap.' },
      { title: 'Automatic cross-checks', body: 'Checks such as consumption plus WIP against the BBS (bar bending schedule) plan, and scrap sold against scrap generated, with tolerances.' },
      { title: 'Exceptions queue', body: 'Flagged items in one place. Approve as-is with a recorded reason and the name of the decider, leaving an audit trail.' },
      { title: 'GRN and scrap-sales views', body: 'Goods received by supplier and scrap sales by buyer, at a glance.' },
      { title: 'Portfolio dashboard', body: 'A company-wide view of wastage against cap, forecast, site health ratings and a site map.' },
    ],
    workflow: [
      { title: 'Workbooks', body: 'The month’s files go in as they are, reviewed before anything is committed.', shot: 1 },
      { title: 'Ledgers', body: 'Every row is filed into a ledger after you review and commit.', shot: 3 },
      { title: 'Abstract', body: 'The steel abstract is calculated by diameter and cross-checked.', shot: 0 },
      { title: 'Portfolio', body: 'Exceptions are resolved and site results roll up to a company view.', shot: 4 },
    ],
    value: [
      { title: 'Wastage you can see', body: 'Loss against plan is surfaced per site and per month instead of being buried in a workbook.' },
      { title: 'Decisions on the record', body: 'Every approval carries a reason and a name.' },
      { title: 'One view across sites', body: 'Leadership sees portfolio wastage and the sites driving it.' },
    ],
    deployment: null,
    media: {
      cover: still('digireco-abstract'),
      coverAlt: 'Digi Reco monthly steel abstract table with cross-check warnings and wastage summary.',
      focus: '50% 20%',
      showcase: [0, 4],
      demoVideo: '/media/digireco-demo.mp4',
      loopVideo: '/media/digireco-loop.mp4',
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
      { q: 'What input does Digi Reco expect?', a: 'The monthly site workbooks you already maintain. A preview shows what will be committed before anything is written to a ledger.' },
      { q: 'What happens when a check fails?', a: 'The item appears in the exceptions queue. A reviewer can correct it or approve it as-is with a written reason and their name.' },
      { q: 'Is the demo data real?', a: 'The numbers shown in our demonstration are demo data and are not performance results.' },
    ],
    seo: {
      title: 'Digi Reco: Steel Reconciliation for Construction',
      description: 'Digi Reco by SiteSureLabs turns monthly site workbooks into ledgers and a steel abstract by diameter, with cross-checks, exceptions and a portfolio wastage dashboard.',
    },
  },
  {
    slug: 'progress-tracker',
    name: 'Progress Tracker',
    status: 'planned',
    verified: false,
    index: '04',
    category: 'Milestone monitoring · In development',
    tagline: 'Milestones, visible before they slip.',
    summary:
      'Project milestone monitoring, progress visibility and automated alerts. Product scope is being finalised; details will be published once confirmed.',
    accent: '#8fe388',
    audience: ['Project managers', 'Programme and portfolio leads'],
    // CONFIRM: all Progress Tracker content below is placeholder copy awaiting business confirmation.
    problem: {
      title: 'Slippage is usually noticed late',
      body: 'Placeholder: to be confirmed. This product addresses milestone monitoring and progress visibility.',
    },
    solution: {
      title: 'Progress visibility with automated alerts',
      body: 'Placeholder: to be confirmed. Scope and capabilities will be added after verification.',
    },
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
    value: [{ title: 'To be confirmed', body: 'Value statements will be added once the scope is verified.' }],
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
