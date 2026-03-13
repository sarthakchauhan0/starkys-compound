'use client'

import { useEffect, useState } from 'react'
import { useAudioEffects } from '@/hooks/useAudioEffects'

/**
 * PortfolioUI - Desktop-like window displaying project details
 */
export default function PortfolioUI({ projectData, targetType, onClose }) {
  const [visible, setVisible] = useState(false)
  const { playUISound } = useAudioEffects()

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true))
    playUISound()

    const handleEsc = (e) => {
      if (e.code === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!projectData) return null

  const isSkill = targetType === 'skill'
  const isFragment = targetType === 'fragment'

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
        visible ? 'opacity-100' : 'opacity-0 translate-y-8'
      }`}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#fffdf2]/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative max-w-lg w-full mx-6 rounded-3xl overflow-hidden glass transition-transform duration-500 ${
          visible ? 'scale-100' : 'scale-95'
        }`}
        style={{
          borderColor: projectData.color || '#87ceeb',
          boxShadow: `0 10px 40px ${projectData.color || '#87ceeb'}33`,
        }}
      >
        {/* Header accent line */}
        <div
          className="h-2 w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${projectData.color || '#87ceeb'}, transparent)` }}
        />

        <div className="p-8">
          {/* Type badge */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="px-3 py-1 rounded-full text-xs font-bold tracking-[0.1em] shadow-sm bg-white/60"
              style={{
                color: projectData.color || '#4ba3e3',
                border: `1px solid ${projectData.color || '#4ba3e3'}40`,
              }}
            >
              {isSkill ? '✿ SKILL PROFILE' : isFragment ? '◈ DISCOVERY' : '▸ MEMORY'}
            </div>
            <div className="flex-1 h-px bg-[#2c3e50]/10" />
            <span className="text-xs text-[#5a6c7d] font-bold tracking-widest">NO.{projectData.id}</span>
          </div>

          {/* Title */}
          <h2
            className="text-3xl font-extrabold mb-3"
            style={{ color: projectData.color || '#4ba3e3' }}
          >
            {projectData.title || projectData.name}
          </h2>

          {/* Description */}
          <p className="text-[#2c3e50] text-[15px] font-medium leading-relaxed mb-6">
            {projectData.description || `Proficiency in ${projectData.name} with ${projectData.years} years of experience.`}
          </p>

          {/* Skill XP Bar */}
          {isSkill && (
            <div className="mb-6 p-4 rounded-2xl bg-white/50 border border-white/60 shadow-sm">
              <div className="flex justify-between text-sm mb-3 font-bold">
                <span className="text-[#5a6c7d] tracking-widest uppercase">Mastery</span>
                <span style={{ color: projectData.color }}>
                  {projectData.xp}%
                </span>
              </div>
              <div className="w-full h-4 bg-black/10 rounded-full overflow-hidden border border-white/40">
                <div
                  className="h-full rounded-full transition-all duration-1000 shadow-sm"
                  style={{
                    width: `${projectData.xp}%`,
                    background: `linear-gradient(90deg, ${projectData.color}88, ${projectData.color})`,
                  }}
                />
              </div>
              <p className="text-[#7f8c8d] text-xs mt-3 font-bold tracking-widest uppercase text-center">
                {projectData.years} YEARS EXPERIENCE
              </p>
            </div>
          )}

          {/* Data insights */}
          {isFragment && projectData.insights && (
            <div
              className="p-5 rounded-2xl mb-6 shadow-sm border border-white/60 bg-white/50"
            >
              <p className="text-[12px] text-[#5a6c7d] tracking-[0.2em] font-bold uppercase mb-2">
                KEY INSIGHT
              </p>
              <p className="text-[#2c3e50] text-[15px] font-medium italic">
                "{projectData.insights}"
              </p>
            </div>
          )}

          {/* Tech stack */}
          {projectData.techStack && (
            <div className="mb-6">
              <p className="text-[12px] text-[#5a6c7d] tracking-[0.2em] font-bold uppercase mb-3">
                TECH STACK
              </p>
              <div className="flex flex-wrap gap-2">
                {projectData.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-full text-xs font-bold border border-white/60 text-[#2c3e50] bg-white/60 shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-4 mt-8">
            {projectData.liveUrl && (
              <a
                href={projectData.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 rounded-full text-center text-sm font-bold shadow-md transition-all duration-200 hover:scale-105 pointer-events-auto text-white"
                style={{
                  background: projectData.color || '#4ba3e3',
                }}
              >
                ▸ VISIT LIVE
              </a>
            )}
            {projectData.githubUrl && (
              <a
                href={projectData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 rounded-full text-center text-sm font-bold border border-[#5a6c7d]/30 text-[#2c3e50] bg-white/40 hover:bg-white/80 transition-all duration-200 pointer-events-auto shadow-sm"
              >
                ⓘ VIEW SOURCE
              </a>
            )}
          </div>
        </div>

        {/* Close button */}
        <div className="px-8 py-5 border-t border-white/40 flex justify-between items-center bg-white/30">
          <span className="text-[11px] text-[#5a6c7d] font-bold tracking-widest">PRESS ESC TO CLOSE</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-bold text-[#5a6c7d] bg-white/50 border border-white/60 hover:bg-white hover:text-[#2c3e50] shadow-sm transition-all pointer-events-auto"
          >
            ✕ CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}
