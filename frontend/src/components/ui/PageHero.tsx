import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { TextReveal } from './TextReveal'
import { ease } from '@/design/tokens'

interface PageHeroProps {
  eyebrow: string
  lines: string[]
  lead?: ReactNode
  children?: ReactNode
  glow?: string
}

/** Shared interior-page hero: eyebrow, masked headline, lead. Tall enough to breathe, short enough
 *  that the page content is visible on a laptop viewport. */
export function PageHero({ eyebrow, lines, lead, children, glow = '#536dff' }: PageHeroProps) {
  const reduced = useReducedMotion()
  return (
    <section className="relative overflow-hidden pb-[clamp(56px,8vw,112px)] pt-[calc(var(--header-h)+clamp(56px,9vw,128px))]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{ background: `radial-gradient(55% 60% at 85% 10%, ${glow}30, transparent 70%)` }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-30" style={{ backgroundImage: 'linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)', backgroundSize: '88px 88px', maskImage: 'radial-gradient(60% 80% at 80% 0%, #000, transparent)' }} />
      <div className="container-x">
        <motion.p className="t-label mb-8 flex items-center gap-3" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: ease.out }}>
          <span aria-hidden="true" className="h-px w-8 bg-[var(--c-line-strong)]" /> {eyebrow}
        </motion.p>
        <TextReveal as="h1" by="word" immediate lines={lines} className="t-h1 max-w-[16ch] md:max-w-[22ch]" />
        {lead && (
          <motion.div className="t-lead mt-9" initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.5 }}>
            {lead}
          </motion.div>
        )}
        {children && (
          <motion.div className="mt-10" initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.65 }}>
            {children}
          </motion.div>
        )}
      </div>
    </section>
  )
}
