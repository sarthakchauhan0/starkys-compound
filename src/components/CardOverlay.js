'use client'

import { useEffect, useState } from 'react'
import useUIStore from '@/store/useUIStore'

export default function CardOverlay() {
  const { activeCard, isCardOpen, closeCard } = useUIStore()
  const [phase, setPhase] = useState('hidden') // hidden -> fadeToBlack1 -> cardVisible -> fadeToBlack2 -> hidden

  // Trigger animations when card opens/closes
  useEffect(() => {
    if (isCardOpen && activeCard) {
      setPhase('fadeToBlack1')
      setTimeout(() => setPhase('cardVisible'), 800) // 800ms of black before revealing card
    } else {
      if (phase !== 'hidden') {
        setPhase('fadeToBlack2')
        setTimeout(() => setPhase('hidden'), 800) // 800ms of black before revealing world
      }
    }
  }, [isCardOpen, activeCard])

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.code === 'Escape' && isCardOpen) {
        closeCard();
        // Attempt to re-lock pointer on exit
        const canvas = document.querySelector('canvas');
        if (canvas) canvas.requestPointerLock();
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isCardOpen, closeCard])

  if (!activeCard && phase === 'hidden') return null

  const isSkill = activeCard?.type === 'skill'
  const isBoss = activeCard?.type === 'boss'
  
  const isCardPhase = phase === 'cardVisible'
  const isBlackPhase = phase === 'fadeToBlack1' || phase === 'fadeToBlack2'

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-700 ${
        phase !== 'hidden' ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Cinematic Black Overlay Transition Layer */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-700 ${
          isBlackPhase ? 'opacity-100 z-10' : (isCardPhase ? 'opacity-80 z-0' : 'opacity-0 -z-10')
        } ${isCardPhase && 'backdrop-blur-xl'}`}
        onClick={() => {
          closeCard();
          document.querySelector('canvas')?.requestPointerLock();
        }} 
      />

      {/* Main Card (House Interior Simulation) */}
      <div
        className={`relative z-20 max-w-5xl w-full h-[85vh] mx-6 rounded-3xl overflow-hidden bg-white/60 backdrop-blur-2xl border border-white/50 shadow-2xl flex flex-col transition-all duration-1000 ease-out flex-shrink-0 ${
          isCardPhase ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-12 opacity-0'
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
        <div className="px-12 py-6 border-t border-white/20 bg-white/40 backdrop-blur-md flex justify-between items-center flex-shrink-0">
          <span className="text-[12px] text-[#5a6c7d] font-bold tracking-widest uppercase">
            {isBoss ? 'TRANSMISSION COMPLETE' : 'PRESS [ESC] TO EXIT'}
          </span>
          <button
            onClick={() => {
              closeCard();
              document.querySelector('canvas')?.requestPointerLock();
            }}
            className="px-8 py-3 rounded-full text-sm font-bold text-white bg-[#e74c3c] hover:bg-[#c0392b] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Leave House
          </button>
        </div>
      </div>
    </div>
  )
}
