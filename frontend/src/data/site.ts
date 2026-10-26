/** Company-level content. Anything marked CONFIRM must be verified by the business before launch. */

export const site = {
  name: 'SiteSureLabs',
  url: 'https://sitesurelabs.com',
  tagline: 'Intelligence engineered for the real world.',
  description:
    'SiteSureLabs builds AI-powered products and intelligent systems for enterprises: computer vision, document intelligence, LLM applications and workflow automation.',
  // CONFIRM: real contact mailbox. Placeholder until the domain mailbox exists.
  email: 'hello@sitesurelabs.com',
  // CONFIRM: registered address / city. Intentionally omitted until provided.
  address: null as string | null,
  // CONFIRM: social profile URLs. Left empty so no dead links are rendered.
  social: [] as { label: string; href: string }[],
}

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const

export const legalNav = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Use', to: '/terms' },
] as const

/** Engagement process (Services page): a label and one short line per step. */
export const process = [
  { n: '01', title: 'Frame', body: 'Start from the problem, not the model.' },
  { n: '02', title: 'Prototype', body: 'A working proof on your real data.' },
  { n: '03', title: 'Build', body: 'Production code, integrations and evaluation.' },
  { n: '04', title: 'Deploy', body: 'Containerised, observable and handed over.' },
  { n: '05', title: 'Evolve', body: 'Measure usage, then tune and extend.' },
]

/** CONFIRM: wording needs founder sign-off. One short line each. */
export const principles = [
  { title: 'Product-first', body: 'We run our own products before advising on yours.' },
  { title: 'Practical AI', body: 'The simplest approach that solves the problem.' },
  { title: 'Built for operators', body: 'Designed for people on site, not for demos.' },
  { title: 'End-to-end', body: 'Models, backend, interface and deployment together.' },
]
