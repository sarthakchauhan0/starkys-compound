'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import * as THREE from 'three'
import usePlayerControls from '@/hooks/usePlayerControls'

const SPEED = 8
const JUMP_FORCE = 8

export default function Player({ setPlayerPosition }) {
  const keys = usePlayerControls()
  const canJump = useRef(true)
  
  // Physics body – sphere allows smooth rolling/sliding over terrain
  const [ref, api] = useSphere(() => ({
    mass: 50,
    type: 'Dynamic',
    position: [0, 5, 15],
    args: [0.6], // Slightly larger than before to encompass the cat model
    material: { friction: 0.1, restitution: 0 },
    linearDamping: 0.9,
    angularDamping: 1.0, // Prevent the sphere from spinning wildly
    fixedRotation: true, // Crucial! Keeps the visual mesh right-side up
    onCollide: (e) => {
      // Reset jump when landing
      if (e.contact && Math.abs(e.contact.ni[1]) > 0.5) {
        canJump.current = true
      }
    },
  }))

  const velocity = useRef([0, 0, 0])
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => { velocity.current = v })
    return unsubscribe
  }, [api.velocity])

  const position = useRef([0, 5, 15])
  useEffect(() => {
    const unsubscribe = api.position.subscribe((p) => {
      position.current = p
      if (setPlayerPosition) setPlayerPosition(p)
    })
    return unsubscribe
  }, [api.position, setPlayerPosition])

  const catMeshRef = useRef()

  // Camera setup
  const cameraPosition = new THREE.Vector3()
  const cameraTarget = new THREE.Vector3()

  useFrame((state, delta) => {
    // 1. Calculate Movement relative to world space
    // Since it's an isometric/3rd person platformer, WASD can just map to world axes
    const moveX = (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0)
    const moveZ = (keys.current.backward ? 1 : 0) - (keys.current.forward ? 1 : 0)

    const direction = new THREE.Vector3(moveX, 0, moveZ).normalize().multiplyScalar(SPEED)

    // Apply movement
    api.velocity.set(direction.x, velocity.current[1], direction.z)

    // 2. Jump
    if (keys.current.jump && canJump.current) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2])
      canJump.current = false
    }

    // 3. Rotate the Cat mesh to face movement direction
    if (catMeshRef.current && (moveX !== 0 || moveZ !== 0)) {
      // Calculate target angle
      const targetAngle = Math.atan2(direction.x, direction.z)
      
      // Smooth rotation (slerp equivalent for eulery Y)
      let currentAngle = catMeshRef.current.rotation.y
      
      // Normalize angle difference to take shortest path
      let diff = targetAngle - currentAngle
      while (diff < -Math.PI) diff += Math.PI * 2
      while (diff > Math.PI) diff -= Math.PI * 2

      catMeshRef.current.rotation.y += diff * 10 * delta
    }

    // 4. Update Third-Person Camera
    // Follow target is the player's position
    cameraTarget.set(position.current[0], position.current[1] + 1, position.current[2])

    // Desired camera position (behind and above)
    // You can tweak these offsets to change the perspective
    const offset = new THREE.Vector3(0, 6, 12) 
    const desiredPos = cameraTarget.clone().add(offset)

    // Smoothly interpolate camera position
    cameraPosition.lerp(desiredPos, 5 * delta)
    state.camera.position.copy(cameraPosition)
    
    // Look at player
    state.camera.lookAt(cameraTarget)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.6]} />
      {/* 
        The top level mesh receives physics positions.
        We make it invisible and render the cat relative to this root.
      */}
      <meshBasicMaterial visible={false} />

      {/* Visual Cat Group */}
      <group ref={catMeshRef} position={[0, -0.6, 0]}>
        {/* Body */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.5, 0.4, 0.8]} />
          <meshToonMaterial color="#e6a46e" />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 0.8, 0.4]} castShadow>
          <boxGeometry args={[0.5, 0.4, 0.5]} />
          <meshToonMaterial color="#e6a46e" />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.2, 1.1, 0.4]} castShadow>
          <coneGeometry args={[0.1, 0.3, 4]} />
          <meshToonMaterial color="#e6a46e" />
        </mesh>
        <mesh position={[0.2, 1.1, 0.4]} castShadow>
          <coneGeometry args={[0.1, 0.3, 4]} />
          <meshToonMaterial color="#e6a46e" />
        </mesh>

        {/* Tail */}
        <mesh position={[0, 0.6, -0.4]} rotation={[0.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.6]} />
          <meshToonMaterial color="#d18a4f" />
        </mesh>

        {/* Eyes & Nose (Details) */}
        <mesh position={[-0.1, 0.85, 0.66]}>
          <boxGeometry args={[0.05, 0.05, 0.02]} />
          <meshBasicMaterial color="#2c3e50" />
        </mesh>
        <mesh position={[0.1, 0.85, 0.66]}>
          <boxGeometry args={[0.05, 0.05, 0.02]} />
          <meshBasicMaterial color="#2c3e50" />
        </mesh>
        <mesh position={[0, 0.75, 0.66]}>
          <boxGeometry args={[0.03, 0.03, 0.02]} />
          <meshBasicMaterial color="#ff7b7b" />
        </mesh>
      </group>
    </mesh>
  )
}
