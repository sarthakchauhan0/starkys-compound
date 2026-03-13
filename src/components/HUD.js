'use client'

import { useState, useEffect } from 'react'

/**
 * HUD overlay – crosshair, energy bar, project counter, zone indicator.
 * Positioned absolutely over the canvas with Tailwind.
 */
export default function HUD({ scannedCount, totalCount, currentZone, isFiring }) {
  const [crosshairPulse, setCrosshairPulse] = useState(false)

  useEffect(() => {
    if (isFiring) {
      setCrosshairPulse(true)
      const timer = setTimeout(() => setCrosshairPulse(false), 150)
      return () => clearTimeout(timer)
    }
  }, [isFiring])

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* ===== CROSSHAIR ===== */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          className={`transition-transform duration-100 ${crosshairPulse ? 'scale-125' : 'scale-100'}`}
        >
          {/* Outer segments */}
          <line x1="20" y1="2" x2="20" y2="12" stroke="#00ffcc" strokeWidth="1.5" opacity="0.8" />
          <line x1="20" y1="28" x2="20" y2="38" stroke="#00ffcc" strokeWidth="1.5" opacity="0.8" />
          <line x1="2" y1="20" x2="12" y2="20" stroke="#00ffcc" strokeWidth="1.5" opacity="0.8" />
          <line x1="28" y1="20" x2="38" y2="20" stroke="#00ffcc" strokeWidth="1.5" opacity="0.8" />
          {/* Center dot */}
          <circle cx="20" cy="20" r="1.5" fill={crosshairPulse ? '#ff4444' : '#00ffcc'} />
        </svg>
      </div>

      {/* ===== TOP LEFT: Zone Indicator ===== */}
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-green-400 text-xs tracking-[0.3em] uppercase font-mono opacity-80">
          {currentZone || 'THE COMPOUND'}
        </span>
      </div>

      {/* ===== TOP RIGHT: Mini Compass ===== */}
      <div className="absolute top-6 right-6">
        <div className="border border-cyan-500/30 rounded px-3 py-1.5 backdrop-blur-sm bg-black/20">
          <span className="text-cyan-400 text-[10px] tracking-[0.2em] font-mono">
            PORTFOLIO // STARKY
          </span>
        </div>
      </div>

      {/* ===== BOTTOM LEFT: Energy Bar ===== */}
      <div className="absolute bottom-8 left-8">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-cyan-400/60 tracking-[0.2em] font-mono uppercase">
            Energy
          </span>
          <div className="w-44 h-1.5 bg-gray-800/60 rounded-full overflow-hidden border border-cyan-500/20">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-green-400 rounded-full transition-all duration-500"
              style={{ width: '100%' }}
            />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[10px] text-green-400/80 font-mono">OPTIMAL</span>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM RIGHT: Ammo / Project Counter ===== */}
      <div className="absolute bottom-8 right-8 text-right">
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] text-amber-400/60 tracking-[0.2em] font-mono uppercase">
            Projects Scanned
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-amber-400 font-mono tabular-nums">
              {String(scannedCount).padStart(2, '0')}
            </span>
            <span className="text-sm text-amber-400/40 font-mono">/</span>
            <span className="text-sm text-amber-400/40 font-mono">
              {String(totalCount).padStart(2, '0')}
            </span>
          </div>
          <div className="w-32 h-0.5 bg-gray-800/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700"
              style={{ width: `${totalCount > 0 ? (scannedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* ===== BOTTOM CENTER: Quick Controls Hint ===== */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="text-[9px] text-white/20 font-mono tracking-widest">
          WASD MOVE &nbsp;•&nbsp; CLICK SCAN &nbsp;•&nbsp; ESC MENU
        </span>
      </div>
    </div>
  )
}
