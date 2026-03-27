import { useState, useEffect } from 'react'
import useUIStore from '@/store/useUIStore'
import Joystick from './Joystick'

/**
 * HUD overlay – crosshair, energy bar, project counter, zone indicator.
 * Positioned absolutely over the canvas with Tailwind.
 */
export default function HUD({ scannedCount, totalCount, currentZone, isFiring }) {
  const { isTouch, setIsTouch, setMoveJoystick, setLookJoystick, setIsJumping, nearbyHouseData, openCard } = useUIStore()
  const [crosshairPulse, setCrosshairPulse] = useState(false)

  useEffect(() => {
    // Basic touch detection
    const checkTouch = () => {
      const isTouchDev = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches
      setIsTouch(isTouchDev)
    }
    checkTouch()
    
    // Fallback: if we see a touch event, it's definitely touch
    const onTouch = () => setIsTouch(true)
    window.addEventListener('touchstart', onTouch, { once: true })
    return () => window.removeEventListener('touchstart', onTouch)
  }, [setIsTouch])

  useEffect(() => {
    if (isFiring) {
      setCrosshairPulse(true)
      const timer = setTimeout(() => setCrosshairPulse(false), 150)
      return () => clearTimeout(timer)
    }
  }, [isFiring])

  // Centralized keyboard interaction for houses
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Enter') {
        const { nearbyHouseData, isCardOpen, openCard } = useUIStore.getState()
        if (nearbyHouseData && !isCardOpen) {
          openCard(nearbyHouseData)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
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
          <span className="text-[#2c3e50] text-sm tracking-[0.1em] font-bold uppercase">
            STARKY&apos;S COMPOUND
          </span>
        </div>
      </div>


      {/* ===== BOTTOM CENTER: Quick Controls Hint ===== */}
      {!isTouch && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-2 rounded-full border border-white/60 shadow-sm">
          <span className="text-[11px] text-[#2c3e50] font-bold tracking-widest text-center px-4">
            WASD MOVE &nbsp;•&nbsp; ENTER HOUSE &nbsp;•&nbsp; ESC MENU
          </span>
        </div>
      )}

      {/* ===== TOUCH CONTROLS ===== */}
      {isTouch && (
        <>
          {/* Left Joystick: Movement */}
          <div className="absolute bottom-16 left-12 pointer-events-auto">
            <Joystick 
              label="Movement" 
              onMove={(x, y) => setMoveJoystick(x, y)} 
            />
          </div>

          {/* Right Joystick: Look */}
          <div className="absolute bottom-16 right-12 pointer-events-auto">
            <Joystick 
              label="Look Around" 
              onMove={(x, y) => setLookJoystick(x, y)} 
            />
          </div>

          {/* Jump Button (Top right above Look joystick) */}
          <div className="absolute bottom-56 right-16 pointer-events-auto">
            <button 
              className="w-16 h-16 rounded-full glass border border-white/40 flex items-center justify-center active:scale-90 transition-transform shadow-lg"
              onPointerDown={() => setIsJumping(true)}
              onPointerUp={() => setIsJumping(false)}
              onPointerCancel={() => setIsJumping(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2c3e50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
            </button>
          </div>

          {/* Enter House Button (Appears when nearby) */}
          {nearbyHouseData && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-auto">
              <button 
                className="px-8 py-4 rounded-full glass border border-white/60 bg-white/20 flex items-center gap-3 active:scale-95 transition-all shadow-2xl backdrop-blur-xl"
                onPointerDown={() => openCard(nearbyHouseData)}
              >
                <div className="w-2 h-2 rounded-full bg-[#ffb7b2] animate-pulse" />
                <span className="text-[#2c3e50] font-black text-sm tracking-[0.2em] uppercase">
                  ENTER {nearbyHouseData.title}
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
