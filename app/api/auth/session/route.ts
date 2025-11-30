import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const sessionData = JSON.parse(session.value)
    return NextResponse.json({
      authenticated: true,
      ...sessionData,
    })
  } catch (error) {
    console.error("[v0] Session error:", error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
