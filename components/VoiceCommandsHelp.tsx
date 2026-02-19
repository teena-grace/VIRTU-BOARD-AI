// components/VoiceCommandsHelp.tsx
'use client'

import { VoiceCommandParser } from '@/lib/voiceCommands'

interface VoiceCommandsHelpProps {
  onClose: () => void
}

export default function VoiceCommandsHelp({ onClose }: VoiceCommandsHelpProps) {
  const categories = [
    { key: 'board', title: '📋 Board Commands', icon: '📋', color: '#3b82f6' },
    { key: 'ai', title: '🤖 AI Commands', icon: '🤖', color: '#22c55e' },
    { key: 'content', title: '✍️ Content Commands', icon: '✍️', color: '#f59e0b' },
    { key: 'navigation', title: '🧭 Navigation Commands', icon: '🧭', color: '#8b5cf6' },
    { key: 'system', title: '⚙️ System Commands', icon: '⚙️', color: '#ef4444' }
  ]

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
          <h2>🎤 Voice Commands Guide</h2>
          <button onClick={onClose} className="close-btn-x">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="help-intro">
          <p>Control everything on VirtuBoard using your voice!</p>
          <div className="quick-tips">
            <span>💡 Speak clearly</span>
            <span>⚡ Commands process in 2 seconds</span>
            <span>🎯 Use natural language</span>
          </div>
        </div>

        <div className="commands-container">
          {categories.map(category => {
            const commands = VoiceCommandParser.getCommandsByCategory(category.key)
            return (
              <div key={category.key} className="command-category">
                <div 
                  className="category-header" 
                  style={{ background: `linear-gradient(135deg, ${category.color}dd 0%, ${category.color} 100%)` }}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-title">{category.title}</span>
                  <span className="command-count">{commands.length}</span>
                </div>
                
                <div className="command-list">
                  {commands.map((cmd, idx) => (
                    <div key={idx} className="command-item">
                      <div className="command-description">{cmd.description}</div>
                      <div className="command-examples">
                        {cmd.patterns.slice(0, 2).map((pattern, i) => (
                          <code key={i} className="command-example">
                            "{pattern.source.replace(/[\\^$.*+?()[\]{}|]/g, '').replace(/i$/, '')}"
                          </code>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="help-footer">
          <button onClick={onClose} className="got-it-btn">
            <i className="fas fa-check"></i>
            Got it! Let me try
          </button>
        </div>
      </div>

      <style jsx>{`
        .help-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .help-modal {
          background: white;
          border-radius: 16px;
          max-width: 900px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .help-header {
          padding: 24px 32px;
          border-bottom: 2px solid #f3f4f6;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
        }

        .help-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .close-btn-x {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: #f3f4f6;
          color: #6b7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-btn-x:hover {
          background: #e5e7eb;
          color: #1f2937;
        }

        .help-intro {
          padding: 20px 32px;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-bottom: 2px solid #22c55e;
        }

        .help-intro p {
          font-size: 16px;
          color: #166534;
          margin: 0 0 12px 0;
          font-weight: 500;
        }

        .quick-tips {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .quick-tips span {
          background: white;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          color: #15803d;
          font-weight: 600;
          border: 1px solid #22c55e;
        }

        .commands-container {
          padding: 24px 32px;
        }

        .command-category {
          margin-bottom: 24px;
          border: 2px solid #f3f4f6;
          border-radius: 12px;
          overflow: hidden;
        }

        .category-header {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
        }

        .category-icon {
          font-size: 20px;
        }

        .category-title {
          flex: 1;
          font-size: 16px;
          font-weight: 700;
        }

        .command-count {
          background: rgba(255, 255, 255, 0.3);
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
        }

        .command-list {
          padding: 16px;
        }

        .command-item {
          padding: 12px;
          margin-bottom: 8px;
          background: #f9fafb;
          border-radius: 8px;
          border-left: 3px solid #e5e7eb;
        }

        .command-item:hover {
          background: #f3f4f6;
          border-left-color: #22c55e;
        }

        .command-description {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .command-examples {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .command-example {
          background: #1f2937;
          color: #22c55e;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-family: 'Courier New', monospace;
          border: 1px solid #374151;
        }

        .help-footer {
          padding: 20px 32px;
          border-top: 2px solid #f3f4f6;
          position: sticky;
          bottom: 0;
          background: white;
        }

        .got-it-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .got-it-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
        }

        @media (max-width: 768px) {
          .help-header,
          .help-intro,
          .commands-container,
          .help-footer {
            padding-left: 20px;
            padding-right: 20px;
          }

          .command-examples {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}