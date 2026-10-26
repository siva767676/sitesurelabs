import { z } from 'zod'

/** Mirrors backend/app/schemas.py. The server re-validates everything; this is for fast feedback. */

export const FREE_EMAIL_DOMAINS = [
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.in', 'yahoo.co.in', 'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  'aol.com', 'icloud.com', 'me.com', 'proton.me', 'protonmail.com', 'gmx.com', 'mail.com', 'rediffmail.com', 'zoho.com', 'yandex.com',
]

export const interests = [
  { value: 'anviksha', label: 'Anviksha: AI construction inspection' },
  { value: 'sitevision', label: 'SiteVision: 360° site capture' },
  { value: 'digi-reco', label: 'Digi Reco: steel reconciliation' },
  { value: 'parichay', label: 'Parichay: worker registration and entry passes' },
  { value: 'progress-tracker', label: 'Progress Tracker (in development)' },
  { value: 'custom-ai', label: 'Custom AI / software engineering' },
  { value: 'other', label: 'Something else' },
] as const

export const budgets = [
  { value: '', label: 'Prefer not to say' },
  { value: 'exploring', label: 'Still exploring' },
  { value: 'small', label: 'Small pilot or proof of concept' },
  { value: 'medium', label: 'Mid-sized project' },
  { value: 'large', label: 'Large or multi-phase programme' },
] as const

export const timelines = [
  { value: '', label: 'Prefer not to say' },
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-3m', label: 'Within 1–3 months' },
  { value: '3-6m', label: 'Within 3–6 months' },
  { value: 'later', label: 'Later / no fixed date' },
] as const

const values = <T extends readonly { value: string }[]>(a: T) => a.map((x) => x.value) as [string, ...string[]]

export const enquirySchema = z.object({
  kind: z.enum(['demo', 'project', 'general']),
  name: z.string().trim().min(2, 'Please enter your name').max(120, 'That name is too long'),
  email: z
    .string().trim()
    .email('Enter a valid email address')
    .max(254)
    .refine((e) => !FREE_EMAIL_DOMAINS.includes(e.split('@')[1]?.toLowerCase() ?? ''), 'Please use your business email address'),
  company: z.string().trim().min(2, 'Please enter your company').max(160),
  interest: z.enum(values(interests), 'Please choose a product or service'),
  message: z.string().trim().min(20, 'Please share a little more detail (at least 20 characters)').max(4000, 'Please keep this under 4,000 characters'),
  budget: z.enum(values(budgets)),
  timeline: z.enum(values(timelines)),
  consent: z.boolean().refine((v) => v === true, 'Please confirm you have read the privacy notice'),
  website: z.string().max(0).optional(),
})

export type EnquiryForm = z.infer<typeof enquirySchema>
