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
  const decoded = Uint8Array.from(atob(LAND_MASK), c => c.charCodeAt(0))
  const isLand = (row: number, col: number) => {
    const index = row * MASK_WIDTH + col
    return (decoded[index >> 3] & (1 << (index & 7))) !== 0
  }
  const random = seededRandom(329771)
  const positions: number[] = []
  const colors: number[] = []
  const brighter = new THREE.Color('#49b2ff')
  const brilliant = new THREE.Color('#b4e8ff')
  const muted = new THREE.Color('#153857')
  for (let row = 1; row < MASK_HEIGHT - 1; row++) {
    const lat = -90 + row * MASK_STEP
    for (let col = 0; col < MASK_WIDTH; col++) {
      const lon = -180 + col * MASK_STEP
      const land = isLand(row, col)
      if (!land && random() > .075) continue
      const repetitions = land ? 2 : 1
      for (let d = 0; d < repetitions; d++) {
        const p = spherical(lat + (random() - .5) * MASK_STEP * .83, lon + (random() - .5) * MASK_STEP * .83, 2.015 + random() * .019)
        positions.push(p.x, p.y, p.z)
        const c = land ? brighter.clone().lerp(brilliant, random() * .72) : muted
        const factor = land ? (.45 + random() * .55) : .45
        colors.push(c.r * factor, c.g * factor, c.b * factor)
      }
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
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

function FlightArc({ from, to, color = '#3aa5ff' }: { from: [number, number]; to: [number, number]; color?: string }) {
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
  const line = useMemo(() => new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: .65, depthWrite: false })), [geometry, color])
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
  const marker = location ? spherical(location.latitude, location.longitude, 2.23) : spherical(0, -38, 2.23)
  useFrame((state) => {
    if (!shell.current || reduceMotion) return
    shell.current.rotation.z = Math.sin(state.clock.elapsedTime * .13) * .013
  })
  return <>
    <color attach="background" args={['#080b12']} />
    <ambientLight intensity={.8} />
    <StarField />
    <group ref={shell}>
      <mesh>
        <sphereGeometry args={[2.002, 80, 80]} />
        <meshBasicMaterial color="#071728" transparent opacity={.92} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.05, 48, 32]} />
        <meshBasicMaterial color="#0b5dab" transparent opacity={.115} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.022, 36, 24]} />
        <meshBasicMaterial wireframe color="#2368ad" transparent opacity={.075} depthWrite={false} />
      </mesh>
      <points geometry={globeDots}>
        <pointsMaterial vertexColors transparent opacity={.93} size={.015} sizeAttenuation depthWrite={false} />
      </points>
      <FlightArc from={[-23.55, -46.63]} to={[40.71, -74.0]} />
      <FlightArc from={[-23.55, -46.63]} to={[51.5, -.13]} color="#7bbaff" />
      <FlightArc from={[35.68, 139.69]} to={[1.35, 103.82]} color="#2383eb" />
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
    <OrbitRing tilt={[.42, .2, .2]} speed={reduceMotion ? 0 : .009} />
    <OrbitRing tilt={[-.32, 1.12, -.33]} radius={2.75} color="#153e6d" speed={reduceMotion ? 0 : -.007} />
    <OrbitControls autoRotate={!reduceMotion} autoRotateSpeed={.33} enableZoom={false} enablePan={false} enableDamping dampingFactor={.045} minPolarAngle={.35} maxPolarAngle={Math.PI - .35} />
  </>
}

export default function Globe3D(props: GlobeProps) {
  return <div className="site3-canvas-frame" role="img" aria-label="Globo terrestre 3D de partículas interativo. Arraste para girar e explorar conexões globais.">
    <Canvas dpr={[1, 1.65]} gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }} camera={{ fov: 43, near: .1, far: 100, position: [0, 0, 6.65] }} style={{ touchAction: 'pan-y' }}>
      <World {...props} />
    </Canvas>
  </div>
}