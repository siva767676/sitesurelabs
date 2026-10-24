import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { services } from '@/data/services'

export function Capabilities() {
  return (
    <section className="section" aria-labelledby="cap-title">
      <div className="container-x">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]">
              <SectionHeading titleId="cap-title" index="02" eyebrow="Capabilities & services" lines={['Engineering for', 'problems that', 'matter.']} />
              <Reveal delay={0.1}>
                <p className="t-lead mt-8">The same capabilities that power our products are available to your team as engineering services.</p>
                <div className="mt-10"><Button to="/services" variant="secondary" arrow>All services</Button></div>
              </Reveal>
            </div>
          </div>
          <ul className="col-span-12 border-t border-[var(--c-line)] lg:col-span-7">
            {services.map((s) => (
              <Reveal as="li" key={s.slug} className="border-b border-[var(--c-line)]">
                <Link to={`/services#${s.slug}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-4 py-7 md:grid-cols-[3.5rem_1fr_auto] md:py-8">
                  <span className="t-label pt-2 transition-colors group-hover:text-[var(--c-accent)]">{s.index}</span>
                  <span>
                    <span className="block font-display text-[clamp(1.35rem,1.05rem+1.1vw,2.1rem)] font-medium leading-[1.1] tracking-tight transition-transform duration-500 group-hover:translate-x-1.5">{s.title}</span>
                    <span className="mt-2 block text-[var(--c-muted)]">{s.outcome}</span>
                    <span className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr] max-md:grid-rows-[0fr]">
                      <span className="overflow-hidden">
                        <span className="flex flex-wrap gap-2 pt-4">
                          {s.capabilities.slice(0, 3).map((c) => <span key={c} className="chip normal-case tracking-normal">{c}</span>)}
                        </span>
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight aria-hidden="true" className="mt-1.5 text-[var(--c-muted)] transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--c-accent)]" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
