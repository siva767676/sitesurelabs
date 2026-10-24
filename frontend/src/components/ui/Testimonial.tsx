import { Reveal } from './Reveal'
import { testimonials, type TestimonialItem } from '@/data/testimonials'

export function Testimonial({ item }: { item: TestimonialItem }) {
  return (
    <Reveal>
      <figure className="m-0">
        <blockquote className="m-0 font-display text-[clamp(1.6rem,1rem+2.6vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.03em]">
          <span aria-hidden="true" className="text-[var(--c-accent)]">“</span>{item.quote}<span aria-hidden="true" className="text-[var(--c-accent)]">”</span>
        </blockquote>
        <figcaption className="mt-8 flex items-center gap-4">
          <span aria-hidden="true" className="h-px w-10 bg-[var(--c-line-strong)]" />
          <span><span className="block font-medium">{item.name}</span><span className="t-caption">{item.role}, {item.organisation}</span></span>
        </figcaption>
      </figure>
    </Reveal>
  )
}

/** Renders nothing until verified testimonials exist in data/testimonials.ts. */
export function Testimonials() {
  if (testimonials.length === 0) return null
  return (
    <section className="section section--raised" aria-label="Customer testimonials">
      <div className="container-x space-y-20">
        {testimonials.map((t) => <Testimonial key={t.name + t.organisation} item={t} />)}
      </div>
    </section>
  )
}
