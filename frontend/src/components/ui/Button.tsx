import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Magnetic } from './Magnetic'

type Variant = 'primary' | 'secondary' | 'light' | 'ink' | 'ghost'

interface Common {
  children: ReactNode
  variant?: Variant
  size?: 'md' | 'sm'
  arrow?: boolean
  magnetic?: boolean
  className?: string
}
type AsLink = Common & { to: string; href?: never; onClick?: never; type?: never; loading?: never; disabled?: never }
type AsAnchor = Common & { href: string; to?: never; onClick?: never; type?: never; loading?: never; disabled?: never }
type AsButton = Common & {
  to?: never; href?: never
  onClick?: () => void
  type?: 'button' | 'submit'
  loading?: boolean
  disabled?: boolean
}

export function Button(props: AsLink | AsAnchor | AsButton) {
  const { children, variant = 'secondary', size = 'md', arrow, magnetic, className = '' } = props
  const cls = `btn btn--${variant} ${size === 'sm' ? 'btn--sm' : ''} ${className}`
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <ArrowRight className="btn__arrow" size={18} aria-hidden="true" />}
    </>
  )

  let el: ReactNode
  if ('to' in props && props.to) {
    el = <Link to={props.to} className={cls}>{inner}</Link>
  } else if ('href' in props && props.href) {
    const external = /^https?:/.test(props.href)
    el = <a href={props.href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</a>
  } else {
    const b = props as AsButton
    el = (
      <button type={b.type ?? 'button'} className={cls} onClick={b.onClick} disabled={b.disabled || b.loading} aria-busy={b.loading || undefined}>
        {b.loading ? <Loader2 size={18} className="animate-[spin_0.8s_linear_infinite]" aria-hidden="true" /> : null}
        {inner}
      </button>
    )
  }
  // the magnetic wrapper must take the button's width rules too ("w-full sm:w-auto"), or it stays full width on desktop
  // and pushes the next button in the row onto its own line
  const widths = className.split(/\s+/).filter((c) => /^(?:[a-z0-9]+:)*w-/.test(c)).join(' ')
  return magnetic ? <Magnetic className={widths}>{el}</Magnetic> : el
}
