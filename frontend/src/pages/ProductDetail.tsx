import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Info, Play } from 'lucide-react'
import { Seo } from '@/components/ui/Seo'
import { Button } from '@/components/ui/Button'
import { TextReveal } from '@/components/ui/TextReveal'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ImageReveal } from '@/components/ui/ImageReveal'
import { Accordion } from '@/components/ui/Accordion'
import { VideoDialog } from '@/components/ui/VideoDialog'
import { CtaBand } from '@/components/ui/CtaBand'
import { getProduct, products } from '@/data/products'
import { site } from '@/data/site'
import { ease } from '@/design/tokens'
import NotFound from './NotFound'

/** Reusable product template: everything on this page is driven by data/products.ts. */
export default function ProductDetail() {
  const { slug = '' } = useParams()
  const p = getProduct(slug)
  const reduced = useReducedMotion()
  const [video, setVideo] = useState(false)
  if (!p) return <NotFound />

  const planned = p.status === 'planned'
  const next = products[(products.indexOf(p) + 1) % products.length]
  const hasShots = p.media.shots.length > 0

  return (
    <>
      <Seo
        title={p.seo.title}
        description={p.seo.description}
        path={`/products/${p.slug}`}
        noindex={!p.verified}
        jsonLd={planned ? undefined : {
          '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: p.name, description: p.summary,
          applicationCategory: 'BusinessApplication', url: `${site.url}/products/${p.slug}`,
          publisher: { '@type': 'Organization', name: site.name, url: site.url },
        }}
      />

      {/* hero */}
      <section className="relative isolate overflow-hidden pb-20 pt-[calc(var(--header-h)+clamp(48px,8vw,112px))]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{ background: `radial-gradient(60% 70% at 80% 20%, ${p.accent}2b, transparent 70%), radial-gradient(40% 40% at 10% 100%, ${p.accent}14, transparent 70%)` }} />
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="t-label mb-10 flex items-center gap-3">
            <Link to="/products" className="hover:text-[var(--c-fg)]">Products</Link><span aria-hidden="true">/</span><span className="text-[var(--c-fg)]">{p.name}</span>
          </nav>
          <div className="grid-12 items-center gap-y-12">
            <div className="col-span-12 lg:col-span-6">
              <p className="t-label mb-6" style={{ color: p.accent }}>{p.category}</p>
              <TextReveal as="h1" by="char" immediate lines={[p.name]} className="t-display !text-[clamp(3.25rem,1rem+9vw,9.5rem)]" />
              <motion.p className="mt-7 font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.6rem)] font-medium leading-[1.1] tracking-tight" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9, ease: ease.out }}>{p.tagline}</motion.p>
              <motion.p className="t-lead mt-6" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.9 }}>{p.summary}</motion.p>
              <motion.div className="mt-9 flex flex-wrap gap-3" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.9, ease: ease.out }}>
                <Button to={`/contact?type=${planned ? 'general' : 'demo'}&product=${p.slug}`} variant="primary" arrow magnetic>{planned ? 'Register interest' : 'Request a demo'}</Button>
                {p.media.demoVideo && <Button variant="secondary" onClick={() => setVideo(true)}><Play size={14} fill="currentColor" aria-hidden="true" className="mr-1 inline" /> Watch the demo</Button>}
              </motion.div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              {hasShots ? (
                <motion.div initial={reduced ? false : { opacity: 0, scale: 0.96, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.3, duration: 1.2, ease: ease.out }} className="shot !rounded-[var(--radius-xl)]">
                  <img src={p.media.cover} alt={p.media.coverAlt} width={1920} height={1080} fetchPriority="high" decoding="async" className="w-full object-cover" style={{ aspectRatio: '16 / 10', objectPosition: p.media.focus ?? '50% 0%' }} />
                </motion.div>
              ) : (
                <div className="flex aspect-[16/10] flex-col items-start justify-between rounded-[var(--radius-xl)] border border-dashed border-[var(--c-line-strong)] p-8">
                  <span className="chip"><span className="chip__dot" /> In development</span>
                  <p className="t-caption max-w-[34ch]">Product visuals will be added once the product scope is confirmed.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {!p.verified && (
        <div className="container-x pb-4">
          <div role="note" className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--c-line-strong)] bg-[var(--color-surface)] p-4 text-[var(--fs-caption)] text-[var(--c-muted)]"><Info size={18} className="mt-0.5 shrink-0 text-[var(--c-accent)]" aria-hidden="true" />Content on this page is a placeholder pending business confirmation. It is not indexed by search engines.</div>
        </div>
      )}

      {/* overview */}
      <section className="section !pb-0" aria-labelledby="ov-title">
        <div className="container-x">
          <div className="grid-12 gap-y-10 border-t border-[var(--c-line)] pt-12">
            <h2 id="ov-title" className="t-label col-span-12 lg:col-span-3">Overview</h2>
            <div className="col-span-12 grid gap-10 sm:grid-cols-2 lg:col-span-9">
              <div><p className="t-label mb-3">Built for</p><ul className="space-y-2 text-[var(--c-fg)]">{p.audience.map((a) => <li key={a}>{a}</li>)}</ul></div>
              <div><p className="t-label mb-3">Category</p><p className="text-[var(--c-fg)]">{p.category}</p><p className="t-label mb-3 mt-8">Status</p><p className="text-[var(--c-fg)]">{planned ? 'In development' : 'Demonstrated on real applications'}</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* problem & solution */}
      <section className="section theme-light mt-[var(--section-y)]" aria-labelledby="ps-title">
        <div className="container-x">
          <h2 id="ps-title" className="sr-only">Problem and solution</h2>
          <div className="grid-12 gap-y-14">
            <Reveal className="col-span-12 lg:col-span-5">
              <p className="t-label mb-6">The problem</p>
              <p className="t-h2 text-[var(--c-muted)]">{p.problem.title}</p>
              <p className="t-body mt-6">{p.problem.body}</p>
            </Reveal>
            <Reveal delay={0.12} className="col-span-12 lg:col-span-6 lg:col-start-7">
              <p className="t-label mb-6 text-[var(--c-accent)]">The solution</p>
              <p className="t-h2">{p.solution.title}</p>
              <p className="t-body mt-6">{p.solution.body}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* capabilities */}
      <section className="section" aria-labelledby="cap-t">
        <div className="container-x">
          <SectionHeading titleId="cap-t" eyebrow="Key capabilities" lines={['What it does.']} />
          <ul className="mt-16 grid border-t border-[var(--c-line)] md:grid-cols-2 md:gap-x-16">
            {p.capabilities.map((c, i) => (
              <Reveal as="li" key={c.title} delay={(i % 2) * 0.08} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-[var(--c-line)] py-8">
                <span className="t-label pt-1.5" style={{ color: p.accent }}>{String(i + 1).padStart(2, '0')}</span>
                <div><h3 className="t-h3 !text-[clamp(1.25rem,1.05rem+0.8vw,1.75rem)] mb-2">{c.title}</h3><p className="t-body">{c.body}</p></div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* workflow */}
      <section className="section section--raised" aria-labelledby="wf-t">
        <div className="container-x">
          <SectionHeading titleId="wf-t" eyebrow="Product workflow" lines={['How it works.']} />
          <ol className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {p.workflow.map((w, i) => {
              const shot = w.shot !== undefined ? p.media.shots[w.shot] : undefined
              return (
                <Reveal as="li" key={w.title} delay={i * 0.08}>
                  {shot && <div className="shot mb-6"><ImageReveal src={shot.src} alt={shot.alt} ratio="16 / 10" position="50% 8%" /></div>}
                  <p className="t-label mb-3" style={{ color: p.accent }}>Step {i + 1}</p>
                  <h3 className="t-h3 mb-3">{w.title}</h3>
                  <p className="t-body">{w.body}</p>
                </Reveal>
              )
            })}
          </ol>
        </div>
      </section>

      {/* screenshots */}
      {hasShots && (
        <section className="section" aria-labelledby="sh-t">
          <div className="container-x">
            <SectionHeading titleId="sh-t" eyebrow="Application screens" lines={['The real product.']} lead="Frames from our product demonstration. Figures shown are demo data, not performance results." align="split" />
            <div className="mt-16 grid gap-6 md:grid-cols-2">
              {p.media.shots.map((s, i) => (
                <Reveal key={s.src} kind="clipUp" delay={(i % 2) * 0.08}>
                  <figure className="m-0">
                    <div className="shot"><ImageReveal src={s.src} alt={s.alt} ratio="16 / 10" position="50% 6%" /></div>
                    <figcaption className="t-caption mt-3">{s.caption}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* value */}
      <section className="section theme-light" aria-labelledby="val-t">
        <div className="container-x">
          <SectionHeading titleId="val-t" eyebrow="Business value" lines={['Why it matters.']} />
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {p.value.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="border-t-2 border-[var(--c-fg)] pt-6">
                <h3 className="t-h3 mb-3">{v.title}</h3>
                <p className="t-body">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {p.deployment && (
        <section className="section" aria-labelledby="dep-t">
          <div className="container-x">
            <SectionHeading titleId="dep-t" eyebrow="Integrations & deployment" lines={['Fits your stack.']} />
            <ul className="mt-12 grid gap-4 md:grid-cols-2">{p.deployment.map((d) => <li key={d} className="surface p-6">{d}</li>)}</ul>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="section" aria-labelledby="faq-t">
        <div className="container-x">
          <div className="grid-12 gap-y-12">
            <div className="col-span-12 lg:col-span-4"><SectionHeading titleId="faq-t" eyebrow="FAQ" lines={['Questions.']} /></div>
            <div className="col-span-12 lg:col-span-7 lg:col-start-6"><Accordion items={p.faq} /></div>
          </div>
        </div>
      </section>

      <CtaBand
        title={planned ? `Interested in ${p.name}?` : `See ${p.name} on your workflow.`}
        body={planned ? 'Tell us what you would want it to do. It shapes what we build.' : 'Request a demonstration and we will walk through the product with you.'}
        primary={{ label: planned ? 'Register interest' : 'Request a Demo', to: `/contact?type=${planned ? 'general' : 'demo'}&product=${p.slug}` }}
        secondary={{ label: 'All products', to: '/products' }}
      />

      <section className="border-t border-[var(--c-line)] py-10" aria-label="Next product">
        <div className="container-x">
          <Link to={`/products/${next.slug}`} className="group flex items-center justify-between gap-6">
            <span><span className="t-label block mb-2">Next product</span><span className="t-h2">{next.name}</span></span>
            <ArrowUpRight size={40} aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--c-accent)]" />
          </Link>
        </div>
      </section>

      {video && p.media.demoVideo && <VideoDialog open onClose={() => setVideo(false)} src={p.media.demoVideo} title={p.name} poster={p.media.cover} />}
    </>
  )
}
