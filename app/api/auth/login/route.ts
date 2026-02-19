// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { verifyPassword, generateToken } from '@/lib/auth'  // ✅ Add this import
import { prisma } from '@/lib/prisma'  // ✅ Add this import

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (user.role !== role) {
      return NextResponse.json(
        { error: 'Invalid user type selected' },
        { status: 403 }
      )
    }

    const token = generateToken(user.id, user.role)

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}