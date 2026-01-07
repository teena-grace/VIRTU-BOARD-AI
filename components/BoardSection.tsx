'use client'

import { useRef, useEffect, useState } from 'react'
import TranslateButton from './TranslateButton'  // ✅ Import

interface BoardSectionProps {
  content: string
  setContent: (content: string) => void
  isPinned: boolean
  isListening: boolean
  timeLeft?: number
  onVoiceWrite: () => void
  onSmartClean: () => void
  onUndo: () => void
  onPin: () => void
  onDownload: () => void
  onVoiceClean: () => void
}

export default function BoardSection({ 
  content, 
  setContent, 
  isPinned,
  isListening,
  timeLeft = 0,
  onVoiceWrite,
  onSmartClean,
  onUndo,
  onPin,
  onDownload,
  onVoiceClean 
}: BoardSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [wordCount, setWordCount] = useState(0)

  const defaultContent = `<div class="default-content">
    <p><strong>Generating lecture content....</strong></p>
    
  </div>`
  useEffect(() => {
    if (contentRef.current && !content) {
      contentRef.current.innerHTML = defaultContent
    }
  }, [])

  useEffect(() => {
    if (contentRef.current) {
      const text = contentRef.current.textContent || ''
      const words = text.trim().split(/\s+/).filter(word => word.length > 0)
      setWordCount(words.length)
    }
  }, [content])

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML
    setContent(newContent)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      const textNode = document.createTextNode(text)
      range.insertNode(textNode)
      range.setStartAfter(textNode)
      range.setEndAfter(textNode)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML)
    }
  }

  return (
    <div className="board-section">
      <div className={`listening-status ${isListening ? 'active' : ''}`}>
        <i className={`fas ${isListening ? 'fa-microphone-alt' : 'fa-brain'}`}></i>
        <p>
          {isListening 
            ? `"Recording... ${timeLeft}s remaining"` 
            : '"Ready to assist..."'}
        </p>
        {isListening && (
          <div className="timer-bar">
            <div 
              className="timer-fill" 
              style={{ width: `${(timeLeft / 15) * 100}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="lecture-board">
        <div className="board-title">
          <div className="title-left">
            <i className="fas fa-book-open"></i>
            <span>AI-Generated Lecture Board</span>
            {isPinned && <span className="pin-badge">🔒 Pinned</span>}
          </div>
          <div className="board-stats">
            <span className="word-count">
              <i className="fas fa-font"></i> {wordCount} words
            </span>
          </div>
        </div>
        <div 
          ref={contentRef}
          className="lecture-content" 
          contentEditable={!isPinned}
          suppressContentEditableWarning={true}
          onInput={handleInput}
          onPaste={handlePaste}
          dangerouslySetInnerHTML={{ __html: content || defaultContent }}
        />
      </div>

      <div className="controls">
        <button 
          className={`control-btn ${isListening ? 'active' : ''}`} 
          onClick={onVoiceWrite}
          disabled={isListening || isPinned}
          title="Use voice to add content"
        >
          <i className="fas fa-microphone"></i> 
          <span>Voice Write</span>
        </button>
        
        <button 
          className="control-btn" 
          onClick={onSmartClean}
          disabled={isPinned}
          title="Clear all content"
        >
          <i className="fas fa-broom"></i> 
          <span>Smart Clean</span>
        </button>
        
        <button 
          className="control-btn" 
          onClick={onUndo}
          title="Undo last action"
        >
          <i className="fas fa-undo"></i> 
          <span>Undo</span>
        </button>
        
        <button 
          className={`control-btn ${isPinned ? 'pinned' : ''}`} 
          onClick={onPin}
          title={isPinned ? 'Unpin content' : 'Pin content'}
        >
          <i className={`fas ${isPinned ? 'fa-lock' : 'fa-thumbtack'}`}></i> 
          <span>{isPinned ? 'Pinned' : 'Pin'}</span>
        </button>
        
        <button 
          className="control-btn" 
          onClick={onDownload}
          title="Download notes as text file"
        >
          <i className="fas fa-download"></i> 
          <span>Download</span>
        </button>
        
        <button 
          className={`control-btn ${isListening ? 'active' : ''}`} 
          onClick={onVoiceClean}
          disabled={isListening}
          title="Use voice commands to clean board"
        >
          <i className="fas fa-microphone-slash"></i> 
          <span>Voice Clean</span>
        </button>
      </div>

      {/* ✅ ADD TRANSLATE BUTTON HERE */}
      <div className="translate-section">
        <TranslateButton 
          content={content}
          onTranslate={(translated) => {
            setContent(translated)
            if (contentRef.current) {
              contentRef.current.innerHTML = translated
            }
          }}
        />
      </div>
    </div>
  )
}