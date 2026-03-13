'use client'

import { useEffect, useState } from 'react'

export default function CardOverlay({ activeCard, onClose }) {
  const [visible, setVisible] = useState(false)

  // Trigger animations when card opens/closes
  useEffect(() => {
    if (activeCard) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [activeCard])

  if (!activeCard && !visible) return null

  const isSkill = activeCard?.type === 'skill'
  const isBoss = activeCard?.type === 'boss'

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Soft overlay backdrop */}
      <div 
        className="absolute inset-0 bg-[#fffdf2]/60 backdrop-blur-[4px]" 
        onClick={onClose} 
      />

      {/* Main Card */}
      <div
        className={`relative max-w-lg w-full mx-6 rounded-3xl overflow-hidden bg-white/80 border border-white shadow-2xl transition-transform duration-500 ${
          visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
        }`}
        style={{
          boxShadow: `0 20px 60px ${activeCard?.color || '#87ceeb'}33`,
        }}
      >
        {/* Top colored accent strip */}
        <div 
          className="h-3 w-full" 
          style={{ background: activeCard?.color || '#87ceeb' }} 
        />

        <div className="p-8">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-white border"
              style={{
                color: activeCard?.color || '#4ba3e3',
                borderColor: `${activeCard?.color || '#4ba3e3'}40`,
              }}
            >
              {isSkill ? '✿ Skill' : isBoss ? '★ Top Secret' : '◈ Project'}
            </div>
            <div className="flex-1 h-px bg-[#2c3e50]/10" />
            <span className="text-[11px] text-[#5a6c7d] font-bold tracking-widest uppercase">
              {isBoss ? 'Mission Brief' : 'Archive'}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-extrabold text-[#2c3e50] mb-3">
            {activeCard?.title || activeCard?.name}
          </h2>

          {/* Subtitle / Description */}
          <p className="text-[#5a6c7d] text-[15px] font-medium leading-relaxed mb-6">
            {activeCard?.subtitle || activeCard?.description || `Proficiency: ${activeCard?.years} years.`}
          </p>

          {/* Body Content Blocks */}
          {activeCard?.techStack && (
            <div className="mb-6 p-5 rounded-2xl bg-white/50 border border-white/60">
              <p className="text-[11px] text-[#5a6c7d] tracking-widest font-bold uppercase mb-3">
                Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {activeCard.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-full text-xs font-bold text-[#2c3e50] bg-white shadow-sm border border-[#2c3e50]/5"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {(activeCard?.liveUrl || activeCard?.githubUrl) && (
            <div className="flex gap-4 mt-8">
              {activeCard.liveUrl && (
                <a
                  href={activeCard.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3.5 rounded-full text-center text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
                  style={{ background: activeCard.color || '#4ba3e3' }}
                >
                  Visit Live
                </a>
              )}
              {activeCard.githubUrl && (
                <a
                  href={activeCard.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3.5 rounded-full text-center text-sm font-bold text-[#2c3e50] bg-[#fffdf2] border border-[#2c3e50]/20 hover:bg-white transition-colors"
                >
                  Source Code
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer / Close Area */}
        <div className="px-8 py-5 border-t border-[#2c3e50]/5 bg-[#fffdf2]/50 flex justify-between items-center">
          <span className="text-[11px] text-[#5a6c7d] font-bold tracking-widest">
            {isBoss ? 'TRANSMISSION COMPLETE' : 'DOCUMENT END'}
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-bold text-[#5a6c7d] bg-white border border-[#2c3e50]/10 hover:text-[#2c3e50] hover:shadow-sm transition-all shadow-sm"
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  )
}
