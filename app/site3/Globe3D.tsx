'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { LAND_MASK, MASK_HEIGHT, MASK_WIDTH, MASK_STEP } from './land-mask'

type Location = { city: string; latitude: number; longitude: number }

type GlobeProps = { location: Location | null; reduceMotion: boolean }

function spherical(lat: number, lon: number, radius = 2) {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lon + 180) * Math.PI) / 180
  return new THREE.Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta))
}

function seededRandom(seed: number) {
  let s = seed >>> 0
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296)
}

function countryDots() {
  // Dense and evenly spaced points recreate a fine dotted Earth without remote textures.
  const decoded = Uint8Array.from(atob(LAND_MASK), ch => ch.charCodeAt(0))
  const read = (row: number, col: number) => {
    const r = Math.min(MASK_HEIGHT - 1, Math.max(0, row))
    const w = ((col % MASK_WIDTH) + MASK_WIDTH) % MASK_WIDTH
    const index = r * MASK_WIDTH + w
    return (decoded[index >> 3] & (1 << (index & 7))) ? 1 : 0
  }
  const landProbability = (lat: number, lon: number) => {
    const row = (lat + 90) / MASK_STEP, col = (lon + 180) / MASK_STEP
    const r = Math.floor(row), cc = Math.floor(col)
    const fy = row - r, fx = col - cc
    const a = read(r, cc) * (1 - fx) + read(r, cc + 1) * fx
    const b = read(r + 1, cc) * (1 - fx) + read(r + 1, cc + 1) * fx
    return a * (1 - fy) + b * fy
  }

  const rand = seededRandom(839211)
  const pos: number[] = []
  const rgb: number[] = []
  const bright = new THREE.Color('#f2f5f8')
  const soft = new THREE.Color('#919aa5')
  const ocean = new THREE.Color('#222a34')
  const latStep = .72
  for (let lat = -89.3, row = 0; lat < 89.3; lat += latStep, row++) {
    const cos = Math.cos(lat * Math.PI / 180)
    const perRow = Math.max(12, Math.round((360 * cos) / latStep))
    for (let col = 0; col < perRow; col++) {
      const lon = -180 + (col + (row % 2) * .5) * 360 / perRow
      const probability = landProbability(lat, lon)
      const land = rand() < probability
      if (!land && rand() > .055) continue
      const p = spherical(lat + (rand() - .5) * .18, lon + (rand() - .5) * .18, 2.016)
      pos.push(p.x, p.y, p.z)
      if (land) {
        const factor = .58 + rand() * .42
        const colr = bright.clone().lerp(soft, rand() * .36)
        rgb.push(colr.r * factor, colr.g * factor, colr.b * factor)
      } else {
        const factor = .30 + rand() * .40
        rgb.push(ocean.r * factor, ocean.g * factor, ocean.b * factor)
      }
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(rgb, 3))
  geometry.computeBoundingSphere()
  return geometry
}

function OrbitRing({ tilt, color = '#1f78c3', radius = 2.54, speed = 0 }: { tilt: [number, number, number]; color?: string; radius?: number; speed?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.z += delta * speed })
  return <group ref={ref} rotation={tilt}>
    <mesh>
      <torusGeometry args={[radius, .0034, 2, 160]} />
      <meshBasicMaterial color={color} transparent opacity={.28} depthWrite={false} />
    </mesh>
    <mesh position={[Math.cos(1.65) * radius, Math.sin(1.65) * radius, 0]}>
      <sphereGeometry args={[.033, 12, 12]} />
      <meshBasicMaterial color="#69ccff" />
    </mesh>
  </group>
}

type Hub = { name: string; lat: number; lon: number; label?: boolean; dy?: number; host?: boolean }
// Ajuste a região real da hospedagem aqui (Vercel padrão = Washington D.C./Virgínia, iad1).
const HUBS: Hub[] = [
  { name: 'HOSPEDAGEM · VERCEL · VIRGÍNIA', lat: 38.95, lon: -77.45, label: true, host: true },
  { name: 'APPLE · CUPERTINO', lat: 37.33, lon: -122.01, label: true, dy: -26 },
  { name: 'NVIDIA · SANTA CLARA', lat: 37.37, lon: -121.96, label: true, dy: 0 },
  { name: 'NGROK · SÃO FRANCISCO', lat: 37.77, lon: -122.42, label: true, dy: 26 },
  { name: 'MICROSOFT · REDMOND', lat: 47.64, lon: -122.13, label: true },
  { name: 'TESLA · AUSTIN', lat: 30.22, lon: -97.62, label: true },
  { name: 'DEEPMIND · LONDRES', lat: 51.53, lon: -0.12, label: true },
  { name: 'TSMC · TAIWAN', lat: 24.78, lon: 120.97, label: true },
  { name: 'SONY · TÓQUIO', lat: 35.68, lon: 139.69, label: true },
  { name: 'SAMSUNG · SEUL', lat: 37.5, lon: 127.0 },
  { name: 'SHENZHEN', lat: 22.54, lon: 114.06 },
  { name: 'SINGAPURA', lat: 1.35, lon: 103.82 },
  { name: 'BANGALORE', lat: 12.97, lon: 77.59 },
  { name: 'DUBAI', lat: 25.2, lon: 55.27 },
]
const ARC_SEGMENTS = 64

