import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getProduct } from '@/data/products'
import { useReducedMotion } from 'motion/react'

/**
 * Signature scroll experience #1: "From photograph to report" (Anviksha).
 * A CSS-sticky stage; GSAP ScrollTrigger scrubs a timeline that wipes between the real product
 * screens and advances the step rail. Normal scrolling is untouched (no pinning, no snapping).
 * Below `lg` and for reduced-motion users it becomes a plain stacked sequence.
 */
export function WorkflowDeepDive() {
  const p = getProduct('anviksha')!
  const reduced = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const steps = p.workflow.map((w) => ({ ...w, shot: p.media.shots[w.shot ?? 0] }))

  useEffect(() => {
    if (reduced || !root.current) return
    let cancelled = false
    let revert: (() => void) | undefined
    // GSAP is loaded on demand: it only drives this below-the-fold section, and the section's
    // height is static CSS, so deferring the import cannot shift the layout.
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled || !root.current) return
      gsap.registerPlugin(ScrollTrigger)
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px)', () => {
        const el = root.current!
        const layers = gsap.utils.toArray<HTMLElement>('[data-layer]', el)
        const tl = gsap.timeline({ defaults: { ease: 'none' } })
        layers.forEach((l, i) => {
          if (i === 0) return
          tl.fromTo(l, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, i - 1 + 0.15)
          tl.fromTo(l.querySelector('img'), { scale: 1.12 }, { scale: 1, duration: 1.2 }, i - 1 + 0.15)
        })
        tl.to({}, { duration: 0.35 })
        const total = tl.duration()
        ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          animation: tl,
          onUpdate: (self) => {
            // layer i finishes wiping in at t = i + 0.15; switch the rail halfway through the wipe
            const idx = Math.max(0, Math.min(steps.length - 1, Math.floor(self.progress * total + 0.35)))
            setStep((s) => (s === idx ? s : idx))
            el.style.setProperty('--p', String(self.progress))
          },
        })
      })
      revert = () => mm.revert()
    })
    return () => { cancelled = true; revert?.() }
  }, [reduced, steps.length])

  return (
    <section className="section section--raised !pb-0" aria-labelledby="deep-title">
      <div className="container-x">
        <SectionHeading titleId="deep-title" index="04" eyebrow="Workflow deep dive · Anviksha" lines={['From photograph', 'to report.']} lead="Follow one defect through Anviksha, on the real product screens from our demonstration." align="split" />
      </div>

      {/* desktop: sticky, scroll-scrubbed */}
      <div ref={root} className={`relative mt-16 ${reduced ? '' : 'lg:h-[420vh]'}`} style={{ '--p': 0 } as React.CSSProperties}>
        <div className={reduced ? 'pb-[var(--section-y)]' : 'lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center'}>
          <div className="container-x w-full">
            <div className="grid-12 items-center gap-y-12">
              <ol className="col-span-12 space-y-3 lg:col-span-4 lg:space-y-0">
                {steps.map((s, i) => {
                  const on = i === step
                  return (
                    <li key={s.title} className={`relative border-t border-[var(--c-line)] py-5 transition-opacity duration-500 lg:py-6 ${on || reduced ? 'opacity-100' : 'lg:opacity-60'}`} aria-current={on ? 'step' : undefined}>
                      <span aria-hidden="true" className="absolute left-0 top-[-1px] hidden h-px bg-[var(--c-accent)] transition-[width] duration-700 lg:block" style={{ width: on ? '100%' : '0%' }} />
                      <p className="t-label mb-2"><span className="text-[var(--c-accent)]">0{i + 1}</span></p>
                      <h3 className="t-h3">{s.title}</h3>
                      <div className={`grid transition-[grid-template-rows] duration-500 ${on || reduced ? 'grid-rows-[1fr]' : 'lg:grid-rows-[0fr]'} max-lg:grid-rows-[1fr]`}>
                        <p className="t-body overflow-hidden pt-3">{s.body}</p>
                      </div>
                      {/* mobile / reduced-motion: inline image */}
                      <div className={`mt-6 ${reduced ? '' : 'lg:hidden'}`}>
                        <div className="shot"><img src={s.shot.src} alt={s.shot.alt} width={1920} height={1080} loading="lazy" decoding="async" className="w-full object-cover object-top" style={{ aspectRatio: '16 / 9.5' }} /></div>
                      </div>
                    </li>
                  )
                })}
                <li className="border-t border-[var(--c-line)] pt-6 max-lg:pt-8"><Link to="/products/anviksha" className="link-arrow">See the full Anviksha product</Link></li>
              </ol>

              <div className={`col-span-12 lg:col-span-8 ${reduced ? 'hidden' : 'hidden lg:block'}`} aria-hidden="true">
                <div className="shot relative !rounded-[var(--radius-lg)]" style={{ aspectRatio: '16 / 9.5' }}>
                  {steps.map((s, i) => (
                    <div key={s.title} data-layer className="absolute inset-0" style={{ zIndex: i }}>
                      <img src={s.shot.src} alt="" width={1920} height={1080} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
                    </div>
                  ))}
                  <div className="absolute bottom-4 left-4 z-10 rounded-full bg-black/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white backdrop-blur">
                    0{step + 1} / 0{steps.length} · {steps[step].shot.caption}
                  </div>
                </div>
                <div className="mt-6 h-px w-full bg-[var(--c-line)]"><div className="h-px origin-left bg-[var(--c-accent)]" style={{ transform: 'scaleX(var(--p))' }} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
