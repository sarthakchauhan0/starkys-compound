'use client'

import React, { Component, useState, useEffect } from 'react'
import Game from '@/components/Game'

// Catch top-level R3F / Canvas errors
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-red-950 text-red-400 font-mono p-8 text-center">
          <h1 className="text-2xl mb-4 font-bold border-b border-red-500/30 pb-2">SYSTEM FAILURE</h1>
          <p className="mb-4">The application encountered a critical runtime error.</p>
          <div className="bg-black/50 p-4 rounded text-left text-xs max-w-3xl overflow-auto border border-red-500/20 text-red-300">
            {this.state.error?.toString()}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-8 px-6 py-2 border border-red-500/50 hover:bg-red-500/10 rounded transition-colors"
          >
            REBOOT SYSTEM
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function GameLoader() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Only mount the Three.js Canvas after the component has fully mounted
    // in the browser to avoid Next.js hydration mismatch
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black text-cyan-400 font-mono text-sm tracking-widest cursor-wait">
        INITIALIZING COMPONENT...
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Game />
    </ErrorBoundary>
  )
}
