import { motion, useReducedMotion } from 'motion/react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { process } from '@/data/site'
import { ease } from '@/design/tokens'

export function Process() {
  const reduced = useReducedMotion()
  return (
    <section className="section theme-invert" aria-labelledby="proc-title">
      <div className="container-x">
        <SectionHeading titleId="proc-title" index="05" eyebrow="Enterprise engagement" lines={['How we work', 'with you.']} lead="A clear path from first conversation to a system in production, with working software at every stage." align="split" />

        <div className="relative mt-20">
          <div aria-hidden="true" className="absolute left-0 right-0 top-[7px] hidden h-px bg-[var(--c-line)] lg:block">
            <motion.div
              className="h-px origin-left bg-[var(--c-accent)]"
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '0px 0px -30% 0px' }}
              transition={{ duration: 1.8, ease: ease.inOut }}
            />
          </div>
          <ol className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-5">
            {process.map((s, i) => (
              <motion.li
                key={s.n}
                className="relative lg:pt-10"
                initial={reduced ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.9, ease: ease.out, delay: i * 0.12 }}
              >
                <span aria-hidden="true" className="absolute left-0 top-0 hidden h-[15px] w-[15px] rounded-full border-2 border-[var(--c-accent)] bg-[var(--c-bg)] lg:block" />
                <p className="t-label mb-3 text-[var(--c-accent)]">{s.n}</p>
                <h3 className="t-h3 mb-4">{s.title}</h3>
                <p className="t-body">{s.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
