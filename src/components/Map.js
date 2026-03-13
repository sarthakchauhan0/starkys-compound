'use client'

import { usePlane, useBox } from '@react-three/cannon'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

// ============================================
// GROUND
// ============================================
function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: { friction: 0.5 },
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.2} />
    </mesh>
  )
}

// ============================================
// WALL (reusable physics wall)
// ============================================
function Wall({ position, size, color = '#2a2a3e', emissive = '#000000', emissiveIntensity = 0 }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: size,
  }))

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.7}
        metalness={0.3}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  )
}

// ============================================
// CRATE (decorative + physics)
// ============================================
function Crate({ position, size = [1.2, 1.2, 1.2] }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: size,
  }))

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#3d2b1f" roughness={0.9} metalness={0.1} />
    </mesh>
  )
}

// ============================================
// ZONE SIGN
// ============================================
function ZoneSign({ position, text, color = '#00ffcc' }) {
  return (
    <group position={position}>
      {/* Sign post */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.05, 3, 0.05]} />
        <meshStandardMaterial color="#333344" metalness={0.5} />
      </mesh>
      {/* Sign board */}
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[4, 0.8, 0.1]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Glowing border */}
      <mesh position={[0, 3.2, 0.06]}>
        <boxGeometry args={[4.1, 0.9, 0.01]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
      <Text
        position={[0, 3.2, 0.12]}
        fontSize={0.35}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  )
}

// ============================================
// BARREL (decorative)
// ============================================
function Barrel({ position }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: [0.6, 1.2, 0.6],
  }))

  return (
    <mesh ref={ref} castShadow>
      <cylinderGeometry args={[0.3, 0.35, 1.2, 12]} />
      <meshStandardMaterial color="#2d4a22" roughness={0.8} metalness={0.4} />
    </mesh>
  )
}

// ============================================
// RAMP
// ============================================
function Ramp({ position, rotation = [0, 0, 0] }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    rotation,
    args: [3, 0.3, 4],
  }))

  return (
    <mesh ref={ref} castShadow receiveShadow rotation={rotation}>
      <boxGeometry args={[3, 0.3, 4]} />
      <meshStandardMaterial color="#333355" roughness={0.6} metalness={0.4} />
    </mesh>
  )
}

// ============================================
// LANE DIVIDER (for shooting range)
// ============================================
function LaneDivider({ position }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: [0.1, 2, 8],
  }))

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[0.1, 2, 8]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.5} metalness={0.5} />
    </mesh>
  )
}

