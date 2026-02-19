// components/DiagramRenderer.tsx
'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface DiagramRendererProps {
  content: string
}

export default function DiagramRenderer({ content }: DiagramRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'arial'
    })
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      // Extract mermaid diagrams
      const mermaidRegex = /```mermaid\n([\s\S]*?)```/g
      let match
      const diagrams: string[] = []

      while ((match = mermaidRegex.exec(content)) !== null) {
        diagrams.push(match[1])
      }

      // Render diagrams
      containerRef.current.innerHTML = ''
      diagrams.forEach((diagram, index) => {
        const div = document.createElement('div')
        div.className = 'mermaid-diagram'
        div.id = `mermaid-${index}`
        div.textContent = diagram
        containerRef.current?.appendChild(div)
      })

      mermaid.contentLoaded()
    }
  }, [content])

  return (
    <div ref={containerRef} className="diagram-container">
      <style jsx>{`
        .diagram-container {
          margin: 20px 0;
        }

        :global(.mermaid-diagram) {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 16px 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        :global(.mermaid-diagram svg) {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  )
}