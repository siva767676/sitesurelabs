import { Link } from 'react-router-dom'
import { getArticle, isPublished, type Article } from '@/data/articles'

interface GuideLinksProps {
  id: string
  eyebrow?: string
  title: string
  /** Article slugs, in the order to show them. Unpublished (draft) articles are skipped. */
  slugs: string[]
}

/** A short list of guides (blog articles) with plain crawlable links. Renders nothing when none of them is published. */
export function GuideLinks({ id, eyebrow = 'Guides', title, slugs }: GuideLinksProps) {
  const items = slugs.map((s) => getArticle(s)).filter((a): a is Article => !!a && isPublished(a))
  if (items.length === 0) return null
  return (
    <section className="section" aria-labelledby={id}>
      <div className="container-x">
        <p className="t-label mb-4">{eyebrow}</p>
        <h2 id={id} className="t-h2 max-w-[24ch]">{title}</h2>
        <ul className="mt-10 grid gap-x-10 border-t border-[var(--c-line)] md:mt-14 md:grid-cols-3">
          {items.map((a) => (
            <li key={a.slug} className="border-b border-[var(--c-line)] py-7 md:border-b-0">
              <p className="t-label">{a.category}</p>
              <h3 className="t-h3 mt-3 !text-[clamp(1.125rem,1rem+0.6vw,1.5rem)]">
                <Link to={`/blog/${a.slug}`} className="hover:text-[var(--c-accent)]">{a.title}</Link>
              </h3>
              <p className="t-body mt-3">{a.description}</p>
              <Link to={`/blog/${a.slug}`} className="link-arrow mt-4" aria-label={`Read: ${a.title}`}>Read the guide</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