// ============================================
// MAIN MAP COMPONENT
// ============================================
export default function Map() {
  return (
    <group>
      {/* Ground */}
      <Ground />

      {/* Ambient + directional lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[20, 30, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#0a0a1a', 10, 60]} />

      {/* Sky dome color */}
      <color attach="background" args={['#0a0a1a']} />

      {/* === BOUNDARY WALLS === */}
      {/* North */}
      <Wall position={[0, 3, -40]} size={[100, 6, 1]} color="#1a1a2e" />
      {/* South */}
      <Wall position={[0, 3, 25]} size={[100, 6, 1]} color="#1a1a2e" />
      {/* East */}
      <Wall position={[40, 3, -7.5]} size={[1, 6, 66]} color="#1a1a2e" />
      {/* West */}
      <Wall position={[-40, 3, -7.5]} size={[1, 6, 66]} color="#1a1a2e" />

      {/* ============================================ */}
      {/* ZONE A: Bot Gallery (Left side, -x) */}
      {/* ============================================ */}
      <ZoneSign position={[-20, 0, 10]} text="▸ ZONE A: BOT GALLERY" color="#00ff88" />

      {/* Zone A walls / corridors */}
      <Wall position={[-15, 2, 0]} size={[0.5, 4, 20]} color="#222240" />
      <Wall position={[-30, 2, -8]} size={[12, 4, 0.5]} color="#222240" />

      {/* Zone A crates */}
      <Crate position={[-22, 0.6, 5]} />
      <Crate position={[-22, 0.6, 3.5]} size={[1, 1, 1]} />
      <Crate position={[-25, 0.6, -2]} />
      <Crate position={[-28, 0.6, 8]} size={[1.5, 1, 1.5]} />
      <Crate position={[-35, 0.6, 2]} />

      <Barrel position={[-18, 0.6, -3]} />
      <Barrel position={[-32, 0.6, 6]} />

      {/* ============================================ */}
      {/* ZONE B: Data Lab (Right side, +x) */}
      {/* ============================================ */}
      <ZoneSign position={[20, 0, 10]} text="▸ ZONE B: DATA LAB" color="#ff00ff" />

      {/* Zone B enclosure walls */}
      <Wall position={[15, 2, 0]} size={[0.5, 4, 20]} color="#1a0a2e" emissive="#330033" emissiveIntensity={0.15} />
      <Wall position={[30, 2, -8]} size={[12, 4, 0.5]} color="#1a0a2e" emissive="#330033" emissiveIntensity={0.15} />

      {/* Zone B ambient glow lights */}
      <pointLight position={[22, 3, 0]} color="#ff00ff" intensity={0.5} distance={12} />
      <pointLight position={[28, 3, -5]} color="#00ffff" intensity={0.3} distance={10} />
      <pointLight position={[25, 2, 5]} color="#ff00ff" intensity={0.4} distance={8} />

      {/* ============================================ */}
      {/* ZONE C: Skills Range (Back / -z) */}
      {/* ============================================ */}
      <ZoneSign position={[0, 0, -18]} text="▸ ZONE C: SKILLS RANGE" color="#ffcc00" />

      {/* Range back wall */}
      <Wall position={[0, 2, -35]} size={[30, 4, 0.5]} color="#2a2a1e" />

      {/* Lane dividers */}
      <LaneDivider position={[-10, 1, -30]} />
      <LaneDivider position={[-5, 1, -30]} />
      <LaneDivider position={[0, 1, -30]} />
      <LaneDivider position={[5, 1, -30]} />
      <LaneDivider position={[10, 1, -30]} />

      {/* Range counter */}
      <Wall position={[0, 0.5, -24]} size={[22, 1, 0.5]} color="#333344" />

      {/* ============================================ */}
      {/* BOSS AREA: Center elevated platform */}
      {/* ============================================ */}
      {/* Platform */}
      <Wall position={[0, 0.25, -5]} size={[6, 0.5, 6]} color="#1a1a2e" emissive="#ffd700" emissiveIntensity={0.08} />
      {/* Ramp up to platform */}
      <Ramp position={[0, 0.15, -1.5]} rotation={[-0.12, 0, 0]} />

      {/* Boss area accent lights */}
      <pointLight position={[0, 4, -5]} color="#ffd700" intensity={0.6} distance={10} />
      <pointLight position={[-2, 2, -5]} color="#ff8c00" intensity={0.3} distance={6} />
      <pointLight position={[2, 2, -5]} color="#ff8c00" intensity={0.3} distance={6} />

      {/* === CENTRAL STRUCTURES === */}
      {/* Some mid-map cover */}
      <Crate position={[-5, 0.6, 5]} />
      <Crate position={[5, 0.6, 5]} />
      <Crate position={[-8, 0.6, 0]} size={[2, 1.5, 1]} />
      <Crate position={[8, 0.6, 0]} size={[2, 1.5, 1]} />

      <Barrel position={[-3, 0.6, 10]} />
      <Barrel position={[3, 0.6, 10]} />
      <Barrel position={[12, 0.6, 10]} />

      {/* Spawn area walls (behind player start) */}
      <Wall position={[-4, 2, 20]} size={[8, 4, 0.5]} color="#222240" />
      <Wall position={[4, 2, 20]} size={[8, 4, 0.5]} color="#222240" />

      {/* Grid lines on floor (decorative) */}
      <gridHelper args={[100, 100, '#111122', '#111122']} position={[0, 0.01, 0]} />
    </group>
  )
}
