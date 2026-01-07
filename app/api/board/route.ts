import { NextRequest, NextResponse } from 'next/server'

interface BoardData {
  content: string
  lastUpdated: string
}

let boardData: BoardData = {
  content: '',
  lastUpdated: new Date().toISOString()
}

export async function GET() {
  return NextResponse.json(boardData)
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()
    
    boardData = {
      content,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json({ 
      success: true, 
      data: boardData 
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}