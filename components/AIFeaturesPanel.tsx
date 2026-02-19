// components/AIFeaturesPanel.tsx
'use client'

import { useState } from 'react'
import { useAI } from '@/hooks/useAI'

interface AIFeaturesPanelProps {
  boardContent: string
  onContentUpdate: (content: string) => void
  onNotification: (message: string, type: 'success' | 'error' | 'info') => void
  boardUsage: number
  onSmartClean: (type: string) => void
}

export default function AIFeaturesPanel({ 
  boardContent, 
  onContentUpdate, 
  onNotification,
  boardUsage,
  onSmartClean
}: AIFeaturesPanelProps) {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [inputPrompt, setInputPrompt] = useState('')
  const [showPromptModal, setShowPromptModal] = useState(false)
  const [currentAction, setCurrentAction] = useState<string>('')

  const ai = useAI()

  const features = [
    {
      id: 'enhance',
      icon: '✨',
      name: 'Enhance Content',
      description: 'AI improves & structures',
      category: 'content',
      action: async () => {
        const result = await ai.enhanceContent(boardContent)
        onContentUpdate(result)
        onNotification('✓ Content enhanced by AI!', 'success')
      }
    },
    {
      id: 'summary',
      icon: '📝',
      name: 'Smart Summary',
      description: 'Key points extraction',
      category: 'content',
      action: async () => {
        const result = await ai.generateSummary(boardContent)
        onContentUpdate(boardContent + '\n\n## 📋 AI Summary\n' + result)
        onNotification('✓ Summary generated!', 'success')
      }
    },
    {
      id: 'questions',
      icon: '❓',
      name: 'Study Questions',
      description: 'Auto-generate quiz',
      category: 'content',
      action: async () => {
        const result = await ai.generateQuestions(boardContent)
        onContentUpdate(boardContent + '\n\n## ❓ Study Questions\n' + result)
        onNotification('✓ Questions generated!', 'success')
      }
    },
    {
      id: 'flowchart',
      icon: '📊',
      name: 'Flowchart',
      description: 'AI-generated diagram',
      category: 'diagram',
      needsPrompt: true,
      action: async (prompt: string) => {
        const result = await ai.generateFlowchart(prompt)
        onContentUpdate(boardContent + '\n\n## 📊 Flowchart\n```mermaid\n' + result + '\n```')
        onNotification('✓ Flowchart created!', 'success')
      }
    },
    {
      id: 'uml',
      icon: '🔷',
      name: 'UML Diagram',
      description: 'Class/Sequence diagram',
      category: 'diagram',
      needsPrompt: true,
      action: async (prompt: string) => {
        const result = await ai.generateUML(prompt, 'class')
        onContentUpdate(boardContent + '\n\n## 🔷 UML Diagram\n```mermaid\n' + result + '\n```')
        onNotification('✓ UML created!', 'success')
      }
    },
    {
      id: 'circuit',
      icon: '⚡',
      name: 'Circuit',
      description: 'Electronics diagram',
      category: 'diagram',
      needsPrompt: true,
      action: async (prompt: string) => {
        const result = await ai.generateCircuit(prompt)
        onContentUpdate(boardContent + '\n\n## ⚡ Circuit\n```mermaid\n' + result + '\n```')
        onNotification('✓ Circuit created!', 'success')
      }
    },
    {
      id: 'mindmap',
      icon: '🧠',
      name: 'Mind Map',
      description: 'Concept visualization',
      category: 'diagram',
      needsPrompt: true,
      action: async (prompt: string) => {
        const result = await ai.generateMindMap(prompt)
        onContentUpdate(boardContent + '\n\n## 🧠 Mind Map\n```mermaid\n' + result + '\n```')
        onNotification('✓ Mind map created!', 'success')
      }
    },
    {
      id: 'smart_diagram',
      icon: '🎯',
      name: 'Smart Diagram',
      description: 'AI picks best type',
      category: 'diagram',
      needsPrompt: true,
      action: async (prompt: string) => {
        const result = await ai.smartDiagram(prompt)
        onContentUpdate(boardContent + '\n\n## 🎯 Smart Diagram\n```mermaid\n' + result.content + '\n```')
        onNotification('✓ Diagram created!', 'success')
      }
    }
  ]

  const cleanOptions = [
    { type: 'organize', icon: '🧹', label: 'Organize', description: 'AI reorganizes content' },
    { type: 'remove_diagrams', icon: '📊', label: 'Remove Diagrams', description: 'Clear all diagrams' },
    { type: 'remove_code', icon: '💻', label: 'Remove Code', description: 'Clear code blocks' },
    { type: 'all', icon: '🗑️', label: 'Clear All', description: 'Empty board' }
  ]

  const handleFeatureClick = async (feature: any) => {
    if (!boardContent && !feature.needsPrompt) {
      onNotification('Board is empty. Add content first!', 'error')
      return
    }

    setActiveFeature(feature.id)

    try {
      if (feature.needsPrompt) {
        setCurrentAction(feature.id)
        setShowPromptModal(true)
      } else {
        await feature.action()
      }
    } catch (error: any) {
      onNotification('AI Error: ' + error.message, 'error')
    } finally {
      setActiveFeature(null)
    }
  }

  const handlePromptSubmit = async () => {
    if (!inputPrompt.trim()) {
      onNotification('Please enter a description', 'error')
      return
    }

    const feature = features.find(f => f.id === currentAction)
    if (feature && feature.action) {
      try {
        setActiveFeature(feature.id)
        await feature.action(inputPrompt)
        setShowPromptModal(false)
        setInputPrompt('')
      } catch (error: any) {
        onNotification('AI Error: ' + error.message, 'error')
      } finally {
        setActiveFeature(null)
      }
    }
  }

  return (
    <>
      <div className="ai-panel">
        {/* Board Usage Stats */}
        <div className="usage-section">
          <div className="usage-header">
            <span className="usage-label">Board Usage</span>
            <span className="usage-value">{boardUsage.toFixed(0)}%</span>
          </div>
          <div className="usage-bar">
            <div 
              className="usage-fill" 
              style={{ width: `${Math.min(boardUsage, 100)}%` }}
            />
          </div>
        </div>

        {/* AI Smart Clean Section */}
        <div className="section">
          <h3 className="section-title">
            <span className="mr-2">🤖</span>
            AI Smart Clean
          </h3>
          <div className="clean-grid">
            {cleanOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => onSmartClean(option.type)}
                className="clean-card"
              >
                <div className="clean-icon">{option.icon}</div>
                <div className="clean-label">{option.label}</div>
                <div className="clean-description">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Content Features */}
        <div className="section">
          <h3 className="section-title">
            <span className="mr-2">✨</span>
            AI Content Tools
          </h3>
          <div className="features-grid">
            {features.filter(f => f.category === 'content').map((feature) => (
              <button
                key={feature.id}
                onClick={() => handleFeatureClick(feature)}
                disabled={ai.loading && activeFeature === feature.id}
                className={`feature-card ${activeFeature === feature.id ? 'active' : ''}`}
              >
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-name">{feature.name}</div>
                <div className="feature-description">{feature.description}</div>
                {ai.loading && activeFeature === feature.id && (
                  <div className="feature-loading">
                    <i className="fas fa-spinner fa-spin"></i>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* AI Diagram Features */}
        <div className="section">
          <h3 className="section-title">
            <span className="mr-2">📊</span>
            AI Diagram Generator
          </h3>
          <div className="features-grid">
            {features.filter(f => f.category === 'diagram').map((feature) => (
              <button
                key={feature.id}
                onClick={() => handleFeatureClick(feature)}
                disabled={ai.loading && activeFeature === feature.id}
                className={`feature-card ${activeFeature === feature.id ? 'active' : ''}`}
              >
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-name">{feature.name}</div>
                <div className="feature-description">{feature.description}</div>
                {ai.loading && activeFeature === feature.id && (
                  <div className="feature-loading">
                    <i className="fas fa-spinner fa-spin"></i>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showPromptModal && (
        <div className="modal-overlay" onClick={() => setShowPromptModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Describe What You Need</h3>
            <textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="E.g., 'Bubble sort algorithm', 'LED circuit with 220 ohm resistor', 'User authentication system'"
              className="modal-textarea"
              autoFocus
            />
            <div className="modal-actions">
              <button
                onClick={handlePromptSubmit}
                disabled={ai.loading}
                className="modal-btn-primary"
              >
                {ai.loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic mr-2"></i>
                    Generate with AI
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowPromptModal(false)
                  setInputPrompt('')
                }}
                className="modal-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .ai-panel {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }

        .section {
          margin-bottom: 24px;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
        }

        /* Usage Stats */
        .usage-section {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          padding: 16px;
          border-radius: 10px;
          margin-bottom: 24px;
        }

        .usage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .usage-label {
          font-size: 14px;
          font-weight: 600;
          color: #166534;
        }

        .usage-value {
          font-size: 18px;
          font-weight: 700;
          color: #15803d;
        }

        .usage-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 4px;
          overflow: hidden;
        }

        .usage-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
          transition: width 0.3s ease;
        }

        /* Clean Grid */
        .clean-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .clean-card {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 2px solid #fbbf24;
          border-radius: 10px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .clean-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
          border-color: #f59e0b;
        }

        .clean-icon {
          font-size: 24px;
          margin-bottom: 6px;
        }

        .clean-label {
          font-size: 13px;
          font-weight: 600;
          color: #78350f;
          margin-bottom: 2px;
        }

        .clean-description {
          font-size: 10px;
          color: #92400e;
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 10px;
        }

        .feature-card {
          position: relative;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          padding: 14px 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .feature-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
          border-color: #22c55e;
        }

        .feature-card.active {
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          border-color: #22c55e;
        }

        .feature-card:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .feature-icon {
          font-size: 28px;
          margin-bottom: 6px;
        }

        .feature-name {
          font-size: 12px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 3px;
        }

        .feature-description {
          font-size: 10px;
          color: #6b7280;
          line-height: 1.3;
        }

        .feature-loading {
          position: absolute;
          top: 6px;
          right: 6px;
          color: #22c55e;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          padding: 28px;
          border-radius: 16px;
          max-width: 520px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 16px;
        }

        .modal-textarea {
          width: 100%;
          height: 120px;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          color: #1f2937;
          resize: none;
          outline: none;
          transition: border-color 0.2s;
        }

        .modal-textarea:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .modal-btn-primary {
          flex: 1;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          padding: 12px;
          border-radius: 10px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
        }

        .modal-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .modal-btn-secondary {
          padding: 12px 24px;
          background: #f3f4f6;
          color: #6b7280;
          border-radius: 10px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-btn-secondary:hover {
          background: #e5e7eb;
        }
      `}</style>
    </>
  )
}