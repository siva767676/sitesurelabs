import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { HardHat, Layers, Package, Target, type LucideIcon } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { principles } from '@/data/site'
import { ease } from '@/design/tokens'

const icons: LucideIcon[] = [Package, Target, HardHat, Layers]

function Row({ item, i }: { item: { title: string; body: string }; i: number }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLLIElement>(null)
  // the row crossing the middle of the screen becomes the active one, like a reading guide
  const active = useInView(ref, { margin: '-44% 0px -44% 0px' })
  const Icon = icons[i % icons.length]

  const onMove = (e: React.PointerEvent<HTMLLIElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <motion.li
      ref={ref}
      data-active={active || undefined}
      onPointerMove={onMove}
      className="spot group relative border-t border-[var(--c-line)] last:border-b"
      initial={reduced ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.8, ease: ease.out, delay: i * 0.05 }}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 origin-left scale-x-0 sweep-wash transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-x-100 group-data-[active]:scale-x-100" />
      <span aria-hidden="true" className="pointer-events-none absolute left-0 top-[-1px] h-px w-full origin-left scale-x-0 bg-[var(--c-accent)] transition-transform duration-1000 ease-[var(--ease-out)] group-hover:scale-x-100 group-data-[active]:scale-x-100" />

      <div className="relative grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-7 md:grid-cols-[4rem_minmax(0,1.2fr)_minmax(0,1fr)_3.5rem] md:py-10">
        <span className="t-label transition-colors duration-500 group-hover:text-[var(--c-accent)] group-data-[active]:text-[var(--c-accent)]">0{i + 1}</span>
        <h3 className="font-display text-[clamp(1.75rem,1.1rem+2.4vw,3.25rem)] font-medium leading-none tracking-[-0.035em] transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-x-3 group-data-[active]:translate-x-3">
          {item.title}
        </h3>
        <p className="t-body col-start-2 row-start-2 !max-w-[34ch] transition-colors duration-500 group-hover:text-[var(--c-fg)] group-data-[active]:text-[var(--c-fg)] md:col-start-3 md:row-start-1">{item.body}</p>
        <span className="draw col-start-3 row-span-2 row-start-1 justify-self-end text-[var(--c-accent)] md:col-start-4 md:row-span-1" data-active={active || undefined}>
          <Icon size={32} strokeWidth={1.3} aria-hidden="true" />
        </span>
      </div>
    </motion.li>
  )
}

/** Why SiteSureLabs: four reasons, one line each. The row at the middle of the screen lights up as you scroll. */
export function WhySure() {
  return (
    <section className="section !py-[clamp(56px,9vw,128px)]" aria-labelledby="why-title">
      <div className="container-x heading-compact">
        <SectionHeading titleId="why-title" eyebrow="Why SiteSureLabs" lines={['Built by people who ship product.']} />
        <ul className="mt-12 lg:mt-16">
          {principles.map((p, i) => <Row key={p.title} item={p} i={i} />)}
        </ul>
      </div>
    </section>
  )
}
