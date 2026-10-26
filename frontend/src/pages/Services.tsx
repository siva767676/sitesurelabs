import { Seo } from '@/components/ui/Seo'
import { PageHero } from '@/components/ui/PageHero'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { CtaBand } from '@/components/ui/CtaBand'
import { Process } from '@/components/home/Process'
import { ServicesVisual } from '@/components/ui/PageVisuals'
import { services } from '@/data/services'

export default function Services() {
  return (
    <>
      <Seo
        title="AI & Engineering Services"
        description="SiteSureLabs is a technology partner for custom AI: computer vision, document processing and OCR, LLM applications and RAG, AI agents, custom software and AI infrastructure."
        path="/services"
      />
      <PageHero
        eyebrow="AI & engineering services"
        lines={['Your technology', 'partner for', '*custom AI.*']}
        lead="Beyond our own products, we build bespoke AI and software for organisations that need something shaped around how they operate."
        visual={<ServicesVisual />}
      >
        <div className="max-w-xl rounded-[var(--radius-md)] border border-[var(--c-line-strong)] p-5 text-[var(--fs-caption)] text-[var(--c-muted)]">
          <strong className="font-medium text-[var(--c-fg)]">Products or services?</strong> Anviksha, SiteVision, Digi Reco and Parichay are ready-to-use products. The services below are custom engagements, built for your specific problem.
        </div>
      </PageHero>

      <section className="section !pt-10" aria-label="Services">
        <div className="container-x">
          <ol className="border-t border-[var(--c-line)]">
            {services.map((s) => <ServiceCard key={s.slug} service={s} />)}
          </ol>
        </div>
      </section>

      <Process />
      <CtaBand title="Have a problem worth solving?" body="Tell us about it. You will get an honest view of whether, and how, AI can help." primary={{ label: 'Discuss your project', to: '/contact?type=project' }} secondary={{ label: 'See our products', to: '/products' }} />
    </>
  )
}
