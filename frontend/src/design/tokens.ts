/** JS mirror of the CSS design tokens (src/styles/global.css) for canvas / WebGL / motion code. */

export const palette = {
  bg: '#070B14',
  bg2: '#0D1320',
  surface: '#111A2B',
  fg: '#F4F7FB',
  muted: '#9BA9BC',
  accent: '#58D5FF',
  accent2: '#536DFF',
  paper: '#EEF2F7',
  ink: '#0A1020',
} as const

export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.76, 0, 0.24, 1],
  soft: [0.33, 1, 0.68, 1],
} as const

export const dur = { fast: 0.2, base: 0.5, slow: 0.9, hero: 1.2 } as const

export const stagger = { char: 0.016, word: 0.07, item: 0.09 } as const

export const layers = { header: 50, drawer: 60, modal: 70 } as const

export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 } as const

export const queries = {
  finePointer: '(hover: hover) and (pointer: fine)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  desktop: `(min-width: ${breakpoints.lg}px)`,
  mobile: `(max-width: ${breakpoints.md - 1}px)`,
} as const
