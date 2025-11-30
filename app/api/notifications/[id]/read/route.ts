import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

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
