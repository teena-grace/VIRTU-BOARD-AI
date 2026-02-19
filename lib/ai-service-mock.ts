// lib/ai-service-mock.ts

interface AIResponse {
  content: string
  type: 'text' | 'code' | 'diagram' | 'flowchart' | 'uml' | 'circuit'
}

export class AIServiceMock {
  private static delay(ms: number = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 1. Auto Note Generation from Speech
  static async generateNotesFromSpeech(transcript: string): Promise<string> {
    await this.delay(1500)
    return `
## 📝 Lecture Notes (Auto-Generated)

**Topic:** ${transcript.substring(0, 50)}...

### Key Points:
- **Main Concept:** ${transcript.split(' ')[0]} - Core subject matter discussed
- **Important Details:** Understanding the fundamentals
- **Applications:** Practical use cases in real-world scenarios

### Summary:
This lecture covered important concepts related to the topic. Key takeaways include understanding the core principles and their practical applications.

### Terms to Remember:
- ${transcript.split(' ')[1] || 'Concept'}: Definition and usage
- ${transcript.split(' ')[2] || 'Principle'}: Core understanding
`
  }

  // 2. Smart Content Enhancement
  static async enhanceContent(content: string): Promise<string> {
    await this.delay(1000)
    const lines = content.split('\n').filter(l => l.trim())
    return `
# ✨ Enhanced Content

${lines.map((line, i) => `${i === 0 ? '## ' : '• '}${line}`).join('\n')}

---
*Content enhanced with better structure and formatting*
`
  }

  // 3. Generate Flowchart
  static async generateFlowchart(description: string): Promise<string> {
    await this.delay(1200)
    return `flowchart TD
    A[Start: ${description.substring(0, 20)}] --> B{Check Condition}
    B -->|Yes| C[Process Step 1]
    B -->|No| D[Alternative Path]
    C --> E[Process Step 2]
    D --> E
    E --> F[End]`
  }

  // 4. Generate UML Diagram
  static async generateUML(description: string, type: 'class' | 'sequence' | 'usecase' = 'class'): Promise<string> {
    await this.delay(1200)
    
    if (type === 'class') {
      return `classDiagram
    class User {
        +String name
        +String email
        +login()
        +logout()
    }
    class System {
        +authenticate()
        +process()
    }
    User --> System`
    }
    
    return `sequenceDiagram
    participant User
    participant System
    User->>System: Request
    System->>System: Process
    System-->>User: Response`
  }

  // 5. Generate Circuit Diagram
  static async generateCircuitDiagram(description: string): Promise<string> {
    await this.delay(1200)
    return `flowchart LR
    Battery["🔋 Battery<br/>9V"] --> Switch["⚡ Switch"]
    Switch --> Resistor["⚿ Resistor<br/>220Ω"]
    Resistor --> LED["💡 LED"]
    LED --> Ground["⏚ Ground"]`
  }

  // 6. Generate Mind Map
  static async generateMindMap(topic: string): Promise<string> {
    await this.delay(1200)
    return `mindmap
  root((${topic}))
    Concept A
      Detail 1
      Detail 2
    Concept B
      Detail 3
      Detail 4
    Concept C
      Detail 5`
  }

  // 7. Smart Summary
  static async generateSummary(content: string): Promise<string> {
    await this.delay(1000)
    return `
## 📋 Summary

**Key Points:**
- Main idea extracted from content
- Important concepts highlighted
- Critical takeaways identified

**One-Line Summary:**
${content.substring(0, 100)}...

**Important Terms:**
- Concept 1: Key definition
- Concept 2: Important principle
`
  }

  // 8. Generate Questions
  static async generateQuestions(content: string): Promise<string> {
    await this.delay(1000)
    return `
**Q1:** What is the main concept discussed?
**A1:** The core principle is explained in the content.

**Q2:** How does this apply in practice?
**A2:** Practical applications include real-world scenarios.

**Q3:** What are the key components?
**A3:** The main elements are structured systematically.

**Q4:** Why is this important?
**A4:** Understanding this helps build foundational knowledge.

**Q5:** What should you remember?
**A5:** Focus on the core concepts and their relationships.
`
  }

  // 9. Smart Diagram Generation
  static async smartDiagramGeneration(description: string): Promise<AIResponse> {
    await this.delay(1200)
    return {
      content: await this.generateFlowchart(description),
      type: 'diagram'
    }
  }

  // 10. Clean and Organize
  static async cleanAndOrganize(content: string): Promise<string> {
    await this.delay(1000)
    const lines = content.split('\n').filter(l => l.trim())
    const organized = lines.reduce((acc: string[], line, i) => {
      if (i === 0) acc.push(`# ${line}`)
      else if (line.includes(':')) acc.push(`\n## ${line}`)
      else acc.push(`• ${line}`)
      return acc
    }, [])
    
    return organized.join('\n')
  }

  // 11. Smart Clean
  static async smartClean(content: string, command?: string, type?: string): Promise<string> {
    await this.delay(1000)
    
    if (type === 'remove_diagrams') {
      return content.replace(/```mermaid[\s\S]*?```/g, '')
    }
    if (type === 'remove_code') {
      return content.replace(/```[\s\S]*?```/g, '')
    }
    if (type === 'organize') {
      return await this.cleanAndOrganize(content)
    }
    
    return content
  }

  // Dummy methods for compatibility
  static async formatAndExplainCode(code: string, language: string = 'auto'): Promise<AIResponse> {
    await this.delay(1000)
    return {
      content: `**Formatted Code:**\n\`\`\`${language}\n${code}\n\`\`\`\n\n**Explanation:** Code has been formatted.`,
      type: 'code'
    }
  }

  static async explainAlgorithm(algorithm: string): Promise<string> {
    await this.delay(1000)
    return `# Algorithm: ${algorithm}\n\n**What it does:** Processes data step by step.\n**Complexity:** O(n)\n**Use case:** Data processing`
  }
}