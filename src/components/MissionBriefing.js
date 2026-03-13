'use client'

import { useEffect, useState } from 'react'
import { useAudioEffects } from '@/hooks/useAudioEffects'

/**
 * MissionBriefing – military-style UI for the boss bot interaction.
 * Shows leadership achievements and community growth metrics.
 */
export default function MissionBriefing({ bossData, onClose }) {
  const [visible, setVisible] = useState(false)
  const [revealedItems, setRevealedItems] = useState(0)
  const { playUISound } = useAudioEffects()

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    playUISound()

    // Stagger reveal achievements
    const interval = setInterval(() => {
      setRevealedItems((prev) => {
        if (prev >= bossData.achievements.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 200)

    const handleEsc = (e) => {
      if (e.code === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('keydown', handleEsc)
      clearInterval(interval)
    }
  }, [onClose, bossData.achievements.length])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div
        className={`relative max-w-xl w-full mx-6 rounded-xl overflow-hidden transition-transform duration-500 ${
          visible ? 'scale-100' : 'scale-90'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(10,15,10,0.97), rgba(5,10,5,0.97))',
          border: '1px solid rgba(255,215,0,0.3)',
          boxShadow: '0 0 60px rgba(255,215,0,0.1), inset 0 0 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Top accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

        {/* Scanline overlay effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)',
          }}
        />

        <div className="p-8 relative">
          {/* Classification badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1 rounded border border-red-500/40 bg-red-500/10">
              <span className="text-red-400 text-[10px] tracking-[0.3em] uppercase font-mono font-bold">
                ★ CLASSIFIED
              </span>
            </div>
            <div className="flex-1 h-px bg-amber-500/20" />
            <span className="text-amber-500/40 text-[10px] font-mono">MISSION BRIEFING</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-amber-400 mb-1 font-mono">
            {bossData.title}
          </h2>
          <p className="text-amber-500/60 text-sm font-mono mb-6">
            {bossData.subtitle}
          </p>

          {/* Description */}
          <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5 mb-6">
            <p className="text-green-300/80 text-sm leading-relaxed font-mono">
              &gt; {bossData.description}
            </p>
          </div>

          {/* Achievements grid */}
          <div className="mb-6">
            <p className="text-[10px] text-amber-400/50 tracking-[0.3em] uppercase font-mono mb-4">
              MISSION METRICS
            </p>
            <div className="grid grid-cols-3 gap-3">
              {bossData.achievements.map((achievement, i) => (
                <div
                  key={achievement.label}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    i < revealedItems
                      ? 'border-amber-500/30 bg-amber-500/5 opacity-100 translate-y-0'
                      : 'border-gray-800 bg-transparent opacity-0 translate-y-4'
                  }`}
                >
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <div className="text-amber-400 text-lg font-bold font-mono">
                    {achievement.value}
                  </div>
                  <div className="text-gray-500 text-[10px] font-mono uppercase tracking-wider">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-amber-500/10 flex justify-between items-center">
          <span className="text-[10px] text-green-500/40 font-mono">
            ▸ TRANSMISSION COMPLETE
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded text-xs font-mono font-bold text-amber-400 border border-amber-500/40 hover:bg-amber-500/10 transition-all pointer-events-auto"
          >
            ✕ DISMISS BRIEFING
          </button>
        </div>
      </div>
    </div>
  )
}
