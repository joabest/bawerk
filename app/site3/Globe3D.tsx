'use client'

import { useEffect, useMemo, useRef } from 'react'
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
  const latStep = .65
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
      <torusGeometry args={[radius, .0034, 2, 256]} />
      <meshBasicMaterial color={color} transparent opacity={.28} depthWrite={false} />
    </mesh>
    <mesh position={[Math.cos(1.65) * radius, Math.sin(1.65) * radius, 0]}>
      <sphereGeometry args={[.033, 12, 12]} />
      <meshBasicMaterial color="#69ccff" />
    </mesh>
  </group>
}

function FlightArc({ from, to, color = '#4f94c1' }: { from: [number, number]; to: [number, number]; color?: string }) {
  const geometry = useMemo(() => {
    const a = spherical(from[0], from[1], 1).normalize()
    const b = spherical(to[0], to[1], 1).normalize()
    const positions: number[] = []
    for (let i = 0; i <= 74; i++) {
      const t = i / 74
      const point = a.clone().lerp(b, t).normalize().multiplyScalar(2.055 + Math.sin(Math.PI * t) * .30)
      positions.push(point.x, point.y, point.z)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return g
  }, [from, to])
  const line = useMemo(() => new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: .24, depthWrite: false })), [geometry, color])
  useEffect(() => () => { geometry.dispose(); (line.material as THREE.Material).dispose() }, [geometry, line])
  return <primitive object={line} />
}

function StarField() {
  const geometry = useMemo(() => {
    const random = seededRandom(85921)
    const positions: number[] = []
    for (let i = 0; i < 750; i++) {
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
  const shell = useRef<THREE.Group>(null)
  const pivot = useRef<THREE.Group>(null)
  const marker = location ? spherical(location.latitude, location.longitude, 2.23) : spherical(-23.55, -46.63, 2.23)
  const targetQuaternion = useMemo(() =>
    new THREE.Quaternion().setFromUnitVectors(marker.clone().normalize(), new THREE.Vector3(0.36, -0.24, 0.90).normalize()),
    [marker.x, marker.y, marker.z])
  useFrame((state, delta) => {
    if (pivot.current) pivot.current.quaternion.slerp(targetQuaternion, 1 - Math.exp(-delta * 2.4))
    if (shell.current && !reduceMotion) shell.current.rotation.z = Math.sin(state.clock.elapsedTime * .13) * .013
  })
  return <>
    <ambientLight intensity={.8} />
    <StarField />
    <group ref={pivot}>
      <group ref={shell}>
      <mesh>
        <sphereGeometry args={[2.002, 80, 80]} />
        <meshBasicMaterial color="#090a0c" />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.05, 48, 32]} />
        <meshBasicMaterial color="#e1ebf4" transparent opacity={.055} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.022, 36, 24]} />
        <meshBasicMaterial wireframe color="#5e6972" transparent opacity={.012} depthWrite={false} />
      </mesh>
      <points geometry={globeDots}>
        <shaderMaterial transparent depthWrite={false} depthTest vertexShader={"attribute vec3 color;\nvarying vec3 vColor;\nvarying float vFacing;\nvoid main() {\n  vColor = color;\n  vec4 mv = modelViewMatrix * vec4(position, 1.0);\n  gl_Position = projectionMatrix * mv;\n  vec3 n = normalize(mat3(modelViewMatrix) * position);\n  vFacing = smoothstep(0.04, 0.90, max(0.0, n.z));\n  gl_PointSize = clamp(11.0 / -mv.z, 1.15, 2.9);\n}"} fragmentShader={"varying vec3 vColor;\nvarying float vFacing;\nvoid main() {\n  vec2 pt = gl_PointCoord - vec2(0.5);\n  float softCircle = 1.0 - smoothstep(0.30, 0.52, length(pt));\n  if (softCircle < 0.02) discard;\n  gl_FragColor = vec4(vColor, softCircle * (0.22 + 0.78 * vFacing));\n}"} />
      </points>
      <FlightArc from={[-23.55, -46.63]} to={[40.71, -74.0]} />
      <FlightArc from={[-23.55, -46.63]} to={[51.5, -.13]} color="#647f97" />
      <FlightArc from={[35.68, 139.69]} to={[1.35, 103.82]} color="#275d89" />
      <Html position={[marker.x, marker.y, marker.z]} center distanceFactor={8.2} occlude zIndexRange={[20, 0]}>
        <div className="site3-globe-marker" aria-label={location ? `Conectado: ${location.city}` : 'Rede global conectada'}>
          <span className="site3-live-dot" />ONLINE <span className="site3-marker-sep">·</span> {(location?.city || 'GLOBAL').toUpperCase()}
        </div>
      </Html>
      <mesh position={[marker.x, marker.y, marker.z]}>
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
  return <div className="site3-canvas-frame" role="img" aria-label="Globo terrestre 3D de partículas interativo. Arraste para girar e explorar conexões globais.">
    <Canvas dpr={[1, 1.65]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} camera={{ fov: 43, near: .1, far: 100, position: [0, 0, 6.65] }} style={{ touchAction: 'pan-y' }}>
      <World {...props} />
    </Canvas>
  </div>
}