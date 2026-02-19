// components/Header.tsx
'use client'

import React, { useState, useEffect } from 'react'

interface HeaderProps {
  isListening: boolean
  timeLeft: number
  listeningFor: 'write' | 'clean' | null
}

interface CurrentLecture {
  id: string
  subject: string
  teacher: string
  time: string
  room: string
  status: 'active' | 'upcoming' | 'completed'
}

export default function Header({ isListening, timeLeft, listeningFor }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentLecture, setCurrentLecture] = useState<CurrentLecture | null>(null)
  const [nextLecture, setNextLecture] = useState<CurrentLecture | null>(null)
  const [attendanceMarked, setAttendanceMarked] = useState(false)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)

  // Mock schedule data - Replace with real data from your API
  const schedule: CurrentLecture[] = [
    {
      id: '1',
      subject: 'Data Structures',
      teacher: 'Dr. Smith',
      time: '9:00 AM',
      room: 'Room 101',
      status: 'active'
    },
    {
      id: '2',
      subject: 'Machine Learning',
      teacher: 'Prof. Johnson',
      time: '11:00 AM',
      room: 'Lab 203',
      status: 'upcoming'
    },
    {
      id: '3',
      subject: 'Web Development',
      teacher: 'Dr. Williams',
      time: '2:00 PM',
      room: 'Room 305',
      status: 'upcoming'
    }
  ]

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Determine current and next lecture
  useEffect(() => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinute

    // Parse time and find current/next lecture
    const lecturesWithTime = schedule.map(lecture => {
      const [time, period] = lecture.time.split(' ')
      const [hours, minutes] = time.split(':').map(Number)
      let totalMinutes = hours * 60 + minutes
      
      if (period === 'PM' && hours !== 12) {
        totalMinutes += 12 * 60
      } else if (period === 'AM' && hours === 12) {
        totalMinutes = minutes
      }

      return {
        ...lecture,
        timeInMinutes: totalMinutes
      }
    })

    // Sort by time
    lecturesWithTime.sort((a, b) => a.timeInMinutes - b.timeInMinutes)

    // Find current lecture (within 60 minutes window)
    const current = lecturesWithTime.find(lecture => 
      currentTimeInMinutes >= lecture.timeInMinutes && 
      currentTimeInMinutes < lecture.timeInMinutes + 60
    )

    // Find next lecture
    const next = lecturesWithTime.find(lecture => 
      lecture.timeInMinutes > currentTimeInMinutes
    )

    setCurrentLecture(current || null)
    setNextLecture(next || null)

    // Check if attendance was marked in localStorage
    if (current) {
      const marked = localStorage.getItem(`attendance_${current.id}_${now.toDateString()}`)
      setAttendanceMarked(marked === 'true')
    }
  }, [currentTime])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleMarkAttendance = () => {
    if (currentLecture) {
      const today = new Date().toDateString()
      localStorage.setItem(`attendance_${currentLecture.id}_${today}`, 'true')
      setAttendanceMarked(true)
      setShowAttendanceModal(false)
      
      // You can also send to backend here
      fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lectureId: currentLecture.id,
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.error('Attendance sync failed:', err))
    }
  }

  return (
    <header className="header">
      <div className="header-main">
        <div className="header-left">
          <h1 className="header-title">
            <span className="header-icon">🎓</span>
            VIRTU-BOARD AI
          </h1>
          
          {isListening && (
            <div className="listening-indicator">
              <div className="pulse-dot"></div>
              <span className="listening-text">
                {timeLeft > 0 
                  ? `🎤 Listening... Auto-stop in ${timeLeft}s`
                  : '🎤 Listening... Start speaking'}
              </span>
              {listeningFor && (
                <span className="listening-mode">
                  ({listeningFor === 'write' ? 'Note Mode' : 'Clean Mode'})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Live Clock */}
        <div className="live-clock">
          <div className="clock-time">{formatTime(currentTime)}</div>
          <div className="clock-date">{formatDate(currentTime)}</div>
        </div>
      </div>

      {/* Info Bar - Lecture and Attendance */}
      <div className="info-bar">
        {/* Current Lecture */}
        {currentLecture ? (
          <div className="lecture-info active-lecture">
            <div className="lecture-badge">
              <i className="fas fa-circle pulse-indicator"></i>
              <span>LIVE NOW</span>
            </div>
            <div className="lecture-details">
              <div className="lecture-subject">{currentLecture.subject}</div>
              <div className="lecture-meta">
                <span><i className="fas fa-user-tie"></i> {currentLecture.teacher}</span>
                <span><i className="fas fa-door-open"></i> {currentLecture.room}</span>
                <span><i className="fas fa-clock"></i> {currentLecture.time}</span>
              </div>
            </div>
            
            {/* Attendance Button */}
            {!attendanceMarked ? (
              <button 
                onClick={() => setShowAttendanceModal(true)}
                className="attendance-btn mark-btn"
              >
                <i className="fas fa-check-circle"></i>
                Mark Attendance
              </button>
            ) : (
              <div className="attendance-marked">
                <i className="fas fa-check-double"></i>
                Present
              </div>
            )}
          </div>
        ) : nextLecture ? (
          <div className="lecture-info next-lecture">
            <div className="lecture-badge upcoming">
              <i className="fas fa-clock"></i>
              <span>NEXT CLASS</span>
            </div>
            <div className="lecture-details">
              <div className="lecture-subject">{nextLecture.subject}</div>
              <div className="lecture-meta">
                <span><i className="fas fa-user-tie"></i> {nextLecture.teacher}</span>
                <span><i className="fas fa-door-open"></i> {nextLecture.room}</span>
                <span><i className="fas fa-clock"></i> {nextLecture.time}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="lecture-info no-lecture">
            <i className="fas fa-calendar-check"></i>
            <span>No classes scheduled for today</span>
          </div>
        )}
      </div>

      {/* Attendance Confirmation Modal */}
      {showAttendanceModal && currentLecture && (
        <div className="attendance-modal-overlay" onClick={() => setShowAttendanceModal(false)}>
          <div className="attendance-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <i className="fas fa-user-check"></i>
            </div>
            <h3>Mark Attendance</h3>
            <p>Confirm your attendance for:</p>
            <div className="modal-lecture-info">
              <strong>{currentLecture.subject}</strong>
              <span>{currentLecture.teacher} • {currentLecture.room}</span>
              <span className="time-stamp">
                <i className="fas fa-clock"></i>
                {formatTime(currentTime)}
              </span>
            </div>
            <div className="modal-actions">
              <button onClick={handleMarkAttendance} className="confirm-btn">
                <i className="fas fa-check"></i>
                Confirm Attendance
              </button>
              <button onClick={() => setShowAttendanceModal(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .header {
          margin-bottom: 24px;
        }

        .header-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .header-title {
          font-size: 28px;
          font-weight: 800;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon {
          font-size: 32px;
        }

        /* Live Clock */
        .live-clock {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          padding: 12px 20px;
          border-radius: 12px;
          text-align: right;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .clock-time {
          font-size: 24px;
          font-weight: 700;
          color: #22c55e;
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
        }

        .clock-date {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 2px;
        }

        /* Listening Indicator */
        .listening-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          padding: 12px 20px;
          border-radius: 24px;
          border: 2px solid #22c55e;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .pulse-dot {
          width: 12px;
          height: 12px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        .listening-text {
          font-size: 14px;
          font-weight: 600;
          color: #166534;
        }

        .listening-mode {
          font-size: 12px;
          color: #15803d;
          font-weight: 500;
        }

        /* Info Bar - Lecture & Attendance */
        .info-bar {
          background: white;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 2px solid #f3f4f6;
        }

        .lecture-info {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .lecture-info.no-lecture {
          justify-content: center;
          color: #6b7280;
          font-size: 14px;
          gap: 8px;
        }

        .lecture-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .active-lecture .lecture-badge {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }

        .lecture-badge.upcoming {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }

        .pulse-indicator {
          font-size: 8px;
          animation: pulse 1.5s infinite;
        }

        .lecture-details {
          flex: 1;
          min-width: 200px;
        }

        .lecture-subject {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 6px;
        }

        .lecture-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          font-size: 13px;
          color: #6b7280;
        }

        .lecture-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .lecture-meta i {
          color: #9ca3af;
          font-size: 12px;
        }

        /* Attendance Button */
        .attendance-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
        }

        .mark-btn {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
        }

        .mark-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
        }

        .attendance-marked {
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          color: #166534;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 2px solid #22c55e;
        }

        /* Attendance Modal */
        .attendance-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease;
        }

        .attendance-modal {
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 400px;
          width: 90%;
          text-align: center;
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

        .modal-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 28px;
          color: white;
        }

        .attendance-modal h3 {
          font-size: 22px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .attendance-modal p {
          color: #6b7280;
          margin-bottom: 16px;
        }

        .modal-lecture-info {
          background: #f9fafb;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .modal-lecture-info strong {
          color: #1f2937;
          font-size: 16px;
        }

        .modal-lecture-info span {
          color: #6b7280;
          font-size: 14px;
        }

        .time-stamp {
          color: #22c55e !important;
          font-weight: 600;
          margin-top: 4px;
        }

        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .confirm-btn {
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

        .confirm-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
        }

        .cancel-btn {
          width: 100%;
          padding: 12px;
          background: #f3f4f6;
          color: #6b7280;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-btn:hover {
          background: #e5e7eb;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-main {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-title {
            font-size: 22px;
          }

          .live-clock {
            width: 100%;
            text-align: center;
          }

          .listening-indicator {
            width: 100%;
            justify-content: center;
          }

          .lecture-info {
            flex-direction: column;
            align-items: flex-start;
          }

          .attendance-btn,
          .attendance-marked {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </header>
  )
}
