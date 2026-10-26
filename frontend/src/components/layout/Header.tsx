import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { nav } from '@/data/site'
import { liveProducts } from '@/data/products'
import { ease } from '@/design/tokens'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  // Drawer: lock scroll, trap focus, close on Escape, restore focus.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const toggle = toggleRef.current
    const focusables = () => Array.from(drawerRef.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])') ?? [])
    focusables()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key !== 'Tab') return
      const f = focusables()
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      toggle?.focus()
    }
  }, [open])

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[var(--z-header)] transition-[background,border-color,backdrop-filter] duration-500"
        style={{
          height: 'var(--header-h)',
          background: scrolled && !open ? 'color-mix(in srgb, var(--color-bg) var(--header-glass), transparent)' : 'transparent',
          backdropFilter: scrolled && !open ? 'blur(var(--header-blur)) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled && !open ? 'blur(var(--header-blur)) saturate(1.4)' : 'none', // Safari before 18 only knows the prefixed name
          borderBottom: `1px solid ${scrolled && !open ? 'var(--color-line)' : 'transparent'}`,
          color: 'var(--color-fg)',
        }}
      >
        {/* three columns from lg up, so the nav stays centred however wide the right-hand controls are */}
        <div className="container-x flex h-full items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <Logo className="lg:justify-self-start" />
          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                  `group relative py-2 text-[length:var(--fs-nav)] font-medium transition-colors ${isActive ? 'text-[var(--color-fg)]' : 'text-[var(--color-muted)] hover:text-[var(--color-fg)]'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    <span className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[var(--color-accent)] transition-transform duration-500 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3 lg:justify-self-end">
            <ThemeToggle />
            <div className="hidden lg:block">
              <Button to="/contact?type=demo" variant="primary" size="sm" arrow>Request a Demo</Button>
            </div>
            <button
              ref={toggleRef}
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-line-strong)] lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-drawer"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[var(--z-drawer)] flex flex-col overflow-y-auto overscroll-contain bg-[var(--color-bg)] pt-[calc(var(--header-h)+16px)] lg:hidden"
            initial={{ clipPath: 'circle(0% at calc(100% - 44px) 36px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 44px) 36px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 44px) 36px)' }}
            transition={{ duration: 0.7, ease: ease.inOut }}
          >
            {/* the toggle sits above the drawer's backdrop */}
            <div className="container-x flex flex-1 flex-col justify-between gap-8 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
              <nav aria-label="Mobile">
                <ul className="mt-[clamp(0.25rem,2svh,1.5rem)]">
                  {nav.map((n, i) => (
                    <motion.li key={n.to} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: ease.out }}>
                      <NavLink to={n.to} end={n.to === '/'} className="block py-[clamp(0.375rem,1.3svh,0.75rem)] font-display text-[clamp(1.75rem,5.4svh,2.5rem)] font-medium leading-none tracking-tight">{n.label}</NavLink>
                    </motion.li>
                  ))}
                </ul>
                {/* quick links to each product; on short screens (small phones, landscape) the room goes to the CTA below */}
                <div className="[@media(max-height:700px)]:hidden">
                  <p className="t-label mb-3 mt-[clamp(1.25rem,4svh,2.5rem)]">Products</p>
                  <ul className="flex flex-wrap gap-2">
                    {liveProducts.map((p) => (
                      <li key={p.slug}><NavLink to={`/products/${p.slug}`} className="chip min-h-[44px]">{p.name}</NavLink></li>
                    ))}
                  </ul>
                </div>
              </nav>
              <div>
                <div className="mb-5 flex items-center justify-between border-t border-[var(--color-line)] pt-5">
                  <span className="t-label">Appearance</span>
                  <ThemeToggle />
                </div>
                <Button to="/contact?type=demo" variant="primary" arrow className="w-full">Request a Demo</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* keep the toggle clickable above the drawer */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed right-[var(--gutter)] top-3 z-[calc(var(--z-drawer)+1)] flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-line-strong)] bg-[var(--color-bg)] lg:hidden"
        >
          <X size={22} />
        </button>
      )}
    </>
  )
}
