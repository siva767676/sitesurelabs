import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { LogoMark } from '@/components/brand/Logo'
import { getProduct } from '@/data/products'
import { principles, site } from '@/data/site'
import { services } from '@/data/services'
import { stillSet } from '@/lib/images'
import { ease } from '@/design/tokens'

/**
 * The right-hand side of each interior page's hero (large screens). Each one shows what its page is about:
 * the real product screens, an index of the services, the logo with the principles around it, a signal leaving
 * the mark. Built only from existing content and theme tokens, so both themes work without changes.
 */

/* ------------------------------------------------------------------ Products: the real screens, layered */

const STACK = [
  { slug: 'digi-reco', box: 'left-[30%] top-0 w-[68%]', from: { x: 40, y: -20 }, delay: 0.25, float: '1.5s' },
  { slug: 'sitevision', box: 'left-0 top-[27%] w-[64%]', from: { x: -40, y: 10 }, delay: 0.4, float: '0s' },
  { slug: 'anviksha', box: 'left-[34%] top-[54%] w-[64%]', from: { x: 30, y: 40 }, delay: 0.55, float: '3s' },
] as const

export function ProductsVisual() {
  const reduced = useReducedMotion()
  return (
    <div aria-hidden="true" className="relative ml-auto aspect-[5/4] w-full max-w-[640px]">
      {STACK.map((c) => {
        const p = getProduct(c.slug)!
        const shot = p.media.shots[p.media.showcase?.[0] ?? 0]
        return (
          <motion.div
            key={c.slug}
            className={`absolute ${c.box}`}
            initial={reduced ? false : { opacity: 0, ...c.from }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: c.delay, duration: 1, ease: ease.out }}
          >
            <div className="visual-float" style={{ '--d': c.float } as React.CSSProperties}>
              <div className="shot !rounded-[var(--radius-lg)] ring-1 ring-[color:var(--c-ring)] transition-transform duration-500 hover:-translate-y-1.5">
                <img src={shot.src} {...stillSet(shot.src)} sizes="(min-width: 1024px) 28vw, 0px" alt="" width={1920} height={1080} loading="eager" decoding="async" className="w-full object-cover object-top" style={{ aspectRatio: '16 / 10' }} />
                <span className="absolute left-3 top-3 rounded-full border border-[var(--c-line-strong)] bg-[var(--color-surface)]/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--c-fg)] backdrop-blur">{p.name}</span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ Services: a live index of the eight */

export function ServicesVisual() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  // the index follows the service being read
  useEffect(() => {
    const els = services.map((s) => document.getElementById(s.slug))
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(services.findIndex((s) => s.slug === hit.target.id))
      },
      { rootMargin: '-25% 0px -60% 0px' },
    )
    els.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])
  const n = services.length
  return (
    <motion.nav
      aria-label="Services index"
      className="relative ml-auto w-full max-w-[520px] rounded-[var(--radius-xl)] border border-[var(--c-line)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-soft)]"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.9, ease: ease.out }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: 'radial-gradient(60% 50% at 100% 0%, rgb(var(--glow-a) / calc(0.12 * var(--glow-k))), transparent 70%)' }} />
      <p className="t-label relative mb-5">The eight services</p>
      <ol className="relative">
        {/* the wire, lit down to the service being read */}
        <span aria-hidden="true" className="absolute bottom-5 left-[15px] top-5 w-px bg-[var(--c-line-strong)]" />
        <span aria-hidden="true" className="absolute left-[15px] top-5 w-px origin-top bg-[var(--color-brand)] transition-[height] duration-700 ease-[var(--ease-out)] motion-reduce:transition-none" style={{ height: `calc((100% - 40px) * ${active / (n - 1)})` }} />
        {services.map((s, i) => {
          const on = i === active
          const done = i <= active
          return (
            <li key={s.slug}>
              <a href={`#${s.slug}`} className="group flex items-center gap-4 py-[9px]">
                <span className={`relative z-10 flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full border font-mono text-[10px] transition-colors duration-500 ${on ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-on-brand)]' : done ? 'border-[var(--color-brand)] bg-[var(--color-surface)] text-[var(--c-fg)]' : 'border-[var(--c-line-strong)] bg-[var(--color-surface)] text-[var(--c-muted)]'}`}>{s.index}</span>
                <span className={`font-display text-[1.05rem] font-medium tracking-tight transition-[color,transform] duration-300 group-hover:translate-x-1 ${on ? 'text-[var(--c-fg)]' : 'text-[var(--c-muted)] group-hover:text-[var(--c-fg)]'}`}>{s.title}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </motion.nav>
  )
}

/* ------------------------------------------------------------------ About: the mark, with the four principles */

const AT = ['left-[3%] top-[8%]', 'right-[3%] top-[22%]', 'left-[3%] bottom-[22%]', 'right-[3%] bottom-[8%]'] as const

export function AboutVisual() {
  const reduced = useReducedMotion()
  return (
    <motion.div
      aria-hidden="true"
      className="grid-paper relative ml-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--c-line)] bg-[var(--color-surface)] shadow-[var(--shadow-soft)]"
      initial={reduced ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 1, ease: ease.out }}
    >
      <div className="absolute inset-0" style={{ background: 'radial-gradient(55% 55% at 50% 48%, rgb(var(--glow-a) / calc(0.2 * var(--glow-k))), transparent 70%)' }} />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" focusable="false">
        {[[4, 4, 1, 1], [96, 4, -1, 1], [4, 96, 1, -1], [96, 96, -1, -1]].map(([x, y, a, b]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y + 3 * b}V${y}H${x + 3 * a}`} fill="none" stroke="var(--color-muted)" strokeWidth="0.35" />
        ))}
        <circle cx="50" cy="50" r="30" fill="none" stroke="var(--color-line-strong)" strokeWidth="0.3" strokeDasharray="1 2" />
      </svg>
      <LogoMark className="mark-rise absolute left-1/2 top-1/2 h-[52%] w-auto -translate-x-1/2 -translate-y-1/2" />
      {principles.map((p, i) => (
        <span key={p.title} className={`absolute ${AT[i]} rounded-full border border-[var(--c-line-strong)] bg-[var(--color-surface)]/90 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--c-fg)] backdrop-blur`}>{p.title}</span>
      ))}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ Contact: a signal leaving the mark */

export function ContactVisual() {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className="relative ml-auto w-full max-w-[460px]"
      initial={reduced ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.9, ease: ease.out }}
    >
      <div aria-hidden="true" className="relative aspect-square w-full">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="ping-ring absolute inset-0 m-auto rounded-full border border-[var(--c-line-strong)]"
            style={{ width: `${88 - i * 6}%`, height: `${88 - i * 6}%`, '--d': `${i * 1.6}s`, opacity: reduced ? 0.55 - i * 0.15 : undefined } as React.CSSProperties}
          />
        ))}
        <span className="absolute inset-0 m-auto h-[62%] w-[62%] rounded-full border border-[var(--c-line)] bg-[var(--color-surface)] shadow-[var(--shadow-lift)]" />
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(40% 40% at 50% 50%, rgb(var(--glow-a) / calc(0.22 * var(--glow-k))), transparent 72%)' }} />
        <LogoMark className="mark-rise absolute left-1/2 top-1/2 h-[34%] w-auto -translate-x-1/2 -translate-y-1/2" />
      </div>
      <a href={`mailto:${site.email}`} className="link-arrow relative mx-auto mt-2 flex w-fit">{site.email}<ArrowUpRight size={14} aria-hidden="true" /></a>
    </motion.div>
  )
}
