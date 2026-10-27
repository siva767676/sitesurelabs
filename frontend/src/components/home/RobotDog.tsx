import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useInView as useMotionInView, useReducedMotion, useScroll } from 'motion/react'
import { MoveHorizontal, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { TextReveal } from '@/components/ui/TextReveal'
import { Boundary } from '@/components/ui/States'
import { RobotDogFallback } from '@/components/three/RobotDogFallback'
import { LEGS, type DogControls, type DogHud } from '@/components/three/robotDog'
import { ease, queries } from '@/design/tokens'
import { isLowPowerDevice, useInView, useIsMobile, webglAvailable } from '@/lib/hooks'

const RobotDogScene = lazy(() => import('@/components/three/RobotDogScene'))

const GLYPHS = '#%&*+=<>/[]{}01'
const CORNERS = [
  'left-4 top-4 rounded-tl-[14px] border-l border-t',
  'right-4 top-4 rounded-tr-[14px] border-r border-t',
  'bottom-4 left-4 rounded-bl-[14px] border-b border-l',
  'bottom-4 right-4 rounded-br-[14px] border-b border-r',
]

/** Text that decodes from random glyphs, left to right, once `play` turns true. Screen readers get the plain text. */
function Scramble({ text, play }: { text: string; play: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!play || !el) return
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const k = Math.min((now - t0) / 900, 1)
      const n = Math.floor(k * text.length)
      el.textContent = text.slice(0, n) + Array.from(text.slice(n), (ch) => (ch === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('')
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); el.textContent = text }
  }, [play, text])
  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">{text}</span>
    </>
  )
}

/**
 * Robotics: the robotic inspection dog we are developing, as a live concept render on a dark "field monitor".
 * Unlike every other section it is one framed stage: it powers on like a screen (a line that opens out), the HUD
 * decodes, and the robot arrives as a wireframe that a scan turns solid, then trots through a building grid.
 * Scrolling orbits the camera and a horizontal drag turns it. The 3D scene is fetched only when the section is near
 * and only on devices that can draw it; reduced motion, no WebGL and low-power devices get a still drawing of the
 * same robot. It is a concept: the copy makes no claims about specifications.
 */
