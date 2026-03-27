'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import * as THREE from 'three'
import usePlayerControls from '@/hooks/usePlayerControls'
import DustParticles from './DustParticles'
import useUIStore from '@/store/useUIStore'

const SPEED = 8
const JUMP_FORCE = 8

export default function Player({ setPlayerPosition }) {
  const keys = usePlayerControls()
  const canJump = useRef(true)
  const isTouch = useUIStore((state) => state.isTouch)
  const moveJoystick = useUIStore((state) => state.moveJoystick)
  const lookJoystick = useUIStore((state) => state.lookJoystick)
  const isJumping = useUIStore((state) => state.isJumping)

  const { gl } = useThree()
  const yaw = useRef(0)
  const pitch = useRef(0.2) // Start slightly angled down

  useEffect(() => {
    const handleMouseClick = () => {
      if (isTouch) return
      if (document.pointerLockElement !== gl.domElement) {
        gl.domElement.requestPointerLock()
      }
    }

    const handleMouseMove = (e) => {
      if (isTouch) return
      if (document.pointerLockElement === gl.domElement) {
        const movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0
        const movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0

        yaw.current -= movementX * 0.002
        pitch.current -= movementY * 0.002

        const PI_2 = Math.PI / 2
        pitch.current = Math.max(-0.1, Math.min(PI_2 - 0.1, pitch.current))
      }
    }

    gl.domElement.addEventListener('click', handleMouseClick)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      gl.domElement.removeEventListener('click', handleMouseClick)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [gl.domElement, isTouch])

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
      useUIStore.getState().playerPosRef.current = p
      if (setPlayerPosition) setPlayerPosition(p)
    })
    return unsubscribe
  }, [api.position, setPlayerPosition])

  const catMeshRef = useRef()
  const isMovingRef = useRef(false)

  const frontVector = new THREE.Vector3()
  const sideVector = new THREE.Vector3()
  const moveDirection = new THREE.Vector3()
  const upVector = new THREE.Vector3(0, 1, 0)

  // Camera setup
  const cameraTarget = new THREE.Vector3()

  useFrame((state, delta) => {
    // 1. Calculate Camera-Relative Movement
    // Use yaw to determine forward and side vectors on the XZ plane
    frontVector.set(0, 0, -1).applyAxisAngle(upVector, yaw.current)
    sideVector.set(1, 0, 0).applyAxisAngle(upVector, yaw.current)

    frontVector.normalize()
    sideVector.normalize()

    // Inputs (Joystick values are already reactive via hooks)
    
    // Combine Keyboard + Joystick
    const forwardInput = (keys.current.forward ? 1 : 0) - (keys.current.backward ? 1 : 0) + moveJoystick.y
    const sideInput = (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0) + moveJoystick.x

    // Handle Look Joystick (Right Joystick)
    if (isTouch && (Math.abs(lookJoystick.x) > 0.01 || Math.abs(lookJoystick.y) > 0.01)) {
      // Sensitivity for joystick look
      const lookSense = 0.04
      yaw.current -= lookJoystick.x * lookSense
      pitch.current += lookJoystick.y * lookSense // lookJoystick.y was inverted in component, so += here

      const PI_2 = Math.PI / 2
      pitch.current = Math.max(-0.1, Math.min(PI_2 - 0.1, pitch.current))
    }

    // Calculate final direction
    moveDirection
      .copy(frontVector)
      .multiplyScalar(forwardInput)
      .add(sideVector.clone().multiplyScalar(sideInput))
      .normalize()

    // 2. Apply Velocity
    const targetVelocity = moveDirection.clone().multiplyScalar(SPEED)
    api.velocity.set(targetVelocity.x, velocity.current[1], targetVelocity.z)

    // 3. Jump
    // 3. Jump
    if ((keys.current.jump || isJumping) && canJump.current) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2])
      canJump.current = false
    }

    // 4. Rotate the Cat mesh to face movement direction
    const isMovingLocally = moveDirection.lengthSq() > 0;
    isMovingRef.current = isMovingLocally && Math.abs(velocity.current[1]) < 0.2; // Only dust when moving on ground

    if (catMeshRef.current && isMovingLocally) {
      const targetAngle = Math.atan2(moveDirection.x, moveDirection.z)

      // Snappy but slight smoothing for rotation
      let currentAngle = catMeshRef.current.rotation.y
      let diff = targetAngle - currentAngle
      while (diff < -Math.PI) diff += Math.PI * 2
      while (diff > Math.PI) diff -= Math.PI * 2

      catMeshRef.current.rotation.y += diff * 15 * delta
    }

    // 5. Update Third-Person Camera Elastic Follow
    cameraTarget.set(position.current[0], position.current[1] + 1, position.current[2])

    // Spherical coordinates for orbit
    const springArmLength = 12
    const offsetX = springArmLength * Math.sin(yaw.current) * Math.cos(pitch.current)
    const offsetY = springArmLength * Math.sin(pitch.current)
    const offsetZ = springArmLength * Math.cos(yaw.current) * Math.cos(pitch.current)

    const offset = new THREE.Vector3(offsetX, offsetY, offsetZ)
    const desiredPos = cameraTarget.clone().add(offset)

    // Smoothly follow
    state.camera.position.lerp(desiredPos, 0.1)
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

      <DustParticles playerMeshRef={catMeshRef} activeRef={isMovingRef} />
    </mesh>
  )
}
