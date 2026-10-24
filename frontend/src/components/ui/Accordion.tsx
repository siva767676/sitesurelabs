import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { ease } from '@/design/tokens'

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const uid = useId()
  return (
    <div className="hairline-t">
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={it.q} className="hairline-b">
            <h3>
              <button
                type="button"
                id={`${uid}-h-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-p-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-[72px] w-full items-center justify-between gap-6 py-5 text-left font-display text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] font-medium tracking-tight"
              >
                {it.q}
                <Plus aria-hidden="true" className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45 text-[var(--c-accent)]' : ''}`} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${uid}-p-${i}`}
                  role="region"
                  aria-labelledby={`${uid}-h-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: ease.out }}
                  className="overflow-hidden"
                >
                  <p className="t-body pb-7 pr-10">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
