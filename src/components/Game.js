'use client'

import { useState, useCallback, useRef, useMemo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'

import Player from './Player'
import Map from './Map'
import ButtonTrigger from './ButtonTrigger'
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
  const [activeCard, setActiveCard] = useState(null)
  
  // Track player position for zone detection (optional but good for future triggers)
  const playerPos = useRef([0, 2, 15])

  const handleEnter = useCallback(() => {
    setStarted(true)
  }, [])

  // When a physical button is stepped on
  const handleButtonPress = useCallback((projectData) => {
    setActiveCard(projectData)
  }, [])

  const handleCloseCard = useCallback(() => {
    setActiveCard(null)
  }, [])

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

  if (!started) {
    return <IntroScreen onEnter={handleEnter} />
  }

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden bg-[#87ceeb]">
        {/* 3D Canvas */}
        <Canvas
          shadows
          camera={{ fov: 60, near: 0.1, far: 200, position: [0, 5, 20] }}
          gl={{ antialias: true, alpha: false }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <color attach="background" args={['#87ceeb']} />
          <Suspense fallback={null}>
            {/* Ghibli Lighting */}
            <ambientLight intensity={1.0} color="#d0e7ff" />
            <hemisphereLight skyColor="#87ceeb" groundColor="#f0e68c" intensity={0.6} />
            <directionalLight
              color="#fffdef"
              intensity={2}
              position={[50, 50, 20]}
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-bias={-0.0005}
              shadow-camera-far={100}
              shadow-camera-left={-30}
              shadow-camera-right={30}
              shadow-camera-top={30}
              shadow-camera-bottom={-30}
            />
            <Environment preset="forest" />

            <Physics
              gravity={[0, -15, 0]} // Slightly lighter gravity for bouncy cat feeling
              tolerance={0.0001}
              iterations={20}
              broadphase="SAP"
            >
              {/* Third Person Player */}
              <Player />

              {/* Map */}
              <Map />

              {/* Zone A: Websites */}
              {websiteProjects.map((project, i) => (
                <ButtonTrigger
                  key={project.id}
                  projectData={project}
                  position={webPositions[i] || [-20 + i * 3, 0, 5]}
                  onPress={handleButtonPress}
                  color="#ff7b7b"
                />
              ))}

              {/* Zone B: Data Science */}
              {dataProjects.map((project, i) => (
                <ButtonTrigger
                  key={project.id}
                  projectData={project}
                  position={dataPositions[i] || [22 + i * 3, 0, 0]}
                  onPress={handleButtonPress}
                  color="#a8e6cf"
                />
              ))}

              {/* Zone C: Skills */}
              {skills.map((skill, i) => (
                <ButtonTrigger
                  key={skill.id}
                  projectData={{ ...skill, type: 'skill' }} // Add type so CardOverlay knows
                  position={skillPositions[i] || [(-skills.length / 2 + i) * 3.5, 0, -32]}
                  onPress={handleButtonPress}
                  color="#ffdac1"
                />
              ))}

              {/* Boss/VIP (Middle Area) */}
              <ButtonTrigger
                key={bossData.id}
                projectData={{ ...bossData, type: 'boss' }}
                position={[0, 1.25, -5]} // On the elevated platform
                onPress={handleButtonPress}
                color="#fdfbf7"
              />
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
      <CardOverlay activeCard={activeCard} onClose={handleCloseCard} />
    </>
  )
}
