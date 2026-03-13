'use client'

import { useState, useRef, useMemo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'

import Player from './Player'
import Map from './Map'
import CardOverlay from './CardOverlay'
import IntroScreen from './IntroScreen'

import { websiteProjects, dataProjects, skills, bossData } from '@/data/projects'
import { useAudioEffects } from '@/hooks/useAudioEffects'

/**
 * Game – master component.
 * Wraps Canvas + Physics, manages third-person cat state, and renders UI cards.
 */
export default function Game() {
  const [started, setStarted] = useState(false)
  
  // Track player position for zone detection (optional but good for future triggers)
  const playerPos = useRef([0, 2, 15])

  const handleEnter = () => {
    setStarted(true)
  }

  // Bot positions for Zone A (Websites)
  const webPositions = useMemo(() => [
    [-20, 0, 6],
    [-26, 0, 4],
    [-32, 0, 0],
    [-22, 0, -4],
  ], [])

  // Fragment positions for Zone B (Data)
  const dataPositions = useMemo(() => [
    [22, 0, 4],
    [28, 0, 0],
    [25, 0, -4],
  ], [])

  // Skill target positions for Zone C
  const skillPositions = useMemo(() => [
    [-12, 0, -32],
    [-8, 0, -32],
    [-4, 0, -32],
    [0, 0, -32],
    [4, 0, -32],
    [8, 0, -32],
    [12, 0, -32],
    [0, 0, -30],
  ], [])

  // The Game Scene layout has 4 specific houses.
  // We place a DoorTrigger at the exact world coordinates in front of each House's door.
  // The trigger handles opening the respective section's UI.

  if (!started) {
    return <IntroScreen onEnter={handleEnter} />
  }

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden bg-[#e0f2fe]">
        {/* 3D Canvas */}
        <Canvas
          shadows
          camera={{ fov: 60, near: 0.1, far: 200, position: [0, 5, 20] }}
          gl={{ antialias: true, alpha: false }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <color attach="background" args={['#e0f2fe']} />
          <fog attach="fog" args={['#e0f2fe', 10, 50]} />
          
          <Suspense fallback={null}>
            {/* Ghibli Lighting */}
            <ambientLight intensity={1.0} color="#d0e7ff" />
            <hemisphereLight skyColor="#e0f2fe" groundColor="#4ade80" intensity={0.6} />
            <directionalLight
              color="#fffdef"
              intensity={2}
              position={[50, 50, -20]}
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-camera-left={-50}
              shadow-camera-right={50}
              shadow-camera-top={50}
              shadow-camera-bottom={-50}
              shadow-camera-near={0.1}
              shadow-camera-far={200}
              shadow-bias={-0.0001}
            />
            <Environment preset="forest" />

            {/* Physics World */}
            <Physics gravity={[0, -15, 0]}>
              {/* Third Person Player */}
              <Player />

              {/* Map (Ground, Roads, Houses, Grass) */}
              <Map />
            </Physics>

            {/* Post-Processing */}
            <EffectComposer disableNormalPass>
              <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} height={300} intensity={0.8} />
              <ToneMapping adaptive={true} resolution={1024} />
            </EffectComposer>
          </Suspense>
        </Canvas>
        
        {/* Simple constant overlay HUD instructions */}
        <div className="absolute top-8 left-8 p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm pointer-events-none">
          <p className="text-[#2c3e50] font-bold text-sm">WASD to Move</p>
          <p className="text-[#2c3e50] font-bold text-sm mt-1">SPACE to Jump</p>
          <p className="text-[#5a6c7d] font-bold text-[10px] mt-2 tracking-widest uppercase">Jump on a button to view!</p>
        </div>
      </div>

      {/* Pop-up Card Overlay */}
      <CardOverlay />
    </>
  )
}
