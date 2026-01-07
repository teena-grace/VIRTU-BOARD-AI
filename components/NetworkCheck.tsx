'use client'

import { useState, useEffect } from 'react'

interface NetworkCheckProps {
  onNetworkChange?: (isOnline: boolean) => void
}

export default function NetworkCheck({ onNetworkChange }: NetworkCheckProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)
      onNetworkChange?.(online)
      
      if (!online) {
        setShowWarning(true)
      }
    }

    // Check initial status
    updateOnlineStatus()

    // Listen for network changes
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [onNetworkChange])

  if (!showWarning || isOnline) return null

  return (
    <div className="network-warning">
      <div className="network-warning-content">
        <i className="fas fa-exclamation-triangle"></i>
        <div>
          <strong>Network Connection Lost</strong>
          <p>Voice features require an active internet connection.</p>
        </div>
        <button 
          className="close-btn"
          onClick={() => setShowWarning(false)}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  )
}