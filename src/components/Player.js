'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
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
  const sceneZone = useUIStore((state) => state.sceneZone)
  const isInsideHouse = sceneZone === 'INTERIOR'

  const { gl, scene } = useThree()
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

  const bodyRef = useRef()

  useEffect(() => {
    if (!bodyRef.current) return
    useUIStore.setState({ playerBodyRef: bodyRef.current })
    const store = useUIStore.getState()
    if (store.sceneZone === 'INTERIOR') {
      bodyRef.current.setTranslation({ x: 0, y: 1, z: -2 }, true) // INTERIOR_SPAWN_POINT
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      yaw.current = 0 // Face forward into the room
    } else {
      const extPos = store.lastExteriorPos
      if (extPos) {
        // Teleport back out slightly in front of the door
        bodyRef.current.setTranslation({ x: extPos[0], y: extPos[1] + 1, z: extPos[2] + 4 }, true)
        bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      }
    }
  }, [sceneZone])
  const catMeshRef = useRef()
  const isMovingRef = useRef(false)

  // IK Paw Refs
  const flPawRef = useRef()
  const frPawRef = useRef()
  const blPawRef = useRef()
  const brPawRef = useRef()

  const position = useRef([0, 5, 15])

  const frontVector = new THREE.Vector3()
  const sideVector = new THREE.Vector3()
  const moveDirection = new THREE.Vector3()
  const upVector = new THREE.Vector3(0, 1, 0)
  const cameraTarget = new THREE.Vector3()
  const raycaster = new THREE.Raycaster()

  useFrame((state, delta) => {
    if (!bodyRef.current) return

    const t = bodyRef.current.translation()
    position.current = [t.x, t.y, t.z]

    // Death Plane
    if (t.y < -10) {
      if (isInsideHouse) {
        bodyRef.current.setTranslation({ x: 0, y: 2, z: -2 }, true)
      } else {
        const extPos = useUIStore.getState().lastExteriorPos
        bodyRef.current.setTranslation({ x: extPos ? extPos[0] : 0, y: 10, z: extPos ? extPos[2] : 0 }, true)
      }
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
    }

    useUIStore.getState().playerPosRef.current = position.current
    if (setPlayerPosition) setPlayerPosition(position.current)

    // 1. Calculate Camera-Relative Movement
    // Use yaw to determine forward and side vectors on the XZ plane
    frontVector.set(0, 0, -1).applyAxisAngle(upVector, yaw.current)
    sideVector.set(1, 0, 0).applyAxisAngle(upVector, yaw.current)

    frontVector.normalize()
    sideVector.normalize()

    const forwardInput = (keys.current.forward ? 1 : 0) - (keys.current.backward ? 1 : 0) + moveJoystick.y
    const sideInput = (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0) + moveJoystick.x

    if (isTouch && (Math.abs(lookJoystick.x) > 0.01 || Math.abs(lookJoystick.y) > 0.01)) {
      const lookSense = 0.04
      yaw.current -= lookJoystick.x * lookSense
      pitch.current += lookJoystick.y * lookSense // lookJoystick.y was inverted
      const PI_2 = Math.PI / 2
      pitch.current = Math.max(-0.1, Math.min(PI_2 - 0.1, pitch.current))
    }

    moveDirection
      .copy(frontVector)
      .multiplyScalar(forwardInput)
      .add(sideVector.clone().multiplyScalar(sideInput))
      .normalize()

    // 2. Apply Velocity
    const targetVelocity = moveDirection.clone().multiplyScalar(SPEED)
    const linvel = bodyRef.current.linvel()

    // 3. Jump
    if ((keys.current.jump || isJumping) && canJump.current) {
      linvel.y = JUMP_FORCE
      canJump.current = false
    }

    bodyRef.current.setLinvel({ x: targetVelocity.x, y: linvel.y, z: targetVelocity.z }, true)

    // 4. Cat Rotation
    const isMovingLocally = moveDirection.lengthSq() > 0
    isMovingRef.current = isMovingLocally && Math.abs(linvel.y) < 0.2

    if (catMeshRef.current && isMovingLocally) {
      const targetAngle = Math.atan2(moveDirection.x, moveDirection.z)

      // Snappy but slight smoothing for rotation
      let currentAngle = catMeshRef.current.rotation.y
      let diff = targetAngle - currentAngle
      while (diff < -Math.PI) diff += Math.PI * 2
      while (diff > Math.PI) diff -= Math.PI * 2

      catMeshRef.current.rotation.y += diff * 15 * delta
    }

    // 5. Procedural IK Paw Raycasting & Walk Cycle
    const down = new THREE.Vector3(0, -1, 0)
    const time = state.clock.elapsedTime
    const speed = new THREE.Vector3(linvel.x, 0, linvel.z).length()
    const isActuallyMoving = speed > 1.0

      ;[flPawRef, frPawRef, blPawRef, brPawRef].forEach((pawRef, i) => {
        if (!pawRef.current || !catMeshRef.current) return

        const phase = (i === 0 || i === 3) ? 0 : Math.PI
        const walkFactor = isActuallyMoving ? Math.sin(time * 15 + phase) : 0
        const liftFactor = isActuallyMoving ? Math.max(0, Math.sin(time * 15 + phase)) : 0

        const baseZ = (i === 0 || i === 1) ? 0.3 : -0.3
        const stepZ = baseZ + walkFactor * 0.2
        const stepY = liftFactor * 0.3

        const pawRoot = new THREE.Vector3().copy(pawRef.current.position)
        pawRoot.y = 0.5 // Start ray from cat's chest level
        pawRoot.z = stepZ // Cast from where the foot will land
        catMeshRef.current.localToWorld(pawRoot) // Convert to world space

        raycaster.set(pawRoot, down)
        raycaster.far = 1.0
        const hit = raycaster.intersectObjects(scene.children, true)
          .find(h => {
            if (h.object.type !== 'Mesh') return false;
            if (h.object.geometry?.type?.includes('Sphere')) return false;

            let isPlayer = false;
            h.object.traverseAncestors((ancestor) => {
              if (ancestor === catMeshRef.current || ancestor.userData?.isPlayer) {
                isPlayer = true;
              }
            });
            return !isPlayer && h.object !== catMeshRef.current;
          })

        let targetY = 0.2
        if (hit && hit.distance > 0) {
          // Convert world hit back to local space using a CLONED point 
          const localHit = catMeshRef.current.worldToLocal(hit.point.clone())
          targetY = localHit.y + 0.2
        }

        // Apply walk animation height
        targetY += stepY

        // Smooth IK lerp
        pawRef.current.position.y = THREE.MathUtils.lerp(pawRef.current.position.y, targetY, 15 * delta)
        pawRef.current.position.z = THREE.MathUtils.lerp(pawRef.current.position.z, stepZ, 15 * delta)
      })

    // 6. Climb Raycaster for Ledges
    if (catMeshRef.current) {
      const forwardDir = new THREE.Vector3(0, 0, 1).applyQuaternion(catMeshRef.current.quaternion).normalize()
      const chestPos = new THREE.Vector3(0, 0.4, 0)
      catMeshRef.current.localToWorld(chestPos)

      raycaster.set(chestPos, forwardDir)
      raycaster.far = 1.5

      const hits = raycaster.intersectObjects(scene.children, true)
      const climbHit = hits.find(h => h.object.userData?.climbable)

      if (climbHit && (keys.current.jump || isJumping)) {
        // Boost up towards ledge
        const topY = climbHit.point.y + 1.0
        bodyRef.current.setLinvel({ x: linvel.x, y: 10, z: linvel.z }, true)
      }
    }

    // 7. Camera Collision & Obstruction Handing (Cinemachine style)
    cameraTarget.set(t.x, t.y + 1, t.z)

    // Restrict camera distance inside the house so it doesn't clip outside
    let springArmLength = isInsideHouse ? 4.5 : 12
    const idealOffsetX = springArmLength * Math.sin(yaw.current) * Math.cos(pitch.current)
    const idealOffsetY = springArmLength * Math.sin(pitch.current)
    const idealOffsetZ = springArmLength * Math.cos(yaw.current) * Math.cos(pitch.current)
    const offsetDir = new THREE.Vector3(idealOffsetX, idealOffsetY, idealOffsetZ).normalize()

    raycaster.set(cameraTarget, offsetDir)
    raycaster.far = springArmLength
    const blockHits = raycaster.intersectObjects(scene.children, true)
      .filter(h => h.object.type === 'Mesh' && !h.object.geometry?.type?.includes('Sphere') && h.object.name !== 'Boundary')

    if (blockHits.length > 0) {
      springArmLength = Math.max(1.5, blockHits[0].distance - 0.5) // Squeeze camera inwards
    }

    const actualOffset = offsetDir.multiplyScalar(springArmLength)
    const desiredPos = cameraTarget.clone().add(actualOffset)

    const snap = useUIStore.getState().cameraSnap
    if (snap) {
      state.camera.position.copy(desiredPos)
      state.camera.lookAt(cameraTarget)
      useUIStore.getState().setCameraSnap(false)
    } else {
      state.camera.position.lerp(desiredPos, 0.1)
      state.camera.lookAt(cameraTarget)
    }
  })

  return (
    <>
      <RigidBody
        ref={bodyRef}
        name="playerBody"
        type="dynamic"
        colliders="ball"
        position={[0, 5, 15]}
        mass={50}
        enabledRotations={[false, false, false]}
        linearDamping={0.5}
        angularDamping={0.5}
        onCollisionEnter={(e) => {
          canJump.current = true
        }}
      >
        <mesh visible={false}>
          <sphereGeometry args={[0.6]} />
          <meshBasicMaterial />
        </mesh>

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

          {/* Paws */}
          <mesh ref={flPawRef} position={[-0.2, 0.2, 0.3]} castShadow>
            <boxGeometry args={[0.1, 0.4, 0.1]} />
            <meshToonMaterial color="#d18a4f" />
          </mesh>
          <mesh ref={frPawRef} position={[0.2, 0.2, 0.3]} castShadow>
            <boxGeometry args={[0.1, 0.4, 0.1]} />
            <meshToonMaterial color="#d18a4f" />
          </mesh>
          <mesh ref={blPawRef} position={[-0.2, 0.2, -0.3]} castShadow>
            <boxGeometry args={[0.1, 0.4, 0.1]} />
            <meshToonMaterial color="#d18a4f" />
          </mesh>
          <mesh ref={brPawRef} position={[0.2, 0.2, -0.3]} castShadow>
            <boxGeometry args={[0.1, 0.4, 0.1]} />
            <meshToonMaterial color="#d18a4f" />
          </mesh>

          {/* Eyes & Nose Details */}
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
      </RigidBody>
    </>
  )
}
