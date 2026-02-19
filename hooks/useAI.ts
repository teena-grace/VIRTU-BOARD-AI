// hooks/useAI.ts
import { useState } from 'react'

interface AIOptions {
  type?: 'class' | 'sequence' | 'usecase'
  language?: string
}

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callAI = async (action: string, content: string, options?: AIOptions) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, content, options })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'AI request failed')
      }

      return data.result
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    generateNotes: (transcript: string) => callAI('generate_notes', transcript),
    enhanceContent: (content: string) => callAI('enhance_content', content),
    generateFlowchart: (description: string) => callAI('generate_flowchart', description),
    generateUML: (description: string, type?: 'class' | 'sequence' | 'usecase') => 
      callAI('generate_uml', description, { type }),
    generateCircuit: (description: string) => callAI('generate_circuit', description),
    formatCode: (code: string, language?: string) => 
      callAI('format_code', code, { language }),
    explainAlgorithm: (algorithm: string) => callAI('explain_algorithm', algorithm),
    generateMindMap: (topic: string) => callAI('generate_mindmap', topic),
    generateSummary: (content: string) => callAI('generate_summary', content),
    generateQuestions: (content: string) => callAI('generate_questions', content),
    smartDiagram: (description: string) => callAI('smart_diagram', description),
    cleanAndOrganize: (content: string) => callAI('clean_organize', content)
  }
}