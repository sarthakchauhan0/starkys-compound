'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SceneLights() {
  const sunRef = useRef()
  const moonRef = useRef()
  const hemiLightRef = useRef()
  const ambientLightRef = useRef()

  // Track the local time (in hours decimal, 0 - 24)
  const [localTime, setLocalTime] = useState(12) // Default noon

  useEffect(() => {
    // Function to calculate exact decimal time
    const updateTime = () => {
      const now = new Date()
      const decimalTime = now.getHours() + now.getMinutes() / 60
      setLocalTime(decimalTime)
    }

    // Initial check
    updateTime()

    // Check once every minute (60,000ms)
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  // Colors for specific times of day
  const palettes = useMemo(() => ({
    dawn: {
      sky: new THREE.Color('#ffb6c1'), // Soft pink
      ground: new THREE.Color('#4ade80'),
      sun: new THREE.Color('#ffd700'), // Gold
      ambient: new THREE.Color('#ffb6c1')
    },
    day: {
      sky: new THREE.Color('#87CEEB'), // Ghibli Blue
      ground: new THREE.Color('#4ade80'),
      sun: new THREE.Color('#fffdef'),
      ambient: new THREE.Color('#d0e7ff')
    },
    sunset: {
      sky: new THREE.Color('#ff4500'), // Deep orange
      ground: new THREE.Color('#d97706'),
      sun: new THREE.Color('#ffdf00'),
      ambient: new THREE.Color('#ff8c00')
    },
    night: {
      sky: new THREE.Color('#0a0a2a'), // Navy/Black
      ground: new THREE.Color('#050510'),
      sun: new THREE.Color('#000000'),
      ambient: new THREE.Color('#1e1b4b')
    }
  }), [])

  // Calculate targets based on current localTime
  const targets = useMemo(() => {
    let p;
    // 06:00 - 09:00: Dawn
    if (localTime >= 6 && localTime < 10) p = palettes.dawn
    // 10:00 - 16:00: Day
    else if (localTime >= 10 && localTime < 17) p = palettes.day
    // 17:00 - 20:00: Sunset
    else if (localTime >= 17 && localTime < 21) p = palettes.sunset
    // 21:00 - 05:00: Night
    else p = palettes.night

    // Calculate Sun Angle: 06:00 is sunrise (angle 0), 12:00 is noon (angle PI/2), 18:00 is sunset (angle PI)
    const sunAngle = ((localTime - 6) / 24) * Math.PI * 2
    const distance = 100
    
    // Sun Pos
    const sunX = -Math.cos(sunAngle) * distance
    const sunY = Math.sin(sunAngle) * distance
    const sunZ = -20
    
    // Moon Pos (directly opposite of sun for realism)
    const moonAngle = sunAngle + Math.PI
    const moonX = -Math.cos(moonAngle) * distance
    const moonY = Math.sin(moonAngle) * distance
    const moonZ = 20

    // Sun intensity fades when close to horizon, completely off when Y < 0
    let sunIntensity = 0
    if (sunY > 0) {
      sunIntensity = Math.min(2.0, sunY * 0.05) // Peaks at 2.0 when high up
    }

    // Moon intensity fades in when moon is up and sun is down
    let moonIntensity = 0
    if (moonY > 0 && sunY <= 0) {
      moonIntensity = Math.min(0.5, moonY * 0.01) // Dim, cool moon
    }

    return {
      colors: p,
      sunPos: [sunX, sunY, sunZ],
      moonPos: [moonX, moonY, moonZ],
      sunIntensity,
      moonIntensity
    }
  }, [localTime, palettes])

  // Very slow, imperceptible transition over time
  // Even if they leave the tab open, the 1-minute updates will slowly pull the lerp forward.
  useFrame((state, delta) => {
    const LERP_SPEED = 0.5 * delta;

    if (hemiLightRef.current && ambientLightRef.current && sunRef.current && moonRef.current) {
      // Lerp Colors
      hemiLightRef.current.color.lerp(targets.colors.sky, LERP_SPEED)
      hemiLightRef.current.groundColor.lerp(targets.colors.ground, LERP_SPEED)
      ambientLightRef.current.color.lerp(targets.colors.ambient, LERP_SPEED)
      sunRef.current.color.lerp(targets.colors.sun, LERP_SPEED)

      // Lerp Transforms / Intensities
      sunRef.current.position.lerp(new THREE.Vector3(...targets.sunPos), LERP_SPEED)
      moonRef.current.position.lerp(new THREE.Vector3(...targets.moonPos), LERP_SPEED)
      
      sunRef.current.intensity = THREE.MathUtils.lerp(sunRef.current.intensity, targets.sunIntensity, LERP_SPEED)
      moonRef.current.intensity = THREE.MathUtils.lerp(moonRef.current.intensity, targets.moonIntensity, LERP_SPEED)
    }

    // Sync Scene Background & Fog
    if (state.scene.background && hemiLightRef.current) {
      state.scene.background.lerp(targets.colors.sky, LERP_SPEED)
      if (state.scene.fog) {
        state.scene.fog.color.lerp(targets.colors.sky, LERP_SPEED)
      }
    } else if (hemiLightRef.current) {
      // Initial set
      state.scene.background = hemiLightRef.current.color.clone()
      if (state.scene.fog) state.scene.fog.color.copy(hemiLightRef.current.color)
    }
  })

  // Provide initial color instantly (avoiding a white flash before first frame)
  const initialFogColor = targets.colors.sky.getStyle()

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.6} color={initialFogColor} />
      
      <hemisphereLight 
        ref={hemiLightRef} 
        skyColor={initialFogColor} 
        groundColor="#4ade80" 
        intensity={0.6} 
      />
      
      {/* THE SUN */}
      <directionalLight
        ref={sunRef}
        color="#fffdef"
        intensity={targets.sunIntensity}
        position={targets.sunPos}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-camera-near={0.1}
        shadow-camera-far={250}
        shadow-bias={-0.0002}
      />

      {/* THE MOON (Doesn't cast harsh shadows to save performance and look softer, just provides cool light) */}
      <directionalLight
        ref={moonRef}
        color="#a5b4fc"
        intensity={targets.moonIntensity}
        position={targets.moonPos}
      />
    </>
  )
}
