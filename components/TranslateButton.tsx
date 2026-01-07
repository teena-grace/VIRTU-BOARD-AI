'use client'

import { useState } from 'react'

interface TranslateButtonProps {
  content: string
  onTranslate: (translated: string) => void
}

export default function TranslateButton({ content, onTranslate }: TranslateButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false)
  const [targetLang, setTargetLang] = useState('hi')

  const languages = [
    { code: 'hi', name: 'Hindi (हिंदी)' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'de', name: 'German (Deutsch)' },
    { code: 'ja', name: 'Japanese (日本語)' },
    { code: 'zh', name: 'Chinese (中文)' },
    { code: 'ar', name: 'Arabic (العربية)' },
    { code: 'pt', name: 'Portuguese (Português)' },
    { code: 'ru', name: 'Russian (Русский)' },
    { code: 'ko', name: 'Korean (한국어)' }
  ]

  const handleTranslate = async () => {
    if (!content || content.trim() === '') {
      alert('Board is empty. Add content first!')
      return
    }

    setIsTranslating(true)
    
    try {
      // Extract text content from HTML
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
      const textContent = tempDiv.textContent || tempDiv.innerText || ''

      if (!textContent.trim()) {
        alert('No text content to translate!')
        setIsTranslating(false)
        return
      }

      // Use your backend API route instead of direct Google API call
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textContent,
          targetLang: targetLang
        })
      })

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.translatedText) {
        throw new Error('No translation returned')
      }

      const translated = data.translatedText
      
      // Wrap translated text in similar HTML structure
      const languageName = languages.find(l => l.code === targetLang)?.name || targetLang
      const formattedTranslation = `
        <div class="translated-content">
          <p><strong>🌐 Translated to ${languageName}</strong></p>
          <p>${translated}</p>
          <hr style="margin: 15px 0; border: 1px dashed rgba(144, 238, 144, 0.3);">
          <p><em>Original content:</em></p>
          ${content}
        </div>
      `
      
      onTranslate(formattedTranslation)
    } catch (error) {
      console.error('Translation error:', error)
      alert(`Translation failed: ${(error as Error).message}. Please check your API setup.`)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="translate-controls">
      <select 
        value={targetLang} 
        onChange={(e) => setTargetLang(e.target.value)}
        className="lang-select"
        disabled={isTranslating}
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      
      <button 
        className="control-btn" 
        onClick={handleTranslate}
        disabled={isTranslating}
      >
        <i className={`fas ${isTranslating ? 'fa-spinner fa-spin' : 'fa-language'}`}></i>
        <span>{isTranslating ? 'Translating...' : 'Translate'}</span>
      </button>
    </div>
  )
}