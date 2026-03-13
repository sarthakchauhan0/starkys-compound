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
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative max-w-lg w-full mx-6 rounded-xl overflow-hidden border transition-transform duration-500 ${
          visible ? 'scale-100' : 'scale-95'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(10,10,26,0.95), rgba(26,26,46,0.95))',
          borderColor: projectData.color || '#00ffcc',
          boxShadow: `0 0 40px ${projectData.color || '#00ffcc'}22, inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
      >
        {/* Header accent line */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${projectData.color || '#00ffcc'}, transparent)` }}
        />

        <div className="p-8">
          {/* Type badge */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="px-2.5 py-0.5 rounded text-[10px] tracking-[0.2em] uppercase font-mono font-bold"
              style={{
                color: projectData.color || '#00ffcc',
                background: `${projectData.color || '#00ffcc'}15`,
                border: `1px solid ${projectData.color || '#00ffcc'}40`,
              }}
            >
              {isSkill ? '⊞ SKILL PROFILE' : isFragment ? '◈ DATA FILE' : '▸ PROJECT FILE'}
            </div>
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-[10px] text-gray-500 font-mono">ID:{projectData.id}</span>
          </div>

          {/* Title */}
          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: projectData.color || '#00ffcc' }}
          >
            {projectData.title || projectData.name}
          </h2>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            {projectData.description || `Proficiency in ${projectData.name} with ${projectData.years} years of experience.`}
          </p>

          {/* Skill XP Bar */}
          {isSkill && (
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400 font-mono">XP LEVEL</span>
                <span style={{ color: projectData.color }} className="font-mono font-bold">
                  {projectData.xp}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${projectData.xp}%`,
                    background: `linear-gradient(90deg, ${projectData.color}88, ${projectData.color})`,
                    boxShadow: `0 0 10px ${projectData.color}44`,
                  }}
                />
              </div>
              <p className="text-gray-500 text-xs mt-2 font-mono">
                {projectData.years} YEARS EXPERIENCE
              </p>
            </div>
          )}

          {/* Data insights */}
          {isFragment && projectData.insights && (
            <div
              className="p-4 rounded-lg mb-6 border"
              style={{
                borderColor: `${projectData.color}30`,
                background: `${projectData.color}08`,
              }}
            >
              <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-mono mb-2">
                KEY INSIGHT
              </p>
              <p style={{ color: projectData.color }} className="text-sm font-mono">
                &gt; {projectData.insights}
              </p>
            </div>
          )}

          {/* Tech stack */}
          {projectData.techStack && (
            <div className="mb-6">
              <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-mono mb-2">
                TECH STACK
              </p>
              <div className="flex flex-wrap gap-2">
                {projectData.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded text-xs font-mono border border-gray-700 text-gray-300 bg-gray-800/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-3 mt-6">
            {projectData.liveUrl && (
              <a
                href={projectData.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2.5 rounded-lg text-center text-sm font-mono font-bold transition-all duration-200 hover:brightness-125 pointer-events-auto"
                style={{
                  background: `${projectData.color || '#00ffcc'}20`,
                  color: projectData.color || '#00ffcc',
                  border: `1px solid ${projectData.color || '#00ffcc'}50`,
                }}
              >
                ▸ LIVE LINK
              </a>
            )}
            {projectData.githubUrl && (
              <a
                href={projectData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2.5 rounded-lg text-center text-sm font-mono font-bold border border-gray-600 text-gray-300 hover:border-gray-400 transition-all duration-200 pointer-events-auto"
              >
                ⓘ GITHUB
              </a>
            )}
          </div>
        </div>

        {/* Close button */}
        <div className="px-8 py-4 border-t border-gray-800 flex justify-between items-center">
          <span className="text-[10px] text-gray-600 font-mono">PRESS ESC TO CLOSE</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-mono text-gray-400 border border-gray-700 hover:border-gray-500 hover:text-gray-200 transition-all pointer-events-auto"
          >
            ✕ CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}
