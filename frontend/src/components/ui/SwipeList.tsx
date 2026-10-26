import { useRef, useState, type ReactNode } from 'react'
import { queries } from '@/design/tokens'
import { useMediaQuery } from '@/lib/hooks'

interface SwipeListProps {
  /** One entry per slide. */
  children: ReactNode[]
  /** Accessible name of the list. */
  label: string
  as?: 'ul' | 'ol'
  /**
   * From the md breakpoint up, lay the slides out as a grid instead of a swipe row. Pass the whole grid
   * as classes, e.g. "md:grid md:grid-cols-2 md:gap-6". Leave it out to swipe at every width.
   */
  grid?: string
  /** Slide width while swiping. */
  itemClass?: string
  className?: string
}

/**
 * Horizontal swipe row with scroll-snap and position dots, so a stack of images or cards costs one screen of
 * vertical scrolling on a phone instead of many. Native scrolling: momentum, snapping and the keyboard all work
 * without any script, and the row is a focusable region while it scrolls.
 */
export function SwipeList({ children, label, as: Tag = 'ul', grid, itemClass = 'w-[84%] sm:w-[56%]', className = '' }: SwipeListProps) {
  const list = useRef<HTMLUListElement & HTMLOListElement>(null)
  const [i, setI] = useState(0)
  const swiping = useMediaQuery(grid ? queries.mobile : 'all')
  const n = children.length

  const onScroll = () => {
    const el = list.current
    const first = el?.firstElementChild as HTMLElement | null
    if (!el || !first) return
    setI(Math.min(n - 1, Math.round(el.scrollLeft / (first.offsetWidth + 16))))
  }

  const row = 'no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2'
  const asGrid = grid ? `md:mx-0 md:snap-none md:overflow-visible md:px-0 md:pb-0 ${grid}` : ''

  return (
    <>
      <Tag
        ref={list}
        aria-label={label}
        tabIndex={swiping ? 0 : undefined}
        onScroll={onScroll}
        className={`${row} ${asGrid} ${className}`}
      >
        {children.map((c, k) => (
          <li key={k} className={`shrink-0 snap-center ${itemClass} ${grid ? 'md:w-auto md:shrink' : ''}`}>{c}</li>
        ))}
      </Tag>
      <div className={`mt-4 flex justify-center gap-2 ${grid ? 'md:hidden' : ''}`} aria-hidden="true">
        {children.map((_, k) => <span key={k} className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? 'w-6 bg-[var(--c-accent)]' : 'w-1.5 bg-[var(--c-line-strong)]'}`} />)}
      </div>
    </>
  )
}
