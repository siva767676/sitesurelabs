import { Link } from 'react-router-dom'
import { LOGO_BOX, MARK_BOX, mark, word } from './logo-data'

/**
 * The SiteSureLabs logo, drawn as inline SVG from the supplied artwork (traced to paths in logo-data.ts).
 * Its three colours come from theme tokens (--logo-ink, --logo-orange, --logo-gray in global.css): the charcoal
 * parts turn off-white on a dark page, the orange and grey stay. Every piece carries a data-logo attribute so the
 * closing animation can move them one by one.
 *
 *   <Logo />         header link: the artwork as supplied
 *   <LogoStacked />  the artwork as supplied: mark above the wordmark, LABS between its two rules
 *   <LogoMark />     the S mark on its own
 */

const INK = 'var(--logo-ink)'
const ORANGE = 'var(--logo-orange)'
const GRAY = 'var(--logo-gray)'

const box = (b: { x: number; y: number; w: number; h: number }) => `${b.x} ${b.y} ${b.w} ${b.h}`

export function MarkShapes() {
  return (
    <>
      <path data-logo="slab-dark" d={mark.slabDark} fill={INK} />
      <path data-logo="slab-orange" d={mark.slabOrange} fill={ORANGE} />
      <path data-logo="body" d={mark.body} fill={INK} />
      <path data-logo="triangle" d={mark.triangle} fill={GRAY} />
      {mark.bars.map((d, i) => <path key={i} data-logo="bar" d={d} fill={GRAY} />)}
    </>
  )
}

export function WordShapes() {
  return (
    <>
      <g data-logo="site">{word.site.map((d, i) => <path key={i} d={d} fill={INK} fillRule="evenodd" />)}</g>
      <g data-logo="sure">{word.sure.map((d, i) => <path key={i} d={d} fill={ORANGE} fillRule="evenodd" />)}</g>
      <g data-logo="labs">{word.labs.map((d, i) => <path key={i} d={d} fill={INK} fillRule="evenodd" />)}</g>
      <g data-logo="rules">{word.rules.map((d, i) => <path key={i} d={d} fill={GRAY} />)}</g>
    </>
  )
}

/** The S mark alone. Size it with a height or width class. */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox={box(MARK_BOX)} className={className} aria-hidden="true" focusable="false">
      <MarkShapes />
    </svg>
  )
}

/** The artwork as supplied: mark above the wordmark. Size it with a width class. */
export function LogoStacked({ className = '', title }: { className?: string; title?: string }) {
  return (
    <svg viewBox={box(LOGO_BOX)} className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false" overflow="visible">
      <g data-logo-part="mark"><MarkShapes /></g>
      <g data-logo-part="word"><WordShapes /></g>
    </svg>
  )
}

/** Header logo: a link home, showing the artwork exactly as supplied. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" aria-label="SiteSureLabs home" className={`tap inline-flex items-center ${className}`}>
      <LogoStacked className="h-[54px] w-auto lg:h-[70px]" />
    </Link>
  )
}
