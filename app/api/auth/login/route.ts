import { NextRequest, NextResponse } from "next/server"

const users: any[] = []

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const user = users.find(u => u.email === email && u.password === password)

  if (!user) {
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set("session", email)
  return res
}
