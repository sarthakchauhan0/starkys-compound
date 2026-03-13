'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * "Data Scanner" weapon – a stylized futuristic blaster
 * rendered as procedural geometry, attached to the camera view.
 */
export default function Weapon({ isFiring }) {
  const groupRef = useRef()
  const flashRef = useRef()
  const recoilProgress = useRef(0)

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Bob weapon slightly with movement
    const time = state.clock.elapsedTime
    groupRef.current.position.y = -0.35 + Math.sin(time * 2) * 0.005
    groupRef.current.position.x = 0.35 + Math.cos(time * 1.5) * 0.003

    // Recoil animation
    if (isFiring) {
      recoilProgress.current = 1
    }
    if (recoilProgress.current > 0) {
      recoilProgress.current = Math.max(0, recoilProgress.current - delta * 8)
      groupRef.current.rotation.x = -recoilProgress.current * 0.15
      groupRef.current.position.z = -0.5 + recoilProgress.current * 0.08
    } else {
      groupRef.current.rotation.x = 0
      groupRef.current.position.z = -0.5
    }

    // Muzzle flash
    if (flashRef.current) {
      flashRef.current.intensity = recoilProgress.current > 0.7 ? 3 : 0
    }
  })

  return (
    <group ref={groupRef} position={[0.35, -0.35, -0.5]}>
      {/* Main barrel */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.02, 0.25, 8]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.2}
          emissive="#0066ff"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Scanner body / grip */}
      <mesh position={[0, -0.06, 0.06]}>
        <boxGeometry args={[0.04, 0.08, 0.12]} />
        <meshStandardMaterial
          color="#16213e"
          metalness={0.8}
          roughness={0.3}
          emissive="#00aaff"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Energy core (glowing part) */}
      <mesh position={[0, 0.005, 0.02]}>
        <boxGeometry args={[0.025, 0.025, 0.06]} />
        <meshStandardMaterial
          color="#00ffcc"
          emissive="#00ffcc"
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Barrel tip ring */}
      <mesh position={[0.13, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.018, 0.004, 8, 16]} />
        <meshStandardMaterial
          color="#00ffcc"
          emissive="#00ffcc"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Muzzle flash light */}
      <pointLight
        ref={flashRef}
        position={[0.15, 0, 0]}
        color="#00ffcc"
        intensity={0}
        distance={3}
      />
    </group>
  )
}
