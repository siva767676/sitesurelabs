import { Seo } from '@/components/ui/Seo'
import { Hero } from '@/components/home/Hero'
import { ProductScroll } from '@/components/home/ProductScroll'
import { RobotDog } from '@/components/home/RobotDog'
import { WhySure } from '@/components/home/WhySure'
import { Testimonials } from '@/components/ui/Testimonial'
import { ContactPaths } from '@/components/home/ContactPaths'
import { BrandClosing } from '@/components/brand/BrandClosing'
import { site } from '@/data/site'

/**
 * Home: hero, product ecosystem, the robotic inspection dog (in development), why us, start here, closing.
 * Positioning, problem-to-solution, the deep dive, the engagement process and selected work are gone
 * from this page: their content lives in the project details sheet and on the inner pages.
 */
export default function Home() {
  return (
    <>
      <Seo
        title="SiteSureLabs | AI Products & Enterprise Engineering"
        description={site.description}
        path="/"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Organization', name: site.name, url: site.url, logo: `${site.url}/brand/logo.svg`, description: site.description }}
      />
      <Hero />
      <ProductScroll />
      <RobotDog />
      <WhySure />
      <Testimonials />
      <ContactPaths />
      <BrandClosing />
    </>
  )
}
