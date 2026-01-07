export interface Lecture {
  id: string
  time: string
  subject: string
  room: string
  status: 'active' | 'upcoming' | 'completed'
  professor?: string
  day?: string
}

export interface BoardData {
  content: string
  isPinned: boolean
  lastUpdated: string
  sections: BoardSection[]
}

export interface BoardSection {
  id: string
  title: string
  content: string
  isPinned: boolean
  timestamp: string
}

export interface Feature {
  icon: string
  title: string
  description: string
}

export interface CleanOption {
  id: string
  label: string
  icon: string
  action: 'partial' | 'diagrams' | 'unpinned' | 'all'
}

// Speech Recognition types
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}