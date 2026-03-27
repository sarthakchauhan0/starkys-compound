'use client'

import { useState, useRef } from 'react'
import { RigidBody, CylinderCollider } from '@react-three/rapier'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import useUIStore from '@/store/useUIStore'

/**
 * A floor button that compresses when stepped on.
 * Opens the Ghibli Card Overlay via global state when a physical body collides with it from above.
 */
export default function ButtonTrigger({ position, projectData, color = '#ff7b7b' }) {
  const [isPressed, setIsPressed] = useState(false)
  const pressTimeout = useRef(null)
  const openCard = useUIStore((state) => state.openCard)

  const buttonMeshRef = useRef()
  const visualY = useRef(0.3)
  
  // Animate the button pressing down visually
  useFrame(() => {
    const targetY = isPressed ? 0.15 : 0.3
    visualY.current += (targetY - visualY.current) * 0.2
    if (buttonMeshRef.current) {
        buttonMeshRef.current.position.y = position[1] + visualY.current
    }
  })

  return (
    <group>
      {/* Base */}
      <RigidBody type="fixed" position={[position[0], position[1] + 0.1, position[2]]}>
        <CylinderCollider args={[0.1, 1]} />
        <mesh receiveShadow>
          <cylinderGeometry args={[1, 1, 0.2, 16]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
      </RigidBody>

      {/* Button Sensor & Animated Visual */}
      <RigidBody
        type="fixed"
        position={[position[0], position[1] + 0.3, position[2]]}
        sensor
        onIntersectionEnter={(e) => {
          if (!isPressed) {
            setIsPressed(true)
            openCard(projectData)
            
            clearTimeout(pressTimeout.current)
            pressTimeout.current = setTimeout(() => {
              setIsPressed(false)
            }, 3000)
          }
        }}
      >
        <CylinderCollider args={[0.1, 0.8]} />
      </RigidBody>

      <mesh ref={buttonMeshRef} position={[position[0], position[1] + 0.3, position[2]]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 16]} />
        <meshToonMaterial color={isPressed ? '#4ba3e3' : color} />
      </mesh>

      {/* Floating Label */}
      <Html
        position={[position[0], position[1] + 1.5, position[2]]}
        center
        distanceFactor={15}
        zIndexRange={[100, 0]}
      >
        <div className={`transition-all duration-300 ${isPressed ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <div className="px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-white/40 flex flex-col items-center">
             <span className="text-[10px] font-bold tracking-widest text-[#2c3e50] uppercase whitespace-nowrap">
               {projectData.title || projectData.name}
             </span>
             <span className="text-[8px] font-bold text-[#5a6c7d] mt-0.5">
               JUMP TO OPEN
             </span>
          </div>
        </div>
      </Html>
    </group>
  )
}
