import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { ImageReveal } from '@/components/ui/ImageReveal'
import { getProduct } from '@/data/products'

/** Each chapter: the problem as the customer lives it, then the product that answers it.
 *  Copy and imagery come from the real product demos (shot indices into product.media.shots). */
const chapters = [
  { slug: 'anviksha', shot: 0, problem: 'Defects hide in plain sight.', answer: 'Every defect, located, rated and explained.', pos: '50% 12%' },
  { slug: 'digi-reco', shot: 0, problem: 'Steel loss hides in spreadsheets.', answer: 'From workbook to portfolio, wastage made visible.', pos: '50% 8%' },
  { slug: 'sitevision', shot: 3, problem: 'Progress hides in scattered photos.', answer: 'Capture once. Walk the site from anywhere.', pos: '50% 20%' },
] as const

export function ProblemSolution() {
  return (
    <section className="section theme-light" aria-labelledby="ps-title">
      <div className="container-x">
        <SectionHeading titleId="ps-title" index="03" eyebrow="From problem to solution" lines={['Hard problems,', 'made visible.']} lead="Three problems we see on every construction project, and how each product answers them." align="split" />

        <div className="mt-20 space-y-24 lg:mt-32 lg:space-y-40">
          {chapters.map((c, i) => {
            const p = getProduct(c.slug)!
            const shot = p.media.shots[c.shot]
            const flip = i % 2 === 1
            return (
              <article key={c.slug} className="grid-12 items-center gap-y-10">
                <div className={`col-span-12 lg:col-span-5 ${flip ? 'lg:order-2 lg:col-start-8' : ''}`}>
                  <Reveal>
                    <p className="t-label mb-5"><span className="text-[var(--c-accent)]">0{i + 1}</span> · {p.name}</p>
                    <p className="font-display text-[clamp(2rem,1.2rem+3vw,4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-[var(--c-muted)]">{c.problem}</p>
                  </Reveal>
                  <Reveal delay={0.12}>
                    <p className="my-6 flex items-center gap-3 text-[var(--c-accent)]"><span className="h-px w-12 bg-current" /><ArrowRight size={18} aria-hidden="true" /></p>
                    <p className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.3rem)] font-medium leading-[1.12] tracking-tight">{c.answer}</p>
                    <p className="t-body mt-5">{p.problem.body}</p>
                    <Link to={`/products/${p.slug}`} className="link-arrow mt-8">Meet {p.name}</Link>
                  </Reveal>
                </div>
                <div className={`col-span-12 lg:col-span-7 ${flip ? 'lg:order-1' : ''}`}>
                  <div className="shot !rounded-[var(--radius-lg)] bg-[var(--c-surface)] !shadow-[0_40px_90px_-40px_rgb(10_16_32/0.5)]">
                    <ImageReveal src={shot.src} alt={shot.alt} ratio="16 / 9.5" position={c.pos} />
                  </div>
                  <p className="t-caption mt-4">{shot.caption} · from the {p.name} product demo</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
