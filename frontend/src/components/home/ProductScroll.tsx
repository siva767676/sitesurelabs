import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowDown, Plus } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProductSheet } from '@/components/product/ProductSheet'
import { SwipeList } from '@/components/ui/SwipeList'
import { products, type Product } from '@/data/products'
import { ease, queries } from '@/design/tokens'
import { accentVars } from '@/lib/accent'
import { stillSet } from '@/lib/images'
import { useMediaQuery } from '@/lib/hooks'

const N = products.length
/** Scroll distance (in viewport heights) between one product and the next. */
const STEP_VH = 60
/** Length of the GSAP timeline below: N layers wipe in at 1 unit each, plus a short tail. */
const TOTAL = N - 0.3

/* ---------------------------------------------------------------- shared pieces */

/** The one-word label. Planned products have nothing to show yet, so they get an honest chip instead. */
function DetailsButton({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  if (product.status === 'planned') {
    return <span className="chip"><span className="chip__dot" /> In development</span>
  }
  return (
    <button
      type="button"
      onClick={() => onOpen(product)}
      aria-haspopup="dialog"
      aria-label={`${product.name} details`}
      className="group/d inline-flex items-center gap-4 rounded-full border border-[var(--c-line-strong)] py-1.5 pl-6 pr-1.5 font-display text-base font-medium transition-colors hover:border-[var(--c-accent)]"
    >
      Details
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand)] text-[var(--color-on-brand)] transition-transform duration-500 group-hover/d:rotate-90">
        <Plus size={18} aria-hidden="true" />
      </span>
    </button>
  )
}

function Highlights({ product }: { product: Product }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Highlights">
      {product.highlights.map((h) => <li key={h} className="chip normal-case tracking-normal">{h}</li>)}
    </ul>
  )
}

/** Labelled concept panel for the product that has no screens yet. Never a fake screenshot. */
function Concept({ product }: { product: Product }) {
  return (
    <div className="accent-scope flex h-full w-full flex-col justify-between rounded-[var(--radius-lg)] border border-dashed border-[var(--c-line-strong)] p-6 sm:p-8" style={accentVars(product.accent)}>
      <span className="chip self-start"><span className="chip__dot" /> In development</span>
      <svg viewBox="0 0 600 160" className="w-full" role="img" aria-label="Concept illustration of a milestone timeline">
        <line x1="20" y1="80" x2="580" y2="80" stroke="var(--c-line-strong)" strokeDasharray="4 6" />
        {[60, 190, 320, 450].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy="80" r={i < 2 ? 9 : 7} fill={i < 2 ? 'var(--accent-ink)' : 'none'} stroke="var(--accent-ink)" strokeWidth="2" />
            <line x1={x} y1="80" x2={x} y2={i % 2 ? 126 : 36} stroke="var(--c-line-strong)" />
          </g>
        ))}
      </svg>
      <p className="t-caption">Concept illustration. Details to be confirmed.</p>
    </div>
  )
}

/* ---------------------------------------------------------------- scroll-driven stage (desktop) */

