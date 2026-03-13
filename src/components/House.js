'use client'

import { useRef } from 'react'
import DoorTrigger from './DoorTrigger'

/**
 * A stylized, Ghibli-inspired House model built from basic primitives.
 * Features a high-pitched roof, basic door, and windows.
 */
export default function House({ position, rotation = [0, 0, 0], color = '#fdfbf7', roofColor = '#e74c3c', projectData }) {
  const groupRef = useRef()

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      
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

      {/* Door */}
      <mesh position={[0, 0.9, 2.01]} castShadow>
        <boxGeometry args={[1, 1.8, 0.1]} />
        <meshToonMaterial color="#8e6b52" />
      </mesh>
      {/* Doorknob */}
      <mesh position={[0.3, 0.9, 2.08]}>
        <sphereGeometry args={[0.08]} />
        <meshBasicMaterial color="#f1c40f" />
      </mesh>

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
