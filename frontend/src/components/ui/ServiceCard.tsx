import { Reveal } from './Reveal'
import { Button } from './Button'
import type { Service } from '@/data/services'

/** Editorial service entry: index, title + outcome, description, capability chips, CTA. */
export function ServiceCard({ service: s }: { service: Service }) {
  return (
    <li id={s.slug} className="scroll-mt-28 border-b border-[var(--c-line)]">
      <Reveal className="grid-12 gap-y-8 py-12 md:py-16">
        <div className="col-span-12 lg:col-span-1"><span className="t-label text-[var(--c-accent)]">{s.index}</span></div>
        <div className="col-span-12 lg:col-span-5">
          <h2 className="t-h2 !text-[clamp(1.9rem,1.2rem+2.4vw,3.4rem)]">{s.title}</h2>
          <p className="mt-5 font-display text-[clamp(1.1rem,1rem+0.5vw,1.4rem)] text-[var(--c-accent)]">{s.outcome}</p>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <p className="t-body">{s.body}</p>
          <ul className="mt-6 flex flex-wrap gap-2">{s.capabilities.map((c) => <li key={c} className="chip normal-case tracking-normal">{c}</li>)}</ul>
          <div className="mt-8"><Button to={`/contact?type=project&service=${s.slug}`} variant="secondary" size="sm" arrow>Discuss a use case</Button></div>
        </div>
      </Reveal>
    </li>
  )
}
