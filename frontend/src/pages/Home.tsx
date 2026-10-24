import { Seo } from '@/components/ui/Seo'
import { Hero } from '@/components/home/Hero'
import { Positioning } from '@/components/home/Positioning'
import { EcosystemShowcase } from '@/components/home/EcosystemShowcase'
import { Capabilities } from '@/components/home/Capabilities'
import { ProblemSolution } from '@/components/home/ProblemSolution'
import { WorkflowDeepDive } from '@/components/home/WorkflowDeepDive'
import { Process } from '@/components/home/Process'
import { WhySure } from '@/components/home/WhySure'
import { SelectedWork } from '@/components/home/SelectedWork'
import { Testimonials } from '@/components/ui/Testimonial'
import { ContactPaths } from '@/components/home/ContactPaths'
import { BrandClosing } from '@/components/brand/BrandClosing'
import { site } from '@/data/site'

export default function Home() {
  return (
    <>
      <Seo
        title="SiteSureLabs | AI Products & Enterprise Engineering"
        description={site.description}
        path="/"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Organization', name: site.name, url: site.url, description: site.description }}
      />
      <Hero />
      <Positioning />
      <EcosystemShowcase />
      <Capabilities />
      <ProblemSolution />
      <WorkflowDeepDive />
      <Process />
      <WhySure />
      <SelectedWork />
      <Testimonials />
      <ContactPaths />
      <BrandClosing />
    </>
  )
}
