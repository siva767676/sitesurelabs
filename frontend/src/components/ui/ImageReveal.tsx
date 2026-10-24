import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ease } from '@/design/tokens'

interface ImageRevealProps {
  src: string
  alt: string
  /** CSS aspect-ratio, e.g. "16 / 10" */
  ratio?: string
  position?: string
  priority?: boolean
  className?: string
  /** controlled zoom on hover */
  zoom?: boolean
  width?: number
  height?: number
}

/** Image with a clip-path reveal, controlled settle-zoom, loading skeleton and intentional crop. */
export function ImageReveal({ src, alt, ratio = '16 / 10', position = '50% 50%', priority, className = '', zoom = true, width = 1920, height = 1080 }: ImageRevealProps) {
  const reduced = useReducedMotion()
  const [loaded, setLoaded] = useState(false)
  return (
    <motion.div
      className={`group relative overflow-hidden bg-[var(--color-surface)] ${className}`}
      style={{ aspectRatio: ratio }}
      initial={reduced ? false : { clipPath: 'inset(0 0 100% 0)' }}
      whileInView={reduced ? undefined : { clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1.1, ease: ease.inOut }}
    >
      {!loaded && <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-[var(--color-surface-2)]" />}
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] ${zoom ? 'group-hover:scale-[1.035]' : ''}`}
        style={{ objectPosition: position, opacity: loaded ? 1 : 0 }}
        initial={reduced ? false : { scale: 1.18 }}
        whileInView={reduced ? undefined : { scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: ease.out }}
      />
    </motion.div>
  )
}
