// app/api/ai/route.ts
import { NextResponse } from 'next/server'
import { AIService } from '@/lib/ai-service'

export async function POST(request: Request) {
  try {
    const { action, content, options } = await request.json()

    let result: any

    switch (action) {
      case 'generate_notes':
        result = await AIService.generateNotesFromSpeech(content)
        break

      case 'enhance_content':
        result = await AIService.enhanceContent(content)
        break

      case 'generate_flowchart':
        result = await AIService.generateFlowchart(content)
        break

      case 'generate_uml':
        result = await AIService.generateUML(content, options?.type)
        break

      case 'generate_circuit':
        result = await AIService.generateCircuitDiagram(content)
        break

      case 'format_code':
        result = await AIService.formatAndExplainCode(content, options?.language)
        break

      case 'explain_algorithm':
        result = await AIService.explainAlgorithm(content)
        break

      case 'generate_mindmap':
        result = await AIService.generateMindMap(content)
        break

      case 'generate_summary':
        result = await AIService.generateSummary(content)
        break

      case 'generate_questions':
        result = await AIService.generateQuestions(content)
        break

      case 'smart_diagram':
        result = await AIService.smartDiagramGeneration(content)
        break

      case 'clean_organize':
        result = await AIService.cleanAndOrganize(content)
        break
      
      case 'smart_clean':
  result = await AIService.smartClean(content, options?.command, options?.type)
  break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ result })
  } catch (error: any) {
    console.error('AI API Error:', error)
    return NextResponse.json(
      { error: error.message || 'AI processing failed' },
      { status: 500 }
    )
  }
}