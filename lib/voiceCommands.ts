// lib/voiceCommands.ts

export interface VoiceCommand {
  patterns: RegExp[]
  action: string
  params?: any
  description: string
  category: 'board' | 'ai' | 'navigation' | 'system' | 'content'
}

export const VOICE_COMMANDS: VoiceCommand[] = [
  // ===== BOARD COMMANDS =====
  {
    patterns: [
      /clear (the )?board/i,
      /erase (the )?board/i,
      /delete everything/i,
      /wipe (the )?board/i
    ],
    action: 'CLEAR_BOARD',
    description: 'Clear the entire board',
    category: 'board'
  },
  {
    patterns: [
      /undo/i,
      /go back/i,
      /revert/i,
      /undo (last|previous) (action|change)/i
    ],
    action: 'UNDO',
    description: 'Undo last action',
    category: 'board'
  },
  {
    patterns: [
      /pin (the )?board/i,
      /lock (the )?board/i,
      /protect (the )?board/i
    ],
    action: 'PIN_BOARD',
    description: 'Pin/Lock the board',
    category: 'board'
  },
  {
    patterns: [
      /unpin (the )?board/i,
      /unlock (the )?board/i,
      /unprotect (the )?board/i
    ],
    action: 'UNPIN_BOARD',
    description: 'Unpin/Unlock the board',
    category: 'board'
  },
  {
    patterns: [
      /download (my )?notes/i,
      /save (my )?notes/i,
      /export (my )?notes/i,
      /download (the )?board/i
    ],
    action: 'DOWNLOAD',
    description: 'Download notes as text file',
    category: 'board'
  },

  // ===== AI COMMANDS =====
  {
    patterns: [
      /enhance (the |my )?content/i,
      /improve (the |my )?content/i,
      /make it better/i
    ],
    action: 'AI_ENHANCE',
    description: 'AI enhance content',
    category: 'ai'
  },
  {
    patterns: [
      /summarize (this|the content|my notes)/i,
      /create (a )?summary/i,
      /give me (a )?summary/i
    ],
    action: 'AI_SUMMARY',
    description: 'Generate AI summary',
    category: 'ai'
  },
  {
    patterns: [
      /generate questions/i,
      /create (study )?questions/i,
      /make (me )?(study )?questions/i,
      /quiz me/i
    ],
    action: 'AI_QUESTIONS',
    description: 'Generate study questions',
    category: 'ai'
  },
  {
    patterns: [
      /create (a )?flowchart (for|about) (.+)/i,
      /make (a )?flowchart (for|about) (.+)/i,
      /draw (a )?flowchart (for|about) (.+)/i
    ],
    action: 'AI_FLOWCHART',
    description: 'Create flowchart diagram',
    category: 'ai'
  },
  {
    patterns: [
      /create (a )?mind ?map (for|about) (.+)/i,
      /make (a )?mind ?map (for|about) (.+)/i,
      /draw (a )?mind ?map (for|about) (.+)/i
    ],
    action: 'AI_MINDMAP',
    description: 'Create mind map',
    category: 'ai'
  },
  {
    patterns: [
      /create (a )?circuit (for|about) (.+)/i,
      /make (a )?circuit (for|about) (.+)/i,
      /draw (a )?circuit (for|about) (.+)/i
    ],
    action: 'AI_CIRCUIT',
    description: 'Create circuit diagram',
    category: 'ai'
  },
  {
    patterns: [
      /organize (the |my )?content/i,
      /organize (the |my )?notes/i,
      /clean up (the )?board/i
    ],
    action: 'AI_ORGANIZE',
    description: 'Organize content with AI',
    category: 'ai'
  },

  // ===== CONTENT COMMANDS =====
  {
    patterns: [
      /write (.+)/i,
      /add (.+)/i,
      /type (.+)/i,
      /insert (.+)/i
    ],
    action: 'ADD_TEXT',
    description: 'Add text to board',
    category: 'content'
  },
  {
    patterns: [
      /start (taking |writing )?notes/i,
      /begin (taking |writing )?notes/i,
      /take notes/i
    ],
    action: 'START_NOTES',
    description: 'Start voice note-taking',
    category: 'content'
  },
  {
    patterns: [
      /stop (taking |writing )?notes/i,
      /end (taking |writing )?notes/i,
      /finish notes/i
    ],
    action: 'STOP_NOTES',
    description: 'Stop voice note-taking',
    category: 'content'
  },

  // ===== CLEANING COMMANDS =====
  {
    patterns: [
      /remove (all )?diagrams/i,
      /delete (all )?diagrams/i,
      /clear (all )?diagrams/i
    ],
    action: 'REMOVE_DIAGRAMS',
    description: 'Remove all diagrams',
    category: 'board'
  },
  {
    patterns: [
      /remove (all )?code/i,
      /delete (all )?code/i,
      /clear (all )?code/i
    ],
    action: 'REMOVE_CODE',
    description: 'Remove all code blocks',
    category: 'board'
  },
  {
    patterns: [
      /keep (only )?(important|key) (points|content)/i,
      /show (only )?(important|key) (points|content)/i
    ],
    action: 'KEEP_IMPORTANT',
    description: 'Keep only important content',
    category: 'board'
  },

  // ===== NAVIGATION COMMANDS =====
  {
    patterns: [
      /scroll (to )?(the )?top/i,
      /go (to )?(the )?top/i,
      /move (to )?(the )?top/i
    ],
    action: 'SCROLL_TOP',
    description: 'Scroll to top of page',
    category: 'navigation'
  },
  {
    patterns: [
      /scroll (to )?(the )?bottom/i,
      /go (to )?(the )?bottom/i,
      /move (to )?(the )?bottom/i
    ],
    action: 'SCROLL_BOTTOM',
    description: 'Scroll to bottom of page',
    category: 'navigation'
  },
  {
    patterns: [
      /scroll down/i,
      /move down/i,
      /page down/i
    ],
    action: 'SCROLL_DOWN',
    description: 'Scroll down',
    category: 'navigation'
  },
  {
    patterns: [
      /scroll up/i,
      /move up/i,
      /page up/i
    ],
    action: 'SCROLL_UP',
    description: 'Scroll up',
    category: 'navigation'
  },
  {
    patterns: [
      /show (the )?schedule/i,
      /view (the )?schedule/i,
      /open (the )?schedule/i
    ],
    action: 'SHOW_SCHEDULE',
    description: 'Show timetable',
    category: 'navigation'
  },

  // ===== SYSTEM COMMANDS =====
  {
    patterns: [
      /mark (my )?attendance/i,
      /mark me present/i,
      /take attendance/i,
      /i'?m here/i
    ],
    action: 'MARK_ATTENDANCE',
    description: 'Mark attendance for current lecture',
    category: 'system'
  },
  {
    patterns: [
      /refresh (the )?(page|board)/i,
      /reload (the )?(page|board)/i
    ],
    action: 'REFRESH',
    description: 'Refresh the page',
    category: 'system'
  },
  {
    patterns: [
      /log ?out/i,
      /sign out/i,
      /exit/i
    ],
    action: 'LOGOUT',
    description: 'Logout from system',
    category: 'system'
  },
  {
    patterns: [
      /(show |open )?(voice )?commands/i,
      /(show |open )?help/i,
      /what can (i|you) (say|do)/i,
      /available commands/i
    ],
    action: 'SHOW_HELP',
    description: 'Show all voice commands',
    category: 'system'
  },
  {
    patterns: [
      /stop listening/i,
      /disable voice/i,
      /turn off voice/i,
      /voice off/i
    ],
    action: 'STOP_VOICE',
    description: 'Stop voice control',
    category: 'system'
  }
]

export class VoiceCommandParser {
  static parse(transcript: string): { action: string; params?: any } | null {
    const text = transcript.trim()
    
    console.log('🎤 Parsing voice command:', text)
    
    for (const command of VOICE_COMMANDS) {
      for (const pattern of command.patterns) {
        const match = text.match(pattern)
        if (match) {
          console.log('✅ Matched command:', command.action)
          
          // Extract parameters from capture groups
          let params = command.params || {}
          
          // For commands like "create flowchart for bubble sort"
          if (match.length > 1) {
            const capturedText = match[match.length - 1]
            if (capturedText && capturedText.length > 2) {
              params = { ...params, text: capturedText.trim() }
            }
          }
          
          return { action: command.action, params }
        }
      }
    }
    
    console.log('❌ No command matched')
    return null
  }
  
  static getCommandsByCategory(category: string): VoiceCommand[] {
    return VOICE_COMMANDS.filter(cmd => cmd.category === category)
  }
  
  static getAllCommands(): VoiceCommand[] {
    return VOICE_COMMANDS
  }
}