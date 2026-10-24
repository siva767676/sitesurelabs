import { useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { ArrowUpRight, Play } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { VideoDialog } from '@/components/ui/VideoDialog'
import { Button } from '@/components/ui/Button'
import { products, type Product } from '@/data/products'
import { ease } from '@/design/tokens'
import { useFinePointer } from '@/lib/hooks'

/** Cropping a few % off the bottom removes the burned-in captions of the source demo videos. */
const RATIO = '16 / 9.5'

function Stage({ product }: { product: Product }) {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 80, damping: 20 }), sy = useSpring(my, { stiffness: 80, damping: 20 })
  const backX = useTransform(sx, (v) => v * -10), backY = useTransform(sy, (v) => v * -8)
  const frontX = useTransform(sx, (v) => v * 16), frontY = useTransform(sy, (v) => v * 12)
  const [a, b] = product.media.showcase ?? [0, 1]
  const primary = product.media.shots[a], secondary = product.media.shots[b]

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!fine || reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  if (!primary) {
    // Planned product: honest concept panel, clearly labelled, no fake UI.
    return (
      <div className="relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] border border-dashed border-[var(--c-line-strong)] p-8">
        <span className="chip self-start"><span className="chip__dot" /> In development</span>
        <svg viewBox="0 0 600 200" className="w-full" role="img" aria-label="Concept illustration of a milestone timeline">
          <line x1="20" y1="100" x2="580" y2="100" stroke="var(--c-line-strong)" strokeDasharray="4 6" />
          {[60, 190, 320, 450].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy="100" r={i < 2 ? 9 : 7} fill={i < 2 ? product.accent : 'none'} stroke={product.accent} strokeWidth="2" />
              <line x1={x} y1="100" x2={x} y2={i % 2 ? 150 : 50} stroke="var(--c-line-strong)" />
            </g>
          ))}
        </svg>
        <p className="t-caption">Concept illustration. Product details will be published once confirmed.</p>
      </div>
    )
  }

  return (
    <div className="relative" style={{ aspectRatio: '16 / 10.4' }} onPointerMove={onMove}>
      <div aria-hidden="true" className="absolute -inset-10 -z-10 opacity-60 blur-3xl" style={{ background: `radial-gradient(50% 50% at 50% 50%, ${product.accent}33, transparent 70%)` }} />
      <motion.figure className="absolute inset-0 right-[14%] bottom-[10%] m-0" style={{ x: backX, y: backY }}>
        <div className="shot h-full w-full">
          <img src={primary.src} alt={primary.alt} width={1920} height={1080} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" style={{ aspectRatio: RATIO }} />
        </div>
      </motion.figure>
      {secondary && (
        <motion.figure className="absolute bottom-0 right-0 m-0 w-[52%]" style={{ x: frontX, y: frontY }}>
          <div className="shot ring-1 ring-white/10">
            <img src={secondary.src} alt={secondary.alt} width={1920} height={1080} loading="lazy" decoding="async" className="w-full object-cover object-top" style={{ aspectRatio: RATIO }} />
          </div>
        </motion.figure>
      )}
    </div>
  )
}

export function EcosystemShowcase() {
  const [active, setActive] = useState(0)
  const [video, setVideo] = useState<Product | null>(null)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const p = products[active]

  const onKey = (e: KeyboardEvent) => {
    const k = e.key
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(k)) return
    e.preventDefault()
    const n = products.length
    const next = k === 'Home' ? 0 : k === 'End' ? n - 1 : (active + (k === 'ArrowDown' || k === 'ArrowRight' ? 1 : -1) + n) % n
    setActive(next)
    refs.current[next]?.focus()
  }

  return (
    <section className="section section--raised" aria-labelledby="eco-title" id="products">
      <div className="container-x">
        <SectionHeading titleId="eco-title"
          index="01"
          eyebrow="Product ecosystem"
          lines={['Real products.', 'One intelligence layer.']}
          lead="Each product solves a specific operational problem in construction, and they are built to work as a connected system under one platform."
          align="split"
        />

        <div className="grid-12 mt-16 gap-y-10 lg:mt-24">
          {/* selector */}
          <div className="col-span-12 lg:col-span-4">
            <div role="tablist" aria-orientation="vertical" aria-label="Products" onKeyDown={onKey} className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0">
              {products.map((pr, i) => {
                const on = i === active
                return (
                  <button
                    key={pr.slug}
                    ref={(el) => { refs.current[i] = el }}
                    role="tab"
                    id={`eco-tab-${pr.slug}`}
                    aria-selected={on}
                    aria-controls="eco-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={`group relative shrink-0 border-[var(--c-line)] text-left transition-colors lg:border-t lg:py-6 ${on ? 'text-[var(--c-fg)]' : 'text-[var(--c-muted)] hover:text-[var(--c-fg)]'} max-lg:rounded-full max-lg:border max-lg:px-5 max-lg:py-3 ${on ? 'max-lg:border-[var(--c-accent)]' : ''}`}
                  >
                    {on && <motion.span layoutId="eco-bar" aria-hidden="true" className="absolute left-0 top-0 hidden h-px w-full bg-[var(--c-accent)] lg:block" transition={{ duration: 0.5, ease: ease.out }} />}
                    <span className="flex items-baseline gap-4">
                      <span className="t-label w-6 shrink-0">{pr.index}</span>
                      <span className="t-product !text-[clamp(1.5rem,1rem+1.6vw,2.5rem)] !leading-none">{pr.name}</span>
                      {pr.status === 'planned' && <span className="t-label hidden xl:inline">soon</span>}
                    </span>
                  </button>
                )
              })}
              <div className="hidden border-t border-[var(--c-line)] lg:block" />
            </div>
          </div>

          {/* stage */}
          <div className="col-span-12 lg:col-span-8" role="tabpanel" id="eco-panel" aria-labelledby={`eco-tab-${p.slug}`}>
            <div className="min-h-[260px] lg:min-h-[480px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={p.slug}
                  initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
                  animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.8, ease: ease.inOut }}
                >
                  <Stage product={p} />
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={p.slug + '-copy'}
                className="mt-10 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: ease.out, delay: 0.2 }}
              >
                <div>
                  <p className="t-label mb-3" style={{ color: p.accent }}>{p.category}</p>
                  <p className="font-display text-[clamp(1.4rem,1.1rem+1vw,2.1rem)] font-medium leading-tight tracking-tight">{p.tagline}</p>
                  <p className="t-body mt-4">{p.summary}</p>
                </div>
                <div className="flex flex-wrap gap-3 md:justify-end">
                  {p.media.demoVideo && (
                    <Button variant="secondary" size="sm" onClick={() => setVideo(p)}>
                      <Play size={14} aria-hidden="true" className="-ml-1 mr-0.5 inline" /> Watch demo
                    </Button>
                  )}
                  <Link to={`/products/${p.slug}`} className="btn btn--primary btn--sm">Explore {p.name} <ArrowUpRight size={16} aria-hidden="true" /></Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      {video?.media.demoVideo && <VideoDialog open onClose={() => setVideo(null)} src={video.media.demoVideo} title={video.name} poster={video.media.cover} />}
    </section>
  )
}
