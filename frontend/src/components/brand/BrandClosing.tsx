import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { Wordmark } from './Logo'

/**
 * Signature scroll experience #2: the brand transformation.
 * A single luminous point grows into a core, draws a ring, extends four sight-lines (the exact
 * geometry of the SiteSureLabs mark), glides aside as the wordmark wipes in, and the closing line
 * and CTA arrive. Normal scrolling is untouched (CSS sticky + scrub, no pinning). Reduced-motion
 * users get the finished composition with no animation and no extra scroll distance.
 *
 * The mark here reuses the temporary <Wordmark /> and the LogoMark geometry from ./Logo, so the
 * real logo asset can replace both in one place.
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
        const mm = gsap.matchMedia()
        mm.add({ big: '(min-width: 768px)', small: '(max-width: 767px)' }, (c) => {
          const big = c.conditions?.big
          const start = big ? 400 : 250
          const end = big ? 120 : 84
          const cta = el.querySelector<HTMLElement>('[data-cta]')!
          cta.inert = true

          gsap.set('[data-core]', { scale: 0.06, transformOrigin: '50% 50%' })
          gsap.set('[data-ring]', { strokeDasharray: 1, strokeDashoffset: 1 })
          gsap.set('[data-tick]', { strokeDasharray: 1, strokeDashoffset: 1 })
          gsap.set('[data-mark]', { width: start, height: start })
          gsap.set('[data-word]', { width: 0, opacity: 0 })
          gsap.set('[data-halo]', { scale: 0.2, opacity: 0 })
          gsap.set('[data-line]', { yPercent: 110, opacity: 0 })
          gsap.set('[data-cta]', { opacity: 0, y: 24 })

          const inner = el.querySelector<HTMLElement>('[data-word-inner]')!
          // measured lazily (and re-measured on refresh) so web-font loading can't leave the wordmark clipped
          const wordW = () => Math.ceil(inner.getBoundingClientRect().width) + 4

          const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
          tl.to('[data-core]', { scale: 0.22, duration: 0.5, ease: 'power2.out' }) // a small luminous point
            .to('[data-halo]', { scale: 1, opacity: 1, duration: 1.1 }, '<')
            .to('[data-core]', { scale: 1, duration: 1 }, '>-0.1') // the point swells into the core
            .to('[data-ring]', { strokeDashoffset: 0, duration: 1.2 }, '<0.3') // ring draws around it
            .to('[data-tick]', { strokeDashoffset: 0, duration: 0.7, stagger: 0.12 }, '>-0.4') // sight-lines extend
            .to('[data-mark]', { width: end, height: end, duration: 1.3 }, '>0.2') // mark settles to lockup size
            .to('[data-word]', { width: wordW, opacity: 1, duration: 1.3, immediateRender: false }, '<0.1') // wordmark wipes in beside it
            .to('[data-halo]', { opacity: 0.35, scale: 1.6, duration: 1.3 }, '<')
            .to('[data-line]', { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, '>-0.2')
            .to('[data-cta]', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '>-0.3')

          document.fonts?.ready.then(() => ScrollTrigger.refresh())

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
        })
      }, el)
      revert = () => ctx.revert()
    })
    return () => { cancelled = true; revert?.() }
  }, [reduced])

  return (
    <section ref={root} aria-labelledby="closing-title" className={`relative bg-[var(--color-bg)] ${reduced ? '' : 'h-[280vh] md:h-[320vh]'}`}>
      <div className={`${reduced ? 'py-32' : 'sticky top-0 h-screen'} flex flex-col items-center justify-center overflow-hidden px-[var(--gutter)] text-center`}>
        <div aria-hidden="true" data-halo className="pointer-events-none absolute left-1/2 top-[42%] h-[min(90vw,720px)] w-[min(90vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(closest-side, rgb(88 213 255 / 0.22), rgb(83 109 255 / 0.10) 55%, transparent 75%)' }} />

        <div className="relative flex items-center justify-center gap-[0.35em] text-[var(--color-fg)]" style={{ fontSize: 'clamp(2.1rem, 1rem + 4.6vw, 4.6rem)' }}>
          <svg data-mark viewBox="0 0 48 48" fill="none" className="shrink-0" style={reduced ? { width: '1.55em', height: '1.55em' } : undefined} aria-hidden="true" overflow="visible">
            <circle data-ring pathLength={1} cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="2.5" style={{ transform: 'rotate(-90deg)', transformOrigin: '24px 24px' }} />
            <path data-tick pathLength={1} d="M24 11V2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path data-tick pathLength={1} d="M37 24h9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path data-tick pathLength={1} d="M24 37v9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path data-tick pathLength={1} d="M11 24H2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle data-core cx="24" cy="24" r="6.5" fill="var(--color-accent)" style={{ filter: 'drop-shadow(0 0 6px rgb(88 213 255 / 0.9))' }} />
          </svg>
          <span data-word className="block overflow-hidden whitespace-nowrap" style={reduced ? undefined : { width: 0 }}>
            <span data-word-inner className="inline-block py-[0.1em] pr-[0.1em]"><Wordmark /></span>
          </span>
        </div>

        <h2 id="closing-title" className="mt-12 font-display text-[clamp(2rem,1.1rem+3.6vw,4.4rem)] font-medium leading-[1.04] tracking-[-0.04em]">
          <span className="block overflow-hidden py-[0.08em]"><span data-line className="block">Let’s engineer</span></span>
          <span className="block overflow-hidden py-[0.08em]"><span data-line className="block">what’s <span className="text-[var(--color-accent)]">next.</span></span></span>
        </h2>

        <div data-cta className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button to="/contact" variant="primary" arrow magnetic>Start a Conversation</Button>
        </div>
      </div>
    </section>
  )
}
