import mysql from "mysql2/promise"
import { NextResponse } from "next/server"

const getConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST || "34.67.209.187",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "your_username",
    password: process.env.DB_PASSWORD || "your_password",
    database: process.env.DB_NAME || "your_database",
    ssl: {
      rejectUnauthorized: false,
    },
  })
}

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
