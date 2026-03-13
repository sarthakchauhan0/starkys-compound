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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#fffdf2]/40 backdrop-blur-[2px]" onClick={onClose} />

      <div
        className={`relative max-w-xl w-full mx-6 rounded-3xl overflow-hidden glass transition-transform duration-500 ${
          visible ? 'scale-100' : 'scale-90'
        }`}
        style={{
          border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
        }}
      >
        {/* Top accent */}
        <div className="h-2 w-full bg-gradient-to-r from-transparent via-[#87ceeb] to-transparent" />

        <div className="p-8 relative">
          {/* Classification badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="px-4 py-1.5 rounded-full border border-[#87ceeb]/40 bg-white/60 shadow-sm">
              <span className="text-[#4ba3e3] text-xs tracking-[0.1em] font-bold">
                ★ TOP SECRET
              </span>
            </div>
            <div className="flex-1 h-px bg-[#2c3e50]/10" />
            <span className="text-[#5a6c7d] text-xs font-bold tracking-widest">MISSION BRIEFING</span>
          </div>

          {/* Title */}
          <h2 className="text-4xl font-extrabold text-[#2c3e50] mb-2">
            {bossData.title}
          </h2>
          <p className="text-[#5a6c7d] text-base mb-6 font-medium">
            {bossData.subtitle}
          </p>

          {/* Description */}
          <div className="p-5 rounded-2xl border border-white/60 bg-white/50 shadow-sm mb-6">
            <p className="text-[#2c3e50] text-[15px] leading-relaxed font-medium">
              "{bossData.description}"
            </p>
          </div>

          {/* Achievements grid */}
          <div className="mb-6">
            <p className="text-xs text-[#5a6c7d] tracking-[0.2em] font-bold uppercase mb-4">
              MISSION METRICS
            </p>
            <div className="grid grid-cols-3 gap-4">
              {bossData.achievements.map((achievement, i) => (
                <div
                  key={achievement.label}
                  className={`p-4 rounded-2xl border shadow-sm transition-all duration-300 ${
                    i < revealedItems
                      ? 'border-white/60 bg-white/60 opacity-100 translate-y-0'
                      : 'border-transparent bg-transparent opacity-0 translate-y-4'
                  }`}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="text-[#4ba3e3] text-xl font-extrabold">
                    {achievement.value}
                  </div>
                  <div className="text-[#5a6c7d] text-[11px] font-bold uppercase tracking-widest mt-1">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-white/40 bg-white/30 flex justify-between items-center">
          <span className="text-[11px] text-[#5a6c7d] font-bold tracking-widest">
            ▸ TRANSMISSION COMPLETE
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#4ba3e3] hover:bg-[#87ceeb] shadow-md transition-all pointer-events-auto"
          >
            ✕ DISMISS
          </button>
        </div>
      </div>
    </div>
  )
}
