import type { ReactNode } from 'react'
import { TextReveal } from './TextReveal'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  eyebrow: string
  lines: string[]
  lead?: ReactNode
  index?: string
  as?: 'h1' | 'h2'
  className?: string
  align?: 'left' | 'split'
  size?: 't-h1' | 't-h2'
  titleId?: string
}

export function SectionHeading({ eyebrow, lines, lead, index, as = 'h2', className = '', align = 'left', size = 't-h2', titleId }: SectionHeadingProps) {
  return (
    <header className={`grid-12 items-end ${className}`}>
      <div className={align === 'split' ? 'col-span-12 lg:col-span-7' : 'col-span-12 lg:col-span-9'}>
        <Reveal>
          <p className="t-label mb-6 flex items-center gap-3">
            {index && <span className="text-[var(--c-accent)]">{index}</span>}
            <span aria-hidden="true" className="h-px w-8 bg-[var(--c-line-strong)]" />
            {eyebrow}
          </p>
        </Reveal>
        <TextReveal as={as} id={titleId} lines={lines} className={size} />
      </div>
      {lead && (
        <Reveal delay={0.15} className={align === 'split' ? 'col-span-12 mt-8 lg:col-span-4 lg:col-start-9 lg:mt-0' : 'col-span-12 mt-8 lg:col-span-6'}>
          <div className="t-lead">{lead}</div>
        </Reveal>
      )}
    </header>
  )
}
