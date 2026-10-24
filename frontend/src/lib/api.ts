import type { EnquiryForm } from './validation'

const BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? ''

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public fields?: Record<string, string>,
    public retryAfter?: number,
  ) { super(message) }
}

export interface EnquiryResponse { id: string; status: 'received'; message: string }

type Payload = Omit<EnquiryForm, 'consent' | 'website'> & {
  consent: true
  website: string
  form_elapsed_ms: number
  turnstile_token?: string
}

/** POSTs to the FastAPI backend. Never fakes success: any non-2xx or network failure throws. */
export async function submitEnquiry(payload: Payload, signal?: AbortSignal): Promise<EnquiryResponse> {
  let res: Response
  try {
    res = await fetch(`${BASE}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal,
    })
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e
    throw new ApiError('We could not reach the server. Please check your connection and try again.', 0, 'network_error')
  }

  const data = await res.json().catch(() => null)
  if (res.ok) return data as EnquiryResponse

  const err = data?.error
  throw new ApiError(
    err?.message ?? 'Something went wrong on our side. Please try again in a moment.',
    res.status,
    err?.code ?? 'server_error',
    err?.fields,
    Number(res.headers.get('Retry-After')) || undefined,
  )
}
