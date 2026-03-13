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
        background: 'radial-gradient(ellipse at center, rgba(10,10,26,0.95) 0%, rgba(0,0,0,0.99) 100%)',
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
      <div className="mb-12 text-center relative">
        <div className="text-[10px] tracking-[0.5em] text-cyan-500/40 uppercase font-mono mb-4">
          ⊞ SYSTEM BOOT SEQUENCE COMPLETE
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-3 tracking-tight">
          THE{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
            COMPOUND
          </span>
        </h1>
        <p className="text-gray-500 text-sm font-mono tracking-[0.2em]">
          STARKY&apos;S PORTFOLIO // v2.0
        </p>
      </div>

      {/* Enter prompt */}
      <div
        className={`mb-16 transition-all duration-500 ${
          pulse ? 'opacity-100 scale-105' : 'opacity-60 scale-100'
        }`}
      >
        <div className="border border-cyan-500/40 rounded-lg px-8 py-4 backdrop-blur-sm bg-cyan-500/5">
          <span className="text-cyan-400 text-lg font-mono tracking-[0.2em]">
            ▸ CLICK TO ENTER THE COMPOUND
          </span>
        </div>
      </div>

      {/* Controls guide */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-xl">
        {[
          { key: 'W A S D', action: 'MOVE' },
          { key: 'MOUSE', action: 'LOOK' },
          { key: 'CLICK', action: 'SCAN' },
          { key: 'ESC', action: 'MENU' },
        ].map((control) => (
          <div key={control.key} className="text-center">
            <div className="border border-gray-700 rounded px-3 py-2 mb-1.5 bg-gray-800/30">
              <span className="text-gray-300 text-xs font-mono font-bold">{control.key}</span>
            </div>
            <span className="text-gray-600 text-[10px] font-mono tracking-[0.2em]">
              {control.action}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-8 text-center">
        <p className="text-gray-700 text-[10px] font-mono tracking-[0.3em]">
          BUILT WITH NEXT.JS • REACT THREE FIBER • CANNON.JS
        </p>
      </div>
    </div>
  )
}
