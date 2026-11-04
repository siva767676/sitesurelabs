import { Seo } from '@/components/ui/Seo'
import { pageSeo } from '@/data/seo'
import { homeSchema } from '@/lib/schema'
import { Hero } from '@/components/home/Hero'
import { ProductScroll } from '@/components/home/ProductScroll'
import { RobotDog } from '@/components/home/RobotDog'
import { WhySure } from '@/components/home/WhySure'
import { Testimonials } from '@/components/ui/Testimonial'
import { ContactPaths } from '@/components/home/ContactPaths'
import { BrandClosing } from '@/components/brand/BrandClosing'

/**
 * Home: hero, product ecosystem, the robotic inspection dog (in development), why us, start here, closing.
 * Positioning, problem-to-solution, the deep dive, the engagement process and selected work are gone
 * from this page: their content lives in the project details sheet and on the inner pages.
 */
export default function Home() {
  return (
    <>
      <Seo
        {...pageSeo('/')}
        jsonLd={homeSchema()}
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
