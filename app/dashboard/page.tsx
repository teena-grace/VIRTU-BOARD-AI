// app/dashboard/page.tsx
'use client'

import { useAuth } from '@/lib/useAuth'
import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import BoardSection from '@/components/BoardSection'
import AIFeaturesPanel from '@/components/AIFeaturesPanel'
import DiagramRenderer from '@/components/DiagramRenderer'
import TimetableSection from '@/components/TimetableSection'
import MicrophonePermissionGuide from '@/components/MicrophonePermissionGuide'
import VoiceControlButton from '@/components/VoiceControlButton'
import VoiceCommandsHelp from '@/components/VoiceCommandsHelp'
import type { Lecture } from '@/types'
import { storage } from '@/lib/storage'
import { calculateBoardUsage, debounce } from '@/lib/utils'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { useVoiceControl } from '@/hooks/useVoiceControl'

export default function DashboardPage() {
  const { user, loading, logout } = useAuth('STUDENT')

  const [boardContent, setBoardContent] = useState<string>('')
  const [isPinned, setIsPinned] = useState<boolean>(false)
  const [history, setHistory] = useState<string[]>([])
  const [schedule, setSchedule] = useState<Lecture[]>([])
  const [notification, setNotification] = useState<string>('')
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info')
  const [boardUsage, setBoardUsage] = useState<number>(0)
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [listeningFor, setListeningFor] = useState<'write' | 'clean' | null>(null)
  const [isProcessingAI, setIsProcessingAI] = useState(false)
  const [showPermissionGuide, setShowPermissionGuide] = useState(false)
  const [showVoiceHelp, setShowVoiceHelp] = useState(false)

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification(message)
    setNotificationType(type)
    setTimeout(() => setNotification(''), 5000)
  }

  // AI-Powered Voice Write with Auto Note Generation
  const voiceWrite = useSpeechRecognition({
    onResult: async (transcript) => {
      saveToHistory()
      setIsProcessingAI(true)
      showNotification('🤖 AI is processing your speech...', 'info')
      
      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate_notes',
            content: transcript
          })
        })

        const data = await response.json()

        if (response.ok) {
          const newContent = boardContent + '\n\n' + data.result
          setBoardContent(newContent)
          saveBoardContent(newContent)
          showNotification('✓ AI notes generated from speech!', 'success')
        } else {
          const newContent = boardContent + '\n• ' + transcript
          setBoardContent(newContent)
          saveBoardContent(newContent)
          showNotification(`✓ Added: "${transcript}"`, 'success')
        }
      } catch (error) {
        const newContent = boardContent + '\n• ' + transcript
        setBoardContent(newContent)
        saveBoardContent(newContent)
        showNotification('Added as simple note', 'info')
      } finally {
        setIsProcessingAI(false)
        setListeningFor(null)
      }
    },
    onError: (error) => {
      showNotification(error, 'error')
      setListeningFor(null)
      setIsProcessingAI(false)
      
      if (error.includes('Microphone') || error.includes('denied') || error.includes('blocked') || error.includes('🎤')) {
        setShowPermissionGuide(true)
      }
    },
    onStart: () => {
      setListeningFor('write')
    },
    onEnd: () => {
      setListeningFor(null)
    },
    silenceTimeout: 2500
  })

  // AI-Powered Voice Clean
  const voiceClean = useSpeechRecognition({
    onResult: async (transcript) => {
      setIsProcessingAI(true)
      showNotification('🤖 AI is analyzing your command...', 'info')
      
      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'smart_clean',
            content: boardContent,
            options: { command: transcript }
          })
        })

        const data = await response.json()

        if (response.ok) {
          saveToHistory()
          setBoardContent(data.result)
          saveBoardContent(data.result)
          showNotification('✓ AI cleaned your board!', 'success')
        } else {
          showNotification('Could not understand cleaning command', 'error')
        }
      } catch (error) {
        showNotification('AI cleaning failed', 'error')
      } finally {
        setIsProcessingAI(false)
        setListeningFor(null)
      }
    },
    onError: (error) => {
      showNotification(error, 'error')
      setListeningFor(null)
      setIsProcessingAI(false)
      
      if (error.includes('Microphone') || error.includes('denied') || error.includes('blocked') || error.includes('🎤')) {
        setShowPermissionGuide(true)
      }
    },
    onStart: () => {
      setListeningFor('clean')
    },
    onEnd: () => {
      setListeningFor(null)
    },
    silenceTimeout: 1500
  })

  // Voice Control Handler - Handle all voice commands
  const handleVoiceCommand = useCallback(async (action: string, params?: any) => {
    console.log('🎯 Executing command:', action, params)

    switch (action) {
      // ===== BOARD COMMANDS =====
      case 'CLEAR_BOARD':
        handleSmartClean('all')
        break
      
      case 'UNDO':
        handleUndo()
        break
      
      case 'PIN_BOARD':
        if (!isPinned) handlePin()
        else showNotification('Board already pinned', 'info')
        break
      
      case 'UNPIN_BOARD':
        if (isPinned) handlePin()
        else showNotification('Board already unpinned', 'info')
        break
      
      case 'DOWNLOAD':
        handleDownload()
        break

      // ===== AI COMMANDS =====
      case 'AI_ENHANCE':
        if (!boardContent) {
          showNotification('Board is empty!', 'error')
          return
        }
        setIsProcessingAI(true)
        try {
          const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'enhance_content', content: boardContent })
          })
          const data = await response.json()
          if (response.ok) {
            handleContentUpdate(data.result)
            showNotification('✓ Content enhanced!', 'success')
          }
        } catch (error) {
          showNotification('Enhancement failed', 'error')
        } finally {
          setIsProcessingAI(false)
        }
        break

      case 'AI_SUMMARY':
        if (!boardContent) {
          showNotification('Board is empty!', 'error')
          return
        }
        setIsProcessingAI(true)
        try {
          const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'generate_summary', content: boardContent })
          })
          const data = await response.json()
          if (response.ok) {
            handleContentUpdate(boardContent + '\n\n## 📋 AI Summary\n' + data.result)
            showNotification('✓ Summary generated!', 'success')
          }
        } catch (error) {
          showNotification('Summary failed', 'error')
        } finally {
          setIsProcessingAI(false)
        }
        break

      case 'AI_QUESTIONS':
        if (!boardContent) {
          showNotification('Board is empty!', 'error')
          return
        }
        setIsProcessingAI(true)
        try {
          const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'generate_questions', content: boardContent })
          })
          const data = await response.json()
          if (response.ok) {
            handleContentUpdate(boardContent + '\n\n## ❓ Study Questions\n' + data.result)
            showNotification('✓ Questions generated!', 'success')
          }
        } catch (error) {
          showNotification('Question generation failed', 'error')
        } finally {
          setIsProcessingAI(false)
        }
        break

      case 'AI_FLOWCHART':
        const flowchartDesc = params?.text || 'process flow'
        setIsProcessingAI(true)
        try {
          const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'generate_flowchart', content: flowchartDesc })
          })
          const data = await response.json()
          if (response.ok) {
            handleContentUpdate(boardContent + `\n\n## 📊 Flowchart\n\`\`\`mermaid\n${data.result}\n\`\`\``)
            showNotification('✓ Flowchart created!', 'success')
          }
        } catch (error) {
          showNotification('Flowchart creation failed', 'error')
        } finally {
          setIsProcessingAI(false)
        }
        break

      case 'AI_MINDMAP':
        const mindmapTopic = params?.text || 'topic'
        setIsProcessingAI(true)
        try {
          const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'generate_mindmap', content: mindmapTopic })
          })
          const data = await response.json()
          if (response.ok) {
            handleContentUpdate(boardContent + `\n\n## 🧠 Mind Map\n\`\`\`mermaid\n${data.result}\n\`\`\``)
            showNotification('✓ Mind map created!', 'success')
          }
        } catch (error) {
          showNotification('Mind map creation failed', 'error')
        } finally {
          setIsProcessingAI(false)
        }
        break

      case 'AI_CIRCUIT':
        const circuitDesc = params?.text || 'basic circuit'
        setIsProcessingAI(true)
        try {
          const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'generate_circuit', content: circuitDesc })
          })
          const data = await response.json()
          if (response.ok) {
            handleContentUpdate(boardContent + `\n\n## ⚡ Circuit\n\`\`\`mermaid\n${data.result}\n\`\`\``)
            showNotification('✓ Circuit created!', 'success')
          }
        } catch (error) {
          showNotification('Circuit creation failed', 'error')
        } finally {
          setIsProcessingAI(false)
        }
        break

      case 'AI_ORGANIZE':
        handleSmartClean('organize')
        break

      // ===== CONTENT COMMANDS =====
      case 'ADD_TEXT':
        const text = params?.text || ''
        if (text) {
          handleContentUpdate(boardContent + '\n• ' + text)
          showNotification('✓ Text added', 'success')
        }
        break

      case 'START_NOTES':
        handleVoiceWrite()
        break

      case 'STOP_NOTES':
        if (voiceWrite.isListening) {
          voiceWrite.stopListening()
        }
        break

      // ===== CLEANING COMMANDS =====
      case 'REMOVE_DIAGRAMS':
        handleSmartClean('remove_diagrams')
        break

      case 'REMOVE_CODE':
        handleSmartClean('remove_code')
        break

      case 'KEEP_IMPORTANT':
        handleSmartClean('keep_important')
        break

      // ===== NAVIGATION COMMANDS =====
      case 'SCROLL_TOP':
        window.scrollTo({ top: 0, behavior: 'smooth' })
        showNotification('✓ Scrolled to top', 'success')
        break

      case 'SCROLL_BOTTOM':
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        showNotification('✓ Scrolled to bottom', 'success')
        break

      case 'SCROLL_DOWN':
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })
        break

      case 'SCROLL_UP':
        window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' })
        break

      case 'SHOW_SCHEDULE':
        const scheduleElement = document.querySelector('[data-schedule]')
        if (scheduleElement) {
          scheduleElement.scrollIntoView({ behavior: 'smooth' })
          showNotification('✓ Showing schedule', 'success')
        }
        break

      // ===== SYSTEM COMMANDS =====
      case 'MARK_ATTENDANCE':
        showNotification('✓ Attendance feature - check header', 'info')
        break

      case 'REFRESH':
        showNotification('Refreshing page...', 'info')
        setTimeout(() => window.location.reload(), 1000)
        break

      case 'LOGOUT':
        showNotification('Logging out...', 'info')
        setTimeout(() => logout(), 1000)
        break

      case 'SHOW_HELP':
        setShowVoiceHelp(true)
        break

      case 'STOP_VOICE':
        voiceControl.stopVoiceControl()
        break

      default:
        showNotification('Command not implemented yet', 'info')
    }
  }, [boardContent, isPinned, voiceWrite.isListening])

  // Initialize voice control
  const voiceControl = useVoiceControl({
    onCommand: handleVoiceCommand,
    onNotification: showNotification
  })

  useEffect(() => {
    fetchSchedule()
    loadSavedData()
    
    const handleOnline = () => {
      setIsOnline(true)
      showNotification('✓ You are back online', 'success')
    }
    const handleOffline = () => {
      setIsOnline(false)
      showNotification('⚠ You are offline. AI features disabled.', 'error')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    const interval = setInterval(() => {
      updateScheduleStatus()
    }, 60000)

    return () => {
      clearInterval(interval)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    setBoardUsage(calculateBoardUsage(boardContent))
  }, [boardContent])

  const loadSavedData = () => {
    const saved = storage.load('boardContent', '')
    const savedPinned = storage.load('isPinned', false)
    const savedHistory = storage.load('history', [])
    
    if (saved) setBoardContent(saved)
    setIsPinned(savedPinned)
    setHistory(savedHistory)
  }

  const fetchSchedule = async () => {
    try {
      const response = await fetch('/api/schedule')
      const data = await response.json()
      setSchedule(data.schedule)
    } catch (error) {
      console.error('Error fetching schedule:', error)
    }
  }

  const updateScheduleStatus = () => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    const updatedSchedule = schedule.map(lecture => {
      const [time, period] = lecture.time.split(' ')
      const [hours, minutes] = time.split(':').map(Number)
      const lectureMinutes = (period === 'PM' && hours !== 12 ? hours + 12 : hours) * 60 + minutes

      if (currentTime >= lectureMinutes && currentTime < lectureMinutes + 60) {
        return { ...lecture, status: 'active' as const }
      } else if (currentTime >= lectureMinutes + 60) {
        return { ...lecture, status: 'completed' as const }
      } else {
        return { ...lecture, status: 'upcoming' as const }
      }
    })

    setSchedule(updatedSchedule)
  }

  const saveToHistory = useCallback(() => {
    const newHistory = [...history, boardContent].slice(-10)
    setHistory(newHistory)
    storage.save('history', newHistory)
  }, [history, boardContent])

  const handleVoiceWrite = () => {
    if (!isOnline) {
      showNotification('⚠ AI features require internet connection', 'error')
      return
    }
    
    if (voiceWrite.isListening) {
      voiceWrite.stopListening()
      showNotification('🛑 Voice input stopped', 'info')
    } else {
      voiceWrite.startListening()
      showNotification('🎤 Speak now! Auto-stops after 2.5s pause', 'info')
    }
  }

  const handleVoiceClean = () => {
    if (!isOnline) {
      showNotification('⚠ AI features require internet connection', 'error')
      return
    }

    if (voiceClean.isListening) {
      voiceClean.stopListening()
      showNotification('🛑 Voice command cancelled', 'info')
    } else {
      voiceClean.startListening()
      showNotification('🎤 Say naturally: "remove diagrams", "keep only notes", "organize"!', 'info')
    }
  }

  const handleSmartClean = async (type: string = 'all') => {
    if (isPinned && type === 'all') {
      showNotification('⚠ Content is pinned! Unpin to clean all', 'error')
      return
    }

    if (!boardContent || boardContent.trim() === '') {
      showNotification('ℹ Board is already empty', 'info')
      return
    }

    saveToHistory()

    if (type === 'all') {
      setBoardContent('')
      saveBoardContent('')
      showNotification('✓ Board cleared', 'success')
    } else {
      setIsProcessingAI(true)
      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'smart_clean',
            content: boardContent,
            options: { type }
          })
        })

        const data = await response.json()
        if (response.ok) {
          setBoardContent(data.result)
          saveBoardContent(data.result)
          showNotification('✓ AI cleaned your board!', 'success')
        }
      } catch (error) {
        showNotification('Cleaning failed', 'error')
      } finally {
        setIsProcessingAI(false)
      }
    }
  }

  const handleUndo = () => {
    if (history.length > 0) {
      const newHistory = [...history]
      const previous = newHistory.pop()
      setHistory(newHistory)
      storage.save('history', newHistory)
      
      if (previous !== undefined) {
        setBoardContent(previous)
        saveBoardContent(previous)
        showNotification('✓ Undo successful', 'success')
      }
    } else {
      showNotification('ℹ Nothing to undo', 'info')
    }
  }

  const handlePin = () => {
    const newPinned = !isPinned
    setIsPinned(newPinned)
    storage.save('isPinned', newPinned)
    showNotification(newPinned ? '🔒 Content pinned' : '📌 Content unpinned', 'success')
  }

  const handleDownload = async () => {
    try {
      showNotification('📥 Preparing download...', 'info')
      
      const timestamp = new Date().toISOString().split('T')[0]
      const formattedContent = `
VIRTU-BOARD AI - Lecture Notes
Generated: ${new Date().toLocaleString()}
Student: ${user?.name}
================================

${boardContent}

================================
© VIRTU-BOARD AI ${new Date().getFullYear()}
      `

      const blob = new Blob([formattedContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `VirtuBoard_Notes_${timestamp}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      showNotification('✓ Notes downloaded successfully!', 'success')
    } catch (error) {
      showNotification('⚠ Download failed', 'error')
      console.error('Download error:', error)
    }
  }

  const debouncedSave = useCallback(
    debounce((content: string) => {
      storage.save('boardContent', content)
    }, 500),
    []
  )

  const saveBoardContent = async (content: string) => {
    debouncedSave(content)
    
    if (isOnline) {
      try {
        await fetch('/api/board', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, isPinned })
        })
      } catch (error) {
        console.error('Error saving to server:', error)
      }
    }
  }

  const handleContentUpdate = (content: string) => {
    saveToHistory()
    setBoardContent(content)
    saveBoardContent(content)
  }

  const isListening = voiceWrite.isListening || voiceClean.isListening
  const timeLeft = voiceWrite.isListening ? voiceWrite.timeLeft : voiceClean.timeLeft

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      {notification && (
        <div className={`notification notification-${notificationType}`}>
          {notificationType === 'error' && <i className="fas fa-exclamation-circle"></i>}
          {notificationType === 'success' && <i className="fas fa-check-circle"></i>}
          {notificationType === 'info' && <i className="fas fa-info-circle"></i>}
          <span>{notification}</span>
        </div>
      )}

      {!isOnline && (
        <div className="offline-banner">
          <i className="fas fa-wifi-slash"></i>
          <span>You are offline. AI features are disabled.</span>
        </div>
      )}

      {isProcessingAI && (
        <div className="ai-processing-banner">
          <i className="fas fa-brain fa-pulse mr-2"></i>
          <span>AI is thinking...</span>
        </div>
      )}
      
      <div className="container">
        <div className="flex justify-between items-center mb-4">
          <Header 
            isListening={isListening} 
            timeLeft={timeLeft} 
            listeningFor={listeningFor}
          />
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
        
        <div className="main-content">
          <BoardSection 
            content={boardContent}
            setContent={(content: string) => {
              setBoardContent(content)
              saveBoardContent(content)
            }}
            isPinned={isPinned}
            isListening={isListening}
            timeLeft={timeLeft}
            onVoiceWrite={handleVoiceWrite}
            onSmartClean={() => handleSmartClean('all')}
            onUndo={handleUndo}
            onPin={handlePin}
            onDownload={handleDownload}
            onVoiceClean={handleVoiceClean}
          />

          <AIFeaturesPanel
            boardContent={boardContent}
            onContentUpdate={handleContentUpdate}
            onNotification={showNotification}
            boardUsage={boardUsage}
            onSmartClean={handleSmartClean}
          />
        </div>

        <DiagramRenderer content={boardContent} />
        
        <div data-schedule>
          <TimetableSection schedule={schedule} onRefresh={fetchSchedule} />
        </div>
      </div>

      {/* Voice Control Button - Floating */}
      <VoiceControlButton
        isActive={voiceControl.isActive}
        onToggle={voiceControl.toggleVoiceControl}
        timeLeft={voiceControl.timeLeft}
      />

      {/* Microphone Permission Guide Modal */}
      {showPermissionGuide && (
        <MicrophonePermissionGuide onClose={() => setShowPermissionGuide(false)} />
      )}

      {/* Voice Commands Help Modal */}
      {showVoiceHelp && (
        <VoiceCommandsHelp onClose={() => setShowVoiceHelp(false)} />
      )}

      <style jsx>{`
        .ai-processing-banner {
          position: fixed;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 24px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          z-index: 100;
          display: flex;
          align-items: center;
          font-weight: 600;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}