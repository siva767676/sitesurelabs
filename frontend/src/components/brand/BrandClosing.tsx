import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { LogoStacked } from './Logo'

/**
 * Signature scroll experience #2: the brand, built.
 * The three grey bars rise like floors going up, the dark S drives in around them, the orange slab caps it,
 * and the wordmark and its rules arrive; then the closing line and CTA. The pieces are the traced paths of the
 * real logo (./Logo), so the animation ends on the artwork exactly as supplied. Normal scrolling is untouched
 * (CSS sticky + scrub, no pinning). Reduced-motion users get the finished composition with no animation and
 * no extra scroll distance.
 */
export function BrandClosing() {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !root.current) return
    let cancelled = false
    let revert: (() => void) | undefined
    // GSAP loads on demand; the section's scroll height is static CSS so nothing shifts when it arrives.
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled || !root.current) return
      gsap.registerPlugin(ScrollTrigger)
      const el = root.current
      const ctx = gsap.context(() => {
        const cta = el.querySelector<HTMLElement>('[data-cta]')!
        cta.inert = true

        gsap.set('[data-logo="bar"]', { scaleY: 0, transformOrigin: '50% 100%' }) // floors rise from the ground
        gsap.set('[data-logo="triangle"]', { opacity: 0, x: -24 })
        gsap.set('[data-logo="body"]', { opacity: 0, x: 80 })
        gsap.set('[data-logo="slab-dark"]', { opacity: 0, x: -70, y: -36 })
        gsap.set('[data-logo="slab-orange"]', { opacity: 0, x: 70, y: -36 })
        gsap.set('[data-logo="site"], [data-logo="sure"]', { opacity: 0, y: 46 })
        gsap.set('[data-logo="labs"]', { opacity: 0 })
        gsap.set('[data-logo="rules"] path:first-child', { scaleX: 0, transformOrigin: '100% 50%' }) // the rules grow out from LABS
        gsap.set('[data-logo="rules"] path:last-child', { scaleX: 0, transformOrigin: '0% 50%' })
        gsap.set('[data-halo]', { scale: 0.3, opacity: 0 })
        gsap.set('[data-line]', { yPercent: 110, opacity: 0 })
        gsap.set('[data-cta]', { opacity: 0, y: 24 })

        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
        tl.to('[data-halo]', { scale: 1, opacity: 1, duration: 1.6 }, 0)
          .to('[data-logo="bar"]', { scaleY: 1, duration: 0.9, stagger: 0.2, ease: 'power3.out' }, 0.15)
          .to('[data-logo="triangle"]', { opacity: 1, x: 0, duration: 0.6 }, '>-0.4')
          .to('[data-logo="body"]', { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, '<0.1')
          .to('[data-logo="slab-dark"]', { opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.out' }, '>-0.5')
          .to('[data-logo="slab-orange"]', { opacity: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.out' }, '>-0.6')
          .to('[data-halo]', { opacity: 0.55, scale: 1.2, duration: 1.2 }, '<')
          .to('[data-logo="site"]', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '>-0.3')
          .to('[data-logo="sure"]', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '<0.15')
          .to('[data-logo="labs"]', { opacity: 1, duration: 0.6 }, '>-0.3')
          .to('[data-logo="rules"] path', { scaleX: 1, duration: 0.7 }, '<')
          .to('[data-line]', { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, '>-0.1')
          .to('[data-cta]', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '>-0.3')

        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          animation: tl,
          invalidateOnRefresh: true,
          onUpdate: (self) => { cta.inert = self.progress < 0.92 },
        })
        return () => { st.kill(); cta.inert = false }
      }, el)
      revert = () => ctx.revert()
    })
    return () => { cancelled = true; revert?.() }
  }, [reduced])

  return (
    <section ref={root} aria-labelledby="closing-title" className={`relative bg-[var(--color-bg)] ${reduced ? '' : 'h-[210vh] md:h-[320vh]'}`}>
      <div className={`${reduced ? 'py-28' : 'sticky top-0 h-[100svh]'} flex flex-col items-center justify-center overflow-hidden px-[var(--gutter)] text-center`}>
        <div className="relative">
          <div aria-hidden="true" data-halo className="pointer-events-none absolute left-1/2 top-[38%] h-[150%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(closest-side, rgb(var(--glow-a) / calc(0.2 * var(--glow-k))), rgb(var(--glow-b) / calc(0.08 * var(--glow-k))) 58%, transparent 76%)' }} />
          <LogoStacked title="SiteSureLabs" className="relative w-[min(78vw,500px)]" />
        </div>

        <h2 id="closing-title" className="mt-10 font-display text-[clamp(1.9rem,1.1rem+3.4vw,4.2rem)] font-medium leading-[1.04] tracking-[-0.04em] md:mt-12">
          <span className="block overflow-hidden py-[0.08em]"><span data-line className="block">Let’s engineer</span></span>
          <span className="block overflow-hidden py-[0.08em]"><span data-line className="block">what’s <span className="text-[var(--color-accent-display)]">next.</span></span></span>
        </h2>

        <div data-cta className="mt-9 flex flex-wrap items-center justify-center gap-4 md:mt-10">
          <Button to="/contact" variant="primary" arrow magnetic>Start a Conversation</Button>
        </div>
      </div>
    </section>
  )
}
