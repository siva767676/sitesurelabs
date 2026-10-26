import type { CSSProperties, ReactNode } from 'react'

interface DottedTextProps {
  children: ReactNode
  /** CSS font-size, e.g. "clamp(3rem, 9vw, 9rem)" */
  size?: string
  /** Dot colour; defaults to the theme's accent. */
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
export function DottedText({ children, size = 'clamp(3rem, 9vw, 9rem)', color, sweep = true, className = '', as: Tag = 'span' }: DottedTextProps) {
  const style = { fontSize: size, ...(color ? { '--dot-color': color } : {}) } as CSSProperties
  return (
    <Tag className={`dotted ${sweep ? 'dotted--sweep' : ''} ${className}`} style={style}>
      {children}
    </Tag>
  )
}
