'use client'

import { useState, useRef, useEffect } from 'react'

/**
 * A reusable glassmorphic joystick for touch devices.
 * Uses PointerEvents for broad compatibility.
 */
export default function Joystick({ onMove, label }) {
  const [dragging, setDragging] = useState(false)
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 })
  const [radius, setRadius] = useState(40) // Default until measured
  const containerRef = useRef(null)
  const pointerId = useRef(null)

  // Measure container and update radius dynamically
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        // Radius is ~40% of container width to leave comfortable padding
        setRadius(rect.width * 0.4)
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const handleStart = (e) => {
    if (pointerId.current !== null) return
    setDragging(true)
    pointerId.current = e.pointerId
    updatePosition(e)
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
    
    // Clamp movement within the calculated radius
    if (distance > radius) {
      const ratio = radius / distance
      dx *= ratio
      dy *= ratio
    }

    setKnobPos({ x: dx, y: dy })
    onMove(dx / radius, -dy / radius)
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
        className="relative rounded-full glass border border-white/40 backdrop-blur-md shadow-xl flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        onPointerDown={handleStart}
        onPointerMove={handleMove}
        onPointerUp={handleEnd}
        onPointerCancel={handleEnd}
        style={{ 
          touchAction: 'none',
          // Responsive size: ~15-18vw but clamped between 80px and 140px
          width: 'clamp(80px, 18vw, 140px)', 
          height: 'clamp(80px, 18vw, 140px)'
        }}
      >
        {/* Inner Knob */}
        <div 
          className="absolute rounded-full bg-white/50 border border-white/70 shadow-2xl transition-transform duration-75 ease-out flex items-center justify-center pointer-events-none"
          style={{ 
            width: '45%', 
            height: '45%',
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        >
           <div className="w-[60%] h-[60%] rounded-full bg-white/30 blur-[1px]" />
        </div>
        
        {/* Visual Guides (Center Cross) */}
        <div className="absolute w-full h-[1px] bg-white/10 pointer-events-none" />
        <div className="absolute h-full w-[1px] bg-white/10 pointer-events-none" />
      </div>
      {label && <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/70 drop-shadow-md">{label}</span>}
    </div>
  )
}
