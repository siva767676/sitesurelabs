import { Button } from './Button'
import { Reveal } from './Reveal'

interface CtaBandProps { title: string; body?: string; primary: { label: string; to: string }; secondary?: { label: string; to: string } }

export function CtaBand({ title, body, primary, secondary }: CtaBandProps) {
  return (
    <section className="section section--raised" aria-label="Get in touch">
      <div className="container-x">
        <Reveal className="grid-12 items-end gap-y-8">
          <div className="col-span-12 lg:col-span-8">
            <h2 className="t-h2">{title}</h2>
            {body && <p className="t-lead mt-6">{body}</p>}
          </div>
          <div className="col-span-12 flex flex-wrap gap-4 lg:col-span-4 lg:justify-end">
            <Button to={primary.to} variant="primary" arrow magnetic>{primary.label}</Button>
            {secondary && <Button to={secondary.to} variant="secondary">{secondary.label}</Button>}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
