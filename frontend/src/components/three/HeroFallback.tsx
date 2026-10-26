import { useMemo } from 'react'

/** Static SVG rendering of the hero sphere. Shown instantly on first paint, when WebGL is
 *  unavailable, on low-power devices and for reduced-motion users. */

function build() {
  const dots: { x: number; y: number; r: number; o: number }[] = []
  const n = 900
  const g = Math.PI * (3 - Math.sqrt(5))
  const rotY = -0.6, tilt = 0.32
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const rr = Math.sqrt(1 - y * y)
    const t = g * i + rotY
    const x = Math.cos(t) * rr
    let z = Math.sin(t) * rr
    let yy = y
    const y2 = yy * Math.cos(tilt) - z * Math.sin(tilt)
    const z2 = yy * Math.sin(tilt) + z * Math.cos(tilt)
    yy = y2; z = z2
    if (z < -0.1) continue
    const land = Math.sin(x * 2.3 + 1.1) * Math.cos(yy * 2.9 - 0.7) + Math.sin(z * 3.7 + x * 1.9) * 0.6 > 0.18
    dots.push({ x: 300 + x * 230, y: 300 + yy * 230, r: land ? 2.1 : 1.2, o: (land ? 0.9 : 0.25) * (0.35 + 0.65 * Math.max(z, 0)) })
  }
  return dots
}

export function HeroFallback({ className = '' }: { className?: string }) {
  const dots = useMemo(() => build(), [])
  return (
    <svg viewBox="0 0 600 600" className={className} role="img" aria-label="Abstract dotted globe network" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="hf-glow" cx="50%" cy="50%" r="50%">
          <stop offset="60%" style={{ stopColor: 'var(--color-brand)' }} stopOpacity="0" />
          <stop offset="100%" style={{ stopColor: 'var(--color-brand)' }} stopOpacity="0.14" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="250" fill="url(#hf-glow)" />
      <ellipse cx="300" cy="300" rx="330" ry="110" fill="none" stroke="var(--color-brand)" strokeOpacity="0.3" transform="rotate(-18 300 300)" />
      <ellipse cx="300" cy="300" rx="280" ry="70" fill="none" stroke="var(--color-accent-2)" strokeOpacity="0.22" transform="rotate(32 300 300)" />
      {dots.map((d, i) => (<circle key={i} cx={d.x} cy={d.y} r={d.r} fill="var(--color-fg)" opacity={d.o} />))}
      <path d="M210 230 Q300 120 400 210" fill="none" stroke="var(--color-brand)" strokeOpacity="0.75" />
      <path d="M250 380 Q340 300 430 340" fill="none" stroke="var(--color-brand)" strokeOpacity="0.65" />
      {[[210, 230], [400, 210], [250, 380], [430, 340], [330, 270]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="var(--color-brand)" />
      ))}
    </svg>
  )
}
