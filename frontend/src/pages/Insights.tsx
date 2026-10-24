import { useState } from 'react'
import { Seo } from '@/components/ui/Seo'
import { PageHero } from '@/components/ui/PageHero'
import { CaseStudyTile } from '@/components/product/CaseStudyTile'
import { insights, type InsightKind } from '@/data/insights'

const filters: { id: 'all' | InsightKind; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'case-study', label: 'Case studies' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'product-update', label: 'Product updates' },
]

export default function Insights() {
  const [f, setF] = useState<'all' | InsightKind>('all')
  const items = insights.filter((i) => f === 'all' || i.kind === f)
  return (
    <>
      <Seo title="Insights & Case Studies" description="Case studies, engineering articles and product updates from SiteSureLabs." path="/insights" noindex />
      <PageHero eyebrow="Insights" lines={['Case studies and', 'engineering notes.']} lead="Verified case studies, engineering write-ups and product updates will be published here. The entries below are templates until real material is ready." />
      <section className="section !pt-6" aria-label="Insights">
        <div className="container-x">
          <div role="group" aria-label="Filter by type" className="mb-12 flex flex-wrap gap-2">
            {filters.map((x) => (
              <button key={x.id} type="button" aria-pressed={f === x.id} onClick={() => setF(x.id)} className={`chip min-h-[44px] px-5 transition-colors ${f === x.id ? '!border-[var(--c-accent)] !text-[var(--c-fg)]' : 'hover:!text-[var(--c-fg)]'}`}>{x.label}</button>
            ))}
          </div>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((i, n) => <CaseStudyTile key={i.slug} item={i} delay={n * 0.06} />)}
          </ul>
        </div>
      </section>
    </>
  )
}
