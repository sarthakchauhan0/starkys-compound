'use client'

import { RigidBody, CuboidCollider } from '@react-three/rapier'
import useUIStore from '@/store/useUIStore'
import { Html, ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Solid 2.0x Expanded Interior compound.
 * Massive doorways, huge play area, strictly bounded on the outside.
 */
export default function InteriorCompound() {
  const store = useUIStore()

  return (
    <group scale={2}>
      {/* Main Floor Covering Entire Area */}
      <RigidBody type="fixed">
         <CuboidCollider position={[0, -0.5, 0]} args={[60, 0.5, 60]} />
      </RigidBody>

      {/* Depth Shadows */}
      <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={40} blur={2.5} far={4} color="#000000" />
      
      {/* Lighting & Environment */}
      <ambientLight intensity={0.8} />
      <Environment preset="apartment" />

      {/* --- HALLWAY (Center Hub) --- */}
      {/* 2x scale: 8x20 (X:-4 to 4, Z:-10 to 10) */}
      <group position={[0, 0, 0]}>
        <pointLight position={[0, 3, 0]} intensity={2.0} distance={15} castShadow />
        <mesh position={[0, 0.02, 0]} receiveShadow rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[8, 20]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>
        
        <RigidBody type="fixed" colliders={false}>
          {/* Front & Back Walls */}
          <CuboidCollider position={[0, 1.5, -10]} args={[4, 1.5, 0.2]} />
          <mesh position={[0, 1.5, -10]} castShadow receiveShadow><boxGeometry args={[8, 3, 0.4]} /><meshToonMaterial color="#2c3e50" /></mesh>

          <CuboidCollider position={[0, 1.5, 10]} args={[4, 1.5, 0.2]} />
          <mesh position={[0, 1.5, 10]} castShadow receiveShadow><boxGeometry args={[8, 3, 0.4]} /><meshToonMaterial color="#2c3e50" /></mesh>
          
          {/* Left Wall Segmentation (X=-4, Z from -10 to 10) Doorways at Z=-6 and Z=6 */}
          {/* Doorway width gaps -> args 2.0 = 4 unit wide! */}
          <CuboidCollider position={[-4, 1.5, -9]} args={[0.2, 1.5, 1.0]} />
          <mesh position={[-4, 1.5, -9]} castShadow receiveShadow><boxGeometry args={[0.4, 3, 2.0]} /><meshToonMaterial color="#2c3e50" /></mesh>

          <CuboidCollider position={[-4, 1.5, 0]} args={[0.2, 1.5, 4.0]} />
          <mesh position={[-4, 1.5, 0]} castShadow receiveShadow><boxGeometry args={[0.4, 3, 8.0]} /><meshToonMaterial color="#2c3e50" /></mesh>

          <CuboidCollider position={[-4, 1.5, 9]} args={[0.2, 1.5, 1.0]} />
          <mesh position={[-4, 1.5, 9]} castShadow receiveShadow><boxGeometry args={[0.4, 3, 2.0]} /><meshToonMaterial color="#2c3e50" /></mesh>

          {/* Right Wall Segmentation (X=4) Doorways at Z=-6 and Z=6 */}
          <CuboidCollider position={[4, 1.5, -9]} args={[0.2, 1.5, 1.0]} />
          <mesh position={[4, 1.5, -9]} castShadow receiveShadow><boxGeometry args={[0.4, 3, 2.0]} /><meshToonMaterial color="#2c3e50" /></mesh>

          <CuboidCollider position={[4, 1.5, 0]} args={[0.2, 1.5, 4.0]} />
          <mesh position={[4, 1.5, 0]} castShadow receiveShadow><boxGeometry args={[0.4, 3, 8.0]} /><meshToonMaterial color="#2c3e50" /></mesh>

          <CuboidCollider position={[4, 1.5, 9]} args={[0.2, 1.5, 1.0]} />
          <mesh position={[4, 1.5, 9]} castShadow receiveShadow><boxGeometry args={[0.4, 3, 2.0]} /><meshToonMaterial color="#2c3e50" /></mesh>
          
          {/* Threshold Ramps for smooth transition from y=-0.01 to y=0.02 */}
          <CuboidCollider position={[-4, 0.005, -6]} args={[0.4, 0.015, 2]} rotation={[0, 0, Math.PI / 32]} />
          <CuboidCollider position={[-4, 0.005, 6]} args={[0.4, 0.015, 2]} rotation={[0, 0, Math.PI / 32]} />
          <CuboidCollider position={[4, 0.005, -6]} args={[0.4, 0.015, 2]} rotation={[0, 0, -Math.PI / 32]} />
          <CuboidCollider position={[4, 0.005, 6]} args={[0.4, 0.015, 2]} rotation={[0, 0, -Math.PI / 32]} />
        </RigidBody>
      </group>

      {/* --- KITCHEN (Left Side Front) --- */}
      {/* 2x scale: 12x8 at [-10, 0, -6] */}
      <group position={[-10, 0, -6]}>
        <pointLight position={[0, 3, 0]} intensity={2.0} distance={15} castShadow />
        <mesh position={[0, 0.02, 0]} receiveShadow rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[12, 8]} />
          <meshStandardMaterial color="#95a5a6" />
        </mesh>
        
        {/* Outer Bounds (North, West, South) */}
        <RigidBody type="fixed" colliders={false}>
           <CuboidCollider position={[0, 1.5, -4]} args={[6, 1.5, 0.2]} />
           <CuboidCollider position={[0, 1.5, 4]} args={[6, 1.5, 0.2]} />
           <CuboidCollider position={[-6, 1.5, 0]} args={[0.2, 1.5, 4]} />
        </RigidBody>

        {/* Kitchen Counter (Pushed to West Wall X=-15 World -> X=-5 Local) */}
        <RigidBody type="fixed">
          <mesh position={[-5, 0.5, 0]} castShadow receiveShadow userData={{ climbable: true }}>
            <boxGeometry args={[1, 1, 4]} />
            <meshToonMaterial color="#bdc3c7" />
          </mesh>
        </RigidBody>
      </group>

      {/* --- BATHROOM (Right Side Front) --- */}
      {/* 2x scale: 12x8 at [10, 0, -6] */}
      <group position={[10, 0, -6]}>
        <pointLight position={[0, 3, 0]} intensity={2.0} distance={15} castShadow />
        <mesh position={[0, 0.02, 0]} receiveShadow rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[12, 8]} />
          <meshStandardMaterial color="#bdc3c7" />
        </mesh>

        <RigidBody type="fixed" colliders={false}>
           <CuboidCollider position={[0, 1.5, -4]} args={[6, 1.5, 0.2]} />
           <CuboidCollider position={[0, 1.5, 4]} args={[6, 1.5, 0.2]} />
           <CuboidCollider position={[6, 1.5, 0]} args={[0.2, 1.5, 4]} />
        </RigidBody>

        <RigidBody type="fixed">
          {/* Tub (Pushed to East Wall X=15 World -> X=5 Local) */}
          <mesh position={[5, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.8, 3]} />
            <meshToonMaterial color="#ecf0f1" />
          </mesh>
        </RigidBody>
      </group>

      {/* --- ROOM 1 (Left Side Back) --- */}
      {/* 2x scale: 12x8 at [-10, 0, 6] */}
      <group position={[-10, 0, 6]}>
        <pointLight position={[0, 3, 0]} intensity={2.0} distance={15} castShadow />
        <mesh position={[0, 0.02, 0]} receiveShadow rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[12, 8]} />
          <meshStandardMaterial color="#c0392b" />
        </mesh>
        
        <RigidBody type="fixed" colliders={false}>
           <CuboidCollider position={[0, 1.5, -4]} args={[6, 1.5, 0.2]} />
           <CuboidCollider position={[0, 1.5, 4]} args={[6, 1.5, 0.2]} />
           <CuboidCollider position={[-6, 1.5, 0]} args={[0.2, 1.5, 4]} />
        </RigidBody>
      </group>

      {/* --- ROOM 2 (Right Side Back) --- */}
      {/* 2x scale: 12x8 at [10, 0, 6] */}
      <group position={[10, 0, 6]}>
        <pointLight position={[0, 3, 0]} intensity={2.0} distance={15} castShadow />
        <mesh position={[0, 0.02, 0]} receiveShadow rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[12, 8]} />
          <meshStandardMaterial color="#2980b9" />
        </mesh>
        
        <RigidBody type="fixed" colliders={false}>
           <CuboidCollider position={[0, 1.5, -4]} args={[6, 1.5, 0.2]} />
           <CuboidCollider position={[0, 1.5, 4]} args={[6, 1.5, 0.2]} />
           <CuboidCollider position={[6, 1.5, 0]} args={[0.2, 1.5, 4]} />
        </RigidBody>
      </group>
    </group>
  )
}
