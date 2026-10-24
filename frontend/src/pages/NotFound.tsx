import { Seo } from '@/components/ui/Seo'
import { Button } from '@/components/ui/Button'
import { DottedText } from '@/components/ui/DottedText'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="The page you are looking for does not exist." path="/404" noindex />
      <section className="flex min-h-[100svh] flex-col justify-center pt-[var(--header-h)]">
        <div className="container-x">
          <p className="t-label mb-6">Error 404</p>
          <div aria-hidden="true" className="overflow-hidden"><DottedText size="clamp(7rem, 26vw, 22rem)">404</DottedText></div>
          <h1 className="t-h2 mt-8">This page is out of frame.</h1>
          <p className="t-lead mt-5">The link may be broken, or the page may have moved.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button to="/" variant="primary" arrow>Back to home</Button>
            <Button to="/products" variant="secondary">Explore products</Button>
            <Button to="/contact" variant="secondary">Contact us</Button>
          </div>
        </div>
      </section>
    </>
  )
}
