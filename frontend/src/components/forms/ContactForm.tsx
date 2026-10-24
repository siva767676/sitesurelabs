import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ApiError, submitEnquiry, type EnquiryResponse } from '@/lib/api'
import { budgets, enquirySchema, interests, timelines, type EnquiryForm } from '@/lib/validation'
import { Turnstile, turnstileSiteKey } from './Turnstile'

const kinds = [
  { value: 'demo', label: 'Request a demo' },
  { value: 'project', label: 'Discuss a project' },
  { value: 'general', label: 'General enquiry' },
] as const

const now = () => Date.now()
const serviceToInterest: Record<string, EnquiryForm['interest']> = {}

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-[0.9rem] font-medium">
        {label}{optional && <span className="t-label !text-[0.65rem]">Optional</span>}
      </label>
      {children}
      {error && <p id={`${id}-err`} role="alert" className="mt-2 flex items-center gap-1.5 text-[0.85rem] text-[var(--color-signal)]"><AlertCircle size={14} aria-hidden="true" />{error}</p>}
    </div>
  )
}

const control = 'w-full min-h-[52px] rounded-[var(--radius-md)] border border-[var(--color-line-strong)] bg-[var(--color-bg-2)] px-4 text-base text-[var(--color-fg)] placeholder:text-[var(--color-faint)] transition-colors hover:border-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 aria-[invalid=true]:border-[var(--color-signal)]'

