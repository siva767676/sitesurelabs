import { Link, useParams } from 'react-router-dom'
import { Info } from 'lucide-react'
import { Seo } from '@/components/ui/Seo'
import { Reveal } from '@/components/ui/Reveal'
import { TextReveal } from '@/components/ui/TextReveal'
import { CtaBand } from '@/components/ui/CtaBand'
import { getInsight, kindLabel } from '@/data/insights'
import NotFound from './NotFound'

/** Shared template for case studies, engineering articles and product updates. */
export default function InsightDetail() {
  const { slug = '' } = useParams()
  const a = getInsight(slug)
  if (!a) return <NotFound />
  return (
    <>
      <Seo title={a.title} description={a.excerpt} path={`/insights/${a.slug}`} noindex={a.placeholder} />
      <article>
        <header className="pb-16 pt-[calc(var(--header-h)+clamp(48px,8vw,112px))]">
          <div className="container-x">
            <nav aria-label="Breadcrumb" className="t-label mb-10 flex items-center gap-3"><Link to="/insights" className="hover:text-[var(--c-fg)]">Insights</Link><span aria-hidden="true">/</span><span className="text-[var(--c-fg)]">{kindLabel[a.kind]}</span></nav>
            <TextReveal as="h1" immediate lines={[a.title]} className="t-h1 max-w-[20ch] !text-[clamp(2.25rem,1.2rem+4vw,4.5rem)]" />
            <p className="t-lead mt-8">{a.excerpt}</p>
            {a.placeholder && (
              <div role="note" className="mt-8 flex max-w-xl items-start gap-3 rounded-[var(--radius-md)] border border-[var(--c-line-strong)] p-4 text-[var(--fs-caption)] text-[var(--c-muted)]"><Info size={18} className="mt-0.5 shrink-0 text-[var(--c-accent)]" aria-hidden="true" />Template preview. Replace with verified content before publishing. Results and claims must be confirmed first.</div>
            )}
          </div>
        </header>
        <div className="container-x pb-[var(--section-y)]">
          <div className="max-w-3xl">
            {a.sections.map((s, i) => (
              <Reveal key={s.heading} className="border-t border-[var(--c-line)] py-10">
                <h2 className="t-h3 mb-4"><span className="t-label mr-4 align-middle text-[var(--c-accent)]">{String(i + 1).padStart(2, '0')}</span>{s.heading}</h2>
                <p className="t-body">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </article>
      <CtaBand title="Want results like these?" primary={{ label: 'Start a Conversation', to: '/contact' }} secondary={{ label: 'All insights', to: '/insights' }} />
    </>
  )
}
