'use client'

import { useState, useEffect } from 'react'

interface HeaderProps {
  isListening?: boolean
  timeLeft?: number
  listeningFor?: 'write' | 'clean' | null
}

export default function Header({ isListening = false, timeLeft = 0, listeningFor = null }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }))
      setCurrentDate(now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      }))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  const getListeningText = () => {
    if (!isListening) return 'ENGINEERING CLASS LIVE'
    if (listeningFor === 'write') return `🎤 LISTENING FOR TEXT... (${timeLeft}s)`
    if (listeningFor === 'clean') return `🎤 LISTENING FOR COMMAND... (${timeLeft}s)`
    return 'LISTENING...'
  }

  return (
    <div className="header">
      <div className="header-top">
        <div className="logo">
          <div className="logo-icon">
            <i className="fas fa-chalkboard-teacher"></i>
          </div>
          <div>
            <h1>VIRTU-BOARD AI</h1>
            <p className="tagline">"Write nothing. Clean nothing. Teach everything."</p>
          </div>
        </div>
        <div className={`status ${isListening ? 'listening' : ''}`}>
          <div className={`status-dot ${isListening ? 'listening' : ''}`}></div>
          <span className="status-text">{getListeningText()}</span>
        </div>
      </div>
      <div className="subject-info">
        <span><i className="fas fa-book"></i> Data Structures</span>
        <span><i className="fas fa-layer-group"></i> Trees & Graphs</span>
        <span><i className="fas fa-users"></i> Students: 45</span>
        <span><i className="fas fa-clock"></i> {currentTime}</span>
      </div>
    </div>
  )
}