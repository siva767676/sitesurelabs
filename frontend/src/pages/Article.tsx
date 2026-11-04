import { Link, useParams } from 'react-router-dom'
import { Seo } from '@/components/ui/Seo'
import { CtaBand } from '@/components/ui/CtaBand'
import { articles, getArticle, isPublished, readingMinutes, type Block } from '@/data/articles'
import { getProduct } from '@/data/products'
import { site } from '@/data/site'
import { formatDate } from '@/lib/date'
import { articleSchema } from '@/lib/schema'
import NotFound from './NotFound'

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function Body({ block }: { block: Block }) {
  switch (block.type) {
    case 'h2': return <h2 id={slug(block.text)} className="t-h3 mb-4 mt-14 scroll-mt-28 border-t border-[var(--c-line)] pt-8">{block.text}</h2>
    case 'h3': return <h3 className="t-label mb-3 mt-8">{block.text}</h3>
    case 'p': return <p className="t-body mb-4 !max-w-none">{block.text}</p>
    case 'ul': return <ul className="t-body mb-4 list-disc space-y-2 pl-6 !max-w-none">{block.items.map((i) => <li key={i}>{i}</li>)}</ul>
    case 'ol': return <ol className="t-body mb-4 list-decimal space-y-2 pl-6 !max-w-none">{block.items.map((i) => <li key={i}>{i}</li>)}</ol>
    case 'table':
      return (
        <div className="mb-6 overflow-x-auto rounded-[var(--radius-md)] border border-[var(--c-line)]" tabIndex={0} role="region" aria-label="Comparison table">
          <table className="w-full min-w-[34rem] border-collapse text-left text-[var(--fs-caption)]">
            <thead>
              <tr>{block.head.map((h) => <th key={h} scope="col" className="t-label border-b border-[var(--c-line-strong)] bg-[var(--color-surface)] px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {block.rows.map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => (i === 0
                    ? <th key={c} scope="row" className="border-b border-[var(--c-line)] px-4 py-3 align-top font-medium text-[var(--c-fg)]">{c}</th>
                    : <td key={c} className="border-b border-[var(--c-line)] px-4 py-3 align-top text-[var(--c-muted)]">{c}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
  }
}

export default function Article() {
  const { slug: param = '' } = useParams()
  const a = getArticle(param)
  if (!a) return <NotFound />

  const related = a.related.map((s) => articles.find((x) => x.slug === s)).filter((x) => !!x)
  const prods = a.products.map((s) => getProduct(s)).filter((x) => !!x)
  const toc = a.body.filter((b): b is Extract<Block, { type: 'h2' }> => b.type === 'h2')

  return (
    <>
      <Seo title={a.seoTitle} description={a.description} path={`/blog/${a.slug}`} index={isPublished(a)} type="article" published={a.published} modified={a.modified ?? a.published} jsonLd={articleSchema(a)} />
      <article className="pb-[var(--section-y)] pt-[calc(var(--header-h)+clamp(40px,7vw,96px))]">
        <div className="container-x">
          {!isPublished(a) && (
            <div role="note" className="mb-8 rounded-[var(--radius-md)] border border-[var(--c-line-strong)] bg-[var(--color-surface)] p-4 text-[var(--fs-caption)] text-[var(--c-muted)]">
              <strong className="text-[var(--c-fg)]">DRAFT, pending review.</strong> This article has not been approved by the product team or the owner. It is not published, not indexed and not linked from the site.
            </div>
          )}
          <nav aria-label="Breadcrumb" className="t-label mb-10 flex flex-wrap items-center gap-3">
            <Link to="/" className="tap hover:text-[var(--c-fg)]">Home</Link><span aria-hidden="true">/</span>
            <Link to="/blog" className="tap hover:text-[var(--c-fg)]">Blog</Link>
          </nav>
          <div className="grid-12 gap-y-12">
            <div className="col-span-12 lg:col-span-8">
              <p className="t-label mb-5 text-[var(--c-accent)]">{a.category}</p>
              <h1 className="t-h1 !text-[clamp(2.25rem,1.3rem+3.6vw,4.25rem)]">{a.title}</h1>
              <p className="t-caption mt-5">
                By {site.name} · Published <time dateTime={a.published}>{formatDate(a.published)}</time>
                {a.modified && <> · Updated <time dateTime={a.modified}>{formatDate(a.modified)}</time></>} · {readingMinutes(a)} min read
              </p>

              <div role="note" aria-label="Short answer" className="mt-10 rounded-[var(--radius-lg)] border border-[var(--c-line-strong)] bg-[var(--color-surface)] p-6 md:p-8">
                <p className="t-label mb-3">The short answer</p>
                <p className="t-lead !max-w-none !text-[var(--c-fg)]">{a.answer}</p>
              </div>

              <div className="mt-6">
                {a.body.map((b, i) => <Body key={i} block={b} />)}

                <h2 id="faq" className="t-h3 mb-6 mt-14 scroll-mt-28 border-t border-[var(--c-line)] pt-8">Frequently asked questions</h2>
                <dl className="space-y-7">
                  {a.faq.map((f) => (
                    <div key={f.q}>
                      <dt><h3 className="t-h3 !text-[clamp(1.125rem,1rem+0.6vw,1.5rem)]">{f.q}</h3></dt>
                      <dd className="t-body mt-2 !max-w-none">{f.a}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {prods.length > 0 && (
                <aside aria-labelledby="rel-prod" className="mt-16 rounded-[var(--radius-lg)] border border-[var(--c-line)] p-6 md:p-8">
                  <h2 id="rel-prod" className="t-label mb-5">Related product</h2>
                  {prods.map((p) => (
                    <div key={p.slug}>
                      <h3 className="t-h3">{p.name}: {p.descriptor}</h3>
                      <p className="t-body mt-3 !max-w-none">{p.blurb}</p>
                      <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                        <Link to={`/products/${p.slug}`} className="link-arrow">Explore {p.name}</Link>
                        <Link to={`/contact?type=demo&product=${p.slug}`} className="link-arrow">Request a demo</Link>
                      </div>
                    </div>
                  ))}
                </aside>
              )}

              {related.length > 0 && (
                <aside aria-labelledby="rel-art" className="mt-10">
                  <h2 id="rel-art" className="t-label mb-5">Keep reading</h2>
                  <ul className="space-y-3">
                    {related.map((r) => <li key={r.slug}><Link to={`/blog/${r.slug}`} className="link-arrow">{r.title}</Link></li>)}
                  </ul>
                </aside>
              )}
            </div>

            <aside aria-label="On this page" className="hidden lg:col-span-3 lg:col-start-10 lg:block">
              <nav aria-label="On this page" className="sticky top-[calc(var(--header-h)+32px)] rounded-[var(--radius-lg)] border border-[var(--c-line)] bg-[var(--color-surface)] p-6">
                <p className="t-label mb-4">On this page</p>
                <ol className="space-y-2 text-[0.95rem]">
                  {toc.map((h) => <li key={h.text}><a href={`#${slug(h.text)}`} className="text-[var(--c-muted)] hover:text-[var(--c-fg)]">{h.text}</a></li>)}
                  <li><a href="#faq" className="text-[var(--c-muted)] hover:text-[var(--c-fg)]">Frequently asked questions</a></li>
                </ol>
              </nav>
            </aside>
          </div>
        </div>
      </article>
      <CtaBand title="See it on your own project." body="Talk to our team or request a demonstration." primary={{ label: 'Request a Demo', to: '/contact?type=demo' }} secondary={{ label: 'Explore products', to: '/products' }} />
    </>
  )
}
