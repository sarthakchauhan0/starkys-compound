'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

/**
 * DataFragment – floating glowing crystal in Zone B.
 * Represents data science projects.
 */
export default function DataFragment({ projectData, position, isHit, onHit }) {
  const groupRef = useRef()
  const glowRef = useRef()
  const [decrypting, setDecrypting] = useState(false)
  const decryptTimer = useRef(0)

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const time = state.clock.elapsedTime

    if (isHit && !decrypting) {
      setDecrypting(true)
      decryptTimer.current = 0
    }

    if (decrypting) {
      decryptTimer.current += delta
      // Rapid color cycling during "decryption"
      if (decryptTimer.current < 1.5) {
        const hue = (decryptTimer.current * 5) % 1
        if (glowRef.current) {
          glowRef.current.emissive.setHSL(hue, 1, 0.5)
          glowRef.current.color.setHSL(hue, 1, 0.5)
        }
        groupRef.current.rotation.y += delta * 15
        const scale = 1 + Math.sin(decryptTimer.current * 20) * 0.2
        groupRef.current.scale.set(scale, scale, scale)
      } else {
        // Settled state
        groupRef.current.scale.set(0.6, 0.6, 0.6)
        groupRef.current.rotation.y += delta * 0.5
      }
    } else if (!isHit) {
      // Idle: float and rotate slowly
      groupRef.current.rotation.y += delta * 0.8
      groupRef.current.rotation.x = Math.sin(time * 0.7) * 0.2
      groupRef.current.position.y = position[1] + Math.sin(time * 1.2 + position[0]) * 0.3
    }
  })

  const fragmentColor = isHit ? '#00ff88' : projectData.color || '#00ffcc'

  return (
    <group
      ref={groupRef}
      position={position}
      userData={{ targetId: projectData.id, targetType: 'fragment' }}
    >
      {/* Main crystal – octahedron */}
      <mesh
        castShadow
        userData={{ targetId: projectData.id, targetType: 'fragment' }}
      >
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          ref={glowRef}
          color={fragmentColor}
          emissive={fragmentColor}
          emissiveIntensity={0.8}
          transparent
          opacity={0.85}
          metalness={0.3}
          roughness={0.1}
          wireframe={isHit && decryptTimer.current < 1.5}
        />
      </mesh>

      {/* Inner glow core */}
      <mesh userData={{ targetId: projectData.id, targetType: 'fragment' }}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.2}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Point light for glow */}
      <pointLight
        color={fragmentColor}
        intensity={isHit ? 0.3 : 1}
        distance={5}
      />

      {/* Floating label */}
      {!isHit && (
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.15}
          color={projectData.color || '#00ffcc'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          {`◈ ${projectData.title}`}
        </Text>
      )}

      {isHit && decryptTimer.current >= 1.5 && (
        <Text
          position={[0, 1, 0]}
          fontSize={0.12}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
        >
          ✓ DECRYPTED
        </Text>
      )}
    </group>
  )
}
