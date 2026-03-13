'use client'

import { useState, useRef } from 'react'
import { useCylinder } from '@react-three/cannon'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

/**
 * A floor button that compresses when stepped on.
 * Triggers `onPress(projectData)` when a physical body (like the player) collides with it from above.
 */
export default function ButtonTrigger({ position, projectData, onPress, color = '#ff7b7b' }) {
  const [isPressed, setIsPressed] = useState(false)
  const pressTimeout = useRef(null)

  // A flat cylinder for the button base
  const [baseRef] = useCylinder(() => ({
    type: 'Static',
    position: [position[0], position[1] + 0.1, position[2]],
    args: [1, 1, 0.2, 16],
  }))

  // The actual pressable button part
  const [buttonRef] = useCylinder(() => ({
    type: 'Static',
    position: [position[0], position[1] + 0.3, position[2]],
    args: [0.8, 0.8, 0.2, 16],
    isTrigger: true, // We want to detect overlap, not physically stop the player perfectly
    onCollide: (e) => {
      if (!isPressed) {
        setIsPressed(true)
        if (onPress) onPress(projectData)
        
        // Reset button visual after a few seconds
        clearTimeout(pressTimeout.current)
        pressTimeout.current = setTimeout(() => {
          setIsPressed(false)
        }, 3000)
      }
    }
  }))

  const visualY = useRef(0.3)
  
  // Animate the button pressing down visually
  useFrame(() => {
    const targetY = isPressed ? 0.15 : 0.3
    visualY.current += (targetY - visualY.current) * 0.2
    if (buttonRef.current) {
        // We only animate the visual mesh relative to its physics body position 
        // to keep it simple, or we can just animate the mesh directly.
        // Since useCylinder controls the mesh position entirely, we'll apply a local offset to the geometry.
    }
  })

  return (
    <group>
      {/* Base */}
      <mesh ref={baseRef} receiveShadow>
        <cylinderGeometry args={[1, 1, 0.2, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      {/* Button */}
      <mesh ref={buttonRef} castShadow receiveShadow>
        {/* We wrap the geometry in a group or just offset the geometry to animate it visually while physics stays static */}
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
