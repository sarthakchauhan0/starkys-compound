'use client'

import { useBox } from '@react-three/cannon'
import { Html } from '@react-three/drei'
import useUIStore from '@/store/useUIStore'

/**
 * An invisible sensor box placed at the entrance of Houses.
 * When the player collides with this box, the Card Overlay opens.
 */
export default function DoorTrigger({ position, projectData }) {
  const openCard = useUIStore((state) => state.openCard)
  const isCardOpen = useUIStore((state) => state.isCardOpen)

  // A large invisible trigger box
  // isTrigger: true means physical objects pass through it, but fire onCollide
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: [2.5, 3, 2.5], // Large hit area
    isTrigger: true,
    onCollide: (e) => {
      const store = useUIStore.getState()
      if (!store.isCardOpen) {
        store.openCard(projectData)
      }
    }
  }))

  return (
    <group ref={ref}>
      {/* Floating Entry Prompt */}
      {/* The HTML is only visible if the card is NOT open */}
      <Html
        position={[0, 1.5, 0]}
        center
        distanceFactor={15}
        zIndexRange={[100, 0]}
      >
        <div className={`transition-all duration-300 ${isCardOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
          <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-[#2c3e50]/10 flex flex-col items-center pointer-events-none">
             <span className="text-[10px] font-bold tracking-widest text-[#2c3e50] uppercase whitespace-nowrap">
               {projectData.title || projectData.name}
             </span>
             <span className="text-[8px] font-bold text-[#e74c3c] mt-0.5">
               WALK IN TO ENTER
             </span>
          </div>
        </div>
      </Html>
    </group>
  )
}
