import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Play, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { VideoDialog } from '@/components/ui/VideoDialog'
import type { Product } from '@/data/products'
import { ease } from '@/design/tokens'
import { accentVars } from '@/lib/accent'
import { stillSet } from '@/lib/images'
import { useRovingTabs } from '@/lib/hooks'

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.out } },
}

/**
 * Full details for one project, opened from the "Details" label on the home ecosystem.
 * Native <dialog>: focus is trapped, Esc closes, the page behind is inert. The right-hand side is the
 * former "deep dive": click or arrow-key through the real product screens, step by step.
 */
export function ProductSheet({ product: p, onClose }: { product: Product; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [closing, setClosing] = useState(false)
  const [video, setVideo] = useState(false)
  const [step, setStep] = useState(0)
  const steps = p.workflow.filter((w) => w.shot !== undefined)
  const { refs, onKeyDown } = useRovingTabs(steps.length, step, setStep)
  const current = steps[step]
  const shot = current ? p.media.shots[current.shot!] : undefined

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (!d.open) d.showModal()
    // Lock the page behind (keeps the scroll-driven stage where it was) without a layout jump.
    const prev = document.body.style.overflow
    const bar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (bar > 0) document.body.style.paddingRight = `${bar}px`
    return () => {
      document.body.style.overflow = prev
      document.body.style.paddingRight = ''
    }
  }, [])

  const close = () => {
    if (closing) return
    setClosing(true)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.setTimeout(() => {
      ref.current?.close()
      onClose()
    }, reduced ? 0 : 240)
  }

  return (
    <>
      <dialog
        ref={ref}
        aria-labelledby={`sheet-title-${p.slug}`}
        data-closing={closing || undefined}
        onCancel={(e) => { e.preventDefault(); close() }}
        onClick={(e) => { if (e.target === ref.current) close() }}
        style={accentVars(p.accent)}
        className="sheet accent-scope m-auto max-h-[min(940px,calc(100svh-20px))] w-[min(1180px,calc(100vw-20px))] max-w-none overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-line-strong)] bg-[var(--color-bg-2)] p-0 text-[var(--color-fg)] shadow-[var(--shadow-lift)] open:flex open:flex-col"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-[calc(0.4_*_var(--glow-k))] blur-3xl" style={{ background: `radial-gradient(closest-side, ${p.accent}, transparent)` }} />

        <header className="relative flex shrink-0 items-center justify-between gap-4 border-b border-[var(--color-line)] px-5 py-4 sm:px-8">
          <p className="t-label flex items-center gap-3">
            <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: p.accent, boxShadow: `0 0 12px ${p.accent}` }} />
            {p.index} · {p.category}
          </p>
          <button type="button" onClick={close} aria-label="Close details" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-line-strong)] transition-colors hover:bg-[var(--c-hover)]">
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8">
          <div className="grid-12 gap-y-10">
            <motion.div className="col-span-12 lg:col-span-5" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}>
              <motion.h2 variants={item} id={`sheet-title-${p.slug}`} className="t-product !text-[clamp(2.5rem,1rem+3.6vw,4rem)]">{p.name}</motion.h2>
              <motion.p variants={item} className="mt-3 font-display text-[1.25rem] font-medium leading-snug tracking-tight">{p.tagline}</motion.p>

              <motion.div variants={item} className="mt-5 space-y-2.5">
                <p className="flex items-baseline gap-4 text-[var(--color-muted)]"><span className="t-label w-[4.5rem] shrink-0">Problem</span>{p.problem.title}</p>
                <p className="flex items-baseline gap-4"><span className="t-label w-[4.5rem] shrink-0 !text-[var(--color-accent)]">Solution</span>{p.solution.title}</p>
              </motion.div>

              <motion.ul variants={item} className="mt-5 flex flex-wrap gap-2" aria-label="Built for">
                {p.audience.map((a) => <li key={a} className="chip normal-case tracking-normal">{a}</li>)}
              </motion.ul>

              <motion.ol variants={item} className="mt-6 border-t border-[var(--color-line)]">
                {p.capabilities.slice(0, 4).map((c, i) => (
                  <li key={c.title} className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-b border-[var(--color-line)] py-3">
                    <span className="t-label pt-1 text-[var(--accent-ink)]">0{i + 1}</span>
                    <div>
                      <h3 className="font-display text-[1.0625rem] font-medium leading-snug tracking-tight">{c.title}</h3>
                      <p className="mt-0.5 text-[0.875rem] leading-snug text-[var(--color-muted)]">{c.body}</p>
                    </div>
                  </li>
                ))}
              </motion.ol>
            </motion.div>

            {/* the former deep dive: step through the real screens */}
            <motion.div className="col-span-12 lg:col-span-7" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.3 }}>
              <div role="tablist" aria-label="Workflow steps" onKeyDown={onKeyDown} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-0 sm:px-0">
                {steps.map((s, i) => {
                  const on = i === step
                  return (
                    <button
                      key={s.title}
                      ref={(el) => { refs.current[i] = el }}
                      role="tab"
                      id={`sheet-step-${p.slug}-${i}`}
                      aria-selected={on}
                      aria-controls={`sheet-panel-${p.slug}`}
                      tabIndex={on ? 0 : -1}
                      onClick={() => setStep(i)}
                      className={`relative shrink-0 rounded-full border px-5 py-2.5 font-display text-[0.9375rem] font-medium tracking-tight transition-colors ${on ? 'border-[var(--accent-ink)] text-[var(--color-fg)]' : 'border-[var(--color-line-strong)] text-[var(--color-muted)] hover:text-[var(--color-fg)]'}`}
                    >
                      <span className={`t-label mr-2.5 ${on ? 'text-[var(--accent-ink)]' : ''}`}>0{i + 1}</span>{s.title}
                    </button>
                  )
                })}
              </div>
              {current && <p className="mt-4 min-h-[1.6em] text-[var(--color-muted)]" aria-live="polite">{current.body}</p>}

              <div id={`sheet-panel-${p.slug}`} role="tabpanel" aria-labelledby={`sheet-step-${p.slug}-${step}`} className="mt-5">
                <AnimatePresence mode="wait">
                  {shot && (
                    <motion.figure
                      key={`${p.slug}-${step}`}
                      className="m-0"
                      initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
                      animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.65, ease: ease.inOut }}
                    >
                      <div className="shot !rounded-[var(--radius-lg)] !shadow-none">
                        <img src={shot.src} {...stillSet(shot.src)} sizes="(min-width: 1024px) 640px, 90vw" alt={shot.alt} width={1920} height={1080} loading="lazy" decoding="async" className="fade-caption w-full object-cover object-top" style={{ aspectRatio: '16 / 9.4' }} />
                      </div>
                      <figcaption className="t-caption mt-3">{shot.caption}</figcaption>
                    </motion.figure>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        {/* phone: "Request a demo" on its own row, then Demo and Full page side by side; from sm up, one row */}
        <footer className="relative grid shrink-0 grid-cols-2 items-center gap-3 border-t border-[var(--color-line)] px-5 py-3 sm:flex sm:flex-wrap sm:justify-between sm:gap-4 sm:px-8 sm:py-4">
          <div className="contents sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            <Button to={`/contact?type=demo&product=${p.slug}`} variant="primary" arrow className="col-span-2 w-full sm:col-auto sm:w-auto">Request a demo</Button>
            {p.media.demoVideo && (
              <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setVideo(true)}>
                <Play size={14} fill="currentColor" aria-hidden="true" className="-ml-1 mr-1.5 inline" />Demo
              </Button>
            )}
          </div>
          <Link to={`/products/${p.slug}`} className="link-arrow justify-self-center sm:justify-self-auto">Full page <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </footer>
      </dialog>

      {video && p.media.demoVideo && <VideoDialog open onClose={() => setVideo(false)} src={p.media.demoVideo} title={p.name} poster={p.media.cover} />}
    </>
  )
}
