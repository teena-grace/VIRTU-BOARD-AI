// proxy.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export function proxy(request: NextRequest) {
  const token =
    request.cookies.get('token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '')

  const path = request.nextUrl.pathname

  // Allow public routes
  const publicRoutes = ['/login', '/register', '/']
  const isPublic = publicRoutes.some(route =>
    path.startsWith(route)
  )

  if (isPublic) {
    return NextResponse.next()
  }

  // 🔒 Protect dashboard
  if (path.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
