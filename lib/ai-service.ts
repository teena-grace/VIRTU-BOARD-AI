// lib/ai-service.ts

interface AIResponse {
  content: string
  type: 'text' | 'code' | 'diagram' | 'flowchart' | 'uml' | 'circuit'
}

// Check if we're in mock mode
const API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
const USE_MOCK = !API_KEY || 
                 API_KEY === '' || 
                 API_KEY.includes('xxxxx') ||
                 API_KEY.includes('your')

if (USE_MOCK) {
  console.log('🎭 AI Service running in MOCK MODE (Free - No API Key Required)')
} else {
  console.log('🤖 AI Service running in REAL MODE (Using Anthropic API)')
}

// ===== NATURAL LANGUAGE COMMAND PARSER =====
class NaturalLanguageParser {
  static parseCleanCommand(command: string, content: string): string {
    const cmd = command.toLowerCase()
    
    // INSTANT STOP WORDS
    const stopWords = ['done', 'stop', 'finish', 'that\'s it', 'okay', 'submit']
    if (stopWords.some(word => cmd.includes(word))) {
      console.log('✅ Stop word detected, processing immediately...')
      return content
    }
    
    const patterns = {
      clearAll: /clear (all|everything)|delete (all|everything)|remove (all|everything)|clean (all|everything)|wipe|reset/,
      removeDiagrams: /remove (all )?diagram|delete (all )?diagram|clear (all )?diagram|get rid of diagram/,
      removeCode: /remove (all )?code|delete (all )?code|clear (all )?code|get rid of code/,
      removeImages: /remove (all )?(image|picture)|delete (all )?(image|picture)/,
      keepImportant: /keep (only )?(important|key|main)|only (important|key|main)/,
      keepNotes: /keep (only )?notes|only notes/,
      keepText: /keep (only )?(text|content)|only (text|content)/,
      organize: /organize|structure|format|arrange|tidy|clean up/,
      simplify: /simplify|make (it )?(simple|easy)/,
      removeAlgorithms: /remove (all )?algorithm|delete (all )?algorithm/,
      removeExamples: /remove (all )?example|delete (all )?example/,
      removeQuestions: /remove (all )?question|delete (all )?question/,
      removeSummary: /remove (all )?summar/,
    }
    
    console.log('🎤 Voice Command:', command)
    console.log('🔍 Parsing command...')
    
    if (patterns.clearAll.test(cmd)) {
      console.log('✅ Detected: Clear Everything')
      return ''
    }
    
    if (patterns.removeDiagrams.test(cmd)) {
      console.log('✅ Detected: Remove Diagrams')
      return content.replace(/```mermaid[\s\S]*?```/g, '')
                   .replace(/##.*diagram.*/gi, '')
                   .replace(/##.*flowchart.*/gi, '')
                   .replace(/##.*circuit.*/gi, '')
                   .trim()
    }
    
    if (patterns.removeCode.test(cmd)) {
      console.log('✅ Detected: Remove Code')
      return content.replace(/```[\s\S]*?```/g, '')
                   .replace(/##.*code.*/gi, '')
                   .trim()
    }
    
    if (patterns.keepImportant.test(cmd)) {
      console.log('✅ Detected: Keep Only Important')
      const lines = content.split('\n')
      return lines.filter(line => {
        const lower = line.toLowerCase()
        return lower.includes('important') ||
               lower.includes('key') ||
               lower.includes('main') ||
               lower.includes('###') ||
               lower.includes('**') ||
               line.startsWith('#')
      }).join('\n')
    }
    
    if (patterns.keepNotes.test(cmd)) {
      console.log('✅ Detected: Keep Only Notes')
      return content.replace(/```[\s\S]*?```/g, '')
                   .split('\n')
                   .filter(line => !line.includes('![') && line.trim())
                   .join('\n')
    }
    
    if (patterns.organize.test(cmd)) {
      console.log('✅ Detected: Organize Content')
      return this.organizeContent(content)
    }
    
    if (patterns.simplify.test(cmd)) {
      console.log('✅ Detected: Simplify')
      const lines = content.split('\n').filter(l => l.trim())
      return lines.map(line => {
        return line.replace(/\*\*/g, '')
                  .replace(/##/g, '')
                  .replace(/###/g, '')
                  .trim()
      }).join('\n')
    }
    
    if (patterns.removeAlgorithms.test(cmd)) {
      console.log('✅ Detected: Remove Algorithms')
      return content.split('\n')
                   .filter(line => {
                     const lower = line.toLowerCase()
                     return !lower.includes('algorithm') &&
                            !lower.includes('function') &&
                            !lower.includes('complexity')
                   })
                   .join('\n')
    }
    
    if (patterns.removeQuestions.test(cmd)) {
      console.log('✅ Detected: Remove Questions')
      return content.replace(/##.*question.*/gi, '')
                   .replace(/\*\*Q\d+:[\s\S]*?\*\*A\d+:[\s\S]*?(?=\n|$)/g, '')
                   .trim()
    }
    
    if (patterns.removeSummary.test(cmd)) {
      console.log('✅ Detected: Remove Summary')
      return content.replace(/##.*summary.*/gi, '')
                   .replace(/### Summary[\s\S]*?(?=##|$)/gi, '')
                   .trim()
    }
    
    console.log('⚠️ No exact match, using smart cleaning...')
    return this.smartClean(cmd, content)
  }
  
  static organizeContent(content: string): string {
    const lines = content.split('\n').filter(l => l.trim())
    const sections: { [key: string]: string[] } = {
      headers: [],
      important: [],
      notes: [],
      other: []
    }
    
    lines.forEach(line => {
      if (line.startsWith('#')) {
        sections.headers.push(line)
      } else if (line.includes('**') || line.toLowerCase().includes('important')) {
        sections.important.push(line)
      } else if (line.startsWith('•') || line.startsWith('-')) {
        sections.notes.push(line)
      } else {
        sections.other.push(line)
      }
    })
    
    let organized = '# 🧹 Organized Content\n\n'
    
    if (sections.headers.length > 0) {
      organized += sections.headers.join('\n') + '\n\n'
    }
    
    if (sections.important.length > 0) {
      organized += '## ⭐ Key Points\n'
      organized += sections.important.join('\n') + '\n\n'
    }
    
    if (sections.notes.length > 0) {
      organized += '## 📝 Notes\n'
      organized += sections.notes.join('\n') + '\n\n'
    }
    
    if (sections.other.length > 0) {
      organized += '## 📄 Additional Information\n'
      organized += sections.other.join('\n')
    }
    
    return organized
  }
  
  static smartClean(cmd: string, content: string): string {
    const removeWords = ['remove', 'delete', 'clear', 'get rid of', 'erase']
    const keepWords = ['keep', 'save', 'preserve', 'only']
    
    if (removeWords.some(word => cmd.includes(word))) {
      if (cmd.includes('everything') || cmd.includes('all')) {
        return ''
      }
      
      const lines = content.split('\n')
      return lines.filter(line => {
        const lower = line.toLowerCase()
        return !lower.includes(cmd.replace(/remove|delete|clear/gi, '').trim())
      }).join('\n')
    }
    
    if (keepWords.some(word => cmd.includes(word))) {
      const searchTerm = cmd.replace(/keep|only|save/gi, '').trim()
      const lines = content.split('\n')
      return lines.filter(line => {
        return line.toLowerCase().includes(searchTerm) || line.startsWith('#')
      }).join('\n')
    }
    
    return this.organizeContent(content)
  }
}

// ===== MAIN AI SERVICE =====
export class AIService {
  private static delay(ms: number = 1500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private static async callAI(prompt: string): Promise<string> {
    if (USE_MOCK) {
      throw new Error('MOCK_MODE')
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY!,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }]
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'API request failed')
      }

      const data = await response.json()
      return data.content[0].text
    } catch (error: any) {
      console.error('AI API Error:', error)
      throw error
    }
  }

  static async generateNotesFromSpeech(transcript: string): Promise<string> {
    try {
      const prompt = `Convert this lecture transcript into well-structured notes with headings, bullet points, and emojis:\n\n${transcript}`
      return await this.callAI(prompt)
    } catch (error: any) {
      if (error.message === 'MOCK_MODE' || USE_MOCK) {
        await this.delay(1500)
        return `## 📝 Lecture Notes

**Topic:** ${transcript.substring(0, 50)}...

### 🎯 Key Points:
- **Main Concept:** ${transcript.split(' ').slice(0, 3).join(' ')}
- **Important Details:** Understanding the fundamentals
- **Applications:** Practical real-world scenarios

### 📋 Summary:
${transcript.substring(0, 150)}...

### 🔑 Terms to Remember:
- **${transcript.split(' ')[0] || 'Concept'}**: Core principle
- **${transcript.split(' ')[1] || 'Method'}**: Key approach`
      }
      throw error
    }
  }

  static async enhanceContent(content: string): Promise<string> {
    try {
      const prompt = `Enhance this content with better structure, emojis, and formatting:\n\n${content}`
      return await this.callAI(prompt)
    } catch (error: any) {
      if (error.message === 'MOCK_MODE' || USE_MOCK) {
        await this.delay(1000)
        const lines = content.split('\n').filter(l => l.trim())
        return `# ✨ Enhanced Content

${lines.map((line, i) => {
  if (i === 0) return `## ${line}`
  if (line.includes(':')) return `\n### ${line}`
  return `• ${line}`
}).join('\n')}

---
*Content enhanced with AI*`
      }
      throw error
    }
  }

  static async generateFlowchart(description: string): Promise<string> {
    try {
      const prompt = `Create a Mermaid flowchart for: ${description}. Return ONLY Mermaid syntax starting with "flowchart TD"`
      return await this.callAI(prompt)
    } catch (error: any) {
      if (error.message === 'MOCK_MODE' || USE_MOCK) {
        await this.delay(1200)
        const topic = description.substring(0, 30)
        return `flowchart TD
    A[Start: ${topic}] --> B{Check Input}
    B -->|Valid| C[Process Data]
    B -->|Invalid| D[Error Handler]
    C --> E[Transform]
    D --> F[Return Error]
    E --> G[Output Result]
    G --> H[End]
    F --> H`
      }
      throw error
    }
  }

  static async generateUML(description: string, type: 'class' | 'sequence' | 'usecase' = 'class'): Promise<string> {
    try {
      const prompt = `Create a Mermaid ${type} diagram for: ${description}`
      return await this.callAI(prompt)
    } catch (error: any) {
      if (error.message === 'MOCK_MODE' || USE_MOCK) {
        await this.delay(1200)
        if (type === 'class') {
          return `classDiagram
    class User {
        +String id
        +String name
        +String email
        +login()
        +logout()
    }
    class Database {
        +save()
        +retrieve()
        +update()
    }
    class Service {
        +authenticate()
        +process()
    }
    User --> Service
    Service --> Database`
        } else if (type === 'sequence') {
          return `sequenceDiagram
    participant User
    participant System
    participant Database
    User->>System: Send Request
    System->>Database: Query Data
    Database-->>System: Return Data
    System-->>User: Send Response`
        }
        return `graph TD
    A[User] --> B[System]
    B --> C[Action]`
      }
      throw error
    }
  }

  static async generateCircuitDiagram(description: string): Promise<string> {
    try {
      const prompt = `Create a Mermaid circuit diagram for: ${description}`
      return await this.callAI(prompt)
    } catch (error: any) {
      if (error.message === 'MOCK_MODE' || USE_MOCK) {
        await this.delay(1200)
        return `flowchart LR
    PS["🔋 Power Source<br/>9V"] --> SW["⚡ Switch<br/>ON/OFF"]
    SW --> R1["⚿ Resistor<br/>220Ω"]
    R1 --> LED["💡 LED<br/>Red"]
    LED --> GND["⏚ Ground"]
    
    style PS fill:#ffd700
    style LED fill:#ff6b6b
    style GND fill:#333,color:#fff`
      }
      throw error
    }
  }

  static async generateMindMap(topic: string): Promise<string> {
    try {
      const prompt = `Create a Mermaid mindmap for: ${topic}`
      return await this.callAI(prompt)
    } catch (error: any) {
      if (error.message === 'MOCK_MODE' || USE_MOCK) {
        await this.delay(1200)
        return `mindmap
  root((${topic}))
    Core Concepts
      Fundamental Ideas
      Basic Principles
      Key Theories
    Applications
      Real World Use
      Practical Examples
      Case Studies
    Advanced Topics
      Complex Scenarios
      Research Areas
      Future Trends`
      }
      throw error
    }
  }

  static async generateSummary(content: string): Promise<string> {
    try {
      const prompt = `Create a concise summary with key points from:\n\n${content}`
      return await this.callAI(prompt)
    } catch (error: any) {
      if (error.message === 'MOCK_MODE' || USE_MOCK) {
        await this.delay(1000)
        const words = content.split(' ')
        return `## 📋 Smart Summary

**Key Points:**
- ${words.slice(0, 10).join(' ')}
- ${words.slice(10, 20).join(' ')}
- ${words.slice(20, 30).join(' ')}

**One-Line Summary:**
${content.substring(0, 120)}...

**Important Terms:**
- **${words[0] || 'Concept'}**: Core concept
- **${words[1] || 'Element'}**: Key element
- **${words[2] || 'Principle'}**: Important principle`
      }
      throw error
    }
  }

  static async generateQuestions(content: string): Promise<string> {
    try {
      const prompt = `Generate 5 study questions from:\n\n${content}`
      return await this.callAI(prompt)
    } catch (error: any) {
      if (error.message === 'MOCK_MODE' || USE_MOCK) {
        await this.delay(1000)
        return `## ❓ Study Questions

**Q1:** What is the main concept discussed in this content?
**A1:** The primary focus is on the fundamental principles and their applications.

**Q2:** How can this knowledge be applied practically?
**A2:** Through real-world scenarios and hands-on implementation.

**Q3:** What are the key components to remember?
**A3:** The core elements, their relationships, and practical implications.

**Q4:** Why is understanding this topic important?
**A4:** It builds foundational knowledge for advanced concepts.

**Q5:** What are the common misconceptions?
**A5:** Misunderstanding the basic principles or oversimplifying complex relationships.`
      }
      throw error
    }
  }

  static async smartDiagramGeneration(description: string): Promise<AIResponse> {
    try {
      const prompt = `Analyze and create the best diagram type for: ${description}`
      const content = await this.callAI(prompt)
      return { content, type: 'diagram' }
    } catch (error: any) {
      if (error.message === 'MOCK_MODE' || USE_MOCK) {
        const content = await this.generateFlowchart(description)
        return { content, type: 'diagram' }
      }
      throw error
    }
  }

  static async cleanAndOrganize(content: string): Promise<string> {
    try {
      const prompt = `Clean and organize this content:\n\n${content}`
      return await this.callAI(prompt)
    } catch (error: any) {
      if (error.message === 'MOCK_MODE' || USE_MOCK) {
        await this.delay(1000)
        return NaturalLanguageParser.organizeContent(content)
      }
      throw error
    }
  }

  static async smartClean(content: string, command?: string, type?: string): Promise<string> {
    try {
      let prompt = ''
      if (command) {
        prompt = `The user said: "${command}"

Current content:
${content}

Understand and execute what they want to do with the content. They might want to:
- Remove specific parts (diagrams, code, sections)
- Keep only certain content
- Organize or clean up
- Simplify or restructure

Return ONLY the cleaned content, no explanation.`
      } else if (type) {
        prompt = `Clean this content by: ${type}\n\nContent:\n${content}`
      }
      return await this.callAI(prompt)
    } catch (error: any) {
      if (error.message === 'MOCK_MODE' || USE_MOCK) {
        await this.delay(1000)
        
        if (command) {
          return NaturalLanguageParser.parseCleanCommand(command, content)
        }
        
        if (type === 'remove_diagrams') {
          return content.replace(/```mermaid[\s\S]*?```/g, '').trim()
        }
        if (type === 'remove_code') {
          return content.replace(/```[\s\S]*?```/g, '').trim()
        }
        if (type === 'organize') {
          return NaturalLanguageParser.organizeContent(content)
        }
        
        return content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join('\n')
      }
      throw error
    }
  }

  static async formatAndExplainCode(code: string, language: string = 'auto'): Promise<AIResponse> {
    try {
      const prompt = `Format and explain this code:\n\`\`\`\n${code}\n\`\`\``
      const content = await this.callAI(prompt)
      return { content, type: 'code' }
    } catch (error: any) {
      if (error.message === 'MOCK_MODE' || USE_MOCK) {
        await this.delay(1000)
        return {
          content: `**Formatted Code:**
\`\`\`${language}
${code}
\`\`\`

**Explanation:**
This code demonstrates basic programming concepts and follows standard conventions.

**Improvements:**
- Add comments for clarity
- Consider error handling
- Optimize for performance`,
          type: 'code'
        }
      }
      throw error
    }
  }

  static async explainAlgorithm(algorithm: string): Promise<string> {
    try {
      const prompt = `Explain this algorithm in simple terms: ${algorithm}`
      return await this.callAI(prompt)
    } catch (error: any) {
      if (error.message === 'MOCK_MODE' || USE_MOCK) {
        await this.delay(1000)
        return `# 🧮 Algorithm: ${algorithm}

## What it does:
This algorithm processes data systematically to achieve a specific outcome.

## How it works:
1. Initialize variables
2. Process input step by step
3. Apply logic and conditions
4. Return the result

## Complexity:
⏱️ Time: O(n)
💾 Space: O(1)

## Use Cases:
- Data processing
- Problem solving
- Optimization tasks`
      }
      throw error
    }
  }
}