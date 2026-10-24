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
  { label: 'Products', to: '/products' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Insights', to: '/insights' },
  { label: 'Contact', to: '/contact' },
] as const

export const legalNav = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Use', to: '/terms' },
] as const

export const process = [
  { n: '01', title: 'Frame', body: 'We start with the operational problem, not the model: who acts on the output, what decision it changes, and what good looks like.' },
  { n: '02', title: 'Prototype', body: 'A working proof of concept on your real data, fast enough to learn from and honest about what it can and cannot do.' },
  { n: '03', title: 'Build', body: 'Production engineering: APIs, interfaces, evaluation, security review and the integrations that make it usable inside your workflow.' },
  { n: '04', title: 'Deploy', body: 'Containerised, observable deployments on your cloud or ours, with documentation and handover for your team.' },
  { n: '05', title: 'Evolve', body: 'Measure real usage, tune the models and workflows, and extend the system as the operation changes.' },
]

export const principles = [
  { title: 'Product-first', body: 'We run our own products in the field before we advise anyone else on theirs. That discipline shows up in every engagement.' },
  { title: 'Practical AI', body: 'We choose the simplest approach that solves the problem. Sometimes that is a vision model; sometimes it is a better workflow.' },
  { title: 'Built for operators', body: 'Interfaces designed for people on site, in stores and in review meetings, not for demos.' },
  { title: 'End-to-end ownership', body: 'Models, backend, interface and deployment under one roof, so nothing is lost between teams.' },
]
