import { Link } from 'react-router-dom'
import { LOGO_BOX, MARK_BOX, WORD_BOX, mark, word } from './logo-data'

/**
 * The SiteSureLabs logo, drawn as inline SVG from the supplied artwork (traced to paths in logo-data.ts).
 * Its three colours come from theme tokens (--logo-ink, --logo-orange, --logo-gray in global.css): the charcoal
 * parts turn off-white on a dark page, the orange and grey stay. Every piece carries a data-logo attribute so the
 * closing animation can move them one by one.
 *
 *   <Logo />         header link: the mark beside the wordmark
 *   <LogoLockup />   the same lockup without the link
 *   <LogoStacked />  the artwork as supplied: mark above the wordmark
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

// Horizontal lockup: the mark, then the wordmark drawn 1.4x larger relative to it so the lettering stays legible at
// header size, centred on the mark's height. Units are the artwork's own.
const GAP = 120
const WORD_SCALE = 1.4
const LOCKUP_W = MARK_BOX.w + GAP + WORD_BOX.w * WORD_SCALE
const LOCKUP_H = MARK_BOX.h
const WORD_Y = (LOCKUP_H - WORD_BOX.h * WORD_SCALE) / 2

/** Mark and wordmark side by side. Size it with a height class (about 36 to 48 px). */
export function LogoLockup({ className = '' }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${LOCKUP_W.toFixed(1)} ${LOCKUP_H}`} className={className} aria-hidden="true" focusable="false">
      <g transform={`translate(${-MARK_BOX.x} ${-MARK_BOX.y})`}><MarkShapes /></g>
      <g transform={`translate(${MARK_BOX.w + GAP} ${WORD_Y.toFixed(1)}) scale(${WORD_SCALE}) translate(${-WORD_BOX.x} ${-WORD_BOX.y})`}><WordShapes /></g>
    </svg>
  )
}

/** Header logo: a link home. Slightly smaller on the narrowest phones so the header never crowds. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" aria-label="SiteSureLabs home" className={`tap inline-flex items-center ${className}`}>
      <LogoLockup className="h-[34px] w-auto sm:h-10" />
    </Link>
  )
}
