import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface VideoDialogProps {
  open: boolean
  onClose: () => void
  src: string
  title: string
  poster?: string
}

/** On a short (landscape) screen the video is capped so the close button above it and the caption below it stay on screen.
 *  Native <dialog>: built-in focus trap, Esc handling and inert background. Video source is only
 *  attached while open, so nothing is downloaded until the visitor asks for the demo. */
export function VideoDialog({ open, onClose, src, title, poster }: VideoDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
    if (!open) video.current?.pause()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label={`${title} demo video`}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose() }}
      className="theme-dark m-auto w-[min(1280px,94vw)] overflow-visible bg-transparent p-0 text-[var(--color-fg)] backdrop:bg-[rgb(10_11_13/0.88)] backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="relative">
          <button type="button" onClick={onClose} aria-label="Close video" className="absolute -top-14 right-0 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-line-strong)] hover:bg-white/10">
            <X size={20} />
          </button>
          <video ref={video} src={src} poster={poster} controls autoPlay playsInline preload="metadata" className="aspect-video max-h-[calc(100svh-9.25rem)] w-full rounded-[var(--radius-lg)] bg-black shadow-[var(--shadow-lift)]">
            <track kind="captions" />
          </video>
          <p className="t-label mt-4">{title} · product demonstration</p>
        </div>
      )}
    </dialog>
  )
}
