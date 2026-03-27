import { RigidBody, CuboidCollider } from '@react-three/rapier'
import House from './House'
import useUIStore from '@/store/useUIStore'
import DoorTrigger from './DoorTrigger'
import { Html } from '@react-three/drei'

export default function HouseInterior() {
  const { leaveHouse, activeHouse } = useUIStore()

  // Fake project data just for the Exit trigger to work if none exists
  const projectData = activeHouse || { title: 'Unknown Protocol', id: 'exit' }

  return (
    <group>
      {/* Interior Floor */}
      <RigidBody type="fixed" friction={0.1}>
        <CuboidCollider args={[50, 0.5, 50]} position={[0, -0.5, -2]} />
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -2]}>
          <planeGeometry args={[100, 100]} />
          <meshToonMaterial color="#2d3436" />
        </mesh>
      </RigidBody>

      {/* Reusing House logic but telling it we're inside or just using it directly */}
      <House position={[0, 0, -2]} rotation={[0, 0, 0]} color="#fdfbf7" roofColor="#e74c3c" projectData={projectData} isInterior={true} />
      
      {/* Exit Door interactable */}
      <mesh position={[0, 1, 0.2]} onClick={() => leaveHouse()} visible={false}>
          <boxGeometry args={[1, 2, 0.5]} />
      </mesh>
      
      <Html position={[0, 1.5, 0.5]} center distanceFactor={10} zIndexRange={[100, 0]}>
        <div 
          className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-[#e74c3c]/30 flex flex-col items-center cursor-pointer active:scale-95 pointer-events-auto"
          onClick={() => leaveHouse()}
        >
          <span className="text-[12px] font-bold tracking-widest text-[#e74c3c] uppercase whitespace-nowrap">
            LEAVE HOUSE
          </span>
        </div>
      </Html>
    </group>
  )
}
