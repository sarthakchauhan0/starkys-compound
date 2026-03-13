'use client'

import { useEffect, useState } from 'react'
import useUIStore from '@/store/useUIStore'

export default function CardOverlay() {
  const { activeCard, isCardOpen, closeCard } = useUIStore()
  const [visible, setVisible] = useState(false)

  // Trigger animations when card opens/closes
  useEffect(() => {
    if (isCardOpen && activeCard) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [isCardOpen, activeCard])

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
        className={`absolute inset-0 transition-opacity duration-700 ${visible ? 'bg-[#2c3e50]/80 backdrop-blur-md' : 'bg-transparent'}`}
        onClick={closeCard} 
      />

      {/* Main Card (House Interior Simulation) */}
      <div
        className={`relative max-w-5xl w-full h-[85vh] mx-6 rounded-3xl overflow-hidden bg-[#fffdf2]/95 border border-white shadow-2xl flex flex-col transition-all duration-700 ease-out flex-shrink-0 ${
          visible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-12 opacity-0'
        }`}
        style={{
          boxShadow: `0 20px 80px ${activeCard?.color || '#87ceeb'}40`,
        }}
      >
        {/* Top colored accent strip */}
        <div 
          className="h-4 w-full flex-shrink-0" 
          style={{ background: activeCard?.color || '#87ceeb' }} 
        />

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          {/* Badge */}
          <div className="flex items-center gap-4 mb-8">
            <div
              className="px-4 py-1.5 rounded-full text-[12px] font-bold tracking-widest uppercase bg-white border shadow-sm"
              style={{
                color: activeCard?.color || '#4ba3e3',
                borderColor: `${activeCard?.color || '#4ba3e3'}40`,
              }}
            >
              {isSkill ? '✿ Skill / Tool' : isBoss ? '★ Top Secret' : '◈ Project Archive'}
            </div>
            <div className="flex-1 h-px bg-[#2c3e50]/10" />
            <span className="text-[12px] text-[#5a6c7d] font-bold tracking-widest uppercase bg-white/50 px-3 py-1 rounded-full">
              {isBoss ? 'Mission Brief' : 'House Interior'}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-5xl font-extrabold text-[#2c3e50] mb-5">
            {activeCard?.title || activeCard?.name}
          </h2>

          {/* Subtitle / Description */}
          <p className="text-[#5a6c7d] text-lg font-medium leading-relaxed mb-10 max-w-3xl">
            {activeCard?.description || activeCard?.subtitle || `Proficiency: ${activeCard?.years} years.`}
          </p>

          {/* Body Content Blocks */}
          {activeCard?.techStack && (
            <div className="mb-10 p-8 rounded-2xl bg-white shadow-sm border border-[#2c3e50]/5">
              <p className="text-[12px] text-[#5a6c7d] tracking-widest font-bold uppercase mb-4">
                Technologies & Tools
              </p>
              <div className="flex flex-wrap gap-3">
                {activeCard.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 rounded-full text-sm font-bold text-[#2c3e50] bg-[#fdfbf7] border border-[#2c3e50]/10 hover:border-[#2c3e50]/30 hover:shadow-md transition-all cursor-default"
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
                  className="flex-1 px-8 py-4 rounded-2xl text-center text-lg font-bold text-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
                  style={{ background: activeCard.color || '#4ba3e3' }}
                >
                  Visit Live Project
                </a>
              )}
              {activeCard.githubUrl && (
                <a
                  href={activeCard.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-8 py-4 rounded-2xl text-center text-lg font-bold text-[#2c3e50] bg-white border-2 border-[#2c3e50]/10 hover:border-[#2c3e50]/30 hover:bg-[#fdfbf7] transition-all"
                >
                  View Source Code
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer / Close Area */}
        <div className="px-12 py-6 border-t border-[#2c3e50]/5 bg-white flex justify-between items-center flex-shrink-0">
          <span className="text-[12px] text-[#5a6c7d] font-bold tracking-widest uppercase">
            {isBoss ? 'TRANSMISSION COMPLETE' : 'END OF RECORD'}
          </span>
          <button
            onClick={closeCard}
            className="px-8 py-3 rounded-full text-sm font-bold text-white bg-[#e74c3c] hover:bg-[#c0392b] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Leave House
          </button>
        </div>
      </div>
    </div>
  )
}
