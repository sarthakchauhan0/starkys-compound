'use client'

import { useState, useRef, useEffect } from 'react'

/**
 * A reusable glassmorphic joystick for touch devices.
 * Uses PointerEvents for broad compatibility.
 */
export default function Joystick({ onMove, label }) {
  const [dragging, setDragging] = useState(false)
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const pointerId = useRef(null)

  const RADIUS = 40 // Max movement radius

  const handleStart = (e) => {
    // Only handle primary pointer (first touch or mouse left click)
    if (pointerId.current !== null) return
    
    setDragging(true)
    pointerId.current = e.pointerId
    
    // Immediate update for better responsiveness
    updatePosition(e)
    
    // Capture pointer to receive events even outside the element
    e.target.setPointerCapture(e.pointerId)
  }

  const updatePosition = (e) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    let dx = e.clientX - centerX
    let dy = e.clientY - centerY

    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > RADIUS) {
      const ratio = RADIUS / distance
      dx *= ratio
      dy *= ratio
    }

    setKnobPos({ x: dx, y: dy })
    onMove(dx / RADIUS, -dy / RADIUS) // Invert Y for standard 3D forward/backward
  }

  const handleMove = (e) => {
    if (dragging && e.pointerId === pointerId.current) {
      updatePosition(e)
    }
  }

  const handleEnd = (e) => {
    if (e.pointerId === pointerId.current) {
      setDragging(false)
      setKnobPos({ x: 0, y: 0 })
      pointerId.current = null
      onMove(0, 0)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 touch-none select-none pointer-events-auto">
      <div 
        ref={containerRef}
        className="relative w-32 h-32 rounded-full glass border border-white/40 backdrop-blur-md shadow-xl flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        onPointerDown={handleStart}
        onPointerMove={handleMove}
        onPointerUp={handleEnd}
        onPointerCancel={handleEnd}
        style={{ touchAction: 'none' }}
      >
        {/* Inner Knob */}
        <div 
          className="absolute w-14 h-14 rounded-full bg-white/50 border border-white/70 shadow-2xl transition-transform duration-75 ease-out flex items-center justify-center pointer-events-none"
          style={{ 
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        >
           <div className="w-8 h-8 rounded-full bg-white/30 blur-[1px]" />
        </div>
        
        {/* Visual Guides (Center Cross) */}
        <div className="absolute w-full h-[1px] bg-white/10 pointer-events-none" />
        <div className="absolute h-full w-[1px] bg-white/10 pointer-events-none" />
      </div>
      {label && <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70 drop-shadow-md">{label}</span>}
    </div>
  )
}
