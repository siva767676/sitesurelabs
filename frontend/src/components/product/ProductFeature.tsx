import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { ImageReveal } from '@/components/ui/ImageReveal'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/data/products'
import { accentVars } from '@/lib/accent'
import { stillSet } from '@/lib/images'

type Layout = 'landscape' | 'tall' | 'band'

function Meta({ p }: { p: Product }) {
  return (
    <>
      <p className="t-label mb-5 flex items-center gap-3"><span className="accent-scope text-[var(--accent-ink)]" style={accentVars(p.accent)}>{p.index}</span><span aria-hidden="true" className="h-px w-8 bg-[var(--c-line-strong)]" />{p.category}</p>
      <h2 className="t-product">{p.name}</h2>
      <p className="mt-5 font-display text-[clamp(1.25rem,1.05rem+0.9vw,1.9rem)] leading-snug tracking-tight text-[var(--c-fg)]">{p.tagline}</p>
      <p className="t-body mt-5">{p.summary}</p>
    </>
  )
}

function Facts({ p }: { p: Product }) {
  return (
    <dl className="mt-7 grid gap-5 border-t border-[var(--c-line)] pt-6 sm:mt-8 sm:grid-cols-2 sm:gap-6">
      <div>
        <dt className="t-label mb-3">Solves</dt>
        <dd className="text-[var(--c-fg)]">{p.problem.title}</dd>
      </div>
      <div>
        <dt className="t-label mb-3">For</dt>
        <dd className="text-[var(--c-muted)]">{p.audience.join(' · ')}</dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="t-label mb-3">Key capabilities</dt>
        <dd>
          <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {p.capabilities.slice(0, 4).map((c) => (
              <li key={c.title} className="flex gap-3 text-[0.95rem] text-[var(--c-muted)]"><span aria-hidden="true" className="accent-scope mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-[var(--accent-ink)]" style={accentVars(p.accent)} />{c.title}</li>
            ))}
          </ul>
        </dd>
      </div>
    </dl>
  )
}

function Actions({ p }: { p: Product }) {
  return (
    <div className="mt-8 grid gap-3 sm:mt-9 sm:flex sm:flex-wrap">
      <Button to={`/products/${p.slug}`} variant="primary" arrow className="w-full sm:w-auto">Explore {p.name}</Button>
      <Button to={`/contact?type=demo&product=${p.slug}`} variant="secondary" className="w-full sm:w-auto">Request a demo</Button>
    </div>
  )
}

export function ProductFeature({ product: p, layout }: { product: Product; layout: Layout }) {
  const [a, b] = p.media.showcase ?? [0, 1]
  const main = p.media.shots[a], second = p.media.shots[b]

  if (layout === 'tall') {
    return (
      <article className="grid-12 items-center gap-y-12" aria-labelledby={`p-${p.slug}`}>
        <Reveal kind="clipUp" className="col-span-12 lg:col-span-5">
          <div className="relative">
            <div aria-hidden="true" className="absolute inset-[var(--glow-bleed)] -z-10 blur-3xl" style={{ background: `radial-gradient(closest-side, ${p.accent}2e, transparent)`, opacity: 'var(--glow-k)' }} />
            <div className="shot !rounded-[var(--radius-xl)]"><ImageReveal src={main.src} alt={main.alt} ratio="var(--r)" className="[--r:4/5] md:[--r:16/10] lg:[--r:4/5]" position="48% 40%" /></div>
          </div>
        </Reveal>
        <div className="col-span-12 lg:col-span-6 lg:col-start-7" id={`p-${p.slug}`}>
          <Reveal><Meta p={p} /><Facts p={p} /><Actions p={p} /></Reveal>
        </div>
      </article>
    )
  }

  if (layout === 'band') {
    return (
      <article aria-labelledby={`p-${p.slug}`}>
        <div className="grid-12 items-end gap-y-8">
          <Reveal className="col-span-12 lg:col-span-6" ><div id={`p-${p.slug}`}><Meta p={p} /></div></Reveal>
          <Reveal className="col-span-12 lg:col-span-5 lg:col-start-8" delay={0.1}><Facts p={p} /><Actions p={p} /></Reveal>
        </div>
        <Reveal kind="clipUp" className="relative mt-14">
          <div className="shot !rounded-[var(--radius-xl)]"><ImageReveal src={main.src} alt={main.alt} ratio="21 / 9" position="50% 6%" sizes="92vw" /></div>
          {second && (
            <div className="shot absolute -bottom-8 right-[4%] hidden w-[30%] ring-1 ring-[color:var(--c-ring)] md:block"><img src={second.src} {...stillSet(second.src)} sizes="28vw" alt={second.alt} width={1920} height={1080} loading="lazy" decoding="async" className="w-full object-cover object-top" style={{ aspectRatio: '16 / 10' }} /></div>
          )}
        </Reveal>
      </article>
    )
  }

  return (
    <article className="grid-12 items-center gap-y-12" aria-labelledby={`p-${p.slug}`}>
      <div className="col-span-12 lg:col-span-5 lg:order-1" id={`p-${p.slug}`}>
        <Reveal><Meta p={p} /><Facts p={p} /><Actions p={p} /></Reveal>
      </div>
      <Reveal kind="clipUp" className="col-span-12 lg:order-2 lg:col-span-7">
        <div className="relative pb-10 pr-0 md:pr-10">
          <div aria-hidden="true" className="absolute inset-[var(--glow-bleed)] -z-10 blur-3xl" style={{ background: `radial-gradient(closest-side, ${p.accent}2e, transparent)`, opacity: 'var(--glow-k)' }} />
          <div className="shot !rounded-[var(--radius-xl)]"><ImageReveal src={main.src} alt={main.alt} ratio="16 / 10" position="50% 30%" sizes="(min-width: 1024px) 52vw, (min-width: 768px) 80vw, 90vw" /></div>
          {second && (
            <div className="shot absolute -bottom-0 right-0 hidden w-[44%] ring-1 ring-[color:var(--c-ring)] md:block"><img src={second.src} {...stillSet(second.src)} sizes="(min-width: 1024px) 26vw, 40vw" alt={second.alt} width={1920} height={1080} loading="lazy" decoding="async" className="w-full object-cover object-top" style={{ aspectRatio: '16 / 10' }} /></div>
          )}
        </div>
      </Reveal>
    </article>
  )
}

export function PlannedProduct({ product: p }: { product: Product }) {
  return (
    <article className="rounded-[var(--radius-xl)] border border-dashed border-[var(--c-line-strong)] p-6 sm:p-8 md:p-12" aria-labelledby={`p-${p.slug}`}>
      <div className="grid-12 items-center gap-y-8">
        <div className="col-span-12 lg:col-span-7">
          <p className="t-label mb-4 flex items-center gap-3"><span className="accent-scope text-[var(--accent-ink)]" style={accentVars(p.accent)}>{p.index}</span> <span className="chip"><span className="chip__dot" /> In development</span></p>
          <h2 id={`p-${p.slug}`} className="t-h1">{p.name}</h2>
          <p className="t-lead mt-5">{p.summary}</p>
        </div>
        <div className="col-span-12 flex flex-wrap items-center gap-x-5 gap-y-3 lg:col-span-4 lg:col-start-9 lg:justify-end">
          <Link to={`/products/${p.slug}`} className="link-arrow">Details <ArrowUpRight size={18} aria-hidden="true" /></Link>
          <Button to={`/contact?type=general&product=${p.slug}`} variant="secondary">Register interest</Button>
        </div>
      </div>
    </article>
  )
}
