'use client'

interface CleanPanelProps {
  boardUsage: number
  onCleanOption: (type: string) => void
}

export default function CleanPanel({ boardUsage, onCleanOption }: CleanPanelProps) {
  const getUsageColor = () => {
    if (boardUsage < 50) return '#32cd32'
    if (boardUsage < 75) return '#ffa500'
    return '#ff4444'
  }

  const getUsageLabel = () => {
    if (boardUsage < 50) return 'Good Space'
    if (boardUsage < 75) return 'Getting Full'
    return 'Almost Full!'
  }

  const handleCleanClick = (type: string, e: React.MouseEvent) => {
    e.preventDefault()
    
    // Show confirmation for 'all' type
    if (type === 'all') {
      if (window.confirm('Are you sure you want to clear everything?')) {
        onCleanOption(type)
      }
    } else {
      onCleanOption(type)
    }
  }

  return (
    <div className="clean-panel">
      <h2 className="panel-title">
        <i className="fas fa-sparkles"></i>
        Smart Clean AI
      </h2>

      <div className="usage-indicator">
        <div className="usage-header">
          <p className="usage-text">
            <i className="fas fa-chart-line"></i> Board Usage Level
          </p>
          <span className="usage-label" style={{ color: getUsageColor() }}>
            {getUsageLabel()}
          </span>
        </div>
        <div className="usage-bar">
          <div 
            className="usage-fill" 
            style={{ 
              width: `${boardUsage}%`,
              background: `linear-gradient(90deg, ${getUsageColor()}, ${getUsageColor()}dd)`
            }}
          >
            <span className="usage-percentage">{Math.round(boardUsage)}%</span>
          </div>
        </div>
      </div>

      {boardUsage > 70 && (
        <div className="alert-box animate-pulse">
          <p>
            <i className="fas fa-exclamation-triangle"></i>
            <strong>Suggested Action:</strong> Consider cleaning to maintain performance
          </p>
        </div>
      )}

      <div className="clean-options">
        <button 
          className="clean-option" 
          onClick={(e) => handleCleanClick('algorithms', e)}
        >
          <i className="fas fa-code"></i>
          <div>
            <strong>Clean Algorithms Section</strong>
            <span className="option-desc">Remove algorithm-related content</span>
          </div>
        </button>
        
        <button 
          className="clean-option" 
          onClick={(e) => handleCleanClick('diagrams', e)}
        >
          <i className="fas fa-project-diagram"></i>
          <div>
            <strong>Clear Old Diagrams</strong>
            <span className="option-desc">Remove diagram elements</span>
          </div>
        </button>
        
        <button 
          className="clean-option" 
          onClick={(e) => handleCleanClick('unpinned', e)}
        >
          <i className="fas fa-filter"></i>
          <div>
            <strong>Keep Only Pinned</strong>
            <span className="option-desc">Clear all non-pinned content</span>
          </div>
        </button>
        
        <button 
          className="clean-option danger" 
          onClick={(e) => handleCleanClick('all', e)}
        >
          <i className="fas fa-trash-alt"></i>
          <div>
            <strong>Clear Everything</strong>
            <span className="option-desc">Remove all content from board</span>
          </div>
        </button>
      </div>

      <div className="voice-commands">
        <p className="voice-title">
          <i className="fas fa-microphone-alt"></i> Voice Commands
        </p>
        <div className="voice-command-list">
          <div className="voice-command">
            <i className="fas fa-quote-left"></i>
            <span>"Clean algorithms"</span>
          </div>
          <div className="voice-command">
            <i className="fas fa-quote-left"></i>
            <span>"Clear diagrams"</span>
          </div>
          <div className="voice-command">
            <i className="fas fa-quote-left"></i>
            <span>"Keep pinned only"</span>
          </div>
          <div className="voice-command">
            <i className="fas fa-quote-left"></i>
            <span>"Clear everything"</span>
          </div>
        </div>
      </div>
    </div>
  )
}