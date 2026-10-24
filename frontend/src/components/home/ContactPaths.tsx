import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

const paths = [
  { to: '/contact?type=demo', label: 'Request a product demo', body: 'See Anviksha, SiteVision or Digi Reco working on a real workflow.', tag: 'Products' },
  { to: '/contact?type=project', label: 'Discuss a custom build', body: 'Tell us the problem. We will tell you honestly whether and how AI can solve it.', tag: 'Engineering' },
]

export function ContactPaths() {
  return (
    <section className="section theme-light !py-[calc(var(--section-y)*0.7)]" aria-labelledby="paths-title">
      <div className="container-x">
        <h2 id="paths-title" className="t-label mb-10">Start here</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {paths.map((p, i) => (
            <Reveal key={p.to} delay={i * 0.1}>
              <Link to={p.to} className="group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-ink)] p-8 text-white transition-transform duration-500 hover:-translate-y-1 md:p-10">
                <span aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--color-accent-2)] opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-40" />
                <span className="t-label !text-[var(--color-accent)]">{p.tag}</span>
                <span>
                  <span className="block font-display text-[clamp(1.75rem,1.2rem+2vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em]">{p.label}</span>
                  <span className="mt-4 block max-w-[38ch] text-[var(--color-muted)]">{p.body}</span>
                </span>
                <ArrowUpRight aria-hidden="true" className="absolute right-8 top-8 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" size={28} />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
