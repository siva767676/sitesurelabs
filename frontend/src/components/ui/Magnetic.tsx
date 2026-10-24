import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useFinePointer, usePrefersReducedMotion } from '@/lib/hooks'

/** Subtle cursor-attracted movement. Inert on touch devices and for reduced-motion users;
 *  never alters click or keyboard behaviour. */
export function Magnetic({ children, strength = 0.28, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })
  const enabled = fine && !reduced

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => { x.set(0); y.set(0) }

  if (!enabled) return <div className={`inline-block ${className}`}>{children}</div>
  return (
    <div ref={ref} className={`inline-block p-3 -m-3 ${className}`} onPointerMove={onMove} onPointerLeave={reset}>
      <motion.div style={{ x: sx, y: sy }}>{children}</motion.div>
    </div>
  )
}
