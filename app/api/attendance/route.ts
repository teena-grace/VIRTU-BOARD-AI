// app/api/attendance/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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

    const { lectureId, timestamp } = await request.json()

    if (!lectureId) {
      return NextResponse.json({ error: 'Lecture ID required' }, { status: 400 })
    }

    // Check if attendance already marked
    const existing = await prisma.attendance.findFirst({
      where: {
        userId: decoded.userId,
        lectureId,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })

    if (existing) {
      return NextResponse.json({ 
        success: true, 
        message: 'Attendance already marked',
        attendance: existing 
      })
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        userId: decoded.userId,
        lectureId,
        date: new Date(timestamp || Date.now()),
        status: 'PRESENT'
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Attendance marked successfully',
      attendance 
    })
  } catch (error) {
    console.error('Attendance marking error:', error)
    return NextResponse.json({ error: 'Failed to mark attendance' }, { status: 500 })
  }
}

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

    const url = new URL(request.url)
    const lectureId = url.searchParams.get('lectureId')

    const where: any = { userId: decoded.userId }
    if (lectureId) {
      where.lectureId = lectureId
    }

    const attendanceRecords = await prisma.attendance.findMany({
      where,
      include: {
        lecture: true
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({ attendance: attendanceRecords })
  } catch (error) {
    console.error('Attendance fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 })
  }
}