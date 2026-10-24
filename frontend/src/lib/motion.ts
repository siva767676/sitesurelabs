import type { Variants } from 'motion/react'
import { dur, ease } from '@/design/tokens'

/** Reusable motion presets. Simple interface motion lives here (Motion for React);
 *  long scroll sequences live in GSAP; 3D lives in Three.js. */

export const revealVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: dur.slow, ease: ease.out } },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: dur.slow, ease: ease.soft } },
  },
  clipUp: {
    hidden: { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0.4 },
    show: { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, transition: { duration: 1.1, ease: ease.inOut } },
  },
  clipRight: {
    hidden: { clipPath: 'inset(0% 100% 0% 0%)' },
    show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.1, ease: ease.inOut } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.94 },
    show: { opacity: 1, scale: 1, transition: { duration: dur.slow, ease: ease.out } },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 48 },
    show: { opacity: 1, x: 0, transition: { duration: dur.slow, ease: ease.out } },
  },
} satisfies Record<string, Variants>

export type RevealKind = keyof typeof revealVariants

export const staggerParent = (gap = 0.09, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})
