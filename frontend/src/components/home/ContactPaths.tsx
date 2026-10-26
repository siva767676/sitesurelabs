import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { TextReveal } from '@/components/ui/TextReveal'
import { ease } from '@/design/tokens'

/** blobs: which glow colour (a or b, see --glow-a / --glow-b) and how strong, for the two drifting lights. */
const paths = [
  { to: '/contact?type=demo', tag: 'Products', title: 'Request a demo', line: 'See a product on your workflow.', from: 'left', blobs: [['a', 0.5], ['b', 0.55]] },
  { to: '/contact?type=project', tag: 'Engineering', title: 'Discuss a project', line: 'Bring us a problem worth solving.', from: 'right', blobs: [['b', 0.6], ['a', 0.4]] },
] as const

function Path({ p }: { p: (typeof paths)[number] }) {
  const reduced = useReducedMotion()
  const hidden = p.from === 'left' ? 'inset(0 100% 0 0 round 32px)' : 'inset(0 0 0 100% round 32px)'

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <motion.div
      className="group/p transition-transform duration-500 ease-[var(--ease-out)] hover:-translate-y-1"
      initial={reduced ? false : { clipPath: hidden }}
      whileInView={{ clipPath: 'inset(0 0% 0 0% round 32px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, ease: ease.inOut }}
    >
      <Link
        to={p.to}
        onPointerMove={onMove}
        className="theme-root spot ring-border relative flex min-h-[290px] flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-card)] p-7 text-[var(--color-fg)] md:min-h-[400px] md:p-10"
      >
        {/* drifting light, a faint dot grid, and (on hover) a rotating border and cursor spotlight */}
        <span aria-hidden="true" className="pointer-events-none absolute -left-1/4 -top-1/3 h-[120%] w-[80%] animate-[drift-a_16s_ease-in-out_infinite] rounded-full opacity-70 blur-3xl will-change-transform max-md:animate-none max-md:blur-2xl" style={{ background: `radial-gradient(closest-side, rgb(var(--glow-${p.blobs[0][0]}) / calc(${p.blobs[0][1]} * var(--glow-k))), transparent)` }} />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-1/2 -right-[10%] h-[120%] w-[75%] animate-[drift-b_20s_ease-in-out_infinite] rounded-full opacity-60 blur-3xl will-change-transform max-md:animate-none max-md:blur-2xl" style={{ background: `radial-gradient(closest-side, rgb(var(--glow-${p.blobs[1][0]}) / calc(${p.blobs[1][1]} * var(--glow-k))), transparent)` }} />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ backgroundImage: 'radial-gradient(color-mix(in srgb, var(--color-fg) 16%, transparent) 1px, transparent 1.3px)', backgroundSize: '22px 22px', WebkitMaskImage: 'radial-gradient(75% 95% at 85% 15%, #000, transparent 78%)', maskImage: 'radial-gradient(75% 95% at 85% 15%, #000, transparent 78%)' }}
        />

        <span className="relative flex items-start justify-between">
          <span className="t-label !text-[var(--color-accent)]">{p.tag}</span>
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-line-strong)] transition-all duration-500 group-hover/p:border-transparent group-hover/p:bg-[var(--color-brand)] group-hover/p:text-[var(--color-on-brand)]">
            <ArrowRight size={22} className="transition-transform duration-500 group-hover/p:-rotate-45" aria-hidden="true" />
          </span>
        </span>
        <span className="relative">
          <span className="block font-display text-[clamp(2.25rem,1.2rem+3.4vw,4rem)] font-medium leading-none tracking-[-0.04em]">{p.title}</span>
          <span className="mt-3 block max-w-[28ch] text-[var(--color-muted)]">{p.line}</span>
        </span>
      </Link>
    </motion.div>
  )
}

/** Start here: two ways in, as two large panels. */
export function ContactPaths() {
  return (
    <section className="section theme-invert !py-[clamp(56px,9vw,128px)]" aria-labelledby="start-title">
      <div className="container-x">
        <Reveal>
          <p className="t-label mb-5 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-[var(--c-line-strong)]" />
            Get in touch
          </p>
        </Reveal>
        <TextReveal as="h2" id="start-title" lines={['Start *here.*']} className="t-h1" />
        <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6">
          {paths.map((p) => <Path key={p.to} p={p} />)}
        </div>
      </div>
    </section>
  )
}
