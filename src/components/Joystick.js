'use client'

import { useState, useRef, useEffect } from 'react'

export default function Joystick({ onMove, label, side = 'left' }) {
  const [dragging, setDragging] = useState(false)
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const touchId = useRef(null)

  const RADIUS = 40 // Max movement radius
  const CENTER = 64 // Half of w-32 (32 * 4 / 2 = 64px)

  const handleStart = (e) => {
    setDragging(true)
    const touch = e.touches ? e.touches[0] : e
    touchId.current = touch.identifier ?? null
    handleMove(e)
  }

  const handleMove = (e) => {
    if (!dragging && e.type !== 'touchstart' && e.type !== 'pointerdown') return

    const event = e.touches ? 
      Array.from(e.touches).find(t => t.identifier === touchId.current) || e.touches[0] : 
      e

    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    let dx = event.clientX - centerX
    let dy = event.clientY - centerY

    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > RADIUS) {
      const ratio = RADIUS / distance
      dx *= ratio
      dy *= ratio
    }

    setKnobPos({ x: dx, y: dy })
    onMove(dx / RADIUS, -dy / RADIUS) // Invert Y for standard coordinate systems
  }

  const handleEnd = () => {
    setDragging(false)
    setKnobPos({ x: 0, y: 0 })
    touchId.current = null
    onMove(0, 0)
  }

  useEffect(() => {
    if (dragging) {
      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleEnd)
      return () => {
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleEnd)
      }
    }
  }, [dragging])

  return (
    <div className={`flex flex-col items-center gap-2 touch-none select-none`}>
      <div 
        ref={containerRef}
        className="relative w-32 h-32 rounded-full glass border border-white/30 backdrop-blur-md shadow-lg flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        onPointerDown={handleStart}
        style={{ touchAction: 'none' }}
      >
        {/* Inner Knob */}
        <div 
          className="absolute w-14 h-14 rounded-full bg-white/40 border border-white/60 shadow-md transition-transform duration-75 ease-out flex items-center justify-center"
          style={{ 
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        >
           <div className="w-8 h-8 rounded-full bg-white/20 blur-[1px]" />
        </div>
        
        {/* Visual Guides (Center Cross) */}
        <div className="absolute w-full h-[1px] bg-white/5 pointer-events-none" />
        <div className="absolute h-full w-[1px] bg-white/5 pointer-events-none" />
      </div>
      {label && <span className="text-[10px] uppercase tracking-widest font-bold text-white/50">{label}</span>}
    </div>
  )
}
