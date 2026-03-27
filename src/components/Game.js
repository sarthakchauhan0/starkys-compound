'use client'

import { useState, useRef, useMemo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping, Vignette } from '@react-three/postprocessing'

import Player from './Player'
import Map from './Map'
import CardOverlay from './CardOverlay'
import IntroScreen from './IntroScreen'
import SceneLights from './SceneLights'
import HUD from './HUD'
import useUIStore from '@/store/useUIStore'

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
            <SceneLights />
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
              <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
          </Suspense>
        </Canvas>
        
        {/* HUD Overlay (Crosshair, Joysticks, Info) */}
        <HUD 
          scannedCount={0} 
          totalCount={0} 
          currentZone="THE COMPOUND" 
          isFiring={false} 
        />
      </div>

      {/* Pop-up Card Overlay */}
      <CardOverlay />
    </>
  )
}
