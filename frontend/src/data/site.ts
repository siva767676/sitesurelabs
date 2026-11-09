import { publishedArticles } from './articles'
/** Company-level content. Anything marked CONFIRM must be verified by the business before launch. */

export const site = {
  name: 'SiteSureLabs',
  url: 'https://sitesurelabs.com',
  tagline: 'Intelligence engineered for the real world.',
  description:
    'SiteSureLabs builds AI-powered construction technology and enterprise software that improve construction inspection, project visibility, operational efficiency and digital transformation.',
  // Public contact address, confirmed by the owner 2026-11-09. Shown in the footer, on the Contact page and in the legal pages.
  // (Where enquiry-form notifications are sent is a separate server setting, NOTIFY_TO in the server's .env.)
  email: 'mhcai@myhomeconstructions.com',
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
  // The Blog link appears only once an article has been approved (review: 'approved' in data/articles.ts).
  ...(publishedArticles().length > 0 ? [{ label: 'Blog', to: '/blog' }] : []),
  { label: 'Contact', to: '/contact' },
] as { label: string; to: string }[]

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
