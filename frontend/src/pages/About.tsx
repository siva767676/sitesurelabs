import { Seo } from '@/components/ui/Seo'
import { PageHero } from '@/components/ui/PageHero'
import { Reveal } from '@/components/ui/Reveal'
import { DottedText } from '@/components/ui/DottedText'
import { CtaBand } from '@/components/ui/CtaBand'
import { AboutVisual } from '@/components/ui/PageVisuals'
import { principles } from '@/data/site'
import { liveProducts } from '@/data/products'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <>
      <Seo title="About" description="SiteSureLabs is an AI product company building practical, product-first AI for enterprises." path="/about" />
      <PageHero
        eyebrow="About SiteSureLabs"
        lines={['Practical AI,', 'built as *product.*']}
        lead="We are an AI product company. We build software that sees, reads and reasons, and we run it on real work before we offer it to anyone else."
        visual={<AboutVisual />}
      />

      {/* CONFIRM: mission and philosophy copy below is drafted from our product work and needs founder sign-off. */}
      <section className="section !pt-8" aria-labelledby="phil-t">
        <div className="container-x">
          <div className="grid-12 gap-y-12">
            <h2 id="phil-t" className="t-label col-span-12 lg:col-span-3">Engineering philosophy</h2>
            <div className="col-span-12 lg:col-span-9">
              <Reveal>
                <p className="font-display text-[clamp(1.75rem,1rem+3vw,3.6rem)] font-medium leading-[1.1] tracking-[-0.035em]">
                  Software earns its place by being used. We design for the person on site, in the store room or in the review meeting, and we measure ourselves by whether the work gets easier.
                </p>
              </Reveal>
              <Reveal delay={0.1}><p className="t-body mt-8">Every product we have built started with a concrete operational problem: a defect that was missed, a steel ledger that would not reconcile, a site that nobody could see. The AI is the means. The outcome is the point.</p></Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section theme-invert" aria-labelledby="prin-t">
        <div className="container-x">
          <h2 id="prin-t" className="t-label mb-12">How we work</h2>
          <div className="grid gap-x-16 gap-y-12 md:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.08} className="border-t-2 border-[var(--c-fg)] pt-6">
                <h3 className="t-h3 mb-3">{p.title}</h3>
                <p className="t-body">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="pf-t">
        <div className="container-x">
          <div className="grid-12 gap-y-12">
            <div className="col-span-12 lg:col-span-5">
              <h2 id="pf-t" className="t-label mb-8">Product-first</h2>
              <p className="t-h2">We build our own products first.</p>
              <p className="t-body mt-6">It keeps us honest. Our custom engineering draws on the same models, pipelines and interface patterns that run in our own products.</p>
            </div>
            <ul className="col-span-12 border-t border-[var(--c-line)] lg:col-span-6 lg:col-start-7">
              {liveProducts.map((p) => (
                <li key={p.slug} className="border-b border-[var(--c-line)]">
                  <Link to={`/products/${p.slug}`} className="group flex items-baseline justify-between gap-6 py-6">
                    <span className="t-h3 transition-transform duration-500 group-hover:translate-x-1.5">{p.name}</span>
                    <span className="text-right text-[var(--fs-caption)] text-[var(--c-muted)]">{p.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--raised" aria-labelledby="team-t">
        <div className="container-x">
          <div className="grid-12 items-center gap-y-12">
            <div className="col-span-12 lg:col-span-5">
              <h2 id="team-t" className="t-label mb-8">Founder</h2>
              <div className="flex flex-col gap-6">
                <div className="aspect-square w-full max-w-[17rem] overflow-hidden rounded-full border border-[var(--c-line-strong)] bg-[#202327]">
                  <img src="/brand/founder.webp" alt="Amod Jupally, Founder and CEO of SiteSureLabs, speaking at a podium" width={408} height={419} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>
                <Reveal>
                  <h3 className="t-h3 mb-2">Amod Jupally</h3>
                  <p className="t-label text-[var(--color-accent)]">Founder & CEO, SiteSureLabs</p>
                  <p className="t-body mt-4">Amod Jupally leads SiteSureLabs’ vision to transform the construction industry through artificial intelligence, computer vision, and autonomous inspection technologies.</p>
                  <p className="t-body mt-4">As a member of the Promoter Group at My Home Constructions and Maha Cement, he brings a strategic perspective on the intersection of real estate, industrial innovation, and emerging technologies. At SiteSureLabs, he leads the development of AI-powered solutions designed to improve construction quality, automate defect detection, and enhance safety and operational efficiency.</p>
                  <p className="t-body mt-4">His work focuses on applying advanced AI and autonomous drone systems to identify structural anomalies, facade cracks, and waterproofing failures, helping make construction inspections more intelligent, precise, and scalable.</p>
                  <p className="t-caption mt-6 text-[var(--color-accent)]">Focus Areas: Artificial Intelligence · Construction Technology · Computer Vision · Autonomous Inspection · Innovation Strategy</p>
                </Reveal>
              </div>
            </div>
            <div className="about-dots col-span-12 overflow-hidden lg:col-span-7" aria-hidden="true">
              <DottedText size="1em">Practical<br />AI.</DottedText>
            </div>
          </div>
        </div>
      </section>

      <CtaBand title="Build with us." body="Whether you want one of our products or something new, start with a conversation." primary={{ label: 'Start a Conversation', to: '/contact' }} secondary={{ label: 'View products', to: '/products' }} />
    </>
  )
}
