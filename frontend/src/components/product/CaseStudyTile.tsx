import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { kindLabel, type Insight } from '@/data/insights'

/** Tile for case studies, engineering articles and product updates. */
export function CaseStudyTile({ item: i, delay = 0 }: { item: Insight; delay?: number }) {
  return (
    <Reveal as="li" delay={delay}>
      <Link to={`/insights/${i.slug}`} className="group surface flex h-full min-h-[320px] flex-col justify-between p-7 transition-colors hover:border-[var(--c-line-strong)]">
        <div>
          <p className="t-label mb-6 flex items-center justify-between">{kindLabel[i.kind]} {i.placeholder && <span className="chip">Template</span>}</p>
          <h2 className="t-h3 !text-[clamp(1.35rem,1.1rem+0.8vw,1.8rem)]">{i.title}</h2>
          <p className="t-body mt-4">{i.excerpt}</p>
        </div>
        <ArrowUpRight aria-hidden="true" className="mt-8 text-[var(--c-muted)] transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--c-accent)]" />
      </Link>
    </Reveal>
  )
}
