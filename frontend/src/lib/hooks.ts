import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from 'react'
import { queries } from '@/design/tokens'

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useFinePointer = () => useMediaQuery(queries.finePointer)
export const useIsMobile = () => useMediaQuery(queries.mobile)
export const usePrefersReducedMotion = () => useMediaQuery(queries.reducedMotion)

/** True while the element is within (or near) the viewport. */
export function useInView<T extends Element>(rootMargin = '200px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])
  return [ref, inView] as const
}

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** Heuristic: should we skip the heavy 3D scene entirely? */
export function isLowPowerDevice(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number }
  if (nav.connection?.saveData) return true
  if (nav.connection?.effectiveType && /^(slow-2g|2g|3g)$/.test(nav.connection.effectiveType)) return true // a ~250 kB chunk for decoration
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 2) return true
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) return true
  return false
}

/** Roving-tabindex keyboard handling for a tablist: arrows move, Home/End jump. */
export function useRovingTabs(count: number, active: number, setActive: (i: number) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKeyDown = (e: KeyboardEvent) => {
    const k = e.key
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(k)) return
    e.preventDefault()
    const next = k === 'Home' ? 0 : k === 'End' ? count - 1 : (active + (k === 'ArrowDown' || k === 'ArrowRight' ? 1 : -1) + count) % count
    setActive(next)
    refs.current[next]?.focus()
  }
  return { refs, onKeyDown }
}
