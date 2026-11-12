'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { LAND_MASK, MASK_HEIGHT, MASK_WIDTH, MASK_STEP } from './land-mask'

type Location = { city: string; latitude: number; longitude: number }

type GlobeProps = { location: Location | null; reduceMotion: boolean; onAligned?: () => void }

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
  const bright = new THREE.Color('#ffffff')
  const soft = new THREE.Color('#b1b8c0')
  const ocean = new THREE.Color('#222a34')
  const latStep = .54
  for (let lat = -89.3, row = 0; lat < 89.3; lat += latStep, row++) {
    const cos = Math.cos(lat * Math.PI / 180)
    const perRow = Math.max(12, Math.round((360 * cos) / latStep))
    for (let col = 0; col < perRow; col++) {
      const lon = -180 + (col + (row % 2) * .5) * 360 / perRow
      const probability = landProbability(lat, lon)
      const land = rand() < probability
      if (!land && rand() > .017) continue
      const p = spherical(lat + (rand() - .5) * .18, lon + (rand() - .5) * .18, 2.016)
      pos.push(p.x, p.y, p.z)
      if (land) {
        const factor = .70 + rand() * .30
        const colr = bright.clone().lerp(soft, rand() * .24)
        rgb.push(colr.r * factor, colr.g * factor, colr.b * factor)
      } else {
        const factor = .13 + rand() * .20
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

// Decorative connection locations; no company names or labels appear on the globe.
const CONNECTIONS: ReadonlyArray<readonly [number, number]> = [
  [38.95, -77.45], [37.33, -122.01], [47.64, -122.13],
  [30.22, -97.62], [51.53, -0.12], [24.78, 120.97],
  [35.68, 139.69], [37.50, 127.00], [1.35, 103.82],
  [12.97, 77.59], [25.20, 55.27], [22.54, 114.06],
]

function ConnectionRoutes({ origin }: { origin: [number, number] }) {
  const start = useMemo(() => spherical(origin[0], origin[1], 1).normalize(), [origin[0], origin[1]])
  const routes = useMemo(() => CONNECTIONS.slice(0, 4).map(([lat, lon]) => {
    const end = spherical(lat, lon, 1).normalize()
    const angle = start.angleTo(end)
    if (angle < 0.018) return null
    const waypoints: THREE.Vector3[] = []
    for (let i = 0; i <= 52; i++) {
      const t = i / 52
      const normal = start.clone().lerp(end, t).normalize()
      const elevation = Math.sin(Math.PI * t) * (0.025 + 0.08 * angle / Math.PI)
      waypoints.push(normal.multiplyScalar(2.046 + elevation))
    }
    const curve = new THREE.CatmullRomCurve3(waypoints)
    return {
      core: new THREE.TubeGeometry(curve, 72, 0.0037, 5, false),
      glow: new THREE.TubeGeometry(curve, 72, 0.0075, 5, false),
    }
  }).filter((r): r is { core: THREE.TubeGeometry; glow: THREE.TubeGeometry } => r !== null), [start])

  useEffect(() => () => routes.forEach(r => { r.core.dispose(); r.glow.dispose() }), [routes])
  return <group>
    {routes.map((route, index) => <group key={index}>
      <mesh geometry={route.glow}>
        <meshBasicMaterial color="#298bff" transparent opacity={.045} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh geometry={route.core}>
        <meshBasicMaterial color="#9dbad1" transparent opacity={.24} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>)}
  </group>
}

function NetworkBeaconPoints({ reduceMotion }: { reduceMotion: boolean }) {
  const geometry = useMemo(() => {
    const positions: number[] = []
    const phases: number[] = []
    CONNECTIONS.forEach(([lat, lon], index) => {
      const p = spherical(lat, lon, 2.039)
      positions.push(p.x, p.y, p.z)
      phases.push(index * 0.88)
    })
    const result = new THREE.BufferGeometry()
    result.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    result.setAttribute('phase', new THREE.Float32BufferAttribute(phases, 1))
    return result
  }, [])

  const pulseMaterial = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: [
      'uniform float uTime;',
      'attribute float phase;',
      'varying float vPulse;',
      'void main() {',
      '  vec4 view = modelViewMatrix * vec4(position, 1.0);',
      '  gl_Position = projectionMatrix * view;',
      '  vPulse = 0.18 + 0.82 * pow(0.5 + 0.5 * sin(uTime * 2.8 + phase), 3.0);',
      '  gl_PointSize = clamp(43.0 / max(1.0, -view.z), 5.0, 13.0);',
      '}',
    ].join('\n'),
    fragmentShader: [
      'varying float vPulse;',
      'void main() {',
      '  float radius = length(gl_PointCoord - vec2(0.5));',
      '  float halo = 1.0 - smoothstep(0.16, 0.50, radius);',
      '  if (halo < 0.015) discard;',
      '  gl_FragColor = vec4(0.04, 0.57, 1.0, halo * vPulse * 0.85);',
      '}',
    ].join('\n'),
  }), [])

  useFrame(state => {
    pulseMaterial.uniforms.uTime.value = reduceMotion ? 0 : state.clock.elapsedTime
  })
  useEffect(() => () => { geometry.dispose(); pulseMaterial.dispose() }, [geometry, pulseMaterial])

  return <>
    <points geometry={geometry}>
      <pointsMaterial size={.034} color="#f7faff" sizeAttenuation transparent opacity={.97} depthWrite={false} />
    </points>
    <points geometry={geometry} material={pulseMaterial} />
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

function World({ location, reduceMotion, onAligned }: GlobeProps) {
  const globeDots = useMemo(countryDots, [])
  useEffect(() => () => globeDots.dispose(), [globeDots])
  const markerLabel = useRef<HTMLDivElement>(null)
  const markerAnchor = useRef<THREE.Mesh>(null)
  const wp = useMemo(() => new THREE.Vector3(), [])
  const lastVisible = useRef(true)
  const alignedNotified = useRef(false)
  const shell = useRef<THREE.Group>(null)
  const pivot = useRef<THREE.Group>(null)
  const marker = location ? spherical(location.latitude, location.longitude, 2.23) : spherical(-23.55, -46.63, 2.23)
  const origin = useMemo<[number, number]>(() => location ? [location.latitude, location.longitude] : [-23.55, -46.63], [location?.latitude, location?.longitude])
  const targetQuaternion = useMemo(() => {
    const v = spherical(origin[0], origin[1], 1).normalize()
    return new THREE.Quaternion().setFromUnitVectors(v, new THREE.Vector3(.20, .24, .95).normalize())
  }, [origin])
  useEffect(() => { alignedNotified.current = false }, [targetQuaternion])
  useFrame((state, delta) => {
    if (pivot.current) {
      pivot.current.quaternion.slerp(targetQuaternion, 1 - Math.exp(-delta * 3.3))
      if (!alignedNotified.current && pivot.current.quaternion.angleTo(targetQuaternion) < 0.055) {
        alignedNotified.current = true
        onAligned?.()
      }
    }
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
        <sphereGeometry args={[2.002, 96, 64]} />
        <meshBasicMaterial color="#111318" transparent opacity={.22} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.044, 96, 64]} />
        <shaderMaterial transparent depthWrite={false} side={THREE.BackSide} vertexShader={"varying vec3 vNormal; varying vec3 vView; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vNormal=normalize(normalMatrix*normal); vView=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }"} fragmentShader={"varying vec3 vNormal; varying vec3 vView; void main(){ float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(vView))),3.1); gl_FragColor=vec4(0.69,0.76,0.83,0.025+rim*0.19); }"} />
      </mesh>
      <points geometry={globeDots}>
        <shaderMaterial transparent depthWrite={false} depthTest vertexShader={"attribute vec3 color;\nvarying vec3 vColor;\nvarying float vFacing;\nvoid main() {\n  vColor = color;\n  vec4 mv = modelViewMatrix * vec4(position, 1.0);\n  gl_Position = projectionMatrix * mv;\n  vec3 n = normalize(mat3(modelViewMatrix) * position);\n  vFacing = smoothstep(0.04, 0.90, max(0.0, n.z));\n  gl_PointSize = clamp(9.0 / -mv.z, 0.95, 2.25);\n}"} fragmentShader={"varying vec3 vColor;\nvarying float vFacing;\nvoid main() {\n  vec2 pt = gl_PointCoord - vec2(0.5);\n  float softCircle = 1.0 - smoothstep(0.30, 0.52, length(pt));\n  if (softCircle < 0.02) discard;\n  gl_FragColor = vec4(vColor, softCircle * (0.15 + 0.64 * vFacing));\n}"} />
      </points>
      {location && <Html position={[marker.x, marker.y, marker.z]} center distanceFactor={6.7} zIndexRange={[20, 0]}>
        <div ref={markerLabel} className="site3-globe-marker" aria-label={`Cidade aproximada: ${location.city}`}>
          <span className="site3-live-dot" />{location.city.toLocaleUpperCase('pt-BR')}
        </div>
      </Html>}
      <ConnectionRoutes origin={origin} />
      <NetworkBeaconPoints reduceMotion={reduceMotion} />
      <mesh ref={markerAnchor} position={[marker.x, marker.y, marker.z]}>
        <sphereGeometry args={[.036, 10, 10]} />
        <meshBasicMaterial color="#b6ecff" />
      </mesh>
      </group>
    </group>
    
    
    <OrbitControls autoRotate={false} enableZoom={false} enablePan={false} enableDamping dampingFactor={.045} minPolarAngle={.35} maxPolarAngle={Math.PI - .35} touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.ROTATE }} />
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
  return <div ref={frame} className="site3-canvas-frame" role="img" aria-label="Globo terrestre interativo. Arraste para girar e gire com o mouse ou com o dedo, sem zoom.">
    <Canvas frameloop={inView && tabVisible ? 'always' : 'never'} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: 'default' }} camera={{ fov: 43, near: .1, far: 100, position: [0, 0, 7.5] }} style={{ touchAction: 'none' }}>
      <World {...props} />
    </Canvas>
  </div>
}