function Network({ origin, pivot, reduceMotion }: { origin: [number, number]; pivot: React.RefObject<THREE.Group | null>; reduceMotion: boolean }) {
  const net = useMemo(() => {
    const a = spherical(origin[0], origin[1], 1).normalize()
    const paths: (THREE.Vector3[] | null)[] = []
    const seg: number[] = []
    HUBS.forEach(h => {
      const b = spherical(h.lat, h.lon, 1).normalize()
      const ang = a.angleTo(b)
      if (ang < .03) { paths.push(null); return }
      const lift = .05 + .46 * (ang / Math.PI)
      const pts: THREE.Vector3[] = []
      for (let i = 0; i <= ARC_SEGMENTS; i++) {
        const t = i / ARC_SEGMENTS
        pts.push(a.clone().lerp(b, t).normalize().multiplyScalar(2.03 + Math.sin(Math.PI * t) * lift))
      }
      paths.push(pts)
      for (let i = 0; i < ARC_SEGMENTS; i++) seg.push(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z)
    })
    const lines = new THREE.BufferGeometry()
    lines.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3))
    const dots = new THREE.BufferGeometry()
    dots.setAttribute('position', new THREE.Float32BufferAttribute(HUBS.flatMap(h => spherical(h.lat, h.lon, 2.025).toArray()), 3))
    const pulses = new THREE.BufferGeometry()
    pulses.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(HUBS.length * 3), 3))
    const units = HUBS.map(h => spherical(h.lat, h.lon, 1).normalize())
    return { paths, lines, dots, pulses, units }
  }, [origin[0], origin[1]])
  useEffect(() => () => { net.lines.dispose(); net.dots.dispose(); net.pulses.dispose() }, [net])

  const labels = useRef<(HTMLDivElement | null)[]>([])
  const shown = useRef<boolean[]>([])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  useFrame(state => {
    const attr = net.pulses.getAttribute('position') as THREE.BufferAttribute
    const clock = reduceMotion ? 3 : state.clock.elapsedTime
    net.paths.forEach((pts, i) => {
      if (!pts) { attr.setXYZ(i, 0, 0, 0); return }
      const f = ((clock * .16 + i * .137) % 1)
      const p = pts[Math.min(ARC_SEGMENTS, Math.floor(f * ARC_SEGMENTS))]
      attr.setXYZ(i, p.x, p.y, p.z)
    })
    attr.needsUpdate = true
    if (pivot.current) {
      HUBS.forEach((h, i) => {
        const el = labels.current[i]
        if (!el) return
        tmp.copy(net.units[i]).applyQuaternion(pivot.current!.quaternion)
        const visible = tmp.z > .25
        if (shown.current[i] !== visible) { shown.current[i] = visible; el.style.opacity = visible ? '1' : '0' }
      })
    }
  })
  return <>
    <lineSegments geometry={net.lines}><lineBasicMaterial color="#3fa4f0" transparent opacity={.42} depthWrite={false} /></lineSegments>
    <points geometry={net.dots}><pointsMaterial size={.075} color="#9fe3ff" sizeAttenuation transparent opacity={.95} depthWrite={false} /></points>
    <points geometry={net.pulses}><pointsMaterial size={.1} color="#ffffff" sizeAttenuation transparent opacity={.95} depthWrite={false} /></points>
    {HUBS.map((h, i) => h.label ? <Html key={h.name} position={spherical(h.lat, h.lon, 2.03).toArray()} zIndexRange={[15, 0]} style={{ pointerEvents: 'none' }}>
      <div ref={el => { labels.current[i] = el }} className={'site3-hub-label' + (h.host ? ' site3-hub-host' : '')} style={{ transform: `translate(10px, calc(-50% + ${h.dy ?? 0}px))` }}>{h.name}</div>
    </Html> : null)}
  </>
}

