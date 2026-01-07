'use client'

import { useState } from 'react'
import type { Lecture } from '@/types'

interface TimetableSectionProps {
  schedule?: Lecture[]
  onRefresh?: () => void
}

const defaultSchedule: Lecture[] = [
  {
    id: '1',
    time: '09:00 AM',
    subject: 'Data Structures',
    room: 'CS-301',
    status: 'completed',
    professor: 'Dr. Smith'
  },
  {
    id: '2',
    time: '11:00 AM',
    subject: 'Operating Systems',
    room: 'CS-302',
    status: 'active',
    professor: 'Dr. Johnson'
  },
  {
    id: '3',
    time: '02:00 PM',
    subject: 'Database Management',
    room: 'CS-303',
    status: 'upcoming',
    professor: 'Dr. Williams'
  },
  {
    id: '4',
    time: '04:00 PM',
    subject: 'Algorithm Design',
    room: 'CS-304',
    status: 'upcoming',
    professor: 'Dr. Brown'
  }
]

export default function TimetableSection({ 
  schedule = defaultSchedule,
  onRefresh 
}: TimetableSectionProps) {
  const [selectedDay, setSelectedDay] = useState<string>('today')
  const [view, setView] = useState<'list' | 'grid'>('list')

  const getStatusBadge = (status: Lecture['status']): string => {
    const badges = {
      active: 'status-active',
      upcoming: 'status-upcoming',
      completed: 'status-completed'
    }
    return badges[status]
  }

  const getStatusText = (status: Lecture['status']): string => {
    const texts = {
      active: 'Active Now',
      upcoming: 'Upcoming',
      completed: 'Completed'
    }
    return texts[status]
  }

  const getStatusIcon = (status: Lecture['status']): string => {
    const icons = {
      active: 'fa-play-circle',
      upcoming: 'fa-clock',
      completed: 'fa-check-circle'
    }
    return icons[status]
  }

  return (
    <div className="timetable-section">
      <div className="timetable-header">
        <h2>
          <i className="fas fa-calendar-alt"></i> Today's Schedule
        </h2>
        <div className="timetable-controls">
          <div className="day-selector">
            <button 
              className={`day-btn ${selectedDay === 'today' ? 'active' : ''}`}
              onClick={() => setSelectedDay('today')}
            >
              <i className="fas fa-calendar-day"></i> Today
            </button>
            <button 
              className={`day-btn ${selectedDay === 'tomorrow' ? 'active' : ''}`}
              onClick={() => setSelectedDay('tomorrow')}
            >
              <i className="fas fa-calendar-plus"></i> Tomorrow
            </button>
            <button 
              className={`day-btn ${selectedDay === 'week' ? 'active' : ''}`}
              onClick={() => setSelectedDay('week')}
            >
              <i className="fas fa-calendar-week"></i> Week
            </button>
          </div>
          {onRefresh && (
            <button className="refresh-btn" onClick={onRefresh}>
              <i className="fas fa-sync-alt"></i>
            </button>
          )}
        </div>
      </div>

      <div className="lecture-slots">
        {schedule.map((lecture) => (
          <div key={lecture.id} className={`lecture-slot ${lecture.status}`}>
            <div className="slot-time">
              <i className="fas fa-clock"></i>
              <span>{lecture.time}</span>
            </div>
            <div className="slot-info">
              <div className="slot-subject">{lecture.subject}</div>
              <div className="slot-details">
                <span className="slot-room">
                  <i className="fas fa-map-marker-alt"></i> {lecture.room}
                </span>
                {lecture.professor && (
                  <span className="slot-professor">
                    <i className="fas fa-user-tie"></i> {lecture.professor}
                  </span>
                )}
              </div>
            </div>
            <div className="slot-status">
              <span className={`status-badge ${getStatusBadge(lecture.status)}`}>
                <i className={`fas ${getStatusIcon(lecture.status)}`}></i>
                {getStatusText(lecture.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}