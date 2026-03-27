'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import House from './House'
import Grass from './Grass'
import Road from './Road'

import { websiteProjects, dataProjects, skills, bossData } from '@/data/projects'

/**
 * Map handles the static physical boundaries, the floor, the winding roads, and houses.
 */
export default function Map() {
  // 2. Invisible Physics Boundaries (prevent falling off the world)
  const Boundary = ({ position, args }) => {
    return (
      <RigidBody type="fixed" position={position}>
        <CuboidCollider args={[args[0] / 2, args[1] / 2, args[2] / 2]} />
      </RigidBody>
    )
  }

  // 3. The Main Winding Road Spline (Flattened to y = 0.1)
  const roadCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0.1, 30),
      new THREE.Vector3(-25, 0.1, 20),
      new THREE.Vector3(-35, 0.1, 0),
      new THREE.Vector3(-25, 0.1, -25),
      new THREE.Vector3(0, 0.1, -35),
      new THREE.Vector3(30, 0.1, -25),
      new THREE.Vector3(45, 0.1, 0),
      new THREE.Vector3(30, 0.1, 25),
    ]
    return new THREE.CatmullRomCurve3(points, true) // Closed loop
  }, [])

  // 4. Calculate proper placements for Houses along the road
  // We place houses at specific 't' parameter along the spline (0 to 1)
  const houses = useMemo(() => {
    const configs = [
      { t: 0.0, data: { title: 'About Me', description: 'Experience my journey and vision.', color: '#ff7b7b' } },
      { t: 0.125, data: websiteProjects[0] },
      { t: 0.25, data: websiteProjects[1] },
      { t: 0.375, data: { title: 'Projects Archive', description: 'Review my past works and experiments.', color: '#4ba3e3' } },
      { t: 0.5, data: dataProjects[0] },
      { t: 0.625, data: { title: 'Abilities & Tools', description: 'My technical stack and competencies.', type: 'skill', color: '#f1c40f' } },
      { t: 0.75, data: dataProjects[1] },
      { t: 0.875, data: { ...bossData, title: 'Contact HQ', type: 'boss', color: '#2c3e50' } },
    ]

    return configs.map((conf) => {
      // Get point on road
      const point = roadCurve.getPointAt(conf.t)
      // Get tangent (forward direction of the road at this point)
      const tangent = roadCurve.getTangentAt(conf.t).normalize()
      
      // Calculate normal vector (perpendicular to tangent on the XZ plane)
      // We choose to push the house to the right side of the road
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()
      
      // House offset from center of road (radius is 2.5, so 4 is safely on the grass)
      const offsetDistance = 4.5
      
      // Calculate final house position: House Base at y = 0
      const position = new THREE.Vector3(
        point.x + normal.x * offsetDistance,
        0, 
        point.z + normal.z * offsetDistance
      )
      
      // House must face the road. atan2 calculates rotation based on the vector pointing TO the road (which is -normal)
      const rotationY = Math.atan2(-normal.x, -normal.z)

      return {
        id: conf.data.title,
        position: [position.x, position.y, position.z],
        rotation: [0, rotationY, 0],
        projectData: conf.data,
        color: conf.data.color || '#fdfbf7'
      }
    })
  }, [roadCurve])

  return (
    <group>
      {/* Visual Floor & Physics */}
      <RigidBody type="fixed" friction={0.1}>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[200, 200]} />
          {/* Lush green base */}
          <meshToonMaterial color="#4ade80" />
        </mesh>
      </RigidBody>

      {/* Physics Boundaries */}
      <Boundary position={[0, 10, -50]} args={[100, 20, 1]} /> // North
      <Boundary position={[0, 10, 50]} args={[100, 20, 1]} />  // South
      <Boundary position={[-50, 10, 0]} args={[1, 20, 100]} /> // West
      <Boundary position={[50, 10, 0]} args={[1, 20, 100]} />  // East

      {/* Swaying Grass Component */}
      {/* Covers the map with 15k blades */}
      <Grass count={15000} bounds={50} />

      {/* The Winding Road (Physics Enabled) */}
      {/* Visual Road is drawn at y=0.1 to avoid z-fighting with the grass at y=0 */}
      <Road curve={roadCurve} />

      {/* Stylized Portfolio Houses with integrated Triggers */}
      {houses.map((h) => (
        <House 
          key={h.id}
          position={h.position}
          rotation={h.rotation}
          color={h.color}
          projectData={h.projectData}
        />
      ))}
      
      {/* Decorative Trees alongside the path */}
      <group position={[-18, 0, 5]}>
        <mesh position={[0, 1, 0]} castShadow>
          <sphereGeometry args={[1.5, 8, 8]} />
          <meshToonMaterial color="#22c55e" />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow>
         <cylinderGeometry args={[0.2, 0.4, 2]} />
         <meshToonMaterial color="#8e6b52" />
        </mesh>
      </group>
      
      <group position={[12, 0, -3]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <sphereGeometry args={[2, 8, 8]} />
          <meshToonMaterial color="#16a34a" />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow>
         <cylinderGeometry args={[0.3, 0.5, 2]} />
         <meshToonMaterial color="#8e6b52" />
        </mesh>
      </group>

      <group position={[-20, 0, -25]}>
        <mesh position={[0, 2, 0]} castShadow>
          <sphereGeometry args={[2.5, 8, 8]} />
          <meshToonMaterial color="#22c55e" />
        </mesh>
        <mesh position={[0, 1, 0]} castShadow>
         <cylinderGeometry args={[0.4, 0.6, 2]} />
         <meshToonMaterial color="#8e6b52" />
        </mesh>
      </group>
    </group>
  )
}
