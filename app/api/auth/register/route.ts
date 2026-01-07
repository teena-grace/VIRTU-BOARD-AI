import { NextRequest, NextResponse } from "next/server"

const users: any[] = []

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  users.push({ email, password })
  return NextResponse.json({ success: true })
}
