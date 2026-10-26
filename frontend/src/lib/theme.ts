import { useCallback, useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

/**
 * Light / dark theme.
 *
 * The theme is `data-theme` on <html>. The inline script in index.html sets it before first paint from
 * the saved choice; this module is the only place that changes it afterwards, so the DOM stays the
 * single source of truth and every reader (React, WebGL, CSS) sees the same value. All colour lives in
 * CSS custom properties (see "Colour palettes" in src/styles/global.css), so switching the attribute
 * restyles the whole site.
 */

export type Theme = 'dark' | 'light'

/** localStorage key. The inline script in index.html reads the same key. */
export const THEME_KEY = 'ssl-theme'

/**
 * What a first-time visitor sees: the brand look is dark. To follow the visitor's OS setting instead,
 * make this `matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'` here and in the
 * inline script in index.html (and update the script's hash in nginx.conf, see scripts/postbuild.mjs).
 */
export const DEFAULT_THEME: Theme = 'dark'

/** Browser UI colour (mobile address bar) for each theme: the page background. */
const BROWSER_COLOR: Record<Theme, string> = { dark: '#141619', light: '#F7F4EF' }

const html = () => document.documentElement
const read = (): Theme => (html().dataset.theme === 'light' ? 'light' : 'dark')

const listeners = new Set<() => void>()

/** Applies a theme to the document and tells subscribers. No persistence, no animation. */
function paint(theme: Theme) {
  html().dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BROWSER_COLOR[theme])
  listeners.forEach((notify) => notify())
}

// Another tab changed the theme: follow it.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === THEME_KEY && (e.newValue === 'light' || e.newValue === 'dark') && e.newValue !== read()) paint(e.newValue)
  })
}

type ViewTransitionLike = { ready: Promise<unknown> }
type Switcher = { startViewTransition?: (update: () => void) => ViewTransitionLike }

/**
 * Switches the theme and remembers the choice. With the View Transitions API the new theme is revealed
 * as a circle growing from `origin` (the toggle); other browsers cross-fade the colours; people who
 * prefer reduced motion get an instant switch.
 */
export function setTheme(next: Theme, origin?: Element | null) {
  if (next === read()) return
  try {
    localStorage.setItem(THEME_KEY, next)
  } catch {
    /* storage blocked (private mode, site data off): the choice lasts for this visit only */
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return paint(next)

  const doc = document as unknown as Switcher
  if (!doc.startViewTransition) {
    const el = html()
    el.classList.add('theme-fade')
    paint(next)
    window.setTimeout(() => el.classList.remove('theme-fade'), 450)
    return
  }

  const box = origin?.getBoundingClientRect()
  const x = box ? box.left + box.width / 2 : window.innerWidth / 2
  const y = box ? box.top + box.height / 2 : 0
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  const transition = doc.startViewTransition(() => flushSync(() => paint(next)))
  transition.ready
    .then(() =>
      html().animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      ),
    )
    .catch(() => { /* the transition was skipped; the theme is already applied */ })
}

const subscribe = (notify: () => void) => {
  listeners.add(notify)
  return () => { listeners.delete(notify) }
}

/** Current theme plus the actions to change it. Re-renders when the theme changes, from anywhere. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => DEFAULT_THEME)
  const toggle = useCallback((origin?: Element | null) => setTheme(read() === 'dark' ? 'light' : 'dark', origin), [])
  return { theme, setTheme, toggle }
}
