'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSphere } from '@react-three/cannon'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import usePlayerControls from '@/hooks/usePlayerControls'
import { useAudioEffects } from '@/hooks/useAudioEffects'

const SPEED = 6
const JUMP_FORCE = 5

export default function Player({ onShoot, onHit, setPlayerPosition }) {
  const { playShootSound, playHitSound } = useAudioEffects()
  const keys = usePlayerControls()
  const { camera, scene } = useThree()
  const controlsRef = useRef()
  const canJump = useRef(true)
  const raycaster = useRef(new THREE.Raycaster())
  const isFiring = useRef(false)

  // Physics body – sphere for smooth collisions
  const [ref, api] = useSphere(() => ({
    mass: 75,
    type: 'Dynamic',
    position: [0, 2, 15],
    args: [0.5],
    material: { friction: 0.1, restitution: 0 },
    linearDamping: 0.9,
    fixedRotation: true,
    onCollide: (e) => {
      // Reset jump when landing
      if (e.contact && e.contact.ni[1] > 0.5) {
        canJump.current = true
      }
    },
  }))

  // Track velocity for jump detection
  const velocity = useRef([0, 0, 0])
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => {
      velocity.current = v
    })
    return unsubscribe
  }, [api.velocity])

  // Track position for syncing camera
  const position = useRef([0, 2, 15])
  useEffect(() => {
    const unsubscribe = api.position.subscribe((p) => {
      position.current = p
      if (setPlayerPosition) setPlayerPosition(p)
    })
    return unsubscribe
  }, [api.position, setPlayerPosition])

  // Fire raycast on click
  const handleShoot = useCallback(() => {
    if (isFiring.current) return
    isFiring.current = true
    setTimeout(() => { isFiring.current = false }, 150)

    playShootSound()
    if (onShoot) onShoot()

    raycaster.current.setFromCamera(new THREE.Vector2(0, 0), camera)
    const intersects = raycaster.current.intersectObjects(scene.children, true)

    for (const intersect of intersects) {
      let obj = intersect.object
      // Walk up the hierarchy to find a target
      while (obj) {
        if (obj.userData && obj.userData.targetId) {
          playHitSound()
          if (onHit) onHit(obj.userData.targetId, obj.userData.targetType)
          return
        }
        obj = obj.parent
      }
    }
  }, [camera, scene, onShoot, onHit])

  // Mouse click listener for shooting
  useEffect(() => {
    const handleClick = () => {
      if (document.pointerLockElement) {
        handleShoot()
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [handleShoot])

  // Movement each frame
  useFrame(() => {
    // Sync camera to physics body
    camera.position.set(
      position.current[0],
      position.current[1] + 0.5, // eye height
      position.current[2]
    )

    // Calculate movement direction based on camera heading
    const direction = new THREE.Vector3()
    const frontVector = new THREE.Vector3(
      0,
      0,
      (keys.current.backward ? 1 : 0) - (keys.current.forward ? 1 : 0)
    )
    const sideVector = new THREE.Vector3(
      (keys.current.left ? 1 : 0) - (keys.current.right ? 1 : 0),
      0,
      0
    )

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation)

    api.velocity.set(direction.x, velocity.current[1], direction.z)

    // Jump
    if (keys.current.jump && canJump.current) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2])
      canJump.current = false
    }
  })

  return (
    <>
      {/* Invisible physics body */}
      <mesh ref={ref} visible={false}>
        <sphereGeometry args={[0.5]} />
      </mesh>
      <PointerLockControls ref={controlsRef} />
    </>
  )
}