export function RobotDog() {
  const reduced = useReducedMotion() ?? false
  const mobile = useIsMobile()
  const [sectionRef, near] = useInView<HTMLElement>('600px')
  // Watched on the unclipped wrapper: the stage itself starts clipped to a line, which never counts as visible.
  const frame = useRef<HTMLDivElement>(null)
  const booted = useMotionInView(frame, { once: true, amount: 0.3 })
  const onScreen = useMotionInView(frame)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const [mode, setMode] = useState<'idle' | '3d' | 'still'>('idle')
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const [dragged, setDragged] = useState(false)
  const hud = useRef<DogHud>({ yaw: null, reticle: null, feet: [], anchor: null })
  const controls = useRef<DogControls>({ drag: 0, vel: 0, held: false, px: 0, py: 0 })
  const grab = useRef<{ id: number; x: number } | null>(null)
  const view = reduced ? 'still' : mode
  const on = booted || reduced

  // Choose between the live render and the still once the section is close.
  useEffect(() => {
    if (!near || mode !== 'idle' || reduced) return
    setMode(isLowPowerDevice() || !webglAvailable() ? 'still' : '3d')
  }, [near, mode, reduced])

  // a little parallax from the mouse (not on touch screens)
  useEffect(() => {
    if (view !== '3d' || !window.matchMedia(queries.finePointer).matches) return
    const c = controls.current
    const move = (e: PointerEvent) => { c.px = (e.clientX / window.innerWidth) * 2 - 1; c.py = (e.clientY / window.innerHeight) * 2 - 1 }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [view])

  // Horizontal drags turn the camera; vertical swipes still scroll the page (touch-action: pan-y).
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (view !== '3d' || e.button !== 0) return
    grab.current = { id: e.pointerId, x: e.clientX }
    controls.current.held = true
    controls.current.vel = 0
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = grab.current
    if (!g || g.id !== e.pointerId) return
    const d = (e.clientX - g.x) * 0.008
    g.x = e.clientX
    controls.current.drag += d
    controls.current.vel = d
    if (!dragged && Math.abs(d) > 0.01) setDragged(true)
  }
  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (grab.current?.id !== e.pointerId) return
    grab.current = null
    controls.current.held = false
  }

  const fadeIn = (delay: number, y = 0) => ({
    initial: reduced ? false : { opacity: 0, y },
    animate: on ? { opacity: 1, y: 0 } : undefined,
    transition: { delay, duration: 0.7, ease: ease.out },
  })

  return (
    <section ref={sectionRef} className="section !py-[clamp(48px,7vw,104px)]" aria-labelledby="robot-title">
      <div ref={frame} className="container-x">
        <motion.div
          data-paused={paused || undefined}
          className="theme-dark stage-ring relative isolate flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-line)] bg-[#0c0d10] text-[var(--color-fg)] lg:block lg:h-[clamp(620px,calc(100svh-var(--header-h)-64px),860px)]"
          initial={reduced ? false : { clipPath: 'inset(49.6% 0% 49.6% 0% round 32px)' }}
          animate={on ? { clipPath: 'inset(0% 0% 0% 0% round 32px)' } : undefined}
          transition={{ duration: 1.2, ease: ease.inOut }}
        >
          {/* backdrop: warm light behind the robot; over the render: scanlines, a vignette, a scrim behind the copy */}
          <div aria-hidden="true" className="stage-glow pointer-events-none absolute inset-0 -z-10" />
          <div aria-hidden="true" className="stage-lines pointer-events-none absolute inset-0 z-[1]" />
          <div aria-hidden="true" className="stage-vignette pointer-events-none absolute inset-0 z-[1]" />
          <div aria-hidden="true" className="stage-scrim pointer-events-none absolute inset-0 z-[1]" />

          {/* power-on: a bright line across the middle that the picture opens out of */}
          {!reduced && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 z-[6] h-px -translate-y-1/2 bg-[var(--color-brand)] shadow-[0_0_24px_4px_rgb(240_102_35/0.55)]"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={booted ? { scaleX: [0, 1, 1], opacity: [1, 1, 0] } : undefined}
              transition={{ duration: 1.4, times: [0, 0.35, 1], ease: 'easeOut' }}
            />
          )}

          {/* the render; it fills the stage so the floor runs under the copy */}
          <div className={`absolute inset-0 touch-pan-y ${view === '3d' ? '[cursor:grab] active:[cursor:grabbing]' : ''}`} onPointerDown={onDown} onPointerMove={onDrag} onPointerUp={onUp} onPointerCancel={onUp}>
            {view === '3d' && (
              <Boundary fallback={null} onError={() => setMode('still')}>
                <Suspense fallback={null}>
                  <RobotDogScene
                    mobile={mobile}
                    live={booted}
                    paused={paused || !onScreen}
                    progress={scrollYProgress}
                    hudRef={hud}
                    controlsRef={controls}
                    onReady={() => setReady(true)}
                    onFail={() => setMode('still')}
                  />
                </Suspense>
              </Boundary>
            )}
          </div>

          {/* HUD: corner brackets and the reticle that follows the robot's head */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3]">
            {CORNERS.map((c, i) => (
              <motion.span key={c} className={`absolute h-7 w-7 border-[var(--color-accent)] md:h-9 md:w-9 ${c}`} {...fadeIn(0.85 + i * 0.07)} />
            ))}
            {view === '3d' && (
              <span ref={(el) => { hud.current.reticle = el }} className="absolute left-0 top-0 hidden h-[72px] w-[72px] opacity-0 transition-opacity duration-700 md:block">
                {['left-0 top-0 border-l border-t', 'right-0 top-0 border-r border-t', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((c) => (
                  <span key={c} className={`absolute h-3 w-3 border-[var(--color-fg)]/70 ${c}`} />
                ))}
                <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-brand)]" />
              </span>
            )}
          </div>

          {/* status line */}
          <div className="pointer-events-none relative z-[3] flex items-start justify-between gap-4 p-6 md:p-9 lg:absolute lg:inset-x-0 lg:top-0 lg:p-11">
            <motion.p className="chip !border-[var(--color-accent)]/50 bg-[#0c0d10]/70 !text-[var(--color-fg)]" {...fadeIn(0.7, -8)}>
              <span className="chip__dot animate-[pulse-dot_1.8s_ease-in-out_infinite]" />
              <Scramble text="In development" play={booted && !reduced} />
            </motion.p>
            <motion.div className="pt-1.5 text-right font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-[var(--color-faint)]" {...fadeIn(0.8, -8)}>
              <p><Scramble text={view === 'still' ? 'Concept illustration' : 'Concept render'} play={booted && !reduced} /></p>
              {view === '3d' && <p aria-hidden="true" className="hidden md:block">View <span ref={(el) => { hud.current.yaw = el }} className="text-[var(--color-fg)]">298°</span></p>}
            </motion.div>
          </div>

          {/* where the robot stands: the camera frames it inside this box, and the still is drawn in it */}
          <div
            ref={(el) => { hud.current.anchor = el }}
            role="img"
            aria-label={view === 'still' ? 'Concept illustration of a four-legged inspection robot' : 'Concept render of a four-legged inspection robot walking'}
            className="pointer-events-none relative z-[2] mx-6 h-[min(76vw,400px)] md:mx-9 md:h-[min(56vw,460px)] lg:absolute lg:right-[3%] lg:top-[13%] lg:mx-0 lg:h-[66%] lg:w-[52%]"
          >
            {view === 'still' && <RobotDogFallback className="absolute inset-0 h-full w-full" />}
            {view === '3d' && !ready && (
              <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-faint)]">
                Loading render<span className="animate-[pulse-dot_1s_ease-in-out_infinite]">_</span>
              </span>
            )}
            {view === '3d' && (
              <span aria-hidden="true" className={`absolute inset-x-0 -bottom-3 flex justify-center font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-faint)] transition-opacity duration-700 ${ready && on && !dragged ? 'opacity-100' : 'opacity-0'}`}>
                <span className="flex items-center gap-2"><MoveHorizontal size={14} /> Drag to rotate</span>
              </span>
            )}
          </div>

          {/* copy */}
          <div className="relative z-[3] mt-auto px-6 pb-7 pt-6 md:px-9 md:pb-9 lg:absolute lg:bottom-0 lg:left-0 lg:max-w-[min(32rem,44%)] lg:p-11">
            <TextReveal as="h2" id="robot-title" by="char" lines={['Inspection,', 'on *four legs.*']} className="t-h2" />
            <Reveal delay={0.15}>
              <p className="t-body mt-4 md:mt-5">We’re developing our own robotic inspection dog. More when it’s ready to show.</p>
            </Reveal>
            <Reveal delay={0.25} className="mt-6 flex items-center gap-3 md:mt-8">
              <Button to="/contact?type=general&product=robotic-dog" variant="primary" arrow magnetic>Register interest</Button>
              {!reduced && (
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused ? 'Play the animation' : 'Pause the animation'}
                  className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-[var(--color-line-strong)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-fg)]"
                >
                  {paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
                </button>
              )}
            </Reveal>
          </div>

          {/* live gait readout: lights up the feet that are on the floor */}
          {view === '3d' && (
            <motion.div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 z-[3] hidden p-11 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-faint)] lg:block" {...fadeIn(1.1)}>
              <p className="mb-2.5 flex items-center justify-between gap-6"><span>Gait</span><span className="text-[var(--color-muted)]">Trot</span></p>
              <div className="grid grid-cols-2 gap-1.5">
                {LEGS.map((l, i) => (
                  <span key={l.id} ref={(el) => { hud.current.feet[i] = el }} className="flex h-6 w-11 items-center justify-center rounded-[4px] border border-[var(--color-line-strong)] transition-colors duration-100 data-[on]:border-[var(--color-brand)] data-[on]:bg-[var(--color-brand)]/20 data-[on]:text-[var(--color-fg)]">
                    {l.id}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
