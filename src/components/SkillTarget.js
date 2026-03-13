'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

/**
 * SkillTarget – shooting range target in Zone C.
 * Flips down on hit and reveals XP bar.
 */
export default function SkillTarget({ skillData, position, isHit }) {
  const targetRef = useRef()
  const flipProgress = useRef(0)

  useFrame((state, delta) => {
    if (!targetRef.current) return

    if (isHit) {
      flipProgress.current = Math.min(1, flipProgress.current + delta * 4)
      targetRef.current.rotation.x = -(flipProgress.current * Math.PI * 0.5)
    }
  })

  const xpPercent = skillData.xp / 100
  const barWidth = 1.2

  return (
    <group position={position}>
      {/* Post */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.08, 2, 0.08]} />
        <meshStandardMaterial color="#444455" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Target face (flips) */}
      <group ref={targetRef} position={[0, 2, 0]}>
        <mesh
          castShadow
          userData={{ targetId: skillData.id, targetType: 'skill' }}
        >
          <cylinderGeometry args={[0.5, 0.5, 0.06, 32]} />
          <meshStandardMaterial
            color={isHit ? '#333333' : skillData.color}
            emissive={isHit ? '#000000' : skillData.color}
            emissiveIntensity={isHit ? 0 : 0.3}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>

        {/* Inner ring */}
        <mesh position={[0, 0, 0.035]} userData={{ targetId: skillData.id, targetType: 'skill' }}>
          <cylinderGeometry args={[0.35, 0.35, 0.01, 32]} />
          <meshStandardMaterial
            color="#1a1a1a"
            emissive={isHit ? '#000000' : skillData.color}
            emissiveIntensity={isHit ? 0 : 0.5}
          />
        </mesh>

        {/* Center dot */}
        <mesh position={[0, 0, 0.04]} userData={{ targetId: skillData.id, targetType: 'skill' }}>
          <cylinderGeometry args={[0.1, 0.1, 0.01, 16]} />
          <meshStandardMaterial
            color={isHit ? '#ff4444' : '#ffffff'}
            emissive={isHit ? '#ff4444' : '#ffffff'}
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* Skill name on target */}
        <Text
          position={[0, 0, 0.05]}
          rotation={[Math.PI / 2, 0, 0]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {skillData.name}
        </Text>
      </group>

      {/* XP Bar (revealed when flipped) */}
      {isHit && (
        <group position={[0, 1.5, 0.3]}>
          {/* Bar background */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[barWidth + 0.1, 0.25, 0.05]} />
            <meshStandardMaterial color="#111122" />
          </mesh>
          {/* Bar fill */}
          <mesh position={[-(barWidth * (1 - xpPercent)) / 2, 0, 0.03]}>
            <boxGeometry args={[barWidth * xpPercent, 0.18, 0.02]} />
            <meshStandardMaterial
              color={skillData.color}
              emissive={skillData.color}
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* XP text */}
          <Text
            position={[0, 0.3, 0.03]}
            fontSize={0.12}
            color={skillData.color}
            anchorX="center"
            anchorY="middle"
          >
            {`${skillData.name} – ${skillData.xp}% XP (${skillData.years}yr)`}
          </Text>
        </group>
      )}
    </group>
  )
}
