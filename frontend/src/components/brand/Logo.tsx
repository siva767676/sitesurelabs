import { Link } from 'react-router-dom'

/**
 * TEMPORARY brand assets. No official SiteSureLabs logo has been supplied yet.
 * Everything that renders the logo goes through this file, so the real asset
 * can replace <LogoMark /> and <Wordmark /> in one place.
 */

export function LogoMark({ className = '', size = 28 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="2.5" />
      <path d="M24 2v9M24 37v9M2 24h9M37 24h9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="6.5" fill="var(--color-accent)" />
    </svg>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display font-semibold tracking-[-0.04em] ${className}`}>
      SiteSure<span className="font-normal text-[var(--c-muted)]">Labs</span>
    </span>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" aria-label="SiteSureLabs home" className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <Wordmark className="text-[1.25rem]" />
    </Link>
  )
}
