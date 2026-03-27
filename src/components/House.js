'use client'

import { useRef } from 'react'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import DoorTrigger from './DoorTrigger'
import useUIStore from '@/store/useUIStore'

/**
 * A stylized, Ghibli-inspired House model built from basic primitives.
 * Features a hollow interior with colliders, a pitched roof, basic door, and windows.
 */
export default function House({ position, rotation = [0, 0, 0], color = '#fdfbf7', roofColor = '#e74c3c', projectData, isInterior = false }) {
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
    <group position={position} rotation={rotation}>
      
      {/* Interactive Trigger for UI Overlay */}
      {projectData && !isInterior && (
        <DoorTrigger 
          projectData={projectData} 
          position={[0, 1.5, 4.5]} // Positioned just in front of the door (z=2.0)
        />
      )}

      {/* Physics for the hollow house structure */}
      <RigidBody type="fixed" colliders={false}>
        {/* Left Wall */}
        <CuboidCollider position={[-1.9, 1.5, 0]} args={[0.1, 1.5, 2]} />
        {/* Right Wall */}
        <CuboidCollider position={[1.9, 1.5, 0]} args={[0.1, 1.5, 2]} />
        {/* Back Wall */}
        <CuboidCollider position={[0, 1.5, -1.9]} args={[1.8, 1.5, 0.1]} />
        {/* Front Left Wall */}
        <CuboidCollider position={[-1.25, 1.5, 1.9]} args={[0.75, 1.5, 0.1]} />
        {/* Front Right Wall */}
        <CuboidCollider position={[1.25, 1.5, 1.9]} args={[0.75, 1.5, 0.1]} />
        {/* Front Top Wall (Above Door) */}
        <CuboidCollider position={[0, 2.4, 1.9]} args={[0.5, 0.6, 0.1]} />
        
        {/* Roof (simplified as a box for collisions so player can't jump inside attic area easily) */}
        <CuboidCollider position={[0, 3.8, 0]} args={[1.9, 1.25, 1.9]} />
        
        {/* Interior Furniture Physics/Sensors */}
        <CuboidCollider position={[1.2, 0.5, -1.2]} args={[0.5, 0.5, 0.5]} />
        <CuboidCollider position={[1.2, 1.5, -1.2]} args={[0.4, 0.1, 0.4]} />
        
        {/* Project Info Laptop (Sensor) */}
        {isInterior && projectData && (
          <CuboidCollider 
            position={[-1.2, 0.5, 0]} 
            args={[0.5, 0.5, 0.5]} 
            sensor 
            onIntersectionEnter={() => {
              if (useUIStore.getState().isInsideHouse && !useUIStore.getState().isCardOpen) {
                useUIStore.getState().openCard(projectData)
              }
            }} 
          />
        )}
      </RigidBody>

      {/* Main Base - Visual (Hollow) */}
      <group>
        <mesh position={[-1.9, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 3, 4]} />
          <meshToonMaterial color={color} />
        </mesh>
        <mesh position={[1.9, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 3, 4]} />
          <meshToonMaterial color={color} />
        </mesh>
        <mesh position={[0, 1.5, -1.9]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 3, 0.2]} />
          <meshToonMaterial color={color} />
        </mesh>
        <mesh position={[-1.25, 1.5, 1.9]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 3, 0.2]} />
          <meshToonMaterial color={color} />
        </mesh>
        <mesh position={[1.25, 1.5, 1.9]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 3, 0.2]} />
          <meshToonMaterial color={color} />
        </mesh>
        <mesh position={[0, 2.4, 1.9]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 1.2, 0.2]} />
          <meshToonMaterial color={color} />
        </mesh>
      </group>

      {/* Interior Visuals */}
      <group>
        <mesh position={[0, 0.02, 0]} receiveShadow rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial color="#c0392b" />
        </mesh>
        {/* Cat Tree */}
        <mesh 
          position={[1.2, 0.5, -1.2]} 
          castShadow 
          receiveShadow 
          userData={{ climbable: true, poi: 'Cat Tree' }}
          onClick={(e) => {
            e.stopPropagation();
            alert("Meow! Scratched the Cat Tree.");
          }}
        >
          <boxGeometry args={[1.0, 1.0, 1.0]} />
          <meshToonMaterial color="#8e44ad" />
          <Html position={[0, 0.8, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
            <div className="px-2 py-1 rounded bg-white/80 text-[10px] font-bold text-black pointer-events-none shadow-sm border border-black/10">
              Scratch Post
            </div>
          </Html>
        </mesh>
        <mesh 
          position={[1.2, 1.5, -1.2]} 
          castShadow 
          receiveShadow 
          userData={{ climbable: true, poi: 'Top Shelf' }}
          onClick={(e) => {
            e.stopPropagation();
            alert("Zzz... sleeping on the top shelf.");
          }}
        >
          <boxGeometry args={[0.8, 0.2, 0.8]} />
          <meshToonMaterial color="#9b59b6" />
          <Html position={[0, 0.3, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
            <div className="px-2 py-1 rounded bg-white/80 text-[10px] font-bold text-black pointer-events-none shadow-sm border border-black/10">
              Cat Bed
            </div>
          </Html>
        </mesh>
        
        {/* Laptop Visual */}
        {isInterior && projectData && (
          <mesh position={[-1.2, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.05, 0.4]} />
            <meshToonMaterial color="#bdc3c7" />
            <Html position={[0, 0.5, 0]} center distanceFactor={8} zIndexRange={[100, 0]}>
              <div className="px-2 py-1 rounded bg-white/90 text-[10px] font-bold text-[#2c3e50] shadow-sm border border-[#2c3e50]/30 flex flex-col items-center pointer-events-none">
                <span className="mb-0.5 whitespace-nowrap">{projectData.title} Logs</span>
                <span className="text-[8px] text-[#e74c3c] bg-white px-1 border border-[#e74c3c]/10 rounded font-black mt-0.5">WALK OVER</span>
              </div>
            </Html>
          </mesh>
        )}
      </group>

      {/* Roof */}
      {!isInterior && (
        <>
          <mesh position={[0, 3.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
            <coneGeometry args={[3.8, 2.5, 4]} />
            <meshToonMaterial color={roofColor} />
          </mesh>
          <mesh position={[1.2, 4.2, -1.2]} castShadow>
            <boxGeometry args={[0.6, 1.5, 0.6]} />
            <meshToonMaterial color="#b3ada9" />
          </mesh>
        </>
      )}

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
