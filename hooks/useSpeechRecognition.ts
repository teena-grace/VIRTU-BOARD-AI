'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseSpeechRecognitionProps {
  onResult: (transcript: string) => void
  onError?: (error: string) => void
  onStart?: () => void
  onEnd?: () => void
  continuous?: boolean
  lang?: string
  timeout?: number
}

export const useSpeechRecognition = ({
  onResult,
  onError,
  onStart,
  onEnd,
  continuous = false,
  lang = 'en-US',
  timeout = 10000
}: UseSpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0)
  const recognitionRef = useRef<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const maxRetries = 3

  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [])

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch (e) {
        // Ignore errors during cleanup
      }
      recognitionRef.current = null
    }
    setIsListening(false)
    setTimeLeft(0)
  }, [])

  const checkSupport = useCallback(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    setIsSupported(supported)
    return supported
  }, [])

  const checkMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      return true
    } catch (error) {
      return false
    }
  }, [])

  const startCountdown = useCallback(() => {
    setTimeLeft(timeout / 1000)
    
    countdownRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current)
            countdownRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [timeout])

  const startListening = useCallback(async () => {
    cleanup()

    if (!checkSupport()) {
      onError?.('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.')
      return
    }

    // Check internet connection first
    if (!navigator.onLine) {
      onError?.('No internet connection detected. Speech recognition requires internet connectivity.')
      return
    }

    // Check microphone permission
    const hasPermission = await checkMicrophonePermission()
    if (!hasPermission) {
      onError?.('Microphone access denied. Please allow microphone permissions.')
      return
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false // Set to false to avoid hanging
      recognition.interimResults = true
      recognition.lang = lang
      recognition.maxAlternatives = 1

      let finalTranscript = ''
      let hasReceivedResult = false

      recognition.onstart = () => {
        console.log('✓ Speech recognition started successfully')
        setIsListening(true)
        onStart?.()
        startCountdown()
        retryCountRef.current = 0

        // Shorter timeout to prevent hanging
        timeoutRef.current = setTimeout(() => {
          console.log('⏱ Timeout reached')
          if (recognitionRef.current) {
            try {
              recognition.stop()
            } catch (e) {
              console.error('Error stopping recognition:', e)
            }
            
            if (!hasReceivedResult) {
              onError?.('No speech detected. Please speak clearly and try again.')
            }
          }
        }, timeout)
      }

      recognition.onresult = (event: any) => {
        hasReceivedResult = true
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          
          if (event.results[i].isFinal) {
            finalTranscript = transcript
            console.log('✓ Final transcript:', transcript)
            
            // Clear timeout since we got a result
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
              timeoutRef.current = null
            }
            
            // Process result
            if (finalTranscript.trim()) {
              onResult(finalTranscript.trim())
            }
            
            // Stop recognition
            setTimeout(() => {
              if (recognitionRef.current) {
                try {
                  recognitionRef.current.stop()
                } catch (e) {
                  cleanup()
                }
              }
            }, 100)
          }
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        
        let shouldRetry = false
        let errorMessage = 'Speech recognition error occurred.'

        switch (event.error) {
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.'
            // Auto-retry on network errors
            if (retryCountRef.current < maxRetries && navigator.onLine) {
              shouldRetry = true
              retryCountRef.current++
              console.log(`Retrying... (${retryCountRef.current}/${maxRetries})`)
            } else {
              errorMessage = 'Network error persists. Please check your connection and try again.'
            }
            break
            
          case 'not-allowed':
          case 'service-not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone permissions in your browser.'
            break
            
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.'
            break
            
          case 'audio-capture':
            errorMessage = 'No microphone found. Please connect a microphone.'
            break
            
          case 'aborted':
            // Don't show error for manual abort
            cleanup()
            return
            
          default:
            errorMessage = `Error: ${event.error}`
        }

        cleanup()
        
        if (shouldRetry) {
          // Retry after a short delay
          setTimeout(() => {
            console.log('Retrying speech recognition...')
            startListening()
          }, 1000)
        } else {
          onError?.(errorMessage)
        }
      }

      recognition.onend = () => {
        console.log('Speech recognition ended')
        cleanup()
        onEnd?.()
      }

      recognitionRef.current = recognition
      
      // Small delay before starting to ensure browser is ready
      setTimeout(() => {
        try {
          recognition.start()
          console.log('Starting speech recognition...')
        } catch (error) {
          console.error('Failed to start recognition:', error)
          cleanup()
          onError?.('Failed to start speech recognition. Please try again.')
        }
      }, 100)
      
    } catch (error) {
      console.error('Error initializing speech recognition:', error)
      cleanup()
      onError?.('Failed to initialize speech recognition. Please refresh and try again.')
    }
  }, [
    checkSupport, 
    checkMicrophonePermission, 
    lang, 
    onResult, 
    onError, 
    onStart, 
    onEnd, 
    timeout,
    cleanup,
    startCountdown
  ])

  const stopListening = useCallback(() => {
    console.log('Manually stopping speech recognition')
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        console.error('Error stopping recognition:', e)
      }
    }
    cleanup()
  }, [cleanup])

  return {
    isListening,
    isSupported,
    timeLeft,
    startListening,
    stopListening
  }
}