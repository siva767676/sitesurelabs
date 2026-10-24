import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { principles } from '@/data/site'

export function WhySure() {
  return (
    <section className="section" aria-labelledby="why-title">
      <div className="container-x">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            <SectionHeading titleId="why-title" index="06" eyebrow="Why SiteSureLabs" lines={['Built by people', 'who ship product.']} />
          </div>
          <ul className="col-span-12 lg:col-span-6 lg:col-start-7">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.06} className="group grid grid-cols-[3rem_1fr] gap-x-4 border-t border-[var(--c-line)] py-9 last:border-b">
                <span className="t-label pt-2 transition-colors group-hover:text-[var(--c-accent)]">0{i + 1}</span>
                <div>
                  <h3 className="t-h3 mb-3">{p.title}</h3>
                  <p className="t-body">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
