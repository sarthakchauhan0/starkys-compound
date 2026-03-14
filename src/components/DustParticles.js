'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 30
const DUMMY = new THREE.Object3D()

export default function DustParticles({ playerMeshRef, activeRef }) {
  const meshRef = useRef()
  
  // Track particles: { position, age, active }
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      age: 0,
      active: false,
      scale: 1
    }))
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current || !playerMeshRef.current) return

    // Spawn new particle if moving
    if (activeRef.current) {
      // Find inactive particle
      const p = particles.find((p) => !p.active)
      if (p) {
        p.active = true
        p.age = 0
        p.scale = Math.random() * 0.5 + 0.5
        
        // Spawn at player's feet with slight randomness
        const playerPos = new THREE.Vector3()
        playerMeshRef.current.getWorldPosition(playerPos)
        
        p.position.set(
          playerPos.x + (Math.random() - 0.5) * 0.5,
          playerPos.y + 0.1, // slightly above ground
          playerPos.z + (Math.random() - 0.5) * 0.5
        )
        
        // Drift upwards and slightly outwards
        p.velocity.set(
          (Math.random() - 0.5) * 2,
          Math.random() * 2 + 1,
          (Math.random() - 0.5) * 2
        )
      }
    }

    // Update particles
    particles.forEach((p, i) => {
      if (p.active) {
        p.age += delta * 2 // age faster
        
        if (p.age >= 1) {
          p.active = false
          // Hide it
          DUMMY.position.set(0, -100, 0)
          DUMMY.scale.set(0, 0, 0)
        } else {
          // Move
          p.position.addScaledVector(p.velocity, delta)
          p.velocity.y += delta // accelerate upwards slightly
          
          // Shrink as it ages
          const currentScale = p.scale * (1 - p.age)
          
          DUMMY.position.copy(p.position)
          DUMMY.scale.setScalar(currentScale)
        }
      } else {
        DUMMY.position.set(0, -100, 0)
        DUMMY.scale.set(0, 0, 0)
      }
      
      DUMMY.updateMatrix()
      meshRef.current.setMatrixAt(i, DUMMY.matrix)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  // Material with slight transparency calculation (since standard instancedmesh sharing materials can't easily animate opacity per instance without custom shaders, we shrink them to 0 instead)
  return (
    <instancedMesh ref={meshRef} args={[null, null, PARTICLE_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[0.2, 4, 4]} />
      <meshBasicMaterial color="#e0f2fe" transparent opacity={0.4} />
    </instancedMesh>
  )
}
