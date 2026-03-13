'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instances, Instance } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Renders thousands of grass blades efficiently.
 * Swaying is applied via a custom vertex shader in the material.
 */
export default function Grass({ count = 10000, bounds = 100 }) {
  const materialRef = useRef()

  // Generate random data for each grass blade once
  const grassData = useMemo(() => {
    return Array.from({ length: count }, () => {
      // Random position within a circular/square bounds
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * bounds
      
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      
      // Keep x, z close to floor. Y should be 0 (base of grass).
      // Random rotation so they don't all face the same way
      const rotationY = Math.random() * Math.PI * 2

      // Slight scale variations
      const scale = 0.5 + Math.random() * 0.8

      // Determine a slight green hue variation
      const hueVariations = ['#4ade80', '#22c55e', '#16a34a', '#86efac']
      const color = hueVariations[Math.floor(Math.random() * hueVariations.length)]

      return {
        position: [x, 0, z],
        rotation: [0, rotationY, 0],
        scale: [scale, scale, scale],
        color: color,
      }
    })
  }, [count, bounds])

  // Update the shader time uniform for smooth continuous swaying
  useFrame((state) => {
    if (materialRef.current?.uniforms?.time) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime()
    }
  })

  // Geometry shifted so bottom is exactly at y=0.
  // This is critical so the vertex shader sway calculation (which relies on position.y) 
  // only affects the top of the grass blade and leaves the base pinned to the ground.
  const geometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.05, 0.4, 3)
    // Translate up by half height so the pivot is at the bottom
    geo.translate(0, 0.2, 0)
    return geo
  }, [])

  return (
    <group position={[0, 0, 0]}>
      {/* We use a simple 3-vert triangle (cone) for the grass blade */}
      <Instances
        limit={count}
        castShadow
        receiveShadow
        geometry={geometry}
      >
        <meshToonMaterial
          customProgramCacheKey={() => 'grassShader'}
          onBeforeCompile={(shader) => {
            shader.uniforms.time = { value: 0 }
            materialRef.current = shader
            // Inject vertex sway logic
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
              // This is why we translated the geometry earlier.
              float swayX = sin(time * 2.0 + offset * 0.5) * 0.15;
              float swayZ = cos(time * 1.5 + offset * 0.4) * 0.15;
              
              transformed.x += swayX * position.y;
              transformed.z += swayZ * position.y;
              `
            )
          }}
        />
        {grassData.map((data, i) => (
          <Instance
            key={i}
            color={data.color}
            position={data.position}
            rotation={data.rotation}
            scale={data.scale}
          />
        ))}
      </Instances>
    </group>
  )
}
