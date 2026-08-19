import { NextResponse } from "next/server"
import { getConnection } from "@/lib/db"

export const runtime = 'nodejs'

// イベント削除
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let connection
  try {
    const { id } = await params

    connection = await getConnection()
    await connection.execute("DELETE FROM calendar_events WHERE id = ?", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Calendar delete error:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}