/** The text for one product. All blocks share one grid cell; the inactive ones slide away and are inert. */
function Copy({ product: p, active, side, onOpen }: { product: Product; active: boolean; side: number; onOpen: (p: Product) => void }) {
  const exitY = side < 0 ? -18 : 18
  const tr = (k: number) => ({ duration: active ? 0.75 : 0.35, ease: ease.out, delay: active ? 0.1 + k * 0.07 : 0 })
  const fade = (k: number) => ({ initial: false as const, animate: { opacity: active ? 1 : 0, y: active ? 0 : exitY }, transition: tr(k) })
  return (
    <div className="[grid-area:1/1]" aria-hidden={!active} inert={!active}>
      <motion.p {...fade(0)} className="t-label mb-5 flex items-center gap-3">
        <span className="accent-scope text-[var(--accent-ink)]" style={accentVars(p.accent)}>{p.index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-[var(--c-line-strong)]" />
        <span>{p.category}</span>
      </motion.p>
      <div className="overflow-hidden pb-[0.1em]">
        <motion.h3 initial={false} animate={{ y: active ? '0%' : side < 0 ? '-115%' : '115%' }} transition={tr(1)} className="t-product !text-[clamp(2.75rem,1rem+4vw,5rem)]">
          {p.name}
        </motion.h3>
      </div>
      <motion.p {...fade(2)} className="mt-5 font-display text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-medium leading-[1.15] tracking-tight">{p.tagline}</motion.p>
      <motion.p {...fade(3)} className="t-body mt-3 !max-w-[40ch]">{p.blurb}</motion.p>
      <motion.div {...fade(4)} className="mt-6"><Highlights product={p} /></motion.div>
      <motion.div {...fade(5)} className="mt-8"><DetailsButton product={p} onOpen={onOpen} /></motion.div>
    </div>
  )
}

/** One full composition per product. GSAP wipes each layer in over the previous one. */
function Layer({ product: p, index }: { product: Product; index: number }) {
  const [a, b] = p.media.showcase ?? [0, 1]
  const main = p.media.shots[a]
  const front = p.media.shots[b]
  return (
    <div data-layer className="absolute inset-0" style={{ zIndex: index, clipPath: index === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}>
      <div aria-hidden="true" className="absolute inset-0 bg-[var(--color-bg-2)]" />
      <div aria-hidden="true" className="absolute -inset-10 opacity-[calc(0.7_*_var(--glow-k))] blur-3xl" style={{ background: `radial-gradient(50% 50% at 55% 50%, ${p.accent}30, transparent 70%)` }} />
      {main ? (
        <>
          <figure className="absolute inset-0 bottom-[11%] right-[13%] m-0">
            <div className="shot h-full w-full">
              <img data-main src={main.src} {...stillSet(main.src)} sizes="48vw" alt={main.alt} width={1920} height={1080} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" className="fade-caption h-full w-full object-cover object-top" />
            </div>
          </figure>
          {front && (
            <figure data-front className="absolute bottom-0 right-0 m-0 w-[50%]">
              <div className="shot ring-1 ring-[color:var(--c-ring)]">
                <img src={front.src} {...stillSet(front.src)} sizes="28vw" alt={front.alt} width={1920} height={1080} loading="lazy" decoding="async" className="fade-caption w-full object-cover object-top" style={{ aspectRatio: '16 / 9.5' }} />
              </div>
            </figure>
          )}
        </>
      ) : (
        <div className="absolute inset-0 bottom-[11%] right-[13%]"><Concept product={p} /></div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- cards (phones, tablets, reduced motion) */

function Card({ product: p, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const shot = p.media.shots[p.media.showcase?.[0] ?? 0]
  return (
    <article className="flex h-full flex-col">
      {/* a screenshot sits on the dark .shot matte; the text-only concept panel gets a normal surface */}
      <div className={`relative overflow-hidden rounded-[var(--radius-lg)] ${shot ? 'shot !rounded-[var(--radius-lg)]' : 'bg-[var(--color-surface)] shadow-[var(--shadow-lift)]'}`} style={{ aspectRatio: '16 / 10.4' }}>
        {shot ? (
          <img src={shot.src} {...stillSet(shot.src)} sizes="(min-width: 1024px) 44vw, (min-width: 640px) 56vw, 84vw" alt={shot.alt} width={1920} height={1080} loading="lazy" decoding="async" className="fade-caption h-full w-full object-cover object-top" />
        ) : (
          <Concept product={p} />
        )}
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <p className="t-label accent-scope text-[var(--accent-ink)]" style={accentVars(p.accent)}>{p.index} · {p.category}</p>
        <h3 className="t-product mt-2 !text-[clamp(2rem,1.4rem+2.4vw,2.75rem)]">{p.name}</h3>
        <p className="mt-2 font-display text-[1.125rem] font-medium leading-snug tracking-tight">{p.tagline}</p>
        <p className="t-body mt-2 !text-[0.9375rem]">{p.blurb}</p>
        <div className="mt-4"><Highlights product={p} /></div>
        <div className="mt-auto pt-6"><DetailsButton product={p} onOpen={onOpen} /></div>
      </div>
    </article>
  )
}

/** Swipeable on phones and tablets: the name and image change as you swipe. */
function Carousel({ onOpen }: { onOpen: (p: Product) => void }) {
  return (
    <SwipeList label="Products" itemClass="w-[84%] sm:w-[56%]">
      {products.map((p) => <Card key={p.slug} product={p} onOpen={onOpen} />)}
    </SwipeList>
  )
}

/* ---------------------------------------------------------------- section */

/**
 * Product ecosystem. On desktop a sticky stage is scrubbed by GSAP ScrollTrigger (no pinning, no
 * hijacking): the product name, copy and image change as you scroll, like the old deep dive. Each
 * project's full details, including that deep-dive workflow, open from the one-word "Details" label.
 */
export function ProductScroll() {
  const reduced = useReducedMotion() ?? false
  const lgUp = useMediaQuery(queries.desktop)
  const [failed, setFailed] = useState(false)
  const [step, setStep] = useState(0)
  const [sheet, setSheet] = useState<Product | null>(null)
  const track = useRef<HTMLDivElement>(null)
  const ctl = useRef<{ st: { start: number; end: number }; total: number } | null>(null)
  const scrub = lgUp && !reduced && !failed

  useEffect(() => {
    if (!scrub || !track.current) return
    let cancelled = false
    let revert: (() => void) | undefined
    // GSAP is loaded on demand. The track's height is static CSS, so deferring it cannot shift layout.
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        const el = track.current
        if (cancelled || !el) return
        gsap.registerPlugin(ScrollTrigger)
        const ctx = gsap.context(() => {
          const layers = gsap.utils.toArray<HTMLElement>('[data-layer]', el)
          const tl = gsap.timeline({ defaults: { ease: 'none' } })
          layers.forEach((layer, i) => {
            if (i === 0) return
            const at = i - 1 + 0.15
            tl.fromTo(layer, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, at)
            const main = layer.querySelector('[data-main]')
            const front = layer.querySelector('[data-front]')
            if (main) tl.fromTo(main, { scale: 1.12 }, { scale: 1, duration: 1.2 }, at)
            if (front) tl.fromTo(front, { yPercent: 14 }, { yPercent: 0, duration: 1.2 }, at)
          })
          tl.to({}, { duration: 0.35 })
          const total = tl.duration()
          el.style.setProperty('--k', String(total))
          const st = ScrollTrigger.create({
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            animation: tl,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // layer i is fully wiped in at t = i + 0.15; switch the copy halfway through the wipe
              const idx = Math.max(0, Math.min(N - 1, Math.floor(self.progress * total + 0.35)))
              setStep((s) => (s === idx ? s : idx))
              el.style.setProperty('--p', String(self.progress))
            },
          })
          ctl.current = { st, total }
        }, el)
        document.fonts?.ready.then(() => ScrollTrigger.refresh())
        revert = () => { ctl.current = null; ctx.revert() }
      })
      .catch(() => setFailed(true))
    return () => { cancelled = true; revert?.() }
  }, [scrub])

  const goTo = (i: number) => {
    const c = ctl.current
    if (!c) { track.current?.scrollIntoView({ block: 'start' }); return }
    const p = Math.min(1, (i + 0.2) / c.total)
    window.scrollTo({ top: c.st.start + p * (c.st.end - c.st.start), behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <section className="section section--raised !pb-0" id="products" aria-labelledby="eco-title">
      <div className="container-x">
        <div className="heading-compact flex items-end justify-between gap-6">
          <SectionHeading titleId="eco-title" className="flex-1" eyebrow="Product ecosystem" lines={['Real products. One ecosystem.']} />
          {scrub && (
            <p className="t-label hidden items-center gap-2 pb-3 lg:flex" aria-hidden="true">
              Scroll to explore <ArrowDown size={14} className="animate-[nudge-y_1.8s_ease-in-out_infinite]" />
            </p>
          )}
        </div>
      </div>

      {scrub ? (
        <>
          <div ref={track} className="relative -mt-6 lg:-mt-12" style={{ height: `calc(100svh + ${(N - 1) * STEP_VH}vh)`, '--p': 0, '--k': TOTAL } as CSSProperties}>
            <div className="sticky top-0 flex h-[100svh] items-center pt-[var(--header-h)]">
              <div className="container-x w-full">
                <div className="grid-12 items-center">
                  <div className="col-span-5 pr-4">
                    <div className="grid">
                      {products.map((p, i) => <Copy key={p.slug} product={p} active={i === step} side={Math.sign(i - step)} onOpen={setSheet} />)}
                    </div>
                    <div role="group" aria-label="Choose a product" className="mt-10 flex items-center">
                      {products.map((p, i) => (
                        <Fragment key={p.slug}>
                          <button
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`${p.index}, ${p.name}`}
                            aria-current={i === step || undefined}
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] transition-colors ${i === step ? 'border-[var(--c-accent)] text-[var(--c-accent)]' : 'border-[var(--c-line-strong)] text-[var(--c-muted)] hover:text-[var(--c-fg)]'}`}
                          >
                            {p.index}
                          </button>
                          {i < N - 1 && (
                            <span aria-hidden="true" className="relative h-px w-10 bg-[var(--c-line)] xl:w-14">
                              <span className="absolute inset-0 origin-left bg-[var(--c-accent)]" style={{ transform: `scaleX(clamp(0, calc(var(--p) * var(--k) - ${i + 0.15}), 1))` }} />
                            </span>
                          )}
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-7">
                    <div className="relative" style={{ aspectRatio: '16 / 10.6' }}>
                      {products.map((p, i) => <Layer key={p.slug} product={p} index={i} />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[clamp(48px,6vw,96px)]" aria-hidden="true" />
        </>
      ) : (
        <div className="container-x mt-10 pb-[var(--section-y)]">
          {reduced || lgUp ? (
            <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
              {products.map((p) => <li key={p.slug}><Card product={p} onOpen={setSheet} /></li>)}
            </ul>
          ) : (
            <Carousel onOpen={setSheet} />
          )}
        </div>
      )}

      {sheet && <ProductSheet key={sheet.slug} product={sheet} onClose={() => setSheet(null)} />}
    </section>
  )
}
