import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { TextReveal } from '@/components/ui/TextReveal'
import { ease } from '@/design/tokens'

/** The one way in, as a single wide panel. It wipes in from the left; two lights drift inside it. */
function DemoPanel() {
  const reduced = useReducedMotion()

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <motion.div
      className="group/p transition-transform duration-500 ease-[var(--ease-out)] hover:-translate-y-1"
      initial={reduced ? false : { clipPath: 'inset(0 100% 0 0 round 32px)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0% round 32px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, ease: ease.inOut }}
    >
      <Link
        to="/contact?type=demo"
        onPointerMove={onMove}
        className="theme-root spot ring-border relative flex min-h-[260px] flex-col justify-between gap-12 overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-card)] p-7 text-[var(--color-fg)] md:min-h-[320px] md:p-10 lg:p-12"
      >
        {/* drifting light, a faint dot grid, and (on hover) a rotating border and cursor spotlight */}
        <span aria-hidden="true" className="pointer-events-none absolute -left-[10%] -top-1/2 h-[150%] w-[55%] animate-[drift-a_16s_ease-in-out_infinite] rounded-full opacity-70 blur-3xl will-change-transform max-md:animate-none max-md:blur-2xl" style={{ background: 'radial-gradient(closest-side, rgb(var(--glow-a) / calc(0.5 * var(--glow-k))), transparent)' }} />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-1/2 -right-[5%] h-[150%] w-[50%] animate-[drift-b_20s_ease-in-out_infinite] rounded-full opacity-60 blur-3xl will-change-transform max-md:animate-none max-md:blur-2xl" style={{ background: 'radial-gradient(closest-side, rgb(var(--glow-b) / calc(0.55 * var(--glow-k))), transparent)' }} />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ backgroundImage: 'radial-gradient(color-mix(in srgb, var(--color-fg) 16%, transparent) 1px, transparent 1.3px)', backgroundSize: '22px 22px', WebkitMaskImage: 'radial-gradient(60% 95% at 88% 15%, #000, transparent 78%)', maskImage: 'radial-gradient(60% 95% at 88% 15%, #000, transparent 78%)' }}
        />

        <span className="relative flex items-start justify-between">
          <span className="t-label !text-[var(--color-accent)]">Products</span>
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-line-strong)] transition-all duration-500 group-hover/p:border-transparent group-hover/p:bg-[var(--color-brand)] group-hover/p:text-[var(--color-on-brand)] md:h-16 md:w-16">
            <ArrowRight size={22} className="transition-transform duration-500 group-hover/p:-rotate-45" aria-hidden="true" />
          </span>
        </span>
        <span className="relative flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-12">
          <span className="block font-display text-[clamp(2.25rem,1rem+4.2vw,5.5rem)] font-medium leading-none tracking-[-0.04em]">Request a demo</span>
          <span className="block max-w-[28ch] text-[var(--color-muted)] md:pb-2 md:text-right md:text-lg">See a product on your workflow.</span>
        </span>
      </Link>
    </motion.div>
  )
}

/** Start here: one way in, as one large panel. */
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
        <div className="mt-10 md:mt-12">
          <DemoPanel />
        </div>
      </div>
    </section>
  )
}
