"use client"

import { PointMaterial, Points } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import * as random from "maath/random"
import { Suspense, useRef, useState } from "react"
import type { Points as ThreePoints } from "three"

function StarField() {
  const pointsRef = useRef<ThreePoints | null>(null)
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.2 }),
  )

  useFrame((_state, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.x -= delta / 10
    pointsRef.current.rotation.y -= delta / 15
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={pointsRef}
        stride={3}
        positions={new Float32Array(sphere)}
        frustumCulled
      >
        <PointMaterial
          transparent
          color="#fff"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  )
}

export function GalaxyBackground() {
  return (
    <div className="galaxy-canvas" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <StarField />
        </Suspense>
      </Canvas>
    </div>
  )
}
