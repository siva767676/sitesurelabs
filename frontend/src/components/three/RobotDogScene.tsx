import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import type { MotionValue } from 'motion/react'
import { DOG, GROUND_SPEED, LEGS, bodyPose, legPose, type DogControls, type DogHud } from './robotDog'

/**
 * The robotic inspection dog, as a live concept render. A procedural quadruped (no model files) trots in place
 * while the floor, a construction grid of columns and beams, and the dust slide past, so it reads as walking a
 * site. It arrives as a wireframe and a scan sweep turns it solid, then its visor lights up; a scan band keeps
 * climbing the body, and a sonar ring pulses out across the floor and lights the columns it reaches. The camera
 * orbits with the page scroll and with horizontal drags. Everything is lines, points and a few small shaders. The
 * stage is always dark, so the colours are fixed.
 */

const INK = { shell: '#2b3036', limb: '#1c1f24', line: '#f4f1ec', orange: '#f06623', lens: '#ffb183' }
const TARGET = new THREE.Vector3(0.06, 0.36, 0)
const RING_PERIOD = 3.6

const common = /* glsl */ `
  uniform float uTime; uniform float uReveal; uniform vec3 uAccent;
  // the bright front of the sweep that materialises the robot, and the scan band that keeps climbing it
  float sweepFront(float x) { float d = x - uReveal; return exp(-d * d * 260.0); }
  float scanBand(float y) { float d = y - mix(-0.15, 1.1, fract(uTime * 0.21)); return exp(-d * d * 1500.0); }`

const shadedVert = /* glsl */ `
  varying vec3 vW; varying vec3 vN; varying vec3 vV;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz);
    gl_Position = projectionMatrix * viewMatrix * w;
  }`
const plainVert = /* glsl */ `
  varying vec3 vW;
  void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`

const shellFrag = /* glsl */ `
  uniform vec3 uBase;
  varying vec3 vW; varying vec3 vN; varying vec3 vV;
  ${common}
  void main() {
    if (vW.x > uReveal) discard;
    vec3 n = normalize(vN), v = normalize(vV);
    float key = max(dot(n, normalize(vec3(0.3, 0.9, -0.35))), 0.0);
    float kick = pow(max(dot(n, normalize(vec3(-0.7, 0.35, 0.6))), 0.0), 2.0);
    float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 3.0);
    // key light from above; a white rim on every silhouette; an orange kick on the edges turned away from the key
    vec3 col = uBase * (0.35 + 0.95 * key) + vec3(0.95, 0.93, 0.9) * fres * 0.34 + uAccent * kick * fres * 1.1;
    col += uAccent * (scanBand(vW.y) * 0.35 + sweepFront(vW.x) * 1.6);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }`
const edgeFrag = /* glsl */ `
  uniform vec3 uLine; uniform float uAlpha;
  varying vec3 vW;
  ${common}
  void main() {
    float f = sweepFront(vW.x), s = scanBand(vW.y);
    float a = (vW.x > uReveal ? 0.13 : uAlpha) + f + s * 0.5;
    gl_FragColor = vec4(mix(uLine, uAccent, clamp(f + s * 0.8, 0.0, 1.0)), clamp(a, 0.0, 1.0));
    #include <colorspace_fragment>
  }`
const glowFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uK;
  varying vec3 vW;
  ${common}
  void main() {
    if (vW.x > uReveal) discard;
    gl_FragColor = vec4(uColor * uK, 1.0);
    #include <colorspace_fragment>
  }`

const floorFrag = /* glsl */ `
  uniform float uOffset; uniform float uRing; uniform float uBoot; uniform vec3 uLine; uniform vec3 uAccent; uniform vec3 uFeet[4];
  varying vec3 vW;
  float grid(vec2 p, float s) { vec2 q = p / s; vec2 g = abs(fract(q - 0.5) - 0.5) / fwidth(q); return 1.0 - min(min(g.x, g.y), 1.0); }
  void main() {
    vec2 p = vW.xz;
    float d = length(p);
    vec2 q = vec2(p.x + uOffset, p.y);
    float fade = smoothstep(7.0, 0.8, length(p * vec2(0.8, 1.0)));
    float lines = (grid(q, 0.25) * 0.07 + grid(q, 1.0) * 0.22) * fade;
    float ring = exp(-pow((d - uRing) * 10.0, 2.0)) * (1.0 - smoothstep(0.6, 4.0, uRing)) * fade;
    float pool = exp(-dot(p * vec2(0.8, 1.4), p * vec2(0.8, 1.4)) * 1.1);
    float feet = 0.0;
    for (int i = 0; i < 4; i++) { vec2 f = p - uFeet[i].xy; feet += exp(-dot(f, f) * 1400.0) * uFeet[i].z; }
    float glow = clamp(lines + ring * 0.5 + pool * 0.1 + feet * 0.7, 0.0, 1.0);
    vec3 col = mix(uLine, uAccent, clamp(ring * 1.6 + pool * 0.9 + feet, 0.0, 1.0));
    // a soft contact shadow under the body, beneath the glow
    vec2 sp = (p - vec2(0.03, 0.0)) * vec2(1.55, 3.0);
    float shade = exp(-dot(sp, sp)) * 0.5;
    float a = glow + shade * (1.0 - glow);
    float boot = smoothstep(uBoot * 9.0, uBoot * 9.0 - 1.4, d);
    gl_FragColor = vec4(a > 0.0 ? col * glow / a : col, a * boot);
    #include <colorspace_fragment>
  }`

const frameVert = /* glsl */ `
  attribute float aBase;
  uniform float uOffset; uniform float uSpan; uniform float uRing;
  varying float vFade; varying float vFlash; varying float vH;
  void main() {
    float x = mod(aBase - uOffset + uSpan * 0.5, uSpan) - uSpan * 0.5;   // the column's place after the floor has moved
    vec3 p = position; p.x += x - aBase;
    vFade = smoothstep(uSpan * 0.5, uSpan * 0.18, abs(x));
    vFlash = exp(-pow((length(vec2(x, p.z)) - uRing) * 2.5, 2.0)) * (1.0 - smoothstep(1.5, 6.0, uRing));
    vH = p.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }`
const frameFrag = /* glsl */ `
  uniform vec3 uLine; uniform vec3 uAccent; uniform float uBoot;
  varying float vFade; varying float vFlash; varying float vH;
  void main() {
    float a = vFade * (0.09 + vFlash * 0.55) * smoothstep(3.4, 0.4, vH) * uBoot;
    gl_FragColor = vec4(mix(uLine, uAccent, clamp(vFlash * 1.5, 0.0, 1.0)), a);
    #include <colorspace_fragment>
  }`

const dustVert = /* glsl */ `
  attribute float aSeed;
  uniform float uOffset; uniform float uTime; uniform float uPx;
  varying float vA;
  void main() {
    vec3 p = position;
    p.x = mod(p.x - uOffset + 6.0, 12.0) - 6.0;
    p.y += sin(uTime * 0.4 + aSeed * 6.2831) * 0.05;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vA = smoothstep(6.0, 3.0, abs(p.x)) * (0.35 + 0.65 * fract(aSeed * 7.31));
    gl_PointSize = (1.5 + fract(aSeed * 3.7) * 2.5) * uPx * (3.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }`
const dustFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uBoot;
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * vA * 0.5 * uBoot);
    #include <colorspace_fragment>
  }`

const haloVert = /* glsl */ `
  uniform float uPx; uniform float uSize;
  void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = uSize * uPx / -mv.z; gl_Position = projectionMatrix * mv; }`
const haloFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uK;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    gl_FragColor = vec4(uColor, exp(-d * d * 28.0) * uK);
    #include <colorspace_fragment>
  }`

/** Columns, beams and some bracing either side of the robot's path: a building going up. aBase is the column's x,
 *  so every line of a column wraps around the far ends together as the floor moves. */
function buildFrames(bays: number, gap: number) {
  const pos: number[] = [], base: number[] = []
  const H = 2.6, Z = 1.75
  const seg = (b: number, a: number[], c: number[]) => { pos.push(...a, ...c); base.push(b, b) }
  for (let i = 0; i < bays; i++) {
    const x = -((bays * gap) / 2) + i * gap
    for (const z of [-Z, Z]) {
      seg(x, [x, 0, z], [x, H, z])                // column
      seg(x, [x, H, z], [x + gap, H, z])          // beam
      seg(x, [x, H * 0.5, z], [x + gap, H * 0.5, z]) // the floor slab above, seen edge-on
      if (z > 0 && i % 2 === 0) seg(x, [x, 0, z], [x + gap, H * 0.5, z]) // bracing on the far side
    }
    seg(x, [x, H, -Z], [x, H, Z])                 // cross beam
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('aBase', new THREE.Float32BufferAttribute(base, 1))
  return g
}

function buildDust(n: number) {
  const pos = new Float32Array(n * 3), seed = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    // deterministic scatter (golden-ratio sequence) so the composition is the same on every load
    const a = (i * 0.618034) % 1, b = (i * 0.754877) % 1, c = (i * 0.569840) % 1
    pos.set([a * 12 - 6, 0.05 + b * 2.2, c * 6 - 3], i * 3)
    seed[i] = (i * 0.137) % 1
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
  return g
}

interface PartProps { geo: THREE.BufferGeometry; edges?: THREE.BufferGeometry; fill: THREE.Material; line?: THREE.Material; position?: [number, number, number] }
/** A solid piece of the robot with its outline. */
function Part({ geo, edges, fill, line, position }: PartProps) {
  return (
    <group position={position}>
      <mesh geometry={geo} material={fill} />
      {edges && line && <lineSegments geometry={edges} material={line} renderOrder={1} />}
    </group>
  )
}

interface WorldProps { mobile: boolean; live: boolean; progress: MotionValue<number>; hudRef: RefObject<DogHud>; controlsRef: RefObject<DogControls> }

function World({ mobile, live, progress, hudRef, controlsRef }: WorldProps) {
  const { camera, gl, size } = useThree()
  const body = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const joints = useRef(LEGS.map(() => ({ hip: null as THREE.Group | null, knee: null as THREE.Group | null })))
  const s = useRef({ t: 0, start: -1, sp: 0.5, px: 0, py: 0, offset: 0, dist: 3.6, shown: -1, feet: [false, false, false, false], dirty: true })
  const px = Math.min(window.devicePixelRatio || 1, 2)

  const geo = useMemo(() => {
    const torso = new RoundedBoxGeometry(1.02, 0.25, 0.36, 2, 0.06)
    const spine = new RoundedBoxGeometry(0.62, 0.035, 0.2, 2, 0.012)
    const skull = new RoundedBoxGeometry(0.2, 0.18, 0.29, 2, 0.045)
    const visor = new RoundedBoxGeometry(0.014, 0.05, 0.21, 2, 0.006)
    const face = new RoundedBoxGeometry(0.016, 0.14, 0.25, 2, 0.007)
    const panel = new RoundedBoxGeometry(0.6, 0.1, 0.014, 2, 0.006)
    const rail = new RoundedBoxGeometry(0.5, 0.012, 0.016, 2, 0.005)
    const stripe = new THREE.BoxGeometry(0.74, 0.012, 0.004)
    const hip = new THREE.CylinderGeometry(0.066, 0.066, 0.085, 22).rotateX(Math.PI / 2)
    const knee = new THREE.CylinderGeometry(0.044, 0.044, 0.07, 18).rotateX(Math.PI / 2)
    const hipRing = new THREE.TorusGeometry(0.07, 0.0045, 6, 44)
    const kneeRing = new THREE.TorusGeometry(0.047, 0.0035, 6, 36)
    const thigh = new RoundedBoxGeometry(0.085, DOG.thigh + 0.05, 0.062, 2, 0.026).translate(0, -DOG.thigh / 2, 0)
    const shin = new THREE.CylinderGeometry(0.034, 0.022, DOG.shin, 14).translate(0, -DOG.shin / 2, 0)
    const foot = new THREE.SphereGeometry(0.038, 16, 12)
    const mast = new THREE.CylinderGeometry(0.008, 0.008, 0.12, 8)
    const tip = new THREE.SphereGeometry(0.017, 12, 8)
    const floor = new THREE.PlaneGeometry(30, 30).rotateX(-Math.PI / 2)
    const frames = buildFrames(10, 1.8)
    const dust = buildDust(mobile ? 120 : 260)
    const halo = new THREE.BufferGeometry()
    halo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3))
    const edge = (g: THREE.BufferGeometry) => new THREE.EdgesGeometry(g, 28)
    return {
      torso, spine, skull, visor, face, panel, rail, stripe, hip, knee, hipRing, kneeRing, thigh, shin, foot, mast, tip, floor, frames, dust, halo,
      e: { torso: edge(torso), spine: edge(spine), skull: edge(skull), face: edge(face), panel: edge(panel), rail: edge(rail), hip: edge(hip), knee: edge(knee), thigh: edge(thigh), shin: edge(shin) },
    }
  }, [mobile])

  const mat = useMemo(() => {
    // shared uniform objects: setting one value updates every material that uses it
    const u = { uTime: { value: 0 }, uReveal: { value: -9 }, uAccent: { value: new THREE.Color(INK.orange) } }
    const line = new THREE.Color(INK.line)
    const fill = (base: string) => new THREE.ShaderMaterial({ vertexShader: shadedVert, fragmentShader: shellFrag, uniforms: { ...u, uBase: { value: new THREE.Color(base) } }, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })
    const edges = (alpha: number) => new THREE.ShaderMaterial({ vertexShader: plainVert, fragmentShader: edgeFrag, uniforms: { ...u, uLine: { value: line }, uAlpha: { value: alpha } }, transparent: true, depthWrite: false })
    const glow = (color: string) => new THREE.ShaderMaterial({ vertexShader: plainVert, fragmentShader: glowFrag, uniforms: { ...u, uColor: { value: new THREE.Color(color) }, uK: { value: 1 } } })
    const floor = new THREE.ShaderMaterial({
      vertexShader: plainVert, fragmentShader: floorFrag, transparent: true, depthWrite: false,
      uniforms: {
        uOffset: { value: 0 }, uRing: { value: 0 }, uBoot: { value: 0 }, uLine: { value: line }, uAccent: u.uAccent,
        uFeet: { value: LEGS.map(() => new THREE.Vector3()) },
      },
    })
    const frames = new THREE.ShaderMaterial({
      vertexShader: frameVert, fragmentShader: frameFrag, transparent: true, depthWrite: false,
      uniforms: { uOffset: floor.uniforms.uOffset, uRing: floor.uniforms.uRing, uBoot: floor.uniforms.uBoot, uSpan: { value: 18 }, uLine: { value: line }, uAccent: u.uAccent },
    })
    const dust = new THREE.ShaderMaterial({
      vertexShader: dustVert, fragmentShader: dustFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uOffset: floor.uniforms.uOffset, uTime: u.uTime, uPx: { value: px }, uBoot: floor.uniforms.uBoot, uColor: { value: new THREE.Color('#d8d3ca') } },
    })
    const halo = new THREE.ShaderMaterial({ vertexShader: haloVert, fragmentShader: haloFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uPx: { value: px }, uSize: { value: 70 }, uColor: { value: new THREE.Color(INK.orange) }, uK: { value: 0 } } })
    return { u, shell: fill(INK.shell), limb: fill(INK.limb), edge: edges(0.55), edgeDim: edges(0.32), accent: glow(INK.orange), lens: glow(INK.lens), tip: glow(INK.orange), floor, frames, dust, halo }
  }, [px])

  useEffect(() => () => {
    Object.values(geo).forEach((g) => { if (g instanceof THREE.BufferGeometry) g.dispose() })
    Object.values(geo.e).forEach((g) => g.dispose())
  }, [geo])
  useEffect(() => () => { Object.values(mat).forEach((m) => { if (m instanceof THREE.Material) m.dispose() }) }, [mat])

  // re-frame the robot whenever the stage or its anchor box changes size
  useEffect(() => {
    const st = s.current
    st.dirty = true
    const a = hudRef.current?.anchor
    if (!a) return
    const ro = new ResizeObserver(() => { st.dirty = true })
    ro.observe(a)
    return () => ro.disconnect()
  }, [hudRef, size.width, size.height])

  // The frame loop sets these materials' uniforms every frame, so it reaches them through a ref (React treats
  // memoised values as frozen), the same way it reaches the scene graph.
  const gpu = useRef({ mat, tmp: new THREE.Vector3() })
  gpu.current.mat = mat

  useFrame((_, delta) => {
    const st = s.current, c = controlsRef.current, h = hudRef.current
    const { mat: m, tmp } = gpu.current
    const dt = Math.min(delta, 1 / 20) // a paused or backgrounded tab must not jump ahead
    st.t += dt
    const t = st.t
    if (live && st.start < 0) st.start = t
    const since = st.start < 0 ? -1 : t - st.start
    const cam = camera as THREE.PerspectiveCamera

    // Frame the robot inside the anchor box: shift the projection so the target lands on the box's centre,
    // and pull the camera back until the robot fits it.
    if (st.dirty && h?.anchor) {
      const cr = gl.domElement.getBoundingClientRect(), ar = h.anchor.getBoundingClientRect()
      if (cr.width > 0 && ar.width > 0) {
        st.dirty = false
        const ax = ar.left - cr.left + ar.width / 2, ay = ar.top - cr.top + ar.height / 2
        cam.setViewOffset(cr.width, cr.height, cr.width / 2 - ax, cr.height / 2 - ay, cr.width, cr.height)
        cam.updateProjectionMatrix()
        const span = 2 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))
        st.dist = THREE.MathUtils.clamp(Math.max((1.75 * cr.height) / (span * ar.width), (1.0 * cr.height) / (span * ar.height)), 2.4, 9)
      }
    }

    // camera: scroll orbits it, a drag turns it (with inertia), the pointer adds a little parallax
    if (c) {
      if (!c.held) { c.drag += c.vel; c.vel *= Math.pow(0.9, dt * 60) }
      st.px += (c.px - st.px) * Math.min(1, dt * 3)
      st.py += (c.py - st.py) * Math.min(1, dt * 3)
    }
    st.sp += (progress.get() - st.sp) * Math.min(1, dt * 5)
    const yaw = THREE.MathUtils.degToRad(-62 + (st.sp - 0.5) * 70) + (c?.drag ?? 0) + st.px * 0.12
    const el = THREE.MathUtils.degToRad(12 - (st.sp - 0.5) * 8) - st.py * 0.04
    cam.position.set(TARGET.x + st.dist * Math.cos(el) * Math.cos(yaw), TARGET.y + st.dist * Math.sin(el), TARGET.z + st.dist * Math.cos(el) * Math.sin(yaw))
    cam.lookAt(TARGET)

    // the walk
    st.offset += GROUND_SPEED * dt
    const pose = bodyPose(t)
    if (body.current) { body.current.position.y = pose.y; body.current.rotation.z = pose.pitch; body.current.rotation.x = pose.roll }
    if (head.current) { head.current.rotation.y = 0.2 * Math.sin(t * 0.45); head.current.rotation.z = -0.05 + 0.035 * Math.sin(t * 0.31) }
    const feet = m.floor.uniforms.uFeet.value as THREE.Vector3[]
    LEGS.forEach((leg, i) => {
      const lp = legPose(leg, t, pose.y)
      const j = joints.current[i]
      if (j.hip) j.hip.rotation.z = lp.hip
      if (j.knee) j.knee.rotation.z = lp.knee
      feet[i].set(leg.x + lp.fx, leg.z + leg.side * 0.05, lp.down ? 1 : 0)
      if (st.feet[i] !== lp.down) { st.feet[i] = lp.down; h?.feet[i]?.toggleAttribute('data-on', lp.down) }
    })

    // arrival: the floor grows out from the robot, then a sweep turns the wireframe solid, then the head lights up
    const k = since < 0 ? 0 : THREE.MathUtils.clamp((since - 0.5) / 2.3, 0, 1)
    const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2
    m.u.uTime.value = t
    m.u.uReveal.value = since < 0 ? -9 : k >= 1 ? 99 : THREE.MathUtils.lerp(-0.72, 1.1, e)
    m.floor.uniforms.uBoot.value = since < 0 ? 0 : THREE.MathUtils.smoothstep(since, 0, 1.8)
    m.floor.uniforms.uOffset.value = st.offset
    m.floor.uniforms.uRing.value = ((t % RING_PERIOD) / RING_PERIOD) * 6
    const lit = since < 0 ? 0 : THREE.MathUtils.clamp((since - 2.6) / 0.9, 0, 1)
    m.halo.uniforms.uK.value = lit * (0.8 + 0.2 * Math.sin(t * 2.4))
    m.tip.uniforms.uK.value = Math.sin(t * 2.6) > 0.82 ? 1.6 : 0.45

    // HUD: the reticle follows the head; the readout shows the viewing angle
    if (h?.reticle && head.current) {
      head.current.localToWorld(tmp.set(0.09, 0, 0)).project(cam)
      h.reticle.style.transform = `translate3d(${((tmp.x * 0.5 + 0.5) * size.width).toFixed(1)}px, ${((0.5 - tmp.y * 0.5) * size.height).toFixed(1)}px, 0) translate(-50%, -50%)`
      h.reticle.style.opacity = k > 0.9 ? '1' : '0'
    }
    const deg = Math.round(((THREE.MathUtils.radToDeg(yaw) % 360) + 360) % 360) % 360
    if (deg !== st.shown && h?.yaw) { st.shown = deg; h.yaw.textContent = `${String(deg).padStart(3, '0')}°` }
  })

  return (
    <>
      <mesh geometry={geo.floor} material={mat.floor} renderOrder={-2} />
      <lineSegments geometry={geo.frames} material={mat.frames} renderOrder={-1} frustumCulled={false} />
      <points geometry={geo.dust} material={mat.dust} frustumCulled={false} />

      <group ref={body}>
        <Part geo={geo.torso} edges={geo.e.torso} fill={mat.shell} line={mat.edge} position={[0, 0.08, 0]} />
        <Part geo={geo.spine} edges={geo.e.spine} fill={mat.shell} line={mat.edge} position={[-0.05, 0.222, 0]} />
        {[-1, 1].map((z) => (
          <group key={z}>
            <Part geo={geo.panel} edges={geo.e.panel} fill={mat.shell} line={mat.edgeDim} position={[-0.02, 0.115, z * 0.184]} />
            <mesh geometry={geo.stripe} material={mat.accent} position={[0, 0.03, z * 0.181]} />
            <Part geo={geo.rail} edges={geo.e.rail} fill={mat.limb} line={mat.edgeDim} position={[-0.05, 0.245, z * 0.075]} />
          </group>
        ))}
        <mesh geometry={geo.mast} material={mat.limb} position={[-0.38, 0.29, 0.06]} />
        <mesh geometry={geo.tip} material={mat.tip} position={[-0.38, 0.355, 0.06]} />
        <group ref={head} position={[0.5, 0.1, 0]}>
          <Part geo={geo.skull} edges={geo.e.skull} fill={mat.shell} line={mat.edge} position={[0.09, 0, 0]} />
          <Part geo={geo.face} edges={geo.e.face} fill={mat.limb} line={mat.edgeDim} position={[0.188, 0, 0]} />
          <mesh geometry={geo.visor} material={mat.lens} position={[0.199, 0.02, 0]} />
          <points geometry={geo.halo} material={mat.halo} position={[0.21, 0.02, 0]} renderOrder={2} frustumCulled={false} />
        </group>
        {LEGS.map((leg, i) => (
          <group key={leg.id} ref={(g) => { joints.current[i].hip = g }} position={[leg.x, 0, leg.z]}>
            <Part geo={geo.hip} edges={geo.e.hip} fill={mat.shell} line={mat.edge} position={[0, 0, leg.side * 0.01]} />
            <mesh geometry={geo.hipRing} material={mat.accent} position={[0, 0, leg.side * 0.054]} />
            <Part geo={geo.thigh} edges={geo.e.thigh} fill={mat.shell} line={mat.edge} position={[0, 0, leg.side * 0.05]} />
            <group ref={(g) => { joints.current[i].knee = g }} position={[0, -DOG.thigh, 0]}>
              <Part geo={geo.knee} edges={geo.e.knee} fill={mat.limb} line={mat.edgeDim} position={[0, 0, leg.side * 0.05]} />
              <mesh geometry={geo.kneeRing} material={mat.accent} position={[0, 0, leg.side * 0.087]} />
              <Part geo={geo.shin} edges={geo.e.shin} fill={mat.limb} line={mat.edgeDim} position={[0, 0, leg.side * 0.05]} />
              <mesh geometry={geo.foot} material={mat.limb} position={[0, -DOG.shin, leg.side * 0.05]} />
            </group>
          </group>
        ))}
      </group>
    </>
  )
}

interface RobotDogSceneProps extends WorldProps { paused: boolean; onReady: () => void; onFail: () => void }

export default function RobotDogScene({ paused, onReady, onFail, ...world }: RobotDogSceneProps) {
  const [dpr, setDpr] = useState(1.75)
  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={paused ? 'never' : 'always'}
      dpr={[1, dpr]}
      camera={{ position: [1.6, 1.1, -3.1], fov: 30, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        gl.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); onFail() })
        requestAnimationFrame(onReady)
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <World {...world} />
    </Canvas>
  )
}
