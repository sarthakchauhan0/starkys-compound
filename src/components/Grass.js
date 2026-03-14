'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// We create a shared custom material definition so we don't compile 25 different shaders
const GrassMaterial = new THREE.MeshToonMaterial({
  color: '#4ade80' // default, but we'll use instanceColor
})

const customUniforms = { time: { value: 0 } }

GrassMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.time = customUniforms.time
  shader.vertexShader = `
    uniform float time;
    ${shader.vertexShader}
  `.replace(
    `#include <begin_vertex>`,
    `
    #include <begin_vertex>
    // Get world position roughly based on instance matrix translation
    float offset = instanceMatrix[3][0] + instanceMatrix[3][2];
    
    // Only sway the upper parts of the geometry (position.y > 0)
    float swayX = sin(time * 2.0 + offset * 0.5) * 0.15;
    float swayZ = cos(time * 1.5 + offset * 0.4) * 0.15;
    
    transformed.x += swayX * position.y;
    transformed.z += swayZ * position.y;
    `
  )
}

function GrassChunk({ data, geometry }) {
  const meshRef = useRef()

  useEffect(() => {
    if (!meshRef.current) return
    const dummy = new THREE.Object3D()
    const colorDummy = new THREE.Color()

    data.forEach((blade, i) => {
      dummy.position.set(blade.position[0], blade.position[1], blade.position[2])
      dummy.rotation.set(blade.rotation[0], blade.rotation[1], blade.rotation[2])
      dummy.scale.set(blade.scale[0], blade.scale[1], blade.scale[2])
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      
      colorDummy.set(blade.color)
      meshRef.current.setColorAt(i, colorDummy)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
    
    // Compute bounding sphere for frustum culling
    meshRef.current.computeBoundingSphere()
  }, [data])

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, GrassMaterial, data.length]}
      castShadow
      receiveShadow
      frustumCulled={true} // ENABLES true frustum culling per chunk!
    />
  )
}

export default function Grass({ count = 15000, bounds = 100 }) {
  useFrame((state) => {
    customUniforms.time.value = state.clock.getElapsedTime()
  })

  // Geometry shifted so bottom is exactly at y=0.
  const geometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.05, 0.4, 3)
    geo.translate(0, 0.2, 0)
    return geo
  }, [])

  // Divide map into 8x8 grid (64 chunks) for excellent culling granularity
  const gridSize = 8
  const chunkSize = (bounds * 2) / gridSize
  const halfBounds = bounds

  const chunks = useMemo(() => {
    const grid = new Map()

    for (let i = 0; i < count; i++) {
      // Random position within full circular bounds roughly
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * bounds
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      
      // Determine which grid cell this blade belongs to
      const gridX = Math.floor((x + halfBounds) / chunkSize)
      const gridZ = Math.floor((z + halfBounds) / chunkSize)
      const key = `${gridX}-${gridZ}`

      if (!grid.has(key)) grid.set(key, [])

      const rotationY = Math.random() * Math.PI * 2
      const scale = 0.5 + Math.random() * 0.8
      const hueVariations = ['#4ade80', '#22c55e', '#16a34a', '#86efac']
      const color = hueVariations[Math.floor(Math.random() * hueVariations.length)]

      grid.get(key).push({
        position: [x, 0, z],
        rotation: [0, rotationY, 0],
        scale: [scale, scale, scale],
        color: color,
      })
    }

    return Array.from(grid.values())
  }, [count, bounds, chunkSize, halfBounds])

  return (
    <group>
      {chunks.map((chunkData, index) => (
        <GrassChunk key={index} data={chunkData} geometry={geometry} />
      ))}
    </group>
  )
}
