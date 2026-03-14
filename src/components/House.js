'use client'

import { useRef } from 'react'
import { useCompoundBody } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import DoorTrigger from './DoorTrigger'
import useUIStore from '@/store/useUIStore'

/**
 * A stylized, Ghibli-inspired House model built from basic primitives.
 * Features a high-pitched roof, basic door, and windows.
 */
export default function House({ position, rotation = [0, 0, 0], color = '#fdfbf7', roofColor = '#e74c3c', projectData }) {
  const [groupRef] = useCompoundBody(() => ({
    type: 'Static',
    position,
    rotation,
    shapes: [
      { type: 'Box', position: [0, 1.5, 0], args: [4, 3, 4] },
      { type: 'Box', position: [0, 3.8, 0], args: [3.8, 2.5, 3.8] }
    ]
  }))

  const doorHingeRef = useRef()

  // Swing door open if this house is active
  useFrame((state, delta) => {
    if (doorHingeRef.current) {
      const store = useUIStore.getState()
      const isOpen = store.isCardOpen && (store.activeCard?.title === projectData?.title)
      const targetRotationY = isOpen ? -Math.PI / 2 : 0
      
      // Smoothly swing door
      doorHingeRef.current.rotation.y = THREE.MathUtils.lerp(
        doorHingeRef.current.rotation.y,
        targetRotationY,
        delta * 5
      )
    }
  })

  return (
    <group ref={groupRef}>
      
      {/* Interactive Trigger for UI Overlay */}
      {projectData && (
        <DoorTrigger 
          projectData={projectData} 
          position={[0, 1.5, 4.5]} // Positioned just in front of the door (z=2.0)
        />
      )}

      {/* Main Base */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 3, 4]} />
        <meshToonMaterial color={color} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 3.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        {/* A cone or pyramid works well for a stylized roof */}
        <coneGeometry args={[3.8, 2.5, 4]} />
        <meshToonMaterial color={roofColor} />
      </mesh>

      {/* Chimney */}
      <mesh position={[1.2, 4.2, -1.2]} castShadow>
        <boxGeometry args={[0.6, 1.5, 0.6]} />
        <meshToonMaterial color="#b3ada9" />
      </mesh>

      {/* Door Hinge system */}
      <group ref={doorHingeRef} position={[-0.5, 0.9, 2.01]}>
        {/* Door body */}
        <mesh position={[0.5, 0, 0]} castShadow>
          <boxGeometry args={[1, 1.8, 0.1]} />
          <meshToonMaterial color="#8e6b52" />
        </mesh>
        {/* Doorknob */}
        <mesh position={[0.8, 0, 0.07]}>
          <sphereGeometry args={[0.08]} />
          <meshBasicMaterial color="#f1c40f" />
        </mesh>
      </group>

      {/* Windows */}
      <group position={[-1, 1.5, 2.01]}>
        <mesh>
          <planeGeometry args={[0.8, 0.8]} />
          <meshBasicMaterial color="#d0e7ff" />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.1, 0.8]} />
          <meshBasicMaterial color="#8e6b52" />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.8, 0.1]} />
          <meshBasicMaterial color="#8e6b52" />
        </mesh>
      </group>

      <group position={[1, 1.5, 2.01]}>
        <mesh>
          <planeGeometry args={[0.8, 0.8]} />
          <meshBasicMaterial color="#d0e7ff" />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.1, 0.8]} />
          <meshBasicMaterial color="#8e6b52" />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.8, 0.1]} />
          <meshBasicMaterial color="#8e6b52" />
        </mesh>
      </group>
    </group>
  )
}
