import { Link } from 'react-router-dom'
import { Seo } from '@/components/ui/Seo'
import { PageHero } from '@/components/ui/PageHero'
import { Reveal } from '@/components/ui/Reveal'
import { CtaBand } from '@/components/ui/CtaBand'
import { pageSeo } from '@/data/seo'
import { publishedArticles, readingMinutes } from '@/data/articles'
import { formatDate } from '@/lib/date'
import { breadcrumbSchema } from '@/lib/schema'

export default function Blog() {
  const sorted = [...publishedArticles()].sort((a, b) => b.published.localeCompare(a.published))
  return (
    <>
      <Seo {...pageSeo('/blog')}  jsonLd={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }])} />
      <PageHero
        eyebrow="Blog"
        lines={['Guides for', 'construction *teams.*']}
        lead="Practical, plain-language guides on digital inspection, AI-assisted quality management and 360° site documentation, written by the team that builds the products."
      />
      <section className="pb-[var(--section-y)]" aria-label="Articles">
        <div className="container-x">
          {sorted.length === 0 && (
            <p className="t-body border-t border-[var(--c-line)] pt-8">Guides are on the way. In the meantime, explore our products or ask us about a demonstration.</p>
          )}
          <ul className="border-t border-[var(--c-line)]">
            {sorted.map((a, i) => (
              <Reveal as="li" key={a.slug} delay={i * 0.06} className="border-b border-[var(--c-line)]">
                <article className="grid-12 gap-y-4 py-8 md:py-10">
                  <p className="t-label col-span-12 lg:col-span-3">{a.category}</p>
                  <div className="col-span-12 lg:col-span-9">
                    <h2 className="t-h2 !text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)]">
                      <Link to={`/blog/${a.slug}`} className="hover:text-[var(--c-accent)]">{a.title}</Link>
                    </h2>
                    <p className="t-body mt-4 max-w-[68ch]">{a.description}</p>
                    <p className="t-caption mt-4">
                      <time dateTime={a.published}>{formatDate(a.published)}</time> · {readingMinutes(a)} min read
                    </p>
                    <Link to={`/blog/${a.slug}`} className="link-arrow mt-5" aria-label={`Read: ${a.title}`}>Read the guide</Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand title="Want to see it on your own site?" body="Request a demonstration of Anviksha, SiteVision, Digi Reco or Parichay." primary={{ label: 'Request a Demo', to: '/contact?type=demo' }} secondary={{ label: 'Explore products', to: '/products' }} />
    </>
  )
}
