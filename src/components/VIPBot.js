'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

/**
 * VIPBot – the "Commander" boss in the center of the map.
 * Non-hostile, glowing, triggers Mission Briefing on interaction.
 */
export default function VIPBot({ bossData, position, isHit }) {
  const groupRef = useRef()
  const auraRef = useRef()
  const shieldRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.elapsedTime

    // Idle rotation
    groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.15

    // Aura pulse
    if (auraRef.current) {
      auraRef.current.scale.set(
        1 + Math.sin(time * 2) * 0.05,
        1 + Math.sin(time * 2) * 0.05,
        1 + Math.sin(time * 2) * 0.05
      )
      auraRef.current.material.opacity = 0.1 + Math.sin(time * 1.5) * 0.05
    }

    // Shield rotation
    if (shieldRef.current) {
      shieldRef.current.rotation.y = time * 0.5
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      userData={{ targetId: bossData.id, targetType: 'boss' }}
    >
      {/* Aura sphere */}
      <mesh ref={auraRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.3}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Head – bigger than regular bots */}
      <mesh
        position={[0, 2.8, 0]}
        castShadow
        userData={{ targetId: bossData.id, targetType: 'boss' }}
      >
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Visor */}
      <mesh position={[0, 2.85, 0.32]} userData={{ targetId: bossData.id, targetType: 'boss' }}>
        <boxGeometry args={[0.45, 0.15, 0.02]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#ff8c00"
          emissiveIntensity={1}
          metalness={0.9}
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, 1.8, 0]} castShadow userData={{ targetId: bossData.id, targetType: 'boss' }}>
        <boxGeometry args={[0.9, 1.2, 0.5]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Gold chest emblem */}
      <mesh position={[0, 2, 0.26]} userData={{ targetId: bossData.id, targetType: 'boss' }}>
        <boxGeometry args={[0.3, 0.3, 0.02]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.6}
          metalness={0.8}
        />
      </mesh>

      {/* Cape (flat panel behind) */}
      <mesh position={[0, 1.6, -0.35]} castShadow userData={{ targetId: bossData.id, targetType: 'boss' }}>
        <boxGeometry args={[0.8, 1.5, 0.05]} />
        <meshStandardMaterial
          color="#8b0000"
          emissive="#8b0000"
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>

      {/* Left arm */}
      <mesh position={[-0.6, 1.8, 0]} castShadow userData={{ targetId: bossData.id, targetType: 'boss' }}>
        <boxGeometry args={[0.25, 1, 0.25]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Right arm */}
      <mesh position={[0.6, 1.8, 0]} castShadow userData={{ targetId: bossData.id, targetType: 'boss' }}>
        <boxGeometry args={[0.25, 1, 0.25]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Left leg */}
      <mesh position={[-0.2, 0.6, 0]} castShadow userData={{ targetId: bossData.id, targetType: 'boss' }}>
        <boxGeometry args={[0.28, 1.1, 0.3]} />
        <meshStandardMaterial color="#111122" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Right leg */}
      <mesh position={[0.2, 0.6, 0]} castShadow userData={{ targetId: bossData.id, targetType: 'boss' }}>
        <boxGeometry args={[0.28, 1.1, 0.3]} />
        <meshStandardMaterial color="#111122" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Rotating shield ring */}
      <group ref={shieldRef} position={[0, 1.8, 0]}>
        <mesh userData={{ targetId: bossData.id, targetType: 'boss' }}>
          <torusGeometry args={[1.2, 0.03, 8, 32]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffd700"
            emissiveIntensity={0.6}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>

      {/* Title */}
      <Text
        position={[0, 3.8, 0]}
        fontSize={0.25}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        ★ COMMANDER ★
      </Text>

      <Text
        position={[0, 3.4, 0]}
        fontSize={0.14}
        color="#ff8c00"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {bossData.title}
      </Text>

      {/* Boss glow light */}
      <pointLight color="#ffd700" intensity={1} distance={8} position={[0, 2, 0]} />

      {/* Base platform */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 0.06, 24]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffd700"
          emissiveIntensity={0.3}
          metalness={0.7}
        />
      </mesh>
    </group>
  )
}
