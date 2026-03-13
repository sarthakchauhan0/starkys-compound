'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { useBox } from '@react-three/cannon'

// An invisible physics box for one segment of the road
function RoadSegment({ position, rotation, args }) {
  useBox(() => ({
    type: 'Static',
    position,
    rotation,
    args,
    material: { friction: 0.1 }
  }))
  return null
}

/**
 * Visual Road with reliable Box colliders sampled along the spline.
 */
export default function Road({ curve }) {
  // 1. Generate the visual geometry once
  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 2.5, 8, false)
  }, [curve])

  // 2. Generate reliable Box Colliders along the path
  // Since Trimesh vs Sphere is notoriously buggy in cannon-es,
  // we sample the curve and place overlapping static boxes.
  const colliders = useMemo(() => {
    const segments = 40 // How many boxes to generate
    const boxes = []
    
    // Width of tube is 2.5 radius => 5 diameter
    const width = 5
    // Height of collider
    const height = 1
    // Depth (length of each segment box)
    const curveLength = curve.getLength()
    const depth = (curveLength / segments) * 1.5 // Overlap by 1.5x to prevent gaps
    
    for (let i = 0; i < segments; i++) {
      const t1 = i / segments
      const t2 = Math.min((i + 1) / segments, 1) // next point for orientation
      
      const p1 = curve.getPointAt(t1)
      const p2 = curve.getPointAt(t2)
      
      // Calculate rotation to face the next point
      const angle = Math.atan2(p2.x - p1.x, p2.z - p1.z)
      
      boxes.push({
        position: [p1.x, p1.y - height/2 + 0.2, p1.z], // slightly sunken to match visual road top
        rotation: [0, angle, 0],
        args: [width, height, depth]
      })
    }
    
    return boxes
  }, [curve])

  return (
    <group>
      {/* Visual Mesh */}
      <mesh geometry={geometry} receiveShadow castShadow position={[0, 0.05, 0]}>
        <meshToonMaterial color="#e6c287" />
      </mesh>
      
      {/* Physics Colliders */}
      {colliders.map((box, idx) => (
        <RoadSegment 
          key={idx} 
          position={box.position} 
          rotation={box.rotation} 
          args={box.args} 
        />
      ))}
    </group>
  )
}
