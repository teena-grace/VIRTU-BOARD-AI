// app/api/schedule/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get lectures for the user
    const lectures = await prisma.lecture.findMany({
      where: {
        OR: [
          { userId: decoded.userId },
          { isPublic: true }
        ]
      },
      orderBy: { time: 'asc' }
    })

    // If no lectures, return demo schedule
    if (lectures.length === 0) {
      return NextResponse.json({
        schedule: [
          {
            id: '1',
            subject: 'Data Structures',
            teacher: 'Dr. Smith',
            time: '9:00 AM',
            room: 'Room 101',
            status: 'upcoming'
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
      })
    }

    return NextResponse.json({ schedule: lectures })
  } catch (error) {
    console.error('Schedule fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { subject, teacher, time, room, isPublic } = await request.json()

    const lecture = await prisma.lecture.create({
      data: {
        userId: decoded.userId,
        subject,
        teacher,
        time,
        room,
        isPublic: isPublic || false
      }
    })

    return NextResponse.json({ success: true, lecture })
  } catch (error) {
    console.error('Lecture creation error:', error)
    return NextResponse.json({ error: 'Failed to create lecture' }, { status: 500 })
  }
}