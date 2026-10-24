import type { CSSProperties, ReactNode } from 'react'

interface DottedTextProps {
  children: ReactNode
  /** CSS font-size, e.g. "clamp(3rem, 9vw, 9rem)" */
  size?: string
  color?: string
  sweep?: boolean
  className?: string
  as?: 'span' | 'div' | 'p' | 'h2'
}

/**
 * Halftone / dotted display type. It is real text (selectable, indexable, screen-reader friendly)
 * filled with a dot pattern via background-clip, so it stays crisp at any size and needs no canvas.
 * Intended for short display statements only.
 */
export function DottedText({ children, size = 'clamp(3rem, 9vw, 9rem)', color = '#58d5ff', sweep = true, className = '', as: Tag = 'span' }: DottedTextProps) {
  const style = { fontSize: size, '--dot-color': color } as CSSProperties
  return (
    <Tag className={`dotted ${sweep ? 'dotted--sweep' : ''} ${className}`} style={style}>
      {children}
    </Tag>
  )
}
