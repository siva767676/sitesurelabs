import type { CSSProperties } from 'react'

/**
 * Makes a product's accent colour available as `--accent`. Pair it with the `.accent-scope` class, then
 * use `var(--accent-ink)` for text, small marks and strokes: it is the accent at full strength on dark
 * and mixed toward ink on light, so it stays legible in both themes.
 */
export const accentVars = (accent: string): CSSProperties => ({ '--accent': accent }) as CSSProperties
