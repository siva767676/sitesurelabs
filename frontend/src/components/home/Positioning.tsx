import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { DottedText } from '@/components/ui/DottedText'
import { Reveal } from '@/components/ui/Reveal'

const STATEMENT = 'SiteSureLabs is an AI product company. We build software that sees, reads and reasons, and we build it with the enterprises that depend on it.'

function Word({ children, i, n, progress, reduced }: { children: string; i: number; n: number; progress: MotionValue<number>; reduced: boolean | null }) {
  const start = i / n
  const opacity = useTransform(progress, [start, Math.min(start + 1.6 / n, 1)], [0.4, 1])
  return <motion.span style={{ opacity: reduced ? 1 : opacity }} className="inline-block pr-[0.26em]">{children}</motion.span>
}

export function Positioning() {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  const words = STATEMENT.split(' ')

  return (
    <section className="section" aria-labelledby="positioning-label">
      <div className="container-x">
        <h2 id="positioning-label" className="t-label mb-10 flex items-center gap-3 !font-medium !tracking-[0.14em]">
          <span aria-hidden="true" className="h-px w-8 bg-[var(--c-line-strong)]" /> Who we are
        </h2>
        <p ref={ref} className="max-w-[26ch] font-display text-[clamp(1.9rem,1rem+3.6vw,4.4rem)] font-medium leading-[1.08] tracking-[-0.035em] md:max-w-[30ch]">
          <span className="sr-only">{STATEMENT}</span>
          <span aria-hidden="true">
            {words.map((w, i) => (<Word key={i} i={i} n={words.length} progress={scrollYProgress} reduced={reduced}>{w}</Word>))}
          </span>
        </p>

        <div className="mt-20 overflow-hidden" aria-hidden="true">
          <DottedText size="clamp(3.2rem, 11.5vw, 12rem)">See · Read · Act</DottedText>
        </div>

        {/* products vs. engineering: two clearly separate offers */}
        <div className="mt-20 grid grid-cols-1 border-t border-[var(--c-line)] md:grid-cols-2">
          <Reveal className="group border-b border-[var(--c-line)] py-10 md:border-b-0 md:border-r md:pr-12">
            <p className="t-label mb-4">For teams ready to adopt</p>
            <h3 className="t-h3 mb-4">AI products, ready to deploy</h3>
            <p className="t-body mb-8">Anviksha, SiteVision and Digi Reco are our own products, built for construction and delivered as software your teams can use.</p>
            <Link to="/products" className="link-arrow">Explore products <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </Reveal>
          <Reveal delay={0.1} className="group py-10 md:pl-12">
            <p className="t-label mb-4">For teams that need something built</p>
            <h3 className="t-h3 mb-4">Custom AI and software engineering</h3>
            <p className="t-body mb-8">Computer vision, document intelligence, LLM applications and automation, engineered with you from prototype to production.</p>
            <Link to="/services" className="link-arrow">See services <ArrowUpRight size={18} aria-hidden="true" /></Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
