import { Info } from 'lucide-react'
import { Seo } from '@/components/ui/Seo'
import { site } from '@/data/site'

type Doc = 'privacy' | 'terms'

interface Section { h: string; p: string[] }

// CONFIRM: both documents are drafts prepared for legal review. Entity name, registered address,
// retention periods, processors and governing law must be confirmed before launch.
const docs: Record<Doc, { title: string; updated: string; intro: string; sections: Section[] }> = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Draft, pending legal review',
    intro: 'This policy explains what personal information SiteSureLabs collects through sitesurelabs.com, why we collect it and how we handle it.',
    sections: [
      { h: 'Information we collect', p: ['When you submit the contact or demo form we collect the details you provide: your name, business email address, company, the product or service you are interested in, your project requirements and, optionally, your budget and timeline.', 'Our servers also process your IP address to protect the form from abuse (for example, to rate-limit submissions). We do not use advertising trackers on this website.'] },
      { h: 'How we use it', p: ['We use your information to respond to your enquiry, to arrange demonstrations and to discuss projects with you. We do not sell your personal information.'] },
      { h: 'Cookies and analytics', p: ['This website does not set advertising cookies. If analytics are added in future, this policy will be updated and, where required, consent will be requested.'] },
      { h: 'Who we share it with', p: ['Enquiries are stored in our database and may be forwarded to our team by email. We use service providers for hosting and email delivery who process data on our behalf. Anti-spam verification (such as Cloudflare Turnstile) may be used on the form if enabled.'] },
      { h: 'Retention', p: ['We keep enquiry records for as long as needed to respond and to maintain a record of our business communications. [Retention period to be confirmed.]'] },
      { h: 'Your rights', p: ['Depending on where you live, you may have the right to access, correct or delete your personal information, or to object to its processing. To exercise these rights, contact us at the address below.'] },
      { h: 'Contact', p: [`Questions about this policy: ${site.email}.`] },
    ],
  },
  terms: {
    title: 'Terms of Use',
    updated: 'Draft, pending legal review',
    intro: 'These terms govern your use of sitesurelabs.com. By using the website you agree to them.',
    sections: [
      { h: 'Use of the website', p: ['You may use this website for lawful purposes and in line with these terms. You must not attempt to disrupt the website, probe it for vulnerabilities or submit unlawful, misleading or abusive content through its forms.'] },
      { h: 'Product information', p: ['Descriptions, screenshots and videos on this website illustrate our products. Interfaces and data shown in demonstrations are demo data and do not represent customer results or performance guarantees. Features may change.'] },
      { h: 'Intellectual property', p: ['The website, its content, the SiteSureLabs name and our product names and designs are owned by SiteSureLabs or its licensors. You may not copy or reuse them without permission.'] },
      { h: 'No warranty', p: ['The website is provided “as is”. To the extent permitted by law, we disclaim warranties about its availability, accuracy and fitness for a particular purpose.'] },
      { h: 'Limitation of liability', p: ['To the extent permitted by law, SiteSureLabs is not liable for indirect or consequential loss arising from use of this website.'] },
      { h: 'Governing law', p: ['[Governing law and jurisdiction to be confirmed.]'] },
      { h: 'Contact', p: [`Questions about these terms: ${site.email}.`] },
    ],
  },
}

export default function Legal({ doc }: { doc: Doc }) {
  const d = docs[doc]
  return (
    <>
      <Seo title={d.title} description={d.intro} path={`/${doc}`} />
      <article className="pb-[var(--section-y)] pt-[calc(var(--header-h)+clamp(48px,8vw,112px))]">
        <div className="container-x">
          <p className="t-label mb-6">Legal</p>
          <h1 className="t-h1 !text-[clamp(2.5rem,1.4rem+4vw,4.5rem)]">{d.title}</h1>
          <p className="t-caption mt-4">{d.updated}</p>
          <div role="note" className="mt-8 flex max-w-2xl items-start gap-3 rounded-[var(--radius-md)] border border-[var(--c-line-strong)] p-4 text-[var(--fs-caption)] text-[var(--c-muted)]"><Info size={18} className="mt-0.5 shrink-0 text-[var(--c-accent)]" aria-hidden="true" />This document is a draft for legal review. Bracketed items need confirmation before launch.</div>
          <div className="mt-14 max-w-3xl">
            <p className="t-lead !max-w-none">{d.intro}</p>
            {d.sections.map((s) => (
              <section key={s.h} className="mt-12 border-t border-[var(--c-line)] pt-8">
                <h2 className="t-h3 mb-4">{s.h}</h2>
                {s.p.map((t) => <p key={t} className="t-body mb-4 !max-w-none">{t}</p>)}
              </section>
            ))}
          </div>
        </div>
      </article>
    </>
  )
}
