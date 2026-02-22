// app/api/board/route.ts
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

    const board = await prisma.board.findFirst({
      where: { userId: decoded.userId }
    })

    return NextResponse.json({ 
      content: board?.content || '', 
      isPinned: board?.isPinned || false 
    })
  } catch (error) {
    console.error('Board fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch board' }, { status: 500 })
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

    const { content, isPinned } = await request.json()

    const board = await prisma.board.upsert({
      where: { userId: decoded.userId },
      update: { 
        content, 
        isPinned,
        updatedAt: new Date()
      },
      create: { 
        userId: decoded.userId,
        content, 
        isPinned 
      }
    })

    return NextResponse.json({ success: true, board })
  } catch (error) {
    console.error('Board save error:', error)
    return NextResponse.json({ error: 'Failed to save board' }, { status: 500 })
  }
}