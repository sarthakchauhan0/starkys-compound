'use client'

import { useState, useEffect } from 'react'

/**
 * IntroScreen – full-screen overlay before pointer lock.
 * Shows "Click to Enter" prompt and controls guide.
 */
export default function IntroScreen({ onEnter }) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer select-none"
      onClick={onEnter}
      style={{
        background: 'radial-gradient(ellipse at center, rgba(255,253,242,0.85) 0%, rgba(135,206,235,0.4) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,204,0.15) 2px, rgba(0,255,204,0.15) 4px)',
        }}
      />

      {/* Logo / Title */}
      <div className="mb-12 text-center relative px-6 py-8">
        <div className="text-[12px] tracking-[0.3em] text-[#87ceeb] font-bold uppercase mb-4">
          ✿ WELCOME TO
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-[#2c3e50] mb-4 tracking-tight">
          THE{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#87ceeb] to-[#a8e6cf]">
            COMPOUND
          </span>
        </h1>
        <p className="text-[#5a6c7d] text-base tracking-[0.1em]">
          STARKY&apos;S PORTFOLIO // A SLICE OF LIFE
        </p>
      </div>

      {/* Enter prompt */}
      <div
        className={`mb-16 transition-all duration-500 ${
          pulse ? 'opacity-100 scale-105' : 'opacity-60 scale-100'
        }`}
      >
        <div className="border-2 border-[#87ceeb]/40 rounded-2xl px-12 py-6 glass shadow-xl">
          <span className="text-[#2c3e50] font-bold text-xl tracking-[0.1em]">
            ▸ CLICK TO START YOUR JOURNEY
          </span>
        </div>
      </div>

      {/* Controls guide */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl px-4">
        {[
          { key: 'W A S D', action: 'WALK' },
          { key: 'MOUSE', action: 'LOOK' },
          { key: 'CLICK', action: 'INTERACT' },
          { key: 'ESC', action: 'MENU' },
        ].map((control) => (
          <div key={control.key} className="text-center bg-white/40 p-4 rounded-xl shadow-sm border border-white/50 backdrop-blur-sm">
            <div className="rounded px-4 py-2 mb-2 bg-[#f0e68c]/30 border border-[#f0e68c]/60">
              <span className="text-[#2c3e50] text-sm font-bold">{control.key}</span>
            </div>
            <span className="text-[#5a6c7d] text-[12px] font-bold tracking-[0.1em]">
              {control.action}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-8 text-center">
        <p className="text-[#7f8c8d] text-[12px] tracking-[0.1em] font-medium">
          BUILT WITH NEXT.JS • REACT THREE FIBER
        </p>
      </div>
    </div>
  )
}
