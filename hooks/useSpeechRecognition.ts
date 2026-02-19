// hooks/useSpeechRecognition.ts
import { useState, useEffect, useRef } from 'react'

interface UseSpeechRecognitionProps {
  onResult: (transcript: string) => void
  onError: (error: string) => void
  onStart?: () => void
  onEnd?: () => void
  silenceTimeout?: number
}

export function useSpeechRecognition({
  onResult,
  onError,
  onStart,
  onEnd,
  silenceTimeout = 5000
}: UseSpeechRecognitionProps) {
  const [isListening, setIsListening] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const transcriptRef = useRef<string>('')
  const hasSpokeRef = useRef<boolean>(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (!SpeechRecognition) {
        console.error('Speech recognition not supported')
        return
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        console.log('🎤 Speech recognition started')
        setIsListening(true)
        hasSpokeRef.current = false
        transcriptRef.current = ''
        onStart?.()
      }

      recognition.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        if (interimTranscript || finalTranscript) {
          hasSpokeRef.current = true
          
          if (finalTranscript) {
            transcriptRef.current += finalTranscript
          }

          resetSilenceTimer()
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        
        let errorMessage = 'Voice recognition error'
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.'
            break
          case 'audio-capture':
            errorMessage = 'No microphone found. Please check your microphone.'
            break
          case 'not-allowed':
            errorMessage = '🎤 Microphone access denied! Click the 🔒 lock icon in your address bar and allow microphone access, then refresh the page.'
            break
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.'
            break
          case 'aborted':
            // Don't show error for user-initiated stops
            cleanup()
            return
          default:
            errorMessage = `Error: ${event.error}`
        }
        
        cleanup()
        onError(errorMessage)
      }

      recognition.onend = () => {
        console.log('🛑 Speech recognition ended')
        
        if (transcriptRef.current.trim()) {
          onResult(transcriptRef.current.trim())
        }
        
        cleanup()
        onEnd?.()
      }

      recognitionRef.current = recognition
    }

    return () => {
      cleanup()
    }
  }, [])

  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    setTimeLeft(silenceTimeout / 1000)
    
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopListening()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    silenceTimerRef.current = setTimeout(() => {
      if (recognitionRef.current && isListening) {
        console.log('⏰ Silence timeout reached, stopping...')
        stopListening()
      }
    }, silenceTimeout)
  }

  const cleanup = () => {
    setIsListening(false)
    setTimeLeft(0)
    hasSpokeRef.current = false
    transcriptRef.current = ''
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startListening = async () => {
    if (recognitionRef.current && !isListening) {
      try {
        // First, check if we have microphone permission
        if (navigator.permissions && navigator.permissions.query) {
          try {
            const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName })
            
            if (permissionStatus.state === 'denied') {
              onError('🎤 Microphone blocked! Click the lock icon 🔒 in your address bar → Allow microphone → Refresh page')
              return
            }
          } catch (e) {
            // Permission API not supported, continue anyway
            console.log('Permission API not supported, trying anyway')
          }
        }

        cleanup()
        recognitionRef.current.start()
      } catch (error: any) {
        console.error('Error starting recognition:', error)
        
        if (error.message && error.message.includes('not-allowed')) {
          onError('🎤 Microphone access denied! Please allow microphone access in your browser settings.')
        } else {
          onError('Failed to start voice recognition. Please check your microphone.')
        }
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.error('Error stopping recognition:', error)
      }
    }
  }

  return {
    isListening,
    timeLeft,
    startListening,
    stopListening
  }
}