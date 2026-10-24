import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { revealVariants, type RevealKind } from '@/lib/motion'

interface RevealProps {
  children: ReactNode
  kind?: RevealKind
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'section' | 'article' | 'p' | 'span'
}

/** Scroll-triggered reveal with selectable treatment. Renders statically for reduced-motion users. */
export function Reveal({ children, kind = 'fadeUp', delay = 0, className, as = 'div' }: RevealProps) {
  const reduced = useReducedMotion()
  const Tag = motion[as] as typeof motion.div
  if (reduced) return <Tag className={className}>{children}</Tag>
  const v = revealVariants[kind]
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      variants={{ hidden: v.hidden, show: { ...v.show, transition: { ...(v.show.transition as object), delay } } }}
    >
      {children}
    </Tag>
  )
}
