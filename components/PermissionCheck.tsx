'use client'

import { useState, useEffect } from 'react'

export default function PermissionCheck() {
  const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt')
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName })
      setMicPermission(result.state as any)
      
      if (result.state === 'prompt') {
        setShowPrompt(true)
      }

      result.addEventListener('change', () => {
        setMicPermission(result.state as any)
      })
    } catch (error) {
      console.error('Permission check error:', error)
    }
  }

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setMicPermission('granted')
      setShowPrompt(false)
    } catch (error) {
      setMicPermission('denied')
    }
  }

  if (!showPrompt || micPermission === 'granted') return null

  return (
    <div className="permission-prompt">
      <div className="permission-content">
        <i className="fas fa-microphone" style={{ fontSize: '48px', color: '#32cd32' }}></i>
        <h3>Microphone Access Required</h3>
        <p>VIRTU-BOARD AI needs access to your microphone for voice features.</p>
        <div className="permission-buttons">
          <button className="btn-primary" onClick={requestPermission}>
            <i className="fas fa-check"></i> Allow Microphone
          </button>
          <button className="btn-secondary" onClick={() => setShowPrompt(false)}>
            <i className="fas fa-times"></i> Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}