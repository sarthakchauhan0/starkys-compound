'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

/**
 * TargetBot – stationary training bot in Zone A.
 * Low-poly humanoid that deactivates on hit.
 */
export default function TargetBot({ projectData, position, isHit, onHit }) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const deactivateProgress = useRef(0)

  useFrame((state, delta) => {
    if (!groupRef.current) return

    if (isHit) {
      // Deactivation: fall backward + color desaturate
      deactivateProgress.current = Math.min(1, deactivateProgress.current + delta * 3)
      groupRef.current.rotation.x = -(deactivateProgress.current * Math.PI * 0.4)
      groupRef.current.position.y = position[1] - deactivateProgress.current * 0.5
    } else {
      // Idle subtle sway
      const time = state.clock.elapsedTime
      groupRef.current.rotation.y = Math.sin(time * 0.5 + position[0]) * 0.1
    }
  })

  const bodyColor = isHit ? '#444444' : projectData.color || '#00ff88'
  const emissiveIntensity = isHit ? 0 : 0.3

  return (
    <group
      ref={groupRef}
      position={position}
      userData={{ targetId: projectData.id, targetType: 'bot' }}
    >
      {/* Head */}
      <mesh
        position={[0, 2.1, 0]}
        castShadow
        userData={{ targetId: projectData.id, targetType: 'bot' }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.45, 0.45, 0.45]} />
        <meshStandardMaterial
          color={bodyColor}
          emissive={bodyColor}
          emissiveIntensity={emissiveIntensity}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Visor */}
      <mesh position={[0, 2.15, 0.24]} userData={{ targetId: projectData.id, targetType: 'bot' }}>
        <boxGeometry args={[0.35, 0.12, 0.02]} />
        <meshStandardMaterial
          color="#000000"
          emissive={isHit ? '#000000' : '#00ffcc'}
          emissiveIntensity={isHit ? 0 : 0.8}
          metalness={0.9}
        />
      </mesh>

      {/* Body (torso) */}
      <mesh position={[0, 1.4, 0]} castShadow userData={{ targetId: projectData.id, targetType: 'bot' }}>
        <boxGeometry args={[0.6, 0.9, 0.35]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Body accent stripe */}
      <mesh position={[0, 1.4, 0.18]} userData={{ targetId: projectData.id, targetType: 'bot' }}>
        <boxGeometry args={[0.15, 0.7, 0.01]} />
        <meshStandardMaterial
          color={bodyColor}
          emissive={bodyColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Left arm */}
      <mesh position={[-0.42, 1.4, 0]} castShadow userData={{ targetId: projectData.id, targetType: 'bot' }}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Right arm */}
      <mesh position={[0.42, 1.4, 0]} castShadow userData={{ targetId: projectData.id, targetType: 'bot' }}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Left leg */}
      <mesh position={[-0.15, 0.5, 0]} castShadow userData={{ targetId: projectData.id, targetType: 'bot' }}>
        <boxGeometry args={[0.22, 0.9, 0.25]} />
        <meshStandardMaterial color="#111122" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Right leg */}
      <mesh position={[0.15, 0.5, 0]} castShadow userData={{ targetId: projectData.id, targetType: 'bot' }}>
        <boxGeometry args={[0.22, 0.9, 0.25]} />
        <meshStandardMaterial color="#111122" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Floating name tag */}
      {!isHit && (
        <Text
          position={[0, 2.8, 0]}
          fontSize={0.18}
          color={projectData.color || '#00ff88'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {`PROJECT: ${projectData.title}`}
        </Text>
      )}

      {/* Hit marker */}
      {isHit && (
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.15}
          color="#ff4444"
          anchorX="center"
          anchorY="middle"
        >
          ✓ SCANNED
        </Text>
      )}

      {/* Base platform */}
      <mesh position={[0, 0.025, 0]} receiveShadow>
        <cylinderGeometry args={[0.4, 0.45, 0.05, 16]} />
        <meshStandardMaterial color="#333344" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}
