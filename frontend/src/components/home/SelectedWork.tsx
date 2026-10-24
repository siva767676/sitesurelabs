import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { VideoDialog } from '@/components/ui/VideoDialog'
import { liveProducts, type Product } from '@/data/products'
import { isLowPowerDevice } from '@/lib/hooks'

/** Muted looping preview that only plays while on screen. Falls back to the poster still. */
function Loop({ product, ratio }: { product: Product; ratio: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [enabled] = useState(() => !isLowPowerDevice())
  // The poster is only attached once the tile is near the viewport, so it never competes with first paint.
  const [near, setNear] = useState(false)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const preload = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); preload.disconnect() } }, { rootMargin: '600px' })
    preload.observe(v)
    if (reduced || !enabled) return () => preload.disconnect()
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause() }, { threshold: 0.25 })
    io.observe(v)
    return () => { preload.disconnect(); io.disconnect() }
  }, [reduced, enabled])
  return (
    <video
      ref={ref}
      muted loop playsInline preload="none"
      poster={near ? product.media.cover : undefined}
      aria-hidden="true"
      className="h-full w-full object-cover object-top transition-transform duration-[1400ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
      style={{ aspectRatio: ratio }}
    >
      {near && !reduced && enabled && product.media.loopVideo && <source src={product.media.loopVideo} type="video/mp4" />}
    </video>
  )
}

const layout = [
  { span: 'lg:col-span-7', ratio: '16 / 10.5' },
  { span: 'lg:col-span-5', ratio: '16 / 12.6' },
  { span: 'lg:col-span-12', ratio: '21 / 9' },
]

export function SelectedWork() {
  const [open, setOpen] = useState<Product | null>(null)
  return (
    <section className="section section--raised" aria-labelledby="work-title">
      <div className="container-x">
        <SectionHeading titleId="work-title" index="07" eyebrow="Selected work" lines={['The products,', 'in action.']} lead="Product demonstrations recorded from the real applications. Customer case studies will be published here as they are verified and approved." align="split" />

        <div className="grid-12 mt-16 gap-y-10 lg:mt-24">
          {liveProducts.map((p, i) => (
            <Reveal key={p.slug} kind="clipUp" delay={0.05} className={`col-span-12 ${layout[i].span}`}>
              <article className="group">
                <button type="button" onClick={() => setOpen(p)} className="relative block w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--c-line)] text-left" aria-label={`Watch the demo: ${p.name}`}>
                  <Loop product={p} ratio={layout[i].ratio} />
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgb(7_11_20/0.75)] via-transparent to-transparent" />
                  <span className="absolute bottom-5 left-5 flex items-center gap-3 rounded-full bg-white/10 py-2 pl-2 pr-5 text-sm font-medium backdrop-blur-md transition-colors group-hover:bg-white group-hover:text-[var(--color-bg)]">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)] text-[#04101a]"><Play size={14} fill="currentColor" /></span>
                    Watch the demo
                  </span>
                </button>
                <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="t-label mb-2" style={{ color: p.accent }}>{p.category}</p>
                    <h3 className="t-h3">{p.name}</h3>
                    <p className="t-body mt-2">{p.tagline}</p>
                  </div>
                  <div className="flex items-center gap-5 text-[var(--fs-caption)]">
                    <span className="chip whitespace-nowrap">Case study · coming soon</span>
                    <Link to={`/products/${p.slug}`} className="link-arrow">Product page</Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
      {open?.media.demoVideo && <VideoDialog open onClose={() => setOpen(null)} src={open.media.demoVideo} title={open.name} poster={open.media.cover} />}
    </section>
  )
}
