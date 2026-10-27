/**
 * The robotic inspection dog's proportions and walk, shared by the 3D scene and its static fallback.
 * A concept, not the real robot: no dimension here is a specification. Units are scene units (about a
 * metre); the robot faces +x, y is up and its left side is -z.
 */
export const DOG = {
  hipY: 0.47,    // hip height above the floor when standing
  hipX: 0.37,    // front hips at +hipX, hind hips at -hipX
  hipZ: 0.205,   // left legs at -hipZ, right legs at +hipZ
  thigh: 0.3,
  shin: 0.31,
  stride: 0.2,   // how far a foot travels in one step
  lift: 0.075,   // how high a foot rises while it swings
  duty: 0.52,    // share of each cycle a foot spends on the floor
  period: 0.66,  // seconds per gait cycle
} as const

export type LegId = 'FL' | 'FR' | 'HL' | 'HR'

/** Page elements the 3D scene writes to every frame, without React renders: the view-angle readout, the reticle on
 *  the head, the four footfall cells, and the box the robot is framed in. */
export interface DogHud { yaw: HTMLElement | null; reticle: HTMLElement | null; feet: (HTMLElement | null)[]; anchor: HTMLElement | null }
/** Pointer input from the section: horizontal drag (radians) and its inertia, and pointer parallax (-1..1). */
export interface DogControls { drag: number; vel: number; held: boolean; px: number; py: number }

/** Trot: the diagonal pairs (front-left with hind-right, front-right with hind-left) move together. */
export const LEGS: readonly { id: LegId; x: number; z: number; side: -1 | 1; phase: number }[] = [
  { id: 'FL', x: DOG.hipX, z: -DOG.hipZ, side: -1, phase: 0 },
  { id: 'FR', x: DOG.hipX, z: DOG.hipZ, side: 1, phase: 0.5 },
  { id: 'HL', x: -DOG.hipX, z: -DOG.hipZ, side: -1, phase: 0.5 },
  { id: 'HR', x: -DOG.hipX, z: DOG.hipZ, side: 1, phase: 0 },
]

/** Floor speed that keeps a planted foot still: the floor moves, the robot walks in place. */
export const GROUND_SPEED = DOG.stride / (DOG.duty * DOG.period)

/** Body height, pitch and roll at time t: two small bobs per cycle and a gentle sway. */
export function bodyPose(t: number) {
  const c = (t / DOG.period) * Math.PI * 2
  return { y: DOG.hipY + 0.009 * Math.cos(2 * c), pitch: 0.012 * Math.sin(c), roll: 0.016 * Math.sin(c + Math.PI / 2) }
}

/** Two-bone IK in the leg's side plane, hip at the origin and the foot at (fx, fy). Knees bend backwards, as on
 *  most quadruped robots. Angles are about z: 0 hangs straight down, positive swings the segment forward. */
export function solveLeg(fx: number, fy: number) {
  const a = DOG.thigh, b = DOG.shin
  const len = Math.hypot(fx, fy)
  const d = Math.min(Math.max(len, Math.abs(a - b) + 1e-3), a + b - 1e-3)
  const ux = fx / len, uy = fy / len
  const along = (a * a - b * b + d * d) / (2 * d)
  const h = Math.sqrt(Math.max(a * a - along * along, 0))
  const kx = ux * along + uy * h, ky = uy * along - ux * h // the knee, on the backward side of the hip-foot line
  const hip = Math.atan2(kx, -ky)
  return { hip, knee: Math.atan2(ux * d - kx, -(uy * d - ky)) - hip, kx, ky, fx: ux * d, fy: uy * d }
}

/** One leg at time t: its joint angles, where the foot is (relative to the hip) and whether it is on the floor. */
export function legPose(leg: (typeof LEGS)[number], t: number, bodyY: number) {
  const { stride: s, lift, duty } = DOG
  const p = (((t / DOG.period + leg.phase) % 1) + 1) % 1
  let fx: number, fh: number
  const down = p < duty
  if (down) {
    fx = s / 2 - s * (p / duty)
    fh = 0
  } else {
    const k = (p - duty) / (1 - duty)
    fx = -s / 2 + s * k * k * (3 - 2 * k)
    fh = lift * Math.sin(Math.PI * Math.pow(k, 0.85))
  }
  fx += leg.x > 0 ? 0.025 : -0.015 // front feet a touch ahead of their hips, hind feet a touch behind
  return { ...solveLeg(fx, fh - bodyY), down }
}
