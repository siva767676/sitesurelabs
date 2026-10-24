/**
 * Verified customer testimonials ONLY. Each entry needs written approval from the person quoted
 * and their organisation. While this array is empty, no testimonial section renders anywhere.
 */
export interface TestimonialItem {
  quote: string
  name: string
  role: string
  organisation: string
  /** ISO date on which written approval was obtained, kept for the audit trail */
  approvedOn: string
}

export const testimonials: TestimonialItem[] = []