function StarField() {
  const geometry = useMemo(() => {
    const random = seededRandom(85921)
    const positions: number[] = []
    for (let i = 0; i < 380; i++) {
      const phi = Math.acos(2 * random() - 1)
      const theta = 2 * Math.PI * random()
      const r = 10 + random() * 9
      positions.push(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return g
  }, [])
  return <points geometry={geometry}><pointsMaterial size={.03} color="#a6d8ff" opacity={.53} transparent sizeAttenuation depthWrite={false} /></points>
}

function World({ location, reduceMotion }: GlobeProps) {
  const globeDots = useMemo(countryDots, [])
  useEffect(() => () => globeDots.dispose(), [globeDots])
  const markerLabel = useRef<HTMLDivElement>(null)
  const markerAnchor = useRef<THREE.Mesh>(null)
  const wp = useMemo(() => new THREE.Vector3(), [])
  const lastVisible = useRef(true)
  const shell = useRef<THREE.Group>(null)
  const pivot = useRef<THREE.Group>(null)
  const marker = location ? spherical(location.latitude, location.longitude, 2.23) : spherical(-23.55, -46.63, 2.23)
  const origin = useMemo<[number, number]>(() => location ? [location.latitude, location.longitude] : [-23.55, -46.63], [location?.latitude, location?.longitude])
  const targetQuaternion = useMemo(() => {
    const v = spherical(origin[0], origin[1], 1).normalize()
    const hub = spherical(38, -100, 1).normalize()
    const mid = v.clone().add(hub.multiplyScalar(.9))
    const center = mid.length() > .25 ? mid.normalize() : v
    return new THREE.Quaternion().setFromUnitVectors(center, new THREE.Vector3(0, .1, 1).normalize())
  }, [origin])
  useFrame((state, delta) => {
    if (pivot.current) pivot.current.quaternion.slerp(targetQuaternion, 1 - Math.exp(-delta * 2.4))
    if (shell.current && !reduceMotion) shell.current.rotation.z = Math.sin(state.clock.elapsedTime * .13) * .013
    if (markerAnchor.current && markerLabel.current) {
      markerAnchor.current.getWorldPosition(wp)
      const visible = wp.z > .25
      if (visible !== lastVisible.current) {
        lastVisible.current = visible
        markerLabel.current.style.opacity = visible ? '1' : '0'
      }
    }
  })
  return <>
    <ambientLight intensity={.8} />
    <StarField />
    <group ref={pivot}>
      <group ref={shell}>
      <mesh>
        <sphereGeometry args={[2.002, 48, 48]} />
        <meshBasicMaterial color="#090a0c" />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.05, 48, 32]} />
        <meshBasicMaterial color="#e1ebf4" transparent opacity={.055} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <points geometry={globeDots}>
        <shaderMaterial transparent depthWrite={false} depthTest vertexShader={"attribute vec3 color;\nvarying vec3 vColor;\nvarying float vFacing;\nvoid main() {\n  vColor = color;\n  vec4 mv = modelViewMatrix * vec4(position, 1.0);\n  gl_Position = projectionMatrix * mv;\n  vec3 n = normalize(mat3(modelViewMatrix) * position);\n  vFacing = smoothstep(0.04, 0.90, max(0.0, n.z));\n  gl_PointSize = clamp(11.0 / -mv.z, 1.15, 2.9);\n}"} fragmentShader={"varying vec3 vColor;\nvarying float vFacing;\nvoid main() {\n  vec2 pt = gl_PointCoord - vec2(0.5);\n  float softCircle = 1.0 - smoothstep(0.30, 0.52, length(pt));\n  if (softCircle < 0.02) discard;\n  gl_FragColor = vec4(vColor, softCircle * (0.22 + 0.78 * vFacing));\n}"} />
      </points>
      <Html position={[marker.x, marker.y, marker.z]} center distanceFactor={8.2} zIndexRange={[20, 0]}>
        <div ref={markerLabel} className="site3-globe-marker" aria-label={location ? `Conectado: ${location.city}` : 'Rede global conectada'}>
          <span className="site3-live-dot" />ONLINE <span className="site3-marker-sep">·</span> {(location?.city || 'GLOBAL').toUpperCase()}
        </div>
      </Html>
      <Network origin={origin} pivot={pivot} reduceMotion={reduceMotion} />
      <mesh ref={markerAnchor} position={[marker.x, marker.y, marker.z]}>
        <sphereGeometry args={[.036, 10, 10]} />
        <meshBasicMaterial color="#b6ecff" />
      </mesh>
      </group>
    </group>
    <OrbitRing tilt={[.42, .2, .2]} color="#425367" speed={reduceMotion ? 0 : .005} />
    <OrbitRing tilt={[-.32, 1.12, -.33]} radius={2.75} color="#153e6d" speed={reduceMotion ? 0 : -.007} />
    <OrbitControls autoRotate={false} enableZoom={false} enablePan={false} enableDamping dampingFactor={.045} minPolarAngle={.35} maxPolarAngle={Math.PI - .35} />
  </>
}

export default function Globe3D(props: GlobeProps) {
  const frame = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)
  const [tabVisible, setTabVisible] = useState(true)
  useEffect(() => {
    const el = frame.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '80px' })
    io.observe(el)
    const onVis = () => setTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis) }
  }, [])
  return <div ref={frame} className="site3-canvas-frame" role="img" aria-label="Globo terrestre 3D de partículas interativo. Arraste para girar e explorar conexões globais.">
    <Canvas frameloop={inView && tabVisible ? 'always' : 'never'} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true, powerPreference: 'default' }} camera={{ fov: 43, near: .1, far: 100, position: [0, 0, 6.9] }} style={{ touchAction: 'pan-y' }}>
      <World {...props} />
    </Canvas>
  </div>
}
