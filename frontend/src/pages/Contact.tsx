import { Seo } from '@/components/ui/Seo'
import { PageHero } from '@/components/ui/PageHero'
import { ContactForm } from '@/components/forms/ContactForm'
import { site } from '@/data/site'

const steps = [
  { t: 'You send the details', d: 'Tell us the problem, not the solution.' },
  { t: 'We review it properly', d: 'A person on our team reads every enquiry.' },
  { t: 'We reply with next steps', d: 'A demo, a call, or an honest “not a fit”.' },
]

export default function Contact() {
  return (
    <>
      <Seo title="Contact & Request a Demo" description="Request a demo of Anviksha, SiteVision or Digi Reco, or discuss a custom AI project with SiteSureLabs." path="/contact" />
      <PageHero eyebrow="Contact" lines={['Start a', 'conversation.']} lead="Request a product demonstration or tell us about a project. We read every enquiry and reply personally." />
      <section className="pb-[var(--section-y)]" aria-label="Enquiry form">
        <div className="container-x">
          <div className="grid-12 gap-y-14">
            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
                <p className="t-label mb-6">What happens next</p>
                <ol className="space-y-6">
                  {steps.map((s, i) => (
                    <li key={s.t} className="grid grid-cols-[2rem_1fr] gap-3">
                      <span className="t-label pt-1 text-[var(--c-accent)]">0{i + 1}</span>
                      <div><p className="font-display text-lg font-medium">{s.t}</p><p className="t-caption mt-1">{s.d}</p></div>
                    </li>
                  ))}
                </ol>
                <div className="mt-12 border-t border-[var(--c-line)] pt-8">
                  <p className="t-label mb-3">Prefer email?</p>
                  <a href={`mailto:${site.email}`} className="link-arrow">{site.email}</a>
                </div>
              </div>
            </aside>
            <div className="col-span-12 lg:col-span-8"><ContactForm /></div>
          </div>
        </div>
      </section>
    </>
  )
}
