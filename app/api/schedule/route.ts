import { NextRequest, NextResponse } from 'next/server'
import type { Lecture } from '@/types'

let schedule: Lecture[] = [
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

export async function GET() {
  // Simulate real-time status updates
  const now = new Date()
  const currentHour = now.getHours()
  
  const updatedSchedule = schedule.map(lecture => {
    const [time, period] = lecture.time.split(' ')
    const [hours] = time.split(':').map(Number)
    const lectureHour = period === 'PM' && hours !== 12 ? hours + 12 : hours
    
    if (currentHour > lectureHour + 1) {
      return { ...lecture, status: 'completed' as const }
    } else if (currentHour === lectureHour || currentHour === lectureHour + 1) {
      return { ...lecture, status: 'active' as const }
    } else {
      return { ...lecture, status: 'upcoming' as const }
    }
  })

  return NextResponse.json({ schedule: updatedSchedule })
}

export async function POST(request: NextRequest) {
  try {
    const newLecture: Lecture = await request.json()
    schedule.push({
      ...newLecture,
      id: `${Date.now()}`
    })
    
    return NextResponse.json({ 
      success: true, 
      schedule 
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}