export function ContactForm() {
  const [params] = useSearchParams()
  const t = params.get('type')
  const product = params.get('product')
  const service = params.get('service')

  const startedAt = useRef(0)
  const successRef = useRef<HTMLHeadingElement>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [done, setDone] = useState<EnquiryResponse | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [tsReset, setTsReset] = useState(0)
  const onToken = useCallback((v: string | null) => setToken(v), [])

  const kind = (t === 'demo' || t === 'project' || t === 'general' ? t : 'general') as EnquiryForm['kind']
  const interest = (interests.some((i) => i.value === product) ? product : service ? (serviceToInterest[service] ?? 'custom-ai') : kind === 'project' ? 'custom-ai' : '') as EnquiryForm['interest']

  const { register, handleSubmit, setError, setFocus, reset, control: formControl, formState: { errors } } = useForm<EnquiryForm>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { kind, name: '', email: '', company: '', interest, message: '', budget: '', timeline: '', consent: false as unknown as true, website: '' },
    mode: 'onTouched',
  })

  const messageValue = useWatch({ control: formControl, name: 'message' })

  useEffect(() => { startedAt.current = now() }, [])
  useEffect(() => { if (status === 'success') successRef.current?.focus() }, [status])

  const onSubmit = handleSubmit(async (v) => {
    if (turnstileSiteKey && !token) { setServerError('Please complete the verification check below.'); setStatus('error'); return }
    setStatus('submitting'); setServerError(null)
    try {
      const res = await submitEnquiry({ ...v, consent: true, website: v.website ?? '', form_elapsed_ms: now() - startedAt.current, ...(token ? { turnstile_token: token } : {}) })
      setDone(res); setStatus('success'); reset()
    } catch (e) {
      const err = e as ApiError
      setStatus('error')
      if (err.fields) {
        Object.entries(err.fields).forEach(([k, m]) => setError(k as keyof EnquiryForm, { message: m }))
        const first = Object.keys(err.fields)[0] as keyof EnquiryForm
        if (first) setFocus(first)
      }
      setServerError(err.message ?? 'Something went wrong. Please try again.')
      setToken(null); setTsReset((n) => n + 1)
    }
  })

  if (status === 'success' && done) {
    return (
      <div role="status" className="surface p-8 md:p-12">
        <CheckCircle2 className="mb-6 text-[var(--color-accent)]" size={40} aria-hidden="true" />
        <h2 ref={successRef} tabIndex={-1} className="t-h2 !text-[clamp(1.9rem,1.2rem+2.4vw,3rem)] outline-none">Thank you. We have your message.</h2>
        <p className="t-body mt-5">{done.message}</p>
        <p className="t-caption mt-6">Reference: <span className="font-mono text-[var(--color-fg)]">{done.id}</span></p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/products" variant="secondary">Explore products</Button>
          <Button variant="ghost" onClick={() => { setStatus('idle'); setDone(null); startedAt.current = now() }}>Send another message</Button>
        </div>
      </div>
    )
  }

  const busy = status === 'submitting'
  const d = (id: keyof EnquiryForm) => ({ 'aria-invalid': errors[id] ? true : undefined, 'aria-describedby': errors[id] ? `${id}-err` : undefined })

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={busy} className="surface p-6 md:p-10">
      <fieldset disabled={busy} className="m-0 min-w-0 space-y-6 border-0 p-0">
        <legend className="sr-only">Contact form</legend>

        <div role="radiogroup" aria-label="Type of enquiry" className="flex flex-wrap gap-2">
          {kinds.map((k) => (
            <label key={k.value} className="cursor-pointer">
              <input type="radio" value={k.value} {...register('kind')} className="peer sr-only" />
              <span className="chip min-h-[44px] px-5 normal-case tracking-normal transition-colors peer-checked:border-[var(--color-accent)] peer-checked:bg-[var(--color-accent)]/10 peer-checked:text-[var(--color-fg)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-accent)]">{k.label}</span>
            </label>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Field id="name" label="Name" error={errors.name?.message}><input id="name" autoComplete="name" className={control} {...d('name')} {...register('name')} /></Field>
          <Field id="email" label="Business email" error={errors.email?.message}><input id="email" type="email" autoComplete="email" inputMode="email" className={control} {...d('email')} {...register('email')} /></Field>
          <Field id="company" label="Company" error={errors.company?.message}><input id="company" autoComplete="organization" className={control} {...d('company')} {...register('company')} /></Field>
          <Field id="interest" label="Product or service of interest" error={errors.interest?.message}>
            <select id="interest" className={control} {...d('interest')} {...register('interest')}>
              <option value="" disabled>Select one…</option>
              {interests.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
            </select>
          </Field>
        </div>

        <Field id="message" label="Project requirements" error={errors.message?.message}>
          <textarea id="message" rows={6} placeholder="What are you trying to achieve, and what does your current process look like?" className={`${control} py-3 leading-relaxed`} {...d('message')} {...register('message')} />
          <p className="t-caption mt-2 text-right" aria-hidden="true">{messageValue?.length ?? 0} / 4000</p>
        </Field>

        <div className="grid gap-6 md:grid-cols-2">
          <Field id="budget" label="Budget" optional><select id="budget" className={control} {...register('budget')}>{budgets.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}</select></Field>
          <Field id="timeline" label="Timeline" optional><select id="timeline" className={control} {...register('timeline')}>{timelines.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}</select></Field>
        </div>

        {/* honeypot: invisible to people, tempting to bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>Leave this field empty<input tabIndex={-1} autoComplete="off" {...register('website')} /></label>
        </div>

        <Turnstile onToken={onToken} resetKey={tsReset} />

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-[0.9rem] text-[var(--color-muted)]">
            <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-accent)]" {...d('consent')} {...register('consent')} />
            <span>I have read the <Link to="/privacy" className="text-[var(--color-fg)] underline underline-offset-4 hover:text-[var(--color-accent)]">privacy notice</Link> and agree that SiteSureLabs may use these details to respond to my enquiry.</span>
          </label>
          {errors.consent && <p id="consent-err" role="alert" className="mt-2 flex items-center gap-1.5 text-[0.85rem] text-[var(--color-signal)]"><AlertCircle size={14} aria-hidden="true" />{errors.consent.message}</p>}
        </div>
      </fieldset>

      {status === 'error' && serverError && (
        <div role="alert" className="mt-6 flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-signal)]/50 bg-[var(--color-signal)]/10 p-4 text-[0.95rem]">
          <AlertCircle className="mt-0.5 shrink-0 text-[var(--color-signal)]" size={18} aria-hidden="true" /><span>{serverError}</span>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-5">
        <Button type="submit" variant="primary" arrow loading={busy}>{busy ? 'Sending…' : 'Send message'}</Button>
        <p className="t-caption max-w-[34ch]">We reply to business enquiries personally, usually within two working days.</p>
      </div>
    </form>
  )
}
