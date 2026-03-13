'use client'

import { useRef, useCallback, useEffect } from 'react'

export function useAudioEffects() {
  const audioCtxRef = useRef(null)

  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') return null
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  const playShootSound = useCallback(() => {
    try {
      const ctx = initAudio()
      if (!ctx) return
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(1200, now)
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.15)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

      const filter = ctx.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.setValueAtTime(400, now)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.15)

      // Noise burst
      const bufferSize = ctx.sampleRate * 0.05
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3
      }

      const noise = ctx.createBufferSource()
      noise.buffer = noiseBuffer
      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.08, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

      noise.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      noise.start(now)
      noise.stop(now + 0.05)
    } catch (e) {}
  }, [initAudio])

  const playHitSound = useCallback(() => {
    try {
      const ctx = initAudio()
      if (!ctx) return
      const now = ctx.currentTime

      const osc1 = ctx.createOscillator()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(880, now)
      const gain1 = ctx.createGain()
      gain1.gain.setValueAtTime(0.12, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.15)

      const osc2 = ctx.createOscillator()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(1320, now + 0.08)
      const gain2 = ctx.createGain()
      gain2.gain.setValueAtTime(0.001, now)
      gain2.gain.setValueAtTime(0.12, now + 0.08)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(now + 0.08)
      osc2.stop(now + 0.25)
    } catch (e) {}
  }, [initAudio])

  const playUISound = useCallback(() => {
    try {
      const ctx = initAudio()
      if (!ctx) return
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(300, now)
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.1)
    } catch (e) {}
  }, [initAudio])

  return { playShootSound, playHitSound, playUISound }
}
