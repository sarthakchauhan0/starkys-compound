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
  // 1. Generate a flat ribbon visual geometry once
  const geometry = useMemo(() => {
    const segments = 128
    const points = curve.getPoints(segments)
    const halfWidth = 2.5
    
    const vertices = []
    const indices = []
    const uvs = []
    
    for (let i = 0; i < points.length; i++) {
      const p = points[i].clone()
      p.y = 0.05 // Force y coordinate to exactly 0.05
      
      // Calculate tangent
      let tangent
      if (i < points.length - 1) {
        tangent = points[i+1].clone().sub(p).normalize()
      } else {
        tangent = p.clone().sub(points[i-1]).normalize()
      }
      
      const normal = new THREE.Vector3(0, 1, 0)
      const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize()
      
      const left = p.clone().add(binormal.clone().multiplyScalar(halfWidth))
      const right = p.clone().add(binormal.clone().multiplyScalar(-halfWidth))
      
      vertices.push(left.x, left.y, left.z)
      vertices.push(right.x, right.y, right.z)
      
      uvs.push(0, i / segments)
      uvs.push(1, i / segments)
    }
    
    for (let i = 0; i < points.length - 1; i++) {
        const v1 = i * 2;
        const v2 = i * 2 + 1;
        const v3 = (i + 1) * 2;
        const v4 = (i + 1) * 2 + 1;
        
        // CCW to face UP
        indices.push(v1, v3, v2);
        indices.push(v2, v3, v4);
    }
    
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geo.setIndex(indices)
    geo.computeVertexNormals()
    
    return geo
  }, [curve])

  // 2. Generate reliable Box Colliders along the path
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
      
      // Force flat for colliders as well
      p1.y = 0.05
      p2.y = 0.05
      
      // Calculate rotation to face the next point
      const angle = Math.atan2(p2.x - p1.x, p2.z - p1.z)
      
      boxes.push({
        position: [p1.x, p1.y - height/2, p1.z], // flush with y=0.05 top
        rotation: [0, angle, 0],
        args: [width, height, depth]
      })
    }
    
    return boxes
  }, [curve])

  return (
    <group>
      {/* Visual Mesh */}
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshToonMaterial color="#e6c287" side={THREE.DoubleSide} />
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
