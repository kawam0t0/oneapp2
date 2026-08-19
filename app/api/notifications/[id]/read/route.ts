import { NextResponse } from "next/server"
import { getConnection } from "@/lib/db"

export const runtime = 'nodejs'

// 個別の通知を既読にする
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let connection
  try {
    const { id } = await params
    connection = await getConnection()

    await connection.execute("UPDATE notifications SET is_read = true WHERE id = ?", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Mark notification as read error:", error)
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}
