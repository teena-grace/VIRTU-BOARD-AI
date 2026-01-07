'use client'
useEffect(() => {
  if (!document.cookie.includes("session")) {
    window.location.href = "/login"
  }
}, [])

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import BoardSection from '@/components/BoardSection'
import CleanPanel from '@/components/CleanPanel'
import FeaturesGrid from '@/components/Featuresgrid'
import TimetableSection from '@/components/TimetableSection'
import type { Lecture } from '@/types'
import { storage } from '@/lib/storage'
import { calculateBoardUsage, debounce } from '@/lib/utils'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import NetworkCheck from '@/components/NetworkCheck'


export default function Dashboard() {
  const [boardContent, setBoardContent] = useState<string>('')
  const [isPinned, setIsPinned] = useState<boolean>(false)
  const [history, setHistory] = useState<string[]>([])
  const [schedule, setSchedule] = useState<Lecture[]>([])
  const [notification, setNotification] = useState<string>('')
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info')
  const [boardUsage, setBoardUsage] = useState<number>(0)
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [listeningFor, setListeningFor] = useState<'write' | 'clean' | null>(null)

  // Speech recognition for voice write

  const voiceWrite = useSpeechRecognition({
    onResult: (transcript) => {
      saveToHistory()
      const newContent = boardContent + '\n• ' + transcript
      setBoardContent(newContent)
      saveBoardContent(newContent)
      showNotification(`✓ Added: "${transcript}"`, 'success')
      setListeningFor(null)
    },
    onError: (error) => {
      showNotification(error, 'error')
      setListeningFor(null)
    },
    onStart: () => {
      setListeningFor('write')
    },
    onEnd: () => {
      setListeningFor(null)
    },
    timeout: 15000 // 15 seconds for voice write
  })

  // Speech recognition for voice clean
  const voiceClean = useSpeechRecognition({
    onResult: (transcript) => {
      const command = transcript.toLowerCase()
      
      if (command.includes('clear everything') || command.includes('clean all') || command.includes('delete all')) {
        handleSmartClean('all')
      } else if (command.includes('clear diagram') || command.includes('remove diagram')) {
        handleSmartClean('diagrams')
      } else if (command.includes('clean algorithm')) {
        handleSmartClean('algorithms')
      } else if (command.includes('keep pinned') || command.includes('clear unpinned')) {
        handleSmartClean('unpinned')
      } else {
        showNotification(`Command not recognized: "${transcript}". Try: "clear everything", "clean algorithms", "clear diagrams"`, 'error')
      }
      setListeningFor(null)
    },
    onError: (error) => {
      showNotification(error, 'error')
      setListeningFor(null)
    },
    onStart: () => {
      setListeningFor('clean')
    },
    onEnd: () => {
      setListeningFor(null)
    },
    timeout: 10000 // 10 seconds for voice commands
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
      showNotification('⚠ You are offline. Voice features disabled.', 'error')
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

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification(message)
    setNotificationType(type)
    setTimeout(() => setNotification(''), 5000)
  }

  const saveToHistory = useCallback(() => {
    const newHistory = [...history, boardContent].slice(-10)
    setHistory(newHistory)
    storage.save('history', newHistory)
  }, [history, boardContent])

  const handleVoiceWrite = () => {
    if (!isOnline) {
      showNotification('⚠ Voice recognition requires an internet connection', 'error')
      return
    }
    
    if (voiceWrite.isListening) {
      voiceWrite.stopListening()
      showNotification('🛑 Voice input stopped', 'info')
    } else {
      voiceWrite.startListening()
      showNotification('🎤 Listening... Speak clearly into your microphone', 'info')
    }
  }

  const handleSmartClean = (type: string = 'all') => {
    if (isPinned && type === 'all') {
      showNotification('⚠ Content is pinned! Unpin to clean all', 'error')
      return
    }

    if (!boardContent || boardContent.trim() === '') {
      showNotification('ℹ Board is already empty', 'info')
      return
    }

    saveToHistory()
    
    let newContent = boardContent

    switch (type) {
      case 'algorithms':
        const algorithmKeywords = ['algorithm', 'function', 'loop', 'iteration', 'recursion', 'traverse', 'sort']
        const lines = boardContent.split('\n')
        newContent = lines.filter(line => {
          const lowerLine = line.toLowerCase()
          return !algorithmKeywords.some(keyword => lowerLine.includes(keyword))
        }).join('\n')
        
        if (newContent.includes('<')) {
          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = newContent
          const listItems = tempDiv.querySelectorAll('li')
          listItems.forEach(li => {
            const text = li.textContent?.toLowerCase() || ''
            if (algorithmKeywords.some(keyword => text.includes(keyword))) {
              li.remove()
            }
          })
          newContent = tempDiv.innerHTML
        }
        
        showNotification('✓ Cleaned algorithms section', 'success')
        break

      case 'diagrams':
        newContent = boardContent.replace(/<i[^>]*class="fas[^"]*"[^>]*><\/i>/g, '')
        newContent = newContent.replace(/🎨|📊|📈|📉|🔷|🔶|▶|●|■|◆/g, '')
        
        const diagramLines = newContent.split('\n')
        newContent = diagramLines.filter(line => 
          !line.toLowerCase().includes('diagram') && 
          !line.toLowerCase().includes('chart') &&
          !line.toLowerCase().includes('graph')
        ).join('\n')
        
        showNotification('✓ Cleared diagrams', 'success')
        break

      case 'unpinned':
        const allLines = boardContent.split('\n')
        newContent = allLines.filter(line => line.includes('📌')).join('\n')
        
        if (!newContent || newContent.trim() === '') {
          showNotification('ℹ No pinned content found', 'info')
          return
        }
        
        showNotification('✓ Kept only pinned content', 'success')
        break

      default:
        newContent = ''
        showNotification('✓ Board cleared successfully', 'success')
    }

    if (newContent.includes('<')) {
      newContent = newContent.replace(/<([^>]+)>\s*<\/\1>/g, '')
      newContent = newContent.replace(/^\s*<br\s*\/?>\s*$/gm, '')
    }

    setBoardContent(newContent)
    saveBoardContent(newContent)
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
Subject: Data Structures - Trees & Graphs
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

  const handleVoiceClean = () => {
    if (!isOnline) {
      showNotification('⚠ Voice recognition requires an internet connection', 'error')
      return
    }

    if (voiceClean.isListening) {
      voiceClean.stopListening()
      showNotification('🛑 Voice command cancelled', 'info')
    } else {
      voiceClean.startListening()
      showNotification('🎤 Say: "clear everything", "clean algorithms", or "clear diagrams"', 'info')
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

  const isListening = voiceWrite.isListening || voiceClean.isListening
  const timeLeft = voiceWrite.isListening ? voiceWrite.timeLeft : voiceClean.timeLeft

  return (
    <div className="page-container">
      {notification && (
        <div className={`notification notification-${notificationType}`}>
          {notificationType === 'error' && <i className="fas fa-exclamation-circle"></i>}
          {notificationType === 'success' && <i className="fas fa-check-circle"></i>}
          {notificationType === 'info' && <i className="fas fa-info-circle"></i>}
          <span>{notification}</span>
          
          <NetworkCheck onNetworkChange={setIsOnline} />
        </div>
      )}

      {!isOnline && (
        <div className="offline-banner">
          <i className="fas fa-wifi-slash"></i>
          <span>You are offline. Voice features are disabled.</span>
        </div>
      )}
      
      <div className="container">
        <Header isListening={isListening} timeLeft={timeLeft} listeningFor={listeningFor} />
        
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
          
          <CleanPanel 
            boardUsage={boardUsage}
            onCleanOption={handleSmartClean}
          />
        </div>

        <FeaturesGrid />
        
        <TimetableSection schedule={schedule} onRefresh={fetchSchedule} />
      </div>
    </div>
  )
}