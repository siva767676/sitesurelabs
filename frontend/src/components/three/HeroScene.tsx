import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { globe } from '@/design/tokens'
import type { Theme } from '@/lib/theme'

/**
 * Hero visual: an abstract "planet of intelligence". A dotted sphere (halftone landmasses from a
 * noise field, deliberately not real geography), glowing network nodes, light-trail arcs between
 * them and two thin orbit rings. Pure points/lines with custom shaders: no textures, no models,
 * so the whole scene is a few draw calls. Colours and blending follow the theme (see `globe` in
 * design/tokens.ts): light on dark adds up, ink on light composites normally.
 */

interface SceneProps { count: number; interactive: boolean; paused: boolean; theme: Theme }

const R = 1

function fib(n: number) {
  const out: THREE.Vector3[] = []
  const g = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const t = g * i
    out.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r))
  }
  return out
}

const land = (p: THREE.Vector3) =>
  Math.sin(p.x * 2.3 + 1.1) * Math.cos(p.y * 2.9 - 0.7) + Math.sin(p.z * 3.7 + p.x * 1.9) * 0.6 + Math.sin(p.y * 6.1 + p.z * 4.3) * 0.25

const ll = (lat: number, lon: number) => {
  const a = (lat * Math.PI) / 180, b = (lon * Math.PI) / 180
  return new THREE.Vector3(Math.cos(a) * Math.cos(b), Math.sin(a), Math.cos(a) * Math.sin(b))
}

// Fixed node layout so the composition is deliberate and identical on every load.
const NODES: [number, number][] = [
  [48, -20], [32, 22], [14, 70], [-8, 118], [28, 150], [-30, 40], [-18, -50], [8, -88], [58, 96], [-44, 130], [40, -120], [-2, 10], [20, -150], [-56, -10],
]
const LINKS: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [5, 6], [6, 7], [0, 8], [8, 4], [2, 11], [11, 6], [9, 3], [10, 0], [12, 7], [13, 5], [11, 1]]

const pointVert = /* glsl */ `
  attribute float aSize; attribute float aLand; attribute float aSeed;
  uniform float uTime; uniform float uPx;
  varying float vLand; varying float vFacing; varying float vSweep;
  void main(){
    vLand = aLand;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normalize(position));
    vFacing = n.z;
    float band = fract(position.y * 0.45 + uTime * 0.07);
    vSweep = smoothstep(0.0, 0.06, band) * (1.0 - smoothstep(0.06, 0.2, band));
    float tw = 0.85 + 0.15 * sin(uTime * 1.6 + aSeed * 40.0);
    gl_PointSize = aSize * uPx * tw * (3.2 / -mv.z) * (1.0 + vSweep * 0.7);
    gl_Position = projectionMatrix * mv;
  }`
const pointFrag = /* glsl */ `
  uniform vec3 uCool; uniform vec3 uHot; varying float vLand; varying float vFacing; varying float vSweep;
  void main(){
    vec2 c = gl_PointCoord - 0.5; float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.15, d);
    float front = smoothstep(-0.25, 0.35, vFacing);
    float rim = pow(1.0 - clamp(abs(vFacing), 0.0, 1.0), 2.2);
    vec3 col = mix(uCool, uHot, vLand * 0.85 + vSweep * 0.6 + rim * 0.35);
    float alpha = a * (mix(0.07, 0.95, vLand) * mix(0.28, 1.0, front) + rim * 0.25 + vSweep * 0.5);
    gl_FragColor = vec4(col, alpha);
  }`

const arcVert = /* glsl */ `
  attribute float aT; attribute float aSeed; uniform float uTime; varying float vPulse; varying float vT;
  void main(){
    vT = aT;
    float p = fract(uTime * 0.14 + aSeed);
    float d = abs(aT - p); d = min(d, 1.0 - d);
    vPulse = smoothstep(0.14, 0.0, d);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`
