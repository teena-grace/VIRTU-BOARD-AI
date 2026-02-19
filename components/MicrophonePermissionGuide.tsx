// components/MicrophonePermissionGuide.tsx
'use client'

import { useState } from 'react'

interface MicrophonePermissionGuideProps {
  onClose: () => void
}

export default function MicrophonePermissionGuide({ onClose }: MicrophonePermissionGuideProps) {
  const [browser, setBrowser] = useState<string>('chrome')

  const detectBrowser = () => {
    const ua = navigator.userAgent
    if (ua.includes('Firefox')) return 'firefox'
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'safari'
    if (ua.includes('Edg')) return 'edge'
    return 'chrome'
  }

  useState(() => {
    setBrowser(detectBrowser())
  })

  return (
    <div className="permission-modal-overlay" onClick={onClose}>
      <div className="permission-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">🎤 Enable Microphone Access</h2>
        
        <div className="steps-container">
          {browser === 'chrome' || browser === 'edge' ? (
            <>
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <strong>Look for the 🔒 lock icon</strong> in your address bar (next to the URL)
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <strong>Click it</strong> and find <strong>"Microphone"</strong> in the permissions list
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  Change to <strong>"Allow"</strong>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <strong>Refresh this page</strong> (press F5)
                </div>
              </div>
            </>
          ) : browser === 'firefox' ? (
            <>
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  Click the <strong>🔒 lock icon</strong> in the address bar
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  Click <strong>"More Information"</strong> → <strong>"Permissions"</strong> tab
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  Find <strong>"Use Microphone"</strong> and uncheck "Use Default", then check <strong>"Allow"</strong>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <strong>Refresh the page</strong>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  Go to <strong>Safari</strong> → <strong>Settings for This Website</strong>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  Set <strong>Microphone</strong> to <strong>"Allow"</strong>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <strong>Refresh the page</strong>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="tips-box">
          <strong>💡 Tips:</strong>
          <ul>
            <li>Make sure your microphone is connected</li>
            <li>Check that no other app is using your microphone</li>
            <li>Try restarting your browser if it still doesn't work</li>
          </ul>
        </div>

        <button onClick={onClose} className="close-btn">
          Got it!
        </button>
      </div>

      <style jsx>{`
        .permission-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .permission-modal {
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
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

        .modal-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 24px;
          text-align: center;
        }

        .steps-container {
          margin-bottom: 24px;
        }

        .step {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
          align-items: flex-start;
        }

        .step-number {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }

        .step-content {
          flex: 1;
          font-size: 15px;
          line-height: 1.6;
          color: #4b5563;
          padding-top: 4px;
        }

        .step-content strong {
          color: #1f2937;
          font-weight: 600;
        }

        .tips-box {
          background: #f0fdf4;
          border: 2px solid #22c55e;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .tips-box strong {
          color: #166534;
          display: block;
          margin-bottom: 8px;
        }

        .tips-box ul {
          margin: 0;
          padding-left: 20px;
          color: #15803d;
        }

        .tips-box li {
          margin: 4px 0;
          font-size: 14px;
        }

        .close-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .close-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
        }
      `}</style>
    </div>
  )
}