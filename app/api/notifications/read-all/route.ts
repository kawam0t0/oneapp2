import { NextResponse } from "next/server"
import { getConnection } from "@/lib/db"

export const runtime = 'nodejs'

// 全てのお知らせを既読にする
export async function POST() {
  let connection
  try {
    connection = await getConnection()

    await connection.execute("UPDATE notifications SET is_read = true WHERE is_read = false")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Mark all read error:", error)
    return NextResponse.json({ error: "Failed to mark all as read" }, { status: 500 })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}