const arcFrag = /* glsl */ `
  uniform vec3 uColor; varying float vPulse; varying float vT;
  void main(){ float base = 0.1 + 0.1 * sin(vT * 3.14159); gl_FragColor = vec4(uColor, base + vPulse * 0.95); }`

const nodeVert = /* glsl */ `
  attribute float aSeed; uniform float uTime; uniform float uPx; varying float vP; varying float vF;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vP = 0.5 + 0.5 * sin(uTime * 2.2 + aSeed * 6.2831);
    vF = normalize(normalMatrix * normalize(position)).z;
    gl_PointSize = (9.0 + vP * 6.0) * uPx * (3.2 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }`
const nodeFrag = /* glsl */ `
  uniform vec3 uColor; uniform vec3 uCore; varying float vP; varying float vF;
  void main(){
    vec2 c = gl_PointCoord - 0.5; float d = length(c); if (d > 0.5) discard;
    float core = smoothstep(0.14, 0.0, d); float halo = smoothstep(0.5, 0.1, d) * (0.35 + vP * 0.3);
    float vis = smoothstep(-0.35, 0.25, vF);
    gl_FragColor = vec4(mix(uColor, uCore, core), (core + halo) * vis);
  }`

function Globe({ count, interactive, paused, theme }: SceneProps) {
  const group = useRef<THREE.Group>(null)
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)
  const mats = useRef<(THREE.ShaderMaterial | null)[]>([null, null, null])
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!interactive) return
    const on = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', on, { passive: true })
    return () => window.removeEventListener('pointermove', on)
  }, [interactive])

  const px = Math.min(window.devicePixelRatio || 1, 2)
  const look = globe[theme]
  // One Color object per role, shared with the shader uniforms: changing the theme only mutates them,
  // so the next frame picks the new colours up without rebuilding any geometry or material.
  const [cool] = useState(() => new THREE.Color(look.cool))
  const [hot] = useState(() => new THREE.Color(look.hot))
  const [landColor] = useState(() => new THREE.Color(look.land))
  const [core] = useState(() => new THREE.Color(look.core))
  useEffect(() => { cool.set(look.cool); landColor.set(look.land); hot.set(look.hot); core.set(look.core) }, [look, cool, landColor, hot, core])

  const dots = useMemo(() => {
    const pts = fib(count)
    const pos = new Float32Array(count * 3), size = new Float32Array(count), isLand = new Float32Array(count), seed = new Float32Array(count)
    pts.forEach((p, i) => {
      pos.set([p.x * R, p.y * R, p.z * R], i * 3)
      const l = land(p) > 0.18 ? 1 : 0
      isLand[i] = l
      size[i] = l ? 5.2 : 3.2
      seed[i] = (i * 0.61803) % 1
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    g.setAttribute('aLand', new THREE.BufferAttribute(isLand, 1))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    return g
  }, [count])

  const arcs = useMemo(() => {
    const SEG = 72
    const pos: number[] = [], t: number[] = [], seed: number[] = []
    LINKS.forEach(([a, b], li) => {
      const A = ll(...NODES[a]), B = ll(...NODES[b])
      const ang = A.angleTo(B)
      const lift = 0.1 + ang * 0.24
      let prev: THREE.Vector3 | null = null
      for (let i = 0; i <= SEG; i++) {
        const u = i / SEG
        const sinT = Math.sin(ang)
        const p = A.clone().multiplyScalar(Math.sin((1 - u) * ang) / sinT).add(B.clone().multiplyScalar(Math.sin(u * ang) / sinT))
        p.normalize().multiplyScalar(R * (1.005 + Math.sin(u * Math.PI) * lift))
        if (prev) {
          pos.push(prev.x, prev.y, prev.z, p.x, p.y, p.z)
          t.push((i - 1) / SEG, u)
          const s = (li * 0.173) % 1
          seed.push(s, s)
        }
        prev = p
      }
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('aT', new THREE.Float32BufferAttribute(t, 1))
    g.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1))
    return g
  }, [])

  const nodes = useMemo(() => {
    const pos = new Float32Array(NODES.length * 3), seed = new Float32Array(NODES.length)
    NODES.forEach((n, i) => { const v = ll(...n).multiplyScalar(R * 1.006); pos.set([v.x, v.y, v.z], i * 3); seed[i] = i / NODES.length })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    return g
  }, [])

  const uniforms = useMemo(() => ({
    pts: { uTime: { value: 0 }, uPx: { value: px }, uCool: { value: cool }, uHot: { value: landColor } },
    arc: { uTime: { value: 0 }, uColor: { value: hot } },
    node: { uTime: { value: 0 }, uPx: { value: px }, uColor: { value: hot }, uCore: { value: core } },
  }), [px, cool, landColor, hot, core])

  useEffect(() => () => { dots.dispose(); arcs.dispose(); nodes.dispose() }, [dots, arcs, nodes])

  useFrame((state, dt) => {
    if (paused) return
    const t = state.clock.elapsedTime
    for (const m of mats.current) if (m) m.uniforms.uTime.value = t
    const g = group.current
    if (g) {
      g.rotation.y += dt * 0.09
      const tx = 0.32 + pointer.current.y * 0.12
      g.rotation.x += (tx - g.rotation.x) * 0.04
      g.position.x += (pointer.current.x * 0.06 - g.position.x) * 0.04
    }
    if (ring1.current) ring1.current.rotation.z += dt * 0.05
    if (ring2.current) ring2.current.rotation.z -= dt * 0.035
  })

  const mat = { transparent: true, depthWrite: false, blending: look.additive ? THREE.AdditiveBlending : THREE.NormalBlending } as const

  return (
    <group ref={group} rotation={[0.32, -0.6, 0.12]}>
      <points geometry={dots}>
        <shaderMaterial ref={(m) => { mats.current[0] = m }} vertexShader={pointVert} fragmentShader={pointFrag} uniforms={uniforms.pts} {...mat} />
      </points>
      <lineSegments geometry={arcs}>
        <shaderMaterial ref={(m) => { mats.current[1] = m }} vertexShader={arcVert} fragmentShader={arcFrag} uniforms={uniforms.arc} {...mat} />
      </lineSegments>
      <points geometry={nodes}>
        <shaderMaterial ref={(m) => { mats.current[2] = m }} vertexShader={nodeVert} fragmentShader={nodeFrag} uniforms={uniforms.node} {...mat} />
      </points>
      <mesh>
        <icosahedronGeometry args={[R * 1.035, 3]} />
        <meshBasicMaterial wireframe color={look.rim} transparent opacity={look.wire} depthWrite={false} />
      </mesh>
      <mesh ref={ring1} rotation={[1.25, 0.2, 0]}>
        <torusGeometry args={[R * 1.42, 0.0035, 6, 220]} />
        <meshBasicMaterial color={look.hot} transparent opacity={look.ringA} depthWrite={false} />
      </mesh>
      <mesh ref={ring2} rotation={[1.9, -0.5, 0.4]}>
        <torusGeometry args={[R * 1.7, 0.0025, 6, 220]} />
        <meshBasicMaterial color={look.rim} transparent opacity={look.ringB} depthWrite={false} />
      </mesh>
    </group>
  )
}

interface HeroSceneProps { mobile: boolean; paused: boolean; theme: Theme; onReady: () => void; onFail: () => void }

export default function HeroScene({ mobile, paused, theme, onReady, onFail }: HeroSceneProps) {
  const dprMax = useRef(mobile ? 1.25 : 1.75)
  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={paused ? 'never' : 'always'}
      dpr={[1, dprMax.current]}
      camera={{ position: [0, 0, 4.1], fov: 38 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        gl.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); onFail() })
        requestAnimationFrame(onReady)
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => { dprMax.current = 1 }} />
      <Globe count={mobile ? 2600 : 6200} interactive={!mobile} paused={paused} theme={theme} />
    </Canvas>
  )
}
