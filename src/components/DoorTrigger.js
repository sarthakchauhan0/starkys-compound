'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'
import useUIStore from '@/store/useUIStore'

/**
 * An invisible sensor box placed at the entrance of Houses.
 * When the player collides with this box, the Card Overlay opens.
 */
export default function DoorTrigger({ position, projectData }) {
  const { isCardOpen, openCard, setNearbyHouse, nearbyHouseData } = useUIStore()
  const triggerRef = useRef()
  const isNearby = nearbyHouseData?.id === projectData?.id || nearbyHouseData?.title === projectData?.title

  // The keydown listener has been moved to HUD.js for centralized interaction handling.

  return (
    <group ref={triggerRef} position={position}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider 
          args={[1.5, 1.5, 1.5]} 
          sensor 
          onIntersectionEnter={(e) => {
            if (e.other && e.other.rigidBodyObject?.name === 'playerBody') {
              useUIStore.getState().setNearbyHouse(projectData)
            } else if (!e.other.rigidBodyObject) {
              useUIStore.getState().setNearbyHouse(projectData)
            }
          }}
          onIntersectionExit={(e) => {
            if (e.other && (e.other.rigidBodyObject?.name === 'playerBody' || !e.other.rigidBodyObject)) {
              const store = useUIStore.getState()
              if (store.nearbyHouseData?.title === projectData.title) {
                store.setNearbyHouse(null)
              }
            }
          }} 
        />
      </RigidBody>
      {/* Floating Entry Prompt */}
      {/* The HTML is only visible if the card is NOT open and the player is nearby */}
      <Html
        position={[0, 1.5, 0]}
        center
        distanceFactor={15}
        zIndexRange={[100, 0]}
      >
        <div 
          className={`transition-all duration-300 ${isCardOpen || !isNearby ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}
          onClick={() => {
            if (isNearby) useUIStore.getState().enterHouse()
          }}
        >
          <div className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-[#2c3e50]/10 flex flex-col items-center cursor-pointer active:scale-95 pointer-events-auto">
             <span className="text-[12px] font-bold tracking-widest text-[#2c3e50] uppercase whitespace-nowrap">
               {projectData.title || projectData.name}
             </span>
             <div className="flex items-center gap-1.5 mt-1.5">
               <span className="bg-[#2c3e50] text-white text-[9px] px-1.5 py-0.5 rounded font-bold self-start">[ENTER]</span>
               <span className="text-[10px] font-bold text-[#e74c3c] uppercase">to Enter</span>
             </div>
          </div>
        </div>
      </Html>
    </group>
  )
}
