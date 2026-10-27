import { useMemo } from 'react'
import { DOG, LEGS, bodyPose, legPose } from './robotDog'

/** Static side view of the robotic inspection dog, for reduced motion, devices without WebGL and low-power devices.
 *  Drawn from the same proportions and walk as the 3D scene (./robotDog), frozen mid-stride, facing left. */

const S = 240            // px per scene unit
const CX = 420, GY = 300 // where the robot's centre meets the floor
const X = (x: number) => CX - x * S
const Y = (y: number) => GY - y * S
const SHELL = '#2a2f36', LIMB = '#1c1f24'

type Pt = [number, number]

function Leg({ hip, knee, foot, far }: { hip: Pt; knee: Pt; foot: Pt; far: boolean }) {
  const bone = (a: Pt, b: Pt, w: number, fill: string) => (
    <>
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--color-fg)" strokeOpacity="0.45" strokeWidth={w + 2} strokeLinecap="round" />
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={fill} strokeWidth={w} strokeLinecap="round" />
    </>
  )
  return (
    <g opacity={far ? 0.4 : 1} transform={far ? 'translate(10 -5)' : undefined}>
      {bone(knee, foot, 11, LIMB)}
      {bone(hip, knee, 20, SHELL)}
      <circle cx={hip[0]} cy={hip[1]} r="15" fill={SHELL} stroke="var(--color-fg)" strokeOpacity="0.45" />
      <circle cx={hip[0]} cy={hip[1]} r="18" fill="none" stroke="var(--color-brand)" strokeWidth="1.5" />
      <circle cx={knee[0]} cy={knee[1]} r="10" fill={LIMB} stroke="var(--color-fg)" strokeOpacity="0.4" />
      <circle cx={knee[0]} cy={knee[1]} r="12.5" fill="none" stroke="var(--color-brand)" strokeWidth="1.2" />
      <circle cx={foot[0]} cy={foot[1] - 2} r="7.5" fill={LIMB} stroke="var(--color-fg)" strokeOpacity="0.4" />
    </g>
  )
}

export function RobotDogFallback({ className = '' }: { className?: string }) {
  const { y, legs } = useMemo(() => {
    const t = 0.16
    const body = bodyPose(t)
    return {
      y: body.y,
      legs: LEGS.map((l) => {
        const p = legPose(l, t, body.y)
        return { id: l.id, far: l.side > 0, hip: [X(l.x), Y(body.y)] as Pt, knee: [X(l.x + p.kx), Y(body.y + p.ky)] as Pt, foot: [X(l.x + p.fx), Y(body.y + p.fy)] as Pt }
      }),
    }
  }, [])
  const visor: Pt = [X(0.7), Y(y + 0.12)]

  return (
    <svg viewBox="0 0 640 400" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="rdf-fan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-brand)" stopOpacity="0.02" />
          <stop offset="1" stopColor="var(--color-brand)" stopOpacity="0.28" />
        </linearGradient>
        <radialGradient id="rdf-pool">
          <stop offset="0" stopColor="var(--color-brand)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--color-brand)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rdf-fade" cx={CX / 640} cy={GY / 400} r="0.5">
          <stop offset="0.35" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="rdf-floor" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="400">
          <rect width="640" height="400" fill="url(#rdf-fade)" />
        </mask>
      </defs>

      {/* floor: a perspective grid that fades out, a pool of light, two sonar rings and the contact shadow */}
      <g stroke="var(--color-fg)" strokeOpacity="0.1" mask="url(#rdf-floor)">
        <line x1="0" y1={GY} x2="640" y2={GY} />
        {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => <line key={i} x1={CX + i * 56} y1={GY} x2={CX + i * 120} y2={GY + 90} />)}
        {[22, 50].map((d) => <line key={d} x1="0" y1={GY + d} x2="640" y2={GY + d} />)}
      </g>
      <ellipse cx={CX} cy={GY} rx="190" ry="26" fill="url(#rdf-pool)" />
      <ellipse cx={CX} cy={GY} rx="240" ry="30" fill="none" stroke="var(--color-brand)" strokeOpacity="0.18" />
      <ellipse cx={CX} cy={GY} rx="150" ry="19" fill="none" stroke="var(--color-brand)" strokeOpacity="0.38" />
      <ellipse cx={CX - 4} cy={GY + 2} rx="120" ry="7" fill="#000" fillOpacity="0.35" />

      {/* light fan from the head to the floor ahead */}
      <polygon points={`${visor[0]},${visor[1]} ${X(1.62)},${GY} ${X(1.08)},${GY}`} fill="url(#rdf-fan)" />
      <line x1={X(1.62)} y1={GY} x2={X(1.08)} y2={GY} stroke="var(--color-brand)" strokeWidth="2" />

      {/* plumb lines from the hips, a drafting touch */}
      <g stroke="var(--color-fg)" strokeOpacity="0.25" strokeDasharray="3 5">
        <line x1={X(DOG.hipX)} y1={Y(y)} x2={X(DOG.hipX)} y2={GY} />
        <line x1={X(-DOG.hipX)} y1={Y(y)} x2={X(-DOG.hipX)} y2={GY} />
      </g>

      {legs.filter((l) => l.far).map((l) => <Leg key={l.id} {...l} />)}

      {/* mast, body, spine plate, side stripe */}
      <line x1={X(-0.38)} y1={Y(y + 0.23)} x2={X(-0.38)} y2={Y(y + 0.35)} stroke="var(--color-fg)" strokeOpacity="0.5" strokeWidth="2.5" />
      <circle cx={X(-0.38)} cy={Y(y + 0.355)} r="4.5" fill="var(--color-brand)" />
      <rect x={X(0.51)} y={Y(y + 0.205)} width={1.02 * S} height={0.25 * S} rx="14" fill={SHELL} stroke="var(--color-fg)" strokeOpacity="0.55" />
      <rect x={X(0.26)} y={Y(y + 0.24)} width={0.62 * S} height={0.035 * S} rx="3" fill={SHELL} stroke="var(--color-fg)" strokeOpacity="0.5" />
      <line x1={X(0.37)} y1={Y(y + 0.03)} x2={X(-0.37)} y2={Y(y + 0.03)} stroke="var(--color-brand)" strokeWidth="3" strokeLinecap="round" />

      {/* head and visor */}
      <rect x={X(0.69)} y={Y(y + 0.19)} width={0.2 * S} height={0.18 * S} rx="11" fill={SHELL} stroke="var(--color-fg)" strokeOpacity="0.55" />
      <rect x={visor[0] - 2.5} y={visor[1] - 6} width="5" height="12" rx="2.5" fill="#ffb183" />
      <circle cx={visor[0]} cy={visor[1]} r="14" fill="var(--color-brand)" fillOpacity="0.18" />

      {legs.filter((l) => !l.far).map((l) => <Leg key={l.id} {...l} />)}
    </svg>
  )
}
