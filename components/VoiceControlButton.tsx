// components/VoiceControlButton.tsx
'use client'

interface VoiceControlButtonProps {
  isActive: boolean
  onToggle: () => void
  timeLeft: number
}

export default function VoiceControlButton({ 
  isActive, 
  onToggle, 
  timeLeft 
}: VoiceControlButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`voice-control-btn ${isActive ? 'active' : ''}`}
      title={isActive ? 'Stop Voice Control' : 'Start Voice Control'}
    >
      {isActive ? (
        <>
          <div className="pulse-ring"></div>
          <i className="fas fa-microphone"></i>
          {timeLeft > 0 && <span className="timer">{timeLeft}s</span>}
        </>
      ) : (
        <>
          <i className="fas fa-microphone-slash"></i>
          <span className="btn-text">Voice Control</span>
        </>
      )}

      <style jsx>{`
        .voice-control-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          color: white;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          z-index: 999;
          overflow: hidden;
        }

        .voice-control-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
        }

        .voice-control-btn.active {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          width: 140px;
          border-radius: 32px;
          gap: 8px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(239, 68, 68, 0.5);
          }
          50% {
            box-shadow: 0 8px 32px rgba(239, 68, 68, 0.8);
          }
        }

        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 3px solid #ef4444;
          animation: pulseRing 1.5s infinite;
        }

        @keyframes pulseRing {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .btn-text {
          font-size: 14px;
          font-weight: 600;
          margin-left: 4px;
        }

        .timer {
          position: absolute;
          top: 4px;
          right: 8px;
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .voice-control-btn {
            bottom: 80px;
            right: 16px;
            width: 56px;
            height: 56px;
            font-size: 20px;
          }

          .voice-control-btn.active {
            width: 120px;
          }

          .btn-text {
            font-size: 12px;
          }
        }
      `}</style>
    </button>
  )
}