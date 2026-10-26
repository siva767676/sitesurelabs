import { useRef } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme'

/** Light / dark switch. Shows the current mode (moon in dark, sun in light); its label says what a press does. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const ref = useRef<HTMLButtonElement>(null)
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => toggle(ref.current)}
      aria-label={`Switch to ${next} mode`}
      className={`theme-toggle relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-line-strong)] text-[var(--color-fg)] transition-colors hover:bg-[var(--c-hover)] ${className}`}
    >
      <Sun size={20} strokeWidth={1.75} aria-hidden="true" className="ti ti-sun absolute" />
      <Moon size={20} strokeWidth={1.75} aria-hidden="true" className="ti ti-moon absolute" />
    </button>
  )
}
