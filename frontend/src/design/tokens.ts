/** JS mirror of the CSS design tokens (src/styles/global.css) for canvas / WebGL / motion code. */

/** Brand colours per theme: the same values as the "Colour palettes" blocks in global.css. */
export const palettes = {
  dark: {
    bg: '#141619',
    bg2: '#1A1D21',
    surface: '#22252A',
    fg: '#F4F1EC',
    muted: '#ADB1B7',
    accent: '#F47A3C',
    brand: '#F06623',
    accent2: '#8F969E',
  },
  light: {
    bg: '#F7F4EF',
    bg2: '#EFEAE3',
    surface: '#FFFFFF',
    fg: '#22252A',
    muted: '#565B62',
    accent: '#B8400B',
    brand: '#F06623',
    accent2: '#6D737A',
  },
} as const

/**
 * Hero globe, per theme. Dark paints light onto a dark page, so layers add up (additive blending): warm
 * off-white land dots with an orange network. Light paints ink onto a light page, where adding light would
 * vanish, so layers composite normally: charcoal land dots, the same orange network, a dark node core.
 */
export const globe = {
  dark: { cool: '#3a3f47', land: '#d8d3ca', hot: palettes.dark.brand, rim: palettes.dark.accent2, core: '#ffffff', additive: true, wire: 0.07, ringA: 0.3, ringB: 0.22 },
  light: { cool: '#b9bcc0', land: '#3b3f45', hot: palettes.light.brand, rim: palettes.light.accent2, core: '#22252a', additive: false, wire: 0.13, ringA: 0.5, ringB: 0.34 },
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
