// hooks/useVoiceControl.ts
import { useState, useCallback } from 'react'
import { useSpeechRecognition } from './useSpeechRecognition'
import { VoiceCommandParser } from '@/lib/voiceCommands'

interface UseVoiceControlProps {
  onCommand: (action: string, params?: any) => void
  onNotification: (message: string, type: 'success' | 'error' | 'info') => void
}

export function useVoiceControl({ onCommand, onNotification }: UseVoiceControlProps) {
  const [isActive, setIsActive] = useState(false)
  const [lastCommand, setLastCommand] = useState<string>('')

  const voiceControl = useSpeechRecognition({
    onResult: (transcript) => {
      const command = VoiceCommandParser.parse(transcript)
      
      if (command) {
        setLastCommand(command.action)
        onCommand(command.action, command.params)
        onNotification(`✓ Command: ${transcript}`, 'success')
      } else {
        onNotification(`❌ Unknown command: "${transcript}"`, 'error')
        onNotification('💡 Say "show commands" to see available commands', 'info')
      }
    },
    onError: (error) => {
      onNotification(error, 'error')
      if (error.includes('Microphone') || error.includes('denied')) {
        setIsActive(false)
      }
    },
    onStart: () => {
      setIsActive(true)
    },
    onEnd: () => {
      setIsActive(false)
    },
    silenceTimeout: 2000
  })

  const startVoiceControl = useCallback(() => {
    voiceControl.startListening()
    onNotification('🎤 Voice Control Active - Say a command', 'info')
  }, [voiceControl, onNotification])

  const stopVoiceControl = useCallback(() => {
    voiceControl.stopListening()
    setIsActive(false)
    onNotification('🛑 Voice Control Stopped', 'info')
  }, [voiceControl, onNotification])

  const toggleVoiceControl = useCallback(() => {
    if (isActive) {
      stopVoiceControl()
    } else {
      startVoiceControl()
    }
  }, [isActive, startVoiceControl, stopVoiceControl])

  return {
    isActive,
    lastCommand,
    startVoiceControl,
    stopVoiceControl,
    toggleVoiceControl,
    timeLeft: voiceControl.timeLeft
  }
}