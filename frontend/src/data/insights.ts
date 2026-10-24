/** Reusable templates for case studies, engineering articles and product updates.
 *  All entries are PLACEHOLDERS (`placeholder: true`) until real material is supplied. */

export type InsightKind = 'case-study' | 'engineering' | 'product-update'

export interface Insight {
  slug: string
  kind: InsightKind
  title: string
  excerpt: string
  product?: string
  placeholder: boolean
  sections: { heading: string; body: string }[]
}

export const kindLabel: Record<InsightKind, string> = {
  'case-study': 'Case study',
  engineering: 'Engineering',
  'product-update': 'Product update',
}

const todo = 'Placeholder. Replace with verified content before publishing.'

export const caseStudySections = ['The business challenge', 'The solution', 'Implementation approach', 'Verified results', 'Lessons learned']

export const insights: Insight[] = [
  {
    slug: 'case-study-template',
    kind: 'case-study',
    title: 'Case study template: defect inspection at scale',
    excerpt: 'Template for a customer or internal case study. Results will only be published when verified.',
    product: 'anviksha',
    placeholder: true,
    sections: caseStudySections.map((heading) => ({ heading, body: todo })),
  },
  {
    slug: 'engineering-template',
    kind: 'engineering',
    title: 'Engineering article template: how our vision pipeline works',
    excerpt: 'Template for a technical deep dive from the engineering team.',
    placeholder: true,
    sections: ['Context', 'Approach', 'What we learned'].map((heading) => ({ heading, body: todo })),
  },
  {
    slug: 'product-update-template',
    kind: 'product-update',
    title: 'Product update template: what’s new in SiteVision',
    excerpt: 'Template for release notes and product announcements.',
    product: 'sitevision',
    placeholder: true,
    sections: ['What’s new', 'Why it matters', 'Availability'].map((heading) => ({ heading, body: todo })),
  },
]

export const getInsight = (slug: string) => insights.find((i) => i.slug === slug)
