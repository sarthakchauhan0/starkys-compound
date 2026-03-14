'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import useUIStore from '@/store/useUIStore'

/**
 * An invisible sensor box placed at the entrance of Houses.
 * When the player collides with this box, the Card Overlay opens.
 */
export default function DoorTrigger({ position, projectData }) {
  const { isCardOpen, openCard, setNearbyHouse, nearbyHouseData } = useUIStore()
  const triggerRef = useRef()
  const worldPos = useMemo(() => new THREE.Vector3(), [])
  
  const isNearby = nearbyHouseData?.id === projectData?.id || nearbyHouseData?.title === projectData?.title

  useFrame(() => {
    if (!triggerRef.current || useUIStore.getState().isCardOpen) return
    
    triggerRef.current.getWorldPosition(worldPos)
    const playerPos = useUIStore.getState().playerPosRef.current
    
    // Real-time distance checking (XZ plane)
    const dx = playerPos[0] - worldPos.x
    const dz = playerPos[2] - worldPos.z
    const distSq = dx * dx + dz * dz
    
    const store = useUIStore.getState()
    // 4 units radius = 16 distance squared
    if (distSq < 16) {
      if (store.nearbyHouseData?.title !== projectData.title) {
        store.setNearbyHouse(projectData)
      }
    } else {
      if (store.nearbyHouseData?.title === projectData.title) {
        store.setNearbyHouse(null)
      }
    }
  })

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && isNearby && !useUIStore.getState().isCardOpen) {
        openCard(projectData)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isNearby, projectData, openCard])

  return (
    <group ref={triggerRef} position={position}>
      {/* Floating Entry Prompt */}
      {/* The HTML is only visible if the card is NOT open and the player is nearby */}
      <Html
        position={[0, 1.5, 0]}
        center
        distanceFactor={15}
        zIndexRange={[100, 0]}
      >
        <div className={`transition-all duration-300 ${isCardOpen || !isNearby ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
          <div className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-[#2c3e50]/10 flex flex-col items-center pointer-events-none">
             <span className="text-[12px] font-bold tracking-widest text-[#2c3e50] uppercase whitespace-nowrap">
               {projectData.title || projectData.name}
             </span>
             <div className="flex items-center gap-1.5 mt-1.5">
               <span className="bg-[#2c3e50] text-white text-[9px] px-1.5 py-0.5 rounded font-bold self-start">[SPACE]</span>
               <span className="text-[10px] font-bold text-[#e74c3c] uppercase">to Enter</span>
             </div>
          </div>
        </div>
      </Html>
    </group>
  )
}
