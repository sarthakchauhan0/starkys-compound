'use client'

import { useState, useCallback, useRef, useMemo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'

import Player from './Player'
import Weapon from './Weapon'
import Map from './Map'
import TargetBot from './TargetBot'
import DataFragment from './DataFragment'
import SkillTarget from './SkillTarget'
import VIPBot from './VIPBot'
import HUD from './HUD'
import PortfolioUI from './PortfolioUI'
import MissionBriefing from './MissionBriefing'
import IntroScreen from './IntroScreen'

import { websiteProjects, dataProjects, skills, bossData } from '@/data/projects'

/**
 * Game – master component.
 * Wraps Canvas + Physics, manages all game state, and renders UI overlays.
 */
export default function Game() {
  // Game state
  const [started, setStarted] = useState(false)
  const [hitTargets, setHitTargets] = useState(new Set())
  const [activeProject, setActiveProject] = useState(null)
  const [activeTargetType, setActiveTargetType] = useState(null)
  const [showBriefing, setShowBriefing] = useState(false)
  const [isFiring, setIsFiring] = useState(false)
  const [currentZone, setCurrentZone] = useState('THE COMPOUND')
  const playerPos = useRef([0, 2, 15])

  // All target data for counting
  const totalTargets = websiteProjects.length + dataProjects.length + skills.length + 1 // +1 for boss

  // Handle entering the game
  const handleEnter = useCallback(() => {
    setStarted(true)
  }, [])

  // Handle shooting (visual feedback)
  const handleShoot = useCallback(() => {
    setIsFiring(true)
    setTimeout(() => setIsFiring(false), 150)
  }, [])

  // Handle hitting a target
  const handleHit = useCallback((targetId, targetType) => {
    if (hitTargets.has(targetId)) {
      // Already hit – re-open the project UI
      if (targetType === 'boss') {
        setShowBriefing(true)
      } else {
        const allData = [...websiteProjects, ...dataProjects, ...skills]
        const data = allData.find((d) => d.id === targetId)
        if (data) {
          setActiveProject(data)
          setActiveTargetType(targetType)
        }
      }
      return
    }

    setHitTargets((prev) => new Set([...prev, targetId]))

    if (targetType === 'boss') {
      setShowBriefing(true)
    } else {
      const allData = [...websiteProjects, ...dataProjects, ...skills]
      const data = allData.find((d) => d.id === targetId)
      if (data) {
        setActiveProject(data)
        setActiveTargetType(targetType)
      }
    }
  }, [hitTargets])

  // Close project overlay
  const handleCloseProject = useCallback(() => {
    setActiveProject(null)
    setActiveTargetType(null)
  }, [])

  // Track player position for zone detection
  const setPlayerPosition = useCallback((pos) => {
    playerPos.current = pos
    // Simple zone detection based on position
    const x = pos[0]
    const z = pos[2]

    if (x < -14 && z < 12 && z > -10) setCurrentZone('ZONE A: BOT GALLERY')
    else if (x > 14 && z < 12 && z > -10) setCurrentZone('ZONE B: DATA LAB')
    else if (z < -20) setCurrentZone('ZONE C: SKILLS RANGE')
    else if (Math.abs(x) < 4 && z > -8 && z < -2) setCurrentZone('BOSS AREA')
    else setCurrentZone('THE COMPOUND')
  }, [])

  // Bot positions for Zone A
  const botPositions = useMemo(() => [
    [-20, 0, 6],
    [-26, 0, 4],
    [-32, 0, 0],
    [-22, 0, -4],
  ], [])

  // Fragment positions for Zone B
  const fragmentPositions = useMemo(() => [
    [22, 2, 4],
    [28, 2.5, 0],
    [25, 3, -4],
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
    <div className="relative w-screen h-screen overflow-hidden bg-black" style={{ cursor: 'none' }}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 200, position: [0, 2, 15] }}
        gl={{ antialias: true, alpha: false }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          <Physics
          gravity={[0, -20, 0]}
          tolerance={0.0001}
          iterations={20}
          broadphase="SAP"
        >
          {/* Player */}
          <Player
            onShoot={handleShoot}
            onHit={handleHit}
            setPlayerPosition={setPlayerPosition}
          />

          {/* Map */}
          <Map />

          {/* Zone A: Training Bots */}
          {websiteProjects.map((project, i) => (
            <TargetBot
              key={project.id}
              projectData={project}
              position={botPositions[i] || [-20 + i * 3, 0, 5]}
              isHit={hitTargets.has(project.id)}
            />
          ))}

          {/* Zone B: Data Fragments */}
          {dataProjects.map((project, i) => (
            <DataFragment
              key={project.id}
              projectData={project}
              position={fragmentPositions[i] || [22 + i * 3, 2, 0]}
              isHit={hitTargets.has(project.id)}
            />
          ))}

          {/* Zone C: Skill Targets */}
          {skills.map((skill, i) => (
            <SkillTarget
              key={skill.id}
              skillData={skill}
              position={skillPositions[i] || [(-skills.length / 2 + i) * 3.5, 0, -32]}
              isHit={hitTargets.has(skill.id)}
            />
          ))}

          {/* Boss: VIP Bot */}
          <VIPBot
            bossData={bossData}
            position={[0, 0.5, -5]}
            isHit={hitTargets.has(bossData.id)}
          />
        </Physics>

        {/* Weapon overlay (rendered in 3D but as HUD layer) */}
        <Weapon isFiring={isFiring} />
        </Suspense>
      </Canvas>

      {/* HUD Overlay */}
      <HUD
        scannedCount={hitTargets.size}
        totalCount={totalTargets}
        currentZone={currentZone}
        isFiring={isFiring}
      />

      {/* Project detail modal */}
      {activeProject && (
        <PortfolioUI
          projectData={activeProject}
          targetType={activeTargetType}
          onClose={handleCloseProject}
        />
      )}

      {/* Boss mission briefing */}
      {showBriefing && (
        <MissionBriefing
          bossData={bossData}
          onClose={() => setShowBriefing(false)}
        />
      )}
    </div>
  )
}
