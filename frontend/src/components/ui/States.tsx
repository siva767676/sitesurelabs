import { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

export function RouteFallback() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[60vh] items-center justify-center">
      <span className="sr-only">Loading</span>
      <span aria-hidden="true" className="h-8 w-8 animate-[spin_0.9s_linear_infinite] rounded-full border-2 border-[var(--color-line-strong)] border-t-[var(--color-accent)]" />
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', body = 'Please refresh the page or try again in a moment.' }: { title?: string; body?: string }) {
  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-3 py-24 text-center">
      <AlertTriangle className="text-[var(--color-signal)]" aria-hidden="true" />
      <h2 className="t-h3">{title}</h2>
      <p className="t-body">{body}</p>
      <button type="button" onClick={() => window.location.reload()} className="btn btn--secondary btn--sm mt-3">Reload page</button>
    </div>
  )
}

interface BoundaryProps { children: ReactNode; fallback: ReactNode; onError?: (e: Error) => void }
/** Generic error boundary, used to isolate WebGL failures from the rest of the page. */
export class Boundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(e: Error) { this.props.onError?.(e) }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}
