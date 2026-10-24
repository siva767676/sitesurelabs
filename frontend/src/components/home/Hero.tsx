import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { TextReveal } from '@/components/ui/TextReveal'
import { Boundary } from '@/components/ui/States'
import { HeroFallback } from '@/components/three/HeroFallback'
import { liveProducts } from '@/data/products'
import { ease } from '@/design/tokens'
import { isLowPowerDevice, useInView, useIsMobile, webglAvailable } from '@/lib/hooks'

const HeroScene = lazy(() => import('@/components/three/HeroScene'))

const ANNOTATIONS = [
  { k: '01', t: 'See', d: 'computer vision', pos: 'left-[-2%] top-[20%]' },
  { k: '02', t: 'Read', d: 'document intelligence', pos: 'right-[18%] top-[8%]' },
  { k: '03', t: 'Reason', d: 'LLMs + retrieval', pos: 'left-[2%] bottom-[18%]' },
  { k: '04', t: 'Act', d: 'workflow agents', pos: 'right-[20%] bottom-[16%]' },
]

export function Hero() {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const [wrapRef, inView] = useInView<HTMLDivElement>('0px')
  const [use3D, setUse3D] = useState(false)
  const [ready, setReady] = useState(false)

  // Decide on 3D after first paint so the headline is never blocked by the WebGL bundle.
  useEffect(() => {
    if (reduced || isLowPowerDevice() || !webglAvailable()) return
    // Start the WebGL scene only after the page has loaded and settled: the headline is the LCP,
    // and the (lazy) 3D chunk must never compete with it for bandwidth or the main thread.
    let id = 0
    const go = () => { id = window.setTimeout(() => setUse3D(true), mobile ? 1400 : 500) }
    if (document.readyState === 'complete') go()
    else window.addEventListener('load', go, { once: true })
    return () => { window.clearTimeout(id); window.removeEventListener('load', go) }
  }, [reduced, mobile])

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[var(--color-bg)]" aria-labelledby="hero-title">
      {/* ambient light */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{ background: 'radial-gradient(60% 55% at 78% 45%, rgb(83 109 255 / 0.20), transparent 70%), radial-gradient(40% 40% at 70% 55%, rgb(88 213 255 / 0.10), transparent 70%)' }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]" style={{ backgroundImage: 'linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)', backgroundSize: '88px 88px', maskImage: 'radial-gradient(70% 70% at 70% 50%, #000, transparent)' }} />

      {/* signature visual — never intercepts pointer events, never overlaps copy contrast */}
      <div
        ref={wrapRef}
        aria-hidden="true"
        className="pointer-events-none absolute -z-[5] aspect-square w-[min(150vw,1100px)] max-lg:left-1/2 max-lg:top-[3svh] max-lg:w-[96vw] max-lg:-translate-x-1/2 max-lg:opacity-80 max-sm:top-[34svh] max-sm:w-[120vw] max-sm:opacity-40 lg:right-[-7vw] lg:top-[47%] lg:w-[min(56vw,920px)] lg:-translate-y-1/2"
      >
        <motion.div className="absolute inset-0" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease: ease.out, delay: 0.2 }}>
          <HeroFallback className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${ready ? 'opacity-0' : 'opacity-100'}`} />
          {use3D && (
            <Boundary fallback={null} onError={() => setUse3D(false)}>
              <Suspense fallback={null}>
                <HeroScene mobile={mobile} paused={!inView} onReady={() => setReady(true)} onFail={() => { setUse3D(false); setReady(false) }} />
              </Suspense>
            </Boundary>
          )}
        </motion.div>

        {/* technical annotations (decorative) */}
        <div className="absolute inset-0 hidden lg:block">
          {ANNOTATIONS.map((a, i) => (
            <motion.div
              key={a.k}
              className={`absolute ${a.pos} font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.12, duration: 0.8, ease: ease.out }}
            >
              <span className="mb-1.5 block h-px w-10 bg-[var(--color-accent)]/60" />
              <span className="text-[var(--color-accent)]">{a.k}</span> {a.t}
              <span className="block normal-case tracking-normal text-[var(--color-faint)]">{a.d}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container-x relative flex flex-1 flex-col justify-end pb-10 pt-[calc(var(--header-h)+32px)] lg:pb-14">
        <div className="grid-12">
          <div className="col-span-12 lg:col-span-8 xl:col-span-7">
            <motion.p
              className="t-label mb-6 flex items-center gap-3"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: ease.out }}
            >
              <span className="inline-block h-1.5 w-1.5 animate-[pulse-dot_2.4s_ease-in-out_infinite] rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
              AI Products · Enterprise Engineering
            </motion.p>

            <TextReveal
              as="h1"
              id="hero-title"
              by="char"
              immediate
              delay={0.15}
              lines={['Intelligence', 'engineered for', 'the *real world.*']}
              className="t-display"
            />

            <motion.p
              className="t-lead mt-9 max-w-[52ch] text-[var(--color-muted)]"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: ease.out, delay: 0.55 }}
            >
              We build AI-powered products and intelligent systems that help businesses see more clearly, work smarter, and turn complex problems into actionable outcomes.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-4"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: ease.out, delay: 0.7 }}
            >
              <Button to="/products" variant="primary" arrow magnetic>Explore Our Products</Button>
              <Button to="/contact" variant="secondary" magnetic>Build With Us</Button>
            </motion.div>
          </div>
        </div>

        {/* product strip: tells the visitor what exists, in the first viewport */}
        <motion.nav
          aria-label="Our products"
          className="mt-10 grid grid-cols-1 border-t border-[var(--color-line)] sm:grid-cols-3 lg:mt-12"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.9 }}
        >
          {liveProducts.map((p) => (
            <Link key={p.slug} to={`/products/${p.slug}`} className="group flex min-h-[88px] items-center justify-between gap-4 border-[var(--color-line)] py-5 pr-4 transition-colors hover:text-[var(--color-accent)] sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0">
              <span>
                <span className="t-label block">{p.index}</span>
                <span className="font-display text-xl font-medium tracking-tight">{p.name}</span>
                <span className="mt-0.5 hidden text-[var(--fs-caption)] text-[var(--color-muted)] md:block">{p.category}</span>
              </span>
              <ArrowUpRight aria-hidden="true" className="shrink-0 text-[var(--color-muted)] transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]" size={20} />
            </Link>
          ))}
        </motion.nav>
      </div>
    </section>
  )
}
