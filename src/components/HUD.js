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
          <line x1="20" y1="4" x2="20" y2="10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" filter="drop-shadow(0px 0px 2px rgba(0,0,0,0.3))" />
          <line x1="20" y1="30" x2="20" y2="36" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" filter="drop-shadow(0px 0px 2px rgba(0,0,0,0.3))" />
          <line x1="4" y1="20" x2="10" y2="20" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" filter="drop-shadow(0px 0px 2px rgba(0,0,0,0.3))" />
          <line x1="30" y1="20" x2="36" y2="20" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" filter="drop-shadow(0px 0px 2px rgba(0,0,0,0.3))" />
          {/* Center dot */}
          <circle cx="20" cy="20" r="2.5" fill={crosshairPulse ? '#ff9a9a' : '#fff'} filter="drop-shadow(0px 0px 3px rgba(0,0,0,0.4))" />
        </svg>
      </div>

      {/* ===== TOP LEFT: Zone Indicator ===== */}
      <div className="absolute top-8 left-8 flex items-center gap-4 glass px-5 py-3 rounded-2xl shadow-sm border border-white/60">
        <div className="w-3 h-3 rounded-full bg-[#a8e6cf] animate-pulse shadow-[0_0_8px_rgba(168,230,207,0.8)]" />
        <span className="text-[#2c3e50] text-sm tracking-[0.1em] font-bold">
          {currentZone || 'THE GARDEN'}
        </span>
      </div>

      {/* ===== TOP RIGHT: Mini Compass ===== */}
      <div className="absolute top-8 right-8">
        <div className="glass rounded-2xl px-5 py-3 border border-white/60 shadow-sm">
          <span className="text-[#2c3e50] text-sm tracking-[0.1em] font-bold">
            PORTFOLIO // STARKY
          </span>
        </div>
      </div>

      {/* ===== BOTTOM LEFT: Energy Bar ===== */}
      <div className="absolute bottom-10 left-10 glass p-5 rounded-2xl border border-white/60 shadow-md">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-[#5a6c7d] tracking-[0.1em] font-bold uppercase">
            Stamina
          </span>
          <div className="w-48 h-2.5 bg-black/10 rounded-full overflow-hidden border border-white/40">
            <div
              className="h-full bg-gradient-to-r from-[#a8e6cf] to-[#dcedc1] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(168,230,207,0.5)]"
              style={{ width: '100%' }}
            />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-[#87ceeb]" />
            <span className="text-xs text-[#2c3e50] font-bold">FEELING GOOD</span>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM RIGHT: Ammo / Project Counter ===== */}
      <div className="absolute bottom-10 right-10 text-right glass p-5 rounded-2xl border border-white/60 shadow-md">
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs text-[#5a6c7d] tracking-[0.1em] font-bold uppercase">
            Discoveries
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-[#ffb7b2]">
              {String(scannedCount).padStart(2, '0')}
            </span>
            <span className="text-lg text-[#5a6c7d] px-1">/</span>
            <span className="text-lg text-[#5a6c7d]">
              {String(totalCount).padStart(2, '0')}
            </span>
          </div>
          <div className="w-36 h-1.5 bg-black/10 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-[#ffb7b2] to-[#ffdac1] rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(255,183,178,0.6)]"
              style={{ width: `${totalCount > 0 ? (scannedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* ===== BOTTOM CENTER: Quick Controls Hint ===== */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-2 rounded-full border border-white/60 shadow-sm">
        <span className="text-[11px] text-[#2c3e50] font-bold tracking-widest">
          WASD MOVE &nbsp;•&nbsp; CLICK INTERACT &nbsp;•&nbsp; ESC MENU
        </span>
      </div>
    </div>
  )
}
