// ============================================
// SOUND EFFECTS VIA WEB AUDIO API
// ============================================

let audioCtx = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Suppressed futuristic shot sound
 */
export function playShootSound() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // Main oscillator – short "pew" sweep
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(1200, now)
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.15)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

    // High-pass filter for that suppressed feel
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(400, now)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.15)

    // Noise burst for texture
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
  } catch (e) {
    // Audio not supported – silent fallback
  }
}

/**
 * Confirmed hit chime – two-tone ascending ping
 */
export function playHitSound() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // First tone
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

    // Second tone (higher, delayed)
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
  } catch (e) {
    // Audio not supported – silent fallback
  }
}

/**
 * UI open / close swoosh sound
 */
export function playUISound() {
  try {
    const ctx = getAudioContext()
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
  } catch (e) {
    // silent fallback
  }
}
