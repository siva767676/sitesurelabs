import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string; remove: (id: string) => void; reset: (id?: string) => void }
  }
}

const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
export const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

/** Optional Cloudflare Turnstile widget. Renders nothing unless VITE_TURNSTILE_SITE_KEY is set;
 *  the backend only enforces it when TURNSTILE_SECRET_KEY is configured. */
export function Turnstile({ onToken, resetKey }: { onToken: (t: string | null) => void; resetKey: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useRef<string | null>(null)

  useEffect(() => {
    if (!turnstileSiteKey || !ref.current) return
    let cancelled = false
    const mount = () => {
      if (cancelled || !window.turnstile || !ref.current) return
      id.current = window.turnstile.render(ref.current, {
        sitekey: turnstileSiteKey, theme: 'dark',
        callback: (t: string) => onToken(t), 'expired-callback': () => onToken(null), 'error-callback': () => onToken(null),
      })
    }
    if (window.turnstile) mount()
    else {
      let s = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`)
      if (!s) { s = document.createElement('script'); s.src = SRC; s.async = true; document.head.appendChild(s) }
      s.addEventListener('load', mount)
    }
    return () => { cancelled = true; if (id.current) window.turnstile?.remove(id.current) }
  }, [onToken, resetKey])

  if (!turnstileSiteKey) return null
  return <div ref={ref} className="min-h-[65px]" />
}